import { EducationEntryBullet } from "@/generated/prisma";
import { useFullProfileContext } from "./FullProfileContext";

export function useEducationEntryBulletMutations() {
  const { fullProfile, mutateFullProfile } = useFullProfileContext();

  const createEducationEntryBullet = async (educationEntryPid: string) => {
    const response = await fetch(
      `/api/educationEntries/${educationEntryPid}/bullets`,
      {
        method: "POST",
      }
    );
    const educationEntryBullet: EducationEntryBullet = await response.json();
    mutateFullProfile(
      {
        ...fullProfile,
        educationEntries: [
          ...fullProfile.educationEntries.map((educationEntry) => {
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
    educationEntryBullet: EducationEntryBullet
  ) => {
    mutateFullProfile(
      {
        ...fullProfile,
        educationEntries: fullProfile.educationEntries.map((educationEntry) => {
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
      `/api/educationEntryBullets/${educationEntryBullet.pid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(educationEntryBullet),
      }
    );
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const deleteEducationEntryBullet = async (
    educationEntryBullet: EducationEntryBullet
  ) => {
    mutateFullProfile(
      {
        ...fullProfile,
        educationEntries: fullProfile.educationEntries.map((educationEntry) => {
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
      `/api/educationEntryBullets/${educationEntryBullet.pid}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const moveEducationEntryBulletUp = async (
    educationEntryBullet: EducationEntryBullet
  ) => {
    const educationEntry = fullProfile.educationEntries.find(
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
    mutateFullProfile(
      {
        ...fullProfile,
        educationEntries: fullProfile.educationEntries.map((e) => {
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
      `/api/educationEntries/${educationEntry.pid}/bullets/order`,
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

  const moveEducationEntryBulletDown = async (
    educationEntryBullet: EducationEntryBullet
  ) => {
    const educationEntry = fullProfile.educationEntries.find(
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
    mutateFullProfile(
      {
        ...fullProfile,
        educationEntries: fullProfile.educationEntries.map((e) => {
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
      `/api/educationEntries/${educationEntry.pid}/bullets/order`,
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
    createEducationEntryBullet,
    updateEducationEntryBullet,
    deleteEducationEntryBullet,
    moveEducationEntryBulletUp,
    moveEducationEntryBulletDown,
  };
}
