import { createClient } from '@/lib/supabase/server'
import StoreList from '@/components/stores/StoreList'
import StoreMapWrapper from '@/components/stores/StoreMapWrapper'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; region?: string; view?: string }>
}) {
  const { category, region, view } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('stores')
    .select('*')
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category', category)
  if (region) query = query.eq('region', region)

  const { data: stores } = await query

  const isMapView = view === 'map'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {isMapView ? (
        <StoreMapWrapper stores={stores ?? []} kakaoKey={process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? ''} />
      ) : (
        <StoreList stores={stores ?? []} />
      )}
    </div>
  )
}
