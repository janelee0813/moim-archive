import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/')

  const { count: pendingCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: storeCount } = await supabase
    .from('stores')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">관리자 대시보드</h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border rounded-xl p-6">
          <p className="text-sm text-gray-500 mb-1">승인 대기 회원</p>
          <p className="text-3xl font-bold">{pendingCount ?? 0}</p>
        </div>
        <div className="border rounded-xl p-6">
          <p className="text-sm text-gray-500 mb-1">등록된 가게</p>
          <p className="text-3xl font-bold">{storeCount ?? 0}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <Link
          href="/admin/users"
          className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
        >
          회원 관리
        </Link>
        <Link
          href="/admin/stores"
          className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
        >
          가게 관리
        </Link>
      </div>
    </div>
  )
}