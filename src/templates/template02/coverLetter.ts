import { Paragraph, TextRun } from "docx";
import { header } from "./header";
import { Contact } from "@/generated/prisma";
import type { FullProfile, FullResume } from "@/types";

export function coverLetter(
  data: (FullProfile & { allowPageBreaks: boolean }) | FullResume,
  contact: Contact,
  timezoneOffset: number
): Paragraph[] {
  const paragraphs = [header(data)];

  const now = new Date();
  now.setMinutes(now.getMinutes() - timezoneOffset);

  paragraphs.push(
    new Paragraph({
      text: now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      spacing: {
        before: 800,
      },
    })
  );

  const contactKeys = [
    "name",
    "title",
    "company",
    "addressLine1",
    "addressLine2",
    "addressLine3",
    "addressLine4",
  ] as const;

  const contactLines = contactKeys
    .map((key) => contact[key].trim())
    .filter((line) => line !== "");

  paragraphs.push(
    new Paragraph({
      children: [
        ...contactLines
          .slice(0, contactLines.length - 1)
          .flatMap((line) => [new TextRun(line), new TextRun({ break: 1 })]),
        new TextRun(contactLines[contactLines.length - 1]),
      ],
      spacing: {
        before: 500,
      },
    })
  );

  paragraphs.push(
    new Paragraph({
      text: `Dear ${contact.name.trim()}:`,
      spacing: {
        before: 800,
      },
    })
  );

  const bodyParagraphs = data.coverLetter
    .split("\n")
    .map((p) => p.trim())
    .filter((p) => p !== "");

  paragraphs.push(
    ...bodyParagraphs.map(
      (bodyParagraph) =>
        new Paragraph({
          text: bodyParagraph,
          spacing: {
            before: 400,
          },
        })
    )
  );

  paragraphs.push(
    new Paragraph({
      text: "Sincerely,",
      spacing: {
        before: 600,
      },
    })
  );

  paragraphs.push(
    new Paragraph({
      text: data.name,
      spacing: {
        before: 200,
      },
    })
  );

  return paragraphs;
}
