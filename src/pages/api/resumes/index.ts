import type { NextApiResponse } from "next";
import { Prisma, Resume } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<Resume>) => {
    const jobPid = req.body.jobPid as string;
    const profilePid = req.body.profilePid as string;
    const fullProfile = await prisma.profile.findUnique({
      where: { pid: profilePid, userId: user.id },
      include: {
        workEntries: {
          orderBy: { sortOrder: "asc" },
          include: { bullets: { orderBy: { sortOrder: "asc" } } },
        },
        educationEntries: {
          orderBy: { sortOrder: "asc" },
          include: { bullets: { orderBy: { sortOrder: "asc" } } },
        },
        certifications: { orderBy: { sortOrder: "asc" } },
        skillCategories: {
          orderBy: { sortOrder: "asc" },
          include: { skills: { orderBy: { sortOrder: "asc" } } },
        },
      },
    });
    if (!fullProfile) {
      return sendError(res, 404);
    }
    try {
      const resume = await prisma.$transaction(async (tx) => {
        const newResume = await tx.resume.create({
          data: {
            resumeName: "",
            name: fullProfile.name,
            location: fullProfile.location,
            phone: fullProfile.phone,
            email: fullProfile.email,
            websiteText: fullProfile.websiteText,
            websiteLink: fullProfile.websiteLink,
            summary: fullProfile.summary,
            coverLetter: fullProfile.coverLetter,
            allowPageBreaks: true,
            template: "template01",
            profile: {
              connect: { pid: profilePid, userId: user.id },
            },
            job: {
              connect: { pid: jobPid, userId: user.id },
            },
          },
        });
        for (const workEntry of fullProfile.workEntries) {
          const newWorkEntry = await tx.resumeWorkEntry.create({
            data: {
              resumeId: newResume.id,
              companyName: workEntry.companyName,
              companyLocation: workEntry.companyLocation,
              title: workEntry.title,
              type: workEntry.type,
              arrangement: workEntry.arrangement,
              startDate: workEntry.startDate,
              endDate: workEntry.endDate,
              enabled: workEntry.enabled,
              sortOrder: workEntry.sortOrder,
            },
          });
          for (const bullet of workEntry.bullets) {
            await tx.resumeWorkEntryBullet.create({
              data: {
                workEntryId: newWorkEntry.id,
                text: bullet.text,
                enabled: bullet.enabled,
                sortOrder: bullet.sortOrder,
              },
            });
          }
        }
        for (const educationEntry of fullProfile.educationEntries) {
          const newEducationEntry = await tx.resumeEducationEntry.create({
            data: {
              resumeId: newResume.id,
              schoolName: educationEntry.schoolName,
              schoolLocation: educationEntry.schoolLocation,
              title: educationEntry.title,
              graduationDate: educationEntry.graduationDate,
              enabled: educationEntry.enabled,
              sortOrder: educationEntry.sortOrder,
            },
          });
          for (const bullet of educationEntry.bullets) {
            await tx.resumeEducationEntryBullet.create({
              data: {
                educationEntryId: newEducationEntry.id,
                text: bullet.text,
                enabled: bullet.enabled,
                sortOrder: bullet.sortOrder,
              },
            });
          }
        }
        for (const certification of fullProfile.certifications) {
          await tx.resumeCertification.create({
            data: {
              resumeId: newResume.id,
              title: certification.title,
              issuer: certification.issuer,
              issueDate: certification.issueDate,
              enabled: certification.enabled,
              sortOrder: certification.sortOrder,
            },
          });
        }
        for (const skillCategory of fullProfile.skillCategories) {
          const newSkillCategory = await tx.resumeSkillCategory.create({
            data: {
              resumeId: newResume.id,
              name: skillCategory.name,
              enabled: skillCategory.enabled,
              sortOrder: skillCategory.sortOrder,
            },
          });
          for (const skill of skillCategory.skills) {
            await tx.resumeSkill.create({
              data: {
                skillCategoryId: newSkillCategory.id,
                text: skill.text,
                enabled: skill.enabled,
                sortOrder: skill.sortOrder,
              },
            });
          }
        }
        return newResume;
      });
      return sendResponse(res, 201, resume);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return sendError(res, 404);
      }
      return sendError(res, 500);
    }
  },
});
