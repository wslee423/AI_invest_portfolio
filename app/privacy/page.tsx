import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 — PortfolioAI',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← 홈으로
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">개인정보처리방침</h1>
          <p className="mt-2 text-sm text-gray-500">최종 수정일: 2026년 4월</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">1. 수집하는 개인정보</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            PortfolioAI는 <strong>개인정보를 수집하지 않습니다.</strong> 서비스 이용 시
            입력하는 투자 성향 설문 응답(나이대, 투자 경험 등)은 오직 브라우저의
            sessionStorage에만 저장되며, 서버로 전송되거나 저장되지 않습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">2. 데이터 저장 방식</h2>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <p className="font-medium">브라우저 탭을 닫으면 모든 데이터가 즉시 소멸됩니다.</p>
            <p className="mt-1 opacity-80">
              설문 응답과 포트폴리오 결과는 현재 사용 중인 브라우저 탭의 메모리에만
              임시 저장됩니다. 탭 종료, 브라우저 종료 시 자동으로 삭제됩니다.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">3. AI 서비스 이용</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            포트폴리오 생성을 위해 OpenAI API를 사용합니다. AI에 전달되는 정보는
            투자 성향 점수, 월 투자금액, 투자 기간, 손실 허용 범위 등
            <strong> 식별 불가능한 통계적 수치만 포함</strong>됩니다.
            이름, 이메일, 전화번호 등 개인 식별 정보는 일절 전송되지 않습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">4. 투자 유의사항</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            PortfolioAI가 제공하는 포트폴리오는 AI가 생성한 <strong>참고 자료</strong>이며
            투자 권유가 아닙니다. 투자에는 원금 손실의 위험이 있으며, 과거 수익률이
            미래 수익률을 보장하지 않습니다. 최종 투자 결정과 그에 따른 책임은
            전적으로 본인에게 있습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">5. 문의</h2>
          <p className="text-sm text-gray-700">
            개인정보 관련 문의사항은{' '}
            <a href="mailto:zzanglee890@gmail.com" className="text-blue-600 hover:underline">
              zzanglee890@gmail.com
            </a>
            으로 연락해주세요.
          </p>
        </section>
      </div>
    </main>
  )
}
