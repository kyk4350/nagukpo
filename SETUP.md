# 나국포 프로젝트 설치 및 실행 가이드

> **초기 개발 완료! 전체 진행률 100%**

---

## 📋 사전 요구사항

### 필수
- **Node.js**: 18.18.0 이상 ([다운로드](https://nodejs.org/))
- **PostgreSQL**: 16.x ([다운로드](https://www.postgresql.org/download/))

### 선택사항
- **Redis**: 7.x (현재 미사용, 향후 캐싱용)

---

## 🚀 빠른 시작 (Quick Start)

### 1. 저장소 클론

```bash
git clone https://github.com/kyk4350/nagukpo.git
cd nagukpo
```

### 2. 의존성 설치

```bash
# 루트에서 모든 워크스페이스 패키지 설치
npm install
```

### 3. 데이터베이스 설정

#### PostgreSQL 데이터베이스 생성

```bash
# 방법 1: createdb 명령어 사용
createdb nagukpo

# 방법 2: psql에서 직접 생성
psql -U postgres
CREATE DATABASE nagukpo;
\q
```

#### Prisma 마이그레이션 실행

```bash
cd backend
npm run prisma:migrate
```

마이그레이션 이름을 입력하라는 프롬프트가 나타나면 `init` 또는 원하는 이름을 입력합니다.

#### 시드 데이터 생성

```bash
npm run prisma:seed
```

테스트 계정 2개가 자동으로 생성됩니다.

### 4. 서버 실행

#### Backend 서버 시작 (Terminal 1)

```bash
cd backend
npm run dev
```

**실행 확인**:
- http://localhost:3001/health - 헬스 체크
- http://localhost:3001/api/v1 - API 정보

#### Frontend 서버 시작 (Terminal 2)

```bash
cd frontend
npm run dev
```

**프론트엔드 접속**:
- http://localhost:3000

---

## 🧪 테스트 계정

시드 데이터로 자동 생성된 계정으로 로그인할 수 있습니다.

### User 1 (학생 계정)
- **이메일**: test@example.com
- **비밀번호**: Test1234!
- **레벨**: 3
- **포인트**: 1,500
- **연속 학습**: 5일

### User 2 (개발자 계정)
- **이메일**: dev@example.com
- **비밀번호**: Dev1234!
- **레벨**: 10
- **포인트**: 15,000
- **연속 학습**: 30일

---

## 🛠️ 환경 변수 설정

### Backend (.env)

기본 개발 환경 설정이 이미 되어 있습니다. 필요시 수정하세요.

```bash
# backend/.env

# Server
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nagukpo?schema=public"

# JWT
JWT_SECRET=nagukpo-dev-secret-key-please-change-in-production-32chars
JWT_REFRESH_SECRET=nagukpo-dev-refresh-secret-key-change-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000
```

**주의**: 프로덕션 환경에서는 반드시 JWT 비밀키를 변경하세요!

### Frontend (.env.local)

이미 설정되어 있습니다.

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 📦 NPM Scripts

### Backend

```bash
npm run dev              # 개발 서버 시작 (tsx watch)
npm run build            # TypeScript 빌드
npm run start            # 프로덕션 서버 시작
npm run prisma:generate  # Prisma Client 생성
npm run prisma:migrate   # 마이그레이션 실행
npm run prisma:studio    # Prisma Studio 실행 (DB GUI)
npm run prisma:seed      # 시드 데이터 생성
```

### Frontend

```bash
npm run dev              # 개발 서버 시작
npm run build            # 프로덕션 빌드
npm run start            # 프로덕션 서버 시작
npm run lint             # ESLint 실행
```

---

## 🗄️ 데이터베이스 관리

### Prisma Studio 실행

데이터베이스를 GUI로 확인하고 편집할 수 있습니다.

```bash
cd backend
npm run prisma:studio
```

브라우저에서 http://localhost:5555 로 접속합니다.

### 새로운 마이그레이션 생성

스키마를 수정한 후:

```bash
npm run prisma:migrate
```

### Prisma Client 재생성

스키마 변경 후 클라이언트를 다시 생성해야 합니다.

```bash
npm run prisma:generate
```

---

## 🐛 문제 해결

### 1. 데이터베이스 연결 실패

**에러**: `Can't reach database server`

**해결 방법**:
- PostgreSQL이 실행 중인지 확인
- DATABASE_URL이 올바른지 확인
- 방화벽 설정 확인

```bash
# PostgreSQL 상태 확인 (macOS)
brew services list

# PostgreSQL 시작 (macOS)
brew services start postgresql@16
```

### 2. Prisma Client 에러

**에러**: `@prisma/client did not initialize yet`

**해결 방법**:

```bash
cd backend
npm run prisma:generate
```

### 3. 포트 충돌

**에러**: `Port 3000 is already in use`

**해결 방법**:
- 다른 포트 사용: `.env`에서 PORT 변경
- 또는 실행 중인 프로세스 종료

```bash
# 포트 사용 중인 프로세스 찾기 (macOS/Linux)
lsof -i :3000

# 프로세스 종료
kill -9 <PID>
```

### 4. Node 버전 경고

**경고**: `EBADENGINE Unsupported engine`

**해결 방법**:
- Node.js 18.18.0 이상으로 업그레이드 권장
- 현재 버전(v18.12.1)도 대부분 동작하지만 일부 경고 발생

```bash
# Node 버전 확인
node -v

# nvm 사용 시 버전 변경
nvm install 20
nvm use 20
```

---

## 📂 프로젝트 구조

```
nagukpo/
├── backend/                # Express 백엔드
│   ├── src/
│   │   ├── index.ts       # 메인 서버
│   │   ├── routes/        # API 라우트
│   │   ├── controllers/   # 컨트롤러
│   │   ├── services/      # 비즈니스 로직
│   │   ├── middleware/    # 미들웨어
│   │   └── utils/         # 유틸리티
│   ├── prisma/
│   │   ├── schema.prisma  # DB 스키마
│   │   └── seed.ts        # 시드 데이터
│   └── .env               # 환경 변수
│
├── frontend/              # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/           # 페이지 (App Router)
│   │   ├── components/    # 재사용 컴포넌트
│   │   ├── lib/           # 유틸리티, API
│   │   ├── stores/        # Zustand 상태 관리
│   │   └── types/         # TypeScript 타입
│   └── .env.local         # 환경 변수
│
├── shared/                # 공유 코드 (타입, 상수)
├── SETUP.md               # 이 파일
└── PROGRESS.md            # 개발 진행 상황
```

---

## 🔍 API 엔드포인트

### 인증 (Auth)

| 메서드 | 경로 | 설명 | 인증 필요 |
|--------|------|------|-----------|
| POST | `/api/v1/auth/register` | 회원가입 | ❌ |
| POST | `/api/v1/auth/login` | 로그인 | ❌ |
| POST | `/api/v1/auth/logout` | 로그아웃 | ✅ |
| POST | `/api/v1/auth/refresh` | 토큰 갱신 | ❌ |
| GET | `/api/v1/auth/me` | 현재 사용자 조회 | ✅ |

### 시스템

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/health` | 헬스 체크 |
| GET | `/api/v1` | API 정보 |

---

## 💡 다음 단계

프로젝트가 성공적으로 실행되면:

1. **랜딩 페이지 확인**: http://localhost:3000
2. **회원가입 테스트**: 새 계정 생성
3. **로그인 테스트**: 시드 계정으로 로그인
4. **대시보드 확인**: 사용자 통계 및 프로필

---

## 📚 추가 문서

- **README.md**: 프로젝트 소개
- **DEVELOPMENT.md**: 기술 문서 및 아키텍처
- **PROGRESS.md**: 개발 진행 상황
- **CLAUDE.md**: AI 개발 지침서

---

## 🆘 도움이 필요하신가요?

이슈가 있으면 [GitHub Issues](https://github.com/kyk4350/nagukpo/issues)에 등록해주세요.

---

**Happy Coding! 🚀**
