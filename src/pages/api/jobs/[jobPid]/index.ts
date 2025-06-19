import type { NextApiResponse } from "next";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { Job, Prisma } from "@/generated/prisma";
import { z } from "zod";
import {
  jobArrangementSchema,
  jobStatusSchema,
  jobTypeSchema,
  pidSchema,
} from "@/schemas";

const updateSchema = z.object({
  title: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  type: jobTypeSchema.nullable().optional(),
  arrangement: jobArrangementSchema.nullable().optional(),
  staffingCompany: z.string().optional(),
  description: z.string().optional(),
  postedDate: z.string().nullable().optional(),
  appliedDate: z.string().nullable().optional(),
  status: jobStatusSchema.optional(),
  notes: z.string().optional(),
  postedSalary: z.string().optional(),
  desiredSalary: z.string().optional(),
});

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<Job>) => {
    const validatedPid = pidSchema.safeParse(req.query.jobPid);
    const validatedBody = updateSchema.safeParse(req.body);
    if (!validatedPid.success || !validatedBody.success) {
      return sendError(res, 400);
    }
    try {
      const job = await prisma.job.update({
        where: { pid: validatedPid.data, userId: user.id },
        data: validatedBody.data,
      });
      return res.status(200).json(job);
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
    const validatedPid = pidSchema.safeParse(req.query.jobPid);
    if (!validatedPid.success) {
      return sendError(res, 400);
    }
    try {
      await prisma.job.delete({
        where: { pid: validatedPid.data, userId: user.id },
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
