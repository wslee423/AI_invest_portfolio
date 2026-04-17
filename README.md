# PortfolioAI

로그인 없이 5분 성향 진단으로 AI 맞춤 투자 포트폴리오를 생성하고 PDF로 다운로드하는 웹 서비스.

## 특징

- **완전 익명**: 로그인 불필요, 개인정보 수집 없음
- **서버 저장 없음**: 모든 데이터는 브라우저 sessionStorage에만 존재
- **자동 소멸**: 탭을 닫으면 모든 데이터가 즉시 삭제됨
- **AI 포트폴리오**: OpenAI gpt-4.1 기반 맞춤 자산배분 설계
- **PDF 다운로드**: 포트폴리오 결과를 A4 PDF로 즉시 저장

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| AI | OpenAI gpt-4.1 Structured Outputs |
| PDF | @react-pdf/renderer + NotoSansKR |
| 차트 | Recharts |
| 스키마 검증 | Zod |
| 배포 | Vercel |

## 시작 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 복사하여 `.env.local` 파일을 만들고 OpenAI API 키를 입력합니다.

```bash
cp .env.example .env.local
```

`.env.local`:
```
OPENAI_API_KEY=sk-...
```

> `NEXT_PUBLIC_` 접두사를 절대 사용하지 마세요. API 키가 브라우저에 노출됩니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000`에서 확인합니다.

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 개발 명령어

```bash
npm run dev          # 개발 서버 (hot-reload)
npm run build        # 프로덕션 빌드
npm run typecheck    # TypeScript 타입 검사 (경고 0건 필수)
npm run lint         # ESLint 검사 (경고 0건 필수)
npm run test         # Jest 단위 테스트
```

## 서비스 흐름

```
/ (랜딩)
  → /onboarding (5단계 성향 진단 설문)
    → /result (AI 포트폴리오 생성 + PDF 다운로드)
```

## 프로젝트 구조

```
app/
  page.tsx              # 랜딩 페이지
  layout.tsx            # 루트 레이아웃 + SEO 메타데이터
  loading.tsx           # 글로벌 로딩 스피너
  onboarding/page.tsx   # 설문 페이지
  result/page.tsx       # 결과 페이지
  api/portfolio/        # OpenAI 연동 API Route
  privacy/page.tsx      # 개인정보처리방침

components/
  features/
    onboarding/         # 설문 UI 컴포넌트
    result/             # 결과 UI 컴포넌트 (차트, 포트폴리오 카드)
    pdf/                # PDF 문서 컴포넌트
    disclaimer/         # 투자 고지 배너

lib/
  survey/               # 설문 점수 계산 + 등급 분류
  openai/               # OpenAI 클라이언트, 프롬프트, Zod 스키마
  session/              # sessionStorage 유틸
  pdf/                  # 폰트 등록
  risk-nicknames.ts     # 투자 성향 닉네임 정의

types/
  index.ts              # 공용 타입 정의 (PortfolioResult, RiskLevel 등)

public/
  fonts/                # NotoSansKR (PDF 한글 폰트)
```

## 보안 원칙

1. **투자 고지 필수**: 결과 화면과 PDF 모두 DisclaimerBanner 표시
2. **서버 저장 금지**: 사용자 데이터를 DB·파일에 저장하는 코드 없음
3. **AI 근거 제공**: reasoning 필드 항상 UI와 PDF에 렌더링
4. **PII 미포함**: OpenAI 페이로드에 이름·이메일·전화번호 포함 금지

## 배포 (Vercel)

1. GitHub 저장소를 Vercel에 연결
2. Vercel 대시보드 → Settings → Environment Variables에서 `OPENAI_API_KEY` 추가
3. `main` 브랜치 푸시 시 자동 배포

## 주의사항

- `.env.local`은 절대 커밋하지 마세요 (`.gitignore`에 등록됨)
- 이 서비스가 제공하는 포트폴리오는 AI 생성 참고 자료이며 투자 권유가 아닙니다
- 투자에는 원금 손실 위험이 있으며 최종 투자 결정은 본인 책임입니다
