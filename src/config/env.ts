export class MissingEnvError extends Error {
  constructor(name: string) {
    super(`Environment variable ${name} is not set`);
    this.name = "MissingEnvError";
  }
}

export const getOpenAIApiKey = (): string => {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if (!key || typeof key !== "string" || key.length === 0) {
    throw new MissingEnvError("VITE_OPENAI_API_KEY");
  }
  return key;
};
