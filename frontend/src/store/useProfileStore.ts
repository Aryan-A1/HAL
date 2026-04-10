import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ProfileCrop {
  id: string;
  name: string;
  plantingDate: string;
  growthStage: string;
}

export interface ProfileData {
  photoUrl: string | null;
  phone: string;
  country: string;
  state: string;
  city: string;
  village: string;
  soilType: string;
  crops: ProfileCrop[];
  savedAt: string | null;
}

interface ProfileState extends ProfileData {
  saveProfile: (data: Omit<ProfileData, 'savedAt'>) => void;
  clearProfile: () => void;
}

const DEFAULT_STATE: ProfileData = {
  photoUrl: null,
  phone: '',
  country: '',
  state: '',
  city: '',
  village: '',
  soilType: '',
  crops: [],
  savedAt: null,
};

// ─── Store ─────────────────────────────────────────────────────────────────────

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      saveProfile: (data) =>
        set({ ...data, savedAt: new Date().toISOString() }),

      clearProfile: () => set(DEFAULT_STATE),
    }),
    {
      name: 'hal-profile', // persisted in localStorage
    }
  )
);
