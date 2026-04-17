# /sync-docs — Documenter Agent

> 역할 정의·자율 범위는 `docs/AGENTS.md §Documenter` 참조.

---

## 실행 순서

### Step 1: 현재 상태 파악
```bash
git status
git diff --name-only
```

### Step 2: PLANS.md 업데이트
`docs/PLANS.md` 읽기 → 완료된 항목 `[ ]` → `[x]`

> Phase 완료 선언(모든 항목 체크)은 사람 승인 후 진행.

### Step 3: open-decisions.md 업데이트
`docs/open-decisions.md` 읽기 → 결정된 항목 상태 업데이트

### Step 4: 스펙 동기화 확인
구현과 product-spec 차이 발견 시 → 사람에게 보고 (직접 수정 불가)

### Step 5: git commit
```bash
git add [변경 파일]
git commit -m "$(cat <<'EOF'
docs: [변경 내용 요약]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## 완료 조건
- [ ] `docs/PLANS.md` 반영 완료
- [ ] `docs/open-decisions.md` 처리 완료
- [ ] git commit 완료
