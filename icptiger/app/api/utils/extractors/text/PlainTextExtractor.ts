import { TextExtractor } from "@/app/api/types/TextExtractor";

export class PlainTextExtractor implements TextExtractor {
  async extract(file: File): Promise<string> {
    return file.text();
  }
}
