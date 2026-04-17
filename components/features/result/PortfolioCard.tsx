import type { PortfolioResult } from '@/types'
import { AllocationChart, ALLOCATION_COLORS } from './AllocationChart'
import { DisclaimerBanner } from '@/components/features/disclaimer/DisclaimerBanner'

interface PortfolioCardProps {
  result: PortfolioResult
}

export function PortfolioCard({ result }: PortfolioCardProps) {
  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="rounded-xl bg-blue-600 px-6 py-5 text-white">
        <p className="text-sm font-medium opacity-80">나의 투자 성향</p>
        <h2 className="mt-1 text-2xl font-bold">{result.risk_label}</h2>
        <p className="mt-2 text-sm opacity-90">{result.risk_description}</p>
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
        <div className="mt-4 space-y-2">
          {result.allocations.map((a, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span
                className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length] }}
              />
              <span className="w-16 shrink-0 font-medium text-gray-800">{a.asset_class}</span>
              <span className="w-10 shrink-0 font-bold" style={{ color: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length] }}>{a.ratio}%</span>
              <span className="text-gray-500">{a.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 리스크 지표 */}
      <section>
        <h3 className="mb-3 text-lg font-semibold text-gray-900">리스크 지표</h3>
        <div className="grid grid-cols-3 gap-3">
          {result.risk_indicators.map((ind, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-center"
            >
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
