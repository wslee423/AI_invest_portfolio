# product-specs/portfolio.md — 포트폴리오 생성 스펙

> Phase 3 구현 기준 문서.
> OpenAI 연동, 프롬프트 설계, 응답 스키마, 결과 UI 포함.

---

## 1. 개요

성향 진단 완료 후 `/result` 페이지 진입 시 자동으로 OpenAI API를 호출하여
맞춤 포트폴리오를 생성하고 화면에 표시한다.

```
sessionStorage (riskLevel, behavior_profile, 수치 데이터)
  ↓
POST /api/portfolio
  ↓ OpenAI gpt-4.1 Structured Outputs 호출 (PII 없음)
  ↓ Zod 이중 검증
  ↓ 결과 반환 (서버 저장 없음)
/result 페이지 렌더링
  ↓ sessionStorage에 portfolio 저장 (PDF 생성용)
```

---

## 2. API Route 스펙

### 엔드포인트
```
POST /api/portfolio
Content-Type: application/json
```

### 입력 스키마 (PortfolioRequest)
```ts
// CONSTITUTION 원칙 4: PII 미포함, 수치·enum·tag만 전달
interface PortfolioRequest {
  risk_level: RiskLevel
  monthly_investment: number        // 월 투자 가능 금액 (원)
  investment_period_years: number   // 투자 기간 (년)
  loss_tolerance_pct: number        // 허용 손실 %
  behavior_profile: {
    involvement: InvolvementTag
    return_type: ReturnTypeTag
    fomo_type: FomoTypeTag
  }
}
```

### 출력 스키마 (PortfolioResult)
```ts
// CONSTITUTION 원칙 3: reasoning 필드 필수 (z.string().min(1) 검증)
interface PortfolioResult {
  risk_label: string                // 예: "공격형 투자자"
  risk_description: string          // 2~3문장 성향 설명
  allocations: {
    asset_class: AssetClass         // 6종 중 하나
    ratio: number                   // 배분 비율 (%), 전체 합계 = 100
    description: string             // 해당 자산 선택 이유 1문장
  }[]
  reasoning: string                 // 포트폴리오 구성 근거 3~5문장
  risk_indicators: {
    label: string                   // 예: "예상 연 수익률"
    value: string                   // 예: "8~12%"
  }[]
  behavior_advice: string           // 행동 프로파일 기반 맞춤 조언 2~3문장
  summary: string                   // PDF 요약용 핵심 한 문단
}

type AssetClass = '국내주식' | '해외ETF' | '채권' | '리츠' | '금' | '현금성'
```

### 에러 응답
```ts
interface PortfolioError {
  code: 'OPENAI_ERROR' | 'VALIDATION_ERROR' | 'TIMEOUT'
  message: string   // 한국어 에러 메시지
}
```

### Route 처리 흐름
```ts
export async function POST(req: Request) {
  // 1. 입력 Zod 검증
  // 2. OpenAI gpt-4.1 Structured Outputs 호출 (타임아웃 25s)
  // 3. 응답 Zod 검증 (reasoning.min(1), allocations 합계 100)
  // 4. 결과 반환 (서버 저장 없음 — CONSTITUTION 원칙 2)
}
export const maxDuration = 30
```

---

## 3. OpenAI 프롬프트 설계

### 응답 방식: Structured Outputs
```ts
// JSON mode 대신 Structured Outputs 사용
// 스키마를 API에 직접 전달하여 hallucination 최소화
// response_format: { type: 'json_schema', json_schema: portfolioJsonSchema }
// portfolioJsonSchema는 PortfolioResult 인터페이스를 JSON Schema로 변환한 것
// 위치: lib/openai/schema.ts
```

### 시스템 프롬프트 (`lib/openai/prompts.ts`)
```
당신은 대한민국의 전문 투자 자문가입니다.
사용자의 투자 성향 분석 결과를 바탕으로 맞춤형 포트폴리오를 구성해주세요.

[규칙]
- allocations의 ratio 합계는 반드시 100이어야 합니다.
- 사용 가능한 자산군: 국내주식, 해외ETF, 채권, 리츠, 금, 현금성
- reasoning은 한국어로 3~5문장, 구체적인 근거를 포함합니다.
- behavior_advice는 투자 관여도·수익 선호·FOMO 유형을 반영한 실용적 조언입니다.
- 모든 설명은 금융 비전문가가 이해할 수 있는 쉬운 언어로 작성합니다.

[등급별 자산 배분 가이드라인]
very_conservative : 현금성 30~40%, 채권 30~40%, 국내주식 10~20%, 나머지 분산
conservative      : 채권 30~40%, 국내주식 20~30%, 현금성 10~20%, 나머지 분산
moderate          : 국내주식 25~35%, 해외ETF 20~30%, 채권 15~25%, 나머지 분산
aggressive        : 국내주식 30~40%, 해외ETF 25~35%, 리츠 10~15%, 나머지 분산
very_aggressive   : 해외ETF 35~45%, 국내주식 25~35%, 나머지 성장 자산 중심

[행동 프로파일 반영 규칙]
return_type=income 또는 income_growth   : 리츠·배당ETF 비중 확대, 현금흐름 중심 서술
return_type=growth                      : 성장형 해외ETF 비중 확대, 배당 최소화
involvement=passive 또는 full_passive   : 인덱스 ETF 중심, 자동화 전략 권장 서술
fomo_type=exclusion 또는 social_pressure: reasoning에 분산 투자 중요성 및
                                          단기 충동 매매 리스크 경고 포함

[출력 JSON 구조]
아래 구조를 정확히 따르세요:
{
  "risk_label": "공격형 투자자",
  "risk_description": "...",
  "allocations": [
    { "asset_class": "국내주식", "ratio": 35, "description": "..." },
    ...
  ],
  "reasoning": "...",
  "risk_indicators": [
    { "label": "예상 연 수익률", "value": "8~12%" },
    { "label": "최대 손실 예상", "value": "20~25%" }
  ],
  "behavior_advice": "...",
  "summary": "..."
}
```

### 사용자 입력 포맷
```
투자 성향 등급: {risk_level}
월 투자 가능 금액: {monthly_investment}원
투자 기간: {investment_period_years}년
허용 손실 범위: {loss_tolerance_pct}%
투자 관여도: {involvement}
수익 실현 선호: {return_type}
FOMO 유형: {fomo_type}
```

---

## 4. 등급별 포트폴리오 예시

> 구현 참고용. 실제 AI 응답은 behavior_profile에 따라 달라짐.

| 자산군 | 매우안정 | 안정 | 중립 | 공격 | 매우공격 |
|--------|---------|------|------|------|---------|
| 국내주식 | 10% | 20% | 30% | 35% | 25% |
| 해외ETF | 5% | 10% | 25% | 30% | 40% |
| 채권 | 35% | 35% | 20% | 10% | 5% |
| 리츠 | 5% | 10% | 10% | 15% | 15% |
| 금 | 5% | 5% | 5% | 5% | 10% |
| 현금성 | 40% | 20% | 10% | 5% | 5% |

---

## 5. 결과 UI 스펙

### 페이지 구조 (`/result`)

```
[성향 요약 카드]      risk_label + risk_description
[자산 배분 섹션]      도넛 차트 + 자산군별 비율·description
[AI 판단 근거]        reasoning 전문 (CONSTITUTION 원칙 3)
[리스크 지표]         risk_indicators 리스트
[투자 행동 조언]      behavior_advice
[투자 고지 문구]      DisclaimerBanner (CONSTITUTION 원칙 1, 숨김 불가)
[액션 버튼]           PDF 다운로드 / 다시 진단하기
```

### UI 상태 (3가지 모두 구현 필수)

```tsx
// Loading
<ResultSkeleton />

// Error
<ErrorMessage message={error.message} />
<RetryButton onClick={refetch} />

// Success
<RiskSummaryCard data={portfolio} />
<AllocationChart data={portfolio.allocations} />   // Recharts PieChart
<ReasoningSection reasoning={portfolio.reasoning} />
<RiskIndicators indicators={portfolio.risk_indicators} />
<BehaviorAdvice advice={portfolio.behavior_advice} />
<DisclaimerBanner />                               // CONSTITUTION 원칙 1
<PdfDownloadButton data={portfolio} />
<RetryDiagnosisButton />
```

### DisclaimerBanner 스펙
```
위치: components/features/disclaimer/DisclaimerBanner.tsx
문구: "본 서비스는 투자 참고 정보를 제공하며 수익을 보장하지 않습니다.
      투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다."
규칙: display:none / hidden / opacity:0 처리 금지 (CONSTITUTION 원칙 1)
```

---

## 6. 차트 스펙

| 항목 | 결정 |
|------|------|
| 라이브러리 | Recharts (승인 완료 2026-04-16) |
| 차트 타입 | PieChart (도넛형) + 범례 리스트 |
| 색상 | 자산군별 고정: 국내주식 blue / 해외ETF indigo / 채권 green / 리츠 amber / 금 yellow / 현금성 gray |
| 반응형 | ResponsiveContainer 사용 |
| 애니메이션 | 진입 시 1회 |

---

## 7. sessionStorage 업데이트

```ts
const session = getSession()
session.portfolio = portfolioResult
setSession(session)
```

---

## 8. 구현 순서

```
1. types/index.ts — PortfolioRequest, PortfolioResult, AssetClass 타입 추가
2. lib/openai/schema.ts — Zod 스키마 + JSON Schema 변환 (Structured Outputs용)
3. lib/openai/prompts.ts — 시스템 프롬프트 + 입력 포맷 함수
4. lib/openai/client.ts — OpenAI 클라이언트 (타임아웃 25s)
5. app/api/portfolio/route.ts — API Route 구현
6. components/features/disclaimer/DisclaimerBanner.tsx
7. components/features/result/ — 결과 UI 컴포넌트
8. app/result/page.tsx — Loading / Success / Error 3가지 UI 상태
9. 단위 테스트 — API Route 정상·에러 케이스
```

---

## 9. 구현 시 주의사항

- `allocations` 합계 검증은 Zod 스키마와 Route 양쪽에서 이중 검증
- `reasoning` 빈 문자열 차단: `z.string().min(1)`
- `/result` 진입 시 `riskLevel` 없으면 즉시 `/onboarding` 리다이렉트 (useEffect 첫 줄)
- OpenAI 응답 실패 시 재시도는 동일 sessionStorage 데이터로 재호출
- Structured Outputs JSON Schema는 `lib/openai/schema.ts`에서 Zod 스키마와 함께 관리
