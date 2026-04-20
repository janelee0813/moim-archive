'use client'

import { deleteStore } from '@/app/actions/stores'
import { useState } from 'react'

export default function DeleteStoreButton({ storeId }: { storeId: string }) {
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)

  async function handleDelete() {
    if (!confirm) {
      setConfirm(true)
      return
    }

    setLoading(true)
    const result = await deleteStore(storeId)
    if (result?.error) {
      alert(result.error)
      setLoading(false)
      setConfirm(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
        confirm
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'border border-red-300 text-red-500 hover:bg-red-50'
      }`}
    >
      {loading ? '삭제 중...' : confirm ? '정말 삭제할까요?' : '가게 삭제'}
    </button>
  )
}