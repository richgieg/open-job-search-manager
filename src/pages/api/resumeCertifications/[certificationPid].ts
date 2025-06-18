import { Prisma, ResumeCertification } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { NextApiResponse } from "next";

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<ResumeCertification>) => {
    const certificationPid = req.query.certificationPid as string;
    try {
      const certification = await prisma.resumeCertification.update({
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

  DELETE: async (user, req, res: NextApiResponse<void>) => {
    const certificationPid = req.query.certificationPid as string;
    try {
      await prisma.resumeCertification.delete({
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
