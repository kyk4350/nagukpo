# Claude AI 개발 규칙

## 문서 역할

- claude.md: Claude 작업 시 핵심 규칙
- DEVELOPMENT.md: 기술 스택, 아키텍처, 상세 컨벤션
- PROGRESS.md: 초기 세팅 기록 (완료)
- TODO.md: 당일 작업 목록 체크

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
- 아키텍처 변경(사유 포함) → DEVELOPMENT.md
- 규칙 변경 → claude.md + DEVELOPMENT.md
- 작업 시작/완료 체크 → TODO.md
- 셋업 관련 → SETUP.md
- 프로젝트 기획 → project-plan.md

---

## 코드 작성 원칙

### 주석 관리

- 코드 수정 시 해당 주석 반드시 함께 업데이트

### 함수 및 컴포넌트

- 하나의 함수/컴포넌트는 하나의 책임만 가짐
- 함수 길이: 20줄 이내 권장
- 복잡한 로직은 별도 함수로 분리
- JSDoc으로 목적, 매개변수, 반환값 명시

### 커스텀 훅

- 반복되는 로직은 커스텀 훅으로 추출
- 훅 이름은 반드시 use로 시작
- 여러 컴포넌트에서 공통으로 사용하는 상태 로직은 커스텀 훅으로 분리

### React Query (TanStack Query) 사용 규칙

**필수 사용**:

- 모든 서버 상태 관리는 React Query 사용
- useState/useEffect로 API 호출 금지

**쿼리 키 네이밍**:

- 배열 형태로 작성: `['problems', { level: 1 }]`
- 첫 번째 요소: 리소스명 (복수형)
- 두 번째 요소: 필터/파라미터 객체

**파일 위치**:

- 쿼리/뮤테이션 훅: `frontend/src/hooks/queries/`
- 쿼리 키 상수: `frontend/src/lib/queryKeys.ts`

**기본 설정**:

```typescript
// hooks/queries/useProblems.ts
export function useProblems(params: GetProblemsParams) {
  return useQuery({
    queryKey: ["problems", params],
    queryFn: () => getProblems(params),
    staleTime: 5 * 60 * 1000, // 5분
  });
}
```

**뮤테이션 후 무효화**:

```typescript
const mutation = useMutation({
  mutationFn: submitAnswer,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["problems"] });
    queryClient.invalidateQueries({ queryKey: ["progress"] });
  },
});
```

**주의사항**:

- enabled 옵션으로 조건부 실행 제어
- refetchOnWindowFocus는 기본 false
- 전역 로딩은 isFetching, 개별 로딩은 isLoading 사용
- Optimistic Update는 필요한 경우에만 사용

### 조건문 및 반복문

- 중첩 최대 2단계
- Early return 패턴 적극 활용
- 복잡한 조건은 의미 있는 변수명으로 추출

### 변수 선언

- const 기본 사용, 재할당 필요 시 let
- var 금지
- 명확하고 의미 있는 변수명
- 매직 넘버는 상수로 선언

### 코드 중복 제거

- DRY 원칙 준수
- 동일 로직 2번 이상 반복 시 함수 또는 커스텀 훅으로 추출
- 유사 컴포넌트는 props로 재사용 가능하게 구성

### 테스트 가능한 코드

- 순수 함수 우선 작성
- 부수 효과 최소화 및 명확히 분리
- 의존성 주입 고려

---

## 코드 스타일

- 들여쓰기: 2칸
- 문자열: 단일 따옴표 (JSX는 이중)
- 세미콜론: 사용안함
- Import 순서: React → Next.js → 라이브러리 → 내부 → 스타일

상세 규칙은 DEVELOPMENT.md 참고
