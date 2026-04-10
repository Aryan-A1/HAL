import { apiService } from './apiService';

export interface ForecastRequest {
  crop_id?: number | null;
  lat: number;
  lon: number;
  crop_type: string;
  soil_type: string;
  sowing_date: string;
  region: string;
  water_source?: string;
  field_area_hectare?: number;
  mulching_used?: string;
}

export interface IrrigationRecommendation {
  irrigate: boolean;
  amount_mm: number;
  gross_amount_mm: number;
  reason: string;
}

export interface DayForecast {
  date: string;
  weather: {
    temp_max: number;
    rainfall: number;
    rain_prob: number;
    wind_speed: number;
    sunlight_hours: number;
    humidity: number;
  };
  simulated_moisture: number;
  recommendation: IrrigationRecommendation;
  confidence: {
    level: string;
    reason: string;
  };
  efficiency_info: string;
}

export interface IrrigationForecastResponse {
  crop: string;
  module: string;
  upcoming_date: string | null;
  calendar: DayForecast[];
}

export const irrigationApi = {
  getForecast: async (params: ForecastRequest): Promise<IrrigationForecastResponse> => {
    // Inject default values for hidden fields as per requirement
    const payload = {
      ...params,
      water_source: params.water_source || 'Canal',
      field_area_hectare: params.field_area_hectare || 1.0,
      mulching_used: params.mulching_used || 'No',
    };

    return apiService.post('/api/irrigation/forecast', payload);
  },
};
