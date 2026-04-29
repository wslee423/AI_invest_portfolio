import type { SurveyAnswers, RiskLevel } from '@/types'
import { SURVEY_QUESTIONS, SCORE_CONFIG } from './config'

export function calculateRiskScore(answers: SurveyAnswers): number {
  const categoryScores: Record<string, { total: number; count: number }> = {
    A: { total: 0, count: 0 },
    B: { total: 0, count: 0 },
    C: { total: 0, count: 0 },
    D: { total: 0, count: 0 },
    E: { total: 0, count: 0 },
    F: { total: 0, count: 0 }, // F 파트: 가중치 0 — 점수 미반영
  }

  // 각 질문의 선택지 점수 합산
  for (const question of SURVEY_QUESTIONS) {
    const answerId = question.id as keyof SurveyAnswers
    const selectedOptionLabel = answers[answerId]

    if (!selectedOptionLabel) continue

    const selectedOption = question.options.find(
      (opt) => opt.label === selectedOptionLabel
    )
    if (!selectedOption || selectedOption.score === undefined) continue

    const category = question.category
    categoryScores[category].total += selectedOption.score
    categoryScores[category].count += 1
  }

  // 카테고리별 평균 점수 계산
  const categoryAverages: Record<string, number> = {}
  for (const [category, scores] of Object.entries(categoryScores)) {
    if (scores.count > 0) {
      categoryAverages[category] = scores.total / scores.count
    }
  }

  // 가중치 적용 (F 파트는 WEIGHTS.F = 0이므로 점수에 영향 없음)
  const weightedScore =
    (categoryAverages['A'] || 0) * SCORE_CONFIG.WEIGHTS.A +
    (categoryAverages['B'] || 0) * SCORE_CONFIG.WEIGHTS.B +
    (categoryAverages['C'] || 0) * SCORE_CONFIG.WEIGHTS.C +
    (categoryAverages['D'] || 0) * SCORE_CONFIG.WEIGHTS.D +
    (categoryAverages['E'] || 0) * SCORE_CONFIG.WEIGHTS.E +
    (categoryAverages['F'] || 0) * SCORE_CONFIG.WEIGHTS.F

  // 가중치 총합
  const totalWeight =
    SCORE_CONFIG.WEIGHTS.A +
    SCORE_CONFIG.WEIGHTS.B +
    SCORE_CONFIG.WEIGHTS.C +
    SCORE_CONFIG.WEIGHTS.D +
    SCORE_CONFIG.WEIGHTS.E +
    SCORE_CONFIG.WEIGHTS.F

  // 가중 평균 1~5점을 0~100으로 선형 매핑
  // (avg - 1) / 4 * 100 — 최저 1점=0, 최고 5점=100
  const weightedAvg = weightedScore / totalWeight
  const normalizedScore = ((weightedAvg - 1) / 4) * 100

  return Math.min(100, Math.max(0, normalizedScore))
}

export function classifyRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'very_aggressive'
  if (score >= 60) return 'aggressive'
  if (score >= 40) return 'moderate'
  if (score >= 20) return 'conservative'
  return 'very_conservative'
}

export function applyEmergencyFundAdjustment(
  riskLevel: RiskLevel,
  answers: SurveyAnswers
): RiskLevel {
  // B6 (비상금 보유 여부) 확인
  const b6Answer = answers.B6
  const b6Question = SURVEY_QUESTIONS.find((q) => q.id === 'B6')
  const b6Option = b6Question?.options.find((opt) => opt.label === b6Answer)

  // B6 점수가 2 이하(1~3개월 미만 = score 2, 거의 없음 = score 1)이면 1단계 하향
  if (b6Option && b6Option.score !== undefined && b6Option.score <= 2) {
    const levels: RiskLevel[] = [
      'very_conservative',
      'conservative',
      'moderate',
      'aggressive',
      'very_aggressive',
    ]
    const currentIndex = levels.indexOf(riskLevel)
    if (currentIndex > 0) {
      return levels[currentIndex - 1]
    }
  }

  return riskLevel
}
