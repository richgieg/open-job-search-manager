import {
  Certification,
  EducationEntry,
  EducationEntryBullet,
  Profile,
  Skill,
  SkillCategory,
  WorkEntry,
  WorkEntryBullet,
} from "@/generated/prisma";
import { createContext, ReactNode, useContext } from "react";
import { KeyedMutator } from "swr";

type FullProfile = Profile & {
  workEntries: (WorkEntry & { bullets: WorkEntryBullet[] })[];
  educationEntries: (EducationEntry & { bullets: EducationEntryBullet[] })[];
  certifications: Certification[];
  skillCategories: (SkillCategory & { skills: Skill[] })[];
};

const FullProfileContext = createContext<{
  fullProfile: FullProfile;
  mutateFullProfile: KeyedMutator<FullProfile>;
} | null>(null);

type Props = {
  fullProfile: FullProfile;
  mutateFullProfile: KeyedMutator<FullProfile>;
  children?: ReactNode;
};

export const FullProfileProvider = ({
  fullProfile,
  mutateFullProfile,
  children,
}: Props) => (
  <FullProfileContext.Provider value={{ fullProfile, mutateFullProfile }}>
    {children}
  </FullProfileContext.Provider>
);

export const useFullProfileContext = () => {
  const ctx = useContext(FullProfileContext);
  if (!ctx) {
    throw new Error(
      "useFullProfileContext must be used within FullProfileContext"
    );
  }
  return ctx;
};
