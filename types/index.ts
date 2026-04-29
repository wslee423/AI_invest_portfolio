// 성향 등급
export type RiskLevel =
  | 'very_conservative'
  | 'conservative'
  | 'moderate'
  | 'aggressive'
  | 'very_aggressive'

// 투자 행동 태그 (D1, D2, E1)
export type InvolvementTag = 'active' | 'semi_active' | 'semi_passive' | 'passive' | 'full_passive'
export type ReturnTypeTag = 'growth' | 'growth_income' | 'balanced' | 'income_growth' | 'income'
export type FomoTypeTag =
  | 'relative_loss'
  | 'exclusion'
  | 'cash_regret'
  | 'social_pressure'
  | 'low_fomo'

// 투자 배경 태그 (F1~F5, 점수 미반영)
export type LossExperienceTag =
  | 'no_major_loss'
  | 'recovered_loss'
  | 'loss_cautious'
  | 'restarting_after_loss'
  | 'recovery_pressure'

export type ActualLossBehaviorTag =
  | 'no_loss_experience'
  | 'panic_sell_history'
  | 'loss_anxiety'
  | 'disciplined_hold'
  | 'revenge_trading'

export type AffinityInvestingTag =
  | 'return_only'
  | 'light_affinity'
  | 'knowledge_based_sector'
  | 'brand_affinity'
  | 'emotional_attachment_risk'

export type LiquidityEventTag =
  | 'no_major_event'
  | 'family_event'
  | 'housing_event'
  | 'career_transition'
  | 'family_support_risk'

export type MoneyBackgroundTag =
  | 'capital_preservation_belief'
  | 'saving_oriented'
  | 'investment_positive_background'
  | 'neutral_money_background'
  | 'investment_distrust_background'

export type AssetClass = '국내주식' | '해외ETF' | '채권' | '리츠' | '금' | '현금성'

export interface BehaviorProfile {
  involvement: InvolvementTag
  return_type: ReturnTypeTag
  fomo_type: FomoTypeTag
}

// F 파트: 투자 배경과 지속 가능성 (점수 미반영, AI 포트폴리오 보정용)
export interface BackgroundProfile {
  loss_experience: LossExperienceTag
  actual_loss_behavior: ActualLossBehaviorTag
  affinity_investing: AffinityInvestingTag
  liquidity_event: LiquidityEventTag
  money_background: MoneyBackgroundTag
}

// 설문 응답 (17문항 + F 파트 5문항) — 선택한 옵션의 label 문자열을 저장
export interface SurveyAnswers {
  A1?: string; A2?: string; A3?: string
  B1?: string; B2?: string; B3?: string; B4?: string; B5?: string; B6?: string
  C1?: string; C2?: string; C3?: string; C4?: string; C5?: string
  D1?: string; D2?: string
  E1?: string
  F1?: string; F2?: string; F3?: string; F4?: string; F5?: string
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
  background_profile?: BackgroundProfile  // 기존 세션 호환 — 없으면 기본값 사용
  portfolio?: PortfolioResult
}

// OpenAI 요청 스키마 (PII 없음 — CONSTITUTION 원칙 4)
export interface PortfolioRequest {
  risk_level: RiskLevel
  monthly_investment: number
  investment_period_years: number
  loss_tolerance_pct: number
  behavior_profile: BehaviorProfile
  background_profile: BackgroundProfile
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
  background_highlights?: string[]  // F 파트 반영 포인트 — 기존 캐시 호환
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
