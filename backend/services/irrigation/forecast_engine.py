import json
import os
from datetime import datetime, timedelta
from pathlib import Path
from services.weather_service import weather_service
from services.irrigation.ml_service import get_ml_service

class ForecastEngine:
    def __init__(self):
        # Prefer env override, otherwise resolve repo root relative to this file.
        base_dir = os.getenv("HAL_BASE_DIR")
        if base_dir:
            base_path = Path(base_dir)
        else:
            base_path = Path(__file__).resolve().parents[3]

        self.base_dir = str(base_path)
        self.data_dir = str(base_path / "data" / "irrigation_prediction" / "configs")
        self.ml_service = get_ml_service()

    def _load_json(self, filename):
        path = os.path.join(self.data_dir, filename)
        if os.path.exists(path):
            with open(path, "r") as f:
                return json.load(f)
        return {}

    def get_30_day_forecast(self, farmer_input: dict):
        weather_forecast = weather_service.get_forecast(farmer_input["lat"], farmer_input["lon"])
        if not weather_forecast: return None
            
        soil_defaults = self._load_json("soil_defaults.json").get(farmer_input["soil_type"], {})
        kc_data = self._load_json("crop_kc_table.json").get(farmer_input["crop_type"], self._load_json("crop_kc_table.json")["default"])
        regional_climate = self._load_json("regional_climate.json")
        
        field_capacity = float(soil_defaults.get("field_capacity", 45.0))
        wilting_point = float(soil_defaults.get("wilting_point", 15.0))
        current_moisture = float(soil_defaults.get("Soil_Moisture", 25.0))
        
        sowing_date = datetime.strptime(farmer_input["sowing_date"], "%Y-%m-%d")
        current_date = datetime.now()
        last_irrigation_applied = 0.0 
        calendar = []
        
        irrigation_methods = self._load_json("irrigation_methods.json")
        irrigation_type = farmer_input.get("irrigation_type", "Surface")
        method_cfg = irrigation_methods.get(irrigation_type, irrigation_methods.get("Surface"))
        efficiency = method_cfg["efficiency"]

        for day_idx in range(30):
            day_date = current_date + timedelta(days=day_idx)
            
            if day_idx < len(weather_forecast):
                w = weather_forecast[day_idx]
            else:
                rc = regional_climate.get(farmer_input["region"], regional_climate.get("North", {}))
                month_data = rc.get(day_date.strftime("%B"), rc.get("April", {}))
                w = {
                    "temp_max": month_data.get("Temperature_C", 30),
                    "rainfall": month_data.get("Rainfall_mm", 0) / 30,
                    "rain_prob": 20,
                    "wind_speed": month_data.get("Wind_Speed_kmh", 10),
                    "sunlight_hours": month_data.get("Sunlight_Hours", 8),
                    "humidity": month_data.get("Humidity", 50)
                }
            
            das = (day_date - sowing_date).days
            growth_stage = self._get_growth_stage(farmer_input["crop_type"], das)
            kc = kc_data["kc"].get(growth_stage, 0.7)
            
            # Simulation
            current_moisture += w["rainfall"] * 0.6 
            evap_loss = (w["temp_max"] * 0.08 + w["sunlight_hours"] * 0.04) * kc
            current_moisture = max(0, current_moisture - evap_loss)
            current_moisture = min(field_capacity, current_moisture)

            features = {
                "Soil_Type": farmer_input["soil_type"],
                "Soil_pH": soil_defaults.get("Soil_pH", 7.0),
                "Soil_Moisture": current_moisture, 
                "Organic_Carbon": soil_defaults.get("Organic_Carbon", 0.5),
                "Electrical_Conductivity": soil_defaults.get("Electrical_Conductivity", 1.2),
                "Temperature_C": w["temp_max"],
                "Humidity": w["humidity"],
                "Rainfall_mm": w["rainfall"],
                "Sunlight_Hours": w["sunlight_hours"],
                "Wind_Speed_kmh": w["wind_speed"],
                "Crop_Type": farmer_input["crop_type"],
                "Crop_Growth_Stage": growth_stage,
                "Season": self._get_season(day_date.month),
                "Irrigation_Type": irrigation_type,
                "Water_Source": farmer_input["water_source"],
                "Field_Area_hectare": farmer_input["field_area_hectare"],
                "Mulching_Used": farmer_input["mulching_used"],
                "Previous_Irrigation_mm": last_irrigation_applied,
                "Region": farmer_input["region"]
            }
            
            prediction = self.ml_service.predict(features)
            
            # Upscale amount for actual pumping recommendation (Net -> Gross)
            if prediction["irrigate"] and prediction["amount_mm"] > 0:
                # We need to apply more to account for efficiency loss
                prediction["gross_amount_mm"] = round(prediction["amount_mm"] / efficiency, 1)
            else:
                prediction["gross_amount_mm"] = 0.0

            # Rain-Safe
            rain_safe_skip = False
            if day_idx < len(weather_forecast) - 2:
                n1, n2 = weather_forecast[day_idx+1], weather_forecast[day_idx+2]
                if (n1["rain_prob"] > 60 and n1["rainfall"] > 10) or (n2["rain_prob"] > 60 and n2["rainfall"] > 10):
                    rain_safe_skip = True

            IRRIGATION_THRESHOLD_MM = 5.0
            if rain_safe_skip and current_moisture > (wilting_point + 5):
                prediction["irrigate"], prediction["amount_mm"], prediction["gross_amount_mm"] = False, 0.0, 0.0
                prediction["reason"] = "Rain is expected in the next 48 hours. Conserving water by skipping today."
            elif prediction["irrigate"]:
                if prediction["amount_mm"] < IRRIGATION_THRESHOLD_MM:
                    prediction["irrigate"], prediction["amount_mm"], prediction["gross_amount_mm"] = False, 0.0, 0.0
                    prediction["reason"] = "Soil moisture is stable."
                else:
                    prediction["reason"] = self._generate_reason(w, current_moisture, wilting_point, growth_stage)
            else:
                prediction["reason"] = "Conditions are optimal. Surface moisture is sufficient."

            if prediction["irrigate"]:
                # Only the 'efficiency' part of the water reaches the root zone
                current_moisture = min(field_capacity, current_moisture + (prediction["gross_amount_mm"] * efficiency))
                last_irrigation_applied = prediction["gross_amount_mm"]
            else:
                last_irrigation_applied = 0.0

            if day_idx < 7: conf = {"level": "High", "reason": "Short-term precise forecast"}
            elif day_idx < 16: conf = {"level": "Medium", "reason": "Extended range trend data"}
            else: conf = {"level": "Low", "reason": "Regional historical averages"}

            calendar.append({
                "date": day_date.strftime("%Y-%m-%d"),
                "weather": w,
                "simulated_moisture": round(current_moisture, 2),
                "recommendation": prediction,
                "confidence": conf,
                "efficiency_info": f"{int(efficiency*100)}% ({irrigation_type})"
            })
            
        return calendar

    def _generate_reason(self, w, moisture, wp, stage):
        if moisture < wp + 2: return f"CRITICAL: Soil moisture ({round(moisture, 1)}%) is near the wilting point."
        if w["temp_max"] > 35: return f"Extreme heat detected during {stage} stage."
        return f"Regular irrigation recommended to support optimal {stage} development."

    def _get_growth_stage(self, crop, das):
        if crop == "Sugarcane":
            if das < 45: return "Initial"
            if das < 120: return "Vegetative"
            if das < 270: return "Flowering"
            if das < 330: return "Grain Filling"
            return "Maturity"
        elif crop == "Potato":
            if das < 15: return "Initial"
            if das < 35: return "Vegetative"
            if das < 70: return "Flowering"
            if das < 95: return "Grain Filling"
            return "Maturity"
        else:
            if das < 20: return "Initial"
            if das < 50: return "Vegetative"
            if das < 90: return "Flowering"
            if das < 115: return "Grain Filling"
            return "Maturity"

    def _get_season(self, month):
        if month in [11, 12, 1, 2, 3, 4]: return "Rabi"
        if month in [5, 6]: return "Zaid"
        return "Kharif"

# Singleton
forecast_engine = ForecastEngine()
