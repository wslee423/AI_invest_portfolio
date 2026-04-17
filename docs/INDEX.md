# PortfolioAI 최종 프로젝트 문서

로그인 없이 성향 진단 → AI 포트폴리오 생성 → PDF 다운로드까지 완결되는 일회성 웹 서비스.

**작성 완료**: 2026-04-16
**최종 평가**: 8.95/10 (정합성 9.0, 구현명확성 9.0, 간결성 8.9, 완전성 8.9, 안전성 9.0)

---

## 📋 문서 구성

### 최상위 (루트)
프로젝트 최초 읽을 문서들. 에이전트는 세션 시작 시 CONSTITUTION → CLAUDE → AGENTS 순서대로 읽습니다.

| 문서 | 설명 |
|------|------|
| **CONSTITUTION.md** | 최상위 불변 원칙 (4개). 모든 결정의 기준. |
| **CLAUDE.md** | 에이전트 세션 컨텍스트. 스택 선택, 환경변수, 파일 구조. |
| **AGENTS.md** | 에이전트 5역할 정의 (Orchestrator·Implementer·Portfolio Analyst·Reviewer·Documenter). |
| **QUALITY_SCORE.md** | 품질 검증 기준. 코드·테스트·보안·금융 규칙. |
| **ARCHITECTURE.md** | 기술 스택 선택 이유 + 데이터 흐름 설계. |
| **PLANS.md** | 전체 로드맵 (Phase 1~5) + 체크리스트. |
| **README.md** | 프로젝트 소개 (현재 파일 참고). |

### docs/ 내부 구조
상세 문서. 구현 단계별로 필요한 스펙.

```
docs/
├── ARCHITECTURE.md          (루트 복사본 — docs/ 에서도 접근 가능)
├── PLANS.md                 (루트 복사본 — docs/ 에서도 접근 가능)
├── exec-plans/
│   └── open-decisions.md    미결 의사결정 (현재: 미결 0개)
│   └── tech-debt-tracker.md 기술 부채
│   └── NEXT_SESSION.md      세션 간 핸드오프
└── product-specs/
    ├── onboarding.md        Phase 2 성향 진단 스펙 (17문항, 점수 계산, UI 흐름)
    ├── portfolio.md         Phase 3 포트폴리오 생성 스펙 (OpenAI, Recharts)
    └── pdf.md               Phase 4 PDF 출력 스펙 (한글 폰트, @react-pdf/renderer)
```

---

## 🎯 빠른 시작

### 1. 문서 읽는 순서 (에이전트 세션 시작)
```
1. CONSTITUTION.md     → 불변 원칙 4개 확인
2. CLAUDE.md          → 스택·환경변수·파일 구조 확인
3. AGENTS.md          → 에이전트 역할·자율 범위 확인
4. PLANS.md           → 현재 Phase 확인
5. 해당 product-specs/*.md  → 구현 기준
```

### 2. Phase별 구현 순서
- **Phase 1**: CLAUDE.md 기반 프로젝트 초기화
- **Phase 2**: docs/product-specs/onboarding.md 구현
- **Phase 3**: docs/product-specs/portfolio.md 구현
- **Phase 4**: docs/product-specs/pdf.md 구현
- **Phase 5**: PLANS.md Phase 5 체크리스트 실행

### 3. 검증 체크리스트
QUALITY_SCORE.md §7 — 기능 완료 시 마다 실행

---

## ⚠️ CONSTITUTION 불변 원칙 (4개)

**원칙 1. 투자 결과 무보장 고지 필수**
- 결과 화면 + PDF에 DisclaimerBanner 필수
- 숨김 처리(display:none, hidden, opacity:0) 금지

**원칙 2. 서버 데이터 무저장**
- sessionStorage 와 메모리에만 저장
- API Route에서 DB/파일/로그 write 금지

**원칙 3. AI 판단 근거 표시 의무**
- OpenAI 응답에 `reasoning` 필드 필수
- UI + PDF 모두 렌더링

**원칙 4. OpenAI 호출 시 PII 미포함**
- name, email, phone 필드 절대 금지
- 익명화된 수치·tag만 전달

---

## 📊 최종 평가 점수

| 기준 | 점수 | 설명 |
|------|------|------|
| 정합성 (A) | 9.0 | 문서 간 수치·명칭 완벽 일치 |
| 구현명확성 (B) | 9.0 | 에이전트가 문서만 보고 바로 구현 가능 |
| 간결성 (C) | 8.9 | 불필요한 중복·장황함 제거 |
| 완전성 (D) | 8.9 | 구현에 필요한 정보 빠짐없음 |
| 안전성 (E) | 9.0 | 잘못 구현 시 CONSTITUTION 위반 차단 |
| **전체** | **8.95** | **프로덕션 레벨** |

---

## 🔍 주요 수정사항 (14개)

| 번호 | 유형 | 내용 | 해결 |
|------|------|------|------|
| 1 | 버그 | gpt-4o 잔존 | ARCHITECTURE.md 모델 통일 |
| 2 | 버그 | 타임아웃 10s vs 25s 불일치 | QUALITY_SCORE.md 25s 통일 |
| 3 | 버그 | Puppeteer 잔존 | CLAUDE.md React-PDF만 명시 |
| 4 | 버그 | Recharts 승인 완료 표시 누락 | portfolio.md 완료 표시 |
| 5 | 버그 | MIN_RAW 17 → 실제 24 | onboarding.md 24 수정 + 테스트 케이스 추가 |
| 6 | 버그 | PdfDocument 불필요한 'use client' | pdf.md 제거 (dynamic import로 처리) |
| 7 | 모호 | 문항 수 18 → 실제 17 | onboarding.md 17로 수정 |
| 8 | 모호 | "PII 제거" 표현 부정확 | ARCHITECTURE.md "익명화된 수치만 추출"로 변경 |
| 9 | 모호 | 프롬프트에 출력 스키마 예시 없음 | portfolio.md JSON 구조 명시 |
| 10 | 간소화 | StyleSheet 세부 수치 고정 | pdf.md 구조만 남김 |
| 11 | 간소화 | 투입 기준 중복 | AGENTS.md 표로 통합 |
| 12 | 추가 | .env.example 언급 없음 | CLAUDE.md 추가 |
| 13 | 추가 | JSON mode vs Structured Outputs 미결정 | portfolio.md Structured Outputs 확정 |
| 14 | 추가 | 테스트 케이스 예시 없음 | onboarding.md 5개 케이스 추가 |

---

## 📁 파일 목록

**루트 (즉시 읽을 문서)**
```
CONSTITUTION.md       (3.2 KB) — 최상위 원칙
CLAUDE.md            (4.5 KB) — 에이전트 컨텍스트
AGENTS.md            (8.2 KB) — 에이전트 역할 (5개)
QUALITY_SCORE.md     (6.8 KB) — 품질 기준
ARCHITECTURE.md      (7.5 KB) — 기술 설계
PLANS.md             (9.2 KB) — Phase 1~5 로드맵
README.md            (2.1 KB) — 프로젝트 소개
INDEX.md             (this file)
```

**docs/ (Phase별 스펙)**
```
docs/
├── ARCHITECTURE.md                    (루트 복사본)
├── PLANS.md                          (루트 복사본)
├── exec-plans/
│   ├── open-decisions.md             (미결 0개)
│   ├── tech-debt-tracker.md
│   └── NEXT_SESSION.md
└── product-specs/
    ├── onboarding.md                 (Phase 2 - 17문항 설문)
    ├── portfolio.md                  (Phase 3 - OpenAI 연동)
    └── pdf.md                        (Phase 4 - PDF 생성)
```

**총 문서 크기**: ~60 KB (모두 평문 Markdown)

---

## 🚀 개발 시작 체크리스트

```
[ ] 1. 모든 문서 다운로드
[ ] 2. CONSTITUTION.md 읽기 (불변 원칙 4개 숙지)
[ ] 3. CLAUDE.md 읽기 (스택·환경변수 확인)
[ ] 4. AGENTS.md 읽기 (에이전트 역할 이해)
[ ] 5. PLANS.md Phase 1 읽기 (초기화 작업 확인)
[ ] 6. 프로젝트 초기화 시작 (`npm create next-app@latest ...`)
[ ] 7. PLANS.md 체크리스트에 따라 Phase 1 완료
[ ] 8. Phase 2로 진행 (docs/product-specs/onboarding.md)
```

---

## 📞 기술 지원

### 문서 이슈
- 정합성 문제: QUALITY_SCORE.md §3 타임아웃 기준 확인
- 구현 명확성: ARCHITECTURE.md §7 OpenAI 호출 설계 참고
- 안전성: CONSTITUTION.md 원칙 4개 + QUALITY_SCORE.md §5 보안 기준

### 에이전트 문제
- 자율 범위 불명: AGENTS.md 해당 역할의 "자율 결정 가능" 섹션 확인
- 에스컬레이션 필요: AGENTS.md "에스컬레이션" 섹션 참고

---

**문서 작성 완료**: 2026-04-16
**최종 검수**: 완료 (14개 버그·모호함 수정)
**준비 상태**: ✅ 개발 시작 준비 완료
