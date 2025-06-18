import type { NextApiResponse } from "next";
import { makeProtectedApiHandler, prisma, sendResponse } from "@/lib";

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<void>) => {
    const workEntryPid = req.query.workEntryPid as string;
    const orderedPids = req.body.orderedPids as string[];
    await prisma.$transaction(
      orderedPids.map((pid, index) =>
        prisma.workEntryBullet.update({
          where: { pid, workEntry: { pid: workEntryPid } },
          data: { sortOrder: index },
        })
      )
    );
    return sendResponse(res, 204);
  },
});
