import type { NextApiResponse } from "next";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { Prisma } from "@/generated/prisma";

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<void>) => {
    const workEntryPid = req.query.workEntryPid as string;
    const orderedPids = req.body.orderedPids as string[];
    try {
      await prisma.$transaction(
        orderedPids.map((pid, index) =>
          prisma.resumeWorkEntryBullet.update({
            where: {
              pid,
              workEntry: {
                pid: workEntryPid,
                resume: { job: { userId: user.id } },
              },
            },
            data: { sortOrder: index },
          })
        )
      );
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
