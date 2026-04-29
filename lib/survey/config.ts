import type {
  InvolvementTag,
  ReturnTypeTag,
  FomoTypeTag,
  LossExperienceTag,
  ActualLossBehaviorTag,
  AffinityInvestingTag,
  LiquidityEventTag,
  MoneyBackgroundTag,
} from '@/types'

// 선택지 타입
export interface SurveyOption {
  label: string
  score?: number
  tag?: InvolvementTag | ReturnTypeTag | FomoTypeTag
    | LossExperienceTag | ActualLossBehaviorTag | AffinityInvestingTag
    | LiquidityEventTag | MoneyBackgroundTag
  mappedValue?: number // B2, C1, C2의 매핑값
}

// 문항 타입
export interface SurveyQuestion {
  id: string
  category: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  title: string
  description?: string
  options: SurveyOption[]
}

// 22문항 설정 (A~E: 17문항 + F: 5문항)
export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  // === 카테고리 A: 기본정보 (3문항) ===
  {
    id: 'A1',
    category: 'A',
    title: '나이대',
    description: '투자 가능 기간과 리스크 수용 여력의 기초 지표.',
    options: [
      { label: '20대', score: 5 },
      { label: '30대', score: 4 },
      { label: '40대', score: 3 },
      { label: '50대', score: 2 },
      { label: '60대 이상', score: 1 },
    ],
  },
  {
    id: 'A2',
    category: 'A',
    title: '투자 경험',
    description: '금융상품 이해도와 손실 경험 여부 측정.',
    options: [
      { label: '주식·ETF 직접 투자 3년 이상', score: 5 },
      { label: '주식·ETF 직접 투자 1~3년', score: 4 },
      { label: '펀드·예금 등 간접 투자만', score: 2 },
      { label: '투자 경험 없음', score: 1 },
    ],
  },
  {
    id: 'A3',
    category: 'A',
    title: '투자 목적',
    options: [
      { label: '자산 증식 (공격적 성장)', score: 5 },
      { label: '노후 준비 (10년 이상 장기)', score: 4 },
      { label: '목돈 마련 (3~5년 중기)', score: 2 },
      { label: '원금 보존 (안전 우선)', score: 1 },
    ],
  },

  // === 카테고리 B: 재무현황 (6문항) ===
  {
    id: 'B1',
    category: 'B',
    title: '월 소득 범위',
    options: [
      { label: '700만원 이상', score: 5 },
      { label: '500~700만원', score: 4 },
      { label: '300~500만원', score: 3 },
      { label: '200~300만원', score: 2 },
      { label: '200만원 미만', score: 1 },
    ],
  },
  {
    id: 'B2',
    category: 'B',
    title: '월 투자 가능 금액',
    options: [
      { label: '500만원 이상', score: 5, mappedValue: 6000000 },
      { label: '300~500만원', score: 4.5, mappedValue: 4000000 },
      { label: '200~300만원', score: 4, mappedValue: 2500000 },
      { label: '100~200만원', score: 3.5, mappedValue: 1500000 },
      { label: '50~100만원', score: 3, mappedValue: 750000 },
      { label: '30~50만원', score: 2, mappedValue: 400000 },
      { label: '30만원 미만', score: 1, mappedValue: 150000 },
    ],
  },
  {
    id: 'B3',
    category: 'B',
    title: '금융 자산 규모',
    options: [
      { label: '5억 이상', score: 5 },
      { label: '2억~5억', score: 4 },
      { label: '5000만~2억', score: 3 },
      { label: '1000만~5000만', score: 2 },
      { label: '1000만 미만', score: 1 },
    ],
  },
  {
    id: 'B4',
    category: 'B',
    title: '월 고정비용 비중',
    options: [
      { label: '소득의 20% 미만', score: 5 },
      { label: '소득의 20~40%', score: 4 },
      { label: '소득의 40~60%', score: 3 },
      { label: '소득의 60~80%', score: 2 },
      { label: '소득의 80% 이상', score: 1 },
    ],
  },
  {
    id: 'B5',
    category: 'B',
    title: '부양가족 여부',
    options: [
      { label: '없음', score: 5 },
      { label: '있음 (배우자만)', score: 3 },
      { label: '있음 (자녀 또는 부모 포함)', score: 1 },
    ],
  },
  {
    id: 'B6',
    category: 'B',
    title: '비상금 보유 여부',
    description: '월 생활비 기준 비상금. 1~3개월 미만이면 최종 등급 1단계 하향 보정.',
    options: [
      { label: '6개월 이상', score: 5 },
      { label: '3~6개월', score: 4 },
      { label: '1~3개월', score: 2 },
      { label: '거의 없음', score: 1 },
    ],
  },

  // === 카테고리 C: 리스크성향 (5문항) ===
  {
    id: 'C1',
    category: 'C',
    title: '손실 허용 범위',
    options: [
      { label: '30% 이상 손실도 감수', score: 5, mappedValue: 35 },
      { label: '20~30% 손실 감수', score: 4, mappedValue: 25 },
      { label: '10~20% 손실 감수', score: 3, mappedValue: 15 },
      { label: '5~10% 손실 감수', score: 2, mappedValue: 7 },
      { label: '원금 손실 절대 불가', score: 1, mappedValue: 2 },
    ],
  },
  {
    id: 'C2',
    category: 'C',
    title: '투자 기간',
    options: [
      { label: '10년 이상', score: 5, mappedValue: 15 },
      { label: '5~10년', score: 4, mappedValue: 7 },
      { label: '3~5년', score: 3, mappedValue: 4 },
      { label: '1~3년', score: 2, mappedValue: 2 },
      { label: '1년 미만', score: 1, mappedValue: 0.5 },
    ],
  },
  {
    id: 'C3',
    category: 'C',
    title: '변동성 선호도',
    options: [
      { label: '고위험 고수익을 강하게 선호', score: 5 },
      { label: '고위험 고수익을 약간 선호', score: 4 },
      { label: '중간 정도가 적당', score: 3 },
      { label: '저위험 저수익을 선호', score: 2 },
      { label: '무조건 안전 최우선', score: 1 },
    ],
  },
  {
    id: 'C4',
    category: 'C',
    title: '시장 급락 시 대응',
    options: [
      { label: '추가 매수 기회로 보고 더 투자', score: 5 },
      { label: '유지하며 회복 기다림', score: 4 },
      { label: '일부 매도하여 손실 축소', score: 2 },
      { label: '전부 매도하고 현금 보유', score: 1 },
    ],
  },
  {
    id: 'C5',
    category: 'C',
    title: '기대 수익률',
    options: [
      { label: '연 20% 이상', score: 5 },
      { label: '연 10~20%', score: 4 },
      { label: '연 5~10%', score: 3 },
      { label: '연 3~5%', score: 2 },
      { label: '연 3% 미만 (예금 수준)', score: 1 },
    ],
  },

  // === 카테고리 D: 투자행동패턴 (2문항) ===
  {
    id: 'D1',
    category: 'D',
    title: '투자 관여도',
    options: [
      { label: '매일 시세 확인하고 직접 조정하고 싶다', score: 5, tag: 'active' },
      { label: '주 1~2회 정도 확인하고 필요 시 조정', score: 4, tag: 'semi_active' },
      { label: '월 1회 정도 확인하면 충분하다', score: 3, tag: 'semi_passive' },
      { label: '한번 설정하면 거의 안 보는 편', score: 2, tag: 'passive' },
      { label: '완전 자동으로 맡기고 싶다', score: 1, tag: 'full_passive' },
    ],
  },
  {
    id: 'D2',
    category: 'D',
    title: '수익 실현 방식 선호',
    options: [
      { label: '주가 상승으로 한 번에 크게 버는 게 좋다', score: 5, tag: 'growth' },
      { label: '성장 위주지만 배당도 약간 있으면 좋다', score: 4, tag: 'growth_income' },
      { label: '성장과 배당을 반반 원한다', score: 3, tag: 'balanced' },
      { label: '배당 위주지만 성장도 약간 있으면 좋다', score: 2, tag: 'income_growth' },
      { label: '매달 배당으로 현금 흐름을 만들고 싶다', score: 1, tag: 'income' },
    ],
  },

  // === 카테고리 E: FOMO 유형 (1문항, 점수 미반영) ===
  {
    id: 'E1',
    category: 'E',
    title: 'FOMO 유형',
    description: '자신이 가장 많이 느끼는 불안감 유형을 선택해주세요.',
    options: [
      { label: '내 종목만 안 오를 때 — 상대적 박탈감', tag: 'relative_loss' as FomoTypeTag },
      { label: '핫한 종목을 나만 없을 때 — 소외감', tag: 'exclusion' as FomoTypeTag },
      { label: '시장이 폭등할 때 현금만 들고 있을 때', tag: 'cash_regret' as FomoTypeTag },
      { label: 'SNS·유튜브 수익 인증 볼 때', tag: 'social_pressure' as FomoTypeTag },
      { label: '별로 FOMO를 느끼지 않는 편', tag: 'low_fomo' as FomoTypeTag },
    ],
  },

  // === 카테고리 F: 투자 배경과 지속 가능성 (5문항, 점수 미반영) ===
  {
    id: 'F1',
    category: 'F',
    title: '과거 큰 투자 실패 경험',
    description: '과거 투자 경험이 현재 투자 판단에 어떤 영향을 주는지 파악합니다.',
    options: [
      { label: '큰 손실 경험은 없다', tag: 'no_major_loss' as LossExperienceTag },
      { label: '손실 경험은 있지만 지금 투자 판단에 큰 영향은 없다', tag: 'recovered_loss' as LossExperienceTag },
      { label: '과거 큰 손실 때문에 아직 조심스럽다', tag: 'loss_cautious' as LossExperienceTag },
      { label: '큰 손실 이후 투자를 오래 쉬었다가 다시 시작한다', tag: 'restarting_after_loss' as LossExperienceTag },
      { label: '손실을 빨리 만회하고 싶은 마음이 크다', tag: 'recovery_pressure' as LossExperienceTag },
    ],
  },
  {
    id: 'F2',
    category: 'F',
    title: '손실 상황에서의 실제 행동',
    description: '이론이 아닌 실제로 어떻게 행동했는지 솔직하게 선택해주세요.',
    options: [
      { label: '손실 경험이 거의 없다', tag: 'no_loss_experience' as ActualLossBehaviorTag },
      { label: '무서워서 바로 팔았다', tag: 'panic_sell_history' as ActualLossBehaviorTag },
      { label: '계속 확인하면서 불안해했다', tag: 'loss_anxiety' as ActualLossBehaviorTag },
      { label: '원칙대로 보유하거나 추가 매수했다', tag: 'disciplined_hold' as ActualLossBehaviorTag },
      { label: '손실을 만회하려고 더 위험한 투자를 했다', tag: 'revenge_trading' as ActualLossBehaviorTag },
    ],
  },
  {
    id: 'F3',
    category: 'F',
    title: '관심·애착 기반 투자 성향',
    description: '좋아하거나 잘 아는 분야에 투자하고 싶은 성향이 있나요?',
    options: [
      { label: '전혀 없다. 수익률과 리스크만 중요하다', tag: 'return_only' as AffinityInvestingTag },
      { label: '참고는 하지만 큰 영향을 주지는 않는다', tag: 'light_affinity' as AffinityInvestingTag },
      { label: '내가 잘 아는 산업에는 투자하고 싶다', tag: 'knowledge_based_sector' as AffinityInvestingTag },
      { label: '좋아하는 브랜드나 회사에는 장기투자하고 싶다', tag: 'brand_affinity' as AffinityInvestingTag },
      { label: '좋아하는 회사라면 손실이 나도 쉽게 팔기 어렵다', tag: 'emotional_attachment_risk' as AffinityInvestingTag },
    ],
  },
  {
    id: 'F4',
    category: 'F',
    title: '향후 3년 내 큰 지출 계획',
    description: '투자금의 유동성 필요 여부를 파악합니다.',
    options: [
      { label: '특별히 없다', tag: 'no_major_event' as LiquidityEventTag },
      { label: '결혼·출산·육아 관련 지출 가능성이 있다', tag: 'family_event' as LiquidityEventTag },
      { label: '주택 구입·이사·전세금 등 목돈 가능성이 있다', tag: 'housing_event' as LiquidityEventTag },
      { label: '퇴사·이직·창업 가능성이 있다', tag: 'career_transition' as LiquidityEventTag },
      { label: '가족 지원이나 예상치 못한 큰 지출 가능성이 있다', tag: 'family_support_risk' as LiquidityEventTag },
    ],
  },
  {
    id: 'F5',
    category: 'F',
    title: '돈과 투자에 대한 배경',
    description: '자신이 어떤 금전 환경에서 영향받았는지 선택해주세요.',
    options: [
      { label: '돈은 잃지 않는 것이 가장 중요하다고 배웠다', tag: 'capital_preservation_belief' as MoneyBackgroundTag },
      { label: '저축과 절약이 가장 중요하다고 배웠다', tag: 'saving_oriented' as MoneyBackgroundTag },
      { label: '투자와 사업에 비교적 긍정적인 분위기였다', tag: 'investment_positive_background' as MoneyBackgroundTag },
      { label: '돈에 대해 특별히 배운 기억은 없다', tag: 'neutral_money_background' as MoneyBackgroundTag },
      { label: '주변의 투자 실패 사례를 자주 봤다', tag: 'investment_distrust_background' as MoneyBackgroundTag },
    ],
  },
]

// 스텝 구성 (6스텝 — F 파트 별도 스텝)
export const SURVEY_STEPS = [
  {
    stepNumber: 1,
    index: 'A',
    title: '기본정보',
    description: '투자 목적과 경험을 바탕으로 시작점을 확인합니다.',
    questions: ['A1', 'A2', 'A3'],
  },
  {
    stepNumber: 2,
    index: 'B',
    title: '재무현황 상',
    description: '현재 소득과 투자 가능 금액을 확인합니다.',
    questions: ['B1', 'B2', 'B3'],
  },
  {
    stepNumber: 3,
    index: 'C',
    title: '재무현황 하',
    description: '자산, 고정비, 비상금 등 재무 안정성을 확인합니다.',
    questions: ['B4', 'B5', 'B6'],
  },
  {
    stepNumber: 4,
    index: 'D',
    title: '리스크 성향',
    description: '손실과 변동성을 감당할 수 있는 수준을 확인합니다.',
    questions: ['C1', 'C2', 'C3', 'C4', 'C5'],
  },
  {
    stepNumber: 5,
    index: 'E',
    title: '투자행동패턴',
    description: '투자 관리 방식과 시장 분위기에 대한 반응을 확인합니다.',
    questions: ['D1', 'D2', 'E1'],
  },
  {
    stepNumber: 6,
    index: 'F',
    title: '투자 배경과 지속 가능성',
    description: '과거 경험과 삶의 상황을 반영해 지속 가능한 투자 방식을 찾습니다.',
    questions: ['F1', 'F2', 'F3', 'F4', 'F5'],
  },
]

// 카테고리별 가중치
// E, F는 태그/profile 생성용 — 리스크 점수 미반영
export const SCORE_CONFIG = {
  WEIGHTS: {
    A: 1,
    B: 1.5,
    C: 2,
    D: 1,
    E: 0,
    F: 0,
  },
}
