import type { PortfolioResult, RiskLevel } from '@/types'
import { RISK_NICKNAMES } from '@/lib/risk-nicknames'
import { AllocationChart, ALLOCATION_COLORS } from './AllocationChart'
import { PortfolioPlanCard } from './PortfolioPlanCard'
import { DisclaimerBanner } from '@/components/features/disclaimer/DisclaimerBanner'

interface PortfolioCardProps {
  result: PortfolioResult
  riskLevel: RiskLevel
}

export function PortfolioCard({ result, riskLevel }: PortfolioCardProps) {
  const { nickname, emoji, tagline } = RISK_NICKNAMES[riskLevel]

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="rounded-xl bg-blue-600 px-6 py-5 text-white">
        <p className="text-sm font-medium opacity-70">나의 투자 성향</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl">{emoji}</span>
          <h2 className="text-2xl font-bold">
            &lsquo;{nickname}&rsquo; 형
          </h2>
        </div>
        <p className="mt-1 text-sm font-medium opacity-90">{tagline}</p>
        <p className="mt-2 text-xs opacity-70">{result.risk_description}</p>
      </div>

      {/* 요약 */}
      <section>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">한 줄 요약</h3>
        <p className="text-gray-700">{result.summary}</p>
      </section>

      {/* 자산 배분 차트 */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">자산 배분</h3>
        <AllocationChart allocations={result.allocations} />
        <div className="mt-4 space-y-3">
          {result.allocations.map((a, i) => {
            const color = ALLOCATION_COLORS[i % ALLOCATION_COLORS.length]
            return (
              <div key={i} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                {/* 헤더: 자산명 + 비율 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                    <span className="font-semibold text-gray-900">{a.asset_class}</span>
                  </div>
                  <span className="text-xl font-bold tabular-nums" style={{ color }}>{a.ratio}%</span>
                </div>

                {/* 비율 바 */}
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-gray-100">
                  <div className="h-1.5 rounded-full" style={{ width: `${a.ratio}%`, backgroundColor: color }} />
                </div>

                {/* 설명 박스 */}
                <div className="mt-3 rounded-lg bg-blue-50 px-3 py-2.5">
                  <p className="text-sm leading-relaxed text-blue-800">{a.description}</p>
                </div>

                {/* 예시 태그 */}
                {a.examples.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {a.examples.map((ex, j) => (
                      <span
                        key={j}
                        className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
                        style={{ borderColor: color, color }}
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 리스크 지표 */}
      <section>
        <h3 className="mb-3 text-lg font-semibold text-gray-900">리스크 지표</h3>
        <div className="grid grid-cols-3 gap-3">
          {result.risk_indicators.map((ind, i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-center">
              <p className="text-xs text-gray-500">{ind.label}</p>
              <p className="mt-1 text-base font-bold text-gray-900">{ind.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 투자 근거 */}
      <section>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">배분 근거</h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
          {result.reasoning}
        </p>
      </section>

      {/* 투자 배경 반영 포인트 */}
      {(result.background_highlights ?? []).length > 0 && (
        <section>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">투자 배경 반영 포인트</h3>
          <ul className="space-y-2">
            {(result.background_highlights ?? []).map((point, i) => (
              <li key={i} className="flex items-start gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
                <span className="mt-0.5 shrink-0 text-indigo-400">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 행동 조언 */}
      <section>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">투자 행동 조언</h3>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
            {result.behavior_advice}
          </p>
        </div>
      </section>

      {/* 추천 포트폴리오 플랜 */}
      {result.portfolio_plans.length > 0 && (
        <section>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">추천 포트폴리오 플랜</h3>
          <p className="mb-4 text-xs text-gray-400">
            ※ 동일한 자산배분 비율로 구성된 3가지 접근 방법입니다. 단가·수량은 AI 추정값이므로 실제 투자 전 확인이 필요합니다.
          </p>
          <div className="space-y-4">
            {result.portfolio_plans.map((plan, i) => (
              <PortfolioPlanCard key={i} plan={plan} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* 법적 고지 */}
      <DisclaimerBanner />
    </div>
  )
}
