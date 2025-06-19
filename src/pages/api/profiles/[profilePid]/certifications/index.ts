import type { NextApiResponse } from "next";
import { Certification, Prisma } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<Certification>) => {
    const profilePid = req.query.profilePid as string;
    const maxSortOrderEntry = await prisma.certification.findFirst({
      where: { profile: { pid: profilePid, userId: user.id } },
      orderBy: { sortOrder: "desc" },
    });
    const sortOrder = (maxSortOrderEntry?.sortOrder ?? -1) + 1;
    try {
      const certification = await prisma.certification.create({
        data: {
          title: "",
          issuer: "",
          issueDate: "2000-01-01",
          enabled: true,
          sortOrder,
          profile: {
            connect: { pid: profilePid, userId: user.id },
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
