import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { MainContent } from "./MainContent";
import {
  ApplicationQuestion,
  Contact,
  Job,
  Link,
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
import MetaNoIndex from "@/components/MetaNoIndex";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import useSWR from "swr";

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

type FullJob = Job & {
  resumes: Resume[];
  links: Link[];
  contacts: Contact[];
  applicationQuestions: ApplicationQuestion[];
};

export function ResumePage() {
  const user = useAuthRedirect();
  const router = useRouter();
  const [resumePid, setResumePid] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    setResumePid(router.query.resumePid as string);
  }, [router]);

  const { data: fullResume, mutate: mutateResume } = useSWR(
    user && resumePid ? `/api/resumes/${resumePid}/full` : null,
    async (url) => {
      const response = await fetch(url);
      const responseData = await response.json();
      return responseData as FullResume;
    }
  );

  const setFullResume = (fullResume: FullResume) =>
    mutateResume(fullResume, false);

  const { data: fullJob } = useSWR(
    user && fullResume?.job.pid ? `/api/jobs/${fullResume.job.pid}/full` : null,
    async (url) => {
      const response = await fetch(url);
      const responseData = await response.json();
      return responseData as FullJob;
    }
  );

  return (
    <>
      <MetaNoIndex />
      <Head>
        {fullResume && (
          <title>
            {fullResume.resumeName || t.resumeNamePlaceholder} -{" "}
            {fullResume.job.title || t.jobTitlePlaceholder}{" "}
            {fullResume.job.company ? `at ${fullResume.job.company}` : ""} -{" "}
            {"Jobs - Open Job Search Manager"}
          </title>
        )}
        {!fullResume && (
          <title>Loading Resume... - Open Job Search Manager</title>
        )}
      </Head>
      <Header />
      {fullResume && fullJob && (
        <MainContent
          fullResume={fullResume}
          setFullResume={setFullResume}
          fullJob={fullJob}
        />
      )}
    </>
  );
}
