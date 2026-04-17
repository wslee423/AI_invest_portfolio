'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SurveyAnswers, SessionData } from '@/types'
import { SurveyStep } from '@/components/survey/SurveyStep'
import { SURVEY_STEPS } from '@/lib/survey/config'
import {
  calculateRiskScore,
  classifyRiskLevel,
  applyEmergencyFundAdjustment,
} from '@/lib/survey/calculate'
import {
  extractBehaviorProfile,
  extractMonthlyInvestment,
  extractLossTolerance,
  extractInvestmentPeriod,
} from '@/lib/survey/extract'
import { setSession } from '@/lib/session'

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState<SurveyAnswers>({})

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentStep])

  const handleAnswerChange = (
    questionId: keyof SurveyAnswers,
    answer: string
  ) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentStep < SURVEY_STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    const score = calculateRiskScore(answers)
    const baseLevel = classifyRiskLevel(score)
    const riskLevel = applyEmergencyFundAdjustment(baseLevel, answers)

    const sessionData: SessionData = {
      answers,
      score,
      riskLevel,
      monthly_investment: extractMonthlyInvestment(answers),
      investment_period_years: extractInvestmentPeriod(answers),
      loss_tolerance_pct: extractLossTolerance(answers),
      behavior_profile: extractBehaviorProfile(answers),
    }

    setSession(sessionData)
    router.push('/result')
  }

  return (
    <main className="min-h-screen py-10 px-4 bg-gray-50">
      <SurveyStep
        currentStep={currentStep}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onComplete={handleComplete}
      />
    </main>
  )
}
