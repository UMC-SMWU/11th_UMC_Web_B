import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
    AuthField,
    authInputClassName,
    authSubmitButtonClassName,
} from "@/components/auth/auth-field";
import { useLoginMutation } from "@/hooks/use-login-mutation";

// 이메일 형식 검사 (회원가입과 같은 규칙)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_FORM = {
    email: "",
    password: "",
};

type LoginFormKey = keyof typeof DEFAULT_FORM;

export function LoginPage() {
    const [form, setForm] = useState(DEFAULT_FORM);
    const loginMutation = useLoginMutation();

    const isEmailValid = EMAIL_REGEX.test(form.email.trim());
    const isPasswordFilled = form.password.length > 0;

    // 입력을 시작한 필드에만 오류 표시
    const showEmailError = form.email.length > 0 && !isEmailValid;

    // 이메일 형식이 맞고 비밀번호를 입력해야 로그인 버튼 활성화
    const canSubmit = isEmailValid && isPasswordFilled;

    const handleChangeField = (key: LoginFormKey, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        // 폼 제출 시 페이지 새로고침 방지
        e.preventDefault();
        if (!canSubmit || loginMutation.isPending) return;

        loginMutation.mutate({
            email: form.email.trim(),
            password: form.password,
        });
    };

    return (
        <main className="flex flex-1 items-center justify-center px-6 py-20">
            {/* noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔 */}
            <form
                className="grid w-full max-w-[472px] gap-5"
                onSubmit={handleSubmit}
                noValidate
            >
                <h1 className="mb-1 text-[38px] leading-[1.2] font-extrabold tracking-[-1.5px] text-[#17191f]">
                    로그인
                </h1>

                <AuthField
                    label="이메일"
                    htmlFor="email"
                    icon="/icons/movie-icons/mail.svg"
                    hasError={showEmailError}
                    message={
                        showEmailError ? "이메일 형식을 확인해 주세요." : undefined
                    }
                >
                    <input
                        id="email"
                        className={authInputClassName}
                        type="email"
                        autoComplete="email"
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={(e) =>
                            handleChangeField("email", e.target.value)
                        }
                    />
                </AuthField>

                <AuthField
                    label="비밀번호"
                    htmlFor="password"
                    icon="/icons/movie-icons/lock.svg"
                >
                    <input
                        id="password"
                        className={authInputClassName}
                        type="password"
                        autoComplete="current-password"
                        placeholder="비밀번호"
                        value={form.password}
                        onChange={(e) =>
                            handleChangeField("password", e.target.value)
                        }
                    />
                </AuthField>

                <button
                    className={authSubmitButtonClassName}
                    type="submit"
                    disabled={!canSubmit || loginMutation.isPending}
                >
                    {loginMutation.isPending ? "로그인 중" : "로그인"}
                </button>

                <p className="text-center text-[13px] text-[#9ca2ad]">
                    처음이신가요?{" "}
                    <Link
                        className="font-bold text-[#536ce6] no-underline"
                        to="/signup"
                    >
                        회원가입
                    </Link>
                </p>
            </form>
        </main>
    );
}
