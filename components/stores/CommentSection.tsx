'use client'

import { useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { addComment, deleteComment } from '@/app/actions/comments'

interface Comment {
  id: string
  content: string
  created_at: string
  authorNickname: string
  isOwner: boolean
}

interface Props {
  storeId: string
  comments: Comment[]
  isLoggedIn: boolean
}

export default function CommentSection({ storeId, comments, isLoggedIn }: Props) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const content = (new FormData(e.currentTarget).get('content') as string).trim()
    if (!content) return
    startTransition(async () => {
      await addComment(storeId, content)
      formRef.current?.reset()
      router.refresh()
    })
  }

  function handleDelete(commentId: string) {
    if (!confirm('댓글을 삭제할까요?')) return
    startTransition(async () => {
      await deleteComment(commentId, storeId)
      router.refresh()
    })
  }

  return (
    <div className="mt-6 pt-6 border-t">
      <h2 className="text-sm font-semibold mb-3">
        댓글{comments.length > 0 ? ` (${comments.length})` : ''}
      </h2>

      {comments.length === 0 ? (
        <p className="text-xs text-gray-400 mb-4">아직 댓글이 없어요. 첫 번째 댓글을 남겨보세요!</p>
      ) : (
        <div className="space-y-2 mb-4">
          {comments.map(c => (
            <div key={c.id} className="bg-gray-50 rounded-xl px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">{c.authorNickname}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400">
                    {new Date(c.created_at).toLocaleDateString('ko-KR')}
                  </span>
                  {c.isOwner && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={pending}
                      className="text-[11px] text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {isLoggedIn ? (
        <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2">
          <input
            name="content"
            placeholder="댓글을 입력해주세요"
            className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-gray-400 transition-colors"
            required
          />
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 shrink-0"
          >
            등록
          </button>
        </form>
      ) : (
        <p className="text-xs text-gray-400">댓글을 남기려면 로그인이 필요해요.</p>
      )}
    </div>
  )
}
