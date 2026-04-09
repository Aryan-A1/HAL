export interface Crop {
  id: string;
  name: string;
  stage?: string;
  notes?: string;
  createdAt: Date;
}

export type WeatherCondition = "sunny" | "rainy" | "windy" | "thunderstorm" | "cloudy";

export interface DayWeather {
  date: Date;
  condition: WeatherCondition;
  temperature?: number;
  recommendation: string;
  irrigationNeeded: boolean;
  rainfall?: number;
  rain_prob?: number;
  wind_speed?: number;
}

export interface AIInsights {
  irrigation_days: number;
  rain_expected: number;
  storm_alerted: number;
  summary: string;
}
