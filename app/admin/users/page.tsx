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

  const { data: pendingUsers } = await supabase
    .from('profiles')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  const { data: allUsers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">회원 관리</h1>

      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4">
          승인 대기
          <span className="ml-2 text-sm font-normal text-gray-500">
            {pendingUsers?.length ?? 0}명
          </span>
        </h2>
        <AdminUserTable users={pendingUsers ?? []} type="pending" />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">전체 회원</h2>
        <AdminUserTable users={allUsers ?? []} type="all" />
      </section>
    </div>
  )
}