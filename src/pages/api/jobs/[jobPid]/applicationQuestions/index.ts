import type { NextApiResponse } from "next";
import { ApplicationQuestion, Prisma } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<ApplicationQuestion>) => {
    const jobPid = req.query.jobPid as string;
    const maxSortOrderEntry = await prisma.applicationQuestion.findFirst({
      where: { job: { pid: jobPid, userId: user.id } },
      orderBy: { sortOrder: "desc" },
    });
    const sortOrder = (maxSortOrderEntry?.sortOrder ?? -1) + 1;
    try {
      const applicationQuestion = await prisma.applicationQuestion.create({
        data: {
          question: "",
          answer: "",
          sortOrder,
          job: {
            connect: { pid: jobPid, userId: user.id },
          },
        },
      });
      return sendResponse(res, 201, applicationQuestion);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return sendError(res, 404);
      }
      console.log(error);
      return sendError(res, 500);
    }
  },
});
