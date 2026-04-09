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
}
