# product-specs/pdf.md — PDF 출력 스펙

> Phase 5 구현 기준 문서.
> @react-pdf/renderer 기반 클라이언트 사이드 PDF 생성 및 다운로드.

---

## 1. 개요

[PDF 다운로드] 버튼 클릭 시 sessionStorage의 PortfolioResult를 읽어
클라이언트에서 즉시 PDF를 생성하고 다운로드한다.
서버 요청 없음. Vercel 함수 사용 없음.

**라이브러리**: `@react-pdf/renderer` (승인 완료 — OD-005)

---

## 2. PDF 구성 (A4 세로, 다중 페이지)

```
[페이지 1~N: 동적 페이지]
┌─────────────────────────────────────┐
│  헤더: 서비스명 + 생성 일시          │
├─────────────────────────────────────┤
│  섹션 1: 투자 성향 요약              │
├─────────────────────────────────────┤
│  섹션 2: 자산 배분 테이블            │
│    (자산군 | 비율 | 설명 | 예시)    │
├─────────────────────────────────────┤
│  섹션 3: 리스크 지표                 │
├─────────────────────────────────────┤
│  섹션 4: AI 판단 근거 (reasoning)   │
├─────────────────────────────────────┤
│  섹션 5: 투자 배경 반영 포인트       │  (있을 때만)
├─────────────────────────────────────┤
│  섹션 6: 투자 행동 조언              │
├─────────────────────────────────────┤
│  섹션 7: 추천 포트폴리오 플랜        │
│    (플랜 1·2·3 각 보유 종목 테이블) │
├─────────────────────────────────────┤
│  푸터: DisclaimerBanner (고정)      │  ← CONSTITUTION 원칙 1 필수
└─────────────────────────────────────┘
```

내용 초과 시 자동 다중 페이지. 푸터(`fixed`)는 모든 페이지에 표시.

---

## 3. 한글 폰트 설정

```ts
// lib/pdf/fonts.ts — 앱 초기화 시 1회만 실행
import { Font } from '@react-pdf/renderer'

Font.register({
  family: 'NotoSansKR',
  fonts: [
    { src: '/fonts/NotoSansKR-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/NotoSansKR-Medium.ttf',  fontWeight: 500 },
    { src: '/fonts/NotoSansKR-Bold.ttf',    fontWeight: 700 },
  ],
})
```

**폰트 파일**: `public/fonts/` — Google Fonts Noto Sans KR (오픈소스)
**Phase 4 시작 전**: ttf 3종 파일을 `public/fonts/`에 직접 배치 필요

---

## 4. 컴포넌트 구조

```
components/features/pdf/
  PdfDocument.tsx            ← 전체 PDF 문서 루트 (use client 불필요)
                               PortfolioResult props → 각 섹션 조건부 렌더링
  PdfRiskSummary.tsx         ← 투자 성향 요약
  PdfAllocationTable.tsx      ← 자산 배분 (자산군 | 비율 | description | examples)
  PdfRiskIndicators.tsx       ← 리스크 지표
  PdfReasoning.tsx            ← AI 판단 근거
  PdfBackgroundHighlights.tsx ← 투자 배경 반영 (background_highlights 있을 때만)
  PdfBehaviorAdvice.tsx       ← 투자 행동 조언
  PdfPortfolioPlans.tsx       ← 추천 포트폴리오 플랜 (3가지 플랜 테이블)
  PdfFooter.tsx               ← DisclaimerBanner (fixed, CONSTITUTION 원칙 1)
  PdfDownloadButton.tsx       ← 'use client' + dynamic(ssr:false) 필수
  styles.ts                   ← 공용 StyleSheet 정의
```

---

## 5. 스타일 구조

```ts
// components/features/pdf/styles.ts
// @react-pdf/renderer StyleSheet.create()로 정의
// 세부 수치는 구현 시 조정 가능. 아래는 필요한 속성 목록.

page          : fontFamily(NotoSansKR), fontSize, color, padding
section       : marginBottom
sectionTitle  : fontSize(크게), fontWeight(bold), borderBottom
bodyText      : fontSize, lineHeight, color

header        : flexDirection(row), justifyContent(space-between), borderBottom
serviceName   : fontSize(크게), fontWeight(bold), color(brand)
generatedAt   : fontSize(작게), color(muted)

table         : width(100%)
tableHeader   : flexDirection(row), backgroundColor, fontWeight(bold)
tableRow      : flexDirection(row), borderBottom
colAsset      : width(20%)
colRatio      : width(15%), textAlign(right)
colDesc       : width(65%)

indicatorRow  : flexDirection(row), justifyContent(space-between)
indicatorLabel: color(muted)
indicatorValue: fontWeight(medium)

footer        : position(absolute), bottom, left, right, borderTop, fixed
disclaimer    : fontSize(작게), color(muted), textAlign(center)
```

---

## 6. PdfDocument 컴포넌트

```tsx
// components/features/pdf/PdfDocument.tsx
// 'use client' 불필요 — @react-pdf는 React DOM이 아님
// dynamic import로 처리하는 PdfDownloadButton에서 ssr:false 적용

import { Document, Page } from '@react-pdf/renderer'
import { PortfolioResult } from '@/types'
import { styles } from './styles'
import PdfHeader from './PdfHeader'
import PdfRiskSummary from './PdfRiskSummary'
import PdfAllocationTable from './PdfAllocationTable'
import PdfReasoning from './PdfReasoning'
import PdfRiskIndicators from './PdfRiskIndicators'
import PdfBehaviorAdvice from './PdfBehaviorAdvice'
import PdfFooter from './PdfFooter'

interface Props {
  data: PortfolioResult
  generatedAt: string   // 'YYYY년 MM월 DD일'
}

export default function PdfDocument({ data, generatedAt }: Props) {
  return (
    <Document>
      <Page style={styles.page}>
        <PdfHeader generatedAt={generatedAt} />
        <PdfRiskSummary label={data.risk_label} description={data.risk_description} />
        <PdfAllocationTable allocations={data.allocations} />
        <PdfReasoning reasoning={data.reasoning} />
        <PdfRiskIndicators indicators={data.risk_indicators} />
        <PdfBehaviorAdvice advice={data.behavior_advice} />
        <PdfFooter />
      </Page>
    </Document>
  )
}
```

---

## 7. PdfDownloadButton 컴포넌트

```tsx
// components/features/pdf/PdfDownloadButton.tsx
'use client'

import dynamic from 'next/dynamic'
import { PortfolioResult } from '@/types'
import { formatDate } from '@/lib/utils'

// @react-pdf/renderer SSR 미지원 → dynamic import 필수
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(m => m.PDFDownloadLink),
  { ssr: false }
)
const PdfDocument = dynamic(() => import('./PdfDocument'), { ssr: false })

interface Props { data: PortfolioResult }

export default function PdfDownloadButton({ data }: Props) {
  const generatedAt = formatDate(new Date())
  const fileName = `portfolio_${Date.now()}.pdf`

  return (
    <PDFDownloadLink
      document={<PdfDocument data={data} generatedAt={generatedAt} />}
      fileName={fileName}
    >
      {({ loading }) => (
        <button disabled={loading}>
          {loading ? 'PDF 생성 중...' : 'PDF 다운로드'}
        </button>
      )}
    </PDFDownloadLink>
  )
}
```

---

## 8. PdfFooter (DisclaimerBanner)

```tsx
// CONSTITUTION 원칙 1: PDF에도 투자 고지 문구 필수
// fixed prop: 다페이지 시 모든 페이지 하단 고정

import { View, Text } from '@react-pdf/renderer'
import { styles } from './styles'

export default function PdfFooter() {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.disclaimer}>
        본 서비스는 투자 참고 정보를 제공하며 수익을 보장하지 않습니다.{'\n'}
        투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.
        본 자료는 금융투자상품 판매 권유가 아닙니다.
      </Text>
    </View>
  )
}
```

---

## 9. 구현 순서

```
1. public/fonts/ — NotoSansKR ttf 3종 배치
2. lib/pdf/fonts.ts — Font.register (앱 최상위에서 import)
3. components/features/pdf/styles.ts
4. components/features/pdf/PdfFooter.tsx (CONSTITUTION 원칙 1)
5. components/features/pdf/Pdf*.tsx — 섹션별 컴포넌트
6. components/features/pdf/PdfDocument.tsx
7. components/features/pdf/PdfDownloadButton.tsx (dynamic + ssr:false)
8. app/result/page.tsx — PdfDownloadButton 연결
```

---

## 10. 검증 기준

| 항목 | 확인 방법 |
|------|----------|
| 한글 폰트 깨짐 없음 | PDF 직접 열어서 확인 |
| A4 레이아웃 이탈 없음 | PDF 직접 열어서 확인 |
| DisclaimerBanner 존재 | PDF 하단 확인 |
| reasoning 섹션 존재 | PDF 섹션 3 확인 |
| 자산 배분 합계 100% | 표 수치 확인 |
| SSR 에러 없음 | 개발 서버 콘솔 확인 |
| 다운로드 파일명 형식 | `portfolio_{timestamp}.pdf` |

---

## 11. 구현 시 주의사항

- `@react-pdf/renderer`는 `app/api/` 환경에서 import 금지 — 클라이언트 전용
- `PdfDocument`에 `'use client'` 추가 금지 — dynamic import로 처리
- `lib/pdf/fonts.ts`는 앱 초기화 시 1회만 실행되도록 최상위에서 import
- `fixed` View는 PdfFooter에만 사용 — 다른 컴포넌트에 사용 시 페이지마다 반복됨
