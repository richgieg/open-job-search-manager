import { Paragraph, TextRun } from "docx";
import { t } from "@/translate";
import { header } from "./header";
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
import { dateStringToDate } from "@/lib";

const HEADING_SPACING_BEFORE = 400;
const SECTION_SPACING_BEFORE = 200;
const BULLET_SPACING_LINE = 230;
const BULLET_SPACING_AFTER = 80;

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

export function resume(
  data: (FullProfile & { allowPageBreaks: boolean }) | FullResume
): Paragraph[] {
  const paragraphs = [header(data)];

  const summary = data.summary.trim();

  if (summary) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: "PROFESSIONAL SUMMARY", bold: true })],
        spacing: { before: HEADING_SPACING_BEFORE },
        keepNext: true,
        keepLines: true,
      })
    );

    const summaryParagraphs = data.summary
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p !== "");

    paragraphs.push(
      ...summaryParagraphs.map(
        (summaryParagraph) =>
          new Paragraph({
            text: summaryParagraph,
            spacing: {
              before: SECTION_SPACING_BEFORE,
            },
          })
      )
    );
  }

  const enabledSkillCategories = data.skillCategories.filter((e) => e.enabled);

  if (enabledSkillCategories.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: "SKILLS", bold: true })],
        spacing: { before: HEADING_SPACING_BEFORE },
        keepNext: true,
        keepLines: true,
      })
    );

    for (let i = 0; i < enabledSkillCategories.length; i++) {
      const skillCategory = enabledSkillCategories[i];
      const enabledSkills = skillCategory.skills.filter((s) => s.enabled);
      const spaceBefore = i === 0 ? 200 : 100;
      if (i < enabledSkillCategories.length - 1) {
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: `${skillCategory.name}: `, bold: true }),
              new TextRun(enabledSkills.map((s) => s.text).join(", ")),
            ],
            spacing: { before: spaceBefore },
            keepNext: !data.allowPageBreaks,
            keepLines: !data.allowPageBreaks,
          })
        );
      } else {
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: `${skillCategory.name}: `, bold: true }),
              new TextRun(enabledSkills.map((s) => s.text).join(", ")),
            ],
            spacing: { before: spaceBefore },
          })
        );
      }
    }
  }

  const enabledWorkEntries = data.workEntries.filter((e) => e.enabled);

  if (enabledWorkEntries.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: "WORK EXPERIENCE", bold: true })],
        spacing: { before: HEADING_SPACING_BEFORE },
        keepNext: true,
        keepLines: true,
      })
    );

    for (const workEntry of enabledWorkEntries) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: workEntry.title, bold: true })],
          spacing: { before: SECTION_SPACING_BEFORE },
          keepNext: true,
          keepLines: true,
        })
      );

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun(workEntry.companyName),
            new TextRun("  |  "),
            // new TextRun(workEntry.companyLocation),
            // new TextRun("  |  "),
            new TextRun(t.jobType[workEntry.type]),
            new TextRun("  |  "),
            new TextRun(t.jobArrangement[workEntry.arrangement]),
          ],
          keepNext: true,
          keepLines: true,
        })
      );

      const startDate = dateStringToDate(workEntry.startDate);
      const startMonth = startDate.toLocaleString("default", { month: "long" });
      const startYear = startDate.getFullYear();
      const startDateText = `${startMonth.slice(0, 3)} ${startYear}`;

      let endDateText: string;
      if (workEntry.endDate) {
        const endDate = dateStringToDate(workEntry.endDate);
        const endMonth = endDate.toLocaleString("default", { month: "long" });
        const endYear = endDate.getFullYear();
        endDateText = `${endMonth.slice(0, 3)} ${endYear}`;
      } else {
        endDateText = "Present";
      }

      const enabledBullets = workEntry.bullets.filter((b) => b.enabled);

      paragraphs.push(
        new Paragraph({
          text: `${startDateText} - ${endDateText}`,
          spacing: { after: 150 },
          keepNext: enabledBullets.length > 0,
          keepLines: enabledBullets.length > 0,
        })
      );

      for (let i = 0; i < enabledBullets.length; i++) {
        const bullet = enabledBullets[i];
        if (i < enabledBullets.length - 1) {
          paragraphs.push(
            new Paragraph({
              text: bullet.text,
              bullet: { level: 0 },
              spacing: {
                line: BULLET_SPACING_LINE,
                after: BULLET_SPACING_AFTER,
              },
              keepNext: !data.allowPageBreaks,
              keepLines: !data.allowPageBreaks,
            })
          );
        } else {
          paragraphs.push(
            new Paragraph({
              text: bullet.text,
              bullet: { level: 0 },
              spacing: { line: BULLET_SPACING_LINE },
            })
          );
        }
      }
    }
  }

  const enabledEducationEntries = data.educationEntries.filter(
    (e) => e.enabled
  );

  if (enabledEducationEntries.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: "EDUCATION", bold: true })],
        spacing: { before: HEADING_SPACING_BEFORE },
        keepNext: true,
        keepLines: true,
      })
    );

    for (const educationEntry of enabledEducationEntries) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: educationEntry.title, bold: true })],
          spacing: { before: SECTION_SPACING_BEFORE },
          keepNext: true,
          keepLines: true,
        })
      );

      const graduationDate = dateStringToDate(educationEntry.graduationDate);
      const graduationMonth = graduationDate.toLocaleString("default", {
        month: "long",
      });
      const graduationYear = graduationDate.getFullYear();

      const enabledBullets = educationEntry.bullets.filter((b) => b.enabled);

      paragraphs.push(
        new Paragraph({
          text: `${educationEntry.schoolName}  |  ${graduationMonth} ${graduationYear}`,
          spacing: { after: 150 },
          keepNext: enabledBullets.length > 0,
          keepLines: enabledBullets.length > 0,
        })
      );

      for (let i = 0; i < enabledBullets.length; i++) {
        const bullet = enabledBullets[i];
        if (i < enabledBullets.length - 1) {
          paragraphs.push(
            new Paragraph({
              text: bullet.text,
              bullet: { level: 0 },
              spacing: {
                line: BULLET_SPACING_LINE,
                after: BULLET_SPACING_AFTER,
              },
              keepNext: !data.allowPageBreaks,
              keepLines: !data.allowPageBreaks,
            })
          );
        } else {
          paragraphs.push(
            new Paragraph({
              text: bullet.text,
              bullet: { level: 0 },
              spacing: { line: BULLET_SPACING_LINE },
            })
          );
        }
      }
    }
  }

  const enabledCertifications = data.certifications.filter((e) => e.enabled);

  if (enabledCertifications.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: "CERTIFICATIONS", bold: true })],
        spacing: { before: HEADING_SPACING_BEFORE },
        keepNext: true,
        keepLines: true,
      })
    );

    for (let i = 0; i < enabledCertifications.length; i++) {
      const certification = enabledCertifications[i];
      const spaceBefore = i === 0 ? 200 : 100;
      const issueDate = dateStringToDate(certification.issueDate);
      const issueMonth = issueDate.toLocaleString("default", { month: "long" });
      const issueYear = issueDate.getFullYear();
      if (i < enabledCertifications.length - 1) {
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: `${certification.title}`, bold: true }),
              new TextRun("  |  "),
              new TextRun(certification.issuer),
              new TextRun("  |  "),
              new TextRun(`${issueMonth} ${issueYear}`),
            ],
            spacing: { before: spaceBefore },
            keepNext: !data.allowPageBreaks,
            keepLines: !data.allowPageBreaks,
          })
        );
      } else {
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: `${certification.title}`, bold: true }),
              new TextRun("  |  "),
              new TextRun(certification.issuer),
              new TextRun("  |  "),
              new TextRun(`${issueMonth} ${issueYear}`),
            ],
            spacing: { before: spaceBefore },
          })
        );
      }
    }
  }

  return paragraphs;
}
