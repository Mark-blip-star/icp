interface IdeogramResponse {
  created: string;
  data: {
    is_image_safe: boolean;
    prompt: string;
    resolution: string;
    seed: number;
    style_type: string;
    url: string;
  }[];
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeIdeogramRequest(prompt: string, aspectRatio: string, attempt: number = 1): Promise<IdeogramResponse> {
  try {
    const response = await fetch("https://api.ideogram.ai/generate", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "Api-Key": process.env.IDEOGRAM_API_KEY || "",
      }),
      body: JSON.stringify({
        image_request: {
          prompt,
          aspect_ratio: aspectRatio,
          model: "V_2A_TURBO",
          magic_prompt_option: "AUTO",
          rendering_mode: "FAST",
        },
      }),
    });

    if (response.status === 429 && attempt <= 3) {
      // Rate limited - exponential backoff
      const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      console.log(`Rate limited by Ideogram API. Retrying in ${waitTime/1000}s (attempt ${attempt}/3)`);
      await sleep(waitTime);
      return makeIdeogramRequest(prompt, aspectRatio, attempt + 1);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ideogram API error:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
        attempt
      });
      
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a few minutes.");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const body = await response.json();
    console.log('Ideogram API response:', {
      created: body.created,
      dataLength: body.data?.length,
      firstImageUrl: body.data?.[0]?.url,
      isSafe: body.data?.[0]?.is_image_safe
    });
    
    return body;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Rate limit exceeded")) {
      throw error; // Re-throw rate limit errors
    }
    console.error('Ideogram API error:', error);
    throw new Error("Failed to generate image. Please try again.");
  }
}

export async function generateFromIdeogram(prompt: string, aspectRatio: string = "ASPECT_3_4"): Promise<IdeogramResponse> {
  console.log('Making request to Ideogram API with:', { prompt, aspectRatio });
  return makeIdeogramRequest(prompt, aspectRatio);
}
