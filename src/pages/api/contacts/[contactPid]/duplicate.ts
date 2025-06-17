import { Contact } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";
import { NextApiResponse } from "next";

export default makeApiHandler({
  POST: async (req, res: NextApiResponse<Contact>) => {
    const contactPid = req.query.contactPid as string;
    const original = await prisma.contact.findUnique({
      where: { pid: contactPid },
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
