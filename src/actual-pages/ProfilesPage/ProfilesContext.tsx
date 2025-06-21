import { Profile } from "@/generated/prisma";
import { createContext, ReactNode, useContext } from "react";
import { KeyedMutator } from "swr";

const ProfilesContext = createContext<{
  profiles: Profile[];
  mutateProfiles: KeyedMutator<Profile[]>;
} | null>(null);

type Props = {
  profiles: Profile[];
  mutateProfiles: KeyedMutator<Profile[]>;
  children?: ReactNode;
};

export const ProfilesProvider = ({
  profiles,
  mutateProfiles,
  children,
}: Props) => (
  <ProfilesContext.Provider value={{ profiles, mutateProfiles }}>
    {children}
  </ProfilesContext.Provider>
);

export const useProfilesContext = () => {
  const ctx = useContext(ProfilesContext);
  if (!ctx) {
    throw new Error("useProfilesContext must be used within ProfilesProvider");
  }
  return ctx;
};
