// utils/crime.js
import crimeData from "../data/crime.json" assert { type: "json" }; // if your bundler doesn't support, use require

export function getCrimeScore(place) {
  const p = (place || "").toLowerCase();
  const raw = crimeData[p] ?? 50; // raw crime index: higher means more crime
  // Convert to safety scale: lower raw crime -> higher score (0-100)
  const score = Math.max(0, Math.min(100, 100 - raw));
  return score;
}
