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
import Head from "next/head";
import { t } from "@/translate";
import MetaNoIndex from "@/components/MetaNoIndex";

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
