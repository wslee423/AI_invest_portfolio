'use client'

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full space-y-6">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Step 1 / 5</p>
          <div className="h-1.5 w-full rounded-full bg-gray-200">
            <div className="h-1.5 w-1/5 rounded-full bg-blue-600 transition-all" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">기본 정보</h2>
        <p className="text-gray-500">Phase 2에서 구현 예정입니다.</p>
      </div>
    </main>
  )
}
