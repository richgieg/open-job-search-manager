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
    const educationEntryPid = req.query.educationEntryPid as string;
    const orderedPids = req.body.orderedPids as string[];
    try {
      await prisma.$transaction(
        orderedPids.map((pid, index) =>
          prisma.educationEntryBullet.update({
            where: {
              pid,
              educationEntry: {
                pid: educationEntryPid,
                profile: { userId: user.id },
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
