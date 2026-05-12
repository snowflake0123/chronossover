export type Format = "YYYY年M月D日" | "HH:mm・YYYY年M月D日";

const pad2 = (n: number): string => n.toString().padStart(2, "0");

export const formatDate = (date: Date, format: Format = "YYYY年M月D日"): string => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  if (format === "YYYY年M月D日") {
    return `${y}年${m}月${d}日`;
  }

  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}・${y}年${m}月${d}日`;
};
