import { useState } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
// import { useNavigate } from "@tanstack/react-router";

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
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

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const navigate = useNavigate();

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효하면 제출 버튼 활성화
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
  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
      // 로그인 페이지 연결 후 주석 해제
      // navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-[calc(100dvh-90px)] place-items-center bg-gray-100 px-5 py-8 text-gray-900">
      <form
        className="w-full max-w-[430px] space-y-4"
        onSubmit={handleSubmit}
        noValidate
      >
        <h1 className="text-3xl font-bold tracking-tight">회원가입</h1>

        <div className="space-y-1.5">
          <label htmlFor="signup-email" className="block text-sm font-semibold">
            이메일
          </label>
          <div
            className={`flex items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-blue-500 ${
              showEmailError ? "border-red-500" : "border-gray-300"
            }`}
          >
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              className="h-12 min-w-0 flex-1 rounded-lg bg-transparent px-4 text-sm outline-none"
              value={form.email}
              onChange={(e) =>
                handleChangeField("email", e.currentTarget.value)
              }
              aria-invalid={showEmailError}
              aria-describedby={
                showEmailError ? "signup-email-error" : undefined
              }
              disabled={duplicateCheck.email.isChecking}
            />
            <button
              type="button"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
              className="shrink-0 px-3 text-xs font-bold text-blue-600 disabled:cursor-not-allowed"
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showEmailError && (
            <p id="signup-email-error" className="text-xs text-red-600">
              올바른 이메일 주소를 입력해 주세요.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="signup-nickname"
            className="block text-sm font-semibold"
          >
            닉네임
          </label>
          <div
            className={`flex items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-blue-500 ${
              showNicknameError ? "border-red-500" : "border-gray-300"
            }`}
          >
            <input
              id="signup-nickname"
              type="text"
              autoComplete="nickname"
              placeholder="2–12자"
              className="h-12 min-w-0 flex-1 rounded-lg bg-transparent px-4 text-sm outline-none"
              value={form.nickname}
              onChange={(e) =>
                handleChangeField("nickname", e.currentTarget.value)
              }
              aria-invalid={showNicknameError}
              aria-describedby={
                showNicknameError ? "signup-nickname-error" : undefined
              }
            />
            <button
              type="button"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
              className="shrink-0 px-3 text-xs font-bold text-blue-600 disabled:cursor-not-allowed"
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showNicknameError && (
            <p id="signup-nickname-error" className="text-xs text-red-600">
              닉네임은 2자 이상 12자 이하로 입력해 주세요.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="signup-password"
            className="block text-sm font-semibold"
          >
            비밀번호
          </label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="8자 이상"
            className={`h-12 w-full rounded-lg border bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
              showPasswordError ? "border-red-500" : "border-gray-300"
            }`}
            value={form.password}
            onChange={(e) =>
              handleChangeField("password", e.currentTarget.value)
            }
            aria-invalid={showPasswordError}
            aria-describedby="signup-password-hint"
          />
          <p
            id="signup-password-hint"
            className={`text-xs ${showPasswordError ? "text-red-600" : "text-gray-600"}`}
          >
            영문 대·소문자, 숫자, 특수문자(!@#$%^&amp;*)를 각각 포함해 8자 이상
            입력해 주세요.
          </p>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="signup-password-confirm"
            className="block text-sm font-semibold"
          >
            비밀번호 확인
          </label>
          <input
            id="signup-password-confirm"
            type="password"
            autoComplete="new-password"
            placeholder="다시 입력"
            className={`h-12 w-full rounded-lg border bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
              showPasswordConfirmError ? "border-red-500" : "border-gray-300"
            }`}
            value={form.passwordConfirm}
            onChange={(e) =>
              handleChangeField("passwordConfirm", e.currentTarget.value)
            }
            aria-invalid={showPasswordConfirmError}
            aria-describedby={
              showPasswordConfirmError
                ? "signup-password-confirm-error"
                : undefined
            }
          />
          {showPasswordConfirmError && (
            <p
              id="signup-password-confirm-error"
              className="text-xs text-red-600"
            >
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="h-12 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>

        <p className="text-center text-xs text-gray-600">
          이미 계정이 있나요?{" "}
          <a
            href="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            로그인
          </a>
        </p>
      </form>
    </main>
  );
}
