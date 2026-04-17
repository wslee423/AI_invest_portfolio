import { NextResponse } from 'next/server'
import type { PortfolioError } from '@/types'
import { PortfolioRequestSchema } from '@/lib/openai/schema'
import { generatePortfolio } from '@/lib/openai/client'

export const maxDuration = 30

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json<PortfolioError>(
      { code: 'VALIDATION_ERROR', message: '요청 형식이 올바르지 않습니다' },
      { status: 400 }
    )
  }

  const parsed = PortfolioRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json<PortfolioError>(
      { code: 'VALIDATION_ERROR', message: '필수 필드가 누락되었거나 형식이 잘못되었습니다' },
      { status: 400 }
    )
  }

  try {
    const result = await generatePortfolio(parsed.data)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : ''
    const isTimeout = message.includes('timeout') || message.includes('timed out')
    return NextResponse.json<PortfolioError>(
      {
        code: isTimeout ? 'TIMEOUT' : 'OPENAI_ERROR',
        message: isTimeout
          ? '요청 시간이 초과되었습니다. 다시 시도해주세요.'
          : 'AI 포트폴리오 생성 중 오류가 발생했습니다',
      },
      { status: 500 }
    )
  }
}
