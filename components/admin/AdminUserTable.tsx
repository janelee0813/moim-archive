'use client'

import { approveUser, rejectUser } from '@/app/actions/admin'
import { Profile } from '@/lib/types'
import { useState } from 'react'

interface Props {
  users: Profile[]
  type: 'pending' | 'all'
}

export default function AdminUserTable({ users, type }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  if (users.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-4">
        {type === 'pending' ? '대기 중인 회원이 없어요.' : '회원이 없어요.'}
      </p>
    )
  }

  async function handleApprove(userId: string) {
    setLoadingId(userId)
    await approveUser(userId)
    setLoadingId(null)
  }

  async function handleReject(userId: string) {
    setLoadingId(userId)
    await rejectUser(userId)
    setLoadingId(null)
  }

  const statusLabel: Record<string, string> = {
    pending: '대기',
    approved: '승인',
    rejected: '거절',
  }

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }

  return (
    <div className="border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="text-left px-4 py-3 font-medium">닉네임</th>
            <th className="text-left px-4 py-3 font-medium">이메일</th>
            <th className="text-left px-4 py-3 font-medium">신청일</th>
            <th className="text-left px-4 py-3 font-medium">상태</th>
            {type === 'pending' && (
              <th className="text-left px-4 py-3 font-medium">처리</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <tr key={user.id} className="bg-white hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{user.nickname}</td>
              <td className="px-4 py-3 text-gray-500">{user.email}</td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(user.created_at).toLocaleDateString('ko-KR')}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[user.status]}`}>
                  {statusLabel[user.status]}
                </span>
              </td>
              {type === 'pending' && (
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(user.id)}
                      disabled={loadingId === user.id}
                      className="px-3 py-1 bg-black text-white text-xs rounded-lg hover:bg-gray-800 disabled:opacity-50"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      disabled={loadingId === user.id}
                      className="px-3 py-1 border text-xs rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      거절
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}