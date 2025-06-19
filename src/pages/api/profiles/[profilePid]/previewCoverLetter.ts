import { Contact } from "@/generated/prisma";
import { makeProtectedApiHandler, prisma, sendError } from "@/lib";
import { NextApiResponse } from "next";
import {
  template01_coverLetter,
  template01_makeDocument,
  template02_coverLetter,
  template02_makeDocument,
} from "@/templates";
import { pidSchema, resumeTemplateSchema } from "@/schemas";
import { z } from "zod";

const querySchema = z.object({
  template: resumeTemplateSchema,
  timezoneOffset: z.coerce.number().int(),
});

export default makeProtectedApiHandler({
  GET: async (user, req, res: NextApiResponse<Buffer<ArrayBufferLike>>) => {
    const validatedPid = pidSchema.safeParse(req.query.profilePid);
    const validatedQuery = querySchema.safeParse(req.query);
    if (!validatedPid.success || !validatedQuery.success) {
      return sendError(res, 400);
    }
    const fullProfile = await prisma.profile.findUnique({
      where: { pid: validatedPid.data, userId: user.id },
      include: {
        workEntries: {
          orderBy: { sortOrder: "asc" },
          include: { bullets: { orderBy: { sortOrder: "asc" } } },
        },
        educationEntries: {
          orderBy: { sortOrder: "asc" },
          include: { bullets: { orderBy: { sortOrder: "asc" } } },
        },
        certifications: { orderBy: { sortOrder: "asc" } },
        skillCategories: {
          orderBy: { sortOrder: "asc" },
          include: { skills: { orderBy: { sortOrder: "asc" } } },
        },
      },
    });
    if (!fullProfile) {
      return sendError(res, 404);
    }

    const { template, timezoneOffset } = validatedQuery.data;

    const contact: Contact = {
      id: 0,
      pid: "",
      jobId: 0,
      name: "John Doe",
      phone: "",
      email: "",
      title: "Sr. Recruiting Specialist",
      company: "ACME Industries",
      addressLine1: "1 Big Long Rd",
      addressLine2: "Suite 500",
      addressLine3: "Beverly Hills, CA 90210",
      addressLine4: "",
      sortOrder: 0,
    };

    let makeCoverLetter;
    let makeDocument;
    switch (template) {
      case "template01":
        makeCoverLetter = template01_coverLetter;
        makeDocument = template01_makeDocument;
        break;
      case "template02":
        makeCoverLetter = template02_coverLetter;
        makeDocument = template02_makeDocument;
        break;
    }

    const data = { ...fullProfile, allowPageBreaks: false };
    const coverLetterParagraphs = makeCoverLetter(
      data,
      contact,
      timezoneOffset
    );
    const buffer = await makeDocument(coverLetterParagraphs);
    const candidateName = fullProfile.name.replace(/\s+/g, "_");
    const filename = `${candidateName}_Cover_Letter.docx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.status(200).send(buffer);
  },
});
