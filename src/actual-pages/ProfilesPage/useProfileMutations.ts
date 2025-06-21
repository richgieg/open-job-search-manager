import { Profile } from "@/generated/prisma";
import { useProfilesContext } from "./ProfilesContext";

export function useProfileMutations() {
  const { profiles, mutateProfiles } = useProfilesContext();

  const createProfile = async () => {
    const response = await fetch("/api/profiles", {
      method: "POST",
    });
    const profile: Profile = await response.json();
    mutateProfiles([...profiles, profile], { revalidate: false });
  };

  const duplicateProfile = async (profile: Profile) => {
    const response = await fetch(`/api/profiles/${profile.pid}/duplicate`, {
      method: "POST",
    });
    const duplicatedProfile: Profile = await response.json();
    mutateProfiles([...profiles, duplicatedProfile], { revalidate: false });
  };

  const deleteProfile = async (profile: Profile) => {
    // TODO: Show confirmation modal.
    mutateProfiles(
      profiles.filter((p) => p.id !== profile.id),
      { revalidate: false }
    );
    const response = await fetch(`/api/profiles/${profile.pid}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      mutateProfiles(profiles, { revalidate: true });
    }
  };

  return {
    createProfile,
    duplicateProfile,
    deleteProfile,
  };
}
