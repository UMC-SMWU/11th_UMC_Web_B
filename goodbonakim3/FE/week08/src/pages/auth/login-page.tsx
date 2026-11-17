import { Link, useSearch } from "@tanstack/react-router";
import { HTTPError } from "ky";
import { useState, type SubmitEvent } from "react";
import { getMe } from "../../api/members/me";

import { useProfile } from "../../stores/profile-store";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const { registered } = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const saveProfile = useProfile((state) => state.saveProfile);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const loginMutation = useLoginMutation();

  const canSubmit = EMAIL_REGEX.test(email.trim()) && password.length > 0;
  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const address = email.trim();
    if (submitting || !EMAIL_REGEX.test(address) || !password) return;

    setSubmitting(true);
    setError("");

    try {
      await loginMutation.mutateAsync({
        email: address,
        password,
      });
    } catch (error) {
      if (error instanceof HTTPError && error.response.status === 401) {
        setError("로그인할 수 없어요. 이메일과 비밀번호를 확인해 주세요.");
      } else {
        setError("로그인에 실패했어요. 다시 시도해 주세요.");
      }

      setSubmitting(false);
      return;
    }

    const previous = useProfile.getState().profile;
    saveProfile(null);

    try {
      const member = await getMe();

      saveProfile({
        email: member.email,
        nickname: member.nickname,
        image: previous?.email === member.email ? previous.image : null,
      });
    } catch {
      alert("로그인은 성공했지만 내 정보를 불러오지 못했어요.");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <main className="grid flex-1 place-items-center px-6 py-12">
      <form className="w-full max-w-[430px] space-y-4" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold tracking-tight">로그인</h1>
        {registered && (
          <p role="status" className="text-sm text-green-700">
            회원가입이 완료됐어요. 로그인해 주세요.
          </p>
        )}
        <label className="block text-sm font-semibold">
          이메일
          <input
            className="mt-2 h-12 w-full rounded-lg border border-gray-200 bg-white px-4 font-normal"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            readOnly={submitting}
            required
          />
        </label>
        <label className="block text-sm font-semibold">
          비밀번호
          <input
            className="mt-2 h-12 w-full rounded-lg border border-gray-200 bg-white px-4 font-normal"
            type="password"
            autoComplete="current-password"
            placeholder="비밀번호"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            readOnly={submitting}
            required
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="h-12 w-full rounded-lg bg-blue-600 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "로그인 중" : "로그인"}
        </button>
        <p className="text-center text-xs text-gray-600">
          처음이신가요?{" "}
          <Link to="/signup" className="font-bold text-blue-600">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
