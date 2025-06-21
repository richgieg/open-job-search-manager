import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { pidSchema } from "@/schemas";
import type { FullProfile } from "@/types";
import { NextApiResponse } from "next";

export default makeProtectedApiHandler({
  GET: async (user, req, res: NextApiResponse<FullProfile>) => {
    const validatedPid = pidSchema.safeParse(req.query.profilePid);
    if (!validatedPid.success) {
      return sendError(res, 400);
    }
    const fullProfile = await prisma.profile.findUnique({
      where: { pid: validatedPid.data, userId: user.id },
      include: {
        workEntries: {
          orderBy: { sortOrder: "asc" },
          include: { bullets: { orderBy: { sortOrder: "asc" } } },
        },
        educationEntries: {
          orderBy: { sortOrder: "asc" },
          include: { bullets: { orderBy: { sortOrder: "asc" } } },
        },
        certifications: { orderBy: { sortOrder: "asc" } },
        skillCategories: {
          orderBy: { sortOrder: "asc" },
          include: { skills: { orderBy: { sortOrder: "asc" } } },
        },
      },
    });
    if (!fullProfile) {
      return sendError(res, 404);
    }
    return sendResponse(res, 200, fullProfile);
  },
});
