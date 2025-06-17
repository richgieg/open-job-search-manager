import type { NextApiResponse } from "next";
import { Prisma, WorkEntryBullet } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";

export default makeApiHandler({
  POST: async (req, res: NextApiResponse<WorkEntryBullet>) => {
    const workEntryPid = req.query.workEntryPid as string;
    const maxSortOrderEntry = await prisma.workEntryBullet.findFirst({
      where: { workEntry: { pid: workEntryPid } },
      orderBy: { sortOrder: "desc" },
    });
    const sortOrder = (maxSortOrderEntry?.sortOrder ?? -1) + 1;
    try {
      const workEntryBullet = await prisma.workEntryBullet.create({
        data: {
          text: "",
          enabled: true,
          sortOrder,
          workEntry: {
            connect: { pid: workEntryPid },
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
