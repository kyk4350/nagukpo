# 나국포 개발 문서

## 목차
- [프로젝트 구조](#프로젝트-구조)
- [기술 스택](#기술-스택)
- [기술 스택 선정 사유](#기술-스택-선정-사유)
- [환경 설정](#환경-설정)
- [개발 명령어](#개발-명령어)
- [아키텍처](#아키텍처)

---

## 프로젝트 구조

### 전체 디렉토리 구조

```
nagukpo/
├── frontend/                       # Next.js 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── app/                   # Next.js 14 App Router
│   │   ├── components/            # React 컴포넌트
│   │   │   └── providers/         # Context Provider 컴포넌트
│   │   ├── hooks/                 # 커스텀 React 훅
│   │   │   └── queries/           # React Query 훅
│   │   ├── stores/                # Zustand 상태 관리
│   │   ├── lib/                   # 유틸리티 함수
│   │   │   └── api/               # API 클라이언트
│   │   └── types/                 # TypeScript 타입 정의
│   ├── public/                    # 정적 파일
│   ├── package.json               # 의존성 관리
│   ├── tsconfig.json              # TypeScript 설정
│   ├── next.config.js             # Next.js 설정
│   ├── tailwind.config.js         # Tailwind CSS 설정
│   ├── postcss.config.js          # PostCSS 설정
│   └── .env.example               # 환경 변수 예제
│
├── backend/                        # Express.js 백엔드 애플리케이션
│   ├── src/
│   │   ├── routes/                # API 라우트
│   │   ├── controllers/           # 비즈니스 로직
│   │   ├── services/              # 서비스 계층
│   │   ├── middleware/            # Express 미들웨어
│   │   ├── models/                # Prisma 모델
│   │   ├── utils/                 # 유틸리티 함수
│   │   └── index.ts               # 서버 진입점
│   ├── prisma/
│   │   └── schema.prisma          # 데이터베이스 스키마
│   ├── package.json               # 의존성 관리
│   ├── tsconfig.json              # TypeScript 설정
│   └── .env.example               # 환경 변수 예제
│
├── shared/                         # 프론트엔드/백엔드 공유 모듈
│   ├── src/
│   │   ├── types/                 # 공유 타입 정의
│   │   ├── schemas/               # Zod 검증 스키마
│   │   └── constants/             # 공유 상수
│   ├── package.json
│   └── tsconfig.json
│
├── data/                           # 공공데이터 저장소
│   ├── aihub/                     # AI Hub 데이터
│   ├── korean-dict/               # 표준국어대사전 데이터
│   └── scripts/                   # 데이터 전처리 스크립트
│
├── docs/                           # 프로젝트 문서
│   └── DEVELOPMENT.md             # 이 문서
│
├── package.json                    # 루트 워크스페이스 설정
├── .gitignore                      # Git 무시 파일
└── README.md                       # 프로젝트 소개
```

### 주요 디렉토리 역할

| 디렉토리 | 역할 | 기술 |
|---------|------|------|
| `frontend/` | 사용자 인터페이스 | Next.js, React, Tailwind CSS |
| `backend/` | REST API 서버 | Express.js, Prisma, PostgreSQL |
| `shared/` | 공유 코드 | TypeScript, Zod |
| `data/` | 공공데이터 저장 | JSON, CSV |
| `docs/` | 개발 문서 | Markdown |

---

## 기술 스택

### 프론트엔드

#### 핵심 프레임워크
- **Next.js 14.2.0**
  - React 프레임워크
  - App Router (파일 기반 라우팅)
  - 서버 컴포넌트 지원
  - 자동 코드 분할 및 최적화

- **React 18.3.0**
  - UI 컴포넌트 라이브러리
  - Concurrent 렌더링
  - Hooks API

- **TypeScript 5.x**
  - 정적 타입 시스템
  - 개발 시 타입 안전성 보장

#### 상태 관리 & 데이터 페칭
- **Zustand 4.5.0**
  - 클라이언트 상태 관리
  - Redux보다 간단한 API
  - 인증 상태 관리

- **TanStack Query (React Query) 5.x**
  - 서버 상태 관리
  - 자동 캐싱 및 리페칭
  - 로딩/에러 상태 자동 관리
  - Optimistic Updates 지원

#### 데이터 시각화
- **Recharts 2.12.0**
  - 학습 진도 및 통계 차트
  - React 컴포넌트 기반

#### UI & 스타일링
- **Tailwind CSS 3.4.1**
  - 유틸리티 우선 CSS 프레임워크
  - 커스텀 디자인 시스템

- **Framer Motion 11.0.0**
  - 애니메이션 라이브러리
  - 페이지 전환 효과

- **Lucide React 0.344.0**
  - 모던 아이콘 라이브러리
  - 1,000+ SVG 아이콘

#### 개발 도구
- **ESLint 8**
  - 코드 품질 검사
  - Next.js 권장 규칙

- **PostCSS 8 + Autoprefixer**
  - CSS 후처리
  - 크로스 브라우저 호환성

---

### 백엔드

#### 핵심 프레임워크
- **Node.js 20.19.5**
  - JavaScript 런타임
  - `.nvmrc` 파일로 버전 고정
  - Next.js 14는 v18.17.0 이상 필요

- **Express.js 4.18.2**
  - 웹 애플리케이션 프레임워크
  - RESTful API 구축

- **TypeScript 5.3.3**
  - 서버 사이드 타입 안전성

#### 데이터베이스 & ORM
- **PostgreSQL 16**
  - 관계형 데이터베이스
  - ACID 트랜잭션 지원
  - JSON/JSONB 타입 지원

- **Prisma 5.10.0**
  - 차세대 ORM
  - 타입 안전 쿼리
  - 마이그레이션 관리

- **Redis 4.6.13**
  - 인메모리 캐시
  - 세션 스토어
  - 속도 최적화

#### 인증 & 보안
- **jsonwebtoken 9.0.2**
  - JWT 토큰 생성/검증
  - Stateless 인증

- **bcrypt 5.1.1**
  - 비밀번호 해싱
  - 솔트 알고리즘

- **CORS 2.8.5**
  - 크로스 오리진 요청 처리

#### AI & 챗봇
- **OpenAI 4.28.0** ✅ 구현 완료
  - GPT-4 API 클라이언트
  - 국어 학습 전용 챗봇
  - 대화 히스토리 저장/조회
  - 응답 토큰 제한: 1500
  - 토큰 제한 시 안내 메시지 자동 추가

- **LangChain 0.1.25** ⏳ 구현 예정
  - LLM 애플리케이션 프레임워크
  - RAG (검색 증강 생성) 구현
  - 프롬프트 관리

- **Pinecone** ⏳ 구현 예정
  - 벡터 데이터베이스
  - 임베딩 유사도 검색
  - 관련 학습 자료 검색

#### 데이터 검증
- **Zod 3.22.4**
  - 런타임 타입 검증
  - API 요청/응답 검증
  - 프론트엔드와 스키마 공유

#### 개발 도구
- **tsx 4.7.1**
  - TypeScript 직접 실행
  - 빠른 개발 반복

- **dotenv 16.4.5**
  - 환경 변수 관리

---

### 공유 모듈 (Shared)

- **TypeScript 5.3.3**
  - 프론트/백 간 타입 공유

- **Zod 3.22.4**
  - 공통 검증 스키마

---

### 인프라 & 도구

#### 모노레포
- **npm workspaces**
  - 멀티 패키지 관리
  - 의존성 호이스팅

- **Concurrently 8.2.2**
  - 동시 프로세스 실행
  - 프론트/백 동시 개발

#### 버전 관리
- **Git**
  - 소스 코드 관리
  - GitHub 호스팅

---

## 기술 스택 선정 사유

### 프론트엔드 선택 이유

#### 1. Next.js 14 (React 18)
**선정 이유:**
- **SSR/SSG 지원**: 초기 로딩 속도 최적화 및 SEO 향상
- **App Router**: 파일 기반 라우팅으로 직관적인 페이지 구조
- **서버 컴포넌트**: 클라이언트 번들 크기 감소, 성능 향상
- **이미지 최적화**: 자동 이미지 최적화로 로딩 속도 개선
- **API Routes**: 별도 백엔드 없이 간단한 API 구현 가능
- **개발 경험**: 빠른 리로딩, 에러 오버레이

**대안 비교:**
- ~~Create React App~~: 빌드 최적화 부족, 더 이상 권장되지 않음
- ~~Vite + React~~: CSR 중심, SSR 구현 복잡
- ~~Remix~~: 학습 곡선, 생태계 규모

#### 2. TypeScript
**선정 이유:**
- **타입 안전성**: 컴파일 타임 에러 검출, 런타임 버그 감소
- **자동 완성**: IDE 지원으로 개발 속도 향상
- **리팩토링 안전성**: 코드 변경 시 영향 범위 명확히 파악
- **팀 협업**: 코드 가독성 및 유지보수성 향상
- **Next.js 공식 지원**: 내장 TypeScript 설정

#### 3. Tailwind CSS
**선정 이유:**
- **빠른 개발**: 유틸리티 클래스로 CSS 작성 시간 단축
- **일관된 디자인**: 디자인 토큰으로 색상/간격 통일
- **번들 최적화**: PurgeCSS로 사용하지 않는 스타일 제거
- **반응형 디자인**: 모바일 퍼스트 접근법
- **커스터마이징**: tailwind.config.js로 프로젝트 맞춤 설정

**대안 비교:**
- ~~CSS Modules~~: 클래스명 고민 시간 증가
- ~~Styled Components~~: 런타임 오버헤드, 번들 크기 증가
- ~~MUI~~: 디자인 커스터마이징 제한

#### 4. TanStack Query (React Query)
**선정 이유:**
- **서버 상태 전문**: API 데이터 페칭, 캐싱, 동기화에 최적화
- **자동 캐싱**: staleTime, cacheTime으로 불필요한 요청 제거
- **중복 요청 방지**: 동일한 쿼리키는 한 번만 실행
- **Optimistic Updates**: 사용자 경험 개선 (즉각적인 UI 반응)
- **로딩/에러 자동 관리**: useState/useEffect 보일러플레이트 제거
- **Background Refetch**: 창 포커스 시 자동 데이터 갱신
- **Next.js SSR 지원**: Hydration을 통한 서버 데이터 전달

**대안 비교:**
- ~~SWR~~: 기능 부족, Optimistic Update 지원 약함
- ~~직접 구현~~: 캐싱, 리페칭 로직 복잡, 휠 재발명

#### 5. Zustand
**선정 이유:**
- **클라이언트 상태 전문**: 인증, UI 상태 등 비서버 상태 관리
- **경량**: Redux보다 10배 작은 번들 크기 (1KB)
- **간단한 API**: Boilerplate 최소화
- **TypeScript 지원**: 완벽한 타입 추론
- **React 18 호환**: Concurrent 렌더링 지원
- **React Query와 분리**: 관심사 분리 (서버 상태 vs 클라이언트 상태)

**대안 비교:**
- ~~Redux Toolkit~~: 복잡한 설정, Boilerplate 많음
- ~~Recoil~~: Meta 프로젝트, 장기 지원 불확실
- ~~Context API~~: 성능 이슈, 리렌더링 최적화 어려움

#### 6. Recharts
**선정 이유:**
- **React 통합**: 선언적 컴포넌트 API
- **커스터마이징**: 학습 진도, 약점 분석 차트 구현 용이
- **반응형**: 자동 리사이징
- **접근성**: SVG 기반으로 확대/축소 품질 유지

---

### 백엔드 선택 이유

#### 1. Node.js + Express.js
**선정 이유:**
- **JavaScript 풀스택**: 프론트엔드와 동일 언어, 코드 공유 가능
- **비동기 처리**: 이벤트 루프로 I/O 작업 효율적 처리
- **생태계**: npm 패키지 생태계 활용
- **개발 속도**: 빠른 프로토타이핑
- **마이크로서비스**: 필요 시 확장 가능

**대안 비교:**
- ~~NestJS~~: 복잡한 구조, 소규모 프로젝트에 과함
- ~~Fastify~~: Express보다 생태계 작음
- ~~Python Flask/FastAPI~~: 팀원 JavaScript 경험 많음

#### 2. PostgreSQL
**선정 이유:**
- **ACID 보장**: 데이터 일관성 중요 (학습 진도, 사용자 데이터)
- **JSON 지원**: JSONB 타입으로 유연한 데이터 저장
- **복잡한 쿼리**: 통계 집계, 약점 분석 쿼리 작성 용이
- **확장성**: 인덱싱, 파티셔닝 지원
- **무료 오픈소스**: 상용화 가능

**대안 비교:**
- ~~MongoDB~~: 스키마 없는 구조, 데이터 정합성 보장 어려움
- ~~MySQL~~: JSON 지원 부족, 고급 기능 부족

#### 3. Prisma ORM
**선정 이유:**
- **타입 안전성**: 자동 타입 생성으로 TypeScript 완벽 통합
- **선언적 스키마**: schema.prisma로 직관적 모델 정의
- **마이그레이션**: 자동 마이그레이션 생성 및 관리
- **Prisma Studio**: 데이터 시각화 및 편집 GUI
- **쿼리 성능**: 자동 쿼리 최적화

**대안 비교:**
- ~~Sequelize~~: TypeScript 지원 부족, 복잡한 설정
- ~~TypeORM~~: 버그 많음, 마이그레이션 불안정
- ~~Drizzle~~: 생태계 작음, 학습 자료 부족

#### 4. Redis
**선정 이유:**
- **초고속 캐싱**: 메모리 기반, 1ms 이하 응답 시간
- **세션 스토어**: JWT Refresh 토큰 저장
- **속도 제한**: API Rate Limiting 구현
- **실시간 기능**: 채팅, 알림 구현 시 활용 가능

#### 5. OpenAI + LangChain
**선정 이유:**
- **GPT-4**: 한국어 이해도 높음, 자연스러운 대화
- **LangChain**: RAG 구현 간소화, 프롬프트 관리
- **벡터 검색**: Pinecone과 통합하여 관련 학습 자료 검색
- **커스터마이징**: 학습 스타일별 맞춤형 응답 생성

**RAG (Retrieval Augmented Generation) 필요 이유:**
- **정확도**: 공공데이터 기반 답변으로 환각(Hallucination) 방지
- **최신 정보**: 교육과정 변경 사항 반영
- **출처 제공**: 학습 자료 출처 명시로 신뢰도 향상

#### 6. TanStack Query (React Query)
**선정 이유:**
- **서버 상태 전문**: API 데이터 페칭, 캐싱, 동기화에 최적화
- **자동 캐싱**: staleTime, cacheTime으로 불필요한 요청 제거
- **중복 요청 방지**: 동일한 쿼리키는 한 번만 실행
- **Optimistic Updates**: 사용자 경험 개선 (즉각적인 UI 반응)
- **로딩/에러 자동 관리**: useState/useEffect 보일러플레이트 제거
- **Background Refetch**: 창 포커스 시 자동 데이터 갱신
- **Next.js SSR 지원**: Hydration을 통한 서버 데이터 전달
- **DevTools 제공**: 개발 환경에서 쿼리 상태 디버깅

**대안 비교:**
- ~~SWR~~: 기능 부족, Optimistic Update 지원 약함
- ~~직접 구현~~: 캐싱, 리페칭 로직 복잡, 휠 재발명

#### 7. Zustand
**선정 이유:**
- **클라이언트 상태 전문**: 인증, UI 상태 등 비서버 상태 관리
- **경량**: Redux보다 10배 작은 번들 크기 (1KB)
- **간단한 API**: Boilerplate 최소화
- **TypeScript 지원**: 완벽한 타입 추론
- **React 18 호환**: Concurrent 렌더링 지원
- **React Query와 분리**: 관심사 분리 (서버 상태 vs 클라이언트 상태)

**대안 비교:**
- ~~Redux~~: 보일러플레이트 과다, 복잡한 설정
- ~~Recoil~~: 메타 내부 도구, 불안정한 API

#### 8. Zod
**선정 이유:**
- **런타임 검증**: API 요청/응답 데이터 검증
- **TypeScript 통합**: 자동 타입 추론
- **에러 메시지**: 명확한 검증 실패 이유 제공
- **프론트엔드 공유**: shared 패키지로 검증 로직 재사용

---

### 공유 전략 (Shared Module)

#### Monorepo 선택 이유
**선정 이유:**
- **코드 재사용**: 타입, 스키마, 상수 중복 제거
- **일관성**: 단일 소스 오브 트루스 (Single Source of Truth)
- **리팩토링**: 전체 코드베이스 동시 변경 가능
- **의존성 관리**: 버전 충돌 방지

**공유 항목:**
```typescript
// shared/src/types/user.ts
export interface User {
  id: string;
  username: string;
  email: string;
}

// shared/src/schemas/auth.ts
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// shared/src/constants/grade.ts
export const GRADES = ['초등', '중등', '고등'] as const;
```

---

### 인프라 & 도구 선택 이유

#### npm workspaces
**선정 이유:**
- **기본 내장**: 별도 도구 불필요 (Lerna, Turborepo 불필요)
- **간단한 설정**: package.json의 workspaces 필드만 추가
- **의존성 호이스팅**: 중복 패키지 설치 방지
- **스크립트 실행**: `--workspace` 플래그로 특정 패키지 실행

#### Concurrently
**선정 이유:**
- **동시 실행**: 프론트/백 동시 개발 서버 실행
- **색상 구분**: 로그 출력 시 프로세스별 색상
- **프로세스 관리**: 하나 실패 시 전체 종료 옵션

---

## 환경 설정

### 필수 요구사항

- **Node.js**: 20.19.5 (`.nvmrc` 파일에 명시)
  - **중요**: Next.js 14는 Node.js v18.17.0 이상 필요
  - nvm 사용 권장: `nvm use` 명령으로 자동 전환
- **npm**: 10.x
- **PostgreSQL**: 16.x
- **Redis**: 7.x
- **Git**: 2.x

### 로컬 개발 환경 구축

#### 1. 저장소 클론
```bash
git clone https://github.com/kyk4350/nagukpo.git
cd nagukpo
```

#### 2. Node.js 버전 설정 (nvm 사용 시)
```bash
# 프로젝트에 명시된 Node.js 버전 사용
nvm use

# 또는 명시적으로 v20.19.5 사용
nvm use 20.19.5

# 설치되지 않은 경우 설치
nvm install 20.19.5
```

#### 3. 의존성 설치
```bash
# 전체 워크스페이스 의존성 설치
npm install
```

#### 3. 환경 변수 설정

**백엔드 환경 변수** (`backend/.env`)
```env
# Server Configuration
NODE_ENV=development
PORT=3001
API_URL=http://localhost:3001

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/nagukpo?schema=public"

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Pinecone (Vector DB)
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-pinecone-environment
PINECONE_INDEX_NAME=nagukpo-embeddings

# Public Data API Keys
KOREAN_DICT_API_KEY=your-korean-dictionary-api-key
AIHUB_API_KEY=your-aihub-api-key

# CORS
FRONTEND_URL=http://localhost:3000
```

**프론트엔드 환경 변수** (`frontend/.env.local`)
```env
# API Configuration
# /api/v1 경로를 포함해야 합니다
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

#### 4. 데이터베이스 설정
```bash
# PostgreSQL 데이터베이스 생성
createdb nagukpo

# Prisma 마이그레이션 실행
cd backend
npm run prisma:migrate

# Prisma Client 생성
npm run prisma:generate
```

#### 5. Redis 실행
```bash
# macOS (Homebrew)
brew services start redis

# Docker
docker run -d -p 6379:6379 redis:7
```

---

## 개발 명령어

### 루트 레벨 명령어

```bash
# 프론트엔드 + 백엔드 동시 개발 서버 실행
npm run dev

# 프론트엔드만 실행 (http://localhost:3000)
npm run dev:frontend

# 백엔드만 실행 (http://localhost:3001)
npm run dev:backend

# 전체 프로젝트 빌드
npm run build

# 전체 테스트 실행
npm run test
```

### 프론트엔드 명령어

```bash
cd frontend

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# ESLint 검사
npm run lint
```

### 백엔드 명령어

```bash
cd backend

# 개발 서버 실행 (Hot Reload)
npm run dev

# TypeScript 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# Prisma 마이그레이션 생성 및 적용
npm run prisma:migrate

# Prisma Client 재생성
npm run prisma:generate

# Prisma Studio 실행 (DB GUI)
npm run prisma:studio
```

### 공유 모듈 명령어

```bash
cd shared

# TypeScript 빌드
npm run build

# TypeScript Watch 모드
npm run dev
```

---

## 아키텍처

### 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                          사용자                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  App Router  │  │  Components  │  │    Zustand   │      │
│  │   (pages)    │  │   (UI/UX)    │  │   (state)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express.js Backend                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routes     │→ │ Controllers  │→ │   Services   │      │
│  │  (API 엔드포인트) │  │ (비즈니스 로직)  │  │  (DB 접근)   │      │
│  └──────────────┘  └──────────────┘  └──────┬───────┘      │
│                                               │              │
│  ┌──────────────┐  ┌──────────────┐         │              │
│  │  Middleware  │  │   AI/LLM     │◄────────┘              │
│  │ (auth, CORS) │  │  (LangChain) │                         │
│  └──────────────┘  └──────────────┘                         │
└────────┬──────────────────┬──────────────────┬──────────────┘
         │                  │                  │
         ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────┐  ┌─────────────────┐
│   PostgreSQL    │ │    Redis    │  │  Pinecone       │
│  (주 데이터베이스)  │ │   (캐시)    │  │ (벡터 DB)       │
│                 │ │             │  │                 │
│  - 사용자        │ │  - 세션     │  │  - 임베딩       │
│  - 학습 진도    │ │  - 캐시     │  │  - 유사도 검색  │
│  - 문제/답변    │ │  - Rate     │  │                 │
└─────────────────┘ │    Limit    │  └─────────────────┘
                    └─────────────┘
         ▲
         │
         ▼
┌─────────────────┐          ┌─────────────────┐
│  OpenAI GPT-4   │          │  공공데이터      │
│  (챗봇 응답)     │          │  - AI Hub       │
│                 │          │  - 국어사전 API  │
└─────────────────┘          └─────────────────┘
```

### 데이터 흐름

#### 1. 사용자 인증 플로우
```
사용자 → 로그인 요청 → Express
                      ↓
                  bcrypt 검증
                      ↓
                  JWT 생성
                      ↓
               Redis에 세션 저장
                      ↓
          프론트엔드로 토큰 반환
```

#### 2. 챗봇 대화 플로우 (RAG)
```
사용자 질문 → Express → LangChain
                          ↓
                   OpenAI Embedding
                          ↓
                   Pinecone 검색 (관련 문서)
                          ↓
                   GPT-4 응답 생성 (문서 + 질문)
                          ↓
                   PostgreSQL 저장 (대화 기록)
                          ↓
                   프론트엔드로 응답 반환
```

#### 3. 학습 진도 추적
```
문제 풀이 완료 → Express → PostgreSQL 저장
                           ↓
                      통계 집계 쿼리
                           ↓
                      Redis 캐싱 (1시간)
                           ↓
                    프론트엔드로 진도 반환
```

### API 엔드포인트 설계

> **중요**: 모든 API 엔드포인트는 `/api/v1/` 접두사를 사용합니다. 자세한 규칙은 [CLAUDE.md](CLAUDE.md)를 참고하세요.

#### 인증 (Authentication)
```
POST   /api/v1/auth/signup     # 회원가입
POST   /api/v1/auth/login      # 로그인
POST   /api/v1/auth/logout     # 로그아웃
POST   /api/v1/auth/refresh    # 토큰 갱신
GET    /api/v1/auth/me         # 현재 사용자 정보 (인증 필요)
```

#### 문제 (Problems)
```
GET    /api/v1/problems        # 문제 목록 조회
                                # 쿼리 파라미터: level, type, page, limit
GET    /api/v1/problems/:id    # 문제 상세 조회
POST   /api/v1/problems/:id/submit  # 문제 풀이 제출 (인증 필요)
```

#### 진도/통계 (Progress & Stats)
```
GET    /api/v1/progress        # 사용자 학습 진도 조회 (인증 필요)
GET    /api/v1/stats           # 사용자 학습 통계 조회 (인증 필요)
```

#### 챗봇 (Chat)
```
POST   /api/v1/chat            # 챗봇에게 메시지 전송 (인증 필요)
GET    /api/v1/chat/history    # 대화 히스토리 조회 (인증 필요)
DELETE /api/v1/chat/history    # 대화 히스토리 삭제 (인증 필요)
```

#### 공통 응답 형식

**성공 응답:**
```json
{
  "success": true,
  "data": { /* 실제 데이터 */ }
}
```

**에러 응답:**
```json
{
  "success": false,
  "error": "에러 메시지"
}
```

### 데이터베이스 스키마 설계 (Prisma)

```prisma
// 사용자
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  username      String   @unique
  passwordHash  String
  grade         String   // 학년 (초등, 중등, 고등)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  progress      Progress[]
  chatMessages  ChatMessage[]
  achievements  Achievement[]
}

// 학습 진도
model Progress {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  problemId   String
  problem     Problem  @relation(fields: [problemId], references: [id])
  isCorrect   Boolean
  timeSpent   Int      // 초 단위
  submittedAt DateTime @default(now())

  @@index([userId])
  @@index([problemId])
}

// 문제
model Problem {
  id          String   @id @default(cuid())
  type        String   // 문제 유형 (독해, 문법, 어휘)
  grade       String   // 학년
  difficulty  Int      // 난이도 (1~5)
  question    String   @db.Text
  passage     String?  @db.Text // 지문
  choices     Json     // 선택지
  answer      String
  explanation String   @db.Text
  source      String   // 데이터 출처
  createdAt   DateTime @default(now())

  progress    Progress[]

  @@index([type])
  @@index([grade])
  @@index([difficulty])
}

// 챗봇 대화
model ChatMessage {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  role      String   // user | assistant
  content   String   @db.Text
  context   Json?    // RAG에서 사용된 문서
  createdAt DateTime @default(now())

  @@index([userId])
}

// 업적
model Achievement {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  type        String   // 업적 유형
  title       String
  description String
  unlockedAt  DateTime @default(now())

  @@index([userId])
}
```

### 보안 고려사항

#### 인증 & 인가
- JWT 토큰 기반 Stateless 인증
- Refresh 토큰은 Redis에 저장 (TTL 7일)
- 민감한 엔드포인트는 미들웨어로 인증 확인
- 비밀번호는 bcrypt로 해싱 (salt rounds: 10)

#### API 보안
- CORS 설정으로 허용된 도메인만 접근
- Rate Limiting으로 DDoS 방지 (Redis 활용)
- Zod로 모든 입력 검증
- SQL Injection 방지 (Prisma 자동 방지)

#### 환경 변수
- `.env` 파일은 절대 Git에 커밋하지 않음
- `.env.example` 파일로 예제만 제공
- 프로덕션 환경은 환경 변수로 주입

---

## 개발 워크플로우

### Git 브랜치 전략

```
main                    # 프로덕션 배포
  ↑
develop                 # 개발 통합 브랜치
  ↑
feature/auth           # 기능 브랜치
feature/chatbot
feature/progress
```

### 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅 (기능 변경 없음)
refactor: 코드 리팩토링
test: 테스트 코드 추가
chore: 빌드 스크립트 수정
```

---

## 성능 최적화 전략

### 프론트엔드
- **코드 분할**: Next.js 자동 페이지별 분할
- **이미지 최적화**: `next/image` 컴포넌트 사용
- **폰트 최적화**: Google Fonts 자동 최적화
- **캐싱**: SWR/React Query로 API 응답 캐싱

### 백엔드
- **쿼리 최적화**: Prisma 인덱스 설정
- **Redis 캐싱**: 자주 조회되는 데이터 캐싱
- **Connection Pool**: 데이터베이스 연결 재사용
- **벡터 검색**: Pinecone으로 임베딩 검색 고속화

---

## 배포 전략

### 프론트엔드 배포
- **플랫폼**: Vercel (Next.js 최적화)
- **자동 배포**: GitHub 연동 시 자동 배포
- **환경 변수**: Vercel 대시보드에서 설정

### 백엔드 배포
- **플랫폼**: Railway / Render
- **데이터베이스**: Neon (PostgreSQL)
- **캐시**: Upstash (Redis)
- **환경 변수**: 플랫폼 대시보드에서 설정

---

## 참고 자료

### 공식 문서
- [Next.js 공식 문서](https://nextjs.org/docs)
- [React 공식 문서](https://react.dev/)
- [Express.js 공식 문서](https://expressjs.com/)
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [LangChain 공식 문서](https://js.langchain.com/)
- [OpenAI API 문서](https://platform.openai.com/docs)

### 공공데이터
- [AI Hub - 국어 교과 지문형 문제](https://www.aihub.or.kr/)
- [표준국어대사전 API](https://stdict.korean.go.kr/openapi/)

---

**최초 작성**: 2025-10-16
**최종 업데이트**: 2025-10-17
**작성자**: @kyk4350
**버전**: 0.2.0

---

## 변경 이력

### v0.2.0 (2025-10-17)
- React Query 전면 도입 및 문서화
- 챗봇 시스템 구현 완료
- Node.js 버전 명시 (20.19.5)
- API 엔드포인트 챗봇 섹션 추가
- 기술 스택 구현 상태 표시 추가

### v0.1.0 (2025-10-16)
- 초기 문서 작성
- 기술 스택 및 아키텍처 정의
