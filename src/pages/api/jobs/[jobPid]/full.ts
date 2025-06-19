import {
  ApplicationQuestion,
  Contact,
  Job,
  Link,
  Resume,
} from "@/generated/prisma";
import {
  makeProtectedApiHandler,
  prisma,
  sendError,
  sendResponse,
} from "@/lib";
import { pidSchema } from "@/schemas";
import { NextApiResponse } from "next";

type FullJob = Job & {
  links: Link[];
  resumes: Resume[];
  contacts: Contact[];
  applicationQuestions: ApplicationQuestion[];
};

export default makeProtectedApiHandler({
  GET: async (user, req, res: NextApiResponse<FullJob>) => {
    const validatedPid = pidSchema.safeParse(req.query.jobPid);
    if (!validatedPid.success) {
      return sendError(res, 400);
    }
    const fullJob = await prisma.job.findUnique({
      where: { pid: validatedPid.data, userId: user.id },
      include: {
        applicationQuestions: { orderBy: { sortOrder: "asc" } },
        contacts: { orderBy: { sortOrder: "asc" } },
        links: { orderBy: { sortOrder: "asc" } },
        resumes: true,
      },
    });
    if (!fullJob) {
      return sendError(res, 404);
    }
    return sendResponse(res, 200, fullJob);
  },
});
