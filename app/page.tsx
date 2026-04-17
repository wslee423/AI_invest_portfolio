import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">PortfolioAI</h1>
          <p className="text-lg text-gray-600">
            5분 성향 진단으로 나만의 맞춤 투자 포트폴리오를 만들어보세요.
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700 text-left space-y-1">
          <p>• 로그인 불필요 — 익명으로 진행</p>
          <p>• 입력 데이터는 서버에 저장되지 않습니다</p>
          <p>• 탭을 닫으면 모든 데이터가 자동 소멸됩니다</p>
        </div>

        <Link
          href="/onboarding"
          className="block w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          성향 진단 시작하기 →
        </Link>

        <p className="text-xs text-gray-400">
          서비스를 이용하면{' '}
          <Link href="/privacy" className="underline hover:text-gray-600">
            개인정보처리방침
          </Link>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </main>
  )
}
