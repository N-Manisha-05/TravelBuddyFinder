// routes/safety.js
import express from "express";
import { getWeatherData } from "../utils/weather.js";
import { getCrimeScore } from "../utils/crime.js";
import { getSeasonScoreByMonth, getCrowdScore } from "../utils/season.js";
import { predictSafety, getSafetyLabel } from "../ml/safetyModel.js";

const router = express.Router();

/**
 * POST /api/safety/score
 * body: { destination: "Goa", crowd?: "holiday"|"normal"|"low", month?: 1-12 }
 */
router.post("/score", async (req, res) => {
  try {
    const { destination, crowd = "normal", month } = req.body;
    const weather = await getWeatherData(destination);
    const crimeScore = getCrimeScore(destination);
    const seasonScore = getSeasonScoreByMonth(month || new Date().getMonth() + 1);
    const crowdScore = getCrowdScore(crowd);

    const score = predictSafety({
      weather: weather.weatherScore,
      crime: crimeScore,
      crowd: crowdScore,
      season: seasonScore,
    });

    res.json({
      score,
      label: getSafetyLabel(score),
      weather: weather.main,
      temperature: weather.temp,
      components: {
        weatherScore: weather.weatherScore,
        crimeScore,
        crowdScore,
        seasonScore,
      },
    });
  } catch (err) {
    console.error("Safety route error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
