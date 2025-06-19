import type { NextApiResponse } from "next";
import { Prisma, ResumeSkill } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<ResumeSkill>) => {
    const skillCategoryPid = req.query.skillCategoryPid as string;
    const maxSortOrderEntry = await prisma.resumeSkill.findFirst({
      where: {
        skillCategory: {
          pid: skillCategoryPid,
          resume: { job: { userId: user.id } },
        },
      },
      orderBy: { sortOrder: "desc" },
    });
    const sortOrder = (maxSortOrderEntry?.sortOrder ?? -1) + 1;
    try {
      const skill = await prisma.resumeSkill.create({
        data: {
          text: "",
          enabled: true,
          sortOrder,
          skillCategory: {
            connect: {
              pid: skillCategoryPid,
              resume: { job: { userId: user.id } },
            },
          },
        },
      });
      return sendResponse(res, 201, skill);
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
