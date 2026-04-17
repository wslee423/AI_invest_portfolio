import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PortfolioAI — 맞춤 투자 포트폴리오',
  description: '5분 성향 진단으로 AI가 나만의 투자 포트폴리오를 설계해드립니다. 로그인 불필요, 데이터 서버 저장 없음.',
  keywords: ['투자 포트폴리오', 'AI 투자', '성향 진단', '자산배분', 'ETF'],
  openGraph: {
    title: 'PortfolioAI — 맞춤 투자 포트폴리오',
    description: '5분 성향 진단으로 AI가 나만의 투자 포트폴리오를 설계해드립니다.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
