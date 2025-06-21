import { ResumeWorkEntry } from "@/generated/prisma";
import { useFullResumeContext } from "../FullResumeContext";

export function useWorkEntryMutations() {
  const { fullResume, mutateFullResume } = useFullResumeContext();

  const createWorkEntry = async () => {
    const response = await fetch(`/api/resumes/${fullResume.pid}/workEntries`, {
      method: "POST",
    });
    const workEntry: ResumeWorkEntry = await response.json();
    mutateFullResume(
      {
        ...fullResume,
        workEntries: [
          ...fullResume.workEntries,
          {
            ...workEntry,
            bullets: [],
          },
        ],
      },
      { revalidate: false }
    );
  };

  const updateWorkEntry = async (workEntry: ResumeWorkEntry) => {
    mutateFullResume(
      {
        ...fullResume,
        workEntries: fullResume.workEntries.map((w) => {
          if (w.id === workEntry.id) {
            return { ...w, ...workEntry };
          } else {
            return w;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/resumeWorkEntries/${workEntry.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workEntry),
    });
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  const deleteWorkEntry = async (workEntry: ResumeWorkEntry) => {
    mutateFullResume(
      {
        ...fullResume,
        workEntries: fullResume.workEntries.filter(
          (w) => w.id !== workEntry.id
        ),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/resumeWorkEntries/${workEntry.pid}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  const moveWorkEntryUp = async (workEntry: ResumeWorkEntry) => {
    const workEntries = [...fullResume.workEntries];
    const index = workEntries.findIndex((item) => item.id === workEntry.id);
    if (index > 0) {
      const swapIndex = index - 1;
      [workEntries[index], workEntries[swapIndex]] = [
        workEntries[swapIndex],
        workEntries[index],
      ];
    } else {
      workEntries.push(workEntries.shift()!);
    }
    mutateFullResume({ ...fullResume, workEntries }, { revalidate: false });
    const orderedPids = workEntries.map((item) => item.pid);
    const response = await fetch(
      `/api/resumes/${fullResume.pid}/workEntries/order`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedPids }),
      }
    );
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  const moveWorkEntryDown = async (workEntry: ResumeWorkEntry) => {
    const workEntries = [...fullResume.workEntries];
    const index = workEntries.findIndex((item) => item.id === workEntry.id);
    if (index < workEntries.length - 1) {
      const swapIndex = index + 1;
      [workEntries[index], workEntries[swapIndex]] = [
        workEntries[swapIndex],
        workEntries[index],
      ];
    } else {
      workEntries.unshift(workEntries.pop()!);
    }
    mutateFullResume({ ...fullResume, workEntries }, { revalidate: false });
    const orderedPids = workEntries.map((item) => item.pid);
    const response = await fetch(
      `/api/resumes/${fullResume.pid}/workEntries/order`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedPids }),
      }
    );
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  return {
    createWorkEntry,
    updateWorkEntry,
    deleteWorkEntry,
    moveWorkEntryUp,
    moveWorkEntryDown,
  };
}
