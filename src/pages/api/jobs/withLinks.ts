import type { NextApiResponse } from "next";
import { Job, Link } from "@/generated/prisma";
import { makeProtectedApiHandler, prisma, sendResponse } from "@/lib";

type JobWithLinks = Job & { links: Link[] };

export default makeProtectedApiHandler({
  GET: async (user, req, res: NextApiResponse<JobWithLinks[]>) => {
    const jobs = await prisma.job.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        links: true,
      },
    });
    return sendResponse(res, 200, jobs);
  },
});
