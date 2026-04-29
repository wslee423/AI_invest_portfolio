import type {
  SurveyAnswers,
  BehaviorProfile,
  BackgroundProfile,
  InvolvementTag,
  ReturnTypeTag,
  FomoTypeTag,
  LossExperienceTag,
  ActualLossBehaviorTag,
  AffinityInvestingTag,
  LiquidityEventTag,
  MoneyBackgroundTag,
} from '@/types'
import { SURVEY_QUESTIONS } from './config'

export const DEFAULT_BACKGROUND_PROFILE: BackgroundProfile = {
  loss_experience: 'no_major_loss',
  actual_loss_behavior: 'no_loss_experience',
  affinity_investing: 'return_only',
  liquidity_event: 'no_major_event',
  money_background: 'neutral_money_background',
}

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

export function extractBackgroundProfile(
  answers: SurveyAnswers
): BackgroundProfile {
  const f1 = getOption('F1', answers.F1)
  const f2 = getOption('F2', answers.F2)
  const f3 = getOption('F3', answers.F3)
  const f4 = getOption('F4', answers.F4)
  const f5 = getOption('F5', answers.F5)

  return {
    loss_experience: (f1?.tag as LossExperienceTag) ?? 'no_major_loss',
    actual_loss_behavior: (f2?.tag as ActualLossBehaviorTag) ?? 'no_loss_experience',
    affinity_investing: (f3?.tag as AffinityInvestingTag) ?? 'return_only',
    liquidity_event: (f4?.tag as LiquidityEventTag) ?? 'no_major_event',
    money_background: (f5?.tag as MoneyBackgroundTag) ?? 'neutral_money_background',
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
