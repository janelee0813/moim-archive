import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import NicknameForm from '@/components/mypage/NicknameForm'

export default async function MyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: favoriteRows }, { data: myStores }] = await Promise.all([
    supabase.from('profiles').select('nickname, status').eq('id', user.id).single(),
    supabase.from('favorites').select('store_id').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('stores').select('*').eq('created_by', user.id).order('created_at', { ascending: false }),
  ])

  const favoriteIds = favoriteRows?.map(f => f.store_id) ?? []
  let favoriteStores: any[] = []
  if (favoriteIds.length > 0) {
    const { data } = await supabase.from('stores').select('*').in('id', favoriteIds)
    // preserve favorite order
    const map = Object.fromEntries((data ?? []).map(s => [s.id, s]))
    favoriteStores = favoriteIds.map(id => map[id]).filter(Boolean)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-gray-400 hover:text-black mb-6 block">
        ← 목록으로
      </Link>
      <h1 className="text-2xl font-bold mb-8">마이페이지</h1>

      {/* 프로필 */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">프로필</p>
        <NicknameForm currentNickname={profile?.nickname ?? ''} />
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-1">이메일</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </section>

      {/* 찜한 가게 */}
      <section className="mb-6">
        <h2 className="text-base font-semibold mb-3">
          찜한 가게{' '}
          <span className="text-gray-400 font-normal text-sm">{favoriteStores.length}개</span>
        </h2>
        {favoriteStores.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl">
            아직 찜한 가게가 없어요.
          </div>
        ) : (
          <StoreList stores={favoriteStores} />
        )}
      </section>

      {/* 내가 등록한 가게 */}
      <section>
        <h2 className="text-base font-semibold mb-3">
          내가 등록한 가게{' '}
          <span className="text-gray-400 font-normal text-sm">{myStores?.length ?? 0}개</span>
        </h2>
        {!myStores?.length ? (
          <div className="py-8 text-center text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl">
            아직 등록한 가게가 없어요.
          </div>
        ) : (
          <StoreList stores={myStores} />
        )}
      </section>
    </div>
  )
}

function StoreList({ stores }: { stores: any[] }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {stores.map(store => (
        <Link
          key={store.id}
          href={`/stores/${store.id}`}
          className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
        >
          <span className="flex-1 text-sm font-medium text-gray-900 truncate">{store.name}</span>
          <span className="text-xs text-gray-400">{store.category}</span>
          <span className="text-gray-200 text-xs">|</span>
          <span className="text-xs text-gray-400">{store.region}</span>
          <span className="text-gray-200 text-xs">|</span>
          <span className="text-xs text-yellow-500">★ {store.rating}</span>
        </Link>
      ))}
    </div>
  )
}
