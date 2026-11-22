import { create } from "zustand";

interface MemberStore {
    profileImageUrl: string | null;
    setProfileImageUrl: (profileImageUrl: string | null) => void;
}

export const useMemberStore = create<MemberStore>()((set) => ({
    profileImageUrl: null,
    setProfileImageUrl: (profileImageUrl) => set({ profileImageUrl }),
}));
