import { TextExtractor } from "@/app/api/types/TextExtractor";
import { extractTextFromPDF } from "@/app/api/utils/pdfExtractor";

export class PDFTextExtractor implements TextExtractor {
  async extract(file: File): Promise<string> {
    if (file.size > 3 * 1024 * 1024) {
      throw new Error("File size should be less than 3mb");
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    return extractTextFromPDF(buffer);
  }
}
