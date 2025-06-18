import { Prisma, ResumeSkill } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";
import { NextApiResponse } from "next";

export default makeApiHandler({
  PUT: async (req, res: NextApiResponse<ResumeSkill>) => {
    const skillPid = req.query.skillPid as string;
    try {
      const skill = await prisma.resumeSkill.update({
        where: { pid: skillPid },
        data: req.body,
      });
      return res.status(200).json(skill);
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
    const skillPid = req.query.skillPid as string;
    try {
      await prisma.resumeSkill.delete({
        where: { pid: skillPid },
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
