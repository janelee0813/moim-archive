'use client'

import { createStore, updateStore } from '@/app/actions/stores'
import { useState, useEffect } from 'react'

const CATEGORIES = ['술집', '횟집', '고기집', '이자카야', '포차', '카페', '기타']
const REGIONS = ['강남역', '역삼역', '선릉역', '삼성역', '압구정역', '청담역', '기타']
const TAG_OPTIONS = [
  '콜키지프리', '단체 가능', '조용함', '시끄러움',
  '2차 적합', '늦게까지 영업', '예약 필요', '가성비 좋음'
]

interface StoreData {
  id: string
  name: string
  address: string
  region: string
  category: string
  rating: number
  reason: string
  memo: string | null
  naver_place_url: string | null
  tags: string[]
  lat: number | null
  lng: number | null
}

interface Props {
  initialData?: StoreData
}

export default function StoreForm({ initialData }: Props) {
  const isEdit = !!initialData
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags ?? [])
  const [lat, setLat] = useState<string>(initialData?.lat?.toString() ?? '')
  const [lng, setLng] = useState<string>(initialData?.lng?.toString() ?? '')
  const [kakaoReady, setKakaoReady] = useState(false)

  useEffect(() => {
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      setKakaoReady(true)
      return
    }

    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      window.kakao.maps.load(() => {
        setKakaoReady(true)
      })
    }

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  async function geocodeAddress(address: string): Promise<{ lat: string; lng: string } | null> {
    if (!kakaoReady) return null
    return new Promise((resolve) => {
      const geocoder = new window.kakao.maps.services.Geocoder()
      geocoder.addressSearch(address, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
          resolve({ lat: result[0].y, lng: result[0].x })
        } else {
          resolve(null)
        }
      })
    })
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const address = formData.get('address') as string
    if (address && kakaoReady) {
      const coords = await geocodeAddress(address)
      if (coords) {
        setLat(coords.lat)
        setLng(coords.lng)
        formData.set('lat', coords.lat)
        formData.set('lng', coords.lng)
      }
    }

    selectedTags.forEach(tag => formData.append('tags', tag))

    const result = isEdit
      ? await updateStore(initialData.id, formData)
      : await createStore(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">가게명 *</label>
        <input
          name="name"
          type="text"
          required
          defaultValue={initialData?.name}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">네이버 플레이스 링크</label>
        <input
          name="naver_place_url"
          type="url"
          placeholder="https://naver.me/..."
          defaultValue={initialData?.naver_place_url ?? ''}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">주소 *</label>
        <input
          name="address"
          type="text"
          required
          placeholder="예: 서울 강남구 역삼동 824-25"
          defaultValue={initialData?.address}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <p className="text-xs text-gray-400 mt-1">등록 시 자동으로 지도 좌표로 변환돼요.</p>
      </div>

      <input type="hidden" name="lat" value={lat} />
      <input type="hidden" name="lng" value={lng} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">지역 *</label>
          <select
            name="region"
            required
            defaultValue={initialData?.region ?? ''}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">선택</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">카테고리 *</label>
          <select
            name="category"
            required
            defaultValue={initialData?.category ?? ''}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">선택</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">별점 *</label>
        <select
          name="rating"
          required
          defaultValue={initialData?.rating ?? ''}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">선택</option>
          {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map(r => (
            <option key={r} value={r}>{'⭐'.repeat(Math.floor(r))} {r}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">추천 이유 *</label>
        <textarea
          name="reason"
          required
          rows={3}
          placeholder="이 가게를 추천하는 이유를 적어줘"
          defaultValue={initialData?.reason}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">메모</label>
        <textarea
          name="memo"
          rows={2}
          placeholder="추가로 알면 좋은 정보 (선택)"
          defaultValue={initialData?.memo ?? ''}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">태그</label>
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? (isEdit ? '수정 중...' : '등록 중...') : (isEdit ? '수정 완료' : '가게 등록하기')}
      </button>
    </form>
  )
}
