import { EducationEntryBullet, Prisma } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { NextApiResponse } from "next";

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<EducationEntryBullet>) => {
    const educationEntryBulletPid = req.query.educationEntryBulletPid as string;
    try {
      const educationEntryBullet = await prisma.educationEntryBullet.update({
        where: { pid: educationEntryBulletPid },
        data: req.body,
      });
      return res.status(200).json(educationEntryBullet);
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
    const educationEntryBulletPid = req.query.educationEntryBulletPid as string;
    try {
      await prisma.educationEntryBullet.delete({
        where: { pid: educationEntryBulletPid },
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
