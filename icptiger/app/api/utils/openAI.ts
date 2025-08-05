import OpenAI from "openai";
import { OpenAIResponse } from "../types/openAIResponse";
import { ChatCompletionTool } from "openai/resources";

interface ToolParameter {
  type: string;
  description: string;
  required?: boolean;
}

interface ToolConfig {
  name: string;
  description: string;
  parameters: Record<string, ToolParameter>;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export function askOpenAI(systemPrompt: string, userPrompt: string, temperature = 0.8) {
  const completion = openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 500,
    temperature,
  });
  return completion;
}

export async function askOpenAIWithPhoto(
  systemPrompt: string,
  userPrompt: string,
  temperature = 0.8,
  base64_image: string,
): Promise<OpenAIResponse> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            {
              type: "image_url",
              image_url: {
                url: `${base64_image}`,
                detail: "auto",
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature,
    });

    return {
      content: completion.choices[0]?.message?.content || "",
    };
  } catch (error) {
    return {
      content: "",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

function createTool(config: ToolConfig): ChatCompletionTool {
  const requiredParams = Object.entries(config.parameters)
    .filter(([_, param]) => param.required)
    .map(([name]) => name);

  return {
    type: "function",
    function: {
      name: config.name,
      description: config.description,
      parameters: {
        type: "object",
        properties: Object.entries(config.parameters).reduce(
          (acc, [name, param]) => ({
            ...acc,
            [name]: {
              type: param.type,
              description: param.description,
            },
          }),
          {},
        ),
        required: requiredParams,
      },
    },
  };
}

// Export this function when function calls are needed in the future.
function createTools(configs: ToolConfig[]): ChatCompletionTool[] {
  return configs.map(createTool);
}

// DISCLAIMER: This function will not be used now since it's essential to get the
// Website content in order to create a topic based on it.
export async function askOpenAIWithFunctionCall(
  systemPrompt: string,
  userPrompt: string,
  temperature = 0.8,
  tools: ChatCompletionTool[],
) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    tools,
    temperature,
    tool_choice: "auto",
  });

  return {
    content: completion.choices[0]?.message?.content || "",
  };

  // Caller of this function should check on "completion.choices[0].message.tool_calls"
  // If there are any functions needs to be called, it should send another call to OpenAI
  // With the needed functions in order to get the correct response based on the provided
  // Data.
}
