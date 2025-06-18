import { Document, Packer, Paragraph } from "docx";

export async function makeDocument(
  paragraphs: Paragraph[]
): Promise<Buffer<ArrayBufferLike>> {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 22,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: "portrait",
              width: "8.5in",
              height: "11in",
            },
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
