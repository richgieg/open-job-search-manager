import { Resume } from "@/generated/prisma";
import { useFullResumeContext } from "../FullResumeContext";

export function useResumeMutations() {
  const { fullResume, mutateFullResume } = useFullResumeContext();

  const updateResume = async (resume: Resume) => {
    mutateFullResume({ ...fullResume, ...resume }, { revalidate: false });
    const response = await fetch(`/api/resumes/${resume.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resume),
    });
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  return { updateResume };
}
