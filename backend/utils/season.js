// utils/season.js

export function getSeasonScoreByMonth(monthNumber) {
  // monthNumber 1-12
  if ([12, 1, 2].includes(monthNumber)) return 80; // winter -> safer in many places
  if ([6, 7, 8, 9].includes(monthNumber)) return 40; // monsoon -> riskier
  return 60; // other months
}

// crowdType: "holiday" | "normal" | "low"
export function getCrowdScore(crowdType = "normal") {
  if (crowdType === "holiday") return 40;
  if (crowdType === "low") return 90;
  return 70;
}
