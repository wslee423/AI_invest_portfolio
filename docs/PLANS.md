# PLANS.md — PortfolioAI 개발 로드맵

> 에이전트는 매 세션 시작 시 이 파일로 현재 위치를 확인한다.

---

## 목표

로그인 없이 성향 진단 → AI 포트폴리오 생성 → PDF 다운로드까지
하나의 흐름으로 완결되는 일회성 웹 서비스. **모든 Phase 완료 (MVP + 고도화)**

---

## Phase 구조

| Phase | 이름 | 목표 | 상태 |
|-------|------|------|------|
| Phase 1 | 기반 세팅 | 프로젝트 초기화 + 설문 UI 골격 | ✅ 완료 |
| Phase 2 | 성향 진단 | 설문 흐름 완성 + 점수 계산 | ✅ 완료 |
| Phase 3 | 포트폴리오 생성 | OpenAI 연동 + 결과 UI | ✅ 완료 |
| Phase 4 | PDF 출력 | PDF 생성 + 다운로드 | ✅ 완료 |
| Phase 5 | 출시 준비 + 고도화 | 보안·성능·배포·다중 시나리오 | ✅ 완료 |

상태: 🔲 미시작 / 🔄 진행 중 / ✅ 완료

---

## Phase 1 — 기반 세팅

**목표**: 개발 환경 구성 + 페이지 라우팅 + sessionStorage 유틸 완성.

### 완료 조건
- [x] Next.js 14 프로젝트 초기화 (TypeScript strict, Tailwind)
- [x] 페이지 라우팅 구성 (`/` → `/onboarding` → `/result`)
- [x] sessionStorage 유틸 구현 및 타입 정의
- [x] OpenAI SDK 설치 및 환경변수 설정
- [x] typecheck + lint 0건 확인
- [ ] Vercel 배포 파이프라인 연결

### 작업 목록
- [x] 프로젝트 초기화 및 패키지 설치
- [x] 페이지 라우팅 및 레이아웃 구성
- [x] `lib/session/` — sessionStorage 읽기/쓰기/초기화 유틸
- [x] `types/index.ts` — 공용 타입 정의
- [x] 환경변수 설정 및 `.gitignore` 확인
- [ ] Vercel 배포 연결

---

## Phase 2 — 성향 진단

**목표**: 17문항 설문을 완료하면 성향 점수와 등급이 sessionStorage에 저장된다.

### 완료 조건
- [x] 설문 스텝 UI 완성 (진행률 표시 포함)
- [x] 성향 점수 계산 로직 구현 및 테스트 70% 이상
- [x] 비상금 등급 보정 함수 구현
- [x] 결과가 sessionStorage에 정상 저장됨
- [x] 설문 미완료 시 `/result` 접근 차단

### 작업 목록
- [x] 설문 스텝 컴포넌트 (5스텝, 진행률 표시)
- [x] 성향 점수 계산 함수 + 단위 테스트 (MIN_RAW=24, MAX_RAW=120)
- [x] 등급 분류 함수 + 단위 테스트 (경계값 포함)
- [x] 비상금 등급 보정 함수 (B6=2점 이하면 1단계 하향)
- [x] FOMO 태그 저장 (점수 미포함)
- [x] sessionStorage 저장 연동
- [x] `/result` 접근 가드 (sessionStorage 없으면 리다이렉트)

---

## Phase 3 — 포트폴리오 생성

**목표**: 성향 진단 결과를 기반으로 AI가 포트폴리오를 생성하고 결과를 표시한다.

### 완료 조건
- [x] OpenAI gpt-4.1 Structured Outputs 연동
- [x] reasoning 필드 포함한 응답 스키마 Zod 검증
- [x] 포트폴리오 결과 UI (도넛 차트 + 근거 표시)
- [x] DisclaimerBanner 컴포넌트 적용
- [x] Loading / Success / Error 3가지 UI 상태 구현

### 작업 목록
- [x] `types/index.ts` — PortfolioRequest, PortfolioResult 타입 추가
- [x] `lib/openai/schema.ts` — Zod + JSON Schema 정의
- [x] `lib/openai/prompts.ts` — 시스템 프롬프트 + 입력 포맷 함수
- [x] `lib/openai/client.ts` — OpenAI 클라이언트 (타임아웃 25s)
- [x] `app/api/portfolio/route.ts` — API Route (maxDuration=30)
- [x] Recharts 차트 구현
- [x] `components/features/disclaimer/DisclaimerBanner.tsx`
- [x] `components/features/result/` — 결과 UI 컴포넌트
- [x] `app/result/page.tsx` — 3가지 UI 상태
- [x] sessionStorage portfolio 필드 업데이트
- [x] API Route 단위 테스트

---

## Phase 4 — PDF 출력

**목표**: 포트폴리오 결과를 PDF로 생성하여 브라우저에서 다운로드할 수 있다.

### 완료 조건
- [x] PDF에 포트폴리오 결과·자산 배분·reasoning·DisclaimerBanner 모두 포함
- [x] 한글 폰트 정상 렌더링
- [x] A4 레이아웃 이탈 없음
- [x] 다운로드 버튼 클릭 시 즉시 생성 및 다운로드

### 작업 목록
- [x] `public/fonts/` — NotoSansKR 3종 배치
- [x] `lib/pdf/fonts.ts` — Font.register
- [x] `components/features/pdf/styles.ts` — StyleSheet 정의
- [x] `components/features/pdf/PdfFooter.tsx` — DisclaimerBanner (fixed)
- [x] `components/features/pdf/Pdf*.tsx` — 섹션별 컴포넌트
- [x] `components/features/pdf/PdfDocument.tsx` — 전체 조합
- [x] `components/features/pdf/PdfDownloadButton.tsx` — dynamic(ssr:false)
- [x] `app/result/page.tsx` — PdfDownloadButton 연결
- [x] PDF 검증 (한글 폰트·레이아웃·DisclaimerBanner)

---

## Phase 5 — 출시 준비 + 고도화

**목표**: 보안 점검 + 성능 최적화 + 최종 배포 + 포트폴리오 고도화.
**상태**: ✅ 완료

### 완료 조건
- [x] CONSTITUTION 불변 원칙 4개 전체 검증 통과
- [x] OpenAI 페이로드 PII 미포함 확인 (final audit)
- [x] Lighthouse 성능 점수 80 이상
- [x] 에러 모니터링 설정 (Sentry 또는 Vercel Analytics)
- [x] 개인정보처리방침 페이지 작성
- [x] 서비스 시작 화면에 데이터 자동 소멸 안내

### 5-1. 보안 점검

**최종 검증 (CONSTITUTION 원칙 4개)**
- [x] **원칙 1 (투자 고지)**: 결과 화면 + PDF 모두 DisclaimerBanner 존재, 숨김 처리 없음
  - [x] 결과 화면: `display:none` / `hidden` / `opacity:0` 없음
  - [x] PDF: 모든 페이지 하단에 고정 표시
- [x] **원칙 2 (서버 무저장)**: API Route에 DB·파일·로그 write 코드 없음
  - [x] `db.insert()` / `fs.writeFile()` / `console.log()` 점검
  - [x] 환경 변수로 저장소 경로 없음
- [x] **원칙 3 (AI 근거)**: reasoning 필드 UI·PDF 모두 렌더링, 빈 문자열 없음
  - [x] Zod 스키마: `z.string().min(1)` 검증
  - [x] UI: reasoning 섹션 렌더링 확인
  - [x] PDF: 섹션 3 존재 확인
- [x] **원칙 4 (PII 미포함)**: OpenAI 호출 페이로드에 name·email·phone 없음
  - [x] 모든 API Route 경로 점검
  - [x] 시스템 프롬프트에 PII 요청 안 함 확인

**API 보안**
- [x] typecheck 0건, lint 0건
- [x] OPENAI_API_KEY `NEXT_PUBLIC_` 접두사 없음
- [x] 서버 로그에 사용자 데이터 없음
- [x] sessionStorage는 클라이언트에서만 접근

#### 5-2. 성능 최적화
- [x] `npm run build` 후 번들 크기 확인 (목표 <500KB)
- [x] Lighthouse 성능 점수 80 이상 (모바일 포함)
  - [x] Desktop: 성능 80+, 접근성 90+, Best Practices 90+
  - [x] Mobile: 성능 80+
- [x] OpenAI 호출 시간 측정 (목표 <15초)
- [x] 폰트 파일 최적화 (subsetting 검토)

#### 5-3. 에러 모니터링
- [x] Sentry 또는 Vercel Analytics 연동
- [x] OpenAI 호출 실패 모니터링 (timeout·rate limit·validation error)
- [x] sessionStorage 오류 추적
- [x] 500 에러 알림 설정

#### 5-4. 사용자 안내 및 정책
- [x] 개인정보처리방침 페이지 작성
  - [x] "데이터를 서버에 저장하지 않습니다" 명시
  - [x] "탭을 닫으면 자동 소멸됩니다" 명시
- [x] 랜딩 화면: 데이터 자동 소멸 안내 배너
- [x] 설문 시작 전: 정보 수집 방식 안내
- [x] README.md 작성 (시작 방법, 스택, 주의사항)

#### 5-5. 최종 QA 및 배포
- [x] 전체 흐름 테스트 (랜딩 → 설문 → 결과 → PDF 다운로드)
- [x] 모든 환경변수 `.env.example` 동기화
- [x] 최종 보안 점검 (Lighthouse + 코드 리뷰)
- [x] Vercel 배포 (production branch 연결)
- [x] 배포 후 smoke test (실제 URL에서 동작 확인)

### 5-6. 포트폴리오 고도화
- [x] 다중 포트폴리오 시나리오 생성 (절세우선 / 수익우선 / 균형형)
- [x] 계좌 유형 모델 추가 (일반계좌 / ISA / IRP / 연금저축펀드)
- [x] 절세효과 시뮬레이션 로직
- [x] 시나리오별 비교 차트·테이블
- [x] OpenAI 프롬프트 다중 시나리오 생성으로 확장
- [x] 투자 행동 조언 (유머체)

### 작업 목록
- [x] CONSTITUTION 불변 원칙 4개 final audit
- [x] OpenAI 페이로드 모든 경로에서 PII 없음 확인
- [x] Lighthouse 성능 점수 측정 및 최적화
- [x] Sentry 또는 Vercel Analytics 연동
- [x] 개인정보처리방침 페이지 작성
- [x] 랜딩 화면 데이터 소멸 안내 추가
- [x] README.md 작성
- [x] 최종 QA (전체 흐름 + 에러 케이스)
- [x] `.env.example` 최종 확인
- [x] Vercel 배포
- [x] 배포 후 smoke test
- [x] 다중 포트폴리오 시나리오 + 절세계좌 분석 구현

---

## 원칙

1. 정상 동작 먼저 — 완벽한 코드보다 동작하는 코드 우선
2. Phase Gate 통과 후 다음 Phase 진입
3. CONSTITUTION 불변 원칙은 Phase 1부터 적용
