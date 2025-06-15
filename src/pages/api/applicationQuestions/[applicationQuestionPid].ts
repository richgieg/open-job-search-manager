import { ApplicationQuestion, Prisma } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";
import { NextApiResponse } from "next";

export default makeApiHandler({
  PUT: async (req, res: NextApiResponse<ApplicationQuestion>) => {
    const applicationQuestionPid = req.query.applicationQuestionPid as string;
    try {
      const instructor = await prisma.applicationQuestion.update({
        where: { pid: applicationQuestionPid },
        data: req.body,
      });
      return res.status(200).json(instructor);
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
    const applicationQuestionPid = req.query.applicationQuestionPid as string;
    try {
      await prisma.applicationQuestion.delete({
        where: { pid: applicationQuestionPid },
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
