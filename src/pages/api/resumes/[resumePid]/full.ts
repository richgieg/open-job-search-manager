import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { pidSchema } from "@/schemas";
import type { FullResume } from "@/types";
import { NextApiResponse } from "next";

export default makeProtectedApiHandler({
  GET: async (user, req, res: NextApiResponse<FullResume>) => {
    const validatedPid = pidSchema.safeParse(req.query.resumePid);
    if (!validatedPid.success) {
      return sendError(res, 400);
    }
    const fullResume = await prisma.resume.findUnique({
      where: { pid: validatedPid.data, job: { userId: user.id } },
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
        profile: true,
        job: true,
      },
    });
    if (!fullResume) {
      return sendError(res, 404);
    }
    return sendResponse(res, 200, fullResume);
  },
});
