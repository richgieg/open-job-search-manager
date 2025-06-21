import { WorkEntryBullet } from "@/generated/prisma";
import { useFullProfileContext } from "../FullProfileContext";

export function useWorkEntryBulletMutations() {
  const { fullProfile, mutateFullProfile } = useFullProfileContext();

  const createWorkEntryBullet = async (workEntryPid: string) => {
    const response = await fetch(`/api/workEntries/${workEntryPid}/bullets`, {
      method: "POST",
    });
    const workEntryBullet: WorkEntryBullet = await response.json();
    mutateFullProfile(
      {
        ...fullProfile,
        workEntries: [
          ...fullProfile.workEntries.map((workEntry) => {
            if (workEntry.pid === workEntryPid) {
              return {
                ...workEntry,
                bullets: [...workEntry.bullets, workEntryBullet],
              };
            } else {
              return workEntry;
            }
          }),
        ],
      },
      { revalidate: false }
    );
  };

  const updateWorkEntryBullet = async (workEntryBullet: WorkEntryBullet) => {
    mutateFullProfile(
      {
        ...fullProfile,
        workEntries: fullProfile.workEntries.map((workEntry) => {
          if (workEntry.id === workEntryBullet.workEntryId) {
            return {
              ...workEntry,
              bullets: workEntry.bullets.map((b) => {
                if (b.id === workEntryBullet.id) {
                  return workEntryBullet;
                } else {
                  return b;
                }
              }),
            };
          } else {
            return workEntry;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(
      `/api/workEntryBullets/${workEntryBullet.pid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workEntryBullet),
      }
    );
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const deleteWorkEntryBullet = async (workEntryBullet: WorkEntryBullet) => {
    mutateFullProfile(
      {
        ...fullProfile,
        workEntries: fullProfile.workEntries.map((workEntry) => {
          if (workEntry.id === workEntryBullet.workEntryId) {
            return {
              ...workEntry,
              bullets: workEntry.bullets.filter(
                (b) => b.id !== workEntryBullet.id
              ),
            };
          } else {
            return workEntry;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(
      `/api/workEntryBullets/${workEntryBullet.pid}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const moveWorkEntryBulletUp = async (workEntryBullet: WorkEntryBullet) => {
    const workEntry = fullProfile.workEntries.find(
      (item) => item.id === workEntryBullet.workEntryId
    );
    if (!workEntry) return;
    const bullets = [...workEntry.bullets];
    const index = bullets.findIndex((item) => item.id === workEntryBullet.id);
    if (index > 0) {
      const swapIndex = index - 1;
      [bullets[index], bullets[swapIndex]] = [
        bullets[swapIndex],
        bullets[index],
      ];
    } else {
      bullets.push(bullets.shift()!);
    }
    mutateFullProfile(
      {
        ...fullProfile,
        workEntries: fullProfile.workEntries.map((w) => {
          if (w.id === workEntry.id) {
            return { ...w, bullets };
          }
          return w;
        }),
      },
      { revalidate: false }
    );
    const orderedPids = bullets.map((item) => item.pid);
    const response = await fetch(
      `/api/workEntries/${workEntry.pid}/bullets/order`,
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

  const moveWorkEntryBulletDown = async (workEntryBullet: WorkEntryBullet) => {
    const workEntry = fullProfile.workEntries.find(
      (item) => item.id === workEntryBullet.workEntryId
    );
    if (!workEntry) return;
    const bullets = [...workEntry.bullets];
    const index = bullets.findIndex((item) => item.id === workEntryBullet.id);
    if (index < bullets.length - 1) {
      const swapIndex = index + 1;
      [bullets[index], bullets[swapIndex]] = [
        bullets[swapIndex],
        bullets[index],
      ];
    } else {
      bullets.unshift(bullets.pop()!);
    }
    mutateFullProfile(
      {
        ...fullProfile,
        workEntries: fullProfile.workEntries.map((w) => {
          if (w.id === workEntry.id) {
            return { ...w, bullets };
          }
          return w;
        }),
      },
      { revalidate: false }
    );
    const orderedPids = bullets.map((item) => item.pid);
    const response = await fetch(
      `/api/workEntries/${workEntry.pid}/bullets/order`,
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
    createWorkEntryBullet,
    updateWorkEntryBullet,
    deleteWorkEntryBullet,
    moveWorkEntryBulletUp,
    moveWorkEntryBulletDown,
  };
}
