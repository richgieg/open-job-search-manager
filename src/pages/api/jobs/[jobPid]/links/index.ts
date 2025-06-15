import type { NextApiResponse } from "next";
import { Link, Prisma } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";

export default makeApiHandler({
  POST: async (req, res: NextApiResponse<Link>) => {
    const jobPid = req.query.jobPid as string;
    try {
      const link = await prisma.link.create({
        data: {
          name: "",
          url: "",
          sortOrder: 0,
          Job: {
            connect: { pid: jobPid },
          },
        },
      });
      return sendResponse(res, 201, link);
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
