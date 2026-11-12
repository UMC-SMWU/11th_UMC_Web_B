import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { useProfile } from "../../stores/profile-store";

export function EditProfilePage() {
  const profile = useProfile((state) => state.profile);
  const saveProfile = useProfile((state) => state.saveProfile);
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(profile?.nickname ?? "");
  const [image, setImage] = useState(profile?.image ?? null);
  const [imageError, setImageError] = useState("");
  const [readingImage, setReadingImage] = useState(false);
  const [checked, setChecked] = useState("");
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");
  const name = nickname.trim();
  const valid = name.length >= 2 && name.length <= 12;
  const canSave = !readingImage && !checking && (name === profile?.nickname || (valid && name === checked));

  if (!profile) return <main className="flex-1 p-8"><Link to="/login" className="text-blue-600">로그인 후 내 정보를 수정할 수 있어요.</Link></main>;

  async function checkNickname() {
    setChecking(true);
    setChecked("");
    setMessage("");
    try {
      const result = await checkNicknameDuplicate(name);
      setChecked(result.available ? name : "");
      setMessage(result.available ? "사용 가능한 닉네임이에요." : "이미 사용 중인 닉네임이에요.");
    } catch {
      setMessage("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setChecking(false);
    }
  }

  function selectImage(file?: File) {
    if (!file) return;
    setImageError("");
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setImageError("5MB 이하의 이미지 파일을 선택해 주세요.");
      return;
    }
    const reader = new FileReader();
    setReadingImage(true);
    reader.onload = () => setImage(String(reader.result));
    reader.onerror = () => setImageError("이미지를 읽을 수 없어요.");
    reader.onloadend = () => setReadingImage(false);
    reader.readAsDataURL(file);
  }

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 py-8 lg:px-20">
      <form className="flex-1" onSubmit={(event) => {
        event.preventDefault();
        if (!canSave) return;
        saveProfile({ ...profile, nickname: name, image });
        void navigate({ to: "/mypage" });
      }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">내 정보 수정</h1>
            <p className="mt-2 text-sm text-gray-600">닉네임과 프로필 이미지를 변경할 수 있어요.</p>
          </div>
          <button disabled={!canSave} className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">변경사항 저장</button>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="text-center">
            <div className="mx-auto mb-2 grid size-20 place-items-center overflow-hidden rounded-full bg-gray-200">
              {image ? <img src={image} alt="프로필 미리보기" className="size-full object-cover" /> : "프로필"}
            </div>
            <label className="cursor-pointer text-sm font-bold focus-within:underline">
              프로필 이미지 변경
              <input type="file" accept="image/*" className="sr-only" disabled={readingImage} onChange={(event) => selectImage(event.target.files?.[0])} />
            </label>
            <p className="mt-1 text-xs text-gray-500">선택 사항 · 최대 5MB</p>
            {imageError && <p role="alert" className="mt-1 text-xs text-red-600">{imageError}</p>}
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-nickname" className="text-sm font-semibold">닉네임</label>
              <div className="mt-2 flex items-center rounded-lg border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-blue-500">
                <input id="edit-nickname" value={nickname} readOnly={checking} onChange={(event) => {
                  setNickname(event.target.value);
                  setChecked("");
                  setMessage("");
                }} className="h-12 min-w-0 flex-1 rounded-lg px-4 text-sm outline-none" />
                <button type="button" disabled={!valid || name === profile.nickname || checking} onClick={checkNickname} className="shrink-0 px-3 text-xs font-bold text-blue-600 disabled:cursor-not-allowed">
                  {checking ? "확인 중" : "중복 확인"}
                </button>
              </div>
              <p aria-live="polite" className="mt-1 text-xs text-gray-600">{valid || name === profile.nickname ? message : "닉네임은 2~12자로 입력해 주세요."}</p>
            </div>
            <label className="block text-sm font-semibold">
              이메일
              <input type="email" readOnly value={profile.email} className="mt-2 h-12 w-full rounded-lg border border-gray-200 bg-white px-4 font-normal text-gray-600" />
            </label>
          </div>
        </div>
      </form>
      <section className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-red-400 bg-red-50 p-5 text-red-700">
        <div><h2 className="text-sm font-bold">회원 탈퇴</h2><p className="mt-1 text-xs">회원 탈퇴 기능은 계정 API 연동 후 사용할 수 있어요.</p></div>
        <button type="button" disabled className="rounded-lg border border-red-400 bg-white px-4 py-2 text-sm font-bold disabled:cursor-not-allowed">회원 탈퇴</button>
      </section>
    </main>
  );
}
