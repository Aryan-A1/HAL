import { useEffect, useState } from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { motion } from 'framer-motion';
import { MapPin, Sprout, AlertCircle, Droplets, CloudRain, Activity } from 'lucide-react';

interface CatchUpSummary {
  summary: string;
}

export const CatchUpWidget = () => {
  const profile = useProfileStore((s) => s);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const mainCrop = profile.crops?.[0];
  const locationStr = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');
  const soilType = profile.soilType;

  // Icons used: 🌾 📍 💧 🌦️ (represented via lucide-react and emojis)

  useEffect(() => {
    async function fetchInsights() {
      if (!mainCrop || !locationStr) return;
      setLoading(true);
      
      try {
        // 1. Fetch real module data (irrigation from crops)
        let lastIrrigation: string | null = null;
        let diseaseStatus: string | null = null; // No disease module in backend yet
        
        try {
          const { apiService } = await import('@/services/apiService');
          const myCrops = await apiService.get("/api/crops/");
          if (Array.isArray(myCrops)) {
            const dbCrop = myCrops.find((c: any) => c.crop_name.toLowerCase() === mainCrop.name.toLowerCase());
            if (dbCrop && dbCrop.last_irrigation_date) {
              lastIrrigation = new Date(dbCrop.last_irrigation_date).toLocaleDateString();
            }
          }
        } catch (e) {
          console.warn("Could not fetch backend crops. Continuing with profile data.");
        }

        // 2. Build summary dynamically using actual data
        const { apiService } = await import('@/services/apiService');
        const data = await apiService.post("/api/catchup", {
          crop: mainCrop.name,
          location: locationStr,
          soilType: soilType || undefined,
          plantingDate: mainCrop.plantingDate || undefined,
          lastIrrigation: lastIrrigation || undefined,
          diseaseStatus: diseaseStatus || undefined
        });
        
        setSummary(data.summary);
      } catch (err) {
        console.error(err);
        setSummary(`Your ${mainCrop.name} crop in ${locationStr} is currently active. Soil type is ${soilType || 'standard'}. Fetching further data failed.`);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, [mainCrop?.name, mainCrop?.plantingDate, locationStr, soilType]);

  if (!mainCrop || !locationStr) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6 text-amber-500" />
          </div>
          <h2 className="text-xl font-black text-gray-800 mb-2">Catch Up With Your Crop</h2>
          <p className="text-sm font-semibold text-gray-500">
            Please complete your profile (add a crop and location) to see personalized AI insights!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#A5D6A7]/50 shadow-sm overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1B5E20] via-green-400 to-[#81C784]" />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Activity className="w-5 h-5 text-[#1B5E20]" />
          </div>
          <h2 className="text-xl font-black text-gray-900 border-b-2 border-transparent hover:border-[#1B5E20] transition-colors pb-1">
            Catch Up With Your Crop <span className="ml-1 tracking-widest text-lg">💧 🌦️</span>
          </h2>
        </div>

        {/* Profile Info Display */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-gray-100">
            <span className="text-lg">🌾</span>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400">Crop</span>
              <span className="text-sm font-bold text-gray-800">{mainCrop.name}</span>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-gray-100">
            <span className="text-lg">📍</span>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400">Location</span>
              <span className="text-sm font-bold text-gray-800">{locationStr}</span>
            </div>
          </div>
          {soilType && (
            <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-gray-100">
              <span className="text-lg">🧪</span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-400">Soil</span>
                <span className="text-sm font-bold text-gray-800 capitalize">{soilType.replace('_', ' ')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Summary Details */}
        <div className="bg-[#F0F7F0]/50 p-5 rounded-xl border border-[#A5D6A7]/30">
          {loading ? (
            <div className="flex items-center gap-3 text-green-700 font-medium animate-pulse">
              <CloudRain className="w-5 h-5" /> Generating your personalized crop summary...
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed font-medium whitespace-pre-line">
              {typeof summary === 'string' ? summary : JSON.stringify(summary, null, 2)}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
