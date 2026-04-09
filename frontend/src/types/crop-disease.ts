export interface AnalysisResult {
  cropName: string;
  diseaseName: string;
  confidence: number;
  description: string;
  chemical: string;
  organic: string;
  precautions: string;
  stores: string;
}

export interface HistoryEntry {
  id: string;
  date: string;
  imageSrc: string;
  diseaseName: string;
  confidence: number;
}
