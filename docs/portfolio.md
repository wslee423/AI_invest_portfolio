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
  background_profile: {             // F 파트 응답 — 리스크 점수 미반영, 포트폴리오 modifier
    loss_experience: LossExperienceTag
    actual_loss_behavior: ActualLossBehaviorTag
    affinity_investing: AffinityInvestingTag
    liquidity_event: LiquidityEventTag
    money_background: MoneyBackgroundTag
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
    examples: string[]              // 실매수 가능 종목·ETF 1~3개
  }[]
  reasoning: string                 // 포트폴리오 구성 근거 3~5문장
  risk_indicators: {
    label: string                   // 예: "예상 연 수익률"
    value: string                   // 예: "8~12%"
  }[]
  behavior_advice: string           // 행동 프로파일 기반 맞춤 조언 (유머체)
  summary: string                   // PDF 요약용 핵심 한 문단
  background_highlights?: string[]  // background_profile 반영 포인트 2~3개 (optional, backward compat)
  portfolio_plans: PortfolioPlan[]  // 동일 자산배분 기반 3가지 접근 플랜
}

interface PortfolioPlan {
  plan_name: string
  plan_description: string
  holdings: {
    ticker: string
    asset_class: string
    monthly_amount: number
    approx_price: number
    approx_shares: number
  }[]
  total_monthly: number
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

#### 기본 규칙
- `allocations.ratio` 합계 반드시 100
- 자산군: 국내주식, 해외ETF, 채권, 리츠, 금, 현금성 (최소 2종, 최대 6종)
- 레버리지 ETF·단기 투기 상품·파생형 상품 모든 등급 금지
- 답변은 반드시 한국어

#### 등급별 자산 배분 가이드라인

| 항목 | very_conservative | conservative | moderate | aggressive | very_aggressive |
|------|:-----------------:|:------------:|:--------:|:----------:|:---------------:|
| 안정자산 (현금성·채권·금) | 70~90% | 50~70% | 25~45% | 10~25% | 0~15% |
| 글로벌 대표지수 ETF | 5~20% | 20~35% | 35~50% | 40~55% | 35~50% |
| 국내주식·국내ETF | 0~10% | 5~15% | 10~20% | 10~20% | 10~20% |
| 섹터/테마 ETF | 금지 | 배당ETF 한해 0~5% | 0~10% (합산 10% 초과 금지) | 10~20% | 15~25% |
| 해외 개별주 | 금지 | 금지 | 0~5% (조건부) | 0~10% (조건부) | 5~20% (조건부) |

> **조건부** = `affinity_investing`이 `brand_affinity` 또는 `knowledge_based_sector`인 경우에만 허용  
> aggressive·very_aggressive는 섹터/개별주 편입 시 `reasoning`에 근거 명시 필수  
> very_aggressive: 섹터+테마+개별주 합산 35% 초과 금지

#### 배당주·배당ETF 조정 규칙 (return_type 기반)

배당 자산은 별도 자산군이 아닌 **국내주식·해외ETF 항목 내 종목 선택**으로 반영한다.

| return_type | 방향 | 대표 예시 종목 |
|-------------|------|--------------|
| `income` | 배당ETF·배당성장주 해당 자산군 내 최대화, 현금흐름 설명 | QYLD, SCHD, VYM, KODEX고배당 |
| `income_growth` | 배당성장ETF 주력 + 성장ETF 보조 | VIG, DGRO, TIGER배당성장 |
| `balanced` | 성장ETF · 배당ETF 균형 | — |
| `growth_income` | 성장ETF 주력 + 배당ETF 소량 | — |
| `growth` | 배당ETF 최소화·제외, 성장ETF 중심 | QQQ, SCHG, CSPX |

#### background_profile 해석 규칙

`background_profile`은 리스크 점수를 직접 바꾸지 않고 포트폴리오 구성 보정·reasoning·behavior_advice에 modifier로 반영한다.

- `recovery_pressure`: 공격형 해석 금지, 빠른 만회 시도 위험성 경고 필수
- `panic_sell_history` / `loss_anxiety`: 변동성 낮은 자산 비중 상향
- `revenge_trading`: 섹터/개별주 하한 적용, 감정 관리 조언 필수
- `disciplined_hold`: 장기 성장형 자산 등급 가이드 상한까지 허용
- `knowledge_based_sector` / `brand_affinity`: 등급 내 개별주/섹터 ETF 위성 편입 허용
- `emotional_attachment_risk`: 개별주 등급 하한 이하 제한
- `housing_event` / `career_transition` / `family_support_risk`: 안정자산 5~10%p 상향, 자금 분리 조언 필수
- `capital_preservation_belief` / `investment_distrust_background`: 안정성·원칙 중심 설명 톤

#### behavior_advice 작성 규칙

FOMO 유형과 관여도를 고려한 친근·유머 있는 말투로 작성. 적절한 비유·밈 표현 허용.

#### portfolio_plans 작성 규칙

동일 자산배분 비율 유지 + 서로 다른 접근 전략 3가지.  
`approx_price`는 2025년 기준 원화 단가 (해외 ETF는 1달러=1,400원 환산).  
`total_monthly` = holdings의 `monthly_amount` 합계 = 입력 월 투자금.

### 사용자 입력 포맷
```
[투자 성향 점수 기반]
투자 성향: {risk_label}
월 투자 가능 금액: {monthly_investment}원
투자 기간: {investment_period_years}년
최대 손실 허용: {loss_tolerance_pct}%
관여도: {involvement_label}
수익 선호: {return_type_label}
FOMO 유형: {fomo_type}

[투자 배경 (포트폴리오 보정용)]
손실 경험: {loss_experience_label}
손실 시 실제 행동: {actual_loss_behavior_label}
관심·애착 투자 성향: {affinity_label}
3년 내 유동성 이벤트: {liquidity_label}
금전 가치관 배경: {money_background_label}
```

---

## 4. 등급별 포트폴리오 방향 및 예시

> 구현 참고용. 실제 AI 응답은 behavior_profile·background_profile에 따라 달라짐.

### 안정자산 비중 범위

| 자산군 | 매우안정 | 안정 | 중립 | 공격 | 매우공격 |
|--------|:---------:|:----:|:----:|:----:|:--------:|
| 안정자산 합계 | 70~90% | 50~70% | 25~45% | 10~25% | 0~15% |
| 글로벌 지수 ETF | 5~20% | 20~35% | 35~50% | 40~55% | 35~50% |
| 국내주식·ETF | 0~10% | 5~15% | 10~20% | 10~20% | 10~20% |
| 섹터/테마 ETF | 금지 | 0~5% | 0~10% | 10~20% | 15~25% |
| 해외 개별주 | 금지 | 금지 | 0~5%* | 0~10%* | 5~20%* |

\* 조건부: `affinity_investing = brand_affinity / knowledge_based_sector` 인 경우만 허용

### 대표 예시 구성 (월 100만원, balanced, return_only 기준)

| 자산군 | 매우안정 | 안정 | 중립 | 공격 | 매우공격 |
|--------|:-------:|:----:|:----:|:----:|:--------:|
| 현금성 | 40% | 20% | 10% | 5% | 0% |
| 채권 | 35% | 35% | 20% | 10% | 5% |
| 금 | 10% | 10% | 10% | 5% | 5% |
| 해외ETF | 10% | 20% | 35% | 45% | 50% |
| 국내주식 | 5% | 10% | 15% | 15% | 25% |
| 리츠 | 0% | 5% | 10% | 20% | 15% |

---

## 5. 결과 UI 스펙

### 페이지 구조 (`/result`)

```
[성향 요약 카드]          risk_label + risk_description
[한 줄 요약]              summary
[자산 배분 섹션]          도넛 차트 + 자산군별 비율·description·examples
[리스크 지표]             risk_indicators 리스트 (예상 수익률·MDD·변동성)
[배분 근거]               reasoning 전문 (CONSTITUTION 원칙 3)
[투자 배경 반영 포인트]   background_highlights (있을 때만 표시)
[투자 행동 조언]          behavior_advice (유머체)
[추천 포트폴리오 플랜]    portfolio_plans 3가지 카드
[투자 고지 문구]          DisclaimerBanner (CONSTITUTION 원칙 1, 숨김 불가)
[액션 버튼]               PDF 다운로드 / 다시 진단하기
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
