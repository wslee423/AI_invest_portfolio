# PortfolioAI

> 로그인 없이 5분 성향 진단 → AI 맞춤 포트폴리오 생성 → PDF 다운로드

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)

---

## 서비스 소개

17개 설문으로 투자 성향을 진단하고, OpenAI gpt-4.1이 개인 맞춤 자산배분 포트폴리오를 생성합니다. 모든 데이터는 브라우저 `sessionStorage`에만 존재하며, 탭을 닫으면 즉시 소멸됩니다.

**핵심 특징**

- 로그인 불필요 — 완전 익명
- 서버에 사용자 데이터 저장 없음
- 도넛 차트 + 3가지 실제 종목 포트폴리오 플랜 제공
- A4 PDF 다운로드 (한글 지원)

---

## 사용자 흐름

```
랜딩(/) → 성향 진단(/onboarding) → 결과 + PDF 다운로드(/result)
```

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript strict |
| Styling | Tailwind CSS |
| AI | OpenAI gpt-4.1 (Structured Outputs) |
| 스키마 검증 | Zod |
| 차트 | Recharts |
| PDF | @react-pdf/renderer + NotoSansKR |
| 배포 | Vercel |

---

## 로컬 실행

### 1. 저장소 클론 및 의존성 설치

```bash
git clone https://github.com/wslee423/AI_invest_portfolio.git
cd AI_invest_portfolio
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local`에 OpenAI API 키를 입력합니다.

```env
OPENAI_API_KEY=sk-...
```

> `NEXT_PUBLIC_` 접두사는 절대 사용하지 마세요. API 키가 브라우저에 노출됩니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000`에서 확인합니다.

---

## 개발 명령어

```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run typecheck    # TypeScript 검사 (경고 0건 필수)
npm run lint         # ESLint 검사 (경고 0건 필수)
npm run test         # Jest 단위 테스트
```

---

## 프로젝트 구조

```
app/
  page.tsx                  # 랜딩 페이지
  layout.tsx                # 루트 레이아웃 (SEO 메타데이터)
  loading.tsx               # 글로벌 로딩 스피너
  onboarding/page.tsx       # 성향 진단 설문 (5단계, 17문항)
  result/page.tsx           # 결과 페이지 (loading / success / error)
  api/portfolio/route.ts    # OpenAI 연동 API Route
  privacy/page.tsx          # 개인정보처리방침

components/features/
  onboarding/               # 설문 UI (스텝, 진행률)
  result/                   # 결과 UI (차트, 포트폴리오 카드, 플랜)
  pdf/                      # PDF 문서 컴포넌트 + 다운로드 버튼
  disclaimer/               # 투자 고지 배너

lib/
  survey/                   # 점수 계산 + 등급 분류 (테스트 포함)
  openai/                   # 클라이언트, 프롬프트, Zod 스키마
  session/                  # sessionStorage 유틸
  pdf/                      # 폰트 등록 (NotoSansKR)
  risk-nicknames.ts         # 성향별 닉네임 정의

types/index.ts              # 공용 타입 (PortfolioResult, RiskLevel 등)
public/fonts/               # NotoSansKR (PDF 한글 폰트)
```

---

## 배포 (Vercel)

1. GitHub 저장소를 Vercel에 연결
2. **Settings → Environment Variables**에 `OPENAI_API_KEY` 추가
3. `main` 브랜치 푸시 시 자동 배포

> Vercel Analytics는 대시보드에서 **Enable** 클릭만으로 활성화됩니다 (코드 수정 불필요).

---

## 보안 원칙 (CONSTITUTION)

| 원칙 | 내용 |
|------|------|
| 투자 고지 | 결과 화면·PDF 모두 DisclaimerBanner 필수 |
| 서버 저장 금지 | 사용자 데이터 DB·파일 저장 없음 |
| AI 근거 제공 | reasoning 필드 항상 UI·PDF에 렌더링 |
| PII 미포함 | OpenAI 페이로드에 이름·이메일·전화번호 없음 |

---

## 주의사항

- `.env.local`은 절대 커밋하지 마세요
- 이 서비스의 포트폴리오는 AI 생성 참고 자료이며 투자 권유가 아닙니다
- 투자에는 원금 손실 위험이 있으며 최종 결정은 본인 책임입니다
