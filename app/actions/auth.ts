'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nickname = formData.get('nickname') as string

  // 1. Auth 계정 생성
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error || !data.user) {
    return { error: error?.message ?? '회원가입 실패' }
  }

  // 2. profiles 테이블에 approved 상태로 INSERT
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: data.user.id,
      email,
      nickname,
      status: 'approved',
    })

  if (profileError) {
    return { error: '프로필 생성 실패: ' + profileError.message }
  }

  redirect('/')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: '이메일 또는 비밀번호가 올바르지 않아요.' }
  }

  // 로그인 성공 → status 확인 후 리다이렉트
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인 실패' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single()

  if (profile?.status === 'pending') redirect('/pending-approval')
  if (profile?.status === 'rejected' || profile?.status === 'deactivated') redirect('/rejected')

  redirect('/')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}