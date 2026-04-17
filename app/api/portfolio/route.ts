import { NextResponse } from 'next/server'
import type { PortfolioRequest, PortfolioError } from '@/types'
import { generatePortfolio } from '@/lib/openai/client'

export const maxDuration = 30

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    const error: PortfolioError = {
      code: 'VALIDATION_ERROR',
      message: '요청 형식이 올바르지 않습니다',
    }
    return NextResponse.json(error, { status: 400 })
  }

  const req = body as PortfolioRequest
  if (!req.risk_level || !req.behavior_profile) {
    const error: PortfolioError = {
      code: 'VALIDATION_ERROR',
      message: '필수 필드가 누락되었습니다',
    }
    return NextResponse.json(error, { status: 400 })
  }

  try {
    const result = await generatePortfolio(req)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류'
    const isTimeout =
      message.includes('timeout') || message.includes('timed out')

    const error: PortfolioError = {
      code: isTimeout ? 'TIMEOUT' : 'OPENAI_ERROR',
      message: isTimeout
        ? '요청 시간이 초과되었습니다. 다시 시도해주세요.'
        : 'AI 포트폴리오 생성 중 오류가 발생했습니다',
    }
    return NextResponse.json(error, { status: 500 })
  }
}
