import { Profile } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { pidSchema } from "@/schemas";
import { NextApiResponse } from "next";

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<Profile>) => {
    const validatedPid = pidSchema.safeParse(req.query.profilePid);
    if (!validatedPid.success) {
      return sendError(res, 400);
    }
    const original = await prisma.profile.findUnique({
      where: { pid: validatedPid.data, userId: user.id },
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
    if (!original) {
      return sendError(res, 404);
    }
    const duplicated = await prisma.$transaction(async (tx) => {
      const newProfile = await tx.profile.create({
        data: {
          userId: original.userId,
          profileName: original.profileName,
          jobTitle: original.jobTitle,
          name: original.name,
          location: original.location,
          phone: original.phone,
          email: original.email,
          websiteText: original.websiteText,
          websiteLink: original.websiteLink,
          summary: original.summary,
          coverLetter: original.coverLetter,
        },
      });
      for (const workEntry of original.workEntries) {
        const newWorkEntry = await tx.workEntry.create({
          data: {
            profileId: newProfile.id,
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
          await tx.workEntryBullet.create({
            data: {
              workEntryId: newWorkEntry.id,
              text: bullet.text,
              enabled: bullet.enabled,
              sortOrder: bullet.sortOrder,
            },
          });
        }
      }
      for (const educationEntry of original.educationEntries) {
        const newEducationEntry = await tx.educationEntry.create({
          data: {
            profileId: newProfile.id,
            schoolName: educationEntry.schoolName,
            schoolLocation: educationEntry.schoolLocation,
            title: educationEntry.title,
            graduationDate: educationEntry.graduationDate,
            enabled: educationEntry.enabled,
            sortOrder: educationEntry.sortOrder,
          },
        });
        for (const bullet of educationEntry.bullets) {
          await tx.educationEntryBullet.create({
            data: {
              educationEntryId: newEducationEntry.id,
              text: bullet.text,
              enabled: bullet.enabled,
              sortOrder: bullet.sortOrder,
            },
          });
        }
      }
      for (const certification of original.certifications) {
        await tx.certification.create({
          data: {
            profileId: newProfile.id,
            title: certification.title,
            issuer: certification.issuer,
            issueDate: certification.issueDate,
            enabled: certification.enabled,
            sortOrder: certification.sortOrder,
          },
        });
      }
      for (const skillCategory of original.skillCategories) {
        const newSkillCategory = await tx.skillCategory.create({
          data: {
            profileId: newProfile.id,
            name: skillCategory.name,
            enabled: skillCategory.enabled,
            sortOrder: skillCategory.sortOrder,
          },
        });
        for (const skill of skillCategory.skills) {
          await tx.skill.create({
            data: {
              skillCategoryId: newSkillCategory.id,
              text: skill.text,
              enabled: skill.enabled,
              sortOrder: skill.sortOrder,
            },
          });
        }
      }
      return newProfile;
    });
    return sendResponse(res, 200, duplicated);
  },
});
