import { Prisma, Resume } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { pidSchema, resumeTemplateSchema } from "@/schemas";
import { NextApiResponse } from "next";
import { z } from "zod";

const updateSchema = z.object({
  resumeName: z.string().optional(),
  name: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  websiteText: z.string().optional(),
  websiteLink: z.string().optional(),
  summary: z.string().optional(),
  coverLetter: z.string().optional(),
  allowPageBreaks: z.boolean().optional(),
  template: resumeTemplateSchema.optional(),
});

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<Resume>) => {
    const validatedPid = pidSchema.safeParse(req.query.resumePid);
    const validatedBody = updateSchema.safeParse(req.body);
    if (!validatedPid.success || !validatedBody.success) {
      return sendError(res, 400);
    }
    try {
      const resume = await prisma.resume.update({
        where: { pid: validatedPid.data, job: { userId: user.id } },
        data: validatedBody.data,
      });
      return res.status(200).json(resume);
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
    const validatedPid = pidSchema.safeParse(req.query.resumePid);
    if (!validatedPid.success) {
      return sendError(res, 400);
    }
    try {
      await prisma.resume.delete({
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
