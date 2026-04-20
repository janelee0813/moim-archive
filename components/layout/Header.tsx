import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'
import Link from 'next/link'
import NavDropdown from './NavDropdown'
import ViewToggle from './ViewToggle'
import { Suspense } from 'react'

const CATEGORIES = [
  { label: '술집', value: '술집' },
  { label: '횟집', value: '횟집' },
  { label: '고기집', value: '고기집' },
  { label: '이자카야', value: '이자카야' },
  { label: '포차', value: '포차' },
  { label: '카페', value: '카페' },
  { label: '기타', value: '기타' },
]

const REGIONS = [
  { label: '강남역', value: '강남역' },
  { label: '역삼역', value: '역삼역' },
  { label: '선릉역', value: '선릉역' },
  { label: '삼성역', value: '삼성역' },
  { label: '압구정역', value: '압구정역' },
  { label: '청담역', value: '청담역' },
  { label: '기타', value: '기타' },
]

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('nickname, status, is_admin')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const isApproved = profile?.status === 'approved'

  return (
    <header className="border-b border-purple-500/20 bg-[#13111c]/90 backdrop-blur sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          강남 벙지도
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Suspense><NavDropdown label="테마별" items={CATEGORIES} paramKey="category" /></Suspense>
          <Suspense><NavDropdown label="지역별" items={REGIONS} paramKey="region" /></Suspense>
          <Suspense><ViewToggle /></Suspense>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {!user ? (
            <>
              <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
                로그인
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-lg hover:shadow-[0_0_16px_rgba(168,85,247,0.5)] transition-all duration-200"
              >
                회원 가입
              </Link>
            </>
          ) : (
            <>
              {isApproved && (
                <Link href="/stores/new" className="text-slate-400 hover:text-white transition-colors">
                  + 가게 등록
                </Link>
              )}
              {profile?.is_admin && (
                <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
                  관리자
                </Link>
              )}
              <span className="text-slate-500">{profile?.nickname ?? '...'}</span>
              <form action={signOut}>
                <button type="submit" className="text-slate-500 hover:text-white transition-colors">
                  로그아웃
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
