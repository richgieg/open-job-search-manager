import type { NextApiResponse } from "next";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { z } from "zod";
import { contactMessageTypeSchema } from "@/schemas";

const bodySchema = z.object({
  type: contactMessageTypeSchema,
  message: z.string(),
});

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<void>) => {
    const validatedBody = bodySchema.safeParse(req.body);
    if (!validatedBody.success) {
      return sendError(res, 400);
    }
    await prisma.contactMessage.create({
      data: {
        userId: user.id,
        email: user.email ?? "",
        ...validatedBody.data,
      },
    });
    return sendResponse(res, 204);
  },
});
