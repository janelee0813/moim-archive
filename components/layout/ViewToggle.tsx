'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ViewToggle() {
  const searchParams = useSearchParams()
  const isMapView = searchParams.get('view') === 'map'

  const params = new URLSearchParams()
  const category = searchParams.get('category')
  const region = searchParams.get('region')
  if (category) params.set('category', category)
  if (region) params.set('region', region)

  if (isMapView) {
    return (
      <Link
        href={`/?${params.toString()}`}
        className="text-gray-500 hover:text-gray-900 transition-colors text-sm"
      >
        리스트 보기
      </Link>
    )
  } else {
    params.set('view', 'map')
    return (
      <Link
        href={`/?${params.toString()}`}
        className="text-gray-500 hover:text-gray-900 transition-colors text-sm"
      >
        지도로 보기
      </Link>
    )
  }
}
