import { mitcoin } from "./constants";

export function ticksToFormattedString(ticks: number) {
  const millis = mitcoin.fluctuationTime * ticks;
  const minutes = millis / 1000 / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  // Formats
  // X minute(s)
  // X hour(s), Y minute(s)
  // X day(s), Y hour(s), Z minute(s)
  let timeStr = "";
  if (days >= 1) {
    const daysInt = Math.floor(days);
    timeStr += `${daysInt} day${daysInt > 1 ? "s" : ""}, `;
  }
  if (hours >= 1) {
    const hoursInt = Math.floor(hours % 24);
    timeStr += `${hoursInt} hour${hoursInt > 1 ? "s" : ""}, `;
  }
  if (minutes >= 1) {
    const minutesInt = Math.floor(minutes % 60);
    timeStr += `${minutesInt} minute${minutesInt > 1 ? "s" : ""}, `;
  }
  timeStr = timeStr.trim().replace(/,$/, "");
  return timeStr;
}
