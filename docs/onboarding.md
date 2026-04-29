# product-specs/onboarding.md — 성향 진단 스펙

> Phase 5 구현 기준 문서.
> 문항 설계, 점수 계산 공식, 등급 경계값, UI 흐름, 투자 배경 프로파일 포함.

---

## 1. 설문 구조 개요

| 항목 | 내용 |
|------|------|
| 총 문항 수 | 22문항 |
| 구성 | A(기본정보) 3 + B(재무현황) 6 + C(리스크성향) 5 + D(투자행동) 2 + E(FOMO) 1 + F(투자배경) 5 |
| 가중치 | A 1x / B 1.5x / C 2x / D 1x / E 0x(미반영) / F 0x(modifier) |
| 리스크 점수 | A~E 기반 0~100점 |
| 배경 프로파일 | F 기반 5개 태그 (포트폴리오 보정용) |
| 등급 | 5단계 (very_conservative ~ very_aggressive) |
| UI 스텝 | 6스텝 |

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

> 포트폴리오에 반영: passive/full_passive → 인덱스 ETF 중심.

**D2. 수익 실현 방식 선호**

| 선택지 | 점수 | behavior_tag |
|--------|------|-------------|
| 주가 상승으로 한 번에 크게 버는 게 좋다 | 5 | `growth` |
| 성장 위주지만 배당도 약간 있으면 좋다 | 4 | `growth_income` |
| 성장과 배당을 반반 원한다 | 3 | `balanced` |
| 배당 위주지만 성장도 약간 있으면 좋다 | 2 | `income_growth` |
| 매달 배당으로 현금 흐름을 만들고 싶다 | 1 | `income` |

> 포트폴리오에 반영: return_type별 배당ETF 종목 선택 조정 (자산군 내 비중).

---

### 카테고리 E — FOMO 유형 (점수 미반영, behavior_tag 전용)

> 점수에 포함하면 고FOMO 사람이 공격형으로 오분류되므로 점수 미반영.
> OpenAI 프롬프트의 행동 조언 및 경고 문구 트리거로만 사용.

**E1. FOMO 유형**

| 선택지 | behavior_tag |
|--------|-------------|
| 내 종목만 안 오를 때 — 상대적 박탈감 | `relative_loss` |
| 핫한 종목을 나만 없을 때 — 소외감 | `exclusion` |
| 시장이 폭등할 때 현금만 들고 있을 때 | `cash_regret` |
| SNS·유튜브 수익 인증 볼 때 | `social_pressure` |
| 별로 FOMO를 느끼지 않는 편 | `low_fomo` |

> 포트폴리오에 반영: exclusion/social_pressure → behavior_advice에 분산 투자 및 충동 매매 위험 경고 포함.

---

### 카테고리 F — 투자 배경과 지속 가능성 (가중치 0x, 포트폴리오 modifier 전용)

> 점수에 포함하지 않음. 대신 background_profile로 저장하여 포트폴리오 구성 보정, reasoning, behavior_advice에 반영.
> 리스크 수용 여력과 무관하게 실제 투자 지속 가능성을 높이는 맞춤 조정.

**F1. 과거 투자 손실 경험**

| 선택지 | background_tag |
|--------|-------------|
| 큰 손실 경험 없음 | `no_major_loss` |
| 손실 경험 있으나 회복됨 | `recovered_loss` |
| 과거 손실로 인해 현재 조심스러운 상태 | `loss_cautious` |
| 큰 손실 후 장기 휴식 뒤 재시작 | `restarting_after_loss` |
| 손실 만회 압박감 있음 (위험 신호) | `recovery_pressure` |

**F2. 손실 시 실제 행동**

| 선택지 | background_tag |
|--------|-------------|
| 실제 손실 경험 거의 없음 | `no_loss_experience` |
| 손실 시 패닉셀 이력 있음 | `panic_sell_history` |
| 손실 시 반복 확인·불안 경향 | `loss_anxiety` |
| 손실 시 원칙 보유 또는 추가 매수 (긍정 신호) | `disciplined_hold` |
| 손실 만회를 위한 추가 위험 투자 이력 (강한 위험 신호) | `revenge_trading` |

**F3. 관심·애착 투자 성향**

| 선택지 | background_tag |
|--------|-------------|
| 수익률·리스크 중심, 애착 투자 없음 | `return_only` |
| 관심 분야를 참고 수준으로만 반영 | `light_affinity` |
| 잘 아는 산업에 섹터 투자 희망 | `knowledge_based_sector` |
| 좋아하는 브랜드·회사 장기투자 희망 | `brand_affinity` |
| 애착으로 인한 손절 어려움 위험 있음 | `emotional_attachment_risk` |

**F4. 3년 내 유동성 이벤트**

| 선택지 | background_tag |
|--------|-------------|
| 큰 지출 이벤트 없음 | `no_major_event` |
| 결혼·출산·육아 관련 지출 가능성 | `family_event` |
| 주택 구입·전세금 등 큰 자금 필요 가능성 | `housing_event` |
| 퇴사·이직·창업으로 인한 수입 변동 가능성 | `career_transition` |
| 가족 지원·예상치 못한 큰 지출 가능성 | `family_support_risk` |

**F5. 금전 가치관 배경**

| 선택지 | background_tag |
|--------|-------------|
| 원금 보존 중심의 금전 가치관 | `capital_preservation_belief` |
| 저축·절약 중심의 금전 가치관 | `saving_oriented` |
| 투자·사업에 긍정적인 성장 배경 | `investment_positive_background` |
| 금전 관련 특별한 배경 없음 | `neutral_money_background` |
| 주변 투자 실패 경험으로 인한 불신 배경 | `investment_distrust_background` |

> 포트폴리오에 반영: 안정자산 비중 보정, reasoning 톤 조절, behavior_advice 맞춤화, background_highlights 작성.

---

## 3. 점수 계산 공식

### 리스크 점수 계산 (A~E 기반)

```ts
// 카테고리별 원점수 합산
const rawA = A1 + A2 + A3                              // 최소 3  / 최대 15
const rawB = (B1 + B2 + B3 + B4 + B5 + B6) * 1.5     // 최소 9  / 최대 45
const rawC = (C1 + C2 + C3 + C4 + C5) * 2             // 최소 10 / 최대 50
const rawD = D1 + D2                                   // 최소 2  / 최대 10
const rawE = 0                                         // E1(FOMO) 점수 미반영
const rawF = 0                                         // F1~F5 점수 미반영 (modifier 전용)

const totalRaw = rawA + rawB + rawC + rawD

// 정규화 상수 (단위 테스트로 검증 완료)
const MIN_RAW = 24   // 모든 문항 최솟값(1점) 선택 시: 3 + 9 + 10 + 2 = 24
const MAX_RAW = 120  // 모든 문항 최댓값(5점) 선택 시: 15 + 45 + 50 + 10 = 120

const riskScore = Math.round(((totalRaw - MIN_RAW) / (MAX_RAW - MIN_RAW)) * 100)
// riskScore 범위: 0 ~ 100
```

### 배경 프로파일 추출 (F 기반)

```ts
// F1~F5 응답 → background_profile 객체로 변환
// 점수 계산에 미반영, 포트폴리오 보정용으로만 사용
const background_profile = {
  loss_experience: F1_tag,           // LossExperienceTag
  actual_loss_behavior: F2_tag,      // ActualLossBehaviorTag
  affinity_investing: F3_tag,        // AffinityInvestingTag
  liquidity_event: F4_tag,           // LiquidityEventTag
  money_background: F5_tag,          // MoneyBackgroundTag
}
```

### OpenAI 입력용 필드 추출

```ts
// 점수와 무관하게 선택지 매핑값 직접 추출
const monthly_investment = B2_mapped_value      // 원 단위
const investment_period_years = C2_mapped_value // 년 단위
const loss_tolerance_pct = C1_mapped_value      // % 단위

// 행동 프로파일 태그
const behavior_profile = {
  involvement: D1_tag,               // InvolvementTag
  return_type: D2_tag,               // ReturnTypeTag
  fomo_type: E1_tag,                 // FomoTypeTag
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
// CONSTITUTION 원칙 4: PII 미포함, 수치·enum·tag만 전달
interface PortfolioRequest {
  risk_level: RiskLevel                          // 등급 (A~E 기반)
  monthly_investment: number                     // 월 투자 가능 금액 (원)
  investment_period_years: number                // 투자 기간 (년)
  loss_tolerance_pct: number                     // 허용 손실 (%)
  behavior_profile: {
    involvement: InvolvementTag                  // 투자 관여도 (D1)
    return_type: ReturnTypeTag                   // 수익 선호 (D2)
    fomo_type: FomoTypeTag                       // FOMO 유형 (E1)
  }
  background_profile: {                          // 포트폴리오 보정용 (F1~F5)
    loss_experience: LossExperienceTag
    actual_loss_behavior: ActualLossBehaviorTag
    affinity_investing: AffinityInvestingTag
    liquidity_event: LiquidityEventTag
    money_background: MoneyBackgroundTag
  }
}
```

---

## 6. sessionStorage 저장 스키마

```ts
// 키: 'portfolioai_session'
interface SessionData {
  answers: {
    // 리스크 점수 계산용 (A~E)
    A1: number; A2: number; A3: number
    B1: number; B2: number; B3: number
    B4: number; B5: number; B6: number
    C1: number; C2: number; C3: number; C4: number; C5: number
    D1: number; D2: number
    E1: FomoTypeTag
    // 배경 프로파일용 (F1~F5)
    F1: LossExperienceTag
    F2: ActualLossBehaviorTag
    F3: AffinityInvestingTag
    F4: LiquidityEventTag
    F5: MoneyBackgroundTag
  }
  riskScore: number                              // 0~100 리스크 점수 (A~E 기반)
  riskLevel: RiskLevel                           // 등급 (점수 기반 등급 분류 후 비상금 보정)
  monthly_investment: number
  investment_period_years: number
  loss_tolerance_pct: number
  behavior_profile: BehaviorProfile
  background_profile: BackgroundProfile         // F1~F5 추출
  portfolio?: PortfolioResult
}
```

---

## 7. UI 흐름

```
/ → [시작하기] → /onboarding
  Step 1 — A. 기본정보                 A1 · A2 · A3                      (3문항)
  Step 2 — B. 재무현황 상             B1 · B2 · B3                      (3문항)
  Step 3 — C. 재무현황 하             B4 · B5 · B6                      (3문항)
  Step 4 — D. 리스크 성향             C1 · C2 · C3 · C4 · C5            (5문항)
  Step 5 — E. 투자행동패턴             D1 · D2 · E1                      (3문항)
  Step 6 — F. 투자 배경과 지속가능성   F1 · F2 · F3 · F4 · F5            (5문항)
  → [결과 보기] → 리스크점수 계산 + 비상금 보정 + 배경프로파일 추출 → sessionStorage 저장
→ /result (OpenAI 호출 → 포트폴리오 생성)
```

### UI 요구사항
- 각 스텝: 단일 화면에 해당 문항 표시 (스크롤 없이 확인 가능)
- 선택지: 라디오 버튼 스타일, 선택 시 즉시 시각적 피드백
- 진행률 바: `Step N / 6` 표시
- 각 Step 제목에 카테고리 인덱스(A~F) 표시 + 설명 박스
- 이전 스텝 이동 시 기존 응답 sessionStorage에서 복원
- 미응답 문항 있을 시 다음 스텝 이동 불가
- `/result` 직접 접근 시 `riskLevel` 없으면 `/onboarding` 리다이렉트
- 새로고침 시 마지막 완료 스텝으로 복원

---

## 8. 구현 시 주의사항

- **리스크 점수 계산**: A~D 기반만 사용. E(FOMO)와 F(배경)는 점수 미포함
- **비상금 등급 보정**: 점수 계산 후 별도 함수로 분리 (`applyEmergencyFundAdjustment`)
- **E1(FOMO)**: SessionData에 tag만 저장, score 계산 미포함
- **F1~F5(배경)**: 점수 미포함, 대신 `extractBackgroundProfile()` 함수로 background_profile 객체 생성
- **B2 monthly_investment**: 점수 계산용 숫자(1~5)와 OpenAI 전달용 금액(원) 별도 관리
- **C1·C2 매핑값**: 동일하게 점수와 수치 분리하여 타입 정의
- **Backward compatibility**: SessionData는 background_profile 선택사항 (기존 session 호환성)
- 모든 tag union type은 `types/index.ts`에 정의. 매핑 로직은 별도 함수 또는 상수로 관리

---

## 9. 테스트 케이스 예시

구현 후 아래 케이스로 리스크 점수 계산 및 배경 프로파일 추출을 검증한다.

### 케이스 1 — 매우공격형 (비상금 보정 없음)
```ts
// 입력: A~D 모든 문항 최대점 선택, F는 중립값
// A: 15, B: 45, C: 50, D: 10, E: 0 (미반영), F: 0 (미반영)
// totalRaw = 120, riskScore = 100
// 기댓값: riskScore=100, riskLevel='very_aggressive', 보정 없음 (B6=5)
// background_profile: 중립값 (no_major_loss, no_loss_experience, return_only, no_major_event, neutral_money_background)
```

### 케이스 2 — 매우안정형 (비상금 보정 없음)
```ts
// 입력: 모든 문항(A~E) 최솟값, F는 중립값
// totalRaw = 24, riskScore = 0
// 기댓값: riskScore=0, riskLevel='very_conservative', 보정 없음 (이미 최하)
// background_profile 정상 추출
```

### 케이스 3 — 비상금 보정 발동 (aggressive → moderate)
```ts
// 입력: riskScore=70 (aggressive 구간)이고 B6=2 (1~3개월 미만)
// 기댓값: riskLevel='moderate' (1단계 하향)
// background_profile: 정상 추출
```

### 케이스 4 — E(FOMO) 점수 미반영 확인
```ts
// 입력: 동일한 A~D 응답, E만 다름 (E1=exclusion vs. E1=low_fomo)
// 기댓값: riskScore 동일, behavior_profile.fomo_type만 다름
```

### 케이스 5 — F(배경) 점수 미반영 확인
```ts
// 입력: 동일한 A~E 응답, F만 다름 (F1~F5 모두 최대 선택 vs. 최소 선택)
// 기댓값: riskScore 동일, background_profile 내용만 다름 (modifier로만 반영)
```

### 케이스 6 — 중립형 경계값
```ts
// riskScore=41 → moderate, riskScore=40 → conservative
// 경계값 테스트로 off-by-one 오류 확인
```

### 케이스 7 — BackgroundProfile 추출 정확성
```ts
// F1=loss_cautious, F2=disciplined_hold, F3=brand_affinity, F4=housing_event, F5=saving_oriented
// 기댓값: background_profile 객체가 정확히 추출되고 OpenAI 요청에 전달됨
// OpenAI 응답에 "투자 배경 반영 포인트" + "행동 조언에 감정 관리" 포함되는지 확인
```
