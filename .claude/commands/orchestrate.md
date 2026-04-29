# orchestrate.md — Orchestrator 실행 흐름

> 역할 정의·자율 범위·에스컬레이션 조건은 `AGENTS.md` 참조.
> 이 문서는 실행 순서와 게이트 체크리스트만 정의한다.

---

## 실행 흐름

```
Step 1. 사전 확인      → open-decisions Blocker 없음 확인
Step 2. 구현           → Implementer 역할 (타입 → API → UI)
Step 3. AI 기능 검증   → Portfolio Analyst 역할 (AI 분석 포함 시만)
Step 4. 품질 검증      → Reviewer 역할 (QUALITY_SCORE.md 체크리스트)
Step 5. 문서 + 커밋    → Documenter 역할
```

---

## Step 1 — 사전 확인 게이트

읽을 파일 순서:
1. `docs/CONSTITUTION.md`
2. `docs/open-decisions.md`
3. `docs/PLANS.md`
4. 해당 Phase product-spec (`onboarding.md` / `portfolio.md` / `pdf.md`)

통과 조건:
- [ ] `open-decisions.md` 🔴 Blocker 없음
- [ ] CONSTITUTION 불변 원칙 4개 위반 없음

실패 시 → **즉시 중단 + 에스컬레이션** (`AGENTS.md` 보고 형식 참조)

---

## Step 2 — 구현 게이트

구현 순서: **타입 → lib 유틸 → API Route → 컴포넌트 → 페이지 연결**

자율 결정 가능 / 즉시 중단 조건 → `AGENTS.md §Implementer` 참조

통과 조건:
- [ ] typecheck 0건
- [ ] lint 0건

---

## Step 3 — AI 기능 게이트

> OpenAI 호출 코드가 포함된 경우에만 실행.

- [ ] 페이로드에 `name` / `email` / `phone` 없음 (CONSTITUTION 원칙 4)
- [ ] `allocations` ratio 합계 = 100 검증 존재
- [ ] `reasoning: z.string().min(1)` Zod 검증 존재 (CONSTITUTION 원칙 3)

---

## Step 4 — 품질 검증 게이트

> **reviewer 서브에이전트에게 위임한다.**

reviewer 에이전트를 사용해 현재 변경사항에 대한 전체 품질 검증을 수행해줘.

- `git diff`로 변경 파일 파악
- `docs/QUALITY_SCORE.md §7` 체크리스트 전 항목 순서대로 검증
- 이슈 발견 시 직접 수정 후 재검증 (최대 3회)
- 완료 시 `✅ 검증 통과` 보고 후 Step 5로 넘어간다

통과 조건:
- [ ] reviewer 에이전트가 `✅ 검증 통과` 보고

---

## Step 5 — 문서 + 커밋 게이트

1. `docs/PLANS.md` — 완료 항목 `[ ]` → `[x]`
2. `docs/open-decisions.md` — 결정된 항목 상태 업데이트

```bash
git add [변경 파일]
git commit -m "$(cat <<'EOF'
feat: [기능명]

- [변경 요약]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

통과 조건:
- [ ] PLANS.md 반영 완료
- [ ] git commit 완료
