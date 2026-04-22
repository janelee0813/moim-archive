import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'
import Link from 'next/link'
import Image from 'next/image'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const profile = user
    ? await supabase
        .from('profiles')
        .select('nickname, status, is_admin')
        .eq('id', user.id)
        .single()
        .then(({ data }) => data)
    : null

  const isApproved = profile?.status === 'approved'

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.png" alt="여기벙어때" height={36} width={120} className="object-contain" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
          {!user ? (
            <>
              <Link href="/login" className="text-gray-500 hover:text-gray-900 transition-colors">
                로그인
              </Link>
              <Link
                href="/signup"
                title="회원가입시 가게등록과 가게찜을 할 수 있어요!"
                className="bg-gray-900 text-white px-2.5 py-1.5 sm:px-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                회원 가입
              </Link>
            </>
          ) : (
            <>
              {isApproved && (
                <Link href="/stores/new" className="text-gray-500 hover:text-gray-900 transition-colors">
                  + 등록
                </Link>
              )}
              <Link href="/mypage" className="text-gray-500 hover:text-gray-900 transition-colors">
                마이페이지
              </Link>
              {profile?.is_admin && (
                <Link href="/admin" className="text-gray-500 hover:text-gray-900 transition-colors">
                  관리자
                </Link>
              )}
              <span className="text-gray-400 hidden sm:inline">{profile?.nickname ?? '...'}</span>
              <form action={signOut}>
                <button type="submit" className="text-gray-400 hover:text-gray-900 transition-colors">
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
