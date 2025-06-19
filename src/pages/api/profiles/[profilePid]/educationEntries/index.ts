import type { NextApiResponse } from "next";
import { EducationEntry, Prisma } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { pidSchema } from "@/schemas";

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<EducationEntry>) => {
    const validatedPid = pidSchema.safeParse(req.query.profilePid);
    if (!validatedPid.success) {
      return sendError(res, 400);
    }
    const maxSortOrderEntry = await prisma.educationEntry.findFirst({
      where: { profile: { pid: validatedPid.data, userId: user.id } },
      orderBy: { sortOrder: "desc" },
    });
    const sortOrder = (maxSortOrderEntry?.sortOrder ?? -1) + 1;
    try {
      const educationEntry = await prisma.educationEntry.create({
        data: {
          schoolName: "",
          schoolLocation: "",
          title: "",
          graduationDate: "2000-01-01",
          enabled: true,
          sortOrder,
          profile: {
            connect: { pid: validatedPid.data, userId: user.id },
          },
        },
      });
      return sendResponse(res, 201, educationEntry);
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
