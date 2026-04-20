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
}

export default function StoreList({ stores }: { stores: Store[] }) {
  if (stores.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        아직 등록된 가게가 없어요.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {stores.map(store => (
        <StoreCard key={store.id} store={store} />
      ))}
    </div>
  )
}
