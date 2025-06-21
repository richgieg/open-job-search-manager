import { Resume } from "@/generated/prisma";
import { useFullJobContext } from "./FullJobContext";

export function useResumeMutations() {
  const { fullJob, mutateFullJob } = useFullJobContext();

  const createResume = async (profilePid: string) => {
    const response = await fetch("/api/resumes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobPid: fullJob.pid,
        profilePid,
      }),
    });
    const resume: Resume = await response.json();
    mutateFullJob(
      {
        ...fullJob,
        resumes: [...fullJob.resumes, resume],
      },
      { revalidate: false }
    );
  };

  const duplicateResume = async (resume: Resume) => {
    const response = await fetch(`/api/resumes/${resume.pid}/duplicate`, {
      method: "POST",
    });
    const duplicatedResume: Resume = await response.json();
    mutateFullJob(
      {
        ...fullJob,
        resumes: [...fullJob.resumes, duplicatedResume],
      },
      { revalidate: false }
    );
  };

  const deleteResume = async (resume: Resume) => {
    // TODO: Show confirmation modal.
    mutateFullJob(
      {
        ...fullJob,
        resumes: fullJob.resumes.filter((r) => r.id !== resume.id),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/resumes/${resume.pid}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      mutateFullJob(fullJob, { revalidate: true });
    }
  };

  return {
    createResume,
    duplicateResume,
    deleteResume,
  };
}
