import { RESUME_TEMPLATES } from "@/constants";
import { t } from "@/translate";
import React, { useState } from "react";
import { ProfileEditor } from "./ProfileEditor";
import { WorkEntryEditor } from "./WorkEntryEditor";
import { WorkEntryBulletEditor } from "./WorkEntryBulletEditor";
import { EducationEntryEditor } from "./EducationEntryEditor";
import { EducationEntryBulletEditor } from "./EducationEntryBulletEditor";
import { CertificationEditor } from "./CertificationEditor";
import { SkillCategoryEditor } from "./SkillCategoryEditor";
import { SkillEditor } from "./SkillEditor";
import { SectionHeading } from "@/components/SectionHeading";
import Link from "next/link";
import {
  Certification,
  EducationEntry,
  EducationEntryBullet,
  Profile,
  ResumeTemplate,
  Skill,
  SkillCategory,
  WorkEntry,
  WorkEntryBullet,
} from "@/generated/prisma";

type FullProfile = Profile & {
  workEntries: (WorkEntry & { bullets: WorkEntryBullet[] })[];
  educationEntries: (EducationEntry & { bullets: EducationEntryBullet[] })[];
  certifications: Certification[];
  skillCategories: (SkillCategory & { skills: Skill[] })[];
};

type Props = {
  fullProfile: FullProfile;
  setFullProfile: (fullProfile: FullProfile) => void;
};

export function MainContent({ fullProfile, setFullProfile }: Props) {
  const [previewTemplate, setPreviewTemplate] =
    useState<ResumeTemplate>("template01");

  const generateSummaryPrompt = async () => {
    const lines = [];

    lines.push(
      `I am seeking employment in the following role: ${fullProfile.jobTitle}\n`
    );

    lines.push(
      "The following is my resume. Please generate a one-paragraph professional summary based on the following information.\n"
    );

    lines.push("Work History:\n");
    const workEntries = fullProfile.workEntries.filter(
      (workEntry) => workEntry.enabled
    );
    for (const workEntry of workEntries) {
      lines.push(`Position: ${workEntry.title}`);
      lines.push(`Company: ${workEntry.companyName}`);
      lines.push(`Company Location: ${workEntry.companyLocation}`);
      lines.push(`Start Date: ${workEntry.startDate}`);
      lines.push(
        `End Date: ${workEntry.endDate ?? "None -- I'm still working here."}`
      );
      lines.push("\nBullet Points:");
      const bullets = workEntry.bullets.filter((bullet) => bullet.enabled);
      for (const bullet of bullets) {
        lines.push(bullet.text);
      }
      lines.push("");
    }

    lines.push("Education:\n");
    const educationEntries = fullProfile.educationEntries.filter(
      (educationEntry) => educationEntry.enabled
    );
    for (const educationEntry of educationEntries) {
      lines.push(`Title: ${educationEntry.title}`);
      lines.push(`School: ${educationEntry.schoolName}`);
      lines.push(`Graduation Date: ${educationEntry.graduationDate}`);
      lines.push("\nBullet Points:");
      const bullets = educationEntry.bullets.filter((bullet) => bullet.enabled);
      for (const bullet of bullets) {
        lines.push(bullet.text);
      }
      lines.push("");
    }

    lines.push("Certifications:\n");
    const certifications = fullProfile.certifications.filter(
      (certification) => certification.enabled
    );
    for (const certification of certifications) {
      lines.push(`Title: ${certification.title}`);
      lines.push(`Issuer: ${certification.issuer}`);
      lines.push(`Issue Date: ${certification.issueDate}`);
      lines.push("");
    }

    lines.push("Skills Organized by Category:\n");
    const skillCategories = fullProfile.skillCategories.filter(
      (skillCategory) => skillCategory.enabled
    );
    for (const skillCategory of skillCategories) {
      lines.push(`Category: ${skillCategory.name}`);
      const skills = skillCategory.skills
        .filter((skill) => skill.enabled)
        .map((skill) => skill.text);
      lines.push(`Skills: ${skills.join(", ")}`);
      lines.push("");
    }

    const prompt = lines.join("\n");
    await navigator.clipboard.writeText(prompt);
    alert("Summary prompt has been copied to the clipboard!");
  };

  const generateCoverLetterPrompt = async () => {
    const lines = [];

    lines.push(
      `I am seeking employment in the following role: ${fullProfile.jobTitle}\n`
    );

    lines.push(
      `The following is my resume. Please generate a three-paragraph cover letter based on the following information. Please only include the paragraphs and do not include the opening "Dear" line or a signature.\n`
    );

    lines.push("Work History:\n");
    const workEntries = fullProfile.workEntries.filter(
      (workEntry) => workEntry.enabled
    );
    for (const workEntry of workEntries) {
      lines.push(`Position: ${workEntry.title}`);
      lines.push(`Company: ${workEntry.companyName}`);
      lines.push(`Company Location: ${workEntry.companyLocation}`);
      lines.push(`Start Date: ${workEntry.startDate}`);
      lines.push(
        `End Date: ${workEntry.endDate ?? "None -- I'm still working here."}`
      );
      lines.push("\nBullet Points:");
      const bullets = workEntry.bullets.filter((bullet) => bullet.enabled);
      for (const bullet of bullets) {
        lines.push(bullet.text);
      }
      lines.push("");
    }

    lines.push("Education:\n");
    const educationEntries = fullProfile.educationEntries.filter(
      (educationEntry) => educationEntry.enabled
    );
    for (const educationEntry of educationEntries) {
      lines.push(`Title: ${educationEntry.title}`);
      lines.push(`School: ${educationEntry.schoolName}`);
      lines.push(`Graduation Date: ${educationEntry.graduationDate}`);
      lines.push("\nBullet Points:");
      const bullets = educationEntry.bullets.filter((bullet) => bullet.enabled);
      for (const bullet of bullets) {
        lines.push(bullet.text);
      }
      lines.push("");
    }

    lines.push("Certifications:\n");
    const certifications = fullProfile.certifications.filter(
      (certification) => certification.enabled
    );
    for (const certification of certifications) {
      lines.push(`Title: ${certification.title}`);
      lines.push(`Issuer: ${certification.issuer}`);
      lines.push(`Issue Date: ${certification.issueDate}`);
      lines.push("");
    }

    lines.push("Skills Organized by Category:\n");
    const skillCategories = fullProfile.skillCategories.filter(
      (skillCategory) => skillCategory.enabled
    );
    for (const skillCategory of skillCategories) {
      lines.push(`Category: ${skillCategory.name}`);
      const skills = skillCategory.skills
        .filter((skill) => skill.enabled)
        .map((skill) => skill.text);
      lines.push(`Skills: ${skills.join(", ")}`);
      lines.push("");
    }

    const prompt = lines.join("\n");
    await navigator.clipboard.writeText(prompt);
    alert("Cover letter prompt has been copied to the clipboard!");
  };

  const updateProfile = async (profile: Profile) => {
    const response = await fetch(`/api/profiles/${profile.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });
    const updatedProfile: Profile = await response.json();
    setFullProfile({
      ...fullProfile,
      ...updatedProfile,
    });
  };

  const createWorkEntry = async () => {
    const response = await fetch(
      `/api/profiles/${fullProfile.id}/workEntries`,
      {
        method: "POST",
      }
    );
    const workEntry: WorkEntry = await response.json();
    setFullProfile({
      ...fullProfile,
      workEntries: [
        ...fullProfile.workEntries,
        {
          ...workEntry,
          bullets: [],
        },
      ],
    });
  };

  const updateWorkEntry = async (workEntry: WorkEntry) => {
    const response = await fetch(`/api/workEntries/${workEntry.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workEntry),
    });
    const updatedWorkEntry: WorkEntry = await response.json();
    setFullProfile({
      ...fullProfile,
      workEntries: fullProfile.workEntries.map((workEntry) => {
        if (workEntry.id === updatedWorkEntry.id) {
          return {
            ...workEntry,
            ...updatedWorkEntry,
          };
        } else {
          return workEntry;
        }
      }),
    });
  };

  const deleteWorkEntry = async (workEntry: WorkEntry) => {
    const response = await fetch(`/api/workEntries/${workEntry.id}`, {
      method: "DELETE",
    });
    const deletedWorkEntry: WorkEntry = await response.json();
    setFullProfile({
      ...fullProfile,
      workEntries: fullProfile.workEntries.filter(
        (workEntry) => workEntry.id !== deletedWorkEntry.id
      ),
    });
  };

  const moveWorkEntryUp = async (workEntry: WorkEntry) => {
    const index = fullProfile.workEntries.findIndex(
      (item) => item.id === workEntry.id
    );
    if (index > 0) {
      const swapIndex = index - 1;
      [fullProfile.workEntries[index], fullProfile.workEntries[swapIndex]] = [
        fullProfile.workEntries[swapIndex],
        fullProfile.workEntries[index],
      ];
    } else {
      fullProfile.workEntries.push(fullProfile.workEntries.shift()!);
    }
    const orderedIds = fullProfile.workEntries.map((item) => item.id);
    await fetch(`/api/profiles/${fullProfile.id}/workEntries/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullProfile({
      ...fullProfile,
    });
  };

  const moveWorkEntryDown = async (workEntry: WorkEntry) => {
    const index = fullProfile.workEntries.findIndex(
      (item) => item.id === workEntry.id
    );
    if (index < fullProfile.workEntries.length - 1) {
      const swapIndex = index + 1;
      [fullProfile.workEntries[index], fullProfile.workEntries[swapIndex]] = [
        fullProfile.workEntries[swapIndex],
        fullProfile.workEntries[index],
      ];
    } else {
      fullProfile.workEntries.unshift(fullProfile.workEntries.pop()!);
    }
    const orderedIds = fullProfile.workEntries.map((item) => item.id);
    await fetch(`/api/profiles/${fullProfile.id}/workEntries/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullProfile({
      ...fullProfile,
    });
  };

  const createWorkEntryBullet = async (workEntryPid: string) => {
    const response = await fetch(`/api/workEntries/${workEntryPid}/bullets`, {
      method: "POST",
    });
    const workEntryBullet: WorkEntryBullet = await response.json();
    setFullProfile({
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
    });
  };

  const updateWorkEntryBullet = async (workEntryBullet: WorkEntryBullet) => {
    const response = await fetch(
      `/api/workEntryBullets/${workEntryBullet.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workEntryBullet),
      }
    );
    const updatedWorkEntryBullet: WorkEntryBullet = await response.json();
    setFullProfile({
      ...fullProfile,
      workEntries: fullProfile.workEntries.map((workEntry) => {
        if (workEntry.id === updatedWorkEntryBullet.workEntryId) {
          return {
            ...workEntry,
            bullets: workEntry.bullets.map((workEntryBullet) => {
              if (workEntryBullet.id === updatedWorkEntryBullet.id) {
                return updatedWorkEntryBullet;
              } else {
                return workEntryBullet;
              }
            }),
          };
        } else {
          return workEntry;
        }
      }),
    });
  };

  const deleteWorkEntryBullet = async (workEntryBullet: WorkEntryBullet) => {
    const response = await fetch(
      `/api/workEntryBullets/${workEntryBullet.id}`,
      { method: "DELETE" }
    );
    const deletedWorkEntryBullet: WorkEntryBullet = await response.json();
    setFullProfile({
      ...fullProfile,
      workEntries: fullProfile.workEntries.map((workEntry) => {
        if (workEntry.id === deletedWorkEntryBullet.workEntryId) {
          return {
            ...workEntry,
            bullets: workEntry.bullets.filter(
              (workEntryBullet) =>
                workEntryBullet.id !== deletedWorkEntryBullet.id
            ),
          };
        } else {
          return workEntry;
        }
      }),
    });
  };

  const moveWorkEntryBulletUp = async (workEntryBullet: WorkEntryBullet) => {
    const workEntry = fullProfile.workEntries.find(
      (item) => item.id === workEntryBullet.workEntryId
    );
    if (!workEntry) return;
    const bullets = workEntry.bullets;
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
    const orderedIds = bullets.map((item) => item.id);
    await fetch(`/api/workEntries/${workEntry.id}/bullets/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullProfile({
      ...fullProfile,
    });
  };

  const moveWorkEntryBulletDown = async (workEntryBullet: WorkEntryBullet) => {
    const workEntry = fullProfile.workEntries.find(
      (item) => item.id === workEntryBullet.workEntryId
    );
    if (!workEntry) return;
    const bullets = workEntry.bullets;
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
    const orderedIds = bullets.map((item) => item.id);
    await fetch(`/api/workEntries/${workEntry.id}/bullets/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullProfile({
      ...fullProfile,
    });
  };

  const createEducationEntry = async () => {
    const response = await fetch(
      `/api/profiles/${fullProfile.id}/educationEntries`,
      {
        method: "POST",
      }
    );
    const educationEntry: EducationEntry = await response.json();
    setFullProfile({
      ...fullProfile,
      educationEntries: [
        ...fullProfile.educationEntries,
        {
          ...educationEntry,
          bullets: [],
        },
      ],
    });
  };

  const updateEducationEntry = async (educationEntry: EducationEntry) => {
    const response = await fetch(`/api/educationEntries/${educationEntry.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(educationEntry),
    });
    const updatedEducationEntry: EducationEntry = await response.json();
    setFullProfile({
      ...fullProfile,
      educationEntries: fullProfile.educationEntries.map((educationEntry) => {
        if (educationEntry.id === updatedEducationEntry.id) {
          return {
            ...educationEntry,
            ...updatedEducationEntry,
          };
        } else {
          return educationEntry;
        }
      }),
    });
  };

  const deleteEducationEntry = async (educationEntry: EducationEntry) => {
    const response = await fetch(`/api/educationEntries/${educationEntry.id}`, {
      method: "DELETE",
    });
    const deletedEducationEntry: EducationEntry = await response.json();
    setFullProfile({
      ...fullProfile,
      educationEntries: fullProfile.educationEntries.filter(
        (educationEntry) => educationEntry.id !== deletedEducationEntry.id
      ),
    });
  };

  const moveEducationEntryUp = async (educationEntry: EducationEntry) => {
    const index = fullProfile.educationEntries.findIndex(
      (item) => item.id === educationEntry.id
    );
    if (index > 0) {
      const swapIndex = index - 1;
      [
        fullProfile.educationEntries[index],
        fullProfile.educationEntries[swapIndex],
      ] = [
        fullProfile.educationEntries[swapIndex],
        fullProfile.educationEntries[index],
      ];
    } else {
      fullProfile.educationEntries.push(fullProfile.educationEntries.shift()!);
    }
    const orderedIds = fullProfile.educationEntries.map((item) => item.id);
    await fetch(`/api/profiles/${fullProfile.id}/educationEntries/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullProfile({
      ...fullProfile,
    });
  };

  const moveEducationEntryDown = async (educationEntry: EducationEntry) => {
    const index = fullProfile.educationEntries.findIndex(
      (item) => item.id === educationEntry.id
    );
    if (index < fullProfile.educationEntries.length - 1) {
      const swapIndex = index + 1;
      [
        fullProfile.educationEntries[index],
        fullProfile.educationEntries[swapIndex],
      ] = [
        fullProfile.educationEntries[swapIndex],
        fullProfile.educationEntries[index],
      ];
    } else {
      fullProfile.educationEntries.unshift(fullProfile.educationEntries.pop()!);
    }
    const orderedIds = fullProfile.educationEntries.map((item) => item.id);
    await fetch(`/api/profiles/${fullProfile.id}/educationEntries/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullProfile({
      ...fullProfile,
    });
  };

  const createEducationEntryBullet = async (educationEntryPid: string) => {
    const response = await fetch(
      `/api/educationEntries/${educationEntryPid}/bullets`,
      {
        method: "POST",
      }
    );
    const educationEntryBullet: EducationEntryBullet = await response.json();
    setFullProfile({
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
    });
  };

  const updateEducationEntryBullet = async (
    educationEntryBullet: EducationEntryBullet
  ) => {
    const response = await fetch(
      `/api/educationEntryBullets/${educationEntryBullet.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(educationEntryBullet),
      }
    );
    const updatedEducationEntryBullet: EducationEntryBullet =
      await response.json();
    setFullProfile({
      ...fullProfile,
      educationEntries: fullProfile.educationEntries.map((educationEntry) => {
        if (
          educationEntry.id === updatedEducationEntryBullet.educationEntryId
        ) {
          return {
            ...educationEntry,
            bullets: educationEntry.bullets.map((educationEntryBullet) => {
              if (educationEntryBullet.id === updatedEducationEntryBullet.id) {
                return updatedEducationEntryBullet;
              } else {
                return educationEntryBullet;
              }
            }),
          };
        } else {
          return educationEntry;
        }
      }),
    });
  };

  const deleteEducationEntryBullet = async (
    educationEntryBullet: EducationEntryBullet
  ) => {
    const response = await fetch(
      `/api/educationEntryBullets/${educationEntryBullet.id}`,
      { method: "DELETE" }
    );
    const deletedEducationEntryBullet: EducationEntryBullet =
      await response.json();
    setFullProfile({
      ...fullProfile,
      educationEntries: fullProfile.educationEntries.map((educationEntry) => {
        if (
          educationEntry.id === deletedEducationEntryBullet.educationEntryId
        ) {
          return {
            ...educationEntry,
            bullets: educationEntry.bullets.filter(
              (educationEntryBullet) =>
                educationEntryBullet.id !== deletedEducationEntryBullet.id
            ),
          };
        } else {
          return educationEntry;
        }
      }),
    });
  };

  const moveEducationEntryBulletUp = async (
    educationEntryBullet: EducationEntryBullet
  ) => {
    const educationEntry = fullProfile.educationEntries.find(
      (item) => item.id === educationEntryBullet.educationEntryId
    );
    if (!educationEntry) return;
    const bullets = educationEntry.bullets;
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
    const orderedIds = bullets.map((item) => item.id);
    await fetch(`/api/educationEntries/${educationEntry.id}/bullets/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullProfile({
      ...fullProfile,
    });
  };

  const moveEducationEntryBulletDown = async (
    educationEntryBullet: EducationEntryBullet
  ) => {
    const educationEntry = fullProfile.educationEntries.find(
      (item) => item.id === educationEntryBullet.educationEntryId
    );
    if (!educationEntry) return;
    const bullets = educationEntry.bullets;
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
    const orderedIds = bullets.map((item) => item.id);
    await fetch(`/api/educationEntries/${educationEntry.id}/bullets/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullProfile({
      ...fullProfile,
    });
  };

  const createCertification = async () => {
    const response = await fetch(
      `/api/profiles/${fullProfile.id}/certifications`,
      {
        method: "POST",
      }
    );
    const certification: Certification = await response.json();
    setFullProfile({
      ...fullProfile,
      certifications: [...fullProfile.certifications, certification],
    });
  };

  const updateCertification = async (certification: Certification) => {
    const response = await fetch(`/api/certifications/${certification.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(certification),
    });
    const updatedCertification: Certification = await response.json();
    setFullProfile({
      ...fullProfile,
      certifications: fullProfile.certifications.map((certification) => {
        if (certification.id === updatedCertification.id) {
          return {
            ...certification,
            ...updatedCertification,
          };
        } else {
          return certification;
        }
      }),
    });
  };

  const deleteCertification = async (certification: Certification) => {
    const response = await fetch(`/api/certifications/${certification.id}`, {
      method: "DELETE",
    });
    const deletedCertification: Certification = await response.json();
    setFullProfile({
      ...fullProfile,
      certifications: fullProfile.certifications.filter(
        (certification) => certification.id !== deletedCertification.id
      ),
    });
  };

  const moveCertificationUp = async (certification: Certification) => {
    const index = fullProfile.certifications.findIndex(
      (item) => item.id === certification.id
    );
    if (index > 0) {
      const swapIndex = index - 1;
      [
        fullProfile.certifications[index],
        fullProfile.certifications[swapIndex],
      ] = [
        fullProfile.certifications[swapIndex],
        fullProfile.certifications[index],
      ];
    } else {
      fullProfile.certifications.push(fullProfile.certifications.shift()!);
    }
    const orderedIds = fullProfile.certifications.map((item) => item.id);
    await fetch(`/api/profiles/${fullProfile.id}/certifications/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullProfile({
      ...fullProfile,
    });
  };

  const moveCertificationDown = async (certification: Certification) => {
    const index = fullProfile.certifications.findIndex(
      (item) => item.id === certification.id
    );
    if (index < fullProfile.certifications.length - 1) {
      const swapIndex = index + 1;
      [
        fullProfile.certifications[index],
        fullProfile.certifications[swapIndex],
      ] = [
        fullProfile.certifications[swapIndex],
        fullProfile.certifications[index],
      ];
    } else {
      fullProfile.certifications.unshift(fullProfile.certifications.pop()!);
    }
    const orderedIds = fullProfile.certifications.map((item) => item.id);
    await fetch(`/api/profiles/${fullProfile.id}/certifications/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullProfile({
      ...fullProfile,
    });
  };

  const createSkillCategory = async () => {
    const response = await fetch(
      `/api/profiles/${fullProfile.id}/skillCategories`,
      {
        method: "POST",
      }
    );
    const skillCategory: SkillCategory = await response.json();
    setFullProfile({
      ...fullProfile,
      skillCategories: [
        ...fullProfile.skillCategories,
        {
          ...skillCategory,
          skills: [],
        },
      ],
    });
  };

  const updateSkillCategory = async (skillCategory: SkillCategory) => {
    const response = await fetch(`/api/skillCategories/${skillCategory.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skillCategory),
    });
    const updatedSkillCategory: SkillCategory = await response.json();
    setFullProfile({
      ...fullProfile,
      skillCategories: fullProfile.skillCategories.map((skillCategory) => {
        if (skillCategory.id === updatedSkillCategory.id) {
          return {
            ...skillCategory,
            ...updatedSkillCategory,
          };
        } else {
          return skillCategory;
        }
      }),
    });
  };

  const deleteSkillCategory = async (skillCategory: SkillCategory) => {
    const response = await fetch(`/api/skillCategories/${skillCategory.id}`, {
      method: "DELETE",
    });
    const deletedSkillCategory: SkillCategory = await response.json();
    setFullProfile({
      ...fullProfile,
      skillCategories: fullProfile.skillCategories.filter(
        (skillCategory) => skillCategory.id !== deletedSkillCategory.id
      ),
    });
  };

  const moveSkillCategoryUp = async (skillCategory: SkillCategory) => {
    const index = fullProfile.skillCategories.findIndex(
      (item) => item.id === skillCategory.id
    );
    if (index > 0) {
      const swapIndex = index - 1;
      [
        fullProfile.skillCategories[index],
        fullProfile.skillCategories[swapIndex],
      ] = [
        fullProfile.skillCategories[swapIndex],
        fullProfile.skillCategories[index],
      ];
    } else {
      fullProfile.skillCategories.push(fullProfile.skillCategories.shift()!);
    }
    const orderedIds = fullProfile.skillCategories.map((item) => item.id);
    await fetch(`/api/profiles/${fullProfile.id}/skillCategories/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullProfile({
      ...fullProfile,
    });
  };

  const moveSkillCategoryDown = async (skillCategory: SkillCategory) => {
    const index = fullProfile.skillCategories.findIndex(
      (item) => item.id === skillCategory.id
    );
    if (index < fullProfile.skillCategories.length - 1) {
      const swapIndex = index + 1;
      [
        fullProfile.skillCategories[index],
        fullProfile.skillCategories[swapIndex],
      ] = [
        fullProfile.skillCategories[swapIndex],
        fullProfile.skillCategories[index],
      ];
    } else {
      fullProfile.skillCategories.unshift(fullProfile.skillCategories.pop()!);
    }
    const orderedIds = fullProfile.skillCategories.map((item) => item.id);
    await fetch(`/api/profiles/${fullProfile.id}/skillCategories/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullProfile({
      ...fullProfile,
    });
  };

  const createSkill = async (skillCategoryPid: string) => {
    const response = await fetch(
      `/api/skillCategories/${skillCategoryPid}/skills`,
      {
        method: "POST",
      }
    );
    const skill: Skill = await response.json();
    setFullProfile({
      ...fullProfile,
      skillCategories: [
        ...fullProfile.skillCategories.map((skillCategory) => {
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
    });
  };

  const updateSkill = async (skill: Skill) => {
    const response = await fetch(`/api/skills/${skill.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skill),
    });
    const updatedSkill: Skill = await response.json();
    setFullProfile({
      ...fullProfile,
      skillCategories: fullProfile.skillCategories.map((skillCategory) => {
        if (skillCategory.id === updatedSkill.skillCategoryId) {
          return {
            ...skillCategory,
            skills: skillCategory.skills.map((skill) => {
              if (skill.id === updatedSkill.id) {
                return updatedSkill;
              } else {
                return skill;
              }
            }),
          };
        } else {
          return skillCategory;
        }
      }),
    });
  };

  const deleteSkill = async (skill: Skill) => {
    const response = await fetch(`/api/skills/${skill.id}`, {
      method: "DELETE",
    });
    const deletedSkill: Skill = await response.json();
    setFullProfile({
      ...fullProfile,
      skillCategories: fullProfile.skillCategories.map((skillCategory) => {
        if (skillCategory.id === deletedSkill.skillCategoryId) {
          return {
            ...skillCategory,
            skills: skillCategory.skills.filter(
              (skill) => skill.id !== deletedSkill.id
            ),
          };
        } else {
          return skillCategory;
        }
      }),
    });
  };

  const moveSkillUp = async (skill: Skill) => {
    const skillCategory = fullProfile.skillCategories.find(
      (item) => item.id === skill.skillCategoryId
    );
    if (!skillCategory) return;
    const skills = skillCategory.skills;
    const index = skills.findIndex((item) => item.id === skill.id);
    if (index > 0) {
      const swapIndex = index - 1;
      [skills[index], skills[swapIndex]] = [skills[swapIndex], skills[index]];
    } else {
      skills.push(skills.shift()!);
    }
    const orderedIds = skills.map((item) => item.id);
    await fetch(`/api/skillCategories/${skillCategory.id}/skills/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullProfile({
      ...fullProfile,
    });
  };

  const moveSkillDown = async (skill: Skill) => {
    const skillCategory = fullProfile.skillCategories.find(
      (item) => item.id === skill.skillCategoryId
    );
    if (!skillCategory) return;
    const skills = skillCategory.skills;
    const index = skills.findIndex((item) => item.id === skill.id);
    if (index < skills.length - 1) {
      const swapIndex = index + 1;
      [skills[index], skills[swapIndex]] = [skills[swapIndex], skills[index]];
    } else {
      skills.unshift(skills.pop()!);
    }
    const orderedIds = skills.map((item) => item.id);
    await fetch(`/api/skillCategories/${skillCategory.id}/skills/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullProfile({
      ...fullProfile,
    });
  };

  return (
    <div className="px-8 pb-28">
      <label className="block">
        <select
          value={previewTemplate}
          onChange={(e) => setPreviewTemplate(e.target.value as ResumeTemplate)}
        >
          {RESUME_TEMPLATES.map((resumeTemplate) => (
            <option key={resumeTemplate} value={resumeTemplate}>
              {t.resumeTemplates[resumeTemplate]}
            </option>
          ))}
        </select>
      </label>
      <Link
        href={`/api/profiles/${fullProfile.id}/previewResume?template=${previewTemplate}`}
      >
        PREVIEW RESUME
      </Link>
      <br />
      <Link
        href={`/api/profiles/${
          fullProfile.id
        }/previewCoverLetter?template=${previewTemplate}&timezoneOffset=${new Date().getTimezoneOffset()}`}
      >
        PREVIEW COVER LETTER
      </Link>
      <SectionHeading text="Basic Info" />
      <ProfileEditor
        profile={fullProfile}
        updateProfile={updateProfile}
        generateSummaryPrompt={generateSummaryPrompt}
        generateCoverLetterPrompt={generateCoverLetterPrompt}
      />
      <SectionHeading text="Skills" />
      <div className="mt-6 flex flex-col gap-12">
        {fullProfile.skillCategories.map((skillCategory) => (
          <div key={skillCategory.id} className="flex flex-col gap-6">
            <SkillCategoryEditor
              skillCategory={skillCategory}
              updateSkillCategory={updateSkillCategory}
              deleteSkillCategory={deleteSkillCategory}
              moveSkillCategoryUp={moveSkillCategoryUp}
              moveSkillCategoryDown={moveSkillCategoryDown}
            />
            {skillCategory.skills.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {skillCategory.skills.map((s) => (
                  <SkillEditor
                    key={s.id}
                    skill={s}
                    skillCategoryEnabled={skillCategory.enabled}
                    updateSkill={updateSkill}
                    deleteSkill={deleteSkill}
                    moveSkillUp={moveSkillUp}
                    moveSkillDown={moveSkillDown}
                  />
                ))}
              </div>
            )}
            <div>
              <button onClick={() => createSkill(skillCategory.pid)}>
                New Skill
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={createSkillCategory}>New Skill Category</button>
      <SectionHeading text="Work Experience" />
      <div className="mt-6 flex flex-col gap-12">
        {fullProfile.workEntries.map((workEntry) => (
          <div key={workEntry.id} className="flex flex-col gap-6">
            <WorkEntryEditor
              workEntry={workEntry}
              updateWorkEntry={updateWorkEntry}
              deleteWorkEntry={deleteWorkEntry}
              moveWorkEntryUp={moveWorkEntryUp}
              moveWorkEntryDown={moveWorkEntryDown}
            />
            {workEntry.bullets.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {workEntry.bullets.map((b) => (
                  <WorkEntryBulletEditor
                    key={b.id}
                    workEntryBullet={b}
                    workEntryEnabled={workEntry.enabled}
                    updateWorkEntryBullet={updateWorkEntryBullet}
                    deleteWorkEntryBullet={deleteWorkEntryBullet}
                    moveWorkEntryBulletUp={moveWorkEntryBulletUp}
                    moveWorkEntryBulletDown={moveWorkEntryBulletDown}
                  />
                ))}
              </div>
            )}
            <div>
              <button onClick={() => createWorkEntryBullet(workEntry.pid)}>
                New Bullet
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={createWorkEntry}>New Work</button>
      <SectionHeading text="Education" />
      <div className="mt-6 flex flex-col gap-12">
        {fullProfile.educationEntries.map((educationEntry) => (
          <div key={educationEntry.id} className="flex flex-col gap-6">
            <EducationEntryEditor
              educationEntry={educationEntry}
              updateEducationEntry={updateEducationEntry}
              deleteEducationEntry={deleteEducationEntry}
              moveEducationEntryUp={moveEducationEntryUp}
              moveEducationEntryDown={moveEducationEntryDown}
            />
            {educationEntry.bullets.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {educationEntry.bullets.map((b) => (
                  <EducationEntryBulletEditor
                    key={b.id}
                    educationEntryBullet={b}
                    educationEntryEnabled={educationEntry.enabled}
                    updateEducationEntryBullet={updateEducationEntryBullet}
                    deleteEducationEntryBullet={deleteEducationEntryBullet}
                    moveEducationEntryBulletUp={moveEducationEntryBulletUp}
                    moveEducationEntryBulletDown={moveEducationEntryBulletDown}
                  />
                ))}
              </div>
            )}
            <div>
              <button
                onClick={() => createEducationEntryBullet(educationEntry.pid)}
              >
                New Bullet
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={createEducationEntry}>New Education</button>
      <SectionHeading text="Certifications" />
      <div className="mt-6 flex flex-col gap-6">
        {fullProfile.certifications.length > 0 && (
          <div className="flex flex-col gap-4">
            {fullProfile.certifications.map((certification) => (
              <CertificationEditor
                key={certification.id}
                certification={certification}
                updateCertification={updateCertification}
                deleteCertification={deleteCertification}
                moveCertificationUp={moveCertificationUp}
                moveCertificationDown={moveCertificationDown}
              />
            ))}
          </div>
        )}
        <div>
          <button onClick={createCertification}>New Certification</button>
        </div>
      </div>
    </div>
  );
}
