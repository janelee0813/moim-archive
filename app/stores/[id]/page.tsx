import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DeleteStoreButton from '@/components/stores/DeleteStoreButton'

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: store } = await supabase
    .from('stores')
    .select('*, profiles(nickname)')
    .eq('id', id)
    .single()

  if (!store) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.is_admin ?? false
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-gray-400 hover:text-black mb-6 block">
        ← 목록으로
      </Link>

      <div className="bg-white border rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{store.category}</span>
          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{store.region}</span>
        </div>

        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold">{store.name}</h1>
          <span className="text-lg">⭐ {store.rating}</span>
        </div>

        <p className="text-gray-500 text-sm mb-1">{store.address}</p>

        {store.naver_place_url && (
          <a
            href={store.naver_place_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-600 hover:underline mb-4 block"
          >
            네이버 플레이스에서 보기 →
          </a>
        )}

        <hr className="my-4" />

        <div className="mb-4">
          <p className="text-sm font-medium mb-1">추천 이유</p>
          <p className="text-sm text-gray-600 leading-relaxed">{store.reason}</p>
        </div>

        {store.memo && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">메모</p>
            <p className="text-sm text-gray-600 leading-relaxed">{store.memo}</p>
          </div>
        )}

        {store.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {store.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <hr className="my-4" />

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>등록자: {(store.profiles as any)?.nickname ?? '알 수 없음'}</span>
          <span>{new Date(store.created_at).toLocaleDateString('ko-KR')}</span>
        </div>

        {isAdmin && (
          <div className="mt-6 pt-4 border-t">
            <DeleteStoreButton storeId={store.id} />
          </div>
        )}
      </div>
    </div>
  )
}
