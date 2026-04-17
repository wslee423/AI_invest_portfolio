import {
  Document,
  Page,
  View,
  Text,
} from '@react-pdf/renderer'
import type { PortfolioResult, RiskLevel } from '@/types'
import { RISK_NICKNAMES } from '@/lib/risk-nicknames'
import { styles } from './styles'

interface PdfDocumentProps {
  result: PortfolioResult
  riskLevel: RiskLevel
}

export function PdfDocument({ result, riskLevel }: PdfDocumentProps) {
  const { nickname, emoji, tagline } = RISK_NICKNAMES[riskLevel]

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>나의 투자 성향</Text>
          <Text style={styles.headerTitle}>{emoji} &apos;{nickname}&apos; 형</Text>
          <Text style={[styles.headerDesc, { marginBottom: 4 }]}>{tagline}</Text>
          <Text style={styles.headerDesc}>{result.risk_description}</Text>
        </View>

        {/* 한 줄 요약 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>요약</Text>
          <Text style={styles.body}>{result.summary}</Text>
        </View>

        {/* 자산 배분 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>자산 배분</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.colAsset}>자산군</Text>
            <Text style={styles.colRatio}>비중</Text>
            <Text style={[styles.colDesc, { color: '#374151' }]}>설명</Text>
          </View>
          {result.allocations.map((a, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colAsset}>{a.asset_class}</Text>
              <Text style={styles.colRatio}>{a.ratio}%</Text>
              <View style={styles.colDesc}>
                <Text>{a.description}</Text>
                {a.examples.length > 0 && (
                  <Text style={{ fontSize: 8, color: '#6B7280', marginTop: 2 }}>
                    예시: {a.examples.join(', ')}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* 리스크 지표 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>리스크 지표</Text>
          <View style={styles.indicatorGrid}>
            {result.risk_indicators.map((ind, i) => (
              <View key={i} style={styles.indicatorBox}>
                <Text style={styles.indicatorLabel}>{ind.label}</Text>
                <Text style={styles.indicatorValue}>{ind.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 배분 근거 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>배분 근거</Text>
          <Text style={styles.body}>{result.reasoning}</Text>
        </View>

        {/* 행동 조언 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>투자 행동 조언</Text>
          <Text style={styles.body}>{result.behavior_advice}</Text>
        </View>

        {/* 법적 고지 (고정 푸터) */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            [투자 유의사항] 이 포트폴리오는 AI가 생성한 참고 자료이며 투자 권유가 아닙니다.
            투자에는 원금 손실 위험이 있으며 과거 수익률이 미래를 보장하지 않습니다.
            최종 투자 결정은 본인의 책임입니다.
          </Text>
        </View>
      </Page>
    </Document>
  )
}
