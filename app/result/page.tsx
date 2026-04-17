'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PortfolioResult, PortfolioError, PortfolioRequest } from '@/types'
import { getSession, setSession, hasCompletedOnboarding } from '@/lib/session'
import { PortfolioCard } from '@/components/features/result/PortfolioCard'

type PageState =
  | { status: 'loading' }
  | { status: 'success'; result: PortfolioResult }
  | { status: 'error'; error: PortfolioError }

export default function ResultPage() {
  const router = useRouter()
  const [state, setState] = useState<PageState>({ status: 'loading' })
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    if (!hasCompletedOnboarding()) {
      router.replace('/onboarding')
      return
    }

    const session = getSession()
    if (!session) return

    // 이미 생성된 포트폴리오가 있으면 바로 표시
    if (session.portfolio) {
      setState({ status: 'success', result: session.portfolio })
      return
    }

    const req: PortfolioRequest = {
      risk_level: session.riskLevel,
      monthly_investment: session.monthly_investment,
      investment_period_years: session.investment_period_years,
      loss_tolerance_pct: session.loss_tolerance_pct,
      behavior_profile: session.behavior_profile,
    }

    fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          setState({ status: 'error', error: data as PortfolioError })
          return
        }
        const result = data as PortfolioResult
        setSession({ ...session, portfolio: result })
        setState({ status: 'success', result })
      })
      .catch(() => {
        setState({
          status: 'error',
          error: { code: 'OPENAI_ERROR', message: '네트워크 오류가 발생했습니다' },
        })
      })
  }, [router])

  if (state.status === 'loading') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-gray-600">AI가 포트폴리오를 생성하고 있습니다...</p>
          <p className="text-sm text-gray-400">최대 30초가 소요될 수 있습니다</p>
        </div>
      </main>
    )
  }

  if (state.status === 'error') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900">오류가 발생했습니다</h2>
          <p className="text-gray-600">{state.error.message}</p>
          <button
            onClick={() => {
              setState({ status: 'loading' })
              window.location.reload()
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            다시 시도
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto max-w-2xl">
        <PortfolioCard result={state.result} />
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => router.push('/onboarding')}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            다시 진단하기
          </button>
        </div>
      </div>
    </main>
  )
}
