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
}

export default function StoreCard({ store }: { store: Store }) {
  return (
    <Link href={`/stores/${store.id}`}>
      <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100">
        <span className="w-32 shrink-0 font-medium text-gray-900 text-sm truncate">{store.name}</span>
        <span className="flex-1 text-xs text-gray-400 truncate hidden sm:block">{store.reason}</span>
        <div className="flex items-center gap-3 shrink-0 text-xs text-gray-400">
          <span>{store.category}</span>
          <span className="text-gray-200">|</span>
          <span>{store.region}</span>
          <span className="text-gray-200">|</span>
          <span className="text-yellow-500">★ {store.rating}</span>
        </div>
      </div>
    </Link>
  )
}
