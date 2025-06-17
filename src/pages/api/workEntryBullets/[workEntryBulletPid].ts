import { Prisma, WorkEntryBullet } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";
import { NextApiResponse } from "next";

export default makeApiHandler({
  PUT: async (req, res: NextApiResponse<WorkEntryBullet>) => {
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

  DELETE: async (req, res: NextApiResponse<void>) => {
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
