import requests
from datetime import datetime, timedelta

class WeatherService:
    @staticmethod
    def get_forecast(lat: float, lon: float, days: int = 16):
        """
        Fetches daily weather forecast from Open-Meteo with precipitation probability.
        """
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "daily": [
                "temperature_2m_max",
                "precipitation_sum",
                "precipitation_probability_max",
                "windspeed_10m_max",
                "sunshine_duration",
                "relative_humidity_2m_mean"
            ],
            "forecast_days": days,
            "timezone": "auto"
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            daily_data = data.get("daily", {})
            results = []
            
            for i in range(len(daily_data.get("time", []))):
                results.append({
                    "date": daily_data["time"][i],
                    "temp_max": daily_data["temperature_2m_max"][i] or 25,
                    "rainfall": daily_data["precipitation_sum"][i] or 0,
                    "rain_prob": daily_data.get("precipitation_probability_max", [0]*len(daily_data["time"]))[i] or 0,
                    "wind_speed": daily_data["windspeed_10m_max"][i] or 0,
                    "sunlight_hours": round((daily_data["sunshine_duration"][i] or 0) / 3600, 2),
                    "humidity": daily_data["relative_humidity_2m_mean"][i] or 50
                })
            
            return results
        except Exception as e:
            print(f"Weather API Error: {e}")
            return None

# Singleton
weather_service = WeatherService()
