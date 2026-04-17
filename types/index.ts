// 성향 등급
export type RiskLevel =
  | 'very_conservative'
  | 'conservative'
  | 'moderate'
  | 'aggressive'
  | 'very_aggressive'

// 투자 행동 태그
export type InvolvementTag = 'active' | 'semi_active' | 'semi_passive' | 'passive' | 'full_passive'
export type ReturnTypeTag = 'growth' | 'growth_income' | 'balanced' | 'income_growth' | 'income'
export type FomoTypeTag =
  | 'relative_loss'
  | 'exclusion'
  | 'cash_regret'
  | 'social_pressure'
  | 'low_fomo'

export type AssetClass = '국내주식' | '해외ETF' | '채권' | '리츠' | '금' | '현금성'

export interface BehaviorProfile {
  involvement: InvolvementTag
  return_type: ReturnTypeTag
  fomo_type: FomoTypeTag
}

// 설문 응답 (17문항) — 선택한 옵션의 label 문자열을 저장
export interface SurveyAnswers {
  A1?: string; A2?: string; A3?: string
  B1?: string; B2?: string; B3?: string; B4?: string; B5?: string; B6?: string
  C1?: string; C2?: string; C3?: string; C4?: string; C5?: string
  D1?: string; D2?: string
  E1?: string
}

// sessionStorage 저장 스키마
export interface SessionData {
  answers: SurveyAnswers
  score: number
  riskLevel: RiskLevel
  monthly_investment: number
  investment_period_years: number
  loss_tolerance_pct: number
  behavior_profile: BehaviorProfile
  portfolio?: PortfolioResult
}

// OpenAI 요청 스키마 (PII 없음 — CONSTITUTION 원칙 4)
export interface PortfolioRequest {
  risk_level: RiskLevel
  monthly_investment: number
  investment_period_years: number
  loss_tolerance_pct: number
  behavior_profile: BehaviorProfile
}

// OpenAI 응답 스키마
export interface PortfolioResult {
  risk_label: string
  risk_description: string
  allocations: {
    asset_class: AssetClass
    ratio: number
    description: string
    examples: string[]   // 자산군별 종목 예시 1~3개
  }[]
  reasoning: string           // CONSTITUTION 원칙 3 — 필수
  risk_indicators: {
    label: string
    value: string
  }[]
  behavior_advice: string
  summary: string
  portfolio_plans: {
    plan_name: string
    plan_description: string
    holdings: {
      ticker: string
      asset_class: AssetClass
      monthly_amount: number   // 원화
      approx_price: number     // 원화 기준 참고 단가
      approx_shares: number    // 월 매수 수량 (소수 허용)
    }[]
    total_monthly: number
  }[]
}

// API 에러 응답
export interface PortfolioError {
  code: 'OPENAI_ERROR' | 'VALIDATION_ERROR' | 'TIMEOUT'
  message: string
}
