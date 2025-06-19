import type { NextApiResponse } from "next";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { Prisma } from "@/generated/prisma";
import { z } from "zod";
import { pidSchema } from "@/schemas";

const updateSchema = z.object({
  orderedPids: z.array(pidSchema),
});

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<void>) => {
    const validatedPid = pidSchema.safeParse(req.query.resumePid);
    const validatedBody = updateSchema.safeParse(req.body);
    if (!validatedPid.success || !validatedBody.success) {
      return sendError(res, 400);
    }
    const { orderedPids } = validatedBody.data;
    try {
      await prisma.$transaction(
        orderedPids.map((pid, index) =>
          prisma.resumeCertification.update({
            where: {
              pid,
              resume: { pid: validatedPid.data, job: { userId: user.id } },
            },
            data: { sortOrder: index },
          })
        )
      );
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
