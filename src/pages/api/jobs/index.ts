import type { NextApiResponse } from "next";
import { Job } from "@/generated/prisma";
import { makeProtectedApiHandler, prisma, sendResponse } from "@/lib";

export default makeProtectedApiHandler({
  POST: async (user, req, res: NextApiResponse<Job>) => {
    const organization = await prisma.job.create({
      data: {
        userId: user.id,
        title: "",
        company: "",
        location: "",
        staffingCompany: "",
        description: "",
        status: "notApplied",
        notes: "",
        postedSalary: "",
        desiredSalary: "",
      },
    });
    return sendResponse(res, 201, organization);
  },
});
