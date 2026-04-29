# ARCHITECTURE.md — PortfolioAI 기술 구조

> 에이전트가 구현 시 참조하는 설계 기준 문서.
> 스택 선택 이유와 핵심 설계 결정을 기록한다.

---

## 1. 스택

| 역할 | 기술 | 선택 이유 |
|------|------|----------|
| Framework | Next.js 14 (App Router) | 서버 컴포넌트 + API Route 단일 프로젝트로 관리 |
| Language | TypeScript strict | 타입 안정성, CONSTITUTION 원칙 준수 검증 용이 |
| Styling | Tailwind CSS | 빠른 UI 구성, 별도 CSS 파일 관리 불필요 |
| AI | OpenAI API (gpt-4.1) | gpt-4o 대비 성능 향상, 입력 20%·출력 20% 저렴 |
| PDF | @react-pdf/renderer | 클라이언트 사이드 생성, Vercel 서버리스 환경 적합 |
| 차트 | Recharts | Next.js 호환, 경량, 도넛 차트 지원 |
| 상태 관리 | sessionStorage + React 상태 | 로그인·DB 없는 일회성 서비스 구조에 최적 |
| 스키마 검증 | Zod | OpenAI 응답 런타임 검증, 타입 자동 추론 |
| 배포 | Vercel | Next.js 공식 지원, 서버리스 함수 자동 처리 |

---

## 2. 데이터 흐름

```
[브라우저 sessionStorage]
        ↓ 익명화된 수치·tag만 추출 (PII 처음부터 미수집)
[API Route: POST /api/portfolio]
  - OpenAI gpt-4.1 호출 (서버 사이드)
  - Structured Outputs로 응답 스키마 강제
  - Zod 이중 검증
  - 결과 클라이언트에 반환 (서버 저장 없음)
        ↓ 반환
[결과 페이지: /result]
  - 포트폴리오 결과 렌더링
  - sessionStorage에 portfolio 저장 (PDF 생성용)
        ↓
[PDF 생성: 클라이언트 사이드]
  - sessionStorage에서 데이터 읽어 PDF 렌더링
  - 브라우저 다운로드
```

---

## 3. 페이지 구조

| 경로 | 역할 | 주요 동작 |
|------|------|----------|
| `/` | 랜딩 | 서비스 소개 + 시작하기 버튼 |
| `/onboarding` | 성향 진단 | 6스텝 설문 (A~F) → 리스크점수 + 배경프로파일 추출 → sessionStorage 저장 |
| `/result` | 결과 + PDF | OpenAI 호출(배경프로파일 반영) → 포트폴리오 표시 → PDF 다운로드 |

### 페이지 접근 가드
```
/result 접근 시
  → sessionStorage에 riskLevel 없으면 /onboarding 리다이렉트
  → 클라이언트 컴포넌트 useEffect 첫 줄에서 처리
```

---

## 4. API Route 구조

```
POST /api/portfolio
  입력: PortfolioRequest (수치·enum·tag만, PII 없음)
  처리: OpenAI gpt-4.1 호출 → Zod 검증
  출력: PortfolioResult
  저장: 없음 (CONSTITUTION 원칙 2)
  타임아웃: 25s (maxDuration = 30 설정, 여유 확보)
  에러: 구조화된 에러 응답 반환 (클라이언트에서 재시도 가능)
```

---

## 5. 컴포넌트 구조 원칙

| 컴포넌트 | 종류 | 이유 |
|---------|------|------|
| 랜딩 페이지 | 서버 | 정적 콘텐츠, SEO |
| 설문 스텝 | 클라이언트 | sessionStorage 접근, 인터랙션 |
| 결과 페이지 | 클라이언트 | sessionStorage 접근, OpenAI 호출 후 렌더링 |
| PDF 컴포넌트 | 클라이언트 + dynamic(ssr:false) | @react-pdf/renderer는 브라우저 전용 |
| DisclaimerBanner | 서버 가능 | 정적 문구 |

**'use client' 경계 원칙**: sessionStorage·useState·useEffect가 필요한 컴포넌트만 클라이언트 지정. PDF 컴포넌트(PdfDocument)는 `'use client'` 불필요 — dynamic import로 처리.

---

## 6. 상태 관리 원칙

```
설문 진행 중: React 상태 (로컬)
                ↓ 스텝 완료 시
           sessionStorage 저장
                ↓
결과 페이지:  sessionStorage 읽기
                ↓ OpenAI 응답 수신 후
           sessionStorage에 portfolio 추가 저장
                ↓
PDF 생성:    sessionStorage 읽기 → 클라이언트 PDF 렌더링
```

**sessionStorage 키**: `portfolioai_session` (단일 키, 전체 SessionData 직렬화)

---

## 7. OpenAI 호출 설계

```ts
// 모델: gpt-4.1
// 응답 형식: Structured Outputs (response_format: { type: 'json_schema', json_schema: ... })
//   → JSON mode보다 스키마 준수율 높음, Zod 검증 실패 가능성 최소화
// 타임아웃: 25s (Next.js Route maxDuration = 30)
// 재시도: 2회 (동일 입력으로 재호출)
// 실패 시: 구조화된 에러 반환 → 클라이언트 재시도 버튼 표시

// 파일 위치
// - 시스템 프롬프트: lib/openai/prompts.ts
// - 입출력 Zod 스키마: lib/openai/schema.ts
// - OpenAI 클라이언트: lib/openai/client.ts
```

---

## 8. PDF 생성 설계

```
@react-pdf/renderer 사용
  - 완전 클라이언트 사이드 (서버 호출 없음)
  - sessionStorage에서 PortfolioResult 읽어 렌더링
  - 한글 폰트: Noto Sans KR (public/fonts/ 로컬 임베딩)
  - 다운로드 파일명: portfolio_{timestamp}.pdf
  - PdfDocument: 'use client' 불필요, dynamic import로 처리
  - PdfDownloadButton: 'use client' + dynamic(ssr:false) 필수
```

---

## 9. 에러 처리 전략

| 상황 | 처리 |
|------|------|
| OpenAI 호출 실패 | 에러 메시지 + 재시도 버튼 표시 |
| Zod 검증 실패 | 재시도 1회 후 실패 시 에러 화면 |
| sessionStorage 읽기 실패 | /onboarding 리다이렉트 + 데이터 초기화 안내 |
| PDF 생성 실패 | 에러 토스트 + 재시도 버튼 표시 |
| 네트워크 오류 | 오프라인 감지 후 안내 메시지 표시 |

---

## 10. 바꾸기 어려운 결정

| 결정 | 내용 | 변경 비용 |
|------|------|----------|
| 서버 무저장 구조 | sessionStorage만 사용 | 높음 — DB 추가 시 전체 데이터 흐름 재설계 |
| 클라이언트 사이드 PDF | @react-pdf/renderer | 중간 — Puppeteer 전환 시 API Route 추가 필요 |
| 단일 API Route | POST /api/portfolio | 낮음 — 기능 추가 시 Route 분리 가능 |

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-16 | 초안 작성 |
| 2026-04-16 | AI 모델 gpt-4o → gpt-4.1 변경 |
| 2026-04-16 | JSON mode → Structured Outputs 변경, PDF 'use client' 주의사항 명시 |
