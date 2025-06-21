import { DeleteButton } from "@/components/DeleteButton";
import { DuplicateButton } from "@/components/DuplicateButton";
import { Profile } from "@/generated/prisma";
import { t } from "@/translate";
import Link from "next/link";

type Props = {
  profile: Profile;
  deleteProfile: (profile: Profile) => Promise<void>;
  duplicateProfile: (profile: Profile) => Promise<void>;
};

export function ProfileEditor({
  profile,
  deleteProfile,
  duplicateProfile,
}: Props) {
  return (
    <div className="flex gap-2">
      <Link href={`/profiles/${profile.pid}`}>
        {profile.profileName || t.profileNamePlaceholder}
      </Link>
      <DuplicateButton
        className="w-12"
        onClick={() => duplicateProfile(profile)}
      />
      <DeleteButton className="w-12" onClick={() => deleteProfile(profile)} />
    </div>
  );
}
