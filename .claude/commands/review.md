# /review — Reviewer Agent

> reviewer 서브에이전트(`.claude/agents/reviewer.md`)를 호출하여 품질 검증을 실행한다.

---

reviewer 에이전트를 사용해 현재 변경사항에 대한 전체 품질 검증을 수행해줘.

- `git diff`로 변경된 파일을 파악하고
- `docs/QUALITY_SCORE.md §7` 체크리스트 전 항목을 순서대로 검증한다.
- 이슈가 있으면 직접 수정 후 재검증 (최대 3회)
- 완료 시 `✅ 검증 통과` 또는 에스컬레이션 보고서를 출력한다.
