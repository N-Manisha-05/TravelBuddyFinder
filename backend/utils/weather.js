// utils/weather.js
import axios from "axios";

const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY || "";

export async function getWeatherData(place) {
  // If no API key, use fallback mapping
  if (!OPENWEATHER_KEY) {
    return getFallbackWeather(place);
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      place
    )}&appid=${OPENWEATHER_KEY}&units=metric`;
    const res = await axios.get(url, { timeout: 5000 });

    const main = (res.data.weather?.[0]?.main || "Clear").toLowerCase();
    const temp = res.data.main?.temp ?? null;

    let weatherScore = 80;
    if (main.includes("storm") || main.includes("tornado")) weatherScore = 20;
    else if (main.includes("rain") || main.includes("drizzle")) weatherScore = 40;
    else if (main.includes("cloud")) weatherScore = 60;
    else if (main.includes("clear")) weatherScore = 90;

    return { main, temp, weatherScore };
  } catch (err) {
    console.warn("Weather API failed, using fallback:", err.message);
    return getFallbackWeather(place);
  }
}

function getFallbackWeather(place) {
  // Simple heuristics if no API available.
  const rainy = ["munnar", "meghalaya", "cherrapunji"];
  const cold = ["manali", "shimla", "leh", "kashmir"];
  const hot = ["goa", "jaipur", "rajasthan", "rajasthan"];
  const p = (place || "").toLowerCase();

  if (rainy.some((c) => p.includes(c))) return { main: "rain", temp: 22, weatherScore: 40 };
  if (cold.some((c) => p.includes(c))) return { main: "clear", temp: 5, weatherScore: 85 };
  if (hot.some((c) => p.includes(c))) return { main: "clear", temp: 35, weatherScore: 70 };

  return { main: "clear", temp: 25, weatherScore: 75 };
}
