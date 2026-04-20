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
      <div className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className="text-xs text-gray-400 mr-2">{store.category}</span>
            <span className="text-xs text-gray-400">{store.region}</span>
          </div>
          <span className="text-sm font-medium">⭐ {store.rating}</span>
        </div>
        <h3 className="font-semibold text-base mb-1">{store.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{store.reason}</p>
        {store.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {store.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}