export type Format = "YYYY年MM月DD日" | "hh:mm・YYYY年MM月DD日";

export const formatDate = (date: Date, format: Format = "YYYY年MM月DD日") => {
  const yearStr = date.getFullYear().toString();
  const monthStr = (date.getMonth() + 1).toString();
  const dateStr = date.getDate().toString();
  if (format === "YYYY年MM月DD日") {
    return `${yearStr}年${monthStr}月${dateStr}日`;
  }
  const hoursStr = date.getHours().toString();
  const minutesStr = date.getMinutes().toString();
  return `${hoursStr}:${minutesStr}・${yearStr}年${monthStr}月${dateStr}日`;
};
