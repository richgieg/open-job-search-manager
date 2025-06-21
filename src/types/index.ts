import type {
  ApplicationQuestion,
  Certification,
  Contact,
  EducationEntry,
  EducationEntryBullet,
  Job,
  Link,
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

export type JobWithLinks = Job & { links: Link[] };

export type FullJob = Job & {
  resumes: Resume[];
  links: Link[];
  contacts: Contact[];
  applicationQuestions: ApplicationQuestion[];
};

export type FullProfile = Profile & {
  workEntries: (WorkEntry & { bullets: WorkEntryBullet[] })[];
  educationEntries: (EducationEntry & { bullets: EducationEntryBullet[] })[];
  certifications: Certification[];
  skillCategories: (SkillCategory & { skills: Skill[] })[];
};

export type FullResume = Resume & {
  workEntries: (ResumeWorkEntry & { bullets: ResumeWorkEntryBullet[] })[];
  educationEntries: (ResumeEducationEntry & {
    bullets: ResumeEducationEntryBullet[];
  })[];
  certifications: ResumeCertification[];
  skillCategories: (ResumeSkillCategory & { skills: ResumeSkill[] })[];
  profile: Profile | null;
  job: Job;
};
