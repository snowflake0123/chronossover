import { v4 as uuidv4 } from "uuid";

export interface Message {
  id: string;
  user: {
    id: string;
    name: string;
  };
  date: string;
  body: string;
}

export const findMessageById = (
  messages: readonly Message[],
  targetId: string,
): Message | undefined => messages.find((m) => m.id === targetId);

export const parseRawResponseToMessages = (rawResponse: string): Message[] => {
  return rawResponse
    .split("\\eot")
    .map((chunk) => chunk.replace(/\r?\n/g, "").trim())
    .filter((chunk) => chunk.length > 0)
    .map((chunk): Message | null => {
      const parts = chunk.split(",");
      if (parts.length < 4) return null;

      const first = parts[0].trim();
      const atIndex = first.indexOf("@");
      if (atIndex < 0) return null;
      const userId = first.slice(atIndex + 1).trim();

      const userName = parts[1].trim();
      const date = parts[2].trim();
      // Body may contain commas, so rejoin remainder.
      // Literal `\n` escape sequences from the LLM are converted to real newlines.
      const body = parts.slice(3).join(",").trim().replace(/\\n/g, "\n");

      if (!userId || !userName || !date || !body) return null;

      return {
        id: uuidv4(),
        user: { id: userId, name: userName },
        date,
        body,
      };
    })
    .filter((m): m is Message => m !== null);
};
