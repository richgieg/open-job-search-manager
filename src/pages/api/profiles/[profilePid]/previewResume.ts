import { makeProtectedApiHandler, prisma, sendError } from "@/lib";
import { NextApiResponse } from "next";
import {
  template01_makeDocument,
  template01_resume,
  template02_makeDocument,
  template02_resume,
} from "@/templates";
import { pidSchema, resumeTemplateSchema } from "@/schemas";
import { z } from "zod";

const querySchema = z.object({
  template: resumeTemplateSchema,
});

export default makeProtectedApiHandler({
  GET: async (user, req, res: NextApiResponse<Buffer<ArrayBufferLike>>) => {
    const validatedPid = pidSchema.safeParse(req.query.profilePid);
    const validatedQuery = querySchema.safeParse(req.query);
    if (!validatedPid.success || !validatedQuery.success) {
      return sendError(res, 400);
    }
    const { template } = validatedQuery.data;
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

    let makeResume;
    let makeDocument;
    switch (template) {
      case "template01":
        makeResume = template01_resume;
        makeDocument = template01_makeDocument;
        break;
      case "template02":
        makeResume = template02_resume;
        makeDocument = template02_makeDocument;
        break;
    }

    const data = { ...fullProfile, allowPageBreaks: false };
    const resumeParagraphs = makeResume(data);
    const buffer = await makeDocument(resumeParagraphs);
    const candidateName = fullProfile.name.replace(/\s+/g, "_");
    const filename = `${candidateName}_Resume.docx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.status(200).send(buffer);
  },
});
