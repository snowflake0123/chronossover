import { describe, expect, it } from "vitest";
import { findMessageById, parseRawResponseToMessages } from "./message";

describe("parseRawResponseToMessages", () => {
  it("parses the canonical format", () => {
    const raw = [
      "@hikari2051, 光, 2051-04-12T14:23:56+09:00, 今日のランチは超美味しかった！ #グリーンフード最高\\eot",
      "@haru0328, 春, 2051-04-12T14:25:12+09:00, 私も行ったよ！ #健康生活\\eot",
    ].join("\n");

    const parsed = parseRawResponseToMessages(raw);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].user.id).toBe("hikari2051");
    expect(parsed[0].user.name).toBe("光");
    expect(parsed[0].date).toBe("2051-04-12T14:23:56+09:00");
    expect(parsed[0].body).toContain("今日のランチ");
    expect(parsed[0].id).toMatch(/[0-9a-f-]+/);
  });

  it("strips a preamble before the first @", () => {
    const raw = "以下は例です。 @alice, アリス, 2025-01-01T00:00:00+09:00, hello\\eot";
    const parsed = parseRawResponseToMessages(raw);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].user.id).toBe("alice");
  });

  it("skips empty chunks and chunks with missing fields", () => {
    const raw = "\\eot@bob, ボブ, 2025-01-01T00:00:00+09:00, hi\\eot@carol\\eot";
    const parsed = parseRawResponseToMessages(raw);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].user.id).toBe("bob");
  });

  it("preserves commas inside the body", () => {
    const raw = "@dan, ダン, 2025-01-01T00:00:00+09:00, hello, world, again\\eot";
    const parsed = parseRawResponseToMessages(raw);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].body).toBe("hello, world, again");
  });
});

describe("findMessageById", () => {
  it("returns the message with a matching id", () => {
    const raw = "@a, A, 2025-01-01T00:00:00+09:00, hi\\eot";
    const [msg] = parseRawResponseToMessages(raw);
    expect(findMessageById([msg], msg.id)).toBe(msg);
  });

  it("returns undefined when nothing matches", () => {
    expect(findMessageById([], "nope")).toBeUndefined();
  });
});
