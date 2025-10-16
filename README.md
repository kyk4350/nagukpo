# 나국포 (Nagukpo)

> 국포자(국어를 포기한 자) 탈출 프로젝트 - AI 기반 맞춤형 한국어 학습 서비스

## 프로젝트 소개

나국포는 국어 학습에 어려움을 겪는 학생들을 위한 AI 챗봇 기반 교육 플랫폼입니다.

### 주요 기능

- **프리셋 모드**: 공공데이터 기반 체계적인 학습 코스
- **챗봇 모드**: AI와 대화하며 맞춤형 학습
- **진도 추적**: 학습 현황 및 약점 분석
- **게임화 요소**: 포인트, 뱃지, 연속 학습 스트릭

## 기술 스택

### Frontend
- Next.js 14 (React 18)
- TypeScript
- Tailwind CSS
- Zustand (상태 관리)

### Backend
- Node.js 20
- Express.js
- TypeScript
- PostgreSQL 16
- Redis 7
- Prisma ORM

### AI/ML
- OpenAI GPT-4
- LangChain (RAG)
- Pinecone (Vector DB)

## 데이터 출처

### 필수 공공데이터 (⭐)
- **AI Hub - 국어 교과 지문형 문제 데이터** (10,270건)
  - 학년별 국어 문제 (지문 + 문항 + 답 + 해설)
  - 교육과정 매핑, 상세 해설 포함
  - URL: https://www.aihub.or.kr/

- **표준국어대사전 API**
  - 어휘 정의, 예문, 문법 정보
  - 어휘 문제 자동 생성에 활용
  - URL: https://stdict.korean.go.kr/openapi/

### 추가 공공데이터
- 한국어기초사전 API (쉬운 설명 버전 제공)
- 우리말샘 API (신조어, 생활 어휘)

## 프로젝트 구조

```
nagukpo/
├── frontend/          # Next.js 프론트엔드
├── backend/           # Express 백엔드
├── shared/            # 공유 타입 및 유틸리티
└── docs/              # 프로젝트 문서
```

## 개발 로드맵

- [x] 프로젝트 기획
- [ ] 환경 설정 & 데이터 준비 (Week 1)
- [ ] 백엔드 개발 (Week 2)
- [ ] 프론트엔드 개발 (Week 3)
- [ ] 통합 & 배포 (Week 4)

## 라이선스

MIT

## 문의

GitHub: [@kyk4350](https://github.com/kyk4350)
