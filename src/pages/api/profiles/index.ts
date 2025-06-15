import type { NextApiResponse } from "next";
import { Profile } from "@/generated/prisma";
import { makeApiHandler, prisma, sendResponse } from "@/lib";

export default makeApiHandler({
  GET: async (req, res: NextApiResponse<Profile[]>) => {
    const profiles = await prisma.profile.findMany();
    return sendResponse(res, 200, profiles);
  },
});
