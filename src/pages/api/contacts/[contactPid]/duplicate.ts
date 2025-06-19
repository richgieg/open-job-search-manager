import { Contact } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { NextApiResponse } from "next";

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<Contact>) => {
    const contactPid = req.query.contactPid as string;
    const original = await prisma.contact.findUnique({
      where: { pid: contactPid, job: { userId: user.id } },
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
