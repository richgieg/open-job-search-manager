import { Prisma, ResumeCertification } from "@/generated/prisma";
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
  title: z.string().optional(),
  issuer: z.string().optional(),
  issueDate: z.string().optional(),
  enabled: z.boolean().optional(),
});

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<ResumeCertification>) => {
    const validatedPid = pidSchema.safeParse(req.query.certificationPid);
    const validatedBody = updateSchema.safeParse(req.body);
    if (!validatedPid.success || !validatedBody.success) {
      return sendError(res, 400);
    }
    try {
      const certification = await prisma.resumeCertification.update({
        where: {
          pid: validatedPid.data,
          resume: { job: { userId: user.id } },
        },
        data: validatedBody.data,
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
    const validatedPid = pidSchema.safeParse(req.query.certificationPid);
    if (!validatedPid.success) {
      return sendError(res, 400);
    }
    try {
      await prisma.resumeCertification.delete({
        where: {
          pid: validatedPid.data,
          resume: { job: { userId: user.id } },
        },
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
