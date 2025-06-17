import { Prisma, SkillCategory } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";
import { NextApiResponse } from "next";

export default makeApiHandler({
  PUT: async (req, res: NextApiResponse<SkillCategory>) => {
    const skillCategoryPid = req.query.skillCategoryPid as string;
    try {
      const skillCategory = await prisma.skillCategory.update({
        where: { pid: skillCategoryPid },
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

  DELETE: async (req, res: NextApiResponse<void>) => {
    const skillCategoryPid = req.query.skillCategoryPid as string;
    try {
      await prisma.skillCategory.delete({
        where: { pid: skillCategoryPid },
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
