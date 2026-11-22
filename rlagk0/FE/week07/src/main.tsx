import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { isHTTPError } from "ky";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const router = createRouter({ routeTree });
const ONE_MINUTE = 60 * 1000;
// 인증 오류(401)와 없는 데이터(404)는 다시 요청해도 결과가 같으므로 재시도하지 않음
const NO_RETRY_STATUSES = [401, 404];
const MAX_RETRY_COUNT = 3;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ONE_MINUTE,
      retry: (failureCount, error) => {
        if (
          isHTTPError(error) &&
          NO_RETRY_STATUSES.includes(error.response.status)
        ) {
          return false;
        }
        return failureCount < MAX_RETRY_COUNT;
      },
    },
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);