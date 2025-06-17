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

type FullJob = Job & {
  resumes: Resume[];
  links: Link[];
  contacts: Contact[];
  applicationQuestions: ApplicationQuestion[];
};

export function JobPage() {
  const router = useRouter();
  const [jobPid, setJobPid] = useState<string | null>(null);
  const [fullJob, setFullJob] = useState<FullJob | null>(null);
  const [profiles, setProfiles] = useState<Profile[] | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    setJobPid(router.query.jobPid as string);
  }, [router]);

  useEffect(() => {
    if (!jobPid) return;
    const fetchFullJob = async () => {
      const response = await fetch(`/api/jobs/${jobPid}/full`);
      const responseData: FullJob = await response.json();
      setFullJob(responseData);
    };
    fetchFullJob();
  }, [jobPid]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const response = await fetch(`/api/profiles`);
      const profiles: Profile[] = await response.json();
      setProfiles(profiles);
    };
    fetchProfiles();
  }, []);

  return (
    <>
      <Header />
      {fullJob && profiles && (
        <MainContent
          fullJob={fullJob}
          setFullJob={setFullJob}
          profiles={profiles}
        />
      )}
    </>
  );
}
