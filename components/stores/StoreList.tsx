import StoreCard from './StoreCard'

interface Store {
  id: string
  name: string
  category: string
  region: string
  rating: number
  reason: string
  tags: string[]
  created_at: string
  creatorNickname?: string
}

export default function StoreList({ stores }: { stores: Store[] }) {
  if (stores.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        아직 등록된 가게가 없어요.
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-4 px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs text-gray-400 font-medium">
        <span className="w-28 shrink-0">가게 이름</span>
        <span className="w-16 shrink-0 hidden sm:block">추천자</span>
        <span className="flex-1 hidden sm:block">추천 이유</span>
        <div className="flex items-center gap-3 shrink-0">
          <span>카테고리</span>
          <span className="text-gray-200">|</span>
          <span>지역</span>
          <span className="text-gray-200">|</span>
          <span>별점</span>
        </div>
      </div>
      {stores.map(store => (
        <StoreCard key={store.id} store={store} />
      ))}
    </div>
  )
}
