import { Job } from "@/generated/prisma";
import { useJobsWithLinksContext } from "./JobsWithLinksContext";

export function useJobMutations() {
  const { jobsWithLinks, mutateJobsWithLinks } = useJobsWithLinksContext();

  const createJob = async () => {
    const response = await fetch("/api/jobs", {
      method: "POST",
    });
    const job: Job = await response.json();
    mutateJobsWithLinks([{ ...job, links: [] }, ...jobsWithLinks], {
      revalidate: false,
    });
  };

  const deleteJob = async (job: Job) => {
    // TODO: Show confirmation modal.
    mutateJobsWithLinks(
      jobsWithLinks.filter((j) => j.id !== job.id),
      { revalidate: false }
    );
    const response = await fetch(`/api/jobs/${job.pid}`, { method: "DELETE" });
    if (!response.ok) {
      mutateJobsWithLinks(jobsWithLinks, { revalidate: true });
    }
  };

  return { createJob, deleteJob };
}
