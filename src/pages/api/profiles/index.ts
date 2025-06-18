import type { NextApiResponse } from "next";
import { Profile } from "@/generated/prisma";
import { makeProtectedApiHandler, prisma, sendResponse } from "@/lib";

export default makeProtectedApiHandler({
  GET: async (user, req, res: NextApiResponse<Profile[]>) => {
    const profiles = await prisma.profile.findMany();
    return sendResponse(res, 200, profiles);
  },

  POST: async (user, req, res: NextApiResponse<Profile>) => {
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        profileName: "",
        jobTitle: "",
        name: "",
        location: "",
        phone: "",
        email: "",
        websiteText: "",
        websiteLink: "",
        summary: "",
        coverLetter: "",
      },
    });
    return sendResponse(res, 201, profile);
  },
});
