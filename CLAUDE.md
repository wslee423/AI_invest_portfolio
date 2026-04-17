# CLAUDE.md — PortfolioAI

## 세션 시작 시 반드시 읽을 것 (순서대로)

1. `docs/CONSTITUTION.md` — 최상위 원칙 (불변)
2. `docs/AGENTS.md` — 역할 및 자율 범위
3. `docs/PLANS.md` — 현재 Phase + 다음 작업
4. `docs/open-decisions.md` — Blocker 확인

---

## 프로젝트 개요

**PortfolioAI**: 로그인 없이 성향 진단 → AI 포트폴리오 생성 → PDF 다운로드.
데이터는 sessionStorage에만 존재. 서버 저장 없음.

| 역할 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript strict |
| Styling | Tailwind CSS |
| AI | OpenAI gpt-4.1 |
| PDF | @react-pdf/renderer |
| 차트 | Recharts |
| 스키마 검증 | Zod |
| 배포 | Vercel |

---

## 핵심 명령어

```bash
npm run dev
npm run typecheck   # 경고 0건 필수
npm run lint        # 경고 0건 필수
npm run test
```

---

## 파일 구조

```
/
  CLAUDE.md               ← 이 파일 (Claude Code 자동 읽기)
  docs/                   ← 모든 설계 문서
    CONSTITUTION.md
    AGENTS.md
    PLANS.md
    QUALITY_SCORE.md
    ARCHITECTURE.md
    onboarding.md
    portfolio.md
    pdf.md
    open-decisions.md
  .claude/
    settings.json
    commands/
      orchestrate.md      ← /orchestrate [기능명]
      review.md           ← /review
      sync-docs.md        ← /sync-docs
      analyze-prompt.md   ← /analyze-prompt
  app/                    ← Next.js (Phase 1 이후 생성)
  components/
  lib/
  types/
  public/
  package.json
```

---

## Critical Rules

- `any` 타입 금지 (TypeScript strict)
- 사용자 데이터를 서버에 저장 금지 (CONSTITUTION 원칙 2)
- OpenAI 페이로드에 PII 포함 금지 (CONSTITUTION 원칙 4)
- 결과 UI + PDF에 DisclaimerBanner 필수 (CONSTITUTION 원칙 1)
- typecheck + lint 통과 후 커밋

## Must NOT Do

- 외부 패키지 무단 추가
- CONSTITUTION / CLAUDE.md / AGENTS.md 무단 수정
- 하드코딩된 API 키 커밋
- sessionStorage 외 서버 측 저장소 사용
- NEXT_PUBLIC_ 접두사로 OPENAI_API_KEY 노출

---

## 슬래시 커맨드

| 커맨드 | 담당 에이전트 | 용도 |
|--------|-------------|------|
| `/orchestrate [기능명]` | Orchestrator | 전체 에이전트 흐름 자동 실행 |
| `/review` | Reviewer | 품질 검증만 단독 실행 |
| `/sync-docs` | Documenter | 문서 동기화 + 커밋만 실행 |
| `/analyze-prompt` | Portfolio Analyst | 프롬프트·스키마 설계·검증만 실행 |

---

## 환경 변수

```bash
# .env.local (실제 값 — .gitignore 등록 필수)
OPENAI_API_KEY=

# .env.example (키만 기재, 저장소에 커밋)
OPENAI_API_KEY=
```

> `OPENAI_API_KEY`는 서버 전용. `NEXT_PUBLIC_` 접두사 절대 금지.
