import StoreList from '@/components/stores/StoreList'
import StoreMapWrapper from '@/components/stores/StoreMapWrapper'
import FilterBar from '@/components/FilterBar'
import { getStores } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; region?: string; view?: string }>
}) {
  const { category, region, view } = await searchParams

  const stores = await getStores(category, region)

  const supabase = await createClient()
  const storeIds = (stores as any[]).map(s => s.id)
  const creatorIds = [...new Set((stores as any[]).map(s => s.created_by).filter(Boolean))]
  const profileMap: Record<string, string> = {}
  const favCountMap: Record<string, number> = {}
  const commentCountMap: Record<string, number> = {}

  await Promise.all([
    (async () => {
      if (creatorIds.length === 0) return
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nickname')
        .in('id', creatorIds)
      for (const p of profiles ?? []) profileMap[p.id] = p.nickname
    })(),
    (async () => {
      if (storeIds.length === 0) return
      const { data: favData } = await supabase
        .from('favorites')
        .select('store_id')
        .in('store_id', storeIds)
      for (const f of favData ?? []) {
        favCountMap[f.store_id] = (favCountMap[f.store_id] ?? 0) + 1
      }
    })(),
    (async () => {
      if (storeIds.length === 0) return
      const { data: commentData } = await supabase
        .from('store_comments')
        .select('store_id')
        .in('store_id', storeIds)
      for (const c of commentData ?? []) {
        commentCountMap[c.store_id] = (commentCountMap[c.store_id] ?? 0) + 1
      }
    })(),
  ])

  const enrichedStores = (stores as any[]).map(s => ({
    ...s,
    creatorNickname: profileMap[s.created_by] ?? '',
    favCount: favCountMap[s.id] ?? 0,
    commentCount: commentCountMap[s.id] ?? 0,
  }))

  const isMapView = view === 'map'

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Suspense>
        <FilterBar />
      </Suspense>
      {isMapView ? (
        <StoreMapWrapper stores={enrichedStores} kakaoKey={process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? ''} />
      ) : (
        <StoreList stores={enrichedStores} />
      )}
    </div>
  )
}
