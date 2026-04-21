import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import StoreForm from '@/components/stores/StoreForm'
import Link from 'next/link'

export default async function EditStorePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('id', id)
    .single()

  if (!store) notFound()

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin && store.created_by !== user.id) redirect('/')

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href={`/stores/${id}`} className="text-sm text-gray-400 hover:text-black mb-6 block">
        ← 돌아가기
      </Link>
      <h1 className="text-2xl font-bold mb-8">가게 수정</h1>
      <StoreForm initialData={store} />
    </div>
  )
}
