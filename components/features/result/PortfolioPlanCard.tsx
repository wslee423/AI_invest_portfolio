import type { PortfolioResult } from '@/types'
import { ALLOCATION_COLORS } from './AllocationChart'

const ASSET_CLASS_ORDER = ['국내주식', '해외ETF', '채권', '리츠', '금', '현금성'] as const

type Plan = PortfolioResult['portfolio_plans'][number]

interface PortfolioPlanCardProps {
  plan: Plan
  index: number
}

const PLAN_ACCENTS = ['#3B82F6', '#10B981', '#8B5CF6']
const PLAN_BG = ['bg-blue-50', 'bg-emerald-50', 'bg-purple-50']
const PLAN_TEXT = ['text-blue-700', 'text-emerald-700', 'text-purple-700']
const PLAN_BORDER = ['border-blue-200', 'border-emerald-200', 'border-purple-200']

function assetColor(assetClass: string) {
  const idx = ASSET_CLASS_ORDER.indexOf(assetClass as typeof ASSET_CLASS_ORDER[number])
  return ALLOCATION_COLORS[idx >= 0 ? idx : 0]
}

export function PortfolioPlanCard({ plan, index }: PortfolioPlanCardProps) {
  const accent = PLAN_ACCENTS[index % PLAN_ACCENTS.length]
  const bg = PLAN_BG[index % PLAN_BG.length]
  const textCls = PLAN_TEXT[index % PLAN_TEXT.length]
  const borderCls = PLAN_BORDER[index % PLAN_BORDER.length]

  return (
    <div className={`rounded-xl border ${borderCls} overflow-hidden`}>
      {/* 카드 헤더 */}
      <div className={`${bg} px-4 py-3`}>
        <div className="flex items-center justify-between">
          <h4 className={`font-bold text-base ${textCls}`}>{plan.plan_name}</h4>
          <span
            className="rounded-full px-3 py-0.5 text-xs font-bold text-white"
            style={{ backgroundColor: accent }}
          >
            월 {plan.total_monthly.toLocaleString()}원
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600">{plan.plan_description}</p>
      </div>

      {/* 종목 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
              <th className="px-3 py-2 text-left font-medium">종목</th>
              <th className="px-3 py-2 text-left font-medium">자산군</th>
              <th className="px-3 py-2 text-right font-medium">월 투자</th>
              <th className="px-3 py-2 text-right font-medium">
                참고 단가
                <span className="ml-1 font-normal text-gray-400">(추정)</span>
              </th>
              <th className="px-3 py-2 text-right font-medium">월 매수량</th>
            </tr>
          </thead>
          <tbody>
            {plan.holdings.map((h, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2.5 font-semibold text-gray-800">{h.ticker}</td>
                <td className="px-3 py-2.5">
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: assetColor(h.asset_class) }}
                  >
                    {h.asset_class}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right text-gray-700">
                  {h.monthly_amount.toLocaleString()}원
                </td>
                <td className="px-3 py-2.5 text-right text-gray-400">
                  {h.approx_price.toLocaleString()}원
                </td>
                <td className="px-3 py-2.5 text-right">
                  <span className="font-bold" style={{ color: accent }}>
                    {h.approx_shares % 1 === 0
                      ? `${h.approx_shares}주`
                      : `${h.approx_shares.toFixed(1)}주`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-200 bg-gray-50">
              <td colSpan={2} className="px-3 py-2.5 text-xs text-gray-500">
                ※ 단가·수량은 AI 추정값으로 실제와 다를 수 있습니다
              </td>
              <td colSpan={3} className="px-3 py-2.5 text-right">
                <span className="text-xs text-gray-500">월 합계 </span>
                <span className="font-bold" style={{ color: accent }}>
                  {plan.total_monthly.toLocaleString()}원
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
