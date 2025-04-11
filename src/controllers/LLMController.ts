import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandOutput,
} from "@aws-sdk/client-bedrock-runtime";
import dotenv from "dotenv";

dotenv.config();

export default class LLMController {
  private bedrockRuntimeClient: BedrockRuntimeClient;

  constructor() {
    const region = process.env.AWS_BEDROCK_REGION;
    const accessKeyId = process.env.AWS_BEDROCK_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_BEDROCK_SECRET_ACCESS_KEY;

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error(
        "Missing required AWS credentials. Please ensure AWS_BEDROCK_REGION, AWS_BEDROCK_ACCESS_KEY_ID, and AWS_BEDROCK_SECRET_ACCESS_KEY are set in your environment variables."
      );
    }

    this.bedrockRuntimeClient = new BedrockRuntimeClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async sendMessage(message: string): Promise<Record<string, any>> {
    const input = {
      modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 200,
        top_k: 250,
        stop_sequences: [],
        temperature: 1,
        top_p: 0.999,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: message,
              },
            ],
          },
        ],
      }),
    };

    const command = new InvokeModelCommand(input);
    const response: InvokeModelCommandOutput =
      await this.bedrockRuntimeClient.send(command);

    const decodedResponse = new TextDecoder().decode(response.body);
    const parsedResponse = JSON.parse(decodedResponse);
    return parsedResponse;
  }
}
