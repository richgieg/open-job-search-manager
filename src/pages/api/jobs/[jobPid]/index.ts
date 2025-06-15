import type { NextApiResponse } from "next";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";
import { Prisma } from "@/generated/prisma";

export default makeApiHandler({
  DELETE: async (req, res: NextApiResponse<void>) => {
    const jobPid = req.query.jobPid as string;
    try {
      await prisma.job.delete({
        where: { pid: jobPid },
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
