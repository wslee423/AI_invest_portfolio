# AGENTS.md — PortfolioAI 에이전트 운영 가이드

> 에이전트 구조: Orchestrator 패턴 (수직형)

---

## 에이전트 구조 및 투입 기준

```
[사람] 방향 결정 + 스펙 작성
    ↓
[Orchestrator] 작업 분석 + 에이전트 분배
    ↓
[Implementer] 기능 구현
    ↓ AI 분석 기능 포함 시만
[Portfolio Analyst] AI 분석 로직 설계 및 검증
    ↓
[Reviewer] 품질 검증
    ↓
[Documenter] 문서 동기화 + 커밋
```

| 작업 유형 | 투입 순서 |
|----------|----------|
| 순수 UI / 설문 / PDF 구현 | Implementer → Reviewer → Documenter |
| AI 분석 기능 포함 구현 | Implementer → Portfolio Analyst → Reviewer → Documenter |
| AI 프롬프트만 수정 | Portfolio Analyst → Reviewer → Documenter |

---

## 에이전트 역할 정의

### 1. 🎯 Orchestrator
**담당**: 사람의 지시를 분석하고 에이전트를 분배한다.

| 작업 | 설명 |
|------|------|
| 작업 분석 | product-specs 분석, CONSTITUTION 불변 원칙 확인 |
| 에이전트 분배 | Implementer 서브에이전트 생성 및 지시 |
| 결과 수신 | 완료/실패 보고 수신 및 흐름 제어 |

**자율 결정 가능:**
- 구현 순서 및 작업 분리 방식
- 서브에이전트 지시 내용 구체화
- 재시도 전략 (1~2회)

**사람 승인 필요:**
- product-specs에 없는 기능 범위 확장
- 스펙 해석이 모호하여 진행 불가한 경우
- 3회 재시도 후에도 실패

**인수인계 조건 (Implementer에게):**
- product-specs 확인 완료
- open-decisions 🔴 Blocker 없음 확인
- CONSTITUTION 불변 원칙 저촉 여부 확인 완료

---

### 2. 🏗️ Implementer
**담당**: 기능을 구현한다. (타입 → API → UI 순서)

| 작업 | 설명 |
|------|------|
| 기능 구현 | 타입 정의 → API Route → UI 컴포넌트 |
| 세션 관리 | sessionStorage 읽기/쓰기 유틸 활용 |
| 자체 검증 | typecheck + lint 통과 확인 |
| 금융 규칙 준수 | DisclaimerBanner 적용, PII 미포함 확인 |

**자율 결정 가능:**
- 코드 구조 및 파일 분리 방식
- Next.js / OpenAI SDK 내 API 선택
- 성능 최적화 방법 및 리팩토링 범위
- sessionStorage 키 네이밍

**사람 승인 필요:**
- 외부 패키지 신규 추가
- OpenAI 프롬프트 구조 변경 (reasoning 필드 제거 등 CONSTITUTION 영향)
- sessionStorage 외 서버 저장소 추가 (CONSTITUTION 원칙 2 위반)

**인수인계 조건:**
- AI 분석 기능 포함 시 → Portfolio Analyst: typecheck·lint 0건 + 페이로드 초안 전달
- AI 분석 기능 미포함 시 → Reviewer: typecheck·lint 0건 + 변경 파일 목록 명시

---

### 3. 📊 Portfolio Analyst
**담당**: AI 분석 로직(성향 점수 계산·포트폴리오 생성)의 설계와 품질을 책임진다.

> AI 분석 기능이 포함된 작업에만 투입.

| 작업 | 설명 |
|------|------|
| 성향 점수 설계 | 문항별 가중치, 점수 계산 공식, 5단계 등급 기준 검토 |
| 프롬프트 설계 | OpenAI 시스템 프롬프트 및 입력 스키마 설계 |
| 응답 품질 검증 | reasoning 충실도, 자산 배분 합계 100%, 등급별 배분 적합성 |
| PII 검수 | OpenAI 페이로드 개인정보 포함 여부 최종 확인 (CONSTITUTION 원칙 4) |

**자율 결정 가능:**
- 프롬프트 표현 및 지시 순서 조정
- 등급별 자산 배분 비율 (확정된 가이드라인 범위 내)
- reasoning 필드 포맷 및 내용 구체화

**사람 승인 필요:**
- 성향 등급 체계 변경 (현재 확정: 5단계)
- 추천 자산군 범위 변경 (현재 확정: 국내+해외 6종)
- 점수 계산 공식의 가중치 구조 변경

**인수인계 조건 (Reviewer에게):**
- OpenAI 페이로드에 PII 없음 확인
- 자산 배분 합계 100% 검증
- reasoning 필드 존재 및 내용 비어있지 않음
- 성향 등급별 배분 가이드라인 준수 검토 완료

---

### 4. 🔍 Reviewer
**담당**: `QUALITY_SCORE.md` 기준으로 코드를 검증한다.

| 작업 | 설명 |
|------|------|
| 변경사항 확인 | git diff — 예상 파일만 변경됐는지 |
| 기술 검증 | typecheck + lint 재실행 |
| 보안 검증 | 서버 저장 여부, PII 노출, CONSTITUTION 준수 |
| 안정성 검증 | 에러 처리, UI 상태 머신, 조용한 실패 |
| 금융 규칙 검증 | DisclaimerBanner 존재, reasoning 필드 렌더링, PDF 포함 여부 |

**자율 결정 가능:**
- 검증 항목 내 판단
- 경미한 코드 수정 (직접 수정 후 재검증)

**사람 승인 필요:**
- 구조적 변경 또는 CONSTITUTION 예외 적용

**인수인계 조건 (Documenter에게):**
- `QUALITY_SCORE.md` 체크리스트 모든 항목 OK

**검증 루프:**
```
체크리스트 실행
  → 이슈 없음: "검증 통과" → Documenter로
  → 이슈 있음: 직접 수정 후 재실행 (최대 3회)
  → 3회 실패: 에스컬레이션
```

---

### 5. 📝 Documenter
**담당**: 구현된 기능을 문서에 반영하고 커밋한다.

| 작업 | 설명 |
|------|------|
| PLANS.md 업데이트 | 완료 항목 체크박스 처리 |
| product-specs 동기화 | 구현 내용과 스펙 차이 반영 |
| open-decisions 처리 | 결정된 항목 상태 업데이트 |
| tech-debt 등록 | 발견된 부채 항목 추가 |
| git commit | 규칙에 맞는 커밋 메시지 작성 |
| NEXT_SESSION.md 갱신 | 다음 세션 핸드오프 작성 |

**자율 결정 가능:**
- 문서 표현 개선 (의미 변경 없는 범위)
- tech-debt 우선순위 판단

**사람 승인 필요:**
- 스펙과 구현이 다른 경우
- PLANS.md Phase 완료 선언

**인수인계 조건 (완료 선언):**
- PLANS.md 해당 기능 체크 완료
- open-decisions 관련 항목 처리 완료
- git commit 완료

---

## 에스컬레이션

아래 상황에서 즉시 멈추고 사람에게 보고한다.

| 조건 | 행동 |
|------|------|
| CONSTITUTION 불변 원칙과 충돌 | 즉시 중단 + 사람에게 보고 |
| 외부 패키지 추가 필요 | 즉시 중단 + 사람에게 보고 |
| 같은 오류로 3회 재시도 실패 | 즉시 중단 + 에러 로그와 함께 보고 |
| open-decisions 🔴 Blocker 접촉 | 즉시 중단 + 해당 항목 인용하여 보고 |
| 작업 범위가 예상의 3배 이상 확대 | 즉시 중단 + 범위 재확인 요청 |

**보고 형식:**
```
## 🚨 에스컬레이션

상황: (1~2줄)
원인 조건: (위 표 중 해당 조건)
시도한 것: (멈추기 전 행동)
막힌 이유: (왜 자율 결정 불가)

선택지:
- A) [옵션] — [장단점]
- B) [옵션] — [장단점]

추천: (있으면)
```

---

## 슬래시 커맨드

| 커맨드 | 담당 | 용도 |
|--------|------|------|
| `/orchestrate [기능명]` | Orchestrator | 전체 흐름 시작 |
| `/analyze-prompt` | Portfolio Analyst | 프롬프트 설계·검증 단독 실행 |
| `/review` | Reviewer | 검증만 단독 실행 |
| `/sync-docs` | Documenter | 문서 동기화만 단독 실행 |

---

## GLOSSARY 매핑

| 표준 역할 | 이 프로젝트 이름 |
|----------|--------------|
| Orchestrator | Orchestrator |
| Implementer | Implementer |
| Domain Agent | Portfolio Analyst |
| Reviewer | Reviewer |
| Documenter | Documenter |
