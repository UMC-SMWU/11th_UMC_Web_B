import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { readBookmarkIds, saveBookmarkIds } from "../../utils/bookmark-storage";

const BookmarkContext = createContext<{
  ids: number[];
  toggle: (id: number) => void;
} | null>(null);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  // 저장된 북마크로 초기 상태 설정
  const [ids, setIds] = useState<number[]>(() => readBookmarkIds());

  // 북마크 목록이 바뀌면 저장
  useEffect(() => {
    saveBookmarkIds(ids);
  }, [ids]);

  // 이미 있으면 제거, 없으면 추가
  function toggle(id: number) {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  return (
    <BookmarkContext.Provider value={{ ids, toggle }}>
      {children}
    </BookmarkContext.Provider>
  );
}

// 다른 컴포넌트에서 북마크 목록과 toggle 함수 사용
// eslint-disable-next-line react-refresh/only-export-components
export function useBookmarks() {
  const value = useContext(BookmarkContext);

  if (!value) {
    throw new Error("BookmarkProvider가 필요해요.");
  }

  return value;
}
