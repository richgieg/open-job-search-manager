import { ResumeTemplate } from "@/generated/prisma";
import { makeApiHandler, prisma, sendError, sendResponse } from "@/lib";
import { NextApiResponse } from "next";
import {
  template01_makeDocument,
  template01_resume,
  template02_makeDocument,
  template02_resume,
} from "@/templates";

export default makeApiHandler({
  GET: async (req, res: NextApiResponse<Buffer<ArrayBufferLike>>) => {
    const profilePid = req.query.profilePid as string;
    const template = req.query.template as ResumeTemplate;
    const fullProfile = await prisma.profile.findUnique({
      where: { pid: profilePid },
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
    return sendResponse(res, 200, buffer);
  },
});
