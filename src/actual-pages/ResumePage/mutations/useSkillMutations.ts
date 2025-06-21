import { ResumeSkill } from "@/generated/prisma";
import { useFullResumeContext } from "../FullResumeContext";

export function useSkillMutations() {
  const { fullResume, mutateFullResume } = useFullResumeContext();

  const createSkill = async (skillCategoryPid: string) => {
    const response = await fetch(
      `/api/resumeSkillCategories/${skillCategoryPid}/skills`,
      {
        method: "POST",
      }
    );
    const skill: ResumeSkill = await response.json();
    mutateFullResume(
      {
        ...fullResume,
        skillCategories: [
          ...fullResume.skillCategories.map((skillCategory) => {
            if (skillCategory.pid === skillCategoryPid) {
              return {
                ...skillCategory,
                skills: [...skillCategory.skills, skill],
              };
            } else {
              return skillCategory;
            }
          }),
        ],
      },
      { revalidate: false }
    );
  };

  const updateSkill = async (skill: ResumeSkill) => {
    mutateFullResume(
      {
        ...fullResume,
        skillCategories: fullResume.skillCategories.map((skillCategory) => {
          if (skillCategory.id === skill.skillCategoryId) {
            return {
              ...skillCategory,
              skills: skillCategory.skills.map((s) => {
                if (s.id === skill.id) {
                  return skill;
                } else {
                  return s;
                }
              }),
            };
          } else {
            return skillCategory;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/resumeSkills/${skill.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skill),
    });
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  const deleteSkill = async (skill: ResumeSkill) => {
    mutateFullResume(
      {
        ...fullResume,
        skillCategories: fullResume.skillCategories.map((skillCategory) => {
          if (skillCategory.id === skill.skillCategoryId) {
            return {
              ...skillCategory,
              skills: skillCategory.skills.filter((s) => s.id !== skill.id),
            };
          } else {
            return skillCategory;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/resumeSkills/${skill.pid}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  const moveSkillUp = async (skill: ResumeSkill) => {
    const skillCategory = fullResume.skillCategories.find(
      (item) => item.id === skill.skillCategoryId
    );
    if (!skillCategory) return;
    const skills = [...skillCategory.skills];
    const index = skills.findIndex((item) => item.id === skill.id);
    if (index > 0) {
      const swapIndex = index - 1;
      [skills[index], skills[swapIndex]] = [skills[swapIndex], skills[index]];
    } else {
      skills.push(skills.shift()!);
    }
    mutateFullResume(
      {
        ...fullResume,
        skillCategories: fullResume.skillCategories.map((s) => {
          if (s.id === skillCategory.id) {
            return { ...s, skills };
          }
          return s;
        }),
      },
      { revalidate: false }
    );
    const orderedPids = skills.map((item) => item.pid);
    const response = await fetch(
      `/api/resumeSkillCategories/${skillCategory.pid}/skills/order`,
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

  const moveSkillDown = async (skill: ResumeSkill) => {
    const skillCategory = fullResume.skillCategories.find(
      (item) => item.id === skill.skillCategoryId
    );
    if (!skillCategory) return;
    const skills = [...skillCategory.skills];
    const index = skills.findIndex((item) => item.id === skill.id);
    if (index < skills.length - 1) {
      const swapIndex = index + 1;
      [skills[index], skills[swapIndex]] = [skills[swapIndex], skills[index]];
    } else {
      skills.unshift(skills.pop()!);
    }
    mutateFullResume(
      {
        ...fullResume,
        skillCategories: fullResume.skillCategories.map((s) => {
          if (s.id === skillCategory.id) {
            return { ...s, skills };
          }
          return s;
        }),
      },
      { revalidate: false }
    );
    const orderedPids = skills.map((item) => item.pid);
    const response = await fetch(
      `/api/resumeSkillCategories/${skillCategory.pid}/skills/order`,
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
    createSkill,
    updateSkill,
    deleteSkill,
    moveSkillUp,
    moveSkillDown,
  };
}
