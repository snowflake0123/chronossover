import OpenAI from "openai";
import { backOff } from "exponential-backoff";
import { getOpenAIApiKey } from "@/config/env";
import { prompts } from "@/domain/prompts";
import type { Message } from "@/domain/message";

const MODEL = "gpt-3.5-turbo";

const createClient = (): OpenAI =>
  new OpenAI({
    apiKey: getOpenAIApiKey(),
    dangerouslyAllowBrowser: true,
  });

const chat = async (client: OpenAI, content: string): Promise<string> => {
  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content }],
  });
  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error("Empty response from OpenAI");
  }
  return text;
};

export const fetchTrends = async ({
  year,
  mode,
}: {
  year: number;
  mode: "past" | "future";
}): Promise<string> => {
  const client = createClient();
  const content = prompts.forFetchTrends[mode]({ year });
  return backOff(() => chat(client, content));
};

export const fetchComments = async ({
  year,
  trends,
}: {
  year: number;
  trends: string;
}): Promise<string> => {
  const client = createClient();
  const content = prompts.forFetchComments({ year, trends });
  return backOff(() => chat(client, content));
};

export const fetchReply = async ({
  year,
  message,
  prevReplies,
}: {
  year: number;
  message: Message;
  prevReplies: readonly Message[];
}): Promise<string> => {
  const client = createClient();
  const content = prompts.forFetchReply({ year, message, prevReplies });
  return backOff(() => chat(client, content));
};
