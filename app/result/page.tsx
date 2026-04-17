'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { hasCompletedOnboarding } from '@/lib/session'

export default function ResultPage() {
  const router = useRouter()

  useEffect(() => {
    if (!hasCompletedOnboarding()) {
      router.replace('/onboarding')
    }
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-4">
        <h2 className="text-2xl font-bold">포트폴리오 결과</h2>
        <p className="text-gray-500">Phase 3에서 구현 예정입니다.</p>
      </div>
    </main>
  )
}
