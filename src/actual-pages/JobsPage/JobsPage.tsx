import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { MainContent } from "./MainContent";
import { Job, Link } from "@/generated/prisma";
import Head from "next/head";

type JobWithLinks = Job & { links: Link[] };

export function JobsPage() {
  const [jobsWithLinks, setJobsWithLinks] = useState<JobWithLinks[] | null>(
    null
  );

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch(`/api/jobs/withLinks`);
      const responseData = await response.json();
      setJobsWithLinks(responseData);
    };
    fetchJobs();
  }, []);

  return (
    <>
      <Head>
        <title>Jobs - Open Job Search Manager</title>
      </Head>
      <Header />
      {jobsWithLinks && (
        <MainContent
          jobsWithLinks={jobsWithLinks}
          setJobsWithLinks={setJobsWithLinks}
        />
      )}
    </>
  );
}
