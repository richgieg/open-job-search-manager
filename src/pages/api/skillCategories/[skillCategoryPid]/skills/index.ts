import type { NextApiResponse } from "next";
import { Prisma, Skill } from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { pidSchema } from "@/schemas";

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<Skill>) => {
    const validatedPid = pidSchema.safeParse(req.query.skillCategoryPid);
    if (!validatedPid.success) {
      return sendError(res, 400);
    }
    const maxSortOrderEntry = await prisma.skill.findFirst({
      where: {
        skillCategory: { pid: validatedPid.data, profile: { userId: user.id } },
      },
      orderBy: { sortOrder: "desc" },
    });
    const sortOrder = (maxSortOrderEntry?.sortOrder ?? -1) + 1;
    try {
      const skill = await prisma.skill.create({
        data: {
          text: "",
          enabled: true,
          sortOrder,
          skillCategory: {
            connect: { pid: validatedPid.data, profile: { userId: user.id } },
          },
        },
      });
      return sendResponse(res, 201, skill);
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
