export interface TextExtractor {
  extract(file: File): Promise<string>;
}
