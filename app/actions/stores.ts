'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createStore(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인 필요' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single()

  if (profile?.status !== 'approved') {
    return { error: '승인된 회원만 가게를 등록할 수 있어요.' }
  }

  const tags = formData.getAll('tags') as string[]
  const latStr = formData.get('lat') as string
  const lngStr = formData.get('lng') as string

  const { data, error } = await supabase
    .from('stores')
    .insert({
      created_by: user.id,
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      region: formData.get('region') as string,
      category: formData.get('category') as string,
      rating: parseFloat(formData.get('rating') as string),
      reason: formData.get('reason') as string,
      memo: formData.get('memo') as string || null,
      naver_place_url: formData.get('naver_place_url') as string || null,
      tags,
      lat: latStr ? parseFloat(latStr) : null,
      lng: lngStr ? parseFloat(lngStr) : null,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  redirect(`/stores/${data.id}`)
}

export async function updateStore(storeId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인 필요' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  const { data: store } = await supabase
    .from('stores')
    .select('created_by')
    .eq('id', storeId)
    .single()

  if (!profile?.is_admin && store?.created_by !== user.id) {
    return { error: '수정 권한이 없어요.' }
  }

  const tags = formData.getAll('tags') as string[]
  const latStr = formData.get('lat') as string
  const lngStr = formData.get('lng') as string

  const { error } = await supabase
    .from('stores')
    .update({
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      region: formData.get('region') as string,
      category: formData.get('category') as string,
      rating: parseFloat(formData.get('rating') as string),
      reason: formData.get('reason') as string,
      memo: formData.get('memo') as string || null,
      naver_place_url: formData.get('naver_place_url') as string || null,
      tags,
      lat: latStr ? parseFloat(latStr) : null,
      lng: lngStr ? parseFloat(lngStr) : null,
    })
    .eq('id', storeId)

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath(`/stores/${storeId}`)
  redirect(`/stores/${storeId}`)
}

export async function deleteStore(storeId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인 필요' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) return { error: '관리자만 삭제 가능해요.' }

  const { error } = await supabase
    .from('stores')
    .delete()
    .eq('id', storeId)

  if (error) return { error: error.message }

  revalidatePath('/')
  redirect('/')
}