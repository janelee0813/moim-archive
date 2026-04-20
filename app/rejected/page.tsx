export default function RejectedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md text-center">
        <div className="text-4xl mb-4">❌</div>
        <h1 className="text-xl font-bold mb-2">가입 승인이 거절됐어요</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          가입이 승인되지 않았어요.
          <br />
          문의가 필요하면 커뮤니티 운영자에게 연락해주세요.
        </p>
      </div>
    </div>
  )
}