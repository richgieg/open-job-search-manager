import { EducationEntry, Prisma } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { NextApiResponse } from "next";

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<EducationEntry>) => {
    const educationEntryPid = req.query.educationEntryPid as string;
    try {
      const educationEntry = await prisma.educationEntry.update({
        where: { pid: educationEntryPid, profile: { userId: user.id } },
        data: req.body,
      });
      return res.status(200).json(educationEntry);
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
    const educationEntryPid = req.query.educationEntryPid as string;
    try {
      await prisma.educationEntry.delete({
        where: { pid: educationEntryPid, profile: { userId: user.id } },
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
