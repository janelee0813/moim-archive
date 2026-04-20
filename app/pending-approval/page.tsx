export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md text-center">
        <div className="text-4xl mb-4">⏳</div>
        <h1 className="text-xl font-bold mb-2">승인 대기 중이에요</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          가입 신청이 완료됐어요.
          <br />
          운영자 확인 후 승인되면 이용 가능해요.
          <br />
          보통 1~2일 내에 처리돼요.
        </p>
      </div>
    </div>
  )
}