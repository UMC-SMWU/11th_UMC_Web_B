import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export const authInputClassName =
    "h-full min-w-0 flex-1 bg-transparent text-[15px] text-[#17191f] outline-none placeholder:text-[#9ca2ad]";

export const authInlineButtonClassName =
    "ml-3 shrink-0 border-0 bg-transparent p-0 text-[13px] font-bold text-[#536ce6] disabled:cursor-not-allowed";

export const authSubmitButtonClassName =
    "h-[52px] w-full rounded-lg border-0 bg-[#536ce6] text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#a9b5f2]";

interface AuthFieldProps {
    label: string;
    htmlFor: string;
    icon?: string;
    hasError?: boolean;
    message?: string;
    children: ReactNode;
}

/** 라벨 + 입력 박스 + 안내/오류 문구를 묶는 컴포넌트 (로그인, 회원가입 공통) */
export function AuthField({
    label,
    htmlFor,
    icon,
    hasError = false,
    message,
    children,
}: AuthFieldProps) {
    return (
        <div className="grid gap-2">
            <label
                className="text-sm font-bold text-[#17191f]"
                htmlFor={htmlFor}
            >
                {label}
            </label>
            <div
                className={cn(
                    "flex h-[52px] items-center gap-2.5 rounded-lg border bg-white px-4 focus-within:border-[#536ce6]",
                    hasError ? "border-[#d14343]" : "border-[#dfe3e9]",
                )}
            >
                {icon && (
                    <img
                        className="h-[18px] w-[18px] opacity-60"
                        src={icon}
                        alt=""
                    />
                )}
                {children}
            </div>
            {message && (
                <p
                    className={cn(
                        "text-xs",
                        hasError ? "text-[#d14343]" : "text-[#9ca2ad]",
                    )}
                >
                    {message}
                </p>
            )}
        </div>
    );
}
