import { ResumeEditor } from "./ResumeEditor";
import React, { useState } from "react";
import { WorkEntryEditor } from "./WorkEntryEditor";
import { WorkEntryBulletEditor } from "./WorkEntryBulletEditor";
import { EducationEntryEditor } from "./EducationEntryEditor";
import { EducationEntryBulletEditor } from "./EducationEntryBulletEditor";
import { CertificationEditor } from "./CertificationEditor";
import { SkillCategoryEditor } from "./SkillCategoryEditor";
import { SkillEditor } from "./SkillEditor";
import { SectionHeading } from "@/components/SectionHeading";
import NextLink from "next/link";
import {
  ApplicationQuestion,
  Contact,
  Job,
  Link,
  Resume,
  ResumeCertification,
  ResumeEducationEntry,
  ResumeEducationEntryBullet,
  ResumeSkill,
  ResumeSkillCategory,
  ResumeWorkEntry,
  ResumeWorkEntryBullet,
} from "@/generated/prisma";

type FullResume = Resume & {
  workEntries: (ResumeWorkEntry & { bullets: ResumeWorkEntryBullet[] })[];
  educationEntries: (ResumeEducationEntry & {
    bullets: ResumeEducationEntryBullet[];
  })[];
  certifications: ResumeCertification[];
  skillCategories: (ResumeSkillCategory & { skills: ResumeSkill[] })[];
};

type FullJob = Job & {
  resumes: Resume[];
  links: Link[];
  contacts: Contact[];
  applicationQuestions: ApplicationQuestion[];
};

type Props = {
  fullResume: FullResume;
  setFullResume: (fullResume: FullResume) => void;
  fullJob: FullJob;
};

export function MainContent({ fullResume, setFullResume, fullJob }: Props) {
  const [selectedContactPid, setSelectedContactPid] = useState<string>(
    fullJob.contacts[0]?.pid ?? ""
  );

  const generateSummaryPrompt = async () => {
    const lines = [];
    lines.push("I am seeking employment in the following role:\n");
    lines.push(`Job Title: ${fullJob.title}`);
    lines.push(`Company: ${fullJob.company}`);
    lines.push("Job Description:\n");
    lines.push("---");
    lines.push(`${fullJob.description}`);
    lines.push("---\n\n");

    lines.push(
      "Here is my resume. Please generate a one-paragraph professional summary based on the information in my resume, highlighting how my experience and education best fits with the job title and job description, and mentioning how I'm excited to join this company.\n"
    );

    lines.push("Work History:\n");
    const workEntries = fullResume.workEntries.filter(
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
    const educationEntries = fullResume.educationEntries.filter(
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
    const certifications = fullResume.certifications.filter(
      (certification) => certification.enabled
    );
    for (const certification of certifications) {
      lines.push(`Title: ${certification.title}`);
      lines.push(`Issuer: ${certification.issuer}`);
      lines.push(`Issue Date: ${certification.issueDate}`);
      lines.push("");
    }

    lines.push("Skills Organized by Category:\n");
    const skillCategories = fullResume.skillCategories.filter(
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
    lines.push("I am seeking employment in the following role:\n");
    lines.push(`Job Title: ${fullJob.title}`);
    lines.push(`Company: ${fullJob.company}`);
    lines.push("Job Description:\n");
    lines.push("---");
    lines.push(`${fullJob.description}`);
    lines.push("---\n\n");

    lines.push(
      "Here is my resume. Please generate a three-paragraph cover letter based on the information in my resume, highlighting how my experience and education best fits with the job title and job description, and mentioning how I'm excited to join this company.\n"
    );

    lines.push("Work History:\n");
    const workEntries = fullResume.workEntries.filter(
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
    const educationEntries = fullResume.educationEntries.filter(
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
    const certifications = fullResume.certifications.filter(
      (certification) => certification.enabled
    );
    for (const certification of certifications) {
      lines.push(`Title: ${certification.title}`);
      lines.push(`Issuer: ${certification.issuer}`);
      lines.push(`Issue Date: ${certification.issueDate}`);
      lines.push("");
    }

    lines.push("Skills Organized by Category:\n");
    const skillCategories = fullResume.skillCategories.filter(
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

  const updateResume = async (resume: Resume) => {
    const response = await fetch(`/api/resumes/${resume.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resume),
    });
    const updatedResume: Resume = await response.json();
    setFullResume({
      ...fullResume,
      ...updatedResume,
    });
  };

  const createWorkEntry = async () => {
    const response = await fetch(`/api/resumes/${fullResume.id}/workEntries`, {
      method: "POST",
    });
    const workEntry: ResumeWorkEntry = await response.json();
    setFullResume({
      ...fullResume,
      workEntries: [
        ...fullResume.workEntries,
        {
          ...workEntry,
          bullets: [],
        },
      ],
    });
  };

  const updateWorkEntry = async (workEntry: ResumeWorkEntry) => {
    const response = await fetch(`/api/resumeWorkEntries/${workEntry.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workEntry),
    });
    const updatedWorkEntry: ResumeWorkEntry = await response.json();
    setFullResume({
      ...fullResume,
      workEntries: fullResume.workEntries.map((workEntry) => {
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

  const deleteWorkEntry = async (workEntry: ResumeWorkEntry) => {
    const response = await fetch(`/api/resumeWorkEntries/${workEntry.id}`, {
      method: "DELETE",
    });
    const deletedWorkEntry: ResumeWorkEntry = await response.json();
    setFullResume({
      ...fullResume,
      workEntries: fullResume.workEntries.filter(
        (workEntry) => workEntry.id !== deletedWorkEntry.id
      ),
    });
  };

  const moveWorkEntryUp = async (workEntry: ResumeWorkEntry) => {
    const index = fullResume.workEntries.findIndex(
      (item) => item.id === workEntry.id
    );
    if (index > 0) {
      const swapIndex = index - 1;
      [fullResume.workEntries[index], fullResume.workEntries[swapIndex]] = [
        fullResume.workEntries[swapIndex],
        fullResume.workEntries[index],
      ];
    } else {
      fullResume.workEntries.push(fullResume.workEntries.shift()!);
    }
    const orderedIds = fullResume.workEntries.map((item) => item.id);
    await fetch(`/api/resumes/${fullResume.id}/workEntries/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullResume({
      ...fullResume,
    });
  };

  const moveWorkEntryDown = async (workEntry: ResumeWorkEntry) => {
    const index = fullResume.workEntries.findIndex(
      (item) => item.id === workEntry.id
    );
    if (index < fullResume.workEntries.length - 1) {
      const swapIndex = index + 1;
      [fullResume.workEntries[index], fullResume.workEntries[swapIndex]] = [
        fullResume.workEntries[swapIndex],
        fullResume.workEntries[index],
      ];
    } else {
      fullResume.workEntries.unshift(fullResume.workEntries.pop()!);
    }
    const orderedIds = fullResume.workEntries.map((item) => item.id);
    await fetch(`/api/resumes/${fullResume.id}/workEntries/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullResume({
      ...fullResume,
    });
  };

  const createWorkEntryBullet = async (workEntryPid: string) => {
    const response = await fetch(
      `/api/resumeWorkEntries/${workEntryPid}/bullets`,
      {
        method: "POST",
      }
    );
    const workEntryBullet: ResumeWorkEntryBullet = await response.json();
    setFullResume({
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
    });
  };

  const updateWorkEntryBullet = async (
    workEntryBullet: ResumeWorkEntryBullet
  ) => {
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
    const updatedWorkEntryBullet: ResumeWorkEntryBullet = await response.json();
    setFullResume({
      ...fullResume,
      workEntries: fullResume.workEntries.map((workEntry) => {
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

  const deleteWorkEntryBullet = async (
    workEntryBullet: ResumeWorkEntryBullet
  ) => {
    await fetch(`/api/resumeWorkEntryBullets/${workEntryBullet.pid}`, {
      method: "DELETE",
    });
    setFullResume({
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
    });
  };

  const moveWorkEntryBulletUp = async (
    workEntryBullet: ResumeWorkEntryBullet
  ) => {
    const workEntry = fullResume.workEntries.find(
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
    const orderedPids = bullets.map((item) => item.pid);
    await fetch(`/api/resumeWorkEntries/${workEntry.pid}/bullets/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedPids }),
    });
    setFullResume({
      ...fullResume,
    });
  };

  const moveWorkEntryBulletDown = async (
    workEntryBullet: ResumeWorkEntryBullet
  ) => {
    const workEntry = fullResume.workEntries.find(
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
    const orderedPids = bullets.map((item) => item.pid);
    await fetch(`/api/resumeWorkEntries/${workEntry.pid}/bullets/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedPids }),
    });
    setFullResume({
      ...fullResume,
    });
  };

  const createEducationEntry = async () => {
    const response = await fetch(
      `/api/resumes/${fullResume.pid}/educationEntries`,
      {
        method: "POST",
      }
    );
    const educationEntry: ResumeEducationEntry = await response.json();
    setFullResume({
      ...fullResume,
      educationEntries: [
        ...fullResume.educationEntries,
        {
          ...educationEntry,
          bullets: [],
        },
      ],
    });
  };

  const updateEducationEntry = async (educationEntry: ResumeEducationEntry) => {
    const response = await fetch(
      `/api/resumeEducationEntries/${educationEntry.pid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(educationEntry),
      }
    );
    const updatedEducationEntry: ResumeEducationEntry = await response.json();
    setFullResume({
      ...fullResume,
      educationEntries: fullResume.educationEntries.map((educationEntry) => {
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

  const deleteEducationEntry = async (educationEntry: ResumeEducationEntry) => {
    await fetch(`/api/resumeEducationEntries/${educationEntry.pid}`, {
      method: "DELETE",
    });
    setFullResume({
      ...fullResume,
      educationEntries: fullResume.educationEntries.filter(
        (e) => e.id !== educationEntry.id
      ),
    });
  };

  const moveEducationEntryUp = async (educationEntry: ResumeEducationEntry) => {
    const index = fullResume.educationEntries.findIndex(
      (item) => item.id === educationEntry.id
    );
    if (index > 0) {
      const swapIndex = index - 1;
      [
        fullResume.educationEntries[index],
        fullResume.educationEntries[swapIndex],
      ] = [
        fullResume.educationEntries[swapIndex],
        fullResume.educationEntries[index],
      ];
    } else {
      fullResume.educationEntries.push(fullResume.educationEntries.shift()!);
    }
    const orderedPids = fullResume.educationEntries.map((item) => item.pid);
    await fetch(`/api/resumes/${fullResume.pid}/educationEntries/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedPids }),
    });
    setFullResume({
      ...fullResume,
    });
  };

  const moveEducationEntryDown = async (
    educationEntry: ResumeEducationEntry
  ) => {
    const index = fullResume.educationEntries.findIndex(
      (item) => item.id === educationEntry.id
    );
    if (index < fullResume.educationEntries.length - 1) {
      const swapIndex = index + 1;
      [
        fullResume.educationEntries[index],
        fullResume.educationEntries[swapIndex],
      ] = [
        fullResume.educationEntries[swapIndex],
        fullResume.educationEntries[index],
      ];
    } else {
      fullResume.educationEntries.unshift(fullResume.educationEntries.pop()!);
    }
    const orderedPids = fullResume.educationEntries.map((item) => item.pid);
    await fetch(`/api/resumes/${fullResume.pid}/educationEntries/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedPids }),
    });
    setFullResume({
      ...fullResume,
    });
  };

  const createEducationEntryBullet = async (educationEntryPid: string) => {
    const response = await fetch(
      `/api/resumeEducationEntries/${educationEntryPid}/bullets`,
      {
        method: "POST",
      }
    );
    const educationEntryBullet: ResumeEducationEntryBullet =
      await response.json();
    setFullResume({
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
    });
  };

  const updateEducationEntryBullet = async (
    educationEntryBullet: ResumeEducationEntryBullet
  ) => {
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
    const updatedEducationEntryBullet: ResumeEducationEntryBullet =
      await response.json();
    setFullResume({
      ...fullResume,
      educationEntries: fullResume.educationEntries.map((educationEntry) => {
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
    educationEntryBullet: ResumeEducationEntryBullet
  ) => {
    await fetch(
      `/api/resumeEducationEntryBullets/${educationEntryBullet.pid}`,
      { method: "DELETE" }
    );
    setFullResume({
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
    });
  };

  const moveEducationEntryBulletUp = async (
    educationEntryBullet: ResumeEducationEntryBullet
  ) => {
    const educationEntry = fullResume.educationEntries.find(
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
    const orderedPids = bullets.map((item) => item.pid);
    await fetch(
      `/api/resumeEducationEntries/${educationEntry.pid}/bullets/order`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedPids }),
      }
    );
    setFullResume({
      ...fullResume,
    });
  };

  const moveEducationEntryBulletDown = async (
    educationEntryBullet: ResumeEducationEntryBullet
  ) => {
    const educationEntry = fullResume.educationEntries.find(
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
    const orderedPids = bullets.map((item) => item.pid);
    await fetch(
      `/api/resumeEducationEntries/${educationEntry.pid}/bullets/order`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedPids }),
      }
    );
    setFullResume({
      ...fullResume,
    });
  };

  const createCertification = async () => {
    const response = await fetch(
      `/api/resumes/${fullResume.pid}/certifications`,
      {
        method: "POST",
      }
    );
    const certification: ResumeCertification = await response.json();
    setFullResume({
      ...fullResume,
      certifications: [...fullResume.certifications, certification],
    });
  };

  const updateCertification = async (certification: ResumeCertification) => {
    const response = await fetch(
      `/api/resumeCertifications/${certification.pid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(certification),
      }
    );
    const updatedCertification: ResumeCertification = await response.json();
    setFullResume({
      ...fullResume,
      certifications: fullResume.certifications.map((certification) => {
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

  const deleteCertification = async (certification: ResumeCertification) => {
    await fetch(`/api/resumeCertifications/${certification.pid}`, {
      method: "DELETE",
    });
    setFullResume({
      ...fullResume,
      certifications: fullResume.certifications.filter(
        (c) => c.id !== certification.id
      ),
    });
  };

  const moveCertificationUp = async (certification: ResumeCertification) => {
    const index = fullResume.certifications.findIndex(
      (item) => item.id === certification.id
    );
    if (index > 0) {
      const swapIndex = index - 1;
      [fullResume.certifications[index], fullResume.certifications[swapIndex]] =
        [
          fullResume.certifications[swapIndex],
          fullResume.certifications[index],
        ];
    } else {
      fullResume.certifications.push(fullResume.certifications.shift()!);
    }
    const orderedPids = fullResume.certifications.map((item) => item.pid);
    await fetch(`/api/resumes/${fullResume.pid}/certifications/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedPids }),
    });
    setFullResume({
      ...fullResume,
    });
  };

  const moveCertificationDown = async (certification: ResumeCertification) => {
    const index = fullResume.certifications.findIndex(
      (item) => item.id === certification.id
    );
    if (index < fullResume.certifications.length - 1) {
      const swapIndex = index + 1;
      [fullResume.certifications[index], fullResume.certifications[swapIndex]] =
        [
          fullResume.certifications[swapIndex],
          fullResume.certifications[index],
        ];
    } else {
      fullResume.certifications.unshift(fullResume.certifications.pop()!);
    }
    const orderedPids = fullResume.certifications.map((item) => item.pid);
    await fetch(`/api/resumes/${fullResume.pid}/certifications/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedPids }),
    });
    setFullResume({
      ...fullResume,
    });
  };

  const createSkillCategory = async () => {
    const response = await fetch(
      `/api/resumes/${fullResume.pid}/skillCategories`,
      {
        method: "POST",
      }
    );
    const skillCategory: ResumeSkillCategory = await response.json();
    setFullResume({
      ...fullResume,
      skillCategories: [
        ...fullResume.skillCategories,
        {
          ...skillCategory,
          skills: [],
        },
      ],
    });
  };

  const updateSkillCategory = async (skillCategory: ResumeSkillCategory) => {
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
    const updatedSkillCategory: ResumeSkillCategory = await response.json();
    setFullResume({
      ...fullResume,
      skillCategories: fullResume.skillCategories.map((skillCategory) => {
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

  const deleteSkillCategory = async (skillCategory: ResumeSkillCategory) => {
    await fetch(`/api/resumeSkillCategories/${skillCategory.pid}`, {
      method: "DELETE",
    });
    setFullResume({
      ...fullResume,
      skillCategories: fullResume.skillCategories.filter(
        (s) => s.id !== skillCategory.id
      ),
    });
  };

  const moveSkillCategoryUp = async (skillCategory: ResumeSkillCategory) => {
    const index = fullResume.skillCategories.findIndex(
      (item) => item.id === skillCategory.id
    );
    if (index > 0) {
      const swapIndex = index - 1;
      [
        fullResume.skillCategories[index],
        fullResume.skillCategories[swapIndex],
      ] = [
        fullResume.skillCategories[swapIndex],
        fullResume.skillCategories[index],
      ];
    } else {
      fullResume.skillCategories.push(fullResume.skillCategories.shift()!);
    }
    const orderedPids = fullResume.skillCategories.map((item) => item.pid);
    await fetch(`/api/resumes/${fullResume.pid}/skillCategories/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedPids }),
    });
    setFullResume({
      ...fullResume,
    });
  };

  const moveSkillCategoryDown = async (skillCategory: ResumeSkillCategory) => {
    const index = fullResume.skillCategories.findIndex(
      (item) => item.id === skillCategory.id
    );
    if (index < fullResume.skillCategories.length - 1) {
      const swapIndex = index + 1;
      [
        fullResume.skillCategories[index],
        fullResume.skillCategories[swapIndex],
      ] = [
        fullResume.skillCategories[swapIndex],
        fullResume.skillCategories[index],
      ];
    } else {
      fullResume.skillCategories.unshift(fullResume.skillCategories.pop()!);
    }
    const orderedPids = fullResume.skillCategories.map((item) => item.pid);
    await fetch(`/api/resumes/${fullResume.pid}/skillCategories/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedPids }),
    });
    setFullResume({
      ...fullResume,
    });
  };

  const createSkill = async (skillCategoryPid: string) => {
    const response = await fetch(
      `/api/resumeSkillCategories/${skillCategoryPid}/skills`,
      {
        method: "POST",
      }
    );
    const skill: ResumeSkill = await response.json();
    setFullResume({
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
    });
  };

  const updateSkill = async (skill: ResumeSkill) => {
    const response = await fetch(`/api/resumeSkills/${skill.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skill),
    });
    const updatedSkill: ResumeSkill = await response.json();
    setFullResume({
      ...fullResume,
      skillCategories: fullResume.skillCategories.map((skillCategory) => {
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

  const deleteSkill = async (skill: ResumeSkill) => {
    await fetch(`/api/resumeSkills/${skill.pid}`, {
      method: "DELETE",
    });
    setFullResume({
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
    });
  };

  const moveSkillUp = async (skill: ResumeSkill) => {
    const skillCategory = fullResume.skillCategories.find(
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
    const orderedPids = skills.map((item) => item.pid);
    await fetch(
      `/api/resumeSkillCategories/${skillCategory.pid}/skills/order`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedPids }),
      }
    );
    setFullResume({
      ...fullResume,
    });
  };

  const moveSkillDown = async (skill: ResumeSkill) => {
    const skillCategory = fullResume.skillCategories.find(
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
    const orderedPids = skills.map((item) => item.pid);
    await fetch(
      `/api/resumeSkillCategories/${skillCategory.pid}/skills/order`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedPids }),
      }
    );
    setFullResume({
      ...fullResume,
    });
  };

  return (
    <div className="px-8 pb-28">
      <NextLink href={`/api/resumes/${fullResume.id}/downloadResume`}>
        DOWNLOAD RESUME
      </NextLink>
      {fullJob.contacts.length > 0 && (
        <>
          <br />
          <select
            value={selectedContactPid}
            onChange={(e) => setSelectedContactPid(e.target.value)}
          >
            {fullJob.contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <br />
        </>
      )}
      {selectedContactPid && (
        <>
          <NextLink
            href={`/api/resumes/${
              fullResume.id
            }/downloadCoverLetter?contactId=${selectedContactPid}&timezoneOffset=${new Date().getTimezoneOffset()}`}
          >
            DOWNLOAD COVER LETTER
          </NextLink>
          <br />
          <NextLink
            href={`/api/resumes/${
              fullResume.id
            }/downloadCoverLetter?contactId=${selectedContactPid}&timezoneOffset=${new Date().getTimezoneOffset()}&includeResume=true`}
          >
            DOWNLOAD COVER LETTER WITH RESUME
          </NextLink>
        </>
      )}
      <br />
      <NextLink href={`/resumes/${fullResume.id}/application`} target="_blank">
        APPLICATION
      </NextLink>
      <SectionHeading text="Basic Info" />
      <ResumeEditor
        resume={fullResume}
        updateResume={updateResume}
        generateSummaryPrompt={generateSummaryPrompt}
        generateCoverLetterPrompt={generateCoverLetterPrompt}
      />
      <SectionHeading text="Skills" />
      <div className="mt-6 flex flex-col gap-12">
        {fullResume.skillCategories.map((skillCategory) => (
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
        {fullResume.workEntries.map((workEntry) => (
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
        {fullResume.educationEntries.map((educationEntry) => (
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
        {fullResume.certifications.length > 0 && (
          <div className="flex flex-col gap-4">
            {fullResume.certifications.map((certification) => (
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
