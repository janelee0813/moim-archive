'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateNickname } from '@/app/actions/profile'

export default function NicknameForm({ currentNickname }: { currentNickname: string }) {
  const [editing, setEditing] = useState(false)
  const [nickname, setNickname] = useState(currentNickname)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(formData: FormData) {
    setError(null)
    formData.set('nickname', nickname)
    startTransition(async () => {
      const result = await updateNickname(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setEditing(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
        router.refresh()
      }
    })
  }

  return (
    <div>
      <p className="text-xs text-gray-400 mb-1.5">닉네임</p>
      {editing ? (
        <form action={handleSubmit} className="flex items-center gap-2">
          <input
            name="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            autoFocus
            maxLength={20}
            className="flex-1 border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            disabled={pending}
            className="px-3 py-1.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            저장
          </button>
          <button
            type="button"
            onClick={() => { setEditing(false); setError(null) }}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            취소
          </button>
        </form>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold">{currentNickname || '-'}</span>
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-gray-400 hover:text-gray-700 underline underline-offset-2"
          >
            수정
          </button>
          {saved && <span className="text-xs text-green-500">저장됐어요!</span>}
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
