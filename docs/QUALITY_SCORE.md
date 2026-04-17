# QUALITY_SCORE.md — PortfolioAI 품질 기준

> Core Layer `QUALITY_SCORE_BASE.md` 기반. 금융 서비스 특화 기준 추가.

---

## 1. 코드 품질

```bash
npm run typecheck   # 경고 0건
npm run lint        # 경고 0건
```

- `any` / 동적 타입 금지
- 단일 파일 300줄 이하, 단일 함수 50줄 이하
- 공용 타입은 `types/index.ts`에 집중

---

## 2. 테스트

| 대상 | 기준 |
|------|------|
| 성향 점수 계산 함수 | 70% 이상 (테스트 케이스 예시: onboarding.md §9 참조) |
| 포트폴리오 배분 알고리즘 | 70% 이상 |
| API Route (`/api/portfolio`) | 정상 경로 + 에러 케이스 포함 |
| UI 컴포넌트 | 상태 반응성 테스트 1개 이상 |

---

## 3. 에러 처리

- 조용한 실패 금지 — 빈 `catch` 블록 금지
- OpenAI API 실패 → 사용자에게 에러 메시지 표시 + 재시도 버튼
- OpenAI 호출 타임아웃: **25s** (Vercel maxDuration 30s 기준, ARCHITECTURE.md §7과 동일)
- OpenAI 호출 재시도: 2회 (동일 입력으로 재호출)
- sessionStorage 읽기 실패 → `/onboarding` 리다이렉트 (데이터 유실 안내 포함)

---

## 4. UI 상태 머신

포트폴리오 생성(OpenAI 호출) 화면은 3가지 상태 모두 도달 가능해야 한다.

| 상태 | UI |
|------|-----|
| Loading | 스켈레톤 또는 스피너 + 진행 메시지 |
| Success | 포트폴리오 결과 + DisclaimerBanner + PDF 다운로드 버튼 |
| Error | 에러 메시지 + 재시도 버튼 |

```tsx
// ✅ error를 최우선 분기
if (error) return <RetryButton reason={error} />
if (!data) return <Skeleton />
return (
  <>
    <DisclaimerBanner />
    <PortfolioResult data={data} />
    <PdfDownloadButton data={data} />
  </>
)
```

---

## 5. 보안 기준

### 5-1. 서버 데이터 무저장 (CONSTITUTION 원칙 2)
| 항목 | 기준 |
|------|------|
| API Route | 사용자 데이터를 DB·파일·로그에 write하는 코드 없을 것 |
| OpenAI 호출 | 응답을 서버 측에 저장하지 않고 클라이언트에 바로 반환 |
| 서버 로그 | 성향 점수·응답 데이터가 `console.log`에 포함되지 않을 것 |

### 5-2. OpenAI 호출 보안 (CONSTITUTION 원칙 4)
| 항목 | 기준 |
|------|------|
| 페이로드 | `name`, `email`, `phone` 필드 포함 금지 |
| 전달 데이터 | 성향 점수(숫자), 리스크 레벨(enum), 행동 태그(string)만 허용 |

### 5-3. 환경변수
| 항목 | 기준 |
|------|------|
| `OPENAI_API_KEY` | 서버 전용 — `NEXT_PUBLIC_` 접두사 절대 금지 |
| `.env.local` | `.gitignore` 등록 필수 |
| `.env.example` | 키만 기재하여 저장소에 커밋 |

### 5-4. sessionStorage
| 항목 | 기준 |
|------|------|
| 저장 범위 | 설문 응답·포트폴리오 결과에 한정 |
| 안내 | 탭 닫힘 시 데이터 소멸됨을 서비스 시작 화면에서 안내 |

---

## 6. 금융 서비스 특화 기준

### 6-1. 투자 고지 (CONSTITUTION 원칙 1)
- 포트폴리오 결과 화면에 `DisclaimerBanner` 컴포넌트 필수
- PDF 출력물에도 동일 문구 포함 필수
- 숨김(`display:none`, `hidden`, `opacity:0`) 처리 금지

### 6-2. AI 근거 표시 (CONSTITUTION 원칙 3)
- OpenAI 응답 스키마에 `reasoning: string` 필드 필수
- `z.string().min(1)`으로 Zod 검증 — 빈 문자열 차단
- UI와 PDF 모두에서 `reasoning` 렌더링 누락 금지

### 6-3. PDF 품질
- 포트폴리오 결과, 자산 배분 비율, reasoning, DisclaimerBanner 모두 포함
- 한글 폰트 깨짐 없을 것 (Noto Sans KR 로컬 임베딩)
- A4 기준 레이아웃 이탈 없을 것

---

## 7. 검증 체크리스트 (기능 완료 시)

```
Step 1: 정적 분석
  □ typecheck 경고 0건
  □ lint 경고 0건
  □ 예상 파일만 변경됨

Step 2: 보안
  □ API Route에 서버 저장 코드 없음
  □ OpenAI 페이로드에 PII 없음
  □ OPENAI_API_KEY 클라이언트 노출 없음
  □ 서버 로그에 사용자 데이터 없음

Step 3: 안정성
  □ OpenAI 호출 타임아웃 25s, 재시도 2회, fallback 메시지 설정
  □ sessionStorage 읽기 실패 처리 존재
  □ 조용한 실패 없음

Step 4: UI 상태
  □ Loading / Success / Error 3가지 모두 도달 가능
  □ Error가 Success 분기 안에 숨어있지 않음
  □ 상태 반응성 테스트 존재

Step 5: 금융 규칙
  □ 결과 화면에 DisclaimerBanner 존재 및 숨김 없음
  □ PDF에 DisclaimerBanner 포함
  □ reasoning 필드 UI·PDF 모두 렌더링
  □ PDF 한글 폰트·레이아웃 정상

Step 6: 문서
  □ PLANS.md 반영 예정
  □ 변경사항이 product-specs와 일치
```
