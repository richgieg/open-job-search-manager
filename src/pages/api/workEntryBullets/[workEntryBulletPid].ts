import { Prisma, WorkEntryBullet } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { NextApiResponse } from "next";

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<WorkEntryBullet>) => {
    const workEntryBulletPid = req.query.workEntryBulletPid as string;
    try {
      const workEntryBullet = await prisma.workEntryBullet.update({
        where: { pid: workEntryBulletPid },
        data: req.body,
      });
      return res.status(200).json(workEntryBullet);
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
    const workEntryBulletPid = req.query.workEntryBulletPid as string;
    try {
      await prisma.workEntryBullet.delete({
        where: { pid: workEntryBulletPid },
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
