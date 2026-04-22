import Link from 'next/link'

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
  favCount?: number
  commentCount?: number
}

export default function StoreCard({ store }: { store: Store }) {
  return (
    <Link href={`/stores/${store.id}`}>
      <div className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100">

        {/* 모바일 레이아웃 */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm text-gray-900 truncate">{store.name}</span>
            <div className="flex items-center gap-1.5 shrink-0 text-xs">
              <span className="text-red-400">♥ {store.favCount ?? 0}</span>
              <span className="text-yellow-500">★ {store.rating}</span>
              <span className="text-gray-400">💬 {store.commentCount ?? 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400">
            <span>{store.category}</span>
            <span>·</span>
            <span>{store.region}</span>
            {store.creatorNickname && (
              <>
                <span>·</span>
                <span className="truncate">{store.creatorNickname}</span>
              </>
            )}
          </div>
        </div>

        {/* 데스크탑 레이아웃 */}
        <div className="hidden sm:flex items-center gap-4">
          <span className="w-40 shrink-0 font-medium text-gray-900 text-sm truncate">{store.name}</span>
          <span className="w-24 shrink-0 text-xs text-gray-400 truncate">{store.creatorNickname || '-'}</span>
          <span className="flex-1 text-xs text-gray-400 truncate">{store.reason}</span>
          <div className="flex items-center gap-3 shrink-0 text-xs text-gray-400">
            <span>{store.category}</span>
            <span className="text-gray-200">|</span>
            <span>{store.region}</span>
            <span className="text-gray-200">|</span>
            <span className="text-red-400">♥ {store.favCount ?? 0}</span>
            <span className="text-gray-200">|</span>
            <span className="text-yellow-500">★ {store.rating}</span>
            <span className="text-gray-200">|</span>
            <span className="text-gray-400">💬 {store.commentCount ?? 0}</span>
          </div>
        </div>

      </div>
    </Link>
  )
}
