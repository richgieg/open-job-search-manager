import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MainContent } from "./MainContent";
import Head from "next/head";
import { t } from "@/translate";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import useSWR from "swr";
import { Header, MetaNoIndex } from "@/components";
import { FullResumeProvider } from "./FullResumeContext";
import type { FullJob, FullResume } from "@/types";

export function ResumePage() {
  const user = useAuthRedirect();
  const router = useRouter();
  const [resumePid, setResumePid] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    setResumePid(router.query.resumePid as string);
  }, [router]);

  const { data: fullResume, mutate: mutateFullResume } = useSWR(
    user && resumePid ? `/api/resumes/${resumePid}/full` : null,
    async (url) => {
      const response = await fetch(url);
      const responseData = await response.json();
      return responseData as FullResume;
    }
  );

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
        <FullResumeProvider
          fullResume={fullResume}
          mutateFullResume={mutateFullResume}
        >
          <MainContent fullJob={fullJob} />
        </FullResumeProvider>
      )}
    </>
  );
}
