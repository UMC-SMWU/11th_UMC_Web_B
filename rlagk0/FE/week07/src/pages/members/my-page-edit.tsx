import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";
import {
    AuthField,
    authInlineButtonClassName,
    authInputClassName,
} from "@/components/auth/auth-field";
import { ProfileAvatar } from "@/components/members/profile-avatar";
import { useMemberStore } from "@/stores/member-store";

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function MyPageEdit() {
    const navigate = useNavigate();
    const member = useMemberStore((state) => state.member);
    const updateProfile = useMemberStore((state) => state.updateProfile);

    const [nickname, setNickname] = useState(member.nickname);
    const [profileImageUrl, setProfileImageUrl] = useState(
        member.profileImageUrl,
    );
    const [nicknameCheck, setNicknameCheck] = useState({
        isChecking: false,
        isAvailable: false,
    });

    const trimmedNickname = nickname.trim();
    const isNicknameValid =
        trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
    const isNicknameChanged = trimmedNickname !== member.nickname;
    const showNicknameError = nickname.length > 0 && !isNicknameValid;

    const isNicknameReady =
        isNicknameValid && (!isNicknameChanged || nicknameCheck.isAvailable);
    const hasChanges =
        isNicknameChanged || profileImageUrl !== member.profileImageUrl;
    const canSave = hasChanges && isNicknameReady && !nicknameCheck.isChecking;

    const handleChangeNickname = (value: string) => {
        if (nicknameCheck.isChecking) return;
        setNicknameCheck({ isChecking: false, isAvailable: false });
        setNickname(value);
    };

    const handleCheckNickname = async () => {
        if (!isNicknameValid || !isNicknameChanged || nicknameCheck.isChecking)
            return;

        setNicknameCheck({ isChecking: true, isAvailable: false });
        try {
            const { available } = await checkNicknameDuplicate(trimmedNickname);
            setNicknameCheck({ isChecking: false, isAvailable: available });
            alert(
                available
                    ? "사용할 수 있는 닉네임이에요."
                    : "이미 사용 중인 닉네임이에요.",
            );
        } catch {
            setNicknameCheck({ isChecking: false, isAvailable: false });
            alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
        }
    };

    const handleChangeProfileImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 선택할 수 있어요.");
            return;
        }
        if (file.size > MAX_PROFILE_IMAGE_SIZE) {
            alert("프로필 이미지는 최대 5MB까지 선택할 수 있어요.");
            return;
        }

        setProfileImageUrl(URL.createObjectURL(file));
    };

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canSave) return;

        updateProfile({ nickname: trimmedNickname, profileImageUrl });
        alert("변경사항을 저장했어요.");
        navigate({ to: "/me" });
    };

    const handleWithdraw = () => {
        if (!confirm("정말 탈퇴할까요? 탈퇴 후에는 복구할 수 없어요.")) return;

        alert("회원 탈퇴는 API 연동 후 사용할 수 있어요.");
    };

    return (
        <main className="mx-auto flex w-[calc(100%-48px)] max-w-[1420px] flex-1 flex-col py-[31px] pb-[60px]">
            <form
                className="flex flex-1 flex-col"
                onSubmit={handleSubmit}
                noValidate
            >
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <h1 className="text-[38px] leading-[1.2] font-extrabold tracking-[-1.8px] text-[#17191f]">
                            내 정보 수정
                        </h1>
                        <p className="mt-2 text-sm text-[#727887]">
                            닉네임과 프로필 이미지만 변경할 수 있어요.
                        </p>
                    </div>

                    <button
                        className="mt-2 h-12 shrink-0 rounded-[9px] border-0 bg-[#536ce6] px-[21px] text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#a9b5f2]"
                        type="submit"
                        disabled={!canSave}
                    >
                        변경사항 저장
                    </button>
                </div>

                <div className="mt-10 grid gap-10 md:grid-cols-2">
                    <div className="flex flex-col items-center pt-4">
                        <label
                            className="relative cursor-pointer"
                            aria-label="프로필 이미지 변경"
                        >
                            <ProfileAvatar imageUrl={profileImageUrl} />
                            <img
                                className="absolute right-0 bottom-0 h-7 w-7 rounded-full bg-white"
                                src="/icons/movie-icons/edit.svg"
                                alt=""
                            />
                            <input
                                className="hidden"
                                type="file"
                                accept="image/*"
                                onChange={handleChangeProfileImage}
                            />
                        </label>
                        <p className="mt-3 text-[15px] font-bold text-[#17191f]">
                            프로필 이미지
                        </p>
                        <p className="mt-1 text-xs text-[#9ca2ad]">
                            선택 사항 · 최대 5MB
                        </p>
                    </div>

                    <div className="grid content-start gap-5">
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
                                value={nickname}
                                disabled={nicknameCheck.isChecking}
                                onChange={(e) =>
                                    handleChangeNickname(e.target.value)
                                }
                            />
                            <button
                                className={authInlineButtonClassName}
                                type="button"
                                disabled={
                                    !isNicknameValid ||
                                    !isNicknameChanged ||
                                    nicknameCheck.isChecking
                                }
                                onClick={handleCheckNickname}
                            >
                                {nicknameCheck.isChecking
                                    ? "확인 중"
                                    : "중복 확인"}
                            </button>
                        </AuthField>

                        {/* 이메일은 변경할 수 없어서 읽기 전용으로 표시 */}
                        <AuthField label="이메일" htmlFor="email">
                            <input
                                id="email"
                                className={authInputClassName}
                                type="email"
                                value={member.email}
                                readOnly
                            />
                        </AuthField>
                    </div>
                </div>

                <section className="mt-auto flex items-center justify-between gap-6 rounded-lg border border-[#e3a0a0] bg-[#f6e9ea] px-5 py-5">
                    <div>
                        <h2 className="text-sm font-bold text-[#c23b3b]">
                            회원 탈퇴
                        </h2>
                        <p className="mt-1 text-xs text-[#c23b3b]">
                            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두
                            삭제되며 복구할 수 없습니다.
                        </p>
                    </div>
                    <button
                        className="h-10 shrink-0 rounded-lg border border-[#d14343] bg-white px-4 text-sm font-bold text-[#c23b3b]"
                        type="button"
                        onClick={handleWithdraw}
                    >
                        회원 탈퇴
                    </button>
                </section>
            </form>
        </main>
    );
}
