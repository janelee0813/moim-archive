'use client'

import { approveUser, rejectUser, toggleAdmin, deactivateUser } from '@/app/actions/admin'
import { Profile } from '@/lib/types'
import { useState } from 'react'

interface Props {
  users: Profile[]
  type: 'pending' | 'all'
}

export default function AdminUserTable({ users, type }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  async function handleToggleAdmin(userId: string, currentIsAdmin: boolean) {
    setError(null)
    setLoadingId(userId)
    const result = await toggleAdmin(userId, currentIsAdmin)
    if (result?.error) setError(result.error)
    setLoadingId(null)
  }

  async function handleDeactivate(userId: string) {
    if (!confirm('정말 탈퇴 처리하시겠어요?')) return
    setError(null)
    setLoadingId(userId)
    const result = await deactivateUser(userId)
    if (result?.error) setError(result.error)
    setLoadingId(null)
  }

  const statusLabel: Record<string, string> = {
    pending: '대기',
    approved: '승인',
    rejected: '거절',
    deactivated: '탈퇴',
  }

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    deactivated: 'bg-gray-100 text-gray-500',
  }

  return (
    <div>
      {error && (
        <p className="text-sm text-red-500 mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">닉네임</th>
              <th className="text-left px-4 py-3 font-medium">이메일</th>
              <th className="text-left px-4 py-3 font-medium">신청일</th>
              <th className="text-left px-4 py-3 font-medium">상태</th>
              {type === 'all' && (
                <>
                  <th className="text-left px-4 py-3 font-medium">관리자</th>
                  <th className="text-left px-4 py-3 font-medium">탈퇴</th>
                </>
              )}
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
                {type === 'all' && (
                  <>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                        disabled={loadingId === user.id}
                        className={`px-3 py-1 text-xs rounded-lg border transition-colors disabled:opacity-50 ${
                          user.is_admin
                            ? 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200'
                            : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {user.is_admin ? '관리자 ✓' : '관리자 지정'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {user.status !== 'deactivated' ? (
                        <button
                          onClick={() => handleDeactivate(user.id)}
                          disabled={loadingId === user.id}
                          className="px-3 py-1 text-xs rounded-lg border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50"
                        >
                          탈퇴
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">탈퇴됨</span>
                      )}
                    </td>
                  </>
                )}
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
    </div>
  )
}
