import { Job } from "@/generated/prisma";
import { useFullJobContext } from "../FullJobContext";

export function useJobMutations() {
  const { fullJob, mutateFullJob } = useFullJobContext();

  const updateJob = async (job: Job) => {
    mutateFullJob({ ...fullJob, ...job }, { revalidate: false });
    const response = await fetch(`/api/jobs/${job.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });
    if (!response.ok) {
      mutateFullJob(fullJob, { revalidate: true });
    }
  };

  return { updateJob };
}
