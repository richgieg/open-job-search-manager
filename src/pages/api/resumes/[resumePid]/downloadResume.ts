import { makeApiHandler, prisma, sendError } from "@/lib";
import { NextApiResponse } from "next";
import {
  template01_makeDocument,
  template01_resume,
  template02_makeDocument,
  template02_resume,
} from "@/templates";

export default makeApiHandler({
  GET: async (req, res: NextApiResponse<Buffer<ArrayBufferLike>>) => {
    const resumePid = req.query.resumePid as string;
    const fullResume = await prisma.resume.findUnique({
      where: { pid: resumePid },
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

    let makeResume;
    let makeDocument;
    switch (fullResume.template) {
      case "template01":
        makeResume = template01_resume;
        makeDocument = template01_makeDocument;
        break;
      case "template02":
        makeResume = template02_resume;
        makeDocument = template02_makeDocument;
        break;
    }

    const resumeParagraphs = makeResume(fullResume);
    const buffer = await makeDocument(resumeParagraphs);
    const candidateName = fullResume.name.replace(/\s+/g, "_");
    const filename = `${candidateName}_Resume.docx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.status(200).send(buffer);
  },
});
