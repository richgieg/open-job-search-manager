import { ResumeEducationEntry } from "@/generated/prisma";
import { useFullResumeContext } from "../FullResumeContext";

export function useEducationEntryMutations() {
  const { fullResume, mutateFullResume } = useFullResumeContext();

  const createEducationEntry = async () => {
    const response = await fetch(
      `/api/resumes/${fullResume.pid}/educationEntries`,
      {
        method: "POST",
      }
    );
    const educationEntry: ResumeEducationEntry = await response.json();
    mutateFullResume(
      {
        ...fullResume,
        educationEntries: [
          ...fullResume.educationEntries,
          {
            ...educationEntry,
            bullets: [],
          },
        ],
      },
      { revalidate: false }
    );
  };

  const updateEducationEntry = async (educationEntry: ResumeEducationEntry) => {
    mutateFullResume(
      {
        ...fullResume,
        educationEntries: fullResume.educationEntries.map((e) => {
          if (e.id === educationEntry.id) {
            return { ...e, ...educationEntry };
          } else {
            return e;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(
      `/api/resumeEducationEntries/${educationEntry.pid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(educationEntry),
      }
    );
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  const deleteEducationEntry = async (educationEntry: ResumeEducationEntry) => {
    mutateFullResume(
      {
        ...fullResume,
        educationEntries: fullResume.educationEntries.filter(
          (e) => e.id !== educationEntry.id
        ),
      },
      { revalidate: false }
    );
    const response = await fetch(
      `/api/resumeEducationEntries/${educationEntry.pid}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  const moveEducationEntryUp = async (educationEntry: ResumeEducationEntry) => {
    const educationEntries = [...fullResume.educationEntries];
    const index = educationEntries.findIndex(
      (item) => item.id === educationEntry.id
    );
    if (index > 0) {
      const swapIndex = index - 1;
      [educationEntries[index], educationEntries[swapIndex]] = [
        educationEntries[swapIndex],
        educationEntries[index],
      ];
    } else {
      educationEntries.push(educationEntries.shift()!);
    }
    mutateFullResume(
      { ...fullResume, educationEntries },
      { revalidate: false }
    );
    const orderedPids = educationEntries.map((item) => item.pid);
    const response = await fetch(
      `/api/resumes/${fullResume.pid}/educationEntries/order`,
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

  const moveEducationEntryDown = async (
    educationEntry: ResumeEducationEntry
  ) => {
    const educationEntries = [...fullResume.educationEntries];
    const index = educationEntries.findIndex(
      (item) => item.id === educationEntry.id
    );
    if (index < educationEntries.length - 1) {
      const swapIndex = index + 1;
      [educationEntries[index], educationEntries[swapIndex]] = [
        educationEntries[swapIndex],
        educationEntries[index],
      ];
    } else {
      educationEntries.unshift(educationEntries.pop()!);
    }
    mutateFullResume(
      { ...fullResume, educationEntries },
      { revalidate: false }
    );
    const orderedPids = educationEntries.map((item) => item.pid);
    const response = await fetch(
      `/api/resumes/${fullResume.pid}/educationEntries/order`,
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
    createEducationEntry,
    updateEducationEntry,
    deleteEducationEntry,
    moveEducationEntryUp,
    moveEducationEntryDown,
  };
}
