import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { MainContent } from "./MainContent";
import {
  ApplicationQuestion,
  Contact,
  Job,
  Link,
  Profile,
  Resume,
} from "@/generated/prisma";
import Head from "next/head";
import { t } from "@/translate";
import MetaNoIndex from "@/components/MetaNoIndex";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import useSWR from "swr";

type FullJob = Job & {
  resumes: Resume[];
  links: Link[];
  contacts: Contact[];
  applicationQuestions: ApplicationQuestion[];
};

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
        <MainContent
          fullJob={fullJob}
          mutateFullJob={mutateFullJob}
          profiles={profiles}
        />
      )}
    </>
  );
}
