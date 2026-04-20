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
      <div className="border border-purple-500/20 rounded-2xl p-5 bg-[#1e1b2e] hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-200">
        <div className="flex items-start justify-between mb-2">
          <div className="flex gap-2">
            <span className="text-xs text-purple-400">{store.category}</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">{store.region}</span>
          </div>
          <span className="text-sm font-medium text-yellow-400">⭐ {store.rating}</span>
        </div>
        <h3 className="font-semibold text-base mb-1 text-white">{store.name}</h3>
        <p className="text-sm text-slate-400 line-clamp-2 mb-3">{store.reason}</p>
        {store.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {store.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full"
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
