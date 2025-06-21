import { Profile } from "@/generated/prisma";
import { useFullProfileContext } from "../FullProfileContext";

export function useProfileMutations() {
  const { fullProfile, mutateFullProfile } = useFullProfileContext();

  const updateProfile = async (profile: Profile) => {
    mutateFullProfile({ ...fullProfile, ...profile }, { revalidate: false });
    const response = await fetch(`/api/profiles/${profile.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  return { updateProfile };
}
