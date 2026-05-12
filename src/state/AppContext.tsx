import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Message } from "@/domain/message";

type AppContextValue = {
  targetYear: number;
  setTargetYear: (year: number) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  trends: string;
  setTrends: (trends: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear());
  const [messages, setMessages] = useState<Message[]>([]);
  const [trends, setTrends] = useState<string>("");

  const value = useMemo<AppContextValue>(
    () => ({ targetYear, setTargetYear, messages, setMessages, trends, setTrends }),
    [targetYear, messages, trends],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used inside <AppProvider>");
  }
  return ctx;
};
