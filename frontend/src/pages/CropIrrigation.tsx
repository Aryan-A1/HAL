import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets, MapPin, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CropSection from "@/components/crop-irrigation/CropSection";
import WeatherCalendar from "@/components/crop-irrigation/WeatherCalendar";
import InsightsBanner from "@/components/crop-irrigation/InsightsBanner";
import ProfileCropPanel from "@/components/crop-irrigation/ProfileCropPanel";
import type { Crop, WeatherCondition, AIInsights } from "@/types/crop-irrigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/services/apiService";
import { irrigationApi } from "@/services/irrigationApi";
import { useProfileStore } from "@/store/useProfileStore";

// ─── Simple Geocoder Logic (as requested) ──────────────────────────────────
const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  "ludhiana": { lat: 30.90, lon: 75.85 },
  "amritsar": { lat: 31.63, lon: 74.87 },
  "jalandhar": { lat: 31.33, lon: 75.58 },
  "patiala": { lat: 30.33, lon: 76.38 },
  "bathinda": { lat: 30.21, lon: 74.94 },
  "chandigarh": { lat: 30.73, lon: 76.77 },
  "delhi": { lat: 28.61, lon: 77.21 },
  "new delhi": { lat: 28.61, lon: 77.21 },
};

const getCoordinates = (city: string) => {
  return CITY_COORDINATES[city.toLowerCase()] || CITY_COORDINATES["ludhiana"];
};


const CropIrrigation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ── Profile data (global store — set by Profile page) ──────────────────
  const profileCrops   = useProfileStore((s) => s.crops);
  const profileSoil    = useProfileStore((s) => s.soilType);
  const profileSavedAt = useProfileStore((s) => s.savedAt);
  const profileCity    = useProfileStore((s) => s.city);
  const profileState   = useProfileStore((s) => s.state);

  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  // 1. Determine Location from Profile (Primary) or Geolocation (Secondary)
  useEffect(() => {
    if (profileCity || profileState) {
      const coords = getCoordinates(profileCity || profileState);
      setLocation(coords);
      console.log(`Using Profile Location: ${profileCity}, ${profileState} ->`, coords);
    } else if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {
          setLocation(CITY_COORDINATES["ludhiana"]); // Default fallback as requested
        }
      );
    } else {
      setLocation(CITY_COORDINATES["ludhiana"]);
    }
  }, [profileCity, profileState]);

  // 2. Fetch Crops from DB
  const { data: crops = [], isLoading: isCropsLoading } = useQuery<Crop[]>({
    queryKey: ["crops"],
    queryFn: async () => {
      const data = await apiService.get("/api/crops");
      return data.map((c: any) => ({
        id: c.id.toString(),
        name: c.crop_name,
        stage: c.growth_stage,
        notes: c.notes,
        createdAt: new Date(c.created_at)
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
    placeholderData: keepPreviousData,
  });

  // 3. Fetch Smart Irrigation Forecast (The Core AI Integration)
  const mainProfileCrop = profileCrops?.[0];
  const { data: forecastData, isLoading: isForecastLoading, refetch: refetchForecast } = useQuery({
    queryKey: ["irrigation-forecast", location, mainProfileCrop?.name],
    queryFn: async () => {
      if (!location) return null;
      
      return irrigationApi.getForecast({
        lat: location.lat,
        lon: location.lon,
        crop_type: mainProfileCrop?.name || "Wheat", // Fallback to wheat
        soil_type: profileSoil || "loamy",
        sowing_date: mainProfileCrop?.plantingDate || new Date().toISOString().split('T')[0],
        region: profileState || "North",
      });
    },
    enabled: !!location,
    staleTime: 1000 * 60 * 30, // 30 minutes fresh for irrigation
    gcTime: 1000 * 60 * 60, // Keep in garbage collector for 1 hour
    placeholderData: keepPreviousData,
  });

  // Map forecastData to WeatherCalendar expectations
  const weatherData = forecastData?.calendar?.map((d: any) => ({
    date: new Date(d.date),
    condition: (d.weather.rain_prob > 60 ? "rainy" : d.weather.temp_max > 30 ? "sunny" : d.weather.wind_speed > 20 ? "windy" : "cloudy") as WeatherCondition,
    temperature: Math.round(d.weather.temp_max),
    rainfall: d.weather.rainfall,
    rain_prob: d.weather.rain_prob,
    wind_speed: d.weather.wind_speed,
    irrigationNeeded: d.recommendation.irrigate,
    recommendation: d.recommendation.reason,
    // Add extra details
    simulated_moisture: d.simulated_moisture,
    gross_amount_mm: d.recommendation.gross_amount_mm,
    confidence_level: d.confidence.level,
    confidence_reason: d.confidence.reason
  })) || [];

  // 4. Derive AI Insights Summary from Forecast
  const aiInsights: AIInsights | undefined = forecastData ? {
    irrigation_days: forecastData.calendar.filter(d => d.recommendation.irrigate).length,
    rain_expected: forecastData.calendar.filter(d => d.weather.rainfall > 5).length,
    storm_alerted: forecastData.calendar.filter(d => d.weather.wind_speed > 40).length,
    summary: forecastData.calendar.find(d => d.recommendation.irrigate)?.recommendation.reason || "Soil moisture levels are currently optimal across the forecast period.",
    upcoming_date: forecastData.upcoming_date
  } : undefined;

  // Mutations
  const addCropMutation = useMutation({
    mutationFn: async (newCrop: any) => {
      const today = new Date();
      const harvestDate = new Date(newCrop.plantingDate || today);
      harvestDate.setDate(harvestDate.getDate() + 120); // Default 4 months

      // Use profile soil type if available, otherwise fallback
      const soilType = profileSoil
        ? SOIL_LABELS[profileSoil] || profileSoil
        : "Loamy";

      return apiService.post("/api/crops", {
        crop_name: newCrop.name,
        soil_type: soilType,
        sowing_date: newCrop.plantingDate || today.toISOString().split('T')[0],
        expected_harvesting_date: harvestDate.toISOString().split('T')[0],
        growth_stage: newCrop.stage || "Seedling",
        notes: newCrop.notes || ""
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crops"] });
      toast({ title: "Crop Added", description: "Successfully tracked new crop." });
    }
  });

  const handleAddCrop = (name: string, stage?: string, notes?: string, plantingDate?: string) => {
    addCropMutation.mutate({ name, stage, notes, plantingDate });
  };

  const handleRemoveCrop = (id: string) => {
    toast({ title: "Feature coming soon", description: "Crop deletion is being integrated with the secure vault." });
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] selection:bg-primary/20">
      <Navbar />

      <section className="pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3 h-3" />
                AI-Powered Agriculture
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl premium-gradient flex items-center justify-center premium-shadow">
                  <Droplets className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-heading font-black text-foreground tracking-tight">
                    Crop Irrigation
                  </h1>
                  <p className="text-muted-foreground text-lg max-w-md">
                    Precision watering guided by real-time weather & HAL AI.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="flex items-center gap-3">
              <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium text-foreground/80 border-primary/10">
                <MapPin className="w-4 h-4 text-primary" />
                {profileCity ? `${profileCity}, ${profileState}` : location ? "Ludhiana, Punjab" : "Locating..."}
              </div>
              <Button variant="outline" size="icon" onClick={() => refetchForecast()} className="rounded-xl border-primary/10">
                <RefreshCw className={`w-4 h-4 ${isForecastLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Profile Crop Panel ───────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 mb-2">
        <ProfileCropPanel
          profileCrops={profileCrops}
          soilType={profileSoil}
          savedAt={profileSavedAt}
          trackedCropsCount={crops.length}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-24 space-y-16">
        <InsightsBanner 
          days={weatherData || []} 
          cropCount={crops.length} 
          aiInsights={aiInsights}
          loading={isForecastLoading}
        />

        <div className="relative">
          <div className="absolute inset-0 bg-primary/5 rounded-[2rem] -rotate-1 pointer-events-none" />
          <div className="relative glass p-8 rounded-[2rem] border-primary/10">
            <WeatherCalendar days={weatherData || []} loading={isForecastLoading} />
          </div>
        </div>

        <div>
          {isCropsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <CropSection
              crops={crops}
              onAddCrop={handleAddCrop}
              onRemoveCrop={handleRemoveCrop}
              profileCrops={profileCrops}
              forecastDays={weatherData}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CropIrrigation;
