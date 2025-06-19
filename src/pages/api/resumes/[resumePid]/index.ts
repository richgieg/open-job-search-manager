import { Prisma, Resume } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { NextApiResponse } from "next";

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<Resume>) => {
    const resumePid = req.query.resumePid as string;
    try {
      const resume = await prisma.resume.update({
        where: { pid: resumePid, job: { userId: user.id } },
        data: req.body,
      });
      return res.status(200).json(resume);
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
    const resumePid = req.query.resumePid as string;
    try {
      await prisma.resume.delete({
        where: { pid: resumePid, job: { userId: user.id } },
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
