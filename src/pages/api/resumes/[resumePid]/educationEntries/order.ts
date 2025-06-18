import type { NextApiResponse } from "next";
import { makeProtectedApiHandler, prisma, sendResponse } from "@/lib";

export default makeProtectedApiHandler({
  PUT: async (user, req, res: NextApiResponse<void>) => {
    const resumePid = req.query.resumePid as string;
    const orderedPids = req.body.orderedPids as string[];
    await prisma.$transaction(
      orderedPids.map((pid, index) =>
        prisma.resumeEducationEntry.update({
          where: { pid, resume: { pid: resumePid } },
          data: { sortOrder: index },
        })
      )
    );
    return sendResponse(res, 204);
  },
});
