'use client'

import { useEffect, useRef, useState } from 'react'

interface Store {
  id: string
  name: string
  lat: number | null
  lng: number | null
  category: string
  region: string
  rating: number
}

interface Props {
  stores: Store[]
  kakaoKey: string
}

export default function StoreMap({ stores, kakaoKey }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // 이미 로드된 경우
    if (window.kakao && window.kakao.maps) {
      setLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      window.kakao.maps.load(() => {
        setLoaded(true)
      })
    }

    script.onerror = () => {
      console.error('카카오맵 스크립트 로드 실패')
    }
  }, [])

  useEffect(() => {
    if (!loaded || !mapRef.current) return

    const center = new window.kakao.maps.LatLng(37.4979, 127.0276)
    const map = new window.kakao.maps.Map(mapRef.current, {
      center,
      level: 4,
    })

    const storesWithCoords = stores.filter(s => s.lat && s.lng)

    storesWithCoords.forEach(store => {
      const position = new window.kakao.maps.LatLng(store.lat!, store.lng!)
      const marker = new window.kakao.maps.Marker({ map, position, title: store.name })

      const infoContent = `
        <div style="padding:8px 12px; min-width:150px;">
          <p style="font-weight:600; font-size:13px; margin:0 0 4px;">${store.name}</p>
          <p style="font-size:11px; color:#888; margin:0;">${store.category} · ${store.region} · ⭐${store.rating}</p>
          <a href="/stores/${store.id}" style="font-size:11px; color:#1a73e8; margin-top:4px; display:block;">상세보기 →</a>
        </div>
      `

      const infoWindow = new window.kakao.maps.InfoWindow({ content: infoContent })
      window.kakao.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(map, marker)
      })
    })

    if (storesWithCoords.length > 0) {
      map.setCenter(new window.kakao.maps.LatLng(storesWithCoords[0].lat!, storesWithCoords[0].lng!))
    }
  }, [loaded, stores])

  return (
    <div className="w-full rounded-xl overflow-hidden border">
      <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
      {!loaded && (
        <div className="flex items-center justify-center h-[500px] bg-gray-50">
          <p className="text-sm text-gray-400">지도 불러오는 중...</p>
        </div>
      )}
    </div>
  )
}