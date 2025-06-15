import type { NextApiResponse } from "next";
import { ApplicationQuestion, Prisma } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";

export default makeApiHandler({
  POST: async (req, res: NextApiResponse<ApplicationQuestion>) => {
    const jobPid = req.query.jobPid as string;
    try {
      const applicationQuestion = await prisma.applicationQuestion.create({
        data: {
          question: "",
          answer: "",
          sortOrder: 0,
          Job: {
            connect: { pid: jobPid },
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
      return sendError(res, 500);
    }
  },
});
