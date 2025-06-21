import { useFullResumeContext } from "./FullResumeContext";
import type { FullJob } from "@/types";

export function usePromptGenerators(fullJob: FullJob) {
  const { fullResume } = useFullResumeContext();

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

  return { generateSummaryPrompt, generateCoverLetterPrompt };
}
