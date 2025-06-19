import type { NextApiResponse } from "next";
import { Prisma, WorkEntry } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { pidSchema } from "@/schemas";

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<WorkEntry>) => {
    const validatedPid = pidSchema.safeParse(req.query.profilePid);
    if (!validatedPid.success) {
      return sendError(res, 400);
    }
    const maxSortOrderEntry = await prisma.workEntry.findFirst({
      where: { profile: { pid: validatedPid.data, userId: user.id } },
      orderBy: { sortOrder: "desc" },
    });
    const sortOrder = (maxSortOrderEntry?.sortOrder ?? -1) + 1;
    try {
      const workEntry = await prisma.workEntry.create({
        data: {
          companyName: "",
          companyLocation: "",
          title: "",
          type: "fullTime",
          arrangement: "onSite",
          startDate: "2000-01-01",
          enabled: true,
          sortOrder,
          profile: {
            connect: { pid: validatedPid.data, userId: user.id },
          },
        },
      });
      return sendResponse(res, 201, workEntry);
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
