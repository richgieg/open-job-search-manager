import { FormEvent } from "react";
import { ProfileEditor } from "./ProfileEditor";
import { SectionHeading } from "@/components/SectionHeading";
import { useProfilesContext } from "./ProfilesContext";
import { useProfileMutations } from "./useProfileMutations";

export function MainContent() {
  const { profiles } = useProfilesContext();
  const { createProfile, duplicateProfile, deleteProfile } =
    useProfileMutations();

  const handleCreateProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createProfile();
  };

  return (
    <div className="px-8 pb-28">
      <SectionHeading text="Profiles" />
      <div className="mt-6 flex flex-col gap-6">
        {profiles.length > 0 && (
          <div className="flex flex-col gap-4">
            {profiles.map((p) => (
              <ProfileEditor
                key={p.id}
                profile={p}
                deleteProfile={deleteProfile}
                duplicateProfile={duplicateProfile}
              />
            ))}
          </div>
        )}
        <form onSubmit={handleCreateProfile}>
          <button type="submit">New Profile</button>
        </form>
      </div>
    </div>
  );
}
