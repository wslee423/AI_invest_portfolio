import type { SurveyAnswers } from '@/types'
import {
  calculateRiskScore,
  classifyRiskLevel,
  applyEmergencyFundAdjustment,
} from '@/lib/survey/calculate'

// 모든 항목 최고점 (aggressive) 답변
const maxAnswers: SurveyAnswers = {
  A1: '20대',
  A2: '주식·ETF 직접 투자 3년 이상',
  A3: '자산 증식 (공격적 성장)',
  B1: '700만원 이상',
  B2: '500만원 이상',
  B3: '5억 이상',
  B4: '소득의 20% 미만',
  B5: '없음',
  B6: '6개월 이상',
  C1: '30% 이상 손실도 감수',
  C2: '10년 이상',
  C3: '고위험 고수익을 강하게 선호',
  C4: '추가 매수 기회로 보고 더 투자',
  C5: '연 20% 이상',
  D1: '매일 시세 확인하고 직접 조정하고 싶다',
  D2: '주가 상승으로 한 번에 크게 버는 게 좋다',
  E1: '별로 FOMO를 느끼지 않는 편',
}

// 모든 항목 최저점 (conservative) 답변
const minAnswers: SurveyAnswers = {
  A1: '60대 이상',
  A2: '투자 경험 없음',
  A3: '원금 보존 (안전 우선)',
  B1: '200만원 미만',
  B2: '30만원 미만',
  B3: '1000만 미만',
  B4: '소득의 80% 이상',
  B5: '있음 (자녀 또는 부모 포함)',
  B6: '거의 없음',
  C1: '원금 손실 절대 불가',
  C2: '1년 미만',
  C3: '무조건 안전 최우선',
  C4: '전부 매도하고 현금 보유',
  C5: '연 3% 미만 (예금 수준)',
  D1: '완전 자동으로 맡기고 싶다',
  D2: '매달 배당으로 현금 흐름을 만들고 싶다',
  E1: '별로 FOMO를 느끼지 않는 편',
}

describe('calculateRiskScore', () => {
  it('최고점 답변은 높은 점수를 반환한다', () => {
    const score = calculateRiskScore(maxAnswers)
    expect(score).toBeGreaterThan(60)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('최저점 답변은 낮은 점수를 반환한다', () => {
    const score = calculateRiskScore(minAnswers)
    expect(score).toBeLessThan(40)
    expect(score).toBeGreaterThanOrEqual(0)
  })

  it('빈 답변은 0을 반환한다', () => {
    const score = calculateRiskScore({})
    expect(score).toBe(0)
  })

  it('점수는 항상 0-100 범위 내에 있다', () => {
    const score = calculateRiskScore(maxAnswers)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })
})

describe('classifyRiskLevel', () => {
  it('80 이상은 very_aggressive', () => {
    expect(classifyRiskLevel(80)).toBe('very_aggressive')
    expect(classifyRiskLevel(100)).toBe('very_aggressive')
  })

  it('60-79는 aggressive', () => {
    expect(classifyRiskLevel(60)).toBe('aggressive')
    expect(classifyRiskLevel(79)).toBe('aggressive')
  })

  it('40-59는 moderate', () => {
    expect(classifyRiskLevel(40)).toBe('moderate')
    expect(classifyRiskLevel(59)).toBe('moderate')
  })

  it('20-39는 conservative', () => {
    expect(classifyRiskLevel(20)).toBe('conservative')
    expect(classifyRiskLevel(39)).toBe('conservative')
  })

  it('20 미만은 very_conservative', () => {
    expect(classifyRiskLevel(0)).toBe('very_conservative')
    expect(classifyRiskLevel(19)).toBe('very_conservative')
  })
})

describe('applyEmergencyFundAdjustment', () => {
  it('비상금 1~3개월(score 2)이면 1단계 하향', () => {
    const answers: SurveyAnswers = { ...maxAnswers, B6: '1~3개월' }
    const result = applyEmergencyFundAdjustment('very_aggressive', answers)
    expect(result).toBe('aggressive')
  })

  it('비상금 거의 없음(score 1)이면 1단계 하향', () => {
    const answers: SurveyAnswers = { ...maxAnswers, B6: '거의 없음' }
    const result = applyEmergencyFundAdjustment('moderate', answers)
    expect(result).toBe('conservative')
  })

  it('비상금 6개월 이상(score 5)이면 하향 없음', () => {
    const answers: SurveyAnswers = { ...maxAnswers, B6: '6개월 이상' }
    const result = applyEmergencyFundAdjustment('very_aggressive', answers)
    expect(result).toBe('very_aggressive')
  })

  it('이미 very_conservative이면 더 이상 하향하지 않음', () => {
    const answers: SurveyAnswers = { ...minAnswers, B6: '거의 없음' }
    const result = applyEmergencyFundAdjustment('very_conservative', answers)
    expect(result).toBe('very_conservative')
  })
})
