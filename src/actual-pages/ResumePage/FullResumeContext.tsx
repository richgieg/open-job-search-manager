import {
  Job,
  Profile,
  Resume,
  ResumeCertification,
  ResumeEducationEntry,
  ResumeEducationEntryBullet,
  ResumeSkill,
  ResumeSkillCategory,
  ResumeWorkEntry,
  ResumeWorkEntryBullet,
} from "@/generated/prisma";
import { createContext, ReactNode, useContext } from "react";
import { KeyedMutator } from "swr";

type FullResume = Resume & {
  workEntries: (ResumeWorkEntry & { bullets: ResumeWorkEntryBullet[] })[];
  educationEntries: (ResumeEducationEntry & {
    bullets: ResumeEducationEntryBullet[];
  })[];
  certifications: ResumeCertification[];
  skillCategories: (ResumeSkillCategory & { skills: ResumeSkill[] })[];
  profile: Profile | null;
  job: Job;
};

const FullResumeContext = createContext<{
  fullResume: FullResume;
  mutateFullResume: KeyedMutator<FullResume>;
} | null>(null);

type Props = {
  fullResume: FullResume;
  mutateFullResume: KeyedMutator<FullResume>;
  children?: ReactNode;
};

export const FullResumeProvider = ({
  fullResume,
  mutateFullResume,
  children,
}: Props) => (
  <FullResumeContext.Provider value={{ fullResume, mutateFullResume }}>
    {children}
  </FullResumeContext.Provider>
);

export const useFullResumeContext = () => {
  const ctx = useContext(FullResumeContext);
  if (!ctx) {
    throw new Error(
      "useFullResumeContext must be used within FullResumeProvider"
    );
  }
  return ctx;
};
