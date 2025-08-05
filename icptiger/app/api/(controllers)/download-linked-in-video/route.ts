import BaseExtractor from "@/app/api/services/linkedInVideo/baseExtractor";
import RequestError from "@/app/api/services/linkedInVideo/requestError";
import { NextRequest } from "next/server";
import LinkedInExtractor from "../../services/linkedInVideo/linkedinExtractor";

export const dynamic = "force-dynamic";

export async function GET<T extends BaseExtractor>(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) {
      return new Response(JSON.stringify({ error: "Url query missing" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Processing LinkedIn video URL

    const extractor = new LinkedInExtractor(url);
    const videoProps = await extractor.extractVideo();
    return new Response(JSON.stringify(videoProps), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const code = err instanceof RequestError ? err.code : 500;
    const message = err instanceof Error ? err.message : "Internal Server Error";

    return new Response(JSON.stringify({ error: message }), {
      status: code,
      headers: { "Content-Type": "application/json" },
    });
  }
}
