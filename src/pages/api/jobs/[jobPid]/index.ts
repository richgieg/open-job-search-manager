import type { NextApiResponse } from "next";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { Job, Prisma } from "@/generated/prisma";

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<Job>) => {
    const jobPid = req.query.jobPid as string;
    try {
      const job = await prisma.job.update({
        where: { pid: jobPid },
        data: req.body,
      });
      return res.status(200).json(job);
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
    const jobPid = req.query.jobPid as string;
    try {
      await prisma.job.delete({
        where: { pid: jobPid },
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
