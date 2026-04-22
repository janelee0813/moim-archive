import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import DeleteStoreButton from '@/components/stores/DeleteStoreButton'
import StoreDetailMap from '@/components/stores/StoreDetailMap'
import FavoriteButton from '@/components/stores/FavoriteButton'
import CommentSection from '@/components/stores/CommentSection'
import StoreImages from '@/components/stores/StoreImages'

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // 라운드 1: store + 로그인 사용자 병렬 조회
  const [{ data: store }, { data: { user } }] = await Promise.all([
    supabase.from('stores').select('*, profiles(nickname)').eq('id', id).single(),
    supabase.auth.getUser(),
  ])

  if (!store) notFound()

  // 라운드 2: 나머지 모두 병렬 조회 (네이버 이미지는 Suspense로 분리)
  const [profileRes, favRes, favCountRes, commentsRes] = await Promise.all([
    user
      ? supabase.from('profiles').select('is_admin').eq('id', user.id).single()
      : Promise.resolve({ data: null }),
    user
      ? supabase.from('favorites').select('id').eq('user_id', user.id).eq('store_id', id).single()
      : Promise.resolve({ data: null }),
    supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('store_id', id),
    supabase.from('store_comments').select('id, content, created_at, user_id').eq('store_id', id).order('created_at', { ascending: true }),
  ])

  const isAdmin = (profileRes as any).data?.is_admin ?? false
  const isFavorited = !!(favRes as any).data
  const favCount = (favCountRes as any).count ?? 0
  const commentsRaw = (commentsRes as any).data ?? []

  // 라운드 3: 댓글 작성자 닉네임
  const commentUserIds = [...new Set(commentsRaw.map((c: any) => c.user_id))]
  const commentProfileMap: Record<string, string> = {}
  if (commentUserIds.length > 0) {
    const { data: commentProfiles } = await supabase
      .from('profiles')
      .select('id, nickname')
      .in('id', commentUserIds)
    for (const p of commentProfiles ?? []) commentProfileMap[p.id] = p.nickname
  }

  const comments = commentsRaw.map((c: any) => ({
    id: c.id,
    content: c.content,
    created_at: c.created_at,
    authorNickname: commentProfileMap[c.user_id] ?? '알 수 없음',
    isOwner: c.user_id === user?.id,
  }))

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-gray-400 hover:text-black mb-6 block">
        ← 목록으로
      </Link>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* 네이버 이미지 — Suspense로 분리해서 나머지 페이지 먼저 렌더링 */}
        {store.naver_place_url && (
          <Suspense fallback={<div className="h-52 bg-gray-100 animate-pulse" />}>
            <StoreImages url={store.naver_place_url} name={store.name} />
          </Suspense>
        )}

        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{store.category}</span>
            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{store.region}</span>
          </div>

          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold">{store.name}</h1>
            <div className="flex flex-col items-end gap-1">
              <span className="text-lg">⭐ {store.rating}</span>
              <span className="text-xs text-red-400">♥ {favCount}명이 찜</span>
            </div>
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

          <div className="mt-6 pt-4 border-t flex items-center gap-3">
            {user && (
              <FavoriteButton storeId={store.id} initialFavorited={isFavorited} />
            )}
            {(isAdmin || user?.id === store.created_by) && (
              <>
                <Link
                  href={`/stores/${store.id}/edit`}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  수정
                </Link>
                {isAdmin && <DeleteStoreButton storeId={store.id} />}
              </>
            )}
          </div>

          <CommentSection
            storeId={store.id}
            comments={comments}
            isLoggedIn={!!user}
          />
        </div>
      </div>
    </div>
  )
}
