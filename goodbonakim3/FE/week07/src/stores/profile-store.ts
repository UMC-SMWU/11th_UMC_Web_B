import { create } from "zustand";

interface Profile {
  email: string;
  nickname: string;
  image: string | null;
}

interface ProfileStore {
  profile: Profile | null;
  saveProfile: (profile: Profile | null) => void;
}

export const useProfile = create<ProfileStore>((set) => ({
  profile: null,
  saveProfile: (profile) => set({ profile }),
}));
