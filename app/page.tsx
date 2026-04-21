import StoreList from '@/components/stores/StoreList'
import StoreMapWrapper from '@/components/stores/StoreMapWrapper'
import FilterBar from '@/components/FilterBar'
import { getStores, getAndIncrementVisits } from '@/lib/data'
import { Suspense } from 'react'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; region?: string; view?: string }>
}) {
  const { category, region, view } = await searchParams

  const [stores, totalVisits] = await Promise.all([
    getStores(category, region),
    getAndIncrementVisits(),
  ])
  const isMapView = view === 'map'

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Suspense>
        <FilterBar totalVisits={totalVisits} />
      </Suspense>
      {isMapView ? (
        <StoreMapWrapper stores={stores} kakaoKey={process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? ''} />
      ) : (
        <StoreList stores={stores} />
      )}
    </div>
  )
}
