'use client'

import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import type { PortfolioResult, RiskLevel } from '@/types'
import { RISK_NICKNAMES } from '@/lib/risk-nicknames'
import { registerFonts } from '@/lib/pdf/fonts'
import { PdfDocument } from './PdfDocument'

registerFonts()

interface PdfDownloadButtonProps {
  result: PortfolioResult
  riskLevel: RiskLevel
}

export function PdfDownloadButton({ result, riskLevel }: PdfDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)
    try {
      const blob = await pdf(
        <PdfDocument result={result} riskLevel={riskLevel} />
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `포트폴리오_${RISK_NICKNAMES[riskLevel].nickname}형.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
    >
      {isGenerating ? 'PDF 생성 중...' : 'PDF 다운로드'}
    </button>
  )
}
