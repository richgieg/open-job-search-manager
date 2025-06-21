import { WorkEntry } from "@/generated/prisma";
import { useFullProfileContext } from "./FullProfileContext";

export function useWorkEntryMutations() {
  const { fullProfile, mutateFullProfile } = useFullProfileContext();

  const createWorkEntry = async () => {
    const response = await fetch(
      `/api/profiles/${fullProfile.pid}/workEntries`,
      {
        method: "POST",
      }
    );
    const workEntry: WorkEntry = await response.json();
    mutateFullProfile(
      {
        ...fullProfile,
        workEntries: [
          ...fullProfile.workEntries,
          {
            ...workEntry,
            bullets: [],
          },
        ],
      },
      { revalidate: false }
    );
  };

  const updateWorkEntry = async (workEntry: WorkEntry) => {
    mutateFullProfile(
      {
        ...fullProfile,
        workEntries: fullProfile.workEntries.map((w) => {
          if (w.id === workEntry.id) {
            return { ...w, ...workEntry };
          } else {
            return w;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/workEntries/${workEntry.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workEntry),
    });
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const deleteWorkEntry = async (workEntry: WorkEntry) => {
    mutateFullProfile(
      {
        ...fullProfile,
        workEntries: fullProfile.workEntries.filter(
          (w) => w.id !== workEntry.id
        ),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/workEntries/${workEntry.pid}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const moveWorkEntryUp = async (workEntry: WorkEntry) => {
    const workEntries = [...fullProfile.workEntries];
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
    mutateFullProfile({ ...fullProfile, workEntries }, { revalidate: false });
    const orderedPids = workEntries.map((item) => item.pid);
    const response = await fetch(
      `/api/profiles/${fullProfile.pid}/workEntries/order`,
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

  const moveWorkEntryDown = async (workEntry: WorkEntry) => {
    const workEntries = [...fullProfile.workEntries];
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
    mutateFullProfile({ ...fullProfile, workEntries }, { revalidate: false });
    const orderedPids = workEntries.map((item) => item.pid);
    const response = await fetch(
      `/api/profiles/${fullProfile.pid}/workEntries/order`,
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
    createWorkEntry,
    updateWorkEntry,
    deleteWorkEntry,
    moveWorkEntryUp,
    moveWorkEntryDown,
  };
}
