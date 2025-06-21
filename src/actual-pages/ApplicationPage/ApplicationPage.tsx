import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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
import Head from "next/head";
import { t } from "@/translate";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import useSWR from "swr";
import { Header, MetaNoIndex } from "@/components";

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
  const user = useAuthRedirect();
  const router = useRouter();
  const [resumePid, setResumePid] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    setResumePid(router.query.resumePid as string);
  }, [router]);

  const { data: fullResume } = useSWR(
    user && resumePid ? `/api/resumes/${resumePid}/full` : null,
    async (url) => {
      const response = await fetch(url);
      const responseData = await response.json();
      return responseData as FullResume;
    }
  );

  return (
    <>
      <MetaNoIndex />
      <Head>
        {fullResume && (
          <title>
            Application ({fullResume.resumeName || t.resumeNamePlaceholder}) -{" "}
            {fullResume.job.title || t.jobTitlePlaceholder}{" "}
            {fullResume.job.company ? `at ${fullResume.job.company}` : ""} -{" "}
            {"Jobs - Open Job Search Manager"}
          </title>
        )}
        {!fullResume && (
          <title>Loading Application... - Open Job Search Manager</title>
        )}
      </Head>
      <Header />
      {fullResume && <MainContent fullResume={fullResume} />}
    </>
  );
}
