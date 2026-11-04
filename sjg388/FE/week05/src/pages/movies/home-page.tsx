import { useState } from "react";
import { MovieListPage } from "./movie-list-page";

export function HomePage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkApis() {
    setLoading(true);
    setResult("");

    const apis = [
      { name: "닉네임 중복 확인", path: "/members/nickname/" + encodeURIComponent("수현") },
      { name: "이메일 중복 확인", path: "/members/email/noco@umc.com" },
      { name: "회원별 평점 조회", path: "/members/1/ratings" },
    ];

    try {
      const results = await Promise.all(
        apis.map(async ({ name, path }) => {
          const response = await fetch("http://localhost:8080" + path);
          if (!response.ok) {
            throw new Error(`${name}: HTTP ${response.status}`);
          }
          const data = await response.json();
          return `${name} (HTTP ${response.status})\n${JSON.stringify(data, null, 2)}`;
        })
      );

      setResult(results.join("\n\n"));
    } catch (error) {
      setResult(error instanceof Error ? error.message : "요청 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="mx-auto max-w-6xl p-4">
        <h2 className="mb-3 text-xl font-bold">회원 및 평점 조회</h2>
        <button
          type="button"
          onClick={checkApis}
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          {loading ? "불러오는 중..." : "API 3개 조회"}
        </button>
        {result && (
          <pre className="mt-4 overflow-auto rounded bg-gray-100 p-4 text-sm text-black">
            {result}
          </pre>
        )}
      </section>
      <MovieListPage />
    </>
  );
}