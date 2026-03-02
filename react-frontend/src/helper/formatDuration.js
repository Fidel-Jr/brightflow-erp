export const formatDuration = (minutes) => {
  if (!minutes) return "";

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remaining = Math.round(minutes % 60);
    return `${hours} hr${hours > 1 ? "s" : ""}${remaining ? ` ${remaining} min` : ""}`;
  }

  return `${Math.round(minutes)} minutes`;
};
