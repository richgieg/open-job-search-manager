import type { NextApiResponse } from "next";
import { makeApiHandler, prisma, sendResponse } from "@/lib";

export default makeApiHandler({
  PUT: async (req, res: NextApiResponse<void>) => {
    const jobPid = req.query.jobPid as string;
    const orderedPids = req.body.orderedPids as string[];
    await prisma.$transaction(
      orderedPids.map((pid, index) =>
        prisma.applicationQuestion.update({
          where: { pid, job: { pid: jobPid } },
          data: { sortOrder: index },
        })
      )
    );
    return sendResponse(res, 204);
  },
});
