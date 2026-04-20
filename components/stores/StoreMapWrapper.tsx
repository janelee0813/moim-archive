'use client'

import dynamic from 'next/dynamic'

const StoreMap = dynamic(() => import('@/components/stores/StoreMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
      <p className="text-sm text-gray-400">지도 불러오는 중...</p>
    </div>
  ),
})

interface Store {
  id: string
  name: string
  lat: number | null
  lng: number | null
  category: string
  region: string
  rating: number
}

export default function StoreMapWrapper({ stores }: { stores: Store[] }) {
  return <StoreMap stores={stores} />
}