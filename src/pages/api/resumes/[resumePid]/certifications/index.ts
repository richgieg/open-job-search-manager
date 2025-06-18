import type { NextApiResponse } from "next";
import { ResumeCertification, Prisma } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";

export default makeApiHandler({
  POST: async (req, res: NextApiResponse<ResumeCertification>) => {
    const resumePid = req.query.resumePid as string;
    const maxSortOrderEntry = await prisma.resumeCertification.findFirst({
      where: { resume: { pid: resumePid } },
      orderBy: { sortOrder: "desc" },
    });
    const sortOrder = (maxSortOrderEntry?.sortOrder ?? -1) + 1;
    try {
      const certification = await prisma.resumeCertification.create({
        data: {
          title: "",
          issuer: "",
          issueDate: "2000-01-01",
          enabled: true,
          sortOrder,
          resume: {
            connect: { pid: resumePid },
          },
        },
      });
      return sendResponse(res, 201, certification);
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
