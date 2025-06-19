import { ApplicationQuestion, Prisma } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { NextApiResponse } from "next";

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<ApplicationQuestion>) => {
    const applicationQuestionPid = req.query.applicationQuestionPid as string;
    try {
      const applicationQuestion = await prisma.applicationQuestion.update({
        where: { pid: applicationQuestionPid, job: { userId: user.id } },
        data: req.body,
      });
      return res.status(200).json(applicationQuestion);
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
    const applicationQuestionPid = req.query.applicationQuestionPid as string;
    try {
      await prisma.applicationQuestion.delete({
        where: { pid: applicationQuestionPid, job: { userId: user.id } },
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
