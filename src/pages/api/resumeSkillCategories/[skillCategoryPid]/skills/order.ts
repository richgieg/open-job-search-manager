import type { NextApiResponse } from "next";
import { makeApiHandler, prisma, sendResponse } from "@/lib";

export default makeApiHandler({
  PUT: async (req, res: NextApiResponse<void>) => {
    const skillCategoryPid = req.query.skillCategoryPid as string;
    const orderedPids = req.body.orderedPids as string[];
    await prisma.$transaction(
      orderedPids.map((pid, index) =>
        prisma.resumeSkill.update({
          where: { pid, skillCategory: { pid: skillCategoryPid } },
          data: { sortOrder: index },
        })
      )
    );
    return sendResponse(res, 204);
  },
});
