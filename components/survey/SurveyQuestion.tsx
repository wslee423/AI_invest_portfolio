'use client'

import type { SurveyQuestion, SurveyOption } from '@/lib/survey/config'

interface SurveyQuestionProps {
  question: SurveyQuestion
  selectedAnswer: string | undefined
  onAnswerChange: (answer: string) => void
}

export function SurveyQuestion({
  question,
  selectedAnswer,
  onAnswerChange,
}: SurveyQuestionProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {question.title}
      </h3>
      {question.description && (
        <p className="text-sm text-gray-600 mb-4">{question.description}</p>
      )}
      <div className="space-y-3">
        {question.options.map((option: SurveyOption, idx: number) => (
          <label
            key={idx}
            className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input
              type="radio"
              name={question.id}
              value={option.label}
              checked={selectedAnswer === option.label}
              onChange={(e) => onAnswerChange(e.target.value)}
              className="mt-1 mr-3"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
