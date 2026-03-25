import { CrowdLevel } from "@/types";

const crowdLevels: Record<string, CrowdLevel> = {
  low: { level: "low", label: "Low Crowd", color: "#00E676" },
  moderate: { level: "moderate", label: "Moderate", color: "#FFB300" },
  busy: { level: "busy", label: "Busy", color: "#FF6D00" },
  very_busy: { level: "very_busy", label: "Very Busy", color: "#FF4444" },
};

export function estimateCrowdLevel(
  crowdData: Record<string, Record<string, string>> | undefined,
  date?: Date
): CrowdLevel {
  const now = date || new Date();
  const hour = now.getHours();
  const day = now.getDay();
  const isWeekend = day === 5 || day === 6; // Friday and Saturday in Egypt
  const month = now.getMonth();
  const isHighSeason = month >= 9 || month <= 3; // Oct-Mar

  // If we have specific crowd data for this place, use it
  if (crowdData) {
    const dayType = isWeekend ? "weekend" : "weekday";
    const hourStr = hour.toString().padStart(2, "0");
    const dayData = crowdData[dayType];
    if (dayData) {
      // Find the closest hour in the data
      const hours = Object.keys(dayData).map(Number).sort((a, b) => a - b);
      let closest = hours[0];
      for (const h of hours) {
        if (Math.abs(h - hour) < Math.abs(closest - hour)) {
          closest = h;
        }
      }
      const level = dayData[closest.toString().padStart(2, "0")] || dayData[closest.toString()];
      if (level && crowdLevels[level]) {
        return crowdLevels[level];
      }
    }
  }

  // Fallback heuristic
  if (hour < 7 || hour > 20) return crowdLevels.low;
  if (hour >= 10 && hour <= 14) {
    if (isWeekend && isHighSeason) return crowdLevels.very_busy;
    if (isWeekend || isHighSeason) return crowdLevels.busy;
    return crowdLevels.moderate;
  }
  if (isWeekend) return crowdLevels.moderate;
  return crowdLevels.low;
}

export function getCrowdColor(level: string): string {
  return crowdLevels[level]?.color || "#666666";
}
