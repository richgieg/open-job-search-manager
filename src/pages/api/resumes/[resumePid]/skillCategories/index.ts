import type { NextApiResponse } from "next";
import { Prisma, ResumeSkillCategory } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";

export default makeApiHandler({
  POST: async (req, res: NextApiResponse<ResumeSkillCategory>) => {
    const resumePid = req.query.resumePid as string;
    const maxSortOrderEntry = await prisma.resumeSkillCategory.findFirst({
      where: { resume: { pid: resumePid } },
      orderBy: { sortOrder: "desc" },
    });
    const sortOrder = (maxSortOrderEntry?.sortOrder ?? -1) + 1;
    try {
      const skillCategory = await prisma.resumeSkillCategory.create({
        data: {
          name: "",
          enabled: true,
          sortOrder,
          resume: {
            connect: { pid: resumePid },
          },
        },
      });
      return sendResponse(res, 201, skillCategory);
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
