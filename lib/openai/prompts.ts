import type { PortfolioRequest } from '@/types'

const RISK_LABEL_MAP: Record<string, string> = {
  very_conservative: '매우 안정형',
  conservative: '안정형',
  moderate: '중립형',
  aggressive: '공격형',
  very_aggressive: '매우 공격형',
}

const INVOLVEMENT_MAP: Record<string, string> = {
  active: '매일 직접 관리',
  semi_active: '주 1~2회 점검',
  semi_passive: '월 1회 점검',
  passive: '거의 방치',
  full_passive: '완전 자동화',
}

const RETURN_TYPE_MAP: Record<string, string> = {
  growth: '성장(자본차익) 중심',
  growth_income: '성장 위주 + 배당',
  balanced: '성장·배당 균형',
  income_growth: '배당 위주 + 성장',
  income: '배당 현금흐름 중심',
}

export const SYSTEM_PROMPT = `당신은 투자 성향 분석 결과를 바탕으로 개인 맞춤 포트폴리오를 설계하는 전문가입니다.

규칙:
- 자산배분 비율(ratio)의 합계는 반드시 100이어야 합니다
- 포함할 자산군: 국내주식, 해외ETF, 채권, 리츠, 금, 현금성 (최소 2종, 최대 6종)
- reasoning은 배분 근거를 구체적으로 설명해야 합니다 (최소 100자)
- 투자에 관한 법적 고지: 이 포트폴리오는 참고용이며 원금 손실 위험이 있습니다
- 답변은 반드시 한국어로 작성합니다`

export function buildUserPrompt(req: PortfolioRequest): string {
  const riskLabel = RISK_LABEL_MAP[req.risk_level] ?? req.risk_level
  const involvementLabel =
    INVOLVEMENT_MAP[req.behavior_profile.involvement] ??
    req.behavior_profile.involvement
  const returnLabel =
    RETURN_TYPE_MAP[req.behavior_profile.return_type] ??
    req.behavior_profile.return_type

  return `다음 투자자 프로필을 바탕으로 포트폴리오를 설계해주세요.

투자 성향: ${riskLabel}
월 투자 가능 금액: ${req.monthly_investment.toLocaleString()}원
투자 기간: ${req.investment_period_years}년
최대 손실 허용: ${req.loss_tolerance_pct}%
관여도: ${involvementLabel}
수익 선호: ${returnLabel}
FOMO 유형: ${req.behavior_profile.fomo_type}

포트폴리오를 설계하고, risk_indicators에는 예상 연평균 수익률, 최대 낙폭(MDD), 변동성 수준을 포함해주세요.
behavior_advice에는 이 투자자의 FOMO 유형과 관여도를 고려한 행동 조언을 작성해주세요.`
}
