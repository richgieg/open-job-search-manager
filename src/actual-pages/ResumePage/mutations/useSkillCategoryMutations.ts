import { ResumeSkillCategory } from "@/generated/prisma";
import { useFullResumeContext } from "../FullResumeContext";

export function useSkillCategoryMutations() {
  const { fullResume, mutateFullResume } = useFullResumeContext();

  const createSkillCategory = async () => {
    const response = await fetch(
      `/api/resumes/${fullResume.pid}/skillCategories`,
      {
        method: "POST",
      }
    );
    const skillCategory: ResumeSkillCategory = await response.json();
    mutateFullResume(
      {
        ...fullResume,
        skillCategories: [
          ...fullResume.skillCategories,
          {
            ...skillCategory,
            skills: [],
          },
        ],
      },
      { revalidate: false }
    );
  };

  const updateSkillCategory = async (skillCategory: ResumeSkillCategory) => {
    mutateFullResume(
      {
        ...fullResume,
        skillCategories: fullResume.skillCategories.map((s) => {
          if (s.id === skillCategory.id) {
            return { ...s, ...skillCategory };
          } else {
            return s;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(
      `/api/resumeSkillCategories/${skillCategory.pid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skillCategory),
      }
    );
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  const deleteSkillCategory = async (skillCategory: ResumeSkillCategory) => {
    mutateFullResume(
      {
        ...fullResume,
        skillCategories: fullResume.skillCategories.filter(
          (s) => s.id !== skillCategory.id
        ),
      },
      { revalidate: false }
    );
    const response = await fetch(
      `/api/resumeSkillCategories/${skillCategory.pid}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  const moveSkillCategoryUp = async (skillCategory: ResumeSkillCategory) => {
    const skillCategories = [...fullResume.skillCategories];
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
    mutateFullResume({ ...fullResume, skillCategories }, { revalidate: false });
    const orderedPids = skillCategories.map((item) => item.pid);
    const response = await fetch(
      `/api/resumes/${fullResume.pid}/skillCategories/order`,
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

  const moveSkillCategoryDown = async (skillCategory: ResumeSkillCategory) => {
    const skillCategories = [...fullResume.skillCategories];
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
    mutateFullResume({ ...fullResume, skillCategories }, { revalidate: false });
    const orderedPids = skillCategories.map((item) => item.pid);
    const response = await fetch(
      `/api/resumes/${fullResume.pid}/skillCategories/order`,
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
    createSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    moveSkillCategoryUp,
    moveSkillCategoryDown,
  };
}
