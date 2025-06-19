import { Contact } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { pidSchema } from "@/schemas";
import { NextApiResponse } from "next";

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<Contact>) => {
    const validatedPid = pidSchema.safeParse(req.query.contactPid);
    if (!validatedPid.success) {
      return sendError(res, 400);
    }
    const original = await prisma.contact.findUnique({
      where: { pid: validatedPid.data, job: { userId: user.id } },
    });
    if (!original) {
      return sendError(res, 404);
    }
    const contact = await prisma.contact.create({
      data: {
        ...original,
        id: undefined,
        pid: undefined,
      },
    });
    return sendResponse(res, 201, contact);
  },
});
