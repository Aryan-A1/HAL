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
        # 1. Calculate counts using a more realistic "Interval-based" logic
        # Even if it's hot, you don't water EVERY day. We simulate a 3-day depletion cycle.
        irrig_count = 0
        days_since_last_water = 0
        
        for d in weather_data:
            temp = d.get('temp_max', d.get('temperature', 0))
            rain = d.get('rain_prob', 0)
            
            # Simple simulation: depletion happens on hot days, recharge on rainy ones
            is_hot_dry = rain < 30 and temp > 28
            is_rainy = rain > 60
            
            if is_rainy:
                days_since_last_water = 0 # Rain resets the cycle
            elif is_hot_dry:
                days_since_last_water += 1
                
            # If it's been hot/dry for 3+ days, we need to irrigate
            if days_since_last_water >= 3:
                irrig_count += 1
                days_since_last_water = 0 # Reset after irrigation

        rain_count = sum(1 for d in weather_data if d.get('rain_prob', 0) > 60)
        storm_count = sum(1 for d in weather_data if d.get('wind_speed', 0) > 40)

        # 2. If AI is not available, return fallback results immediately
        if not self.client:
            return self._get_fallback_results_from_counts(irrig_count, rain_count, storm_count, crops_count)

        # 3. Use AI only for the creative/summary part, passing it the CORRECT counts
        prompt = f"""
        Provide a concise, premium 1-sentence agricultural outlook for a farmer based on these CALCULATED stats:
        - Irrigation Days: {irrig_count}
        - Rain Expected: {rain_count} days
        - Storm Alerts: {storm_count}
        - Tracked Crops: {crops_count}
        
        Weather Context (for tone only): {json.dumps(weather_data[:3])}

        Respond in JSON with the key 'summary'.
        """

        try:
            response = self.client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "You are a professional agricultural AI analyst."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.2 # Lower temperature for consistency
            )
            ai_data = json.loads(response.choices[0].message.content)
            
            return {
                "irrigation_days": irrig_count,
                "rain_expected": rain_count,
                "storm_alerted": storm_count,
                "summary": ai_data.get("summary", "Stable conditions ahead for your crops.")
            }
        except Exception as e:
            print(f"AI Insights Error: {e}")
            return self._get_fallback_results_from_counts(irrig_count, rain_count, storm_count, crops_count)

    def _get_fallback_results_from_counts(self, irrig_count, rain_count, storm_count, crops_count) -> Dict:
        if crops_count == 0:
            summary = "HAL AI Verdict: Fields are ready for monitoring. Register your first crop to activate insights."
        elif rain_count > 3:
            summary = f"HAL AI Verdict: High rainfall expected ({rain_count} days). Pause manual irrigation."
        elif irrig_count > 4:
            summary = f"HAL AI Verdict: Sustained heat detected. Prioritize watering for all {crops_count} crops."
        else:
            summary = "HAL AI Verdict: Stable conditions ahead. Monitor soil moisture levels."

        return {
            "irrigation_days": irrig_count,
            "rain_expected": rain_count,
            "storm_alerted": storm_count,
            "summary": summary
        }

ai_insights_service = AIInsightsService()
