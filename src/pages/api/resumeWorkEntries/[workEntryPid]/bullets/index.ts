import type { NextApiResponse } from "next";
import { Prisma, ResumeWorkEntryBullet } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<ResumeWorkEntryBullet>) => {
    const workEntryPid = req.query.workEntryPid as string;
    const maxSortOrderEntry = await prisma.resumeWorkEntryBullet.findFirst({
      where: {
        workEntry: { pid: workEntryPid, resume: { job: { userId: user.id } } },
      },
      orderBy: { sortOrder: "desc" },
    });
    const sortOrder = (maxSortOrderEntry?.sortOrder ?? -1) + 1;
    try {
      const workEntryBullet = await prisma.resumeWorkEntryBullet.create({
        data: {
          text: "",
          enabled: true,
          sortOrder,
          workEntry: {
            connect: {
              pid: workEntryPid,
              resume: { job: { userId: user.id } },
            },
          },
        },
      });
      return sendResponse(res, 201, workEntryBullet);
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
