import type { NextApiResponse } from "next";
import { Prisma, WorkEntryBullet } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { pidSchema } from "@/schemas";

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<WorkEntryBullet>) => {
    const validatedPid = pidSchema.safeParse(req.query.workEntryPid);
    if (!validatedPid.success) {
      return sendError(res, 400);
    }
    const maxSortOrderEntry = await prisma.workEntryBullet.findFirst({
      where: {
        workEntry: { pid: validatedPid.data, profile: { userId: user.id } },
      },
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
            connect: { pid: validatedPid.data, profile: { userId: user.id } },
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
