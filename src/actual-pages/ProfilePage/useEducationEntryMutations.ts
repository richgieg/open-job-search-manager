import { EducationEntry } from "@/generated/prisma";
import { useFullProfileContext } from "./FullProfileContext";

export function useEducationEntryMutations() {
  const { fullProfile, mutateFullProfile } = useFullProfileContext();

  const createEducationEntry = async () => {
    const response = await fetch(
      `/api/profiles/${fullProfile.pid}/educationEntries`,
      {
        method: "POST",
      }
    );
    const educationEntry: EducationEntry = await response.json();
    mutateFullProfile(
      {
        ...fullProfile,
        educationEntries: [
          ...fullProfile.educationEntries,
          {
            ...educationEntry,
            bullets: [],
          },
        ],
      },
      { revalidate: false }
    );
  };

  const updateEducationEntry = async (educationEntry: EducationEntry) => {
    mutateFullProfile(
      {
        ...fullProfile,
        educationEntries: fullProfile.educationEntries.map((e) => {
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
      `/api/educationEntries/${educationEntry.pid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(educationEntry),
      }
    );
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const deleteEducationEntry = async (educationEntry: EducationEntry) => {
    mutateFullProfile(
      {
        ...fullProfile,
        educationEntries: fullProfile.educationEntries.filter(
          (e) => e.id !== educationEntry.id
        ),
      },
      { revalidate: false }
    );
    const response = await fetch(
      `/api/educationEntries/${educationEntry.pid}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const moveEducationEntryUp = async (educationEntry: EducationEntry) => {
    const educationEntries = [...fullProfile.educationEntries];
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
    mutateFullProfile(
      { ...fullProfile, educationEntries },
      { revalidate: false }
    );
    const orderedPids = educationEntries.map((item) => item.pid);
    const response = await fetch(
      `/api/profiles/${fullProfile.pid}/educationEntries/order`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedPids }),
      }
    );
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const moveEducationEntryDown = async (educationEntry: EducationEntry) => {
    const educationEntries = [...fullProfile.educationEntries];
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
    mutateFullProfile(
      { ...fullProfile, educationEntries },
      { revalidate: false }
    );
    const orderedPids = educationEntries.map((item) => item.pid);
    const response = await fetch(
      `/api/profiles/${fullProfile.pid}/educationEntries/order`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedPids }),
      }
    );
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
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
