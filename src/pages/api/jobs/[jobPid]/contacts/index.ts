import type { NextApiResponse } from "next";
import { Contact, Prisma } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";

export default makeApiHandler({
  POST: async (req, res: NextApiResponse<Contact>) => {
    const jobPid = req.query.jobPid as string;
    try {
      const contact = await prisma.contact.create({
        data: {
          name: "",
          title: "",
          company: "",
          phone: "",
          email: "",
          addressLine1: "",
          addressLine2: "",
          addressLine3: "",
          addressLine4: "",
          sortOrder: 0,
          Job: {
            connect: { pid: jobPid },
          },
        },
      });
      return sendResponse(res, 201, contact);
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
