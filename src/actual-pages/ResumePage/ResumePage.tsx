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
  const router = useRouter();
  const [resumePid, setResumePid] = useState<string | null>(null);
  const [fullResume, setFullResume] = useState<FullResume | null>(null);
  const [fullJob, setFullJob] = useState<FullJob | null>(null);

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

  useEffect(() => {
    if (fullResume?.job.pid === undefined) return;
    const fetchFullJob = async () => {
      const response = await fetch(`/api/jobs/${fullResume.job.pid}/full`);
      const responseData = await response.json();
      setFullJob(responseData);
    };
    fetchFullJob();
  }, [fullResume?.job.pid]);

  return (
    <>
      <Head>
        {fullResume && (
          <title>
            {fullResume.resumeName || t.resumeNamePlaceholder} Resume -{" "}
            {"Open Job Search Manager"}
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
