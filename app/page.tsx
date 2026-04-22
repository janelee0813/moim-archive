import StoreList from '@/components/stores/StoreList'
import StoreMapWrapper from '@/components/stores/StoreMapWrapper'
import FilterBar from '@/components/FilterBar'
import { getStores } from '@/lib/data'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Suspense } from 'react'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; region?: string; view?: string }>
}) {
  const { category, region, view } = await searchParams

  const stores = await getStores(category, region)

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const creatorIds = [...new Set((stores as any[]).map(s => s.created_by).filter(Boolean))]
  const profileMap: Record<string, string> = {}
  if (creatorIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, nickname')
      .in('id', creatorIds)
    for (const p of profiles ?? []) profileMap[p.id] = p.nickname
  }
  const enrichedStores = (stores as any[]).map(s => ({
    ...s,
    creatorNickname: profileMap[s.created_by] ?? '',
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
