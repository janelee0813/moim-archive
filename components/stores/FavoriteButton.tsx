'use client'

import { useState, useTransition } from 'react'
import { toggleFavorite } from '@/app/actions/profile'

export default function FavoriteButton({
  storeId,
  initialFavorited,
}: {
  storeId: string
  initialFavorited: boolean
}) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [pending, startTransition] = useTransition()

  function handle() {
    startTransition(async () => {
      const res = await toggleFavorite(storeId)
      if (res && !res.error) setFavorited(res.favorited ?? false)
    })
  }

  return (
    <button
      onClick={handle}
      disabled={pending}
      className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border transition-all disabled:opacity-50 ${
        favorited
          ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'
          : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
      }`}
    >
      <span className="text-base leading-none">{favorited ? '♥' : '♡'}</span>
      {favorited ? '찜 완료' : '찜하기'}
    </button>
  )
}
