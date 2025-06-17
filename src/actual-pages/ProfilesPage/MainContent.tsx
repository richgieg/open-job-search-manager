import { FormEvent } from "react";
import { ProfileOverview } from "./ProfileOverview";
import { SectionHeading } from "@/components/SectionHeading";
import { t } from "@/translate";
import { Profile } from "@/generated/prisma";

type Props = {
  profiles: Profile[];
  setProfiles: (profiles: Profile[]) => void;
};

export function MainContent({ profiles, setProfiles }: Props) {
  const createProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/profiles", {
      method: "POST",
    });
    const profile: Profile = await response.json();
    setProfiles([...profiles, profile]);
  };

  const duplicateProfile = async (profile: Profile) => {
    const response = await fetch(`/api/profiles/${profile.pid}/duplicate`, {
      method: "POST",
    });
    const duplicatedProfile: Profile = await response.json();
    setProfiles([...profiles, duplicatedProfile]);
  };

  const deleteProfile = async (profile: Profile) => {
    if (
      !confirm(
        `"${
          profile.profileName || t.profileNamePlaceholder
        }" will be deleted. Continue?`
      )
    )
      return;
    await fetch(`/api/profiles/${profile.pid}`, {
      method: "DELETE",
    });
    setProfiles(profiles.filter((p) => p.id !== profile.id));
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
