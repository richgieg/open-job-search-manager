import { Prisma, WorkEntry } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { NextApiResponse } from "next";

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<WorkEntry>) => {
    const workEntryPid = req.query.workEntryPid as string;
    try {
      const workEntry = await prisma.workEntry.update({
        where: { pid: workEntryPid },
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
      await prisma.workEntry.delete({
        where: { pid: workEntryPid },
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
