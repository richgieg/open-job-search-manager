import { EducationEntryBullet, Prisma } from "@/generated/prisma";
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
  text: z.string().optional(),
  enabled: z.boolean().optional(),
});

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<EducationEntryBullet>) => {
    const validatedPid = pidSchema.safeParse(req.query.educationEntryBulletPid);
    const validatedBody = updateSchema.safeParse(req.body);
    if (!validatedPid.success || !validatedBody.success) {
      return sendError(res, 400);
    }
    try {
      const educationEntryBullet = await prisma.educationEntryBullet.update({
        where: {
          pid: validatedPid.data,
          educationEntry: { profile: { userId: user.id } },
        },
        data: validatedBody.data,
      });
      return res.status(200).json(educationEntryBullet);
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
    const validatedPid = pidSchema.safeParse(req.query.educationEntryBulletPid);
    if (!validatedPid.success) {
      return sendError(res, 400);
    }
    try {
      await prisma.educationEntryBullet.delete({
        where: {
          pid: validatedPid.data,
          educationEntry: { profile: { userId: user.id } },
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
