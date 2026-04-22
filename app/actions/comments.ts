'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addComment(storeId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요해요' }

  const { error } = await supabase
    .from('store_comments')
    .insert({ store_id: storeId, user_id: user.id, content })

  if (error) return { error: error.message }
  revalidatePath(`/stores/${storeId}`)
  return { success: true }
}

export async function deleteComment(commentId: string, storeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요해요' }

  const { error } = await supabase
    .from('store_comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath(`/stores/${storeId}`)
  return { success: true }
}
