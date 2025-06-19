import { Link, Prisma } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { pidSchema } from "@/schemas";
import { NextApiResponse } from "next";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
});

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<Link>) => {
    const validatedPid = pidSchema.safeParse(req.query.linkPid);
    const validatedBody = updateSchema.safeParse(req.body);
    if (!validatedPid.success || !validatedBody.success) {
      return sendError(res, 400);
    }
    try {
      const link = await prisma.link.update({
        where: { pid: validatedPid.data, job: { userId: user.id } },
        data: validatedBody.data,
      });
      return res.status(200).json(link);
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
    const validatedPid = pidSchema.safeParse(req.query.linkPid);
    if (!validatedPid.success) {
      return sendError(res, 400);
    }
    try {
      await prisma.link.delete({
        where: { pid: validatedPid.data, job: { userId: user.id } },
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
