import { describe, expect, it } from "vitest";
import { prompts } from "./prompts";

describe("prompts.forFetchTrends", () => {
  it("past includes the year and specifies accuracy", () => {
    const text = prompts.forFetchTrends.past({ year: 1999 });
    expect(text).toContain("1999年");
    expect(text).toContain("正確性");
  });

  it("future asks to imagine with fictitious names", () => {
    const text = prompts.forFetchTrends.future({ year: 2077 });
    expect(text).toContain("2077年");
    expect(text).toContain("想像");
  });
});

describe("prompts.forFetchComments", () => {
  it("embeds year and trends", () => {
    const text = prompts.forFetchComments({ year: 2003, trends: "- トレンドA\n- トレンドB" });
    expect(text).toContain("2003年");
    expect(text).toContain("トレンドA");
    expect(text).toContain("\\eot");
  });
});

describe("prompts.forFetchReply", () => {
  it("embeds the target persona and prior replies", () => {
    const text = prompts.forFetchReply({
      year: 2040,
      message: {
        id: "x",
        user: { id: "alice", name: "アリス" },
        date: "2040-01-01T00:00:00+09:00",
        body: "hello",
      },
      prevReplies: [
        {
          id: "y",
          user: { id: "bob", name: "ボブ" },
          date: "2040-01-01T00:01:00+09:00",
          body: "hi back",
        },
      ],
    });
    expect(text).toContain("アリス");
    expect(text).toContain("alice");
    expect(text).toContain("hello");
    expect(text).toContain("hi back");
  });
});
