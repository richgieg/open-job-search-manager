import { Prisma, ResumeEducationEntry } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";
import { NextApiResponse } from "next";

export default makeApiHandler({
  PUT: async (req, res: NextApiResponse<ResumeEducationEntry>) => {
    const educationEntryPid = req.query.educationEntryPid as string;
    try {
      const educationEntry = await prisma.resumeEducationEntry.update({
        where: { pid: educationEntryPid },
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

  DELETE: async (req, res: NextApiResponse<void>) => {
    const educationEntryPid = req.query.educationEntryPid as string;
    try {
      await prisma.resumeEducationEntry.delete({
        where: { pid: educationEntryPid },
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
