import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";
export const Route = createRootRoute({
  component: () => <div className="flex min-h-screen flex-col bg-[#f6f7f9] font-sans text-[#17191e]"><Header /><Outlet /><Footer /></div>,
  notFoundComponent: () => <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-12 lg:px-20">페이지를 찾을 수 없어요.</main>,
});
