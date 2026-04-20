import { createClient } from '@/lib/supabase/server'
import StoreList from '@/components/stores/StoreList'
import StoreMapWrapper from '@/components/stores/StoreMapWrapper'
import Link from 'next/link'

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

const isMapView = view !== 'list'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 뷰 전환 버튼 */}
      <div className="flex justify-end mb-4">
        {isMapView ? (
          <Link
            href={`/?view=list${category ? `&category=${category}` : ''}${region ? `&region=${region}` : ''}`}
            className="px-4 py-1.5 rounded-lg text-sm border hover:border-gray-400 transition-colors"
          >
            📋 리스트 보기
          </Link>
        ) : (
          <Link
            href={`/?${new URLSearchParams({ ...(category && { category }), ...(region && { region }) }).toString()}`}
            className="px-4 py-1.5 rounded-lg text-sm border hover:border-gray-400 transition-colors"
          >
            🗺️ 지도로 보기
          </Link>
        )}
      </div>


      {/* 리스트 or 지도 */}
      {isMapView ? (
        <StoreMapWrapper stores={stores ?? []} kakaoKey={process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? ''} />
      ) : (
        <StoreList stores={stores ?? []} />
      )}
    </div>
  )
}
