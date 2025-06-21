import { ResumeWorkEntryBullet } from "@/generated/prisma";
import { useFullResumeContext } from "../FullResumeContext";

export function useWorkEntryBulletMutations() {
  const { fullResume, mutateFullResume } = useFullResumeContext();

  const createWorkEntryBullet = async (workEntryPid: string) => {
    const response = await fetch(
      `/api/resumeWorkEntries/${workEntryPid}/bullets`,
      {
        method: "POST",
      }
    );
    const workEntryBullet: ResumeWorkEntryBullet = await response.json();
    mutateFullResume(
      {
        ...fullResume,
        workEntries: [
          ...fullResume.workEntries.map((workEntry) => {
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

  const updateWorkEntryBullet = async (
    workEntryBullet: ResumeWorkEntryBullet
  ) => {
    mutateFullResume(
      {
        ...fullResume,
        workEntries: fullResume.workEntries.map((workEntry) => {
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
      `/api/resumeWorkEntryBullets/${workEntryBullet.pid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workEntryBullet),
      }
    );
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  const deleteWorkEntryBullet = async (
    workEntryBullet: ResumeWorkEntryBullet
  ) => {
    mutateFullResume(
      {
        ...fullResume,
        workEntries: fullResume.workEntries.map((workEntry) => {
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
      `/api/resumeWorkEntryBullets/${workEntryBullet.pid}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  const moveWorkEntryBulletUp = async (
    workEntryBullet: ResumeWorkEntryBullet
  ) => {
    const workEntry = fullResume.workEntries.find(
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
    mutateFullResume(
      {
        ...fullResume,
        workEntries: fullResume.workEntries.map((w) => {
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
      `/api/resumeWorkEntries/${workEntry.pid}/bullets/order`,
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

  const moveWorkEntryBulletDown = async (
    workEntryBullet: ResumeWorkEntryBullet
  ) => {
    const workEntry = fullResume.workEntries.find(
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
    mutateFullResume(
      {
        ...fullResume,
        workEntries: fullResume.workEntries.map((w) => {
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
      `/api/resumeWorkEntries/${workEntry.pid}/bullets/order`,
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
    createWorkEntryBullet,
    updateWorkEntryBullet,
    deleteWorkEntryBullet,
    moveWorkEntryBulletUp,
    moveWorkEntryBulletDown,
  };
}
