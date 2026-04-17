# product-specs/onboarding.md — 성향 진단 스펙

> Phase 2 구현 기준 문서.
> 문항 설계, 점수 계산 공식, 등급 경계값, UI 흐름 포함.

---

## 1. 설문 구조 개요

| 항목 | 내용 |
|------|------|
| 총 문항 수 | 17문항 |
| 구성 | 기본정보 3문항 + 재무현황 6문항 + 리스크성향 5문항 + 투자행동패턴 2문항 + FOMO 1문항(태그 전용) |
| 가중치 | 기본정보 1x / 재무현황 1.5x / 리스크성향 2x / 투자행동패턴 1x / FOMO 점수 미반영 |
| 등급 | 5단계 |
| UI 스텝 | 5스텝 |

---

## 2. 문항 설계

### 카테고리 A — 기본정보 (가중치 1x, 문항당 최대 5점)

**A1. 나이대**
> 투자 가능 기간과 리스크 수용 여력의 기초 지표.

| 선택지 | 점수 |
|--------|------|
| 20대 | 5 |
| 30대 | 4 |
| 40대 | 3 |
| 50대 | 2 |
| 60대 이상 | 1 |

**A2. 투자 경험**
> 금융상품 이해도와 손실 경험 여부 측정.

| 선택지 | 점수 |
|--------|------|
| 주식·ETF 직접 투자 3년 이상 | 5 |
| 주식·ETF 직접 투자 1~3년 | 4 |
| 펀드·예금 등 간접 투자만 | 2 |
| 투자 경험 없음 | 1 |

**A3. 투자 목적**
> 노후 준비(장기·변동성 감수 가능) vs 목돈 마련(단기·손실 민감)을 분리.

| 선택지 | 점수 |
|--------|------|
| 자산 증식 (공격적 성장) | 5 |
| 노후 준비 (10년 이상 장기) | 4 |
| 목돈 마련 (3~5년 중기) | 2 |
| 원금 보존 (안전 우선) | 1 |

---

### 카테고리 B — 재무현황 (가중치 1.5x, 문항당 최대 5점 × 1.5 = 7.5점)

**B1. 월 소득 범위**

| 선택지 | 점수 |
|--------|------|
| 700만원 이상 | 5 |
| 500~700만원 | 4 |
| 300~500만원 | 3 |
| 200~300만원 | 2 |
| 200만원 미만 | 1 |

**B2. 월 투자 가능 금액**
> OpenAI 호출 시 `monthly_investment` 값으로 전달.

| 선택지 | 점수 | monthly_investment (원) |
|--------|------|------------------------|
| 500만원 이상 | 5 | 6,000,000 |
| 100~500만원 | 4 | 2,000,000 |
| 50~100만원 | 3 | 750,000 |
| 30~50만원 | 2 | 400,000 |
| 30만원 미만 | 1 | 150,000 |

**B3. 금융 자산 규모**
> 현금·주식·펀드·채권 등 투자 가능한 금융자산 기준 (부동산 제외).

| 선택지 | 점수 |
|--------|------|
| 5억 이상 | 5 |
| 2억~5억 | 4 |
| 5000만~2억 | 3 |
| 1000만~5000만 | 2 |
| 1000만 미만 | 1 |

**B4. 월 고정비용 비중**
> 월 소득 대비 생활비·대출 상환·보험료 등 고정 지출 비중.

| 선택지 | 점수 |
|--------|------|
| 소득의 20% 미만 | 5 |
| 소득의 20~40% | 4 |
| 소득의 40~60% | 3 |
| 소득의 60~80% | 2 |
| 소득의 80% 이상 | 1 |

**B5. 부양가족 여부**

| 선택지 | 점수 |
|--------|------|
| 없음 | 5 |
| 있음 (배우자만) | 3 |
| 있음 (자녀 또는 부모 포함) | 1 |

**B6. 비상금 보유 여부**
> 월 생활비 기준 비상금. 1~3개월 미만이면 최종 등급 1단계 하향 보정.

| 선택지 | 점수 |
|--------|------|
| 6개월 이상 | 5 |
| 3~6개월 | 4 |
| 1~3개월 | 2 |
| 거의 없음 | 1 |

---

### 카테고리 C — 리스크성향 (가중치 2x, 문항당 최대 5점 × 2 = 10점)

**C1. 손실 허용 범위**
> OpenAI 호출 시 `loss_tolerance_pct` 값으로 매핑.

| 선택지 | 점수 | loss_tolerance_pct |
|--------|------|--------------------|
| 30% 이상 손실도 감수 | 5 | 35 |
| 20~30% 손실 감수 | 4 | 25 |
| 10~20% 손실 감수 | 3 | 15 |
| 5~10% 손실 감수 | 2 | 7 |
| 원금 손실 절대 불가 | 1 | 2 |

**C2. 투자 기간**
> OpenAI 호출 시 `investment_period_years` 값으로 매핑.

| 선택지 | 점수 | investment_period_years |
|--------|------|------------------------|
| 10년 이상 | 5 | 15 |
| 5~10년 | 4 | 7 |
| 3~5년 | 3 | 4 |
| 1~3년 | 2 | 2 |
| 1년 미만 | 1 | 0.5 |

**C3. 변동성 선호도**

| 선택지 | 점수 |
|--------|------|
| 고위험 고수익을 강하게 선호 | 5 |
| 고위험 고수익을 약간 선호 | 4 |
| 중간 정도가 적당 | 3 |
| 저위험 저수익을 선호 | 2 |
| 무조건 안전 최우선 | 1 |

**C4. 시장 급락 시 대응**

| 선택지 | 점수 |
|--------|------|
| 추가 매수 기회로 보고 더 투자 | 5 |
| 유지하며 회복 기다림 | 4 |
| 일부 매도하여 손실 축소 | 2 |
| 전부 매도하고 현금 보유 | 1 |

**C5. 기대 수익률**

| 선택지 | 점수 |
|--------|------|
| 연 20% 이상 | 5 |
| 연 10~20% | 4 |
| 연 5~10% | 3 |
| 연 3~5% | 2 |
| 연 3% 미만 (예금 수준) | 1 |

---

### 카테고리 D — 투자행동패턴 (가중치 1x, 문항당 최대 5점)

**D1. 투자 관여도**

| 선택지 | 점수 | behavior_tag |
|--------|------|-------------|
| 매일 시세 확인하고 직접 조정하고 싶다 | 5 | `active` |
| 주 1~2회 정도 확인하고 필요 시 조정 | 4 | `semi_active` |
| 월 1회 정도 확인하면 충분하다 | 3 | `semi_passive` |
| 한번 설정하면 거의 안 보는 편 | 2 | `passive` |
| 완전 자동으로 맡기고 싶다 | 1 | `full_passive` |

> `active`/`semi_active` → 섹터별 ETF 구성 허용.
> `passive`/`full_passive` → 인덱스 ETF 중심 추천.

**D2. 수익 실현 방식 선호**

| 선택지 | 점수 | behavior_tag |
|--------|------|-------------|
| 주가 상승으로 한 번에 크게 버는 게 좋다 | 5 | `growth` |
| 성장 위주지만 배당도 약간 있으면 좋다 | 4 | `growth_income` |
| 성장과 배당을 반반 원한다 | 3 | `balanced` |
| 배당 위주지만 성장도 약간 있으면 좋다 | 2 | `income_growth` |
| 매달 배당으로 현금 흐름을 만들고 싶다 | 1 | `income` |

> `growth` → 성장형 해외ETF 확대, 리츠·배당주 최소화.
> `income`/`income_growth` → 배당ETF·리츠 비중 확대.

---

### 카테고리 E — FOMO 유형 (점수 미반영, behavior_tag 전용)

> 점수에 포함하면 고FOMO 사람이 공격형으로 오분류되므로 점수 미반영.
> OpenAI 프롬프트의 reasoning 경고 문구 트리거로만 사용.

**E1. FOMO 유형**

| 선택지 | behavior_tag |
|--------|-------------|
| 내 종목만 안 오를 때 — 상대적 박탈감 | `relative_loss` |
| 핫한 종목을 나만 없을 때 — 소외감 | `exclusion` |
| 시장이 폭등할 때 현금만 들고 있을 때 | `cash_regret` |
| SNS·유튜브 수익 인증 볼 때 | `social_pressure` |
| 별로 FOMO를 느끼지 않는 편 | `low_fomo` |

> `exclusion`/`social_pressure` → reasoning에 분산 투자 및 충동 매매 리스크 경고 포함.
> `low_fomo` → 장기 전략 중심, 변동성 자산 비중 추가 허용.

---

## 3. 점수 계산 공식

```ts
// 카테고리별 원점수 합산
const rawA = A1 + A2 + A3                              // 최소 3  / 최대 15
const rawB = (B1 + B2 + B3 + B4 + B5 + B6) * 1.5     // 최소 9  / 최대 45
const rawC = (C1 + C2 + C3 + C4 + C5) * 2             // 최소 10 / 최대 50
const rawD = D1 + D2                                   // 최소 2  / 최대 10
// E1(FOMO)은 점수 미반영

const totalRaw = rawA + rawB + rawC + rawD

// 정규화 상수 (단위 테스트로 검증 완료)
const MIN_RAW = 24   // 모든 문항 최솟값(1점) 선택 시: 3 + 9 + 10 + 2 = 24
const MAX_RAW = 120  // 모든 문항 최댓값(5점) 선택 시: 15 + 45 + 50 + 10 = 120

const score = Math.round(((totalRaw - MIN_RAW) / (MAX_RAW - MIN_RAW)) * 100)
// score 범위: 0 ~ 100

// OpenAI 입력용 수치 (점수와 무관하게 선택지 매핑값 직접 추출)
const monthly_investment = B2_mapped_value
const investment_period_years = C2_mapped_value
const loss_tolerance_pct = C1_mapped_value

// OpenAI 입력용 행동 프로파일
const behavior_profile = {
  involvement: D1_tag,
  return_type: D2_tag,
  fomo_type: E1_tag,
}
```

---

## 4. 등급 분류 기준

| 점수 범위 | RiskLevel | 한국어 표시 | 특징 |
|----------|-----------|-----------|------|
| 0 ~ 20 | `very_conservative` | 매우안정형 | 원금 보전 최우선, 예금·채권 중심 |
| 21 ~ 40 | `conservative` | 안정형 | 낮은 리스크 허용, 채권·배당주 중심 |
| 41 ~ 60 | `moderate` | 중립형 | 균형 추구, 주식·채권 혼합 |
| 61 ~ 80 | `aggressive` | 공격형 | 성장 지향, 주식·ETF 중심 |
| 81 ~ 100 | `very_aggressive` | 매우공격형 | 고위험 고수익, 성장주·해외ETF 중심 |

**비상금 미보유 보정**: B6 점수 2점 이하(1~3개월 미만)인 경우 최종 등급 1단계 하향.
예: `aggressive` → `moderate`. 단, `very_conservative`는 하향 없음.

---

## 5. OpenAI 전달 스키마

```ts
// CONSTITUTION 원칙 4: PII 미포함
interface PortfolioRequest {
  risk_level: RiskLevel
  monthly_investment: number
  investment_period_years: number
  loss_tolerance_pct: number
  behavior_profile: {
    involvement: InvolvementTag
    return_type: ReturnTypeTag
    fomo_type: FomoTypeTag
  }
}
```

---

## 6. sessionStorage 저장 스키마

```ts
// 키: 'portfolioai_session'
interface SessionData {
  answers: {
    A1: number; A2: number; A3: number
    B1: number; B2: number; B3: number
    B4: number; B5: number; B6: number
    C1: number; C2: number; C3: number; C4: number; C5: number
    D1: number; D2: number
    E1: FomoTypeTag
  }
  score: number
  riskLevel: RiskLevel
  monthly_investment: number
  investment_period_years: number
  loss_tolerance_pct: number
  behavior_profile: BehaviorProfile
  portfolio?: PortfolioResult
}
```

---

## 7. UI 흐름

```
/ → [시작하기] → /onboarding
  Step 1 — 기본정보       A1 · A2 · A3           (3문항)
  Step 2 — 재무현황 상    B1 · B2 · B3           (3문항)
  Step 3 — 재무현황 하    B4 · B5 · B6           (3문항)
  Step 4 — 리스크성향     C1 · C2 · C3 · C4 · C5  (5문항)
  Step 5 — 투자행동패턴   D1 · D2 · E1           (3문항)
  → [결과 보기] → 점수 계산 + 비상금 보정 → sessionStorage 저장
→ /result
```

### UI 요구사항
- 각 스텝: 단일 화면에 해당 문항 표시 (스크롤 없이 확인 가능)
- 선택지: 라디오 버튼 스타일, 선택 시 즉시 시각적 피드백
- 진행률 바: `Step N / 5` 표시
- 이전 스텝 이동 시 기존 응답 sessionStorage에서 복원
- 미응답 문항 있을 시 다음 스텝 이동 불가
- `/result` 직접 접근 시 `riskLevel` 없으면 `/onboarding` 리다이렉트
- 새로고침 시 마지막 완료 스텝으로 복원

---

## 8. 구현 시 주의사항

- **비상금 등급 보정**은 점수 계산 후 별도 함수로 분리 (`applyEmergencyFundAdjustment`)
- **E1(FOMO)**은 SessionData에 tag만 저장, score 계산 미포함
- **B2 monthly_investment**는 점수 계산용 숫자(1~5)와 OpenAI 전달용 금액(원)을 별도 관리
- **C1·C2 매핑값**도 동일하게 점수와 수치를 분리하여 타입 정의
- 모든 tag union type은 `types/index.ts`에 정의

---

## 9. 테스트 케이스 예시

구현 후 아래 케이스로 점수 계산 함수를 검증한다.

### 케이스 1 — 매우공격형 (비상금 보정 없음)
```ts
// 입력: 모든 문항 최대점 선택
// A: 5+5+5=15, B: (5+5+5+5+5+5)*1.5=45, C: (5+5+5+5+5)*2=50, D: 5+5=10
// totalRaw = 120, score = Math.round((120-24)/(120-24)*100) = 100
// 기댓값: score=100, riskLevel='very_aggressive', 보정 없음 (B6=5)
```

### 케이스 2 — 매우안정형 (비상금 보정 없음)
```ts
// 입력: 모든 문항 최솟값 선택
// totalRaw = 24, score = Math.round((24-24)/(120-24)*100) = 0
// 기댓값: score=0, riskLevel='very_conservative', 보정 없음 (already 최하)
```

### 케이스 3 — 비상금 보정 발동 (aggressive → moderate)
```ts
// 입력: score가 70 (aggressive 구간)이고 B6=2 (1~3개월)
// 기댓값: riskLevel='moderate' (1단계 하향)
```

### 케이스 4 — 중립형 경계값
```ts
// score=41 → moderate, score=40 → conservative
// 경계값 테스트로 off-by-one 오류 확인
```

### 케이스 5 — E1 점수 미반영 확인
```ts
// E1=`exclusion` 선택 시 score 계산에 영향 없음
// E1=`low_fomo` 선택 시 score 계산에 영향 없음
// 기댓값: 두 경우 score 동일, behavior_profile.fomo_type만 다름
```
