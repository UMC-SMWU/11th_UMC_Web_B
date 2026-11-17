import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Profile {
  email: string;
  nickname: string;
  image: string | null;
}

interface ProfileStore {
  profile: Profile | null;
  saveProfile: (profile: Profile | null) => void;
}

export const useProfile = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      saveProfile: (profile) => set({ profile }),
    }),
    {
      name: "umcine-profile-store",
      partialize: ({ profile }) => ({
        profile: profile
          ? {
              ...profile,
              image:
                (profile.image?.length ?? 0) <= 1_400_000
                  ? profile.image
                  : null,
            }
          : null,
      }),
    },
  ),
);
