import type { NextApiResponse } from "next";
import { Prisma, ResumeEducationEntryBullet } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<ResumeEducationEntryBullet>) => {
    const educationEntryPid = req.query.educationEntryPid as string;
    const maxSortOrderEntry = await prisma.resumeEducationEntryBullet.findFirst(
      {
        where: {
          educationEntry: {
            pid: educationEntryPid,
            resume: { job: { userId: user.id } },
          },
        },
        orderBy: { sortOrder: "desc" },
      }
    );
    const sortOrder = (maxSortOrderEntry?.sortOrder ?? -1) + 1;
    try {
      const educationEntryBullet =
        await prisma.resumeEducationEntryBullet.create({
          data: {
            text: "",
            enabled: true,
            sortOrder,
            educationEntry: {
              connect: {
                pid: educationEntryPid,
                resume: { job: { userId: user.id } },
              },
            },
          },
        });
      return sendResponse(res, 201, educationEntryBullet);
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
