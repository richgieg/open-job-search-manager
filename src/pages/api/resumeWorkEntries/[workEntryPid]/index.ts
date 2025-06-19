import { Prisma, ResumeWorkEntry } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { jobArrangementSchema, jobTypeSchema, pidSchema } from "@/schemas";
import { NextApiResponse } from "next";
import { z } from "zod";

const updateSchema = z.object({
  companyName: z.string().optional(),
  companyLocation: z.string().optional(),
  title: z.string().optional(),
  type: jobTypeSchema.optional(),
  arrangement: jobArrangementSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().nullable().optional(),
  enabled: z.boolean().optional(),
});

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<ResumeWorkEntry>) => {
    const validatedPid = pidSchema.safeParse(req.query.workEntryPid);
    const validatedBody = updateSchema.safeParse(req.body);
    if (!validatedPid.success || !validatedBody.success) {
      return sendError(res, 400);
    }
    try {
      const workEntry = await prisma.resumeWorkEntry.update({
        where: { pid: validatedPid.data, resume: { job: { userId: user.id } } },
        data: validatedBody.data,
      });
      return res.status(200).json(workEntry);
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
    const validatedPid = pidSchema.safeParse(req.query.workEntryPid);
    if (!validatedPid.success) {
      return sendError(res, 400);
    }
    try {
      await prisma.resumeWorkEntry.delete({
        where: { pid: validatedPid.data, resume: { job: { userId: user.id } } },
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
