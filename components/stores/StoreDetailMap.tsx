'use client'

import { useEffect, useRef } from 'react'

interface Props {
  lat: number
  lng: number
  name: string
}

export default function StoreDetailMap({ lat, lng, name }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function initMap() {
      if (!mapRef.current) return
      const position = new window.kakao.maps.LatLng(lat, lng)
      const map = new window.kakao.maps.Map(mapRef.current, { center: position, level: 3 })
      new window.kakao.maps.Marker({ map, position, title: name })
    }

    if (window.kakao?.maps) {
      initMap()
      return
    }

    const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`
    script.async = true
    script.onload = () => window.kakao.maps.load(initMap)
    document.head.appendChild(script)
  }, [lat, lng, name])

  return (
    <div
      ref={mapRef}
      className="w-full h-48 rounded-xl overflow-hidden border border-gray-200"
    />
  )
}
