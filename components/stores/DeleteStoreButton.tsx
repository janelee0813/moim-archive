'use client'

import { deleteStore } from '@/app/actions/stores'
import { useState } from 'react'

export default function DeleteStoreButton({ storeId, compact = false }: { storeId: string; compact?: boolean }) {
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
      className={`transition-colors disabled:opacity-50 ${
        compact
          ? `text-xs px-2 py-1 rounded whitespace-nowrap ${confirm ? 'bg-red-500 text-white' : 'border border-red-300 text-red-500 hover:bg-red-50'}`
          : `px-4 py-2 rounded-lg text-sm font-medium ${confirm ? 'bg-red-500 text-white hover:bg-red-600' : 'border border-red-300 text-red-500 hover:bg-red-50'}`
      }`}
    >
      {loading ? '삭제 중...' : confirm ? (compact ? '확인' : '정말 삭제할까요?') : '삭제'}
    </button>
  )
}