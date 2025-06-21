import { SkillCategory } from "@/generated/prisma";
import { useFullProfileContext } from "../FullProfileContext";

export function useSkillCategoryMutations() {
  const { fullProfile, mutateFullProfile } = useFullProfileContext();

  const createSkillCategory = async () => {
    const response = await fetch(
      `/api/profiles/${fullProfile.pid}/skillCategories`,
      {
        method: "POST",
      }
    );
    const skillCategory: SkillCategory = await response.json();
    mutateFullProfile(
      {
        ...fullProfile,
        skillCategories: [
          ...fullProfile.skillCategories,
          {
            ...skillCategory,
            skills: [],
          },
        ],
      },
      { revalidate: false }
    );
  };

  const updateSkillCategory = async (skillCategory: SkillCategory) => {
    mutateFullProfile(
      {
        ...fullProfile,
        skillCategories: fullProfile.skillCategories.map((s) => {
          if (s.id === skillCategory.id) {
            return { ...s, ...skillCategory };
          } else {
            return s;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/skillCategories/${skillCategory.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skillCategory),
    });
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const deleteSkillCategory = async (skillCategory: SkillCategory) => {
    mutateFullProfile(
      {
        ...fullProfile,
        skillCategories: fullProfile.skillCategories.filter(
          (s) => s.id !== skillCategory.id
        ),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/skillCategories/${skillCategory.pid}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const moveSkillCategoryUp = async (skillCategory: SkillCategory) => {
    const skillCategories = [...fullProfile.skillCategories];
    const index = skillCategories.findIndex(
      (item) => item.id === skillCategory.id
    );
    if (index > 0) {
      const swapIndex = index - 1;
      [skillCategories[index], skillCategories[swapIndex]] = [
        skillCategories[swapIndex],
        skillCategories[index],
      ];
    } else {
      skillCategories.push(skillCategories.shift()!);
    }
    mutateFullProfile(
      { ...fullProfile, skillCategories },
      { revalidate: false }
    );
    const orderedPids = skillCategories.map((item) => item.pid);
    const response = await fetch(
      `/api/profiles/${fullProfile.pid}/skillCategories/order`,
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

  const moveSkillCategoryDown = async (skillCategory: SkillCategory) => {
    const skillCategories = [...fullProfile.skillCategories];
    const index = skillCategories.findIndex(
      (item) => item.id === skillCategory.id
    );
    if (index < skillCategories.length - 1) {
      const swapIndex = index + 1;
      [skillCategories[index], skillCategories[swapIndex]] = [
        skillCategories[swapIndex],
        skillCategories[index],
      ];
    } else {
      skillCategories.unshift(skillCategories.pop()!);
    }
    mutateFullProfile(
      { ...fullProfile, skillCategories },
      { revalidate: false }
    );
    const orderedPids = skillCategories.map((item) => item.pid);
    const response = await fetch(
      `/api/profiles/${fullProfile.pid}/skillCategories/order`,
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
    createSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    moveSkillCategoryUp,
    moveSkillCategoryDown,
  };
}
