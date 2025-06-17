import { Certification, Prisma } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";
import { NextApiResponse } from "next";

export default makeApiHandler({
  PUT: async (req, res: NextApiResponse<Certification>) => {
    const certificationPid = req.query.certificationPid as string;
    try {
      const certification = await prisma.certification.update({
        where: { pid: certificationPid },
        data: req.body,
      });
      return res.status(200).json(certification);
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

  DELETE: async (req, res: NextApiResponse<void>) => {
    const certificationPid = req.query.certificationPid as string;
    try {
      await prisma.certification.delete({
        where: { pid: certificationPid },
      });
      return sendResponse(res, 204);
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
