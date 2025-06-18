import type { NextApiResponse } from "next";
import { makeApiHandler, prisma, sendResponse } from "@/lib";

export default makeApiHandler({
  PUT: async (req, res: NextApiResponse<void>) => {
    const resumePid = req.query.resumePid as string;
    const orderedPids = req.body.orderedPids as string[];
    await prisma.$transaction(
      orderedPids.map((pid, index) =>
        prisma.resumeWorkEntry.update({
          where: { pid, resume: { pid: resumePid } },
          data: { sortOrder: index },
        })
      )
    );
    return sendResponse(res, 204);
  },
});
