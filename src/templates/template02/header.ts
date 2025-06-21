import type { FullProfile, FullResume } from "@/types";
import { ExternalHyperlink, Paragraph, TextRun } from "docx";

const FONT_SIZE = 28;

export function header(data: FullProfile | FullResume): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${data.name}  |  ${data.location}  |  ${data.phone}  |  `,
        size: FONT_SIZE,
      }),
      new ExternalHyperlink({
        link: `mailto:${data.email}`,
        children: [new TextRun({ text: data.email, size: FONT_SIZE })],
      }),
      new TextRun({ text: `  |  `, size: FONT_SIZE }),
      new ExternalHyperlink({
        link: data.websiteLink,
        children: [new TextRun({ text: data.websiteText, size: FONT_SIZE })],
      }),
    ],
    pageBreakBefore: true,
  });
}
