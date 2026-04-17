'use client'

import { useEffect, useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import type { PortfolioResult } from '@/types'
import { registerFonts } from '@/lib/pdf/fonts'
import { PdfDocument } from './PdfDocument'

interface PdfDownloadButtonProps {
  result: PortfolioResult
}

export function PdfDownloadButton({ result }: PdfDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    registerFonts()
    setReady(true)
  }, [])

  const handleDownload = async () => {
    setIsGenerating(true)
    try {
      const blob = await pdf(<PdfDocument result={result} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `포트폴리오_${result.risk_label}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!ready) return null

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
