import { Contact, Prisma } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";
import { NextApiResponse } from "next";

export default makeApiHandler({
  PUT: async (req, res: NextApiResponse<Contact>) => {
    const contactPid = req.query.contactPid as string;
    try {
      const contact = await prisma.contact.update({
        where: { pid: contactPid },
        data: req.body,
      });
      return res.status(200).json(contact);
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

  DELETE: async (req, res: NextApiResponse<void>) => {
    const contactPid = req.query.contactPid as string;
    try {
      await prisma.contact.delete({
        where: { pid: contactPid },
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
