import type {
  InvolvementTag,
  ReturnTypeTag,
  FomoTypeTag,
} from '@/types'

// 선택지 타입
export interface SurveyOption {
  label: string
  score?: number // E1 (FOMO)는 점수 미반영이므로 선택
  tag?: InvolvementTag | ReturnTypeTag | FomoTypeTag
  mappedValue?: number // B2, C1, C2의 매핑값
}

// 문항 타입
export interface SurveyQuestion {
  id: string
  category: 'A' | 'B' | 'C' | 'D' | 'E'
  title: string
  description?: string
  options: SurveyOption[]
}

// 17문항 설정
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
      { label: '100~500만원', score: 4, mappedValue: 2000000 },
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
]

// 스텝 구성 (5스텝)
export const SURVEY_STEPS = [
  { stepNumber: 1, title: '기본 정보', questions: ['A1', 'A2', 'A3'] },
  { stepNumber: 2, title: '재무 현황 상', questions: ['B1', 'B2', 'B3'] },
  { stepNumber: 3, title: '재무 현황 하', questions: ['B4', 'B5', 'B6'] },
  { stepNumber: 4, title: '리스크 성향', questions: ['C1', 'C2', 'C3', 'C4', 'C5'] },
  { stepNumber: 5, title: '투자 행동 패턴', questions: ['D1', 'D2', 'E1'] },
]

// 점수 계산 상수
export const SCORE_CONFIG = {
  MIN_RAW: 24,
  MAX_RAW: 120,
  WEIGHTS: {
    A: 1,
    B: 1.5,
    C: 2,
    D: 1,
    E: 0, // FOMO는 점수에 미반영
  },
}
