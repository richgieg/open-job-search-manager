import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { MainContent } from "./MainContent";
import {
  ApplicationQuestion,
  Contact,
  Job,
  Link,
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
};

type FullJob = Job & {
  resumes: Resume[];
  links: Link[];
  contacts: Contact[];
  applicationQuestions: ApplicationQuestion[];
};

export function ResumePage() {
  const router = useRouter();
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [fullResume, setFullResume] = useState<FullResume | null>(null);
  const [fullJob, setFullJob] = useState<FullJob | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    setResumeId(router.query.resumeId as string);
  }, [router]);

  useEffect(() => {
    if (!resumeId) return;
    const fetchFullResume = async () => {
      const response = await fetch(`/api/resumes/${resumeId}/full`);
      const responseData = await response.json();
      setFullResume(responseData);
    };
    fetchFullResume();
  }, [resumeId]);

  useEffect(() => {
    if (!fullResume?.jobId) return;
    const fetchFullJob = async () => {
      const response = await fetch(`/api/jobs/${fullResume.jobId}/full`);
      const responseData = await response.json();
      setFullJob(responseData);
    };
    fetchFullJob();
  }, [fullResume?.jobId]);

  return (
    <>
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
