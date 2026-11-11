# 4주차 FE — umcine 북마크 상태 관리

영화 목록, 검색, 상세 화면에서 Zustand로 북마크 상태를 공유하는 React 프로젝트입니다.

## 구현 내용

- `useBookmarkStore`에서 북마크한 영화 ID와 추가·제거 함수를 관리합니다.
- 목록, 검색, 상세 화면의 버튼이 같은 store를 사용합니다.
- `persist`와 `createJSONStorage`로 localStorage에 저장하고 앱 실행 시 복원합니다.
- 저장 키는 `umcine-bookmark-store`이며, 초기 북마크 목록은 빈 배열입니다.
- `partialize`로 영화 ID 배열만 저장합니다.

## 실행 방법

```sh
pnpm install
pnpm dev
```

## 빌드

```sh
pnpm build
```

제출 준비 환경에서 pnpm 실행 파일의 경로 접근 오류가 발생하여 빌드 스크립트의 실제 명령을 직접 실행했습니다. TypeScript 검사와 Vite 프로덕션 빌드는 통과했습니다.

```sh
node node_modules/typescript/bin/tsc -b
node node_modules/vite/bin/vite.js build
```

## 수동 확인 방법

1. 목록에서 영화를 북마크하고 검색 및 상세 화면에서 같은 상태인지 확인합니다.
2. 검색 또는 상세 화면에서 해제한 후 목록에서도 해제되는지 확인합니다.
3. 새로고침 및 브라우저 종료·재실행 후 북마크가 유지되는지 확인합니다.
4. 개발자 도구의 Application → Local storage에서 현재 origin을 선택하고 `umcine-bookmark-store` 값을 확인합니다.
5. 해당 저장 항목을 삭제한 후 새로고침하면 빈 북마크 상태로 시작하는지 확인합니다.

브라우저에서 위 항목을 직접 확인한 결과는 아직 기록하지 않았습니다.

## 주요 파일

- `src/stores/bookmark-store.ts`: Zustand 상태 및 저장 설정
- `src/components/movies/bookmark-button.tsx`: 목록·상세 북마크 버튼
- `src/components/bookmark-button.tsx`: 검색 화면 북마크 버튼
- `src/pages/movies/search-page.tsx`: 검색 화면
