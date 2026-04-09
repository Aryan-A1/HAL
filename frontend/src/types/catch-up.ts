export type CropStatus = 'healthy' | 'at-risk' | 'needs-attention';
export type WaterStatus = 'good' | 'needs-water' | 'overwatered';
export type DiseaseStatus = 'healthy' | 'monitor' | 'issue';
export type ActivityType = 'watered' | 'scanned' | 'fertilized' | 'harvested' | 'planted';
export type AlertSeverity = 'urgent' | 'warning' | 'info';

export interface CropActivity {
  id: string;
  cropId: string;
  cropName: string;
  date: Date;
  type: ActivityType;
  note: string;
}

export interface CatchUpCrop {
  id: string;
  name: string;
  emoji: string;
  status: CropStatus;
  growthStage: string;
  plantingDate: Date;
  harvestEstimate: Date;
  lastUpdated: Date;
  // Watering
  lastWatered: Date;
  nextWatering: Date;
  waterStatus: WaterStatus;
  // Disease
  diseaseStatus: DiseaseStatus;
  diseaseName?: string;
  diseaseConfidence?: number;
  // Meta
  area?: string;
  notes?: string;
  suggestions: string[];
  activities: CropActivity[];
}

export interface CropAlert {
  id: string;
  type: AlertSeverity;
  message: string;
  sub?: string;
}
