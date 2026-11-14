import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { checkEmailDuplicate } from "@/api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";
import { signup } from "@/api/members/signup";
import {
    AuthField,
    authInlineButtonClassName,
    authInputClassName,
    authSubmitButtonClassName,
} from "@/components/auth/auth-field";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
    email: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

const DEFAULT_DUPLICATE_CHECK = {
    isChecking: false,
    isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
    const [form, setForm] = useState(DEFAULT_FORM);
    const [duplicateCheck, setDuplicateCheck] = useState({
        email: DEFAULT_DUPLICATE_CHECK,
        nickname: DEFAULT_DUPLICATE_CHECK,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // 입력값의 유효성 검사
    const isEmailValid = EMAIL_REGEX.test(form.email.trim());
    const isNicknameValid =
        form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
    const isPasswordValid = PASSWORD_REGEX.test(form.password);
    const isPasswordConfirmValid =
        form.passwordConfirm.length > 0 &&
        form.password === form.passwordConfirm;

    // 입력을 시작한 필드에만 오류 표시
    const showEmailError = form.email.length > 0 && !isEmailValid;
    const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
    const showPasswordError = form.password.length > 0 && !isPasswordValid;
    const showPasswordConfirmError =
        form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

    // 모든 입력값이 유효하면 true
    const isFormValid =
        isEmailValid &&
        isNicknameValid &&
        isPasswordValid &&
        isPasswordConfirmValid;

    // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
    const canSubmit =
        isFormValid &&
        duplicateCheck.email.isAvailable &&
        duplicateCheck.nickname.isAvailable;

    const handleChangeField = (
        key: DefaultFormKey,
        value: DefaultFormValue,
    ) => {
        if (key === "email" || key === "nickname") {
            if (duplicateCheck[key].isChecking) return;
            // 확인한 값을 바꾸면 다시 중복 확인해야 함
            setDuplicateCheck((prev) => ({
                ...prev,
                [key]: DEFAULT_DUPLICATE_CHECK,
            }));
        }
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
        const isValid = key === "email" ? isEmailValid : isNicknameValid;
        if (!isValid || duplicateCheck[key].isChecking) return;

        const label = key === "email" ? "이메일" : "닉네임";
        setDuplicateCheck((prev) => ({
            ...prev,
            [key]: { isChecking: true, isAvailable: false },
        }));

        try {
            const response =
                key === "email"
                    ? await checkEmailDuplicate(form.email.trim())
                    : await checkNicknameDuplicate(form.nickname.trim());
            const isAvailable = response.available;
            setDuplicateCheck((prev) => ({
                ...prev,
                [key]: { ...prev[key], isAvailable },
            }));
            alert(
                isAvailable
                    ? `사용할 수 있는 ${label}이에요.`
                    : `이미 사용 중인 ${label}이에요.`,
            );
        } catch {
            setDuplicateCheck((prev) => ({
                ...prev,
                [key]: { ...prev[key], isAvailable: false },
            }));
            alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
        } finally {
            setDuplicateCheck((prev) => ({
                ...prev,
                [key]: { ...prev[key], isChecking: false },
            }));
        }
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        // 폼 제출 시 페이지 새로고침 방지
        e.preventDefault();
        if (!canSubmit || isSubmitting) return;

        setIsSubmitting(true);
        try {
            // passwordConfirm은 화면에서만 검사하므로 요청에 포함하지 않음
            const response = await signup({
                email: form.email.trim(),
                nickname: form.nickname.trim(),
                password: form.password,
            });
            alert(response.message);
            navigate({ to: "/login" });
        } catch {
            alert("회원가입에 실패했어요. 다시 시도해 주세요.");
        } finally {
            setIsSubmitting(false);
        }
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
                    회원가입
                </h1>

                <AuthField
                    label="이메일"
                    htmlFor="email"
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
                        disabled={duplicateCheck.email.isChecking}
                        onChange={(e) =>
                            handleChangeField("email", e.target.value)
                        }
                    />
                    <button
                        className={authInlineButtonClassName}
                        type="button"
                        disabled={
                            !isEmailValid || duplicateCheck.email.isChecking
                        }
                        onClick={() => handleCheckDuplicate("email")}
                    >
                        {duplicateCheck.email.isChecking
                            ? "확인 중"
                            : "중복 확인"}
                    </button>
                </AuthField>

                <AuthField
                    label="닉네임"
                    htmlFor="nickname"
                    hasError={showNicknameError}
                    message={
                        showNicknameError
                            ? "닉네임은 2~12자로 입력해 주세요."
                            : undefined
                    }
                >
                    <input
                        id="nickname"
                        className={authInputClassName}
                        autoComplete="nickname"
                        placeholder="2-12자"
                        value={form.nickname}
                        disabled={duplicateCheck.nickname.isChecking}
                        onChange={(e) =>
                            handleChangeField("nickname", e.target.value)
                        }
                    />
                    <button
                        className={authInlineButtonClassName}
                        type="button"
                        disabled={
                            !isNicknameValid ||
                            duplicateCheck.nickname.isChecking
                        }
                        onClick={() => handleCheckDuplicate("nickname")}
                    >
                        {duplicateCheck.nickname.isChecking
                            ? "확인 중"
                            : "중복 확인"}
                    </button>
                </AuthField>

                <AuthField
                    label="비밀번호"
                    htmlFor="password"
                    hasError={showPasswordError}
                    // 평소에는 비밀번호 조건을 회색으로 안내하고, 조건을 어기면 경고 문구로 바꿈
                    message={
                        showPasswordError
                            ? "비밀번호 형식을 확인해 주세요."
                            : "영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요"
                    }
                >
                    <input
                        id="password"
                        className={authInputClassName}
                        type="password"
                        autoComplete="new-password"
                        placeholder="8자 이상"
                        value={form.password}
                        onChange={(e) =>
                            handleChangeField("password", e.target.value)
                        }
                    />
                </AuthField>

                <AuthField
                    label="비밀번호 확인"
                    htmlFor="passwordConfirm"
                    hasError={showPasswordConfirmError}
                    message={
                        showPasswordConfirmError
                            ? "비밀번호가 일치하지 않아요."
                            : undefined
                    }
                >
                    <input
                        id="passwordConfirm"
                        className={authInputClassName}
                        type="password"
                        autoComplete="new-password"
                        placeholder="다시 입력"
                        value={form.passwordConfirm}
                        onChange={(e) =>
                            handleChangeField("passwordConfirm", e.target.value)
                        }
                    />
                </AuthField>

                <button
                    className={authSubmitButtonClassName}
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                >
                    {isSubmitting ? "가입 중" : "가입하기"}
                </button>

                <p className="text-center text-[13px] text-[#9ca2ad]">
                    이미 계정이 있나요?{" "}
                    <Link
                        className="font-bold text-[#536ce6] no-underline"
                        to="/login"
                    >
                        로그인
                    </Link>
                </p>
            </form>
        </main>
    );
}
