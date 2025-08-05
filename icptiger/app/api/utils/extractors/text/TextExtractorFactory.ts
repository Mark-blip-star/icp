import { TextExtractor } from "@/app/api/types/TextExtractor";
import { PDFTextExtractor } from "./PDFTextExtractor";
import { PlainTextExtractor } from "./PlainTextExtractor";

export class TextExtractorFactory {
  static createExtractor(file: File): TextExtractor {
    if (file.type.includes("pdf")) {
      return new PDFTextExtractor();
    } else if (file.type.includes("plain")) {
      return new PlainTextExtractor();
    }
    throw new Error("Unsupported file type");
  }
}
