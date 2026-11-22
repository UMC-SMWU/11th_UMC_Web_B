import { create } from "zustand";

interface Member {
    nickname: string;
    email: string;
    profileImageUrl: string | null;
}

interface MemberStore {
    member: Member;
    updateProfile: (
        profile: Pick<Member, "nickname" | "profileImageUrl">,
    ) => void;
}

const MOCK_MEMBER: Member = {
    nickname: "gs0428",
    email: "gwangsoo@cinemalab.kr",
    profileImageUrl: null,
};

export const useMemberStore = create<MemberStore>()((set) => ({
    member: MOCK_MEMBER,
    updateProfile: (profile) =>
        set((state) => ({ member: { ...state.member, ...profile } })),
}));
