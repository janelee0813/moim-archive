import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DeleteStoreButton from '@/components/stores/DeleteStoreButton'

export default async function AdminStoresPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/')

  const { data: stores } = await supabase
    .from('stores')
    .select('*, profiles(nickname)')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/admin" className="text-sm text-gray-400 hover:text-black mb-6 block">
        ← 관리자 대시보드
      </Link>
      <h1 className="text-2xl font-bold mb-8">
        가게 관리
        <span className="ml-2 text-base font-normal text-gray-400">{stores?.length ?? 0}개</span>
      </h1>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {/* 데스크탑 헤더 */}
        <div className="hidden sm:grid grid-cols-[1fr_90px_90px_60px_140px_120px] gap-4 px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs text-gray-400 font-medium">
          <span>가게 이름</span>
          <span>카테고리</span>
          <span>지역</span>
          <span>별점</span>
          <span>등록자</span>
          <span></span>
        </div>

        {!stores?.length ? (
          <div className="px-4 py-8 text-center text-sm text-gray-400">
            등록된 가게가 없어요.
          </div>
        ) : (
          stores.map(store => (
            <div key={store.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
              {/* 데스크탑 레이아웃 */}
              <div className="hidden sm:grid grid-cols-[1fr_90px_90px_60px_140px_120px] gap-4 px-4 py-3 items-center">
                <Link href={`/stores/${store.id}`} className="text-sm font-medium text-gray-900 truncate hover:underline">
                  {store.name}
                </Link>
                <span className="text-xs text-gray-500 truncate">{store.category}</span>
                <span className="text-xs text-gray-500 truncate">{store.region}</span>
                <span className="text-xs text-yellow-500">★ {store.rating}</span>
                <span className="text-xs text-gray-400 truncate">{(store.profiles as any)?.nickname ?? '-'}</span>
                <div className="flex gap-1.5">
                  <Link href={`/stores/${store.id}/edit`} className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 whitespace-nowrap">수정</Link>
                  <DeleteStoreButton storeId={store.id} compact />
                </div>
              </div>

              {/* 모바일 레이아웃 */}
              <div className="sm:hidden px-4 py-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Link href={`/stores/${store.id}`} className="text-sm font-medium text-gray-900 truncate hover:underline">
                    {store.name}
                  </Link>
                  <span className="text-xs text-yellow-500 shrink-0">★ {store.rating}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-400">
                    {store.category} · {store.region} · {(store.profiles as any)?.nickname ?? '-'}
                  </span>
                  <div className="flex gap-1.5 shrink-0">
                    <Link href={`/stores/${store.id}/edit`} className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 whitespace-nowrap">수정</Link>
                    <DeleteStoreButton storeId={store.id} compact />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
