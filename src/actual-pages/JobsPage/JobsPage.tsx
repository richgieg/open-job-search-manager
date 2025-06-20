import { MainContent } from "./MainContent";
import Head from "next/head";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import useSWR from "swr";
import { JobsWithLinksProvider } from "./JobsWithLinksContext";
import { Header, MetaNoIndex } from "@/components";
import type { JobWithLinks } from "@/types";

export function JobsPage() {
  const user = useAuthRedirect();

  const { data: jobsWithLinks, mutate: mutateJobsWithLinks } = useSWR(
    user ? "/api/jobs/withLinks" : null,
    async (url) => {
      const response = await fetch(url);
      const responseData = await response.json();
      return responseData as JobWithLinks[];
    }
  );

  return (
    <>
      <MetaNoIndex />
      <Head>
        <title>Jobs - Open Job Search Manager</title>
      </Head>
      <Header />
      {jobsWithLinks && (
        <JobsWithLinksProvider
          jobsWithLinks={jobsWithLinks}
          mutateJobsWithLinks={mutateJobsWithLinks}
        >
          <MainContent />
        </JobsWithLinksProvider>
      )}
    </>
  );
}
