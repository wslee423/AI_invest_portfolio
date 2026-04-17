# PortfolioAI — 성향 기반 포트폴리오 생성 서비스

> 로그인 없이 투자 성향 진단을 완료하면 AI가 맞춤형 포트폴리오를 생성하고 PDF로 다운로드할 수 있는 일회성 웹 서비스.
> 사용자 데이터는 서버에 저장되지 않으며, 브라우저 탭을 닫으면 자동으로 소멸합니다.

---

## 📋 목차

- [주요 특징](#주요-특징)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [구조](#구조)
- [개발 가이드](#개발-가이드)
- [배포](#배포)
- [주의사항](#주의사항)
- [라이선스](#라이선스)

---

## ✨ 주요 특징

### 로그인 불필요
가입이나 인증 과정 없이 즉시 성향 진단을 시작할 수 있습니다.

### 개인정보 보호
- 사용자 데이터를 서버에 저장하지 않습니다.
- 모든 데이터는 브라우저 sessionStorage에만 저장되며, 탭을 닫으면 자동 소멸합니다.
- OpenAI API 호출 시 개인식별정보(이름, 연락처 등)를 전달하지 않습니다.

### AI 기반 맞춤형 분석
- 17문항의 설문을 통해 5단계 투자 성향 등급을 산출합니다.
- OpenAI gpt-4.1이 사용자의 성향에 맞춘 포트폴리오를 생성합니다.
- 자산 배분 근거(reasoning)를 함께 제시하여 투자 결정에 도움을 줍니다.

### PDF 다운로드
포트폴리오 결과를 PDF로 다운로드할 수 있으며, 성향 요약, 자산 배분, AI 분석 근거, 투자 고지 문구를 모두 포함합니다.

### 투자 고지 필수
"본 서비스는 투자 참고 정보를 제공하며 수익을 보장하지 않습니다."라는 고지 문구가 결과 화면과 PDF에 표시됩니다.

---

## 🛠️ 기술 스택

| 역할 | 기술 |
|------|------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS |
| **AI** | OpenAI API (gpt-4.1) |
| **PDF 생성** | @react-pdf/renderer |
| **차트** | Recharts |
| **스키마 검증** | Zod |
| **배포** | Vercel |

---

## 🚀 시작하기

### 전제 조건
- Node.js 18+ 및 npm
- OpenAI API 키 (https://platform.openai.com/api-keys)

### 설치

```bash
# 1. 저장소 클론
git clone <repository-url>
cd portfolio-ai

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 열고 OPENAI_API_KEY를 입력합니다.
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

### 검증 (매 작업 후 필수)

```bash
# TypeScript 타입 검증
npm run typecheck

# ESLint 코드 품질 검증
npm run lint

# 테스트 실행
npm run test
```

모두 0건의 경고로 통과해야 합니다.

### 빌드

```bash
npm run build
```

### 프로덕션 서버 실행

```bash
npm run start
```

---

## 📁 구조

```
/
├── CONSTITUTION.md          ← 최상위 불변 원칙 (4개)
├── CLAUDE.md                ← 에이전트 컨텍스트
├── AGENTS.md                ← 에이전트 역할 및 자율 범위
├── QUALITY_SCORE.md         ← 품질 기준 및 검증 체크리스트
├── ARCHITECTURE.md          ← 기술 설계 문서
├── PLANS.md                 ← Phase 별 개발 로드맵
├── README.md                ← 이 파일
├── .env.example             ← 환경 변수 템플릿
├── .gitignore
├── app/
│   ├── page.tsx             ← 랜딩 페이지 (/) 
│   ├── onboarding/
│   │   └── page.tsx         ← 성향 진단 설문 (/onboarding)
│   ├── result/
│   │   └── page.tsx         ← 포트폴리오 결과 (/result)
│   └── api/
│       └── portfolio/
│           └── route.ts     ← OpenAI API 라우트
├── components/
│   ├── ui/                  ← 재사용 UI 컴포넌트
│   └── features/
│       ├── onboarding/      ← 설문 스텝 컴포넌트
│       ├── result/          ← 결과 페이지 컴포넌트
│       ├── pdf/             ← PDF 생성 컴포넌트
│       └── disclaimer/      ← 투자 고지 컴포넌트
├── lib/
│   ├── openai/
│   │   ├── client.ts        ← OpenAI 클라이언트
│   │   ├── prompts.ts       ← 시스템 프롬프트
│   │   └── schema.ts        ← Zod 검증 스키마
│   ├── session/             ← sessionStorage 유틸
│   ├── pdf/
│   │   └── fonts.ts         ← 한글 폰트 등록
│   └── utils.ts             ← 공용 유틸
├── types/
│   └── index.ts             ← 공용 타입 정의
├── public/
│   └── fonts/               ← NotoSansKR ttf 파일 (3종)
└── docs/
    ├── PLANS.md
    ├── ARCHITECTURE.md
    ├── product-specs/
    │   ├── onboarding.md    ← Phase 2 설문 스펙
    │   ├── portfolio.md      ← Phase 3 포트폴리오 스펙
    │   └── pdf.md           ← Phase 4 PDF 스펙
    └── exec-plans/
        ├── open-decisions.md
        ├── tech-debt-tracker.md
        └── NEXT_SESSION.md
```

---

## 📖 개발 가이드

### 폴더별 역할

**`app/`** — Next.js App Router 기반 페이지 및 API 라우트
- `/`: 서버 컴포넌트 (정적 랜딩)
- `/onboarding`: 클라이언트 컴포넌트 (sessionStorage 접근)
- `/result`: 클라이언트 컴포넌트 (OpenAI 호출 후 렌더링)
- `/api/portfolio`: 서버 라우트 (OpenAI 호출, 서버 저장 없음)

**`components/features/`** — 기능별 컴포넌트
- `onboarding/`: 5스텝 설문 UI
- `result/`: 포트폴리오 결과 카드, 차트, 근거 표시
- `pdf/`: @react-pdf/renderer 기반 PDF 템플릿
- `disclaimer/`: 투자 고지 문구 (CONSTITUTION 원칙 1)

**`lib/openai/`** — OpenAI 연동
- `client.ts`: gpt-4.1 호출 (타임아웃 25s, 재시도 2회)
- `prompts.ts`: 시스템 프롬프트 및 입력 포맷
- `schema.ts`: Zod 검증 스키마 (reasoning min(1), allocations 합계 100%)

**`lib/session/`** — sessionStorage 관리
```ts
// 예시
const session = getSession()  // sessionStorage 읽기
session.score = 75
setSession(session)           // sessionStorage 쓰기
clearSession()                // sessionStorage 초기화
```

**`types/index.ts`** — 공용 타입
```ts
export interface SessionData {
  answers: Record<string, number | string>
  score: number
  riskLevel: RiskLevel
  portfolio?: PortfolioResult
}

export type RiskLevel = 
  | 'very_conservative'
  | 'conservative'
  | 'moderate'
  | 'aggressive'
  | 'very_aggressive'
```

### 핵심 원칙 (CONSTITUTION.md)

#### ✅ 원칙 1: 투자 고지 필수
- 결과 화면과 PDF에 `DisclaimerBanner` 컴포넌트 필수
- `display:none` / `hidden` / `opacity:0` 처리 금지

#### ✅ 원칙 2: 서버 데이터 무저장
- API Route에 DB·파일·로그 write 코드 없음
- 모든 데이터는 sessionStorage + 메모리에만 존재

#### ✅ 원칙 3: AI 근거 표시
- OpenAI 응답에 `reasoning` 필드 필수
- UI와 PDF 모두 `reasoning` 렌더링

#### ✅ 원칙 4: PII 미포함
- OpenAI API 호출 시 name·email·phone 절대 전달 금지
- 익명화된 수치·태그만 전달

### 데이터 흐름

```
[사용자 입력]
  ↓ 설문 UI
[sessionStorage 저장]
  (answers, score, riskLevel, behavior_profile)
  ↓
[/result 페이지 진입]
  → sessionStorage 없으면 /onboarding 리다이렉트
  ↓
[POST /api/portfolio]
  → 익명화된 수치만 추출
  → OpenAI gpt-4.1 호출
  → Zod 이중 검증 (reasoning.min(1), allocations 합계 100%)
  → 결과 반환 (서버 저장 없음)
  ↓
[/result 페이지 렌더링]
  → portfolio를 sessionStorage에 저장
  → Loading / Success / Error 3가지 상태
  ↓
[PDF 다운로드]
  → sessionStorage에서 portfolio 읽기
  → @react-pdf/renderer로 클라이언트 사이드 생성
  → 브라우저 다운로드
  ↓
[탭 닫음]
  → sessionStorage 자동 소멸
```

### OpenAI Structured Outputs

gpt-4.1과 Structured Outputs를 사용하여 스키마 준수를 강제합니다.

```ts
// lib/openai/client.ts
const response = await client.messages.create({
  model: 'gpt-4.1',
  response_format: {
    type: 'json_schema',
    json_schema: portfolioJsonSchema,  // PortfolioResult를 JSON Schema로 변환
  },
  // ...
})
```

### 성향 점수 계산

```ts
// 카테고리별 점수 (가중치 적용)
const rawA = A1 + A2 + A3                        // 최소 3 / 최대 15
const rawB = (B1 + B2 + B3 + B4 + B5 + B6) * 1.5  // 최소 9 / 최대 45
const rawC = (C1 + C2 + C3 + C4 + C5) * 2       // 최소 10 / 최대 50
const rawD = D1 + D2                             // 최소 2 / 최대 10

const totalRaw = rawA + rawB + rawC + rawD

// 정규화 (0~100)
const score = Math.round(((totalRaw - 24) / (120 - 24)) * 100)

// 등급 분류
if (score >= 81) riskLevel = 'very_aggressive'
else if (score >= 61) riskLevel = 'aggressive'
else if (score >= 41) riskLevel = 'moderate'
else if (score >= 21) riskLevel = 'conservative'
else riskLevel = 'very_conservative'

// 비상금 보정: B6 점수 2점 이하면 1단계 하향
if (answers.B6 <= 2 && riskLevel !== 'very_conservative') {
  riskLevel = downgrade(riskLevel)
}
```

자세한 계산 공식은 `docs/product-specs/onboarding.md`를 참조.

### 테스트

```bash
# 성향 점수 계산 테스트
npm run test -- lib/calculateScore

# API Route 테스트
npm run test -- app/api/portfolio

# UI 컴포넌트 테스트
npm run test -- components/features
```

테스트 커버리지 기준:
- 성향 점수 계산 함수: 70% 이상
- 포트폴리오 배분 알고리즘: 70% 이상
- API Route: 정상·에러 케이스 포함
- UI 컴포넌트: 상태 반응성 테스트 1개 이상

---

## 🌍 배포

### Vercel 배포

```bash
# 1. 프로젝트가 GitHub에 푸시됨
git push origin main

# 2. Vercel 대시보드에서 자동 배포
# https://vercel.com/dashboard

# 3. 환경 변수 설정
# Vercel Project Settings → Environment Variables
# - OPENAI_API_KEY 추가 (값 입력)
```

### 배포 전 체크리스트

- [ ] `npm run typecheck` — 경고 0건
- [ ] `npm run lint` — 경고 0건
- [ ] `npm run build` — 빌드 성공
- [ ] `npm run test` — 모든 테스트 통과
- [ ] `.env.example` 최신 동기화
- [ ] CONSTITUTION 불변 원칙 4개 검증
  - [ ] DisclaimerBanner 존재 + 숨김 없음
  - [ ] API Route 서버 저장 코드 없음
  - [ ] reasoning 필드 UI·PDF 렌더링
  - [ ] OpenAI 페이로드 PII 없음
- [ ] Lighthouse 성능 점수 80+ (모바일)
- [ ] smoke test (전체 흐름: 설문 → 결과 → PDF)

### 모니터링

배포 후 에러 모니터링 설정:
- Vercel Analytics (자동 포함)
- Sentry (선택사항, Phase 5 구현)

---

## ⚠️ 주의사항

### 개인정보 보호

**반드시 지키세요:**
- 사용자의 이름, 연락처, 주민등록번호 등 개인식별정보를 절대 수집하지 마세요.
- OpenAI API 호출 시 PII를 포함하지 마세요.
- 사용자 데이터를 서버에 저장하지 마세요 (sessionStorage만 사용).

### 투자 고지

포트폴리오 결과 화면과 PDF에 다음 문구가 반드시 표시되어야 합니다:
> "본 서비스는 투자 참고 정보를 제공하며 수익을 보장하지 않습니다.
> 투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.
> 본 자료는 금융투자상품 판매 권유가 아닙니다."

### API 비용

OpenAI gpt-4.1 API 호출 비용:
- 입력: $2.00 / 백만 토큰
- 출력: $8.00 / 백만 토큰

예상 비용 (포트폴리오당):
- 입력: ~1,500 토큰 × $0.000002 = $0.003
- 출력: ~500 토큰 × $0.000008 = $0.004
- **합계**: ~$0.007/회

### 보안

**절대 금지:**
- OPENAI_API_KEY를 클라이언트에 노출 (`NEXT_PUBLIC_` 접두사 금지)
- API 키를 git 커밋에 포함 (`.env.local`은 `.gitignore` 필수)
- sessionStorage 외 다른 저장소 사용

---

## 📞 문제 해결

### "OpenAI API 호출이 타임아웃됩니다"

- API 키가 정상인지 확인
- 네트워크 연결 확인
- Vercel maxDuration이 30s로 설정되어 있는지 확인

### "PDF 한글이 깨집니다"

- `public/fonts/`에 NotoSansKR ttf 파일이 3종 모두 있는지 확인
- `lib/pdf/fonts.ts`가 앱 초기화 시 import 되는지 확인

### "성향 점수가 예상과 다릅니다"

- 점수 계산 공식 확인: `docs/product-specs/onboarding.md §3`
- 테스트 케이스 확인: `docs/product-specs/onboarding.md §9`
- 비상금 보정 로직 확인 (B6=2점 이하면 1단계 하향)

### "DisclaimerBanner가 표시되지 않습니다"

- 결과 페이지에 `<DisclaimerBanner />` 컴포넌트가 있는지 확인
- CSS `display:none` / `hidden` / `opacity:0` 적용되지 않았는지 확인

---

## 📚 추가 문서

| 문서 | 내용 |
|------|------|
| CONSTITUTION.md | 최상위 불변 원칙 4개 |
| CLAUDE.md | 에이전트 컨텍스트 |
| AGENTS.md | 에이전트 역할 및 자율 범위 |
| QUALITY_SCORE.md | 품질 기준 및 검증 체크리스트 |
| ARCHITECTURE.md | 기술 설계 및 데이터 흐름 |
| PLANS.md | Phase 별 개발 로드맵 |
| docs/product-specs/onboarding.md | 성향 진단 설문 스펙 (17문항, 점수 계산) |
| docs/product-specs/portfolio.md | 포트폴리오 생성 스펙 (OpenAI 프롬프트, 응답 스키마) |
| docs/product-specs/pdf.md | PDF 생성 스펙 (@react-pdf/renderer) |

---

## 🎯 핵심 설계 결정

| 결정 | 이유 |
|------|------|
| sessionStorage만 사용 | 서버 비용 절감, 개인정보 보호 |
| gpt-4.1 선택 | gpt-4o 대비 20% 저렴하고 성능 향상 |
| Structured Outputs 사용 | JSON mode보다 스키마 준수율 높음 |
| 클라이언트 사이드 PDF | 서버 부하 없음, Vercel 서버리스 환경 최적 |
| 5단계 등급 체계 | 세부도와 단순성의 균형 |

---

## 📄 라이선스

이 프로젝트는 내부 사용 목적으로 제작되었습니다.

### 포함된 오픈소스

- [Noto Sans KR](https://github.com/googlei18n/noto-cjk) — Google Fonts (OFL)
- [Next.js](https://nextjs.org/) — Vercel (MIT)
- [Tailwind CSS](https://tailwindcss.com/) — Tailwind Labs (MIT)
- [Recharts](https://recharts.org/) — (MIT)
- [Zod](https://zod.dev/) — Collin Donnell (MIT)
- [@react-pdf/renderer](https://react-pdf.org/) — (MIT)

---

## 📞 문의

이 프로젝트에 대한 질문이나 제안이 있으면 이슈를 등록해주세요.

---

**마지막 업데이트**: 2026년 4월 17일
