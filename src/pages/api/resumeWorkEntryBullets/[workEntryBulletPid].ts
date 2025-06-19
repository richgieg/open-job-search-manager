import { Prisma, ResumeWorkEntryBullet } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { NextApiResponse } from "next";

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<ResumeWorkEntryBullet>) => {
    const workEntryBulletPid = req.query.workEntryBulletPid as string;
    try {
      const workEntryBullet = await prisma.resumeWorkEntryBullet.update({
        where: {
          pid: workEntryBulletPid,
          workEntry: { resume: { job: { userId: user.id } } },
        },
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
      await prisma.resumeWorkEntryBullet.delete({
        where: {
          pid: workEntryBulletPid,
          workEntry: { resume: { job: { userId: user.id } } },
        },
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
