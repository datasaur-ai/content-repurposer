import { Service } from "@/interfaces/service";
import { NextRequest, NextResponse } from "next/server";

export interface GenerateRequestBody {
  source_urls: string[];
  source_text: string;
  isSourceURLs: boolean;
  behaviour_urls: string[];
  behaviour_text: string;
  isBehaviorURLs: boolean;
  api_key?: string;
  endpoint?: string;
  service: Service;
  stream: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body: GenerateRequestBody = await request.json();

    // Set default endpoint if not provided
    const apiEndpoint =
      (body.endpoint || process.env.NEXT_PUBLIC_API_URL) ?? "";

    // Validate that the API endpoint starts with the required prefix
    if (
      apiEndpoint &&
      !apiEndpoint.startsWith("https://llm.datasaur.ai/api/deployment")
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid API endpoint. Endpoint must start with 'https://llm.datasaur.ai/api/deployment'",
        },
        { status: 400 }
      );
    }

    // Validate that the API endpoint is not empty
    if (!apiEndpoint) {
      return NextResponse.json(
        { message: "API endpoint is required" },
        { status: 400 }
      );
    }

    // Prepare the request to the endpoint
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          body.api_key ?? process.env.NEXT_PUBLIC_API_KEY
        }`,
      },
      body: JSON.stringify({
        stream: body.stream,
        messages: [
          ...(body.isSourceURLs
            ? [
                {
                  role: "user",
                  content: `You are an intelligent and helpful assistant specialized in generating post for a ${body.service} account. Your task is to create a post based on a given document. The post should be engaging, concise, and optimized for ${body.service}'s format. please analyze the SOURCE url, YOU MUST NOT FOLLOW the post format only get the content and generate the post. here is the content: ${body.source_text}`,
                },
              ]
            : [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: `Source N: You are an intelligent and helpful assistant specialized in generating post for a ${body.service} account. Your task is to create a post based on a given document. The post should be engaging, concise, and optimized for ${body.service}'s format. please analyze the SOURCE url, YOU MUST NOT FOLLOW the post format only get the content and generate the post.`,
                    },
                    ...body.source_urls.map((url) => ({
                      type: "url",
                      url,
                    })),
                  ],
                },
              ]),
          ...(body.isBehaviorURLs && body.behaviour_urls.length > 0
            ? [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: `Source Y: Analyze the urls content user's persona, format the previously generated post according the user's content persona and you must follow this specific rules If the urls content have lots of emojis and short sentences, your post should also have emojis and short sentences else remove all of the emoji and short sentences. If the urls content have long sentences, your post should also have long sentences. Also match the content punctuation, if user use a lot of punctuation follow along the use the punctuation.`,
                    },
                    ...body.behaviour_urls.map((url) => ({
                      type: "url",
                      url,
                    })),
                  ],
                },
              ]
            : []),
          ...(!body.isBehaviorURLs && body.behaviour_text.trim() !== ""
            ? [
                {
                  role: "user",
                  content: `Source Y: Analyze the following text content's style and format. Format the previously generated post according to this style and format. Match elements like sentence length, emoji usage, punctuation style, and overall tone. Here's the reference text: ${body.behaviour_text}`,
                },
              ]
            : []),
        ],
      }),
    };

    if (body.stream) {
      // Handle streaming response
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const response = await fetch(apiEndpoint, {
              ...fetchOptions,
              // Ensure endpoint supports streaming
              headers: {
                ...fetchOptions.headers,
                Accept: "text/event-stream",
              },
            });

            if (!response.ok) {
              throw new Error(
                `API request failed with status ${response.status}`
              );
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("Response body is not readable");

            // Send start message
            controller.enqueue(
              new TextEncoder().encode(
                JSON.stringify({
                  type: "start",
                  message: "Starting content generation...",
                }) + "\n"
              )
            );

            let fullContent = "";

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              // Convert the chunk to text
              const chunk = new TextDecoder().decode(value);

              // Process SSE format (data: {...})
              const lines = chunk
                .split("\n")
                .filter((line) => line.trim().startsWith("data:"));

              for (const line of lines) {
                try {
                  // Extract the JSON part after "data: "
                  const jsonStr = line.substring(5).trim();
                  if (!jsonStr) continue;

                  if (jsonStr === "[DONE]") {
                    break;
                  }

                  const data = JSON.parse(jsonStr);

                  if (data.choices && data.choices.length > 0) {
                    const choice = data.choices[0];

                    if (choice.finish_reason === "stop") {
                      // Stream is complete
                      controller.enqueue(
                        new TextEncoder().encode(
                          JSON.stringify({
                            type: "complete",
                            message: fullContent,
                          }) + "\n"
                        )
                      );
                    } else if (choice.delta && choice.delta.content) {
                      // Accumulate content
                      fullContent += choice.delta.content;

                      // Send progress update
                      controller.enqueue(
                        new TextEncoder().encode(
                          JSON.stringify({
                            type: "progress",
                            message: choice.delta.content,
                          }) + "\n"
                        )
                      );
                    }
                  }
                } catch (err) {
                  console.error("Error parsing SSE message:", err);
                }
              }
            }

            // Send the full content as data
            controller.enqueue(
              new TextEncoder().encode(
                JSON.stringify({
                  type: "data",
                  data: fullContent,
                }) + "\n"
              )
            );

            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new NextResponse(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else {
      // Handle regular response
      const response = await fetch(apiEndpoint, fetchOptions);
      const data = await response.json();

      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process request" },
      { status: 500 }
    );
  }
}
