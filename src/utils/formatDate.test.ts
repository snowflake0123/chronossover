import { describe, expect, it } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats YYYY年M月D日 by default", () => {
    const d = new Date(2025, 0, 3);
    expect(formatDate(d)).toBe("2025年1月3日");
  });

  it("formats HH:mm・YYYY年M月D日 when requested", () => {
    const d = new Date(2025, 2, 9, 7, 5);
    expect(formatDate(d, "HH:mm・YYYY年M月D日")).toBe("07:05・2025年3月9日");
  });
});
