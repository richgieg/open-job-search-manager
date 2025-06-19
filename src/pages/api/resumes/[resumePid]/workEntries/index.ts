import type { NextApiResponse } from "next";
import { Prisma, ResumeWorkEntry } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<ResumeWorkEntry>) => {
    const resumePid = req.query.resumePid as string;
    const maxSortOrderEntry = await prisma.resumeWorkEntry.findFirst({
      where: { resume: { pid: resumePid, job: { userId: user.id } } },
      orderBy: { sortOrder: "desc" },
    });
    const sortOrder = (maxSortOrderEntry?.sortOrder ?? -1) + 1;
    try {
      const workEntry = await prisma.resumeWorkEntry.create({
        data: {
          companyName: "",
          companyLocation: "",
          title: "",
          type: "fullTime",
          arrangement: "onSite",
          startDate: "2000-01-01",
          enabled: true,
          sortOrder,
          resume: {
            connect: { pid: resumePid, job: { userId: user.id } },
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
