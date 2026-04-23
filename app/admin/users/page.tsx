import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminUserTable from '@/components/admin/AdminUserTable'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/')

  const [
    { count: memberCount },
    { count: storeCount },
    { count: commentCount },
    { count: favoriteCount },
    { data: allUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('stores').select('*', { count: 'exact', head: true }),
    supabase.from('store_comments').select('*', { count: 'exact', head: true }),
    supabase.from('favorites').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
  ])

  const stats = [
    { label: '총 회원', value: memberCount ?? 0, unit: '명' },
    { label: '등록된 가게', value: storeCount ?? 0, unit: '곳' },
    { label: '댓글', value: commentCount ?? 0, unit: '개' },
    { label: '즐겨찾기', value: favoriteCount ?? 0, unit: '개' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">회원 관리</h1>

      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4">서비스 현황</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ label, value, unit }) => (
            <div key={label} className="border rounded-xl px-5 py-4 bg-white">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className="text-2xl font-bold">
                {value.toLocaleString()}
                <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">전체 회원</h2>
        <AdminUserTable users={allUsers ?? []} type="all" />
      </section>
    </div>
  )
}
