# Claude AI 개발 지침서

이 문서는 Claude AI가 나국포 프로젝트 개발 시 반드시 준수해야 할 규칙과 지침을 정의합니다.

---

## 📚 문서 구조 및 역할

### 1. CLAUDE.md (이 파일)
- **목적**: Claude AI가 프로젝트를 이해하고 일관성 있게 작업하기 위한 가이드
- **내용**: 코딩 컨벤션, 개발 원칙, 기술 스택 요약, AI 작업 지침
- **업데이트 시점**: 새로운 규칙이나 컨벤션이 추가될 때

### 2. DEVELOPMENT.md
- **목적**: 프로젝트의 기술적 설계 문서 및 아키텍처 기록
- **내용**:
  - 기술 스택 상세 정보 및 선정 사유
  - 프로젝트 구조 설명
  - 주요 아키텍처 결정 사항 및 변경 이유
  - 개발 환경 설정 방법
  - 코딩 컨벤션 상세 설명
- **업데이트 시점**: 기술 스택 변경, 아키텍처 변경, 새로운 설정 추가 시

### 3. PROGRESS.md
- **목적**: 개발 진행 상황 추적 및 구현 내역 기록
- **내용**:
  - 완료된 기능 목록
  - 생성/수정된 파일 목록과 코드 스니펫
  - 설치된 패키지 목록
  - 각 단계별 구현 상세 내역
- **업데이트 시점**: 새로운 기능 구현, 파일 생성/수정, 패키지 설치 시

### 4. README.md
- **목적**: 프로젝트 소개 및 빠른 시작 가이드
- **내용**: 프로젝트 설명, 설치 방법, 실행 방법, 기본 사용법
- **대상**: 외부 개발자 및 사용자

---

## 🤖 Claude AI 작업 시 문서 업데이트 규칙

### 1. 새로운 패키지 설치 시
- ⚠️ 사용자에게 먼저 허가 요청
- ✅ PROGRESS.md 업데이트 (패키지 목록에 추가)
- ✅ DEVELOPMENT.md 업데이트 (필요시 기술 스택 섹션 수정)

### 2. 새로운 파일 생성 시
- ✅ PROGRESS.md 업데이트 (파일 목록 및 코드 스니펫 추가)
- ✅ 주요 구조 변경인 경우 DEVELOPMENT.md 업데이트

### 3. 코딩 컨벤션 또는 개발 원칙 변경 시
- ✅ CLAUDE.md 업데이트 (AI 작업 지침)
- ✅ DEVELOPMENT.md 업데이트 (개발자용 상세 설명)

### 4. 아키텍처 변경 시
- ✅ **DEVELOPMENT.md 업데이트 (변경 사유 포함)** ← 필수!
- ✅ PROGRESS.md에 변경 내용 기록

### 5. 규칙에 어긋날 수 있는 작업 시
- ⚠️ 작업 전 사용자에게 확인 요청
- ✅ 승인 후 진행 및 관련 문서 업데이트

---

## 📌 핵심 원칙

### 1. **절대 변경 금지: 패키지 버전 고정**

**중요**: 아래 명시된 패키지 버전은 **절대 변경하지 마세요**. 호환성과 안정성이 검증된 버전입니다.

#### Frontend 고정 버전
```json
{
  "next": "^14.2.33",
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "zustand": "^4.5.0",
  "framer-motion": "^11.0.0",
  "recharts": "^2.12.0",
  "lucide-react": "^0.344.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0",
  "typescript": "^5",
  "tailwindcss": "^3.4.1",
  "eslint": "^8",
  "eslint-config-next": "^14.2.33"
}
```

#### Backend 고정 버전
```json
{
  "express": "^4.18.2",
  "langchain": "^0.3.36",
  "openai": "^4.28.0",
  "@prisma/client": "^5.10.0",
  "prisma": "^5.10.0",
  "redis": "^4.6.13",
  "zod": "^3.22.4",
  "typescript": "^5.3.3",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2"
}
```

#### 런타임 환경
```
Node.js: 20.x LTS (현재 v20.19.5)
PostgreSQL: 16.x
Redis: 7.x
```

### 2. **패키지 변경 규칙**

- ❌ **금지**: 사용자의 명시적 요청 없이 패키지 버전 변경
- ❌ **금지**: 새로운 패키지 추가 (사용자 승인 필요)
- ❌ **금지**: 메이저 버전 업데이트 (breaking changes)
- ✅ **허용**: 보안 취약점 수정을 위한 패치 버전 업데이트 (사용자에게 알림)
- ✅ **허용**: 사용자가 명시적으로 요청한 패키지 변경

**패키지 변경이 필요한 경우**:
1. 사용자에게 변경 이유 설명
2. 호환성 영향 분석 제시
3. 승인 후 진행

---

## 🚫 Git 커밋 규칙

### 1. **Claude 서명 금지**

커밋 메시지에 다음을 **절대 포함하지 마세요**:

❌ **금지 예시**:
```
feat: 사용자 인증 기능 추가

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

✅ **올바른 예시**:
```
feat: 사용자 인증 기능 추가

- JWT 기반 인증 구현
- bcrypt로 비밀번호 해싱
- Redis 세션 관리 추가
```

### 2. **커밋 메시지 컨벤션**

**형식**:
```
<type>: <subject>

<body>
```

**Type 종류**:
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드 추가
- `chore`: 빌드 스크립트, 패키지 설정 등

**Subject 규칙**:
- 50자 이내
- 명령문 사용 ("추가했다" ❌, "추가" ✅)
- 마침표 없음
- 한글 또는 영어 (일관성 유지)

**Body 규칙**:
- 72자마다 줄바꿈
- 변경 이유와 방법 설명
- 이슈 번호 포함 (있을 경우)

**예시**:
```
feat: 챗봇 RAG 시스템 구현

- LangChain으로 RAG 파이프라인 구축
- Pinecone 벡터 DB 연동
- OpenAI embedding 모델 사용
- 공공데이터 기반 문맥 검색 구현

관련 이슈: #12
```

### 3. **커밋 생성 규칙**

- ✅ 사용자가 명시적으로 요청한 경우에만 커밋 생성
- ✅ 커밋 전 `git status`와 `git diff`로 변경사항 확인
- ✅ 의미 있는 단위로 커밋 분리
- ❌ 여러 기능을 하나의 커밋에 포함 금지
- ❌ `.env`, `credentials.json` 등 민감 정보 커밋 금지

---

## 🎯 코드 일관성 및 명명 규칙

### 1. **파일명 규칙 (File Naming)**

#### Frontend (React/Next.js)
```
✅ 올바른 파일명:

페이지 (app router):
- app/page.tsx                    # 홈페이지
- app/login/page.tsx              # 로그인 페이지
- app/dashboard/page.tsx          # 대시보드
- app/[slug]/page.tsx             # 동적 라우트

컴포넌트:
- Button.tsx                      # PascalCase
- UserProfile.tsx                 # PascalCase
- NavigationBar.tsx               # PascalCase
- LoginForm.tsx                   # PascalCase

커스텀 훅:
- useAuth.ts                      # camelCase + 'use' 접두사
- useLocalStorage.ts              # camelCase + 'use' 접두사
- useFetchUser.ts                 # camelCase + 'use' 접두사

유틸리티:
- formatDate.ts                   # camelCase
- validateEmail.ts                # camelCase
- apiClient.ts                    # camelCase

타입 정의:
- user.types.ts                   # camelCase + '.types'
- api.types.ts                    # camelCase + '.types'
- index.ts                        # 타입 re-export용

Zustand 스토어:
- authStore.ts                    # camelCase + 'Store'
- userStore.ts                    # camelCase + 'Store'

상수:
- constants.ts                    # camelCase
- config.ts                       # camelCase

스타일:
- globals.css                     # kebab-case (Tailwind 설정용만)

❌ 잘못된 파일명:
- button.tsx                      # 컴포넌트는 PascalCase
- UseAuth.ts                      # 훅은 camelCase
- user-profile.tsx                # kebab-case 금지
- LoginForm.component.tsx         # .component 불필요
- Button.module.css               # CSS Modules 사용 안 함!
- Button.styles.ts                # Styled Components 사용 안 함!
```

#### Backend (Express/Node.js)
```
✅ 올바른 파일명:

라우트:
- auth.routes.ts                  # camelCase + '.routes'
- user.routes.ts                  # camelCase + '.routes'
- problem.routes.ts               # camelCase + '.routes'

컨트롤러:
- auth.controller.ts              # camelCase + '.controller'
- user.controller.ts              # camelCase + '.controller'

서비스:
- auth.service.ts                 # camelCase + '.service'
- email.service.ts                # camelCase + '.service'
- openai.service.ts               # camelCase + '.service'

미들웨어:
- auth.middleware.ts              # camelCase + '.middleware'
- errorHandler.middleware.ts      # camelCase + '.middleware'

유틸리티:
- jwt.util.ts                     # camelCase + '.util'
- validation.util.ts              # camelCase + '.util'

타입 정의:
- express.types.ts                # camelCase + '.types'
- user.types.ts                   # camelCase + '.types'

설정:
- database.config.ts              # camelCase + '.config'
- redis.config.ts                 # camelCase + '.config'

Prisma:
- schema.prisma                   # 고정
- seed.ts                         # camelCase

❌ 잘못된 파일명:
- AuthController.ts               # PascalCase 금지
- auth_routes.ts                  # snake_case 금지
- auth-middleware.ts              # kebab-case 금지
```

#### Shared
```
✅ 올바른 파일명:

타입:
- user.types.ts                   # camelCase + '.types'
- problem.types.ts                # camelCase + '.types'

스키마 (Zod):
- auth.schema.ts                  # camelCase + '.schema'
- user.schema.ts                  # camelCase + '.schema'

상수:
- grades.constants.ts             # camelCase + '.constants'
- errorCodes.constants.ts         # camelCase + '.constants'
```

---

### 2. **변수명 규칙 (Variable Naming)**

```typescript
// ✅ 변수: camelCase
const userName = "김철수"
const isLoggedIn = true
const totalScore = 95
const userList = []

// ✅ 상수: UPPER_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 5
const API_BASE_URL = "https://api.example.com"
const DEFAULT_PAGE_SIZE = 20
const TOKEN_EXPIRY_DAYS = 7

// ✅ Boolean: is/has/can/should 접두사
const isActive = true
const hasPermission = false
const canEdit = true
const shouldUpdate = false

// ✅ 배열: 복수형 또는 List 접미사
const users = []
const problems = []
const userList = []
const problemItems = []

// ✅ 객체: 단수형
const user = { id: 1, name: "김철수" }
const problem = { id: 1, title: "문제1" }

// ✅ Private 변수: _ 접두사 (클래스 내부)
class UserService {
  private _cache = new Map()
  private _retryCount = 0
}

// ❌ 잘못된 변수명
const UserName = "김철수"          // PascalCase 금지
const user_name = "김철수"         // snake_case 금지
const active = true                // Boolean은 is/has 접두사
const user = []                    // 배열은 복수형
const users = {}                   // 객체는 단수형
const x = "김철수"                 // 의미 없는 이름
const temp = 123                   // 임시 변수명 지양
const data = {}                    // 너무 일반적
```

---

### 3. **함수명 규칙 (Function Naming)**

```typescript
// ✅ 함수: camelCase + 동사로 시작
function getUserById(id: string) { }
function createUser(data: UserData) { }
function updateProfile(id: string, data: Partial<User>) { }
function deleteUser(id: string) { }
function validateEmail(email: string) { }
function calculateScore(answers: Answer[]) { }

// ✅ Boolean 반환 함수: is/has/can/should
function isValidEmail(email: string): boolean { }
function hasPermission(user: User, resource: string): boolean { }
function canEdit(user: User): boolean { }
function shouldRefresh(lastUpdate: Date): boolean { }

// ✅ 이벤트 핸들러: handle/on 접두사
function handleClick() { }
function handleSubmit(e: FormEvent) { }
function onUserLogin(user: User) { }
function onDataChange(data: Data) { }

// ✅ 비동기 함수: fetch/load/send 등 명확한 동사
async function fetchUsers() { }
async function loadUserData(id: string) { }
async function sendEmail(to: string, content: string) { }

// ✅ 변환 함수: to/from 접두사
function toJSON(data: object) { }
function fromJSON(json: string) { }
function toUpperCase(str: string) { }
function formatDate(date: Date) { }

// ✅ 유틸리티 함수: 명확한 동사 + 명사
function sortByDate(items: Item[]) { }
function filterActive(users: User[]) { }
function mapToIds(users: User[]) { }
function groupByGrade(students: Student[]) { }

// ❌ 잘못된 함수명
function GetUser() { }              // PascalCase 금지
function get_user() { }             // snake_case 금지
function user(id: string) { }       // 동사 없음
function do() { }                   // 의미 없는 이름
function process() { }              // 너무 일반적
function tmp() { }                  // 축약 금지
function clickHandler() { }         // 'handle' 접두사 사용
```

---

### 4. **클래스 및 타입 명명 규칙**

```typescript
// ✅ 클래스: PascalCase + 명사
class UserService { }
class EmailValidator { }
class DatabaseConnection { }
class AuthMiddleware { }

// ✅ 인터페이스: PascalCase + 명사 (I 접두사 사용 안 함)
interface User {
  id: string
  email: string
}

interface ApiResponse {
  success: boolean
  data: any
}

interface RequestHandler {
  handle(req: Request): Promise<Response>
}

// ✅ Type Alias: PascalCase
type UserId = string
type Nullable<T> = T | null
type ApiError = {
  code: number
  message: string
}

// ✅ Enum: PascalCase (키는 UPPER_SNAKE_CASE)
enum UserRole {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT"
}

enum ProblemType {
  READING_COMPREHENSION = "READING_COMPREHENSION",
  GRAMMAR = "GRAMMAR",
  VOCABULARY = "VOCABULARY"
}

// ❌ 잘못된 클래스/인터페이스명
class userService { }               // camelCase 금지
class User_Service { }              // snake_case 금지
interface IUser { }                 // I 접두사 금지 (TypeScript 스타일)
interface userInterface { }         // camelCase 금지
enum userRole { }                   // camelCase 금지
```

---

### 5. **React 컴포넌트 명명 규칙**

```typescript
// ✅ 컴포넌트: PascalCase + 명사
export default function LoginPage() { }
export function Button() { }
export function UserProfile() { }
export function NavigationBar() { }

// ✅ Props 인터페이스: 컴포넌트명 + Props
interface ButtonProps {
  onClick: () => void
  children: ReactNode
}

interface UserProfileProps {
  userId: string
  showEmail?: boolean
}

// ✅ 컴포넌트 파일명 = 컴포넌트명
// Button.tsx
export function Button({ children }: ButtonProps) { }

// UserProfile.tsx
export default function UserProfile({ userId }: UserProfileProps) { }

// ✅ 이벤트 핸들러: handle + 이벤트명
function LoginForm() {
  const handleSubmit = (e: FormEvent) => { }
  const handleInputChange = (e: ChangeEvent) => { }
  const handleEmailBlur = () => { }

  return <form onSubmit={handleSubmit}>...</form>
}

// ❌ 잘못된 컴포넌트명
function loginPage() { }            // camelCase 금지
function login_page() { }           // snake_case 금지
function LoginPageComponent() { }   // Component 접미사 불필요
```

---

### 6. **디렉토리 명명 규칙**

```
✅ 올바른 디렉토리명:

frontend/src/
├── app/                    # Next.js app router (고정)
├── components/             # 컴포넌트 (복수형)
├── hooks/                  # 훅 (복수형)
├── stores/                 # 스토어 (복수형)
├── lib/                    # 라이브러리 (단수형)
├── types/                  # 타입 (복수형)
├── utils/                  # 유틸 (복수형)
└── constants/              # 상수 (복수형)

backend/src/
├── routes/                 # 라우트 (복수형)
├── controllers/            # 컨트롤러 (복수형)
├── services/               # 서비스 (복수형)
├── middleware/             # 미들웨어 (단수형)
├── models/                 # 모델 (복수형)
├── utils/                  # 유틸 (복수형)
├── config/                 # 설정 (단수형)
└── types/                  # 타입 (복수형)

❌ 잘못된 디렉토리명:
- Components/               # 소문자 시작
- custom-hooks/             # kebab-case 금지
- user_services/            # snake_case 금지
```

---

### 7. **코드 스타일 일관성**

#### 들여쓰기 및 공백
```typescript
// ✅ 2칸 들여쓰기 (스페이스)
function example() {
  if (condition) {
    doSomething()
  }
}

// ✅ 연산자 앞뒤 공백
const sum = a + b
const isValid = x > 0 && y < 100

// ✅ 콤마 뒤 공백
const arr = [1, 2, 3]
const obj = { a: 1, b: 2 }

// ✅ 함수 괄호 앞뒤 공백 (화살표 함수)
const fn = () => {}
const fn2 = (a, b) => {}

// ❌ 잘못된 공백 사용
const sum=a+b                   // 공백 없음
const arr=[1,2,3]               // 공백 없음
const fn=()=>{}                 // 공백 없음
```

#### 중괄호 스타일
```typescript
// ✅ K&R 스타일 (same line)
if (condition) {
  doSomething()
}

function example() {
  return true
}

// ❌ Allman 스타일 금지
if (condition)
{
  doSomething()
}
```

#### 문자열
```typescript
// ✅ 단일 따옴표 사용 (일반 문자열)
const name = 'John'
const message = 'Hello, World!'

// ✅ 템플릿 리터럴 (변수 포함 시)
const greeting = `Hello, ${name}!`
const url = `${API_URL}/users/${id}`

// ✅ 이중 따옴표 (JSX 속성)
<div className="container">...</div>

// ❌ 잘못된 사용
const name = "John"             // 단일 따옴표 사용
const greeting = 'Hello, ' + name + '!'  // 템플릿 리터럴 사용
```

#### 세미콜론
```typescript
// ✅ 세미콜론 사용 안 함 (Next.js/React 권장)
const x = 10
const y = 20

function example() {
  return true
}

// ❌ 혼용 금지
const x = 10
const y = 20;  // 비일관적
```

#### Import 순서
```typescript
// ✅ Import 그룹 순서
// 1. React 관련
import { useState, useEffect } from 'react'

// 2. Next.js 관련
import Link from 'next/link'
import Image from 'next/image'

// 3. 외부 라이브러리
import { z } from 'zod'
import axios from 'axios'

// 4. 내부 컴포넌트
import { Button } from '@/components/Button'
import { Header } from '@/components/Header'

// 5. 유틸/훅/타입
import { formatDate } from '@/lib/formatDate'
import { useAuth } from '@/hooks/useAuth'
import type { User } from '@/types/user.types'

// 6. 스타일 (globals.css만 - Tailwind 설정용)
import './globals.css'

// ❌ 잘못된 순서 (뒤죽박죽)
import './globals.css'
import { Button } from '@/components/Button'
import { useState } from 'react'
```

#### 타입 정의 위치
```typescript
// ✅ 파일 상단에 타입 정의
interface User {
  id: string
  name: string
}

type UserId = string

// 그 다음 상수
const DEFAULT_PAGE_SIZE = 20

// 그 다음 함수
function getUser(id: UserId): User {
  // ...
}

// ❌ 타입이 중간에 섞여있음
function getUser(id: string) { }

interface User {  // 타입은 상단에
  id: string
}

function updateUser(user: User) { }
```

---

### 8. **Tailwind CSS 스타일 일관성**

#### 허용되는 스타일링 도구

**✅ 사용 가능:**
1. **Tailwind CSS** (주 스타일링)
2. **clsx** 또는 **tailwind-merge (cn 유틸)** (조건부 클래스)
3. **globals.css** (Tailwind 설정, @layer 커스텀 클래스)

**❌ 사용 금지:**
- CSS Modules (`.module.css`)
- Styled Components
- Emotion
- 인라인 스타일 (특수한 경우 제외)
- 별도 CSS 파일 (globals.css 외)

```tsx
// ✅ Tailwind 유틸리티 클래스 사용
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h1 className="text-2xl font-bold text-gray-900">제목</h1>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    클릭
  </button>
</div>

// ✅ clsx 사용 (조건부 클래스)
import clsx from 'clsx'

<button className={clsx(
  'px-4 py-2 rounded',
  isActive ? 'bg-blue-500' : 'bg-gray-300',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>
  버튼
</button>

// ✅ tailwind-merge와 clsx 조합 (cn 유틸)
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 사용
import { cn } from '@/lib/utils'

<button className={cn(
  'px-4 py-2 rounded',
  isActive && 'bg-blue-500',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>
  버튼
</button>

// ✅ 커스텀 클래스는 globals.css의 @layer에만 정의
// src/app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors;
  }

  .card {
    @apply p-6 bg-white rounded-lg shadow-md border border-gray-200;
  }

  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

// ✅ 인라인 스타일 (특수한 경우만)
// 동적으로 계산된 값이 필요한 경우에만 허용
<div
  style={{
    width: `${progress}%`,
    transform: `translateX(${offset}px)`
  }}
  className="h-2 bg-blue-500 transition-all"
>

// ❌ 절대 금지!
// 1. 정적 값의 인라인 스타일
<div style={{ display: 'flex', padding: '16px' }}>  // 금지! Tailwind 사용

// 2. CSS Modules
import styles from './Button.module.css'  // 금지!
<div className={styles.button}>

// 3. Styled Components
import styled from 'styled-components'  // 금지!
const StyledButton = styled.button`
  padding: 1rem;
  background: blue;
`

// 4. Emotion
import { css } from '@emotion/react'  // 금지!
const buttonStyle = css`
  padding: 1rem;
`

// 5. 별도 CSS 파일 (globals.css 제외)
import './Button.css'  // 금지!
import './custom.css'  // 금지!
```

#### cn 유틸리티 설정 (권장)

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind 클래스를 병합하고 충돌을 해결합니다.
 * clsx로 조건부 클래스를 처리하고, twMerge로 충돌 해결
 *
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4' (px-4가 우선)
 * cn('text-red-500', isActive && 'text-blue-500') // => 조건부 적용
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**패키지 설치:**
```json
{
  "dependencies": {
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

#### Tailwind 클래스 순서
```tsx
// ✅ 권장 순서 (가독성)
<div className="
  // 1. Layout (display, position)
  flex flex-col items-center justify-between

  // 2. Box model (width, height, padding, margin)
  w-full h-screen p-4 m-2

  // 3. Typography
  text-lg font-bold text-gray-900

  // 4. Visual (background, border, shadow)
  bg-white border border-gray-200 rounded-lg shadow-md

  // 5. Misc (cursor, transition, etc)
  cursor-pointer transition-all hover:bg-gray-50
">
  내용
</div>

// ❌ 순서 없이 뒤죽박죽
<div className="text-lg bg-white flex p-4 rounded-lg w-full hover:bg-gray-50 font-bold">
```

---

### 9. **주석 스타일 일관성**

```typescript
// ✅ 한 줄 주석: // 뒤에 공백
// 이것은 주석입니다
const value = 10

// ✅ 여러 줄 주석
/*
 * 사용자 인증을 처리하는 함수
 * @param email - 사용자 이메일
 * @param password - 비밀번호
 */

// ✅ JSDoc 형식 (복잡한 함수/클래스)
/**
 * 사용자를 ID로 조회합니다.
 *
 * @param id - 사용자 ID
 * @returns 사용자 객체 또는 null
 * @throws {NotFoundError} 사용자를 찾을 수 없을 때
 */
async function getUserById(id: string): Promise<User | null> {
  // 구현
}

// ✅ TODO 주석
// TODO: 캐싱 로직 추가하여 성능 개선
// FIXME: 타임존 처리 버그 수정 필요
// HACK: 임시 해결책, 추후 리팩토링 필요
// NOTE: Prisma 5.10+ 버전에서는 다른 방식 사용

// ❌ 잘못된 주석
//주석 앞에 공백 없음
/* 한 줄인데 여러 줄 주석 사용 */

// ❌ 불필요한 주석
// 사용자 이름을 가져옴
const name = user.name  // 코드만 봐도 명확함
```

---

### 10. **코드 구조 일관성**

#### React 컴포넌트 구조 순서
```typescript
// ✅ 컴포넌트 파일 구조
// 1. Imports
import { useState, useEffect } from 'react'
import type { User } from '@/types/user.types'

// 2. Types/Interfaces
interface MyComponentProps {
  user: User
  onUpdate: (user: User) => void
}

// 3. Constants (컴포넌트 외부)
const MAX_ITEMS = 10

// 4. Helper functions (컴포넌트 외부)
function formatUserName(user: User) {
  return `${user.firstName} ${user.lastName}`
}

// 5. Main Component
export default function MyComponent({ user, onUpdate }: MyComponentProps) {
  // 5-1. Hooks
  const [state, setState] = useState()
  const { data } = useQuery()

  useEffect(() => {
    // effect logic
  }, [])

  // 5-2. Event handlers
  const handleClick = () => {}
  const handleSubmit = () => {}

  // 5-3. Computed values
  const computedValue = useMemo(() => {}, [])

  // 5-4. Early return
  if (!data) return <Loading />

  // 5-5. Render
  return (
    <div className="container">
      {/* JSX */}
    </div>
  )
}

// 6. Sub components (필요시)
function SubComponent() {
  return <div>Sub</div>
}
```

#### Backend 파일 구조 순서
```typescript
// ✅ 백엔드 파일 구조
// 1. Imports
import { Request, Response } from 'express'
import { z } from 'zod'
import type { User } from '@/types/user.types'

// 2. Types/Interfaces
interface UserServiceOptions {
  includeDeleted?: boolean
}

// 3. Schemas (Zod)
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

// 4. Constants
const MAX_LOGIN_ATTEMPTS = 5

// 5. Main class/function
export class UserService {
  // 5-1. Properties
  private db: Database

  // 5-2. Constructor
  constructor(db: Database) {
    this.db = db
  }

  // 5-3. Public methods
  async getUser(id: string): Promise<User> {
    // ...
  }

  // 5-4. Private methods
  private async validateUser(user: User): Promise<boolean> {
    // ...
  }
}

// 6. Helper functions (외부)
function hashPassword(password: string): string {
  // ...
}
```

---

### 11. **일관성 체크리스트**

#### 코드 작성 전:
- [ ] 파일명이 규칙에 맞는가?
- [ ] 변수명이 camelCase인가?
- [ ] 함수명이 동사로 시작하는가?
- [ ] 컴포넌트명이 PascalCase인가?
- [ ] Boolean은 is/has/can 접두사가 있는가?

#### 스타일링 작성 시:
- [ ] Tailwind CSS만 사용하는가?
- [ ] 인라인 스타일을 사용하지 않았는가?
- [ ] CSS Modules/Styled Components를 사용하지 않았는가?
- [ ] 클래스명 순서가 일관되는가?

#### 코드 작성 후:
- [ ] Import 순서가 올바른가?
- [ ] 들여쓰기가 2칸인가?
- [ ] 공백이 일관되게 사용되었는가?
- [ ] 세미콜론을 사용하지 않았는가?
- [ ] 주석이 필요한 곳에만 있는가?
- [ ] 타입 정의가 파일 상단에 있는가?

#### 커밋 전:
- [ ] ESLint 경고가 없는가?
- [ ] TypeScript 에러가 없는가?
- [ ] 파일명과 내용이 일치하는가?
- [ ] console.log를 제거했는가?
- [ ] 불필요한 import를 제거했는가?

---

## 📁 파일 및 코드 작성 규칙

### 1. **파일 생성 규칙**

**기존 파일 우선**:
- ✅ 기존 파일이 있으면 **반드시 수정**
- ❌ 동일한 목적의 새 파일 생성 금지

**새 파일 생성 조건**:
- 사용자가 명시적으로 요청
- 새로운 기능/컴포넌트 추가 시
- 기존 파일이 없는 경우

**금지 사항**:
- ❌ 문서 파일 (README.md, docs/*.md) 자동 생성 금지
- ❌ 사용자 요청 없이 설정 파일 생성 금지

### 2. **코드 스타일 규칙**

#### TypeScript 규칙
```typescript
// ✅ 명시적 타입 정의
interface User {
  id: string;
  email: string;
  username: string;
}

// ✅ 타입 안전성
const getUser = (id: string): Promise<User | null> => { ... }

// ❌ any 타입 사용 금지
const data: any = ...  // 금지!

// ✅ unknown 또는 제네릭 사용
const data: unknown = ...
const getData = <T>(id: string): Promise<T> => { ... }
```

#### React 컴포넌트 규칙
```tsx
// ✅ 함수형 컴포넌트 사용
export default function MyComponent({ prop }: Props) {
  return <div>{prop}</div>
}

// ❌ 클래스 컴포넌트 금지
class MyComponent extends React.Component { ... }  // 금지!

// ✅ Props 타입 정의
interface Props {
  title: string;
  onClick?: () => void;
}

// ✅ 디폴트 export (페이지)
export default function HomePage() { ... }

// ✅ Named export (컴포넌트, 유틸)
export function Button({ children }: ButtonProps) { ... }
```

#### 네이밍 규칙
```typescript
// 파일명
- 컴포넌트: PascalCase (Button.tsx, UserProfile.tsx)
- 유틸/훅: camelCase (useAuth.ts, formatDate.ts)
- 페이지: kebab-case 또는 [...slug] (Next.js 규칙)

// 변수명
const userName = "John"           // camelCase
const MAX_RETRIES = 3             // UPPER_SNAKE_CASE (상수)

// 함수명
function getUserById() { ... }    // camelCase
const handleClick = () => { ... } // camelCase

// 컴포넌트명
function UserProfile() { ... }    // PascalCase

// 타입/인터페이스명
interface UserData { ... }        // PascalCase
type ApiResponse = { ... }        // PascalCase
```

### 3. **디렉토리 구조 준수**

**변경 금지**:
```
nagukpo/
├── frontend/src/
│   ├── app/              # Next.js App Router 페이지
│   ├── components/       # 재사용 가능한 컴포넌트
│   ├── hooks/            # 커스텀 React 훅
│   ├── stores/           # Zustand 스토어
│   ├── lib/              # 유틸리티 함수
│   └── types/            # TypeScript 타입 정의
│
├── backend/src/
│   ├── routes/           # Express 라우트
│   ├── controllers/      # 비즈니스 로직
│   ├── services/         # 서비스 계층
│   ├── middleware/       # 미들웨어
│   ├── models/           # Prisma 모델 (스키마는 prisma/)
│   └── utils/            # 유틸리티 함수
│
└── shared/src/
    ├── types/            # 공유 타입
    ├── schemas/          # Zod 스키마
    └── constants/        # 공유 상수
```

**규칙**:
- ✅ 파일은 목적에 맞는 디렉토리에 배치
- ❌ 루트에 임의의 파일 생성 금지
- ✅ 새 디렉토리 추가 시 사용자에게 확인

---

## 🔒 보안 규칙

### 1. **환경 변수 관리**

```bash
# ❌ 절대 커밋 금지
.env
.env.local
.env.production

# ✅ 예제 파일만 커밋
.env.example
```

### 2. **민감 정보 처리**

```typescript
// ❌ 코드에 하드코딩 금지
const apiKey = "sk-1234567890abcdef..."  // 금지!

// ✅ 환경 변수 사용
const apiKey = process.env.OPENAI_API_KEY

// ✅ 환경 변수 검증
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required')
}
```

### 3. **보안 체크리스트**

- ✅ 모든 API 엔드포인트에 인증 미들웨어 적용
- ✅ Zod로 입력 검증
- ✅ CORS 설정 확인
- ✅ SQL Injection 방지 (Prisma 자동 방지)
- ✅ XSS 방지 (React 자동 이스케이프)
- ✅ 비밀번호는 bcrypt로 해싱
- ❌ `eval()`, `new Function()` 사용 금지

---

## 🎨 UI/UX 규칙

### 1. **Tailwind CSS 사용**

```tsx
// ✅ Tailwind 유틸리티 클래스 사용
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  ...
</div>

// ❌ 인라인 스타일 사용 금지
<div style={{ display: 'flex', padding: '16px' }}>  // 금지!
  ...
</div>

// ✅ 커스텀 클래스는 globals.css에 정의
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
  }
}
```

### 2. **반응형 디자인**

```tsx
// ✅ 모바일 퍼스트 접근
<div className="text-sm md:text-base lg:text-lg">
  {/* 기본: small, md 이상: base, lg 이상: large */}
</div>

// ✅ 반응형 레이아웃
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 모바일: 1열, 태블릿: 2열, 데스크탑: 3열 */}
</div>
```

### 3. **접근성 (a11y)**

```tsx
// ✅ 시맨틱 HTML 사용
<button onClick={handleClick}>클릭</button>
<nav>...</nav>
<main>...</main>

// ❌ div 남용 금지
<div onClick={handleClick}>클릭</div>  // 금지!

// ✅ alt 속성 필수
<img src="logo.png" alt="나국포 로고" />

// ✅ ARIA 레이블
<button aria-label="메뉴 열기">☰</button>
```

---

## ⚡ 성능 최적화 규칙

### 1. **Next.js 최적화**

```tsx
// ✅ 이미지 최적화
import Image from 'next/image'
<Image src="/hero.jpg" alt="Hero" width={800} height={600} />

// ❌ 일반 img 태그 금지
<img src="/hero.jpg" />  // 금지!

// ✅ 동적 import (코드 분할)
const HeavyComponent = dynamic(() => import('./HeavyComponent'))

// ✅ 서버 컴포넌트 우선 사용 (app router)
// 클라이언트 상태 필요시에만 'use client' 사용
```

### 2. **데이터 페칭**

```typescript
// ✅ 서버 컴포넌트에서 직접 fetch
async function Page() {
  const data = await fetch('...')
  return <div>{data}</div>
}

// ✅ React Query/SWR로 캐싱
const { data } = useSWR('/api/users', fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 60000  // 1분 캐싱
})
```

### 3. **번들 크기 최적화**

```typescript
// ✅ Named import (tree shaking)
import { useState, useEffect } from 'react'

// ❌ Default import (tree shaking 불가)
import * as React from 'react'  // 지양

// ✅ Lodash modular import
import debounce from 'lodash/debounce'

// ❌ Lodash 전체 import
import _ from 'lodash'  // 금지!
```

---

## 🧪 테스트 규칙

### 1. **테스트 작성 (추후 추가 시)**

```typescript
// ✅ 유닛 테스트
describe('formatDate', () => {
  it('should format date correctly', () => {
    expect(formatDate('2024-01-01')).toBe('2024년 1월 1일')
  })
})

// ✅ 통합 테스트
describe('POST /api/auth/login', () => {
  it('should return JWT token on valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password' })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
  })
})
```

---

## 🗄️ 데이터베이스 규칙

### 1. **Prisma 스키마**

```prisma
// ✅ 명확한 관계 정의
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())

  progress  Progress[]  // 1:N 관계

  @@index([email])  // 인덱스 추가
}

// ✅ 적절한 필드 타입 사용
grade     String     // 초등/중등/고등
isCorrect Boolean    // true/false
timeSpent Int        // 초 단위
content   String     @db.Text  // 긴 텍스트
data      Json       // JSON 데이터
```

### 2. **마이그레이션**

```bash
# ✅ 마이그레이션 생성
npm run prisma:migrate

# ✅ 의미 있는 마이그레이션 이름
prisma migrate dev --name add_user_table

# ❌ 프로덕션에서 reset 금지
prisma migrate reset  # 개발 환경에서만!
```

---

## 📝 주석 및 문서화 규칙

### 1. **주석 작성**

```typescript
// ✅ 복잡한 로직에만 주석
// 사용자의 약점을 분석하여 추천 문제 생성
// 1. 최근 7일간 오답률 집계
// 2. 상위 3개 유형 추출
// 3. 난이도 조정하여 문제 선택
const recommendProblems = (userId: string) => { ... }

// ❌ 자명한 코드에 주석 금지
// 사용자 이름을 가져옴
const name = user.name  // 불필요한 주석!

// ✅ JSDoc (함수 설명)
/**
 * 사용자 인증을 검증하고 JWT 토큰을 반환합니다.
 * @param email - 사용자 이메일
 * @param password - 비밀번호 (평문)
 * @returns JWT 토큰 또는 null
 * @throws {UnauthorizedError} 인증 실패 시
 */
async function login(email: string, password: string): Promise<string | null>
```

### 2. **TODO 주석**

```typescript
// ✅ TODO 형식
// TODO: 캐싱 로직 추가하여 성능 개선
// FIXME: 타임존 처리 버그 수정 필요
// HACK: 임시 해결책, 추후 리팩토링 필요
// NOTE: Prisma 5.10+ 버전에서는 다른 방식 사용
```

---

## 🚀 배포 및 빌드 규칙

### 1. **빌드 전 체크리스트**

```bash
# ✅ 타입 체크
npm run build  # TypeScript 에러 확인

# ✅ Lint 검사
npm run lint

# ✅ 환경 변수 확인
# .env.example의 모든 변수가 .env에 있는지 확인
```

### 2. **환경별 설정**

```typescript
// ✅ 환경별 분기
const isProduction = process.env.NODE_ENV === 'production'

const config = {
  apiUrl: isProduction
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:3001'
}

// ❌ 하드코딩 금지
const apiUrl = 'http://localhost:3001'  // 금지!
```

---

## 🤖 AI 특화 규칙 (LangChain, OpenAI)

### 1. **프롬프트 관리**

```typescript
// ✅ 프롬프트는 별도 파일로 관리
// backend/src/prompts/chatbot.ts
export const SYSTEM_PROMPT = `
당신은 국어 학습을 돕는 AI 선생님입니다.
학생의 수준에 맞춰 쉽게 설명해주세요.
...
`

// ✅ 템플릿 사용
const prompt = PromptTemplate.fromTemplate(`
사용자: {question}
관련 자료: {context}
답변:
`)
```

### 2. **에러 처리**

```typescript
// ✅ OpenAI API 에러 처리
try {
  const response = await openai.chat.completions.create(...)
} catch (error) {
  if (error instanceof OpenAI.APIError) {
    console.error('OpenAI API Error:', error.status, error.message)
    // Rate limit 처리
    if (error.status === 429) {
      await sleep(1000)
      // 재시도 로직
    }
  }
  throw error
}
```

### 3. **비용 최적화**

```typescript
// ✅ 토큰 수 제한
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  max_tokens: 500,  // 토큰 제한
  temperature: 0.7
})

// ✅ 캐싱 활용 (같은 질문 반복 방지)
const cachedAnswer = await redis.get(`answer:${questionHash}`)
if (cachedAnswer) return cachedAnswer
```

---

## ❓ FAQ 및 일반 지침

### Q: 새로운 라이브러리가 필요한데?
**A**: 사용자에게 제안하고 승인 받은 후 추가. 다음을 포함:
- 라이브러리 이름 및 용도
- 번들 크기 영향
- 대안 라이브러리와 비교
- 호환성 확인

### Q: 코드 리팩토링이 필요한데?
**A**:
1. 현재 코드의 문제점 설명
2. 리팩토링 방향 제시
3. 사용자 승인 후 진행
4. 기능 변경 없이 구조만 개선

### Q: 버그를 발견했는데?
**A**:
1. 버그 재현 방법 확인
2. 원인 분석 및 설명
3. 수정 방안 제시
4. 사용자 승인 후 수정

### Q: 사용자가 잘못된 접근을 요청하면?
**A**:
1. 문제점 정중히 설명
2. 올바른 대안 제시
3. 사용자가 고집하면 경고 후 진행

---

## ✅ 체크리스트

개발 시작 전:
- [ ] 이 문서를 완독했는가?
- [ ] 고정 버전 목록을 확인했는가?
- [ ] 프로젝트 구조를 이해했는가?

코드 작성 전:
- [ ] 기존 파일 확인했는가?
- [ ] 타입 정의를 작성했는가?
- [ ] 보안 규칙을 준수하는가?

커밋 전:
- [ ] Claude 서명을 제거했는가?
- [ ] 커밋 메시지 규칙을 따랐는가?
- [ ] 민감 정보가 없는가?

---

**마지막 업데이트**: 2025-10-16
**버전**: 1.0.0

이 문서는 프로젝트의 안정성과 일관성을 유지하기 위한 **필수 지침**입니다.
모든 규칙을 반드시 준수하며, 불확실한 경우 사용자에게 확인하세요.
