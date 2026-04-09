import { apiService } from './apiService';
import type { AnalysisResult } from '@/types/crop-disease';

export const diseaseApi = {
  detectDisease: async (file: File): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Map the backend DiseaseDetectionResponse to frontend AnalysisResult
    const result = await apiService.postFormData('/api/disease/detect', formData);
    
    return {
      cropName: result.crop_name,
      diseaseName: result.disease_name,
      confidence: result.confidence,
      description: result.description,
      chemical: result.chemical,
      organic: result.organic,
      precautions: result.precautions,
      stores: result.stores
    };
  },

  detectDiseaseForCrop: async (file: File, cropId: number): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const result = await apiService.postFormData(`/api/disease/detect/${cropId}`, formData);
    
    return {
      cropName: result.crop_name,
      diseaseName: result.disease_name,
      confidence: result.confidence,
      description: result.description,
      chemical: result.chemical,
      organic: result.organic,
      precautions: result.precautions,
      stores: result.stores
    };
  }
};
