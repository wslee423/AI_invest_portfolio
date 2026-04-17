# CLAUDE.md — PortfolioAI 에이전트 컨텍스트

> 매 세션 자동으로 읽는 핵심 컨텍스트. 상세 규칙은 AGENTS.md 참조.

---

## 세션 시작 시 읽을 문서 (순서대로)

1. `CONSTITUTION.md` — 최상위 원칙
2. `AGENTS.md` — 역할 및 자율 범위
3. `docs/PLANS.md` — 현재 Phase 및 다음 작업
4. `docs/exec-plans/NEXT_SESSION.md` — 이전 세션 핸드오프 (있으면)

---

## 프로젝트 개요

**PortfolioAI**: 로그인 없이 성향 진단 → AI 포트폴리오 생성 → PDF 다운로드까지 완결되는 일회성 웹 서비스.
데이터는 sessionStorage에만 저장되며 서버에 보관하지 않는다.

| 역할 | 기술 |
|------|------|
| Language | TypeScript (strict) |
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| 상태 관리 | sessionStorage + React 상태 (로그인·DB 없음) |
| AI | OpenAI API (gpt-4.1) |
| PDF 생성 | @react-pdf/renderer |
| 차트 | Recharts |
| 스키마 검증 | Zod |
| 배포 | Vercel |

---

## 핵심 명령어

```bash
# 개발 서버
npm run dev

# 검증 — 매 작업 후 반드시 실행
npm run typecheck
npm run lint
npm run test
```

---

## Critical Rules

### Must Follow
- `any` 타입 금지 (TypeScript strict)
- 사용자 데이터를 서버(DB·로그·파일)에 저장 금지 (CONSTITUTION 원칙 2)
- OpenAI 호출 페이로드에 PII 포함 금지 (CONSTITUTION 원칙 4)
- 결과 UI와 PDF에 DisclaimerBanner 필수 (CONSTITUTION 원칙 1)
- 검증 명령어 통과 후 커밋

### Must NOT Do
- 외부 패키지 무단 추가
- CONSTITUTION / CLAUDE.md / AGENTS.md 무단 수정
- 하드코딩된 API 키 커밋
- sessionStorage 외 서버 측 저장소 사용

---

## 데이터 흐름

```
[사용자 입력] → sessionStorage (브라우저)
                    ↓ 익명화된 수치·tag만 추출
              [API Route: POST /api/portfolio]
                    ↓ OpenAI gpt-4.1 호출
              [결과 반환 — 서버 저장 없음]
                    ↓
              [결과 UI + sessionStorage 저장]
                    ↓ 클라이언트 사이드
              [PDF 생성 → 브라우저 다운로드]
                    ↓
              탭 닫으면 sessionStorage 소멸
```

---

## 파일 구조

```
/
  CONSTITUTION.md
  CLAUDE.md
  AGENTS.md
  QUALITY_SCORE.md
  README.md
  .env.example              ← 환경변수 템플릿 (값 없이 키만 기재)
  app/
    page.tsx                ← 랜딩 / 시작 화면
    onboarding/
      page.tsx              ← 성향 진단 설문 (5스텝)
    result/
      page.tsx              ← 포트폴리오 결과 + PDF 다운로드
    api/
      portfolio/
        route.ts            ← OpenAI gpt-4.1 호출 (저장 없음)
  components/
    ui/                     ← 재사용 원자 컴포넌트
    features/
      onboarding/           ← 설문 스텝 컴포넌트
      result/               ← 포트폴리오 결과 컴포넌트
      pdf/                  ← PDF 템플릿 컴포넌트
      disclaimer/           ← DisclaimerBanner (CONSTITUTION 원칙 1)
  lib/
    openai/                 ← OpenAI 클라이언트, 프롬프트, Zod 스키마
    session/                ← sessionStorage 읽기/쓰기/초기화 유틸
    pdf/                    ← 폰트 등록 (fonts.ts)
    utils/                  ← 공용 유틸 (formatDate 등)
  types/
    index.ts                ← 공용 타입 정의
  public/
    fonts/                  ← NotoSansKR ttf 3종 (Regular·Medium·Bold)
  docs/
    PLANS.md
    ARCHITECTURE.md
    product-specs/
    exec-plans/
      open-decisions.md
      tech-debt-tracker.md
      NEXT_SESSION.md
  .claude/
    commands/
      orchestrate.md
      review.md
      sync-docs.md
```

---

## 환경 변수

```bash
# .env.local (실제 값 입력 — .gitignore 등록 필수)
OPENAI_API_KEY=

# .env.example (키만 기재, 저장소에 커밋)
OPENAI_API_KEY=
```

> `OPENAI_API_KEY`는 서버 전용. `NEXT_PUBLIC_` 접두사 절대 금지.
