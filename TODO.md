# 나국포 개발 현황 및 TODO

> **최종 업데이트**: 2025-10-23
> **전체 진행률**: 약 95% 완료

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
  - 어휘(vocabulary): 32문제 (GPT-4 생성, 난이도별 분리)
  - 문법(grammar): 32문제 (GPT-4 생성, 난이도별 분리)
  - 작문(writing): 32문제 (GPT-4 생성, 난이도별 분리)
- [x] 문제 조회 API (필터링: level, type, difficulty)
- [x] 문제 제출 및 채점 API
- [x] 난이도별 포인트 지급
- [x] 정답률 계산
- [x] 중복 문제 152개 삭제 완료
- [x] 레이블 불일치 문제 10개 삭제 완료
- [x] Prisma enum 추가 (ProblemType, Difficulty)
- [x] 랜덤 문제 순서 (유형별 골고루 섞임)
- [x] 난이도 정교화 (학년별·난이도별 GPT 프롬프트 개선)

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
- [x] 힌트 시스템 (3단계 점진적 힌트)
- [x] 학습 종료 모달 (세션별 통계 표시)

#### 5. 진도/통계 시스템 (100%)
- [x] 사용자별 진도 추적 API
- [x] 레벨별 통계 (시도한 문제/푼 문제/전체 문제)
- [x] 유형별 정답률
- [x] 난이도별 정답률
- [x] 최근 풀이 기록 (상위 10개)
- [x] 포인트 및 경험치 시스템

#### 6. 대시보드 (100%)
- [x] 레벨, 포인트, 연속 학습 일수 표시
- [x] 경험치 진행바
- [x] 빠른 시작 버튼 (프리셋 학습, AI 대화)
- [x] 프로필 정보 (이름, 이메일, 나이, 가입일)
- [x] 배지 시스템 (획득 조건, 조회 API, 표시 UI)
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

### 1순위: UI/UX 개선 및 마무리 작업 (예상 2시간)

#### 애니메이션 및 피드백 개선
- [ ] 포인트 획득 애니메이션 (Framer Motion)
- [ ] 레벨업 알림 모달 컴포넌트
- [ ] 배지 획득 알림 토스트

#### 프리셋 학습 UX 개선
- [ ] 문제 풀이 진행률 표시 (현재 3/10 형태)
- [ ] 키보드 단축키 지원 (1,2,3,4로 선택지 선택)
- [ ] 문제 난이도 표시 (easy/medium/hard 아이콘)

---

### 2순위: 버그 수정 및 테스트 (예상 2시간)

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
│   ├── problem.service.ts       ✅ 문제 관리 (랜덤 정렬)
│   ├── progress.service.ts      ✅ 진도 추적
│   ├── rag.service.ts           ✅ RAG 시스템
│   └── hint.service.ts          ✅ 힌트 생성
├── controllers/
│   ├── auth.controller.ts
│   ├── chat.controller.ts
│   ├── problem.controller.ts
│   ├── progress.controller.ts
│   └── hint.controller.ts
├── routes/
│   ├── auth.routes.ts
│   ├── chat.routes.ts
│   ├── problem.routes.ts
│   ├── progress.routes.ts
│   └── hint.routes.ts
├── scripts/
│   ├── create-embeddings.ts        ✅ 임베딩 생성
│   ├── test-rag.ts                 ✅ RAG 테스트
│   ├── generate-problems-gpt.ts    ✅ GPT 문제 생성 (난이도별)
│   ├── generate-missing-problems.ts ✅ 부족 문제 생성
│   ├── delete-gpt-problems.ts      ✅ GPT 문제 삭제
│   └── check-problem-stats.ts      ✅ 문제 분포 통계
└── index.ts
```

### 프론트엔드 (완전 구현)
```
frontend/src/
├── app/
│   ├── page.tsx                  ✅ 랜딩 페이지
│   ├── login/page.tsx            ✅ 로그인
│   ├── register/page.tsx         ✅ 회원가입
│   ├── dashboard/page.tsx        ✅ 대시보드 (100%)
│   ├── preset/
│   │   ├── page.tsx              ✅ 레벨 선택
│   │   └── [level]/page.tsx      ✅ 문제 풀이 (힌트 패널 통합)
│   └── chat/page.tsx             ✅ 챗봇
├── components/                   ✅ UI 컴포넌트
│   ├── HintPanel.tsx             ✅ 힌트 패널
│   └── StudySummaryModal.tsx     ✅ 학습 종료 모달
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
- ✅ GPT 생성 문제 난이도 너무 쉬움 (재생성 완료, 학년별·난이도별 프롬프트 개선)
- ✅ 문제 순서 편향 (랜덤 정렬로 수정)
- ✅ 학습 종료 모달 크기/차트 업데이트 문제 (수정 완료)
- ✅ Achievement routes 미들웨어 에러 (수정 완료)

### 현재 이슈
없음

---

## 💡 최근 완료 작업 (2025-10-23)

### 힌트 시스템 구현 완료
- ✅ 백엔드: hint.service.ts, hint.controller.ts, hint.routes.ts
- ✅ 프론트엔드: HintPanel 컴포넌트 및 통합
- ✅ 3단계 점진적 힌트 (GPT-4 기반)

### 문제 난이도 개선
- ✅ GPT 프롬프트 학년별·난이도별 분리 (중1/중2/중3/고1)
- ✅ 96개 GPT 문제 재생성 (어휘 32, 문법 32, 작문 32)
- ✅ 난이도별 정교한 평가 기준 적용

### 문제 랜덤 정렬
- ✅ problem.service.ts 랜덤 셔플 로직 추가
- ✅ 모든 유형 골고루 섞이도록 개선

### 학습 종료 모달
- ✅ 세션별 통계 표시 (푼 문제 수, 정답률, 유형별 분포)
- ✅ 반응형 모달 크기 수정
- ✅ 차트 실시간 업데이트 수정

### 배지 시스템
- ✅ Achievement 시드 데이터 작성
- ✅ 배지 획득 로직 구현
- ✅ 배지 조회 API 구현
- ✅ 대시보드 배지 표시

---

## 📦 MVP 완성 체크리스트

### 포함 (완료)
- ✅ 회원가입/로그인
- ✅ 기본 대시보드 (통계 차트 포함)
- ✅ Level 1-4 문제 풀이 (284문제: 독해 188 + 어휘 32 + 문법 32 + 작문 32)
- ✅ 진도 추적 & 통계
- ✅ 포인트/레벨 시스템
- ✅ 배지 시스템
- ✅ React Query 서버 상태 관리
- ✅ RAG 기반 챗봇
- ✅ 대화 히스토리 관리
- ✅ 프리셋-챗봇 연동
- ✅ 힌트 시스템 (3단계)
- ✅ 학습 종료 모달

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

**현재 상태**: 약 95% 완성
- ✅ 핵심 기능 모두 구현 완료
- ✅ 게임화 요소 (포인트/레벨/배지/힌트) 완료
- ✅ RAG 기반 AI 챗봇 완료
- ✅ 284개 문제 (난이도 정교화 완료)
- 🔜 UI/UX 개선 및 테스트만 남음
