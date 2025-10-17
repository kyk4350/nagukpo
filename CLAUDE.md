# Claude AI 개발 가이드라인

이 문서는 AI 어시스턴트(Claude)가 나국포 프로젝트를 일관성 있게 개발하기 위한 규칙과 가이드라인을 정의합니다.

## 목차
- [API 엔드포인트 규칙](#api-엔드포인트-규칙)
- [코드 스타일 가이드](#코드-스타일-가이드)
- [파일 구조 규칙](#파일-구조-규칙)
- [데이터베이스 규칙](#데이터베이스-규칙)
- [보안 규칙](#보안-규칙)

---

## API 엔드포인트 규칙

### 1. URL 구조 규칙

모든 API 엔드포인트는 다음 구조를 따릅니다:

```
/api/v{version}/{resource}/{action}
```

**필수 사항:**
- ✅ 모든 엔드포인트는 `/api/v1/`로 시작
- ✅ 리소스명은 복수형 사용 (`/users`, `/problems`, `/chat`)
- ✅ RESTful 원칙 준수
- ✅ 동사는 HTTP 메서드로 표현, URL에는 명사만 사용
- ❌ URL에 동사 사용 금지 (예: `/api/v1/getUser` ❌)

### 2. 현재 구현된 API 엔드포인트

#### 인증 (Authentication)
```
POST   /api/v1/auth/signup         # 회원가입
POST   /api/v1/auth/login          # 로그인
POST   /api/v1/auth/logout         # 로그아웃
POST   /api/v1/auth/refresh        # 토큰 갱신
GET    /api/v1/auth/me             # 현재 사용자 정보
```

#### 문제 (Problems)
```
GET    /api/v1/problems            # 문제 목록 조회 (쿼리 파라미터: level, type, page, limit)
GET    /api/v1/problems/:id        # 문제 상세 조회
POST   /api/v1/problems/:id/submit # 문제 풀이 제출
```

#### 진도/통계 (Progress & Stats)
```
GET    /api/v1/progress            # 사용자 학습 진도 조회 (인증 필요)
GET    /api/v1/stats               # 사용자 학습 통계 조회 (인증 필요)
```

#### 챗봇 (Chat)
```
POST   /api/v1/chat                # 챗봇에게 메시지 전송 (인증 필요)
GET    /api/v1/chat/history        # 대화 히스토리 조회 (인증 필요)
DELETE /api/v1/chat/history        # 대화 히스토리 삭제 (인증 필요)
```

### 3. 프론트엔드 API 경로 중복 방지

`apiClient`의 `baseURL`에 이미 `/api/v1`이 포함되어 있으므로, API 함수에서는 `/api/v1`을 제외한 리소스 경로만 작성한다.

### 4. HTTP 메서드 사용 규칙

| 메서드 | 용도 | 멱등성 | 예시 |
|--------|------|--------|------|
| `GET` | 조회 | O | `GET /api/v1/problems` |
| `POST` | 생성, 액션 | X | `POST /api/v1/auth/login` |
| `PUT` | 전체 수정 | O | `PUT /api/v1/users/:id` |
| `PATCH` | 부분 수정 | O | `PATCH /api/v1/users/:id` |
| `DELETE` | 삭제 | O | `DELETE /api/v1/chat/history` |

### 4. 응답 형식 규칙

**성공 응답:**
```typescript
{
  success: true,
  data: {
    // 실제 데이터
  }
}
```

**에러 응답:**
```typescript
{
  success: false,
  error: "에러 메시지"
}
```

**페이지네이션 응답:**
```typescript
{
  success: true,
  data: {
    items: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 100,
      totalPages: 5
    }
  }
}
```

### 5. 상태 코드 규칙

| 코드 | 의미 | 사용 시점 |
|------|------|-----------|
| `200` | OK | 성공적인 GET, PUT, PATCH, DELETE |
| `201` | Created | 성공적인 POST (리소스 생성) |
| `204` | No Content | 성공했지만 반환할 데이터 없음 |
| `400` | Bad Request | 잘못된 요청 (검증 실패) |
| `401` | Unauthorized | 인증 실패 (로그인 필요) |
| `403` | Forbidden | 권한 없음 |
| `404` | Not Found | 리소스 없음 |
| `409` | Conflict | 리소스 충돌 (이미 존재하는 이메일 등) |
| `422` | Unprocessable Entity | 검증 실패 (Zod validation) |
| `500` | Internal Server Error | 서버 에러 |

### 6. 새로운 API 추가 시 체크리스트

새로운 API 엔드포인트를 추가할 때 다음 사항을 확인하세요:

- [ ] `/api/v1/` 접두사 사용
- [ ] RESTful 원칙 준수 (명사 사용, HTTP 메서드 활용)
- [ ] `backend/src/routes/*.routes.ts` 파일에 라우트 정의
- [ ] `backend/src/controllers/*.controller.ts` 파일에 컨트롤러 로직
- [ ] `backend/src/services/*.service.ts` 파일에 비즈니스 로직
- [ ] 인증이 필요한 엔드포인트는 `authMiddleware` 적용
- [ ] Zod 스키마로 요청 검증
- [ ] `backend/src/index.ts`에 라우트 등록
- [ ] 프론트엔드 API 클라이언트 함수 작성 (`frontend/src/lib/api/*.ts`)
- [ ] React Query 훅 작성 (`frontend/src/hooks/queries/*.ts`)
- [ ] `DEVELOPMENT.md`의 API 엔드포인트 섹션 업데이트

---

## 코드 스타일 가이드

### 1. TypeScript 규칙

**인터페이스 네이밍:**
```typescript
// ✅ Good
export interface User { ... }
export interface CreateUserRequest { ... }
export interface UserResponse { ... }

// ❌ Bad
export interface IUser { ... }  // I 접두사 사용 금지
export interface user { ... }   // 소문자 시작 금지
```

**타입 vs 인터페이스:**
- 객체 형태는 `interface` 사용
- Union, Intersection은 `type` 사용

```typescript
// ✅ Good
interface User {
  id: string
  name: string
}

type UserRole = 'admin' | 'user' | 'guest'

// ❌ Bad - 일관성 없음
type User = {
  id: string
  name: string
}
```

### 2. 파일 네이밍 규칙

| 파일 유형 | 네이밍 규칙 | 예시 |
|-----------|-------------|------|
| 컴포넌트 | PascalCase | `UserProfile.tsx` |
| 훅 | camelCase with `use` prefix | `useAuth.ts` |
| 유틸리티 | camelCase | `formatDate.ts` |
| 타입 정의 | camelCase | `user.ts`, `api.ts` |
| 라우트 | kebab-case | `auth.routes.ts` |
| 컨트롤러 | kebab-case | `auth.controller.ts` |
| 서비스 | kebab-case | `auth.service.ts` |

### 3. Import 순서

```typescript
// 1. 외부 라이브러리
import React from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. 내부 절대 경로 import
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

// 3. 상대 경로 import
import { formatDate } from './utils'

// 4. 타입 import (맨 마지막)
import type { User } from '@/types'
```

### 4. 함수 네이밍 규칙

```typescript
// ✅ Good - 동사로 시작
async function getUser() { ... }
async function createUser() { ... }
async function updateUser() { ... }
async function deleteUser() { ... }
function isAuthenticated() { ... }
function hasPermission() { ... }

// ❌ Bad - 명사로 시작
async function user() { ... }
function authenticated() { ... }
```

---

## 파일 구조 규칙

### 1. 백엔드 파일 구조

```
backend/src/
├── routes/           # API 라우트 정의
│   ├── auth.routes.ts
│   ├── problem.routes.ts
│   └── chat.routes.ts
├── controllers/      # HTTP 요청 처리
│   ├── auth.controller.ts
│   ├── problem.controller.ts
│   └── chat.controller.ts
├── services/         # 비즈니스 로직
│   ├── auth.service.ts
│   ├── problem.service.ts
│   └── chat.service.ts
├── middleware/       # Express 미들웨어
│   ├── auth.middleware.ts
│   └── errorHandler.middleware.ts
├── utils/            # 유틸리티 함수
│   ├── prisma.ts
│   └── logger.ts
└── index.ts          # 서버 진입점
```

**역할 분리:**
- **Routes**: API 엔드포인트 정의, 미들웨어 적용
- **Controllers**: HTTP 요청/응답 처리, 서비스 호출
- **Services**: 비즈니스 로직, 데이터베이스 접근
- **Middleware**: 인증, 검증, 에러 처리

### 2. 프론트엔드 파일 구조

```
frontend/src/
├── app/              # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/
│   ├── preset/
│   └── chat/
├── components/       # React 컴포넌트
│   ├── ui/           # 재사용 가능한 UI 컴포넌트
│   └── providers/    # Context Providers
├── hooks/            # 커스텀 훅
│   └── queries/      # React Query 훅
├── lib/              # 라이브러리 설정
│   └── api/          # API 클라이언트
├── store/            # Zustand 스토어
└── types/            # TypeScript 타입 정의
```

---

## 데이터베이스 규칙

### 1. Prisma 스키마 규칙

**모델 네이밍:**
- PascalCase 사용 (단수형)
- 테이블명은 snake_case (복수형)

```prisma
model User {
  id String @id @default(cuid())
  // ...
  @@map("users")  // 테이블명은 복수형
}
```

**필드 네이밍:**
```prisma
model User {
  // ✅ Good - camelCase
  createdAt   DateTime @default(now()) @map("created_at")
  lastName    String   @map("last_name")

  // ❌ Bad - snake_case in Prisma schema
  created_at  DateTime
  last_name   String
}
```

### 2. 관계 설정

**1:N 관계:**
```prisma
model User {
  id       String    @id
  posts    Post[]    // 복수형
}

model Post {
  id       String @id
  authorId String @map("author_id")
  author   User   @relation(fields: [authorId], references: [id])
}
```

**인덱스 설정:**
```prisma
model User {
  email String @unique

  @@index([email])        // 자주 검색하는 필드
  @@index([createdAt])    // 정렬에 사용하는 필드
}
```

---

## 보안 규칙

### 1. 인증 필수 엔드포인트

다음 엔드포인트는 반드시 `authMiddleware` 적용:
- 사용자 정보 조회/수정
- 학습 진도/통계 조회
- 챗봇 대화
- 문제 풀이 제출

```typescript
// ✅ Good
router.post('/chat', authMiddleware, chatController.sendMessage)

// ❌ Bad - 인증 없음
router.post('/chat', chatController.sendMessage)
```

### 2. 환경 변수 관리

**절대 Git에 커밋하지 말 것:**
- `.env`
- `.env.local`
- API 키, DB 비밀번호

**대신 제공할 것:**
- `.env.example` (예제 파일)

### 3. 비밀번호 처리

```typescript
// ✅ Good - bcrypt 해싱
import bcrypt from 'bcrypt'
const hashedPassword = await bcrypt.hash(password, 10)

// ❌ Bad - 평문 저장
const password = '123456'  // 절대 금지!
```

### 4. SQL Injection 방지

```typescript
// ✅ Good - Prisma 사용 (자동 방지)
await prisma.user.findUnique({ where: { email } })

// ❌ Bad - Raw query (특별한 경우만 사용)
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${email}`
```

---

## 문서 업데이트 규칙

코드 변경 시 다음 문서를 함께 업데이트하세요:

1. **API 추가/수정** → `DEVELOPMENT.md`의 "API 엔드포인트 설계" 섹션
2. **기술 스택 변경** → `DEVELOPMENT.md`의 "기술 스택" 섹션
3. **새로운 규칙 추가** → 이 문서 (`CLAUDE.md`)
4. **주요 기능 완성** → `TODO.md` 체크리스트 업데이트
5. **프로젝트 개요 변경** → `README.md`

---

**최종 업데이트**: 2025-10-17
**버전**: 1.0.0
