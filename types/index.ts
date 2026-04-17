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

// 설문 응답 (17문항)
export interface SurveyAnswers {
  A1: number; A2: number; A3: number
  B1: number; B2: number; B3: number; B4: number; B5: number; B6: number
  C1: number; C2: number; C3: number; C4: number; C5: number
  D1: number; D2: number
  E1: FomoTypeTag
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
  }[]
  reasoning: string           // CONSTITUTION 원칙 3 — 필수
  risk_indicators: {
    label: string
    value: string
  }[]
  behavior_advice: string
  summary: string
}

// API 에러 응답
export interface PortfolioError {
  code: 'OPENAI_ERROR' | 'VALIDATION_ERROR' | 'TIMEOUT'
  message: string
}
