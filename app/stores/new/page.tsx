import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StoreForm from '@/components/stores/StoreForm'

export default async function NewStorePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single()

  if (profile?.status !== 'approved') redirect('/')

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">가게 등록</h1>
      <StoreForm />
    </div>
  )
}