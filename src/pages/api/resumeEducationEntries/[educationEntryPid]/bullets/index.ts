import type { NextApiResponse } from "next";
import { Prisma, ResumeEducationEntryBullet } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";

export default makeApiHandler({
  POST: async (req, res: NextApiResponse<ResumeEducationEntryBullet>) => {
    const educationEntryPid = req.query.educationEntryPid as string;
    const maxSortOrderEntry = await prisma.resumeEducationEntryBullet.findFirst(
      {
        where: { educationEntry: { pid: educationEntryPid } },
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
              connect: { pid: educationEntryPid },
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
