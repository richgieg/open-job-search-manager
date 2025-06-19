import type { NextApiResponse } from "next";
import { Contact, Prisma } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { pidSchema } from "@/schemas";

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<Contact>) => {
    const validatedPid = pidSchema.safeParse(req.query.jobPid);
    if (!validatedPid.success) {
      return sendError(res, 400);
    }
    const maxSortOrderEntry = await prisma.contact.findFirst({
      where: { job: { pid: validatedPid.data, userId: user.id } },
      orderBy: { sortOrder: "desc" },
    });
    const sortOrder = (maxSortOrderEntry?.sortOrder ?? -1) + 1;
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
          sortOrder,
          job: {
            connect: { pid: validatedPid.data, userId: user.id },
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
