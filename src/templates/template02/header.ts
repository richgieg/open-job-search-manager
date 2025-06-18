import {
  Certification,
  EducationEntry,
  EducationEntryBullet,
  Job,
  Profile,
  Resume,
  ResumeCertification,
  ResumeEducationEntry,
  ResumeEducationEntryBullet,
  ResumeSkill,
  ResumeSkillCategory,
  ResumeWorkEntry,
  ResumeWorkEntryBullet,
  Skill,
  SkillCategory,
  WorkEntry,
  WorkEntryBullet,
} from "@/generated/prisma";
import { ExternalHyperlink, Paragraph, TextRun } from "docx";

const FONT_SIZE = 28;

type FullProfile = Profile & {
  workEntries: (WorkEntry & { bullets: WorkEntryBullet[] })[];
  educationEntries: (EducationEntry & { bullets: EducationEntryBullet[] })[];
  certifications: Certification[];
  skillCategories: (SkillCategory & { skills: Skill[] })[];
};

type FullResume = Resume & {
  workEntries: (ResumeWorkEntry & { bullets: ResumeWorkEntryBullet[] })[];
  educationEntries: (ResumeEducationEntry & {
    bullets: ResumeEducationEntryBullet[];
  })[];
  certifications: ResumeCertification[];
  skillCategories: (ResumeSkillCategory & { skills: ResumeSkill[] })[];
  profile: Profile | null;
  job: Job;
};

export function header(data: FullProfile | FullResume): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${data.name}  |  ${data.location}  |  ${data.phone}  |  `,
        size: FONT_SIZE,
      }),
      new ExternalHyperlink({
        link: `mailto:${data.email}`,
        children: [new TextRun({ text: data.email, size: FONT_SIZE })],
      }),
      new TextRun({ text: `  |  `, size: FONT_SIZE }),
      new ExternalHyperlink({
        link: data.websiteLink,
        children: [new TextRun({ text: data.websiteText, size: FONT_SIZE })],
      }),
    ],
    pageBreakBefore: true,
  });
}
