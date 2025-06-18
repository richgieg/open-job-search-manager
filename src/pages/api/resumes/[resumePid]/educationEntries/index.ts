import type { NextApiResponse } from "next";
import { Prisma, ResumeEducationEntry } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";

export default makeApiHandler({
  POST: async (req, res: NextApiResponse<ResumeEducationEntry>) => {
    const resumePid = req.query.resumePid as string;
    const maxSortOrderEntry = await prisma.resumeEducationEntry.findFirst({
      where: { resume: { pid: resumePid } },
      orderBy: { sortOrder: "desc" },
    });
    const sortOrder = (maxSortOrderEntry?.sortOrder ?? -1) + 1;
    try {
      const educationEntry = await prisma.resumeEducationEntry.create({
        data: {
          schoolName: "",
          schoolLocation: "",
          title: "",
          graduationDate: "2000-01-01",
          enabled: true,
          sortOrder,
          resume: {
            connect: { pid: resumePid },
          },
        },
      });
      return sendResponse(res, 201, educationEntry);
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
