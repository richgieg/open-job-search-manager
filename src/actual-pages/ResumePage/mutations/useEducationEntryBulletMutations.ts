import { ResumeEducationEntryBullet } from "@/generated/prisma";
import { useFullResumeContext } from "../FullResumeContext";

export function useEducationEntryBulletMutations() {
  const { fullResume, mutateFullResume } = useFullResumeContext();

  const createEducationEntryBullet = async (educationEntryPid: string) => {
    const response = await fetch(
      `/api/resumeEducationEntries/${educationEntryPid}/bullets`,
      {
        method: "POST",
      }
    );
    const educationEntryBullet: ResumeEducationEntryBullet =
      await response.json();
    mutateFullResume(
      {
        ...fullResume,
        educationEntries: [
          ...fullResume.educationEntries.map((educationEntry) => {
            if (educationEntry.pid === educationEntryPid) {
              return {
                ...educationEntry,
                bullets: [...educationEntry.bullets, educationEntryBullet],
              };
            } else {
              return educationEntry;
            }
          }),
        ],
      },
      { revalidate: false }
    );
  };

  const updateEducationEntryBullet = async (
    educationEntryBullet: ResumeEducationEntryBullet
  ) => {
    mutateFullResume(
      {
        ...fullResume,
        educationEntries: fullResume.educationEntries.map((educationEntry) => {
          if (educationEntry.id === educationEntryBullet.educationEntryId) {
            return {
              ...educationEntry,
              bullets: educationEntry.bullets.map((b) => {
                if (b.id === educationEntryBullet.id) {
                  return educationEntryBullet;
                } else {
                  return b;
                }
              }),
            };
          } else {
            return educationEntry;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(
      `/api/resumeEducationEntryBullets/${educationEntryBullet.pid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(educationEntryBullet),
      }
    );
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  const deleteEducationEntryBullet = async (
    educationEntryBullet: ResumeEducationEntryBullet
  ) => {
    mutateFullResume(
      {
        ...fullResume,
        educationEntries: fullResume.educationEntries.map((educationEntry) => {
          if (educationEntry.id === educationEntryBullet.educationEntryId) {
            return {
              ...educationEntry,
              bullets: educationEntry.bullets.filter(
                (b) => b.id !== educationEntryBullet.id
              ),
            };
          } else {
            return educationEntry;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(
      `/api/resumeEducationEntryBullets/${educationEntryBullet.pid}`,
      { method: "DELETE" }
    );
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  const moveEducationEntryBulletUp = async (
    educationEntryBullet: ResumeEducationEntryBullet
  ) => {
    const educationEntry = fullResume.educationEntries.find(
      (item) => item.id === educationEntryBullet.educationEntryId
    );
    if (!educationEntry) return;
    const bullets = [...educationEntry.bullets];
    const index = bullets.findIndex(
      (item) => item.id === educationEntryBullet.id
    );
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
        educationEntries: fullResume.educationEntries.map((e) => {
          if (e.id === educationEntry.id) {
            return { ...e, bullets };
          }
          return e;
        }),
      },
      { revalidate: false }
    );
    const orderedPids = bullets.map((item) => item.pid);
    const response = await fetch(
      `/api/resumeEducationEntries/${educationEntry.pid}/bullets/order`,
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

  const moveEducationEntryBulletDown = async (
    educationEntryBullet: ResumeEducationEntryBullet
  ) => {
    const educationEntry = fullResume.educationEntries.find(
      (item) => item.id === educationEntryBullet.educationEntryId
    );
    if (!educationEntry) return;
    const bullets = [...educationEntry.bullets];
    const index = bullets.findIndex(
      (item) => item.id === educationEntryBullet.id
    );
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
        educationEntries: fullResume.educationEntries.map((e) => {
          if (e.id === educationEntry.id) {
            return { ...e, bullets };
          }
          return e;
        }),
      },
      { revalidate: false }
    );
    const orderedPids = bullets.map((item) => item.pid);
    const response = await fetch(
      `/api/resumeEducationEntries/${educationEntry.pid}/bullets/order`,
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
    createEducationEntryBullet,
    updateEducationEntryBullet,
    deleteEducationEntryBullet,
    moveEducationEntryBulletUp,
    moveEducationEntryBulletDown,
  };
}
