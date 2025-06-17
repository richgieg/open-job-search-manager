import type { NextApiResponse } from "next";
import { ApplicationQuestion, Prisma } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";

export default makeApiHandler({
  POST: async (req, res: NextApiResponse<ApplicationQuestion>) => {
    const jobPid = req.query.jobPid as string;
    const maxSortOrderEntry = await prisma.applicationQuestion.findFirst({
      where: { Job: { pid: jobPid } },
      orderBy: { sortOrder: "desc" },
    });
    const sortOrder = (maxSortOrderEntry?.sortOrder ?? -1) + 1;
    try {
      const applicationQuestion = await prisma.applicationQuestion.create({
        data: {
          question: "",
          answer: "",
          sortOrder,
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
