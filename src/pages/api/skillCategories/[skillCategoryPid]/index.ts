import { Prisma, SkillCategory } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { NextApiResponse } from "next";

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<SkillCategory>) => {
    const skillCategoryPid = req.query.skillCategoryPid as string;
    try {
      const skillCategory = await prisma.skillCategory.update({
        where: { pid: skillCategoryPid, profile: { userId: user.id } },
        data: req.body,
      });
      return res.status(200).json(skillCategory);
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

  DELETE: async (user, req, res: NextApiResponse<void>) => {
    const skillCategoryPid = req.query.skillCategoryPid as string;
    try {
      await prisma.skillCategory.delete({
        where: { pid: skillCategoryPid, profile: { userId: user.id } },
      });
      return sendResponse(res, 204);
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
