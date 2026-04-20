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

  const CATEGORIES = ['술집', '횟집', '고기집', '이자카야', '포차', '카페', '기타']
  const REGIONS = ['강남역', '역삼', '선릉', '삼성', '압구정', '청담', '기타']

  const isMapView = view === 'map'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        {/* 리스트/지도 탭 */}
        <div className="flex gap-2 mb-4">
          <Link
            href={`/?${new URLSearchParams({ ...(category && { category }), ...(region && { region }) }).toString()}`}
            className={`px-4 py-1.5 rounded-lg text-sm border transition-colors ${
              !isMapView ? 'bg-black text-white border-black' : 'hover:border-gray-400'
            }`}
          >
            📋 리스트
          </Link>
          <Link
            href={`/?view=map${category ? `&category=${category}` : ''}${region ? `&region=${region}` : ''}`}
            className={`px-4 py-1.5 rounded-lg text-sm border transition-colors ${
              isMapView ? 'bg-black text-white border-black' : 'hover:border-gray-400'
            }`}
          >
            🗺️ 지도
          </Link>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 flex-wrap mb-3">
          <Link
            href={`/?${new URLSearchParams({ ...(region && { region }), ...(isMapView && { view: 'map' }) }).toString()}`}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              !category ? 'bg-black text-white border-black' : 'hover:border-gray-400'
            }`}
          >
            전체
          </Link>
          {CATEGORIES.map(c => (
            <Link
              key={c}
              href={`/?category=${c}${region ? `&region=${region}` : ''}${isMapView ? '&view=map' : ''}`}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                category === c ? 'bg-black text-white border-black' : 'hover:border-gray-400'
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {/* 지역 필터 */}
        <div className="flex gap-2 flex-wrap">
          <Link
            href={`/?${new URLSearchParams({ ...(category && { category }), ...(isMapView && { view: 'map' }) }).toString()}`}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              !region ? 'bg-gray-100 border-gray-300' : 'hover:border-gray-400'
            }`}
          >
            전체 지역
          </Link>
          {REGIONS.map(r => (
            <Link
              key={r}
              href={`/?region=${r}${category ? `&category=${category}` : ''}${isMapView ? '&view=map' : ''}`}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                region === r ? 'bg-gray-100 border-gray-500' : 'hover:border-gray-400'
              }`}
            >
              {r}
            </Link>
          ))}
        </div>
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