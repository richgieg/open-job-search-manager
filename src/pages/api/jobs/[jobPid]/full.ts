import {
  ApplicationQuestion,
  Contact,
  Job,
  Link,
  Resume,
} from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";
import { NextApiResponse } from "next";

type FullJob = Job & {
  links: Link[];
  resumes: Resume[];
  contacts: Contact[];
  applicationQuestions: ApplicationQuestion[];
};

export default makeApiHandler({
  GET: async (req, res: NextApiResponse<FullJob>) => {
    const jobPid = req.query.jobPid as string;
    const fullJob = await prisma.job.findUnique({
      where: { pid: jobPid },
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
