import type { NextApiResponse } from "next";
import { Job, Link } from "@/generated/prisma";
import { makeApiHandler, prisma, sendResponse } from "@/lib";

type JobWithLinks = Job & { links: Link[] };

export default makeApiHandler({
  GET: async (req, res: NextApiResponse<JobWithLinks[]>) => {
    const jobs = await prisma.job.findMany({
      include: {
        links: true,
      },
    });
    return sendResponse(res, 201, jobs);
  },
});
