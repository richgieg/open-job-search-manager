import type { NextApiResponse } from "next";
import { Prisma, ResumeSkillCategory } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { pidSchema } from "@/schemas";

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<ResumeSkillCategory>) => {
    const validatedPid = pidSchema.safeParse(req.query.resumePid);
    if (!validatedPid.success) {
      return sendError(res, 400);
    }
    const maxSortOrderEntry = await prisma.resumeSkillCategory.findFirst({
      where: { resume: { pid: validatedPid.data, job: { userId: user.id } } },
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
            connect: { pid: validatedPid.data, job: { userId: user.id } },
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
