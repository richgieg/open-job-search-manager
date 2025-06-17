import type { NextApiResponse } from "next";
import { Job } from "@/generated/prisma";
import { makeApiHandler, prisma, sendResponse } from "@/lib";

export default makeApiHandler({
  POST: async (req, res: NextApiResponse<Job>) => {
    const organization = await prisma.job.create({
      data: {
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
