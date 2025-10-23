# 나국포 개발 현황 및 TODO

> **최종 업데이트**: 2025-10-23
> **전체 진행률**: 약 90% 완료

---

## 📊 현재 개발 상황

### ✅ 완료된 주요 기능

#### 1. 인증 시스템 (100%)
- [x] 회원가입/로그인/로그아웃
- [x] JWT 토큰 관리 (Access + Refresh)
- [x] 비밀번호 해싱 (bcrypt)
- [x] 토큰 갱신 API
- [x] Rate Limiting

#### 2. 문제 풀이 시스템 (100%)
- [x] 4단계 레벨별 문제 (Level 1-4, 총 284개)
  - 독해(reading): 188문제
  - 어휘(vocabulary): 32문제 (GPT-4 생성)
  - 문법(grammar): 32문제 (GPT-4 생성)
  - 작문(writing): 32문제 (GPT-4 생성)
- [x] 문제 조회 API (필터링: level, type, difficulty)
- [x] 문제 제출 및 채점 API
- [x] 난이도별 포인트 지급
- [x] 정답률 계산
- [x] 중복 문제 152개 삭제 완료
- [x] 레이블 불일치 문제 10개 삭제 완료
- [x] Prisma enum 추가 (ProblemType, Difficulty)

#### 3. RAG 기반 챗봇 시스템 (100%) ⭐ 최근 구현
- [x] Pinecone 벡터 DB 연동
- [x] LangChain 통합
- [x] OpenAI GPT-4 API 연동
- [x] OpenAI Embeddings (text-embedding-3-small)
- [x] 문제 기반 컨텍스트 검색
- [x] 특정 문제 설명 기능
- [x] 대화 히스토리 저장/조회/삭제
- [x] 국어 학습 전용 프롬프트
- [x] 임베딩 생성 스크립트 (create-embeddings.ts)
- [x] RAG 테스트 스크립트 (test-rag.ts)

#### 4. 프리셋 학습 모드 (100%)
- [x] 레벨 선택 페이지 (/preset)
- [x] 레벨별 진행률 표시
- [x] 문제 풀이 인터페이스 (/preset/[level])
- [x] 지문, 질문, 선택지 표시
- [x] 정답/오답 시각화
- [x] 해설 표시
- [x] 틀린 문제 → 챗봇 연동 ("설명 듣기 💬" 버튼)
- [x] 다음 문제 버튼
- [x] React Query 기반 상태 관리

#### 5. 진도/통계 시스템 (100%)
- [x] 사용자별 진도 추적 API
- [x] 레벨별 통계 (시도한 문제/푼 문제/전체 문제)
- [x] 유형별 정답률
- [x] 난이도별 정답률
- [x] 최근 풀이 기록 (상위 10개)
- [x] 포인트 및 경험치 시스템

#### 6. 대시보드 (95%)
- [x] 레벨, 포인트, 연속 학습 일수 표시
- [x] 경험치 진행바
- [x] 빠른 시작 버튼 (프리셋 학습, AI 대화)
- [x] 프로필 정보 (이름, 이메일, 나이, 가입일)
- [x] 배지 영역 (UI만 존재)
- [x] 최근 활동 표시 (최근 5개 문제)
- [x] 통계 차트 (Recharts)
  - [x] 주간 학습 기록 BarChart
  - [x] 유형별 정답률 PieChart
  - [x] 한글 레이블 적용

#### 7. 페이지 구현
- [x] 랜딩 페이지
- [x] 로그인 페이지
- [x] 회원가입 페이지
- [x] 대시보드
- [x] 프리셋 학습 페이지
- [x] 챗봇 페이지

---

## 🚀 다음 작업 (우선순위 순)

### 1순위: 게임화 요소 강화 (예상 3시간) ⭐ 진행중

#### 배지 시스템 (2시간)
- [ ] Achievement 시드 데이터 작성
  - 첫 문제 해결
  - 3일 연속 학습
  - 5일 연속 학습
  - 레벨 1 완료
  - 레벨 2 완료
  - 정답률 80% 이상
- [ ] 배지 획득 로직 구현 (problem.service.ts)
- [ ] 배지 조회 API (`GET /api/v1/achievements`)
- [ ] 대시보드에 배지 표시

#### 포인트/레벨 시스템 강화 (1시간)
- [ ] 레벨업 알림 모달 컴포넌트
- [ ] 포인트 획득 애니메이션 (Framer Motion)
- [ ] 레벨업 조건 명시 (대시보드)

---

### 3순위: 버그 수정 및 UI 개선 (예상 2시간)

#### 전체 플로우 테스트
- [ ] 회원가입 → 로그인 → 문제 풀이 → 챗봇 플로우
- [ ] 토큰 갱신 테스트
- [ ] 에러 처리 확인

#### 반응형 디자인 점검
- [ ] 모바일 (375px)
- [ ] 태블릿 (768px)
- [ ] 데스크탑 (1024px+)

#### 로딩 상태 개선
- [ ] 스켈레톤 로더 추가 (문제 목록, 대시보드)
- [ ] 에러 상태 개선 (사용자 친화적 메시지)

---

## 📁 주요 파일 구조

### 백엔드 (완전 구현)
```
backend/src/
├── services/
│   ├── auth.service.ts          ✅ 인증
│   ├── chat.service.ts          ✅ 챗봇 (RAG 통합)
│   ├── problem.service.ts       ✅ 문제 관리
│   ├── progress.service.ts      ✅ 진도 추적
│   └── rag.service.ts           ✅ RAG 시스템
├── controllers/
│   ├── auth.controller.ts
│   ├── chat.controller.ts
│   ├── problem.controller.ts
│   └── progress.controller.ts
├── routes/
│   ├── auth.routes.ts
│   ├── chat.routes.ts
│   ├── problem.routes.ts
│   └── progress.routes.ts
├── scripts/
│   ├── create-embeddings.ts     ✅ 임베딩 생성
│   └── test-rag.ts              ✅ RAG 테스트
└── index.ts
```

### 프론트엔드 (완전 구현)
```
frontend/src/
├── app/
│   ├── page.tsx                  ✅ 랜딩 페이지
│   ├── login/page.tsx            ✅ 로그인
│   ├── register/page.tsx         ✅ 회원가입
│   ├── dashboard/page.tsx        ✅ 대시보드 (80%)
│   ├── preset/
│   │   ├── page.tsx              ✅ 레벨 선택
│   │   └── [level]/page.tsx      ✅ 문제 풀이
│   └── chat/page.tsx             ✅ 챗봇
├── components/                   ✅ UI 컴포넌트
├── hooks/queries/                ✅ React Query 훅
├── lib/api/                      ✅ API 클라이언트
├── stores/                       ✅ Zustand 스토어
└── types/                        ✅ TypeScript 타입
```

---

## 🔧 기술 스택

### 완전 구현된 스택
- ✅ **프론트엔드**: Next.js 14, React 18, TypeScript, Tailwind CSS
- ✅ **상태 관리**: TanStack Query (React Query), Zustand
- ✅ **백엔드**: Node.js 20, Express.js, TypeScript
- ✅ **데이터베이스**: PostgreSQL 16, Prisma ORM
- ✅ **AI/ML**: OpenAI GPT-4, LangChain, Pinecone, OpenAI Embeddings
- ✅ **인증**: JWT, bcrypt
- ✅ **검증**: Zod

### 사용 예정
- ⏳ **차트**: Recharts (설치됨, 미사용)
- ⏳ **애니메이션**: Framer Motion (설치됨, 일부 사용)

---

## 🐛 알려진 이슈

### 해결됨
- ✅ 답안 제출 후 자동 다음 문제 넘어가는 버그 (수정 완료)
- ✅ 중복 문제 152개 (삭제 완료)
- ✅ 레이블 불일치 문제 10개 (삭제 완료)

### 현재 이슈
- ⚠️ **Node.js 버전**: 현재 v18.12.1 사용 중
  - Next.js 14는 v18.17.0+ 필요
  - **해결 방법**: `nvm use 20.19.5` (`.nvmrc` 파일에 명시)
- ⚠️ 프론트엔드 실행 불가 (Node.js 버전 문제)

---

## 💡 오늘 작업 권장 사항

### 긴급 작업
1. [ ] Node.js 버전 업그레이드 (`nvm use 20.19.5`)
2. [ ] 프론트엔드 실행 확인
3. [ ] 전체 플로우 테스트

### 추천 작업
1. [ ] 대시보드 최근 활동 표시 구현
2. [ ] 통계 차트 추가 (Recharts)
3. [ ] 배지 시드 데이터 작성

---

## 📦 MVP 완성 체크리스트

### 포함 (완료)
- ✅ 회원가입/로그인
- ✅ 기본 대시보드
- ✅ Level 1-4 문제 풀이 (188문제)
- ✅ 진도 추적 & 통계
- ✅ 포인트/레벨 시스템
- ✅ React Query 서버 상태 관리
- ✅ RAG 기반 챗봇
- ✅ 대화 히스토리 관리
- ✅ 프리셋-챗봇 연동

### 제외 (나중에)
- ❌ 음성 인식/TTS
- ❌ 고급 약점 분석
- ❌ 리더보드
- ❌ 소셜 기능
- ❌ 학부모 모니터링

---

## 🎯 최종 목표

**MVP 출시**: 2025년 10월 말
**목표**: 핵심 기능만으로 빠르게 출시, 사용자 피드백 수집 후 개선

**현재 상태**: 약 85% 완성, 대시보드 고도화 및 게임화 요소만 남음
