import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { MainContent } from "./MainContent";
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

export function ApplicationPage() {
  const router = useRouter();
  const [resumePid, setResumePid] = useState<string | null>(null);
  const [fullResume, setFullResume] = useState<FullResume | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    setResumePid(router.query.resumePid as string);
  }, [router]);

  useEffect(() => {
    if (!resumePid) return;
    const fetchFullResume = async () => {
      const response = await fetch(`/api/resumes/${resumePid}/full`);
      const responseData = await response.json();
      setFullResume(responseData);
    };
    fetchFullResume();
  }, [resumePid]);

  return (
    <>
      <Header />
      {fullResume && <MainContent fullResume={fullResume} />}
    </>
  );
}
