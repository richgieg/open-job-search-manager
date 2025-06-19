import { makeProtectedApiHandler, prisma, sendError } from "@/lib";
import { NextApiResponse } from "next";
import {
  template01_coverLetter,
  template01_makeDocument,
  template01_resume,
  template02_coverLetter,
  template02_makeDocument,
  template02_resume,
} from "@/templates";
import { pidSchema } from "@/schemas";
import { z } from "zod";

const querySchema = z.object({
  contactPid: pidSchema,
  timezoneOffset: z.coerce.number().int(),
  includeResume: z.boolean(),
});

export default makeProtectedApiHandler({
  GET: async (user, req, res: NextApiResponse<Buffer<ArrayBufferLike>>) => {
    const validatedPid = pidSchema.safeParse(req.query.resumePid);
    const validatedQuery = querySchema.safeParse(req.query);
    if (!validatedPid.success || !validatedQuery.success) {
      return sendError(res, 400);
    }
    const fullResume = await prisma.resume.findUnique({
      where: { pid: validatedPid.data, job: { userId: user.id } },
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
        profile: true,
        job: true,
      },
    });
    if (!fullResume) {
      return sendError(res, 404);
    }
    const { contactPid, timezoneOffset, includeResume } = validatedQuery.data;
    const contact = await prisma.contact.findUnique({
      where: { pid: contactPid },
    });
    if (!contact) {
      return sendError(res, 404);
    }

    let makeCoverLetter;
    let makeResume;
    let makeDocument;
    switch (fullResume.template) {
      case "template01":
        makeCoverLetter = template01_coverLetter;
        makeResume = template01_resume;
        makeDocument = template01_makeDocument;
        break;
      case "template02":
        makeCoverLetter = template02_coverLetter;
        makeResume = template02_resume;
        makeDocument = template02_makeDocument;
        break;
    }

    const coverLetterParagraphs = makeCoverLetter(
      fullResume,
      contact,
      timezoneOffset
    );
    const resumeParagraphs = includeResume ? makeResume(fullResume) : [];
    const buffer = await makeDocument([
      ...coverLetterParagraphs,
      ...resumeParagraphs,
    ]);
    const candidateName = fullResume.name.replace(/\s+/g, "_");
    const filename = includeResume
      ? `${candidateName}_Cover_Letter_and_Resume.docx`
      : `${candidateName}_Cover_Letter.docx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.status(200).send(buffer);
  },
});
