import { Prisma, ResumeWorkEntry } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { NextApiResponse } from "next";

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<ResumeWorkEntry>) => {
    const workEntryPid = req.query.workEntryPid as string;
    try {
      const workEntry = await prisma.resumeWorkEntry.update({
        where: { pid: workEntryPid, resume: { job: { userId: user.id } } },
        data: req.body,
      });
      return res.status(200).json(workEntry);
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
    const workEntryPid = req.query.workEntryPid as string;
    try {
      await prisma.resumeWorkEntry.delete({
        where: { pid: workEntryPid, resume: { job: { userId: user.id } } },
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
