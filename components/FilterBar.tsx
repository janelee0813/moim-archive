'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const CATEGORIES = ['게임', '고기집', '기타', '소풍', '술집', '식사', '영화', '이자카야', '카페', '포차', '횟집']
const REGIONS = ['강남역', '논현동', '대치동', '선릉', '선정릉', '삼성동', '신사동', '압구정동', '양재동', '역삼동', '청담동', '강남구청', '개포동', '한강', '기타']

interface FilterPopoverProps {
  label: string
  options: string[]
  paramKey: string
  onClose: () => void
}

function FilterPopover({ label, options, paramKey, onClose }: FilterPopoverProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selected, setSelected] = useState<string>(searchParams.get(paramKey) ?? '')

  function apply() {
    const params = new URLSearchParams(searchParams.toString())
    if (selected) params.set(paramKey, selected)
    else params.delete(paramKey)
    router.push(`/?${params.toString()}`)
    onClose()
  }

  function reset() {
    setSelected('')
  }

  return (
    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-5 min-w-[280px]">
      <p className="font-semibold text-gray-900 mb-4">{label}</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => setSelected(v => v === opt ? '' : opt)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              selected === opt
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          초기화
        </button>
        <button
          type="button"
          onClick={apply}
          className="px-4 py-2 text-sm bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors"
        >
          적용하기
        </button>
      </div>
    </div>
  )
}

export default function FilterBar({ totalVisits = 0 }: { totalVisits?: number }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [openFilter, setOpenFilter] = useState<'category' | 'region' | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const category = searchParams.get('category')
  const region = searchParams.get('region')
  const isMapView = searchParams.get('view') === 'map'

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenFilter(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggleView() {
    const params = new URLSearchParams(searchParams.toString())
    if (isMapView) params.delete('view')
    else params.set('view', 'map')
    router.push(`/?${params.toString()}`)
  }

  return (
    <div ref={ref} className="flex items-center gap-2 mb-4 flex-wrap">
      {/* 테마별 */}
      <div className="relative">
        <button
          onClick={() => setOpenFilter(v => v === 'category' ? null : 'category')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border transition-colors ${
            category
              ? 'bg-gray-900 text-white border-gray-900'
              : openFilter === 'category'
              ? 'border-gray-900 bg-white text-gray-900'
              : 'border-gray-300 bg-white text-gray-600 hover:border-gray-500'
          }`}
        >
          테마별{category ? `: ${category}` : ''}
          <span className="text-xs">{openFilter === 'category' ? '▲' : '▼'}</span>
        </button>
        {openFilter === 'category' && (
          <FilterPopover
            label="테마별"
            options={CATEGORIES}
            paramKey="category"
            onClose={() => setOpenFilter(null)}
          />
        )}
      </div>

      {/* 지역별 */}
      <div className="relative">
        <button
          onClick={() => setOpenFilter(v => v === 'region' ? null : 'region')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border transition-colors ${
            region
              ? 'bg-gray-900 text-white border-gray-900'
              : openFilter === 'region'
              ? 'border-gray-900 bg-white text-gray-900'
              : 'border-gray-300 bg-white text-gray-600 hover:border-gray-500'
          }`}
        >
          지역별{region ? `: ${region}` : ''}
          <span className="text-xs">{openFilter === 'region' ? '▲' : '▼'}</span>
        </button>
        {openFilter === 'region' && (
          <FilterPopover
            label="지역별"
            options={REGIONS}
            paramKey="region"
            onClose={() => setOpenFilter(null)}
          />
        )}
      </div>

      {/* 제휴할인 (준비 중) */}
      <button
        disabled
        className="px-4 py-2 rounded-xl text-sm border border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
      >
        제휴할인
      </button>

      {/* 지도/리스트 토글 */}
      <button
        onClick={toggleView}
        className={`px-4 py-2 rounded-xl text-sm border transition-colors ${
          isMapView
            ? 'bg-gray-900 text-white border-gray-900'
            : 'border-gray-300 bg-white text-gray-600 hover:border-gray-500'
        }`}
      >
        {isMapView ? '리스트 보기' : '지도로 보기'}
      </button>

      {totalVisits > 0 && (
        <span className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
          <span>👀</span>
          <span>방문자수</span>
          <span className="font-semibold text-gray-700">{totalVisits.toLocaleString()}명</span>
        </span>
      )}
    </div>
  )
}
