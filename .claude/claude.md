# Claude AI 개발 규칙

## 문서 역할

- claude.md: Claude 작업 시 핵심 규칙
- DEVELOPMENT.md: 기술 스택, 아키텍처, 상세 컨벤션
- PROGRESS.md: 초기 세팅 기록 (완료)
- TODO.md: 당일 작업 목록

---

## 절대 규칙

### 패키지 변경 금지

사용자 승인 없이 패키지 추가/변경 절대 금지

### Git 커밋

- Claude 서명 금지 (Co-Authored-By, Generated with Claude 등)
- Conventional Commits 형식 사용

### 스타일링

- 사용: Tailwind CSS, shadcn/ui, CVA, cn()
- 금지: CSS Modules, Styled Components, Emotion

### 타입

- any 타입 금지
- 명시적 타입 정의 필수

---

## 명명 규칙

```
파일명:
  Button.tsx           // 컴포넌트: PascalCase
  useAuth.ts           // 훅: camelCase
  auth.service.ts      // 백엔드: camelCase + 접미사

변수:
  userName             // camelCase
  MAX_ATTEMPTS         // 상수: UPPER_SNAKE_CASE
  isActive             // Boolean: is/has/can

함수:
  getUserById()        // camelCase + 동사
  handleClick()        // 이벤트: handle/on

컴포넌트:
  Button()             // PascalCase
  ButtonProps          // Props: 컴포넌트명 + Props
```

---

## 필수 설정

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 프로젝트 구조 (변경 금지)

```
frontend/src/
├── app/         components/    hooks/
├── stores/      lib/           types/

backend/src/
├── routes/      controllers/   services/
├── middleware/
```

---

## 보안

- .env 파일 커밋 금지
- 하드코딩 금지, 환경 변수 사용
- 환경 변수 검증 필수

---

## 문서 업데이트

- 새 패키지 → DEVELOPMENT.md
- 아키텍처 변경 → DEVELOPMENT.md (사유 포함)
- 규칙 변경 → claude.md + DEVELOPMENT.md
- 작업 시작/완료 → TODO.md

---

## 코드 스타일

- 들여쓰기: 2칸
- 문자열: 단일 따옴표 (JSX는 이중)
- 세미콜론: 사용안함
- Import 순서: React → Next.js → 라이브러리 → 내부 → 스타일

상세 규칙은 DEVELOPMENT.md 참고
