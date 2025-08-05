// @ts-expect-error: pdf.worker.min.mjs is not typed
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import "@ungap/with-resolvers";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // @ts-expect-error: pdf.worker.min.mjs is not typed
  await import("pdfjs-dist/build/pdf.worker.min.mjs");

  // Load the PDF document
  const data = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdfDocument = await loadingTask.promise;

  let fullText = "";

  // Get all pages
  for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(" ");
    fullText += pageText + "\n";
  }

  return fullText.trim();
}
