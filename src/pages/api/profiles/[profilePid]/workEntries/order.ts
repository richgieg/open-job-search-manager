import type { NextApiResponse } from "next";
import { makeApiHandler, prisma, sendResponse } from "@/lib";

export default makeApiHandler({
  PUT: async (req, res: NextApiResponse<void>) => {
    const profilePid = req.query.profilePid as string;
    const orderedPids = req.body.orderedPids as string[];
    await prisma.$transaction(
      orderedPids.map((pid, index) =>
        prisma.workEntry.update({
          where: { pid, profile: { pid: profilePid } },
          data: { sortOrder: index },
        })
      )
    );
    return sendResponse(res, 204);
  },
});
