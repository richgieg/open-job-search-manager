import { FormEvent } from "react";
import { ProfileOverview } from "./ProfileOverview";
import { SectionHeading } from "@/components/SectionHeading";
import { Profile } from "@/generated/prisma";
import { KeyedMutator } from "swr";

type Props = {
  profiles: Profile[];
  mutateProfiles: KeyedMutator<Profile[]>;
};

export function MainContent({ profiles, mutateProfiles }: Props) {
  const createProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  return (
    <div className="px-8 pb-28">
      <SectionHeading text="Profiles" />
      <div className="mt-6 flex flex-col gap-6">
        {profiles.length > 0 && (
          <div className="flex flex-col gap-4">
            {profiles.map((p) => (
              <ProfileOverview
                key={p.id}
                profile={p}
                deleteProfile={deleteProfile}
                duplicateProfile={duplicateProfile}
              />
            ))}
          </div>
        )}
        <form onSubmit={createProfile}>
          <button type="submit">New Profile</button>
        </form>
      </div>
    </div>
  );
}
