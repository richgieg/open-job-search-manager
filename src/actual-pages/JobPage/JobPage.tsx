import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MainContent } from "./MainContent";
import Head from "next/head";
import { t } from "@/translate";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import useSWR from "swr";
import { FullJobProvider } from "./FullJobContext";
import { Header, MetaNoIndex } from "@/components";
import { Profile } from "@/generated/prisma";
import type { FullJob } from "@/types";

export function JobPage() {
  const user = useAuthRedirect();
  const router = useRouter();
  const [jobPid, setJobPid] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    setJobPid(router.query.jobPid as string);
  }, [router]);

  const { data: fullJob, mutate: mutateFullJob } = useSWR(
    user && jobPid ? `/api/jobs/${jobPid}/full` : null,
    async (url) => {
      const response = await fetch(url);
      const responseData = await response.json();
      return responseData as FullJob;
    }
  );

  const { data: profiles } = useSWR(
    user ? "/api/profiles" : null,
    async (url) => {
      const response = await fetch(url);
      const responseData = await response.json();
      return responseData as Profile[];
    }
  );

  return (
    <>
      <MetaNoIndex />
      <Head>
        {fullJob && (
          <title>
            {fullJob.title || t.jobTitlePlaceholder}{" "}
            {fullJob.company ? `at ${fullJob.company}` : ""} -{" "}
            {"Jobs - Open Job Search Manager"}
          </title>
        )}
        {!fullJob && <title>Loading Job... - Open Job Search Manager</title>}
      </Head>
      <Header />
      {fullJob && profiles && (
        <FullJobProvider fullJob={fullJob} mutateFullJob={mutateFullJob}>
          <MainContent profiles={profiles} />
        </FullJobProvider>
      )}
    </>
  );
}
