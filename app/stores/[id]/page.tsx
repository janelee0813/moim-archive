import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import DeleteStoreButton from '@/components/stores/DeleteStoreButton'
import StoreDetailMap from '@/components/stores/StoreDetailMap'
import { getNaverPlaceImages } from '@/lib/naver'

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

  const [{ data: { user } }, images] = await Promise.all([
    supabase.auth.getUser(),
    store.naver_place_url ? getNaverPlaceImages(store.naver_place_url) : Promise.resolve([]),
  ])

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

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* 이미지 */}
        {images.length > 0 && (
          <div className={`grid gap-0.5 h-52 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {images.map((src, i) => (
              <div key={i} className="relative overflow-hidden bg-gray-100">
                {/* 블러 배경 */}
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover scale-110 blur-xl opacity-60"
                  unoptimized
                  aria-hidden
                />
                {/* 실제 이미지 (비율 유지) */}
                <Image
                  src={src}
                  alt={`${store.name} ${i + 1}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}

        <div className="p-6">
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
                <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 지도 */}
          {store.lat && store.lng && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">위치</p>
              <StoreDetailMap
                lat={store.lat}
                lng={store.lng}
                name={store.name}
                kakaoKey={process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? ''}
              />
            </div>
          )}

          <hr className="my-4" />

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>등록자: {(store.profiles as any)?.nickname ?? '알 수 없음'}</span>
            <span>{new Date(store.created_at).toLocaleDateString('ko-KR')}</span>
          </div>

          {(isAdmin || user?.id === store.created_by) && (
            <div className="mt-6 pt-4 border-t flex gap-3">
              <Link
                href={`/stores/${store.id}/edit`}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                수정
              </Link>
              {isAdmin && <DeleteStoreButton storeId={store.id} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
