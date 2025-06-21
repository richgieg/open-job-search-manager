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
import { KeyedMutator } from "swr";

type FullProfile = Profile & {
  workEntries: (WorkEntry & { bullets: WorkEntryBullet[] })[];
  educationEntries: (EducationEntry & { bullets: EducationEntryBullet[] })[];
  certifications: Certification[];
  skillCategories: (SkillCategory & { skills: Skill[] })[];
};

type Props = {
  fullProfile: FullProfile;
  mutateFullProfile: KeyedMutator<FullProfile>;
};

export function MainContent({ fullProfile, mutateFullProfile }: Props) {
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
    mutateFullProfile({ ...fullProfile, ...profile }, { revalidate: false });
    const response = await fetch(`/api/profiles/${profile.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

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

  const createCertification = async () => {
    const response = await fetch(
      `/api/profiles/${fullProfile.pid}/certifications`,
      {
        method: "POST",
      }
    );
    const certification: Certification = await response.json();
    mutateFullProfile(
      {
        ...fullProfile,
        certifications: [...fullProfile.certifications, certification],
      },
      { revalidate: false }
    );
  };

  const updateCertification = async (certification: Certification) => {
    mutateFullProfile(
      {
        ...fullProfile,
        certifications: fullProfile.certifications.map((c) => {
          if (c.id === certification.id) {
            return { ...c, ...certification };
          } else {
            return c;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/certifications/${certification.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(certification),
    });
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const deleteCertification = async (certification: Certification) => {
    mutateFullProfile(
      {
        ...fullProfile,
        certifications: fullProfile.certifications.filter(
          (c) => c.id !== certification.id
        ),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/certifications/${certification.pid}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const moveCertificationUp = async (certification: Certification) => {
    const certifications = [...fullProfile.certifications];
    const index = certifications.findIndex(
      (item) => item.id === certification.id
    );
    if (index > 0) {
      const swapIndex = index - 1;
      [certifications[index], certifications[swapIndex]] = [
        certifications[swapIndex],
        certifications[index],
      ];
    } else {
      certifications.push(certifications.shift()!);
    }
    mutateFullProfile(
      { ...fullProfile, certifications },
      { revalidate: false }
    );
    const orderedPids = certifications.map((item) => item.pid);
    const response = await fetch(
      `/api/profiles/${fullProfile.pid}/certifications/order`,
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

  const moveCertificationDown = async (certification: Certification) => {
    const certifications = [...fullProfile.certifications];
    const index = certifications.findIndex(
      (item) => item.id === certification.id
    );
    if (index < certifications.length - 1) {
      const swapIndex = index + 1;
      [certifications[index], certifications[swapIndex]] = [
        certifications[swapIndex],
        certifications[index],
      ];
    } else {
      certifications.unshift(certifications.pop()!);
    }
    mutateFullProfile(
      { ...fullProfile, certifications },
      { revalidate: false }
    );
    const orderedPids = certifications.map((item) => item.pid);
    const response = await fetch(
      `/api/profiles/${fullProfile.pid}/certifications/order`,
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

  const createSkill = async (skillCategoryPid: string) => {
    const response = await fetch(
      `/api/skillCategories/${skillCategoryPid}/skills`,
      {
        method: "POST",
      }
    );
    const skill: Skill = await response.json();
    mutateFullProfile(
      {
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
      },
      { revalidate: false }
    );
  };

  const updateSkill = async (skill: Skill) => {
    mutateFullProfile(
      {
        ...fullProfile,
        skillCategories: fullProfile.skillCategories.map((skillCategory) => {
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
    const response = await fetch(`/api/skills/${skill.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skill),
    });
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const deleteSkill = async (skill: Skill) => {
    mutateFullProfile(
      {
        ...fullProfile,
        skillCategories: fullProfile.skillCategories.map((skillCategory) => {
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
    const response = await fetch(`/api/skills/${skill.pid}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const moveSkillUp = async (skill: Skill) => {
    const skillCategory = fullProfile.skillCategories.find(
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
    mutateFullProfile(
      {
        ...fullProfile,
        skillCategories: fullProfile.skillCategories.map((s) => {
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
      `/api/skillCategories/${skillCategory.pid}/skills/order`,
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

  const moveSkillDown = async (skill: Skill) => {
    const skillCategory = fullProfile.skillCategories.find(
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
    mutateFullProfile(
      {
        ...fullProfile,
        skillCategories: fullProfile.skillCategories.map((s) => {
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
      `/api/skillCategories/${skillCategory.pid}/skills/order`,
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
        href={`/api/profiles/${fullProfile.pid}/previewResume?template=${previewTemplate}`}
      >
        PREVIEW RESUME
      </Link>
      <br />
      <Link
        href={`/api/profiles/${
          fullProfile.pid
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
