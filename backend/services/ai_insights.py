import os
import json
from groq import Groq
from dotenv import load_dotenv
from typing import List, Dict

load_dotenv()

class AIInsightsService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.client = Groq(api_key=self.api_key) if self.api_key else None

    def _get_fallback_results(self, weather_data: List[Dict], crops_count: int) -> Dict:
        """Rule-based calculation for agricultural insights when AI is unavailable."""
        irrig_count = sum(1 for d in weather_data if d.get('rain_prob', 0) < 30 and d.get('temp_max', d.get('temperature', 0)) > 25)
        rain_count = sum(1 for d in weather_data if d.get('rain_prob', 0) > 60)
        storm_count = sum(1 for d in weather_data if d.get('wind_speed', 0) > 40)
        
        if crops_count == 0:
            summary = "HAL AI Verdict: Fields are ready for monitoring. Register your first crop to activate personalized irrigation intelligence."
        else:
            if rain_count > 3:
                summary = f"HAL AI Verdict: High rainfall expected this week ({rain_count} days). Conserve water and pause manual irrigation cycles."
            elif irrig_count > 4:
                summary = f"HAL AI Verdict: Sustained heatwave detected. Prioritize consistent irrigation across all {crops_count} tracked crops."
            else:
                summary = "HAL AI Verdict: Stable conditions ahead. Follow your standard irrigation schedule and monitor soil moisture levels."

        return {
            "irrigation_days": irrig_count,
            "rain_expected": rain_count,
            "storm_alerted": storm_count,
            "summary": summary
        }

    def get_weekly_insights(self, weather_data: List[Dict], crops_count: int) -> Dict:
        if not self.client:
            return self._get_fallback_results(weather_data, crops_count)

        prompt = f"""
        Analyze the following 10-day weather forecast for a farm and provide structured insights.
        Forecast Data: {json.dumps(weather_data)}
        Number of tracked crops: {crops_count}

        Respond ONLY in JSON format with the following keys:
        - irrigation_days: (int) the number of days where irrigation is recommended (based on rain probability < 30% and temp > 25°C).
        - rain_expected: (int) number of days where rain probability > 60%.
        - storm_alerted: (int) number of days with wind speed > 40km/h or severe thunderstorm conditions.
        - summary: (string) A concise, premium 1-sentence summary of the week's agricultural outlook.

        Example Output:
        {{
            "irrigation_days": 4,
            "rain_expected": 2,
            "storm_alerted": 0,
            "summary": "A warm week ahead with scattered showers; prioritize irrigation on Tuesday and Friday to maintain optimal soil moisture."
        }}
        """

        try:
            response = self.client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "You are a professional agricultural AI analyst."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"AI Insights Error (Falling back to rules): {e}")
            return self._get_fallback_results(weather_data, crops_count)

ai_insights_service = AIInsightsService()
