import type { NextApiResponse } from "next";
import { makeApiHandler, prisma, sendResponse } from "@/lib";

export default makeApiHandler({
  PUT: async (req, res: NextApiResponse<void>) => {
    const workEntryPid = req.query.workEntryPid as string;
    const orderedPids = req.body.orderedPids as string[];
    await prisma.$transaction(
      orderedPids.map((pid, index) =>
        prisma.resumeWorkEntryBullet.update({
          where: { pid, workEntry: { pid: workEntryPid } },
          data: { sortOrder: index },
        })
      )
    );
    return sendResponse(res, 204);
  },
});
