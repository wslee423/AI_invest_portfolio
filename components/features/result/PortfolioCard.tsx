import type { PortfolioResult, RiskLevel } from '@/types'
import { RISK_NICKNAMES } from '@/lib/risk-nicknames'
import { AllocationChart, ALLOCATION_COLORS } from './AllocationChart'
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
          {result.allocations.map((a, i) => (
            <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-center gap-3 text-sm">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length] }}
                />
                <span className="w-16 shrink-0 font-medium text-gray-800">{a.asset_class}</span>
                <span
                  className="w-10 shrink-0 font-bold"
                  style={{ color: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length] }}
                >
                  {a.ratio}%
                </span>
                <span className="text-gray-500">{a.description}</span>
              </div>
              {a.examples.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 pl-6">
                  {a.examples.map((ex, j) => (
                    <span
                      key={j}
                      className="rounded-full border px-2 py-0.5 text-xs font-medium"
                      style={{
                        borderColor: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length],
                        color: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length],
                      }}
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
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

      {/* 행동 조언 */}
      <section>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">투자 행동 조언</h3>
        <p className="text-sm leading-relaxed text-gray-700">{result.behavior_advice}</p>
      </section>

      {/* 법적 고지 */}
      <DisclaimerBanner />
    </div>
  )
}
