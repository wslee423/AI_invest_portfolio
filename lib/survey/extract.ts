import type {
  SurveyAnswers,
  BehaviorProfile,
  InvolvementTag,
  ReturnTypeTag,
  FomoTypeTag,
} from '@/types'
import { SURVEY_QUESTIONS } from './config'

function getOption(questionId: string, label: string | undefined) {
  if (!label) return undefined
  const question = SURVEY_QUESTIONS.find((q) => q.id === questionId)
  return question?.options.find((opt) => opt.label === label)
}

export function extractBehaviorProfile(
  answers: SurveyAnswers
): BehaviorProfile {
  const d1 = getOption('D1', answers.D1)
  const d2 = getOption('D2', answers.D2)
  const e1 = getOption('E1', answers.E1)

  return {
    involvement: (d1?.tag as InvolvementTag) ?? 'semi_passive',
    return_type: (d2?.tag as ReturnTypeTag) ?? 'balanced',
    fomo_type: (e1?.tag as FomoTypeTag) ?? 'low_fomo',
  }
}

export function extractMonthlyInvestment(answers: SurveyAnswers): number {
  const option = getOption('B2', answers.B2)
  return option?.mappedValue ?? 0
}

export function extractLossTolerance(answers: SurveyAnswers): number {
  const option = getOption('C1', answers.C1)
  return option?.mappedValue ?? 0
}

export function extractInvestmentPeriod(answers: SurveyAnswers): number {
  const option = getOption('C2', answers.C2)
  return option?.mappedValue ?? 0
}
