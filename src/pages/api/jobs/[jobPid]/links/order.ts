import type { NextApiResponse } from "next";
import { makeProtectedApiHandler, prisma, sendResponse } from "@/lib";

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<void>) => {
    const jobPid = req.query.jobPid as string;
    const orderedPids = req.body.orderedPids as string[];
    await prisma.$transaction(
      orderedPids.map((pid, index) =>
        prisma.link.update({
          where: { pid, job: { pid: jobPid } },
          data: { sortOrder: index },
        })
      )
    );
    return sendResponse(res, 204);
  },
});
