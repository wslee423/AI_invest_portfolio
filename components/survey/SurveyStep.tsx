'use client'

import type { SurveyAnswers } from '@/types'
import { SURVEY_QUESTIONS, SURVEY_STEPS } from '@/lib/survey/config'
import { SurveyQuestion } from './SurveyQuestion'

interface SurveyStepProps {
  currentStep: number
  answers: SurveyAnswers
  onAnswerChange: (questionId: keyof SurveyAnswers, answer: string) => void
  onNext: () => void
  onPrevious: () => void
  onComplete: () => void
}

export function SurveyStep({
  currentStep,
  answers,
  onAnswerChange,
  onNext,
  onPrevious,
  onComplete,
}: SurveyStepProps) {
  const step = SURVEY_STEPS[currentStep - 1]
  if (!step) return null

  const questions = step.questions
    .map((qId) => SURVEY_QUESTIONS.find((q) => q.id === qId))
    .filter((q): q is NonNullable<typeof q> => q !== undefined)

  const isStepComplete = questions.every(
    (q) => answers[q.id as keyof SurveyAnswers]
  )

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} / {SURVEY_STEPS.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / SURVEY_STEPS.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / SURVEY_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-8">{step.title}</h2>

      <div className="mb-8">
        {questions.map((question) => (
          <SurveyQuestion
            key={question.id}
            question={question}
            selectedAnswer={answers[question.id as keyof SurveyAnswers]}
            onAnswerChange={(answer) => {
              onAnswerChange(question.id as keyof SurveyAnswers, answer)
            }}
          />
        ))}
      </div>

      <div className="flex gap-3">
        {currentStep > 1 && (
          <button
            onClick={onPrevious}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            이전
          </button>
        )}
        {currentStep < SURVEY_STEPS.length ? (
          <button
            onClick={onNext}
            disabled={!isStepComplete}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            다음
          </button>
        ) : (
          <button
            onClick={onComplete}
            disabled={!isStepComplete}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            완료
          </button>
        )}
      </div>
    </div>
  )
}
