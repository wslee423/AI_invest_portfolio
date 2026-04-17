# /review — Reviewer Agent

> 역할 정의·자율 범위는 `docs/AGENTS.md §Reviewer` 참조.
> 전체 체크리스트 기준은 `docs/QUALITY_SCORE.md §7` 참조.

---

## 실행 순서

### Step 1: 변경사항 파악
```bash
git diff --name-only
git diff --stat
```
예상 파일 외 변경사항 있으면 사람에게 보고.

### Step 2: 정적 분석
```bash
npm run typecheck
npm run lint
```
- [ ] typecheck 경고 0건
- [ ] lint 경고 0건

### Step 3: 보안
- [ ] API Route에 서버 저장 코드 없음
- [ ] OpenAI 페이로드에 `name` / `email` / `phone` 없음 (CONSTITUTION 원칙 4)
- [ ] `OPENAI_API_KEY`에 `NEXT_PUBLIC_` 없음

### Step 4: 안정성
- [ ] 빈 `catch` 블록 없음
- [ ] OpenAI 타임아웃 25s + 재시도 2회
- [ ] sessionStorage 읽기 실패 → `/onboarding` 리다이렉트 처리

### Step 5: UI 상태 (결과 페이지 변경 시)
- [ ] Loading / Success / Error 3가지 분기 모두 존재
- [ ] Error가 최우선 분기

### Step 6: 금융 규칙
- [ ] `DisclaimerBanner` 결과 화면 존재 + 숨김 없음 (CONSTITUTION 원칙 1)
- [ ] `DisclaimerBanner` PDF 포함 (Phase 4 이후)
- [ ] `reasoning` UI + PDF 렌더링 (CONSTITUTION 원칙 3)

---

## 결과

- 전체 OK → `✅ 검증 통과` 출력
- 이슈 발견 → 직접 수정 후 재검증 (최대 3회)
- 3회 실패 → 에스컬레이션 (`docs/AGENTS.md` 보고 형식 참조)
