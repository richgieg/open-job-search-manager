import { Prisma, Profile } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { NextApiResponse } from "next";

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<Profile>) => {
    const profilePid = req.query.profilePid as string;
    try {
      const profile = await prisma.profile.update({
        where: { pid: profilePid },
        data: req.body,
      });
      return res.status(200).json(profile);
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
    const profilePid = req.query.profilePid as string;
    try {
      await prisma.profile.delete({
        where: { pid: profilePid },
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
