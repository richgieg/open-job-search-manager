import { Job, Link } from "@/generated/prisma";
import { createContext, ReactNode, useContext } from "react";
import { KeyedMutator } from "swr";

type JobWithLinks = Job & { links: Link[] };

const JobsWithLinksContext = createContext<{
  jobsWithLinks: JobWithLinks[];
  mutateJobsWithLinks: KeyedMutator<JobWithLinks[]>;
} | null>(null);

type Props = {
  jobsWithLinks: JobWithLinks[];
  mutateJobsWithLinks: KeyedMutator<JobWithLinks[]>;
  children?: ReactNode;
};

export const JobsWithLinksProvider = ({
  jobsWithLinks,
  mutateJobsWithLinks,
  children,
}: Props) => (
  <JobsWithLinksContext.Provider value={{ jobsWithLinks, mutateJobsWithLinks }}>
    {children}
  </JobsWithLinksContext.Provider>
);

export const useJobsWithLinksContext = () => {
  const ctx = useContext(JobsWithLinksContext);
  if (!ctx) {
    throw new Error(
      "useJobsWithLinksContext must be used within JobsWithLinksProvider"
    );
  }
  return ctx;
};
