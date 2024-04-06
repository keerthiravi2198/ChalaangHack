
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

const openAIClient = new OpenAI({ apiKey: "k-0kH13M9bAHQopdTOHeZ6T3BlbkFJmMbuydP3utWdlDWgeFhF" });

export enum EnumOpenAIModel {
  gpt4 = "gpt-4",
  gpt4Turbo = "gpt-4-1106-preview",
  gpt3Turbo = "gpt-3.5-turbo",
}

export class OpenAIService {
  async chatCompletion({
    messages,
    model = EnumOpenAIModel.gpt4Turbo,
    temperature = 0,
    maxTokens = 2000,
    userId,
  }: {
    messages: ChatCompletionMessageParam[];
    model?: EnumOpenAIModel;
    temperature?: number;
    maxTokens?: number;
    userId?: string;
  }): Promise<OpenAI.Chat.Completions.ChatCompletion> {
    try {
      const openai_response = await openAIClient.chat.completions.create({
        messages: messages,
        model: model,
        max_tokens: maxTokens,
        user: (userId ?? "").toString(),
        temperature: temperature,
        stream: false,
      });

      return openai_response;
    } catch (error) {
      console.log(error);
        throw error;    
    }
  }
}
