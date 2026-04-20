import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'
import Link from 'next/link'

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
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          🍶 모임 가게 아카이브
        </Link>

        <div className="flex items-center gap-3 text-sm">
          {!user ? (
            <>
              <Link href="/login" className="text-gray-600 hover:text-black">
                로그인
              </Link>
              <Link
                href="/signup"
                className="bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800"
              >
                가입 신청
              </Link>
            </>
          ) : (
            <>
              {isApproved && (
                <Link
                  href="/stores/new"
                  className="text-gray-600 hover:text-black"
                >
                  + 가게 등록
                </Link>
              )}
              {profile?.is_admin && (
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-black"
                >
                  관리자
                </Link>
              )}
              <span className="text-gray-400">{profile?.nickname ?? '...'}</span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-gray-400 hover:text-black"
                >
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