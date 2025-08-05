import { load } from "cheerio";

export class URLExtractor {
  constructor() {}

  async readWebsiteContent(url: string) {
    try {
      const response = await fetch(url);
      const body = await response.text();
      let cheerioBody = load(body);
      const websiteBody = cheerioBody("p").text();
      return JSON.stringify(websiteBody);
    } catch (error: any) {
      console.error("Error reading website content:", error);
      throw new Error(`Failed to read website content: ${error.message}`);
    }
  }
}
