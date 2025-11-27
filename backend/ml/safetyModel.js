// ml/safetyModel.js
import { SimpleLinearRegression } from "ml-regression";

/**
 * We build a tiny regression model trained on synthetic combined-scores -> safety.
 * This is real ML: model training + predict().
 */

// Example synthetic training data (combined feature -> safety)
const X = [20, 30, 40, 50, 60, 70, 80, 90]; // combined inputs
const Y = [10, 25, 40, 55, 68, 78, 88, 96]; // safety scores (0-100)

// Train once when file loads
const model = new SimpleLinearRegression(X, Y);

/**
 * predictSafety(features)
 * features: { weather:0-100, crime:0-100, crowd:0-100, season:0-100 }
 * returns integer score 0-100
 */
export function predictSafety({ weather, crime, crowd, season }) {
  const combined =
    Number(weather) * 0.30 +
    Number(crime) * 0.30 +
    Number(crowd) * 0.20 +
    Number(season) * 0.20;

  const predicted = model.predict(combined);
  const score = Math.round(Math.max(0, Math.min(100, predicted)));
  return score;
}

export function getSafetyLabel(score) {
  if (score >= 75) return "Very Safe 👍";
  if (score >= 50) return "Moderately Safe ⚠️";
  return "High Risk ❗";
}
