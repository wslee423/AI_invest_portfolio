# /analyze-prompt — Portfolio Analyst Agent

> 역할 정의·자율 범위는 `docs/AGENTS.md §Portfolio Analyst` 참조.
> AI 분석 기능이 포함된 작업에만 실행.

---

## 실행 순서

### Step 1: 현재 파일 읽기
- `lib/openai/prompts.ts` — 없으면 `docs/portfolio.md §3` 기준 신규 설계
- `lib/openai/schema.ts` — 없으면 `docs/portfolio.md §2` 기준 신규 설계

### Step 2: 스키마 검증
- [ ] `reasoning: z.string().min(1)` 존재 (CONSTITUTION 원칙 3)
- [ ] `allocations` ratio 합계 = 100 검증 존재
- [ ] 페이로드에 `name` / `email` / `phone` 없음 (CONSTITUTION 원칙 4)

### Step 3: 등급별 배분 가이드라인 확인
`docs/portfolio.md §3` 가이드라인 vs 시스템 프롬프트 비교

- [ ] 5개 등급(`very_conservative` ~ `very_aggressive`) 가이드라인 프롬프트에 명시

### Step 4: 행동 프로파일 반영 확인
- [ ] `return_type=income/income_growth` → 리츠·배당ETF 비중 확대 반영
- [ ] `involvement=passive/full_passive` → 인덱스 ETF 중심 반영
- [ ] `fomo_type=exclusion/social_pressure` → 충동 매매 리스크 경고 포함

---

## 결과

- 이슈 없음 → `✅ 프롬프트·스키마 검증 통과`
- 이슈 있음 → 수정안 제안

> 등급 체계·자산군 범위·가중치 구조 변경은 **사람 승인 필요** (`docs/AGENTS.md §Portfolio Analyst` 참조)
