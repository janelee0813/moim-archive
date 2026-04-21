'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateNickname(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인 필요' }

  const nickname = (formData.get('nickname') as string)?.trim()
  if (!nickname) return { error: '닉네임을 입력해주세요.' }

  const { error } = await supabase
    .from('profiles')
    .update({ nickname })
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/mypage')
  return { success: true }
}

export async function toggleFavorite(storeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인 필요' }

  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('store_id', storeId)
    .single()

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id)
    revalidatePath('/mypage')
    return { favorited: false }
  } else {
    await supabase.from('favorites').insert({ user_id: user.id, store_id: storeId })
    revalidatePath('/mypage')
    return { favorited: true }
  }
}
