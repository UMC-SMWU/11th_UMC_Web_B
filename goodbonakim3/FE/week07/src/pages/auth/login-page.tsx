import { Link, useNavigate } from "@tanstack/react-router";
import { HTTPError } from "ky";
import { useState, type SubmitEvent } from "react";
import { login } from "../../api/members/login";
import { useProfile } from "../../stores/profile-store";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const saveProfile = useProfile((state) => state.saveProfile);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = email.trim();
    if (submitting || !address || !password) return;

    setSubmitting(true);
    setError("");
    try {
      const member = await login({ email: address, password });
      const previous = useProfile.getState().profile;
      saveProfile({
        ...member,
        image: previous?.email === member.email ? previous.image : null,
      });
      setPassword("");
      void navigate({ to: "/mypage" });
    } catch (error) {
      if (error instanceof HTTPError && error.response.status === 401) {
        setError("로그인할 수 없어요. 이메일과 비밀번호를 확인해 주세요.");
      } else {
        setError("로그인에 실패했어요. 서버가 실행 중인지 확인하고 다시 시도해 주세요.");
      }
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <main className="grid flex-1 place-items-center px-6 py-12">
      <form className="w-full max-w-[430px] space-y-4" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold tracking-tight">로그인</h1>
        <label className="block text-sm font-semibold">
          이메일
          <input className="mt-2 h-12 w-full rounded-lg border border-gray-200 bg-white px-4 font-normal" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(event) => setEmail(event.target.value)} readOnly={submitting} required />
        </label>
        <label className="block text-sm font-semibold">
          비밀번호
          <input className="mt-2 h-12 w-full rounded-lg border border-gray-200 bg-white px-4 font-normal" type="password" autoComplete="current-password" placeholder="비밀번호" value={password} onChange={(event) => setPassword(event.target.value)} readOnly={submitting} required />
        </label>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="h-12 w-full rounded-lg bg-blue-600 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "로그인 중" : "로그인"}
        </button>
        <p className="text-center text-xs text-gray-600">처음이신가요? <Link to="/signup" className="font-bold text-blue-600">회원가입</Link></p>
      </form>
    </main>
  );
}
