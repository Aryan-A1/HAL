import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets, MapPin, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useTranslation } from "@/hooks/useTranslation";
import { useProfileStore } from "@/store/useProfileStore";


const CropIrrigation = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ── Profile data (global store — set by Profile page) ──────────────────
  const profileCrops   = useProfileStore((s) => s.crops);
  const profileSoil    = useProfileStore((s) => s.soilType);
  const profileSavedAt = useProfileStore((s) => s.savedAt);
  const { t } = useTranslation();

  // 1. Fetch Location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {
          setLocation({ lat: 28.6139, lon: 77.209 }); // Default Delhi
          toast({
            title: "Location Access Denied",
            description: "Using default location for New Delhi.",
          });
        }
      );
    } else {
      setLocation({ lat: 28.6139, lon: 77.209 });
    }
  }, [toast]);

  // 2. Fetch Crops from DB
  const { data: crops = [], isLoading: isCropsLoading } = useQuery<Crop[]>({
    queryKey: ["crops"],
    queryFn: async () => {
      const data = await apiService.get("/api/crops/");
      return data.map((c: any) => ({
        id: c.id.toString(),
        name: c.crop_name,
        stage: c.growth_stage,
        notes: c.notes,
        createdAt: new Date(c.created_at)
      }));
    }
  });

  // 3. Fetch Weather
  const { data: weatherData, isLoading: isWeatherLoading, refetch: refetchWeather } = useQuery({
    queryKey: ["weather", location],
    queryFn: async () => {
      if (!location) return [];
      const raw = await apiService.get(`/api/weather/forecast?lat=${location.lat}&lon=${location.lon}&days=16`);
      
      return raw.map((d: any) => ({
        date: new Date(d.date),
        condition: (d.rain_prob > 60 ? "rainy" : d.temp_max > 30 ? "sunny" : d.wind_speed > 20 ? "windy" : "cloudy") as WeatherCondition,
        temperature: Math.round(d.temp_max),
        rainfall: d.rainfall,
        rain_prob: d.rain_prob,
        wind_speed: d.wind_speed,
        irrigationNeeded: d.rain_prob < 30 && d.temp_max > 25,
        recommendation: d.rain_prob > 60 ? "No watering needed" : d.temp_max > 30 ? "Water today" : "Monitor moisture"
      }));
    },
    enabled: !!location,
  });

  // 4. Fetch AI Insights
  const { data: aiInsights, isLoading: isAIWaiting } = useQuery<AIInsights>({
    queryKey: ["ai-insights", weatherData, crops.length],
    queryFn: async () => {
      return apiService.post("/api/weather/insights/weekly", { 
        weather_data: weatherData, 
        crops_count: crops.length 
      });
    },
    enabled: !!weatherData && weatherData.length > 0,
  });

  // Mutations
  const addCropMutation = useMutation({
    mutationFn: async (newCrop: any) => {
      const today = new Date();
      const harvestDate = new Date(today);
      harvestDate.setDate(today.getDate() + 120); // Default 4 months

      // Use profile soil type if available, otherwise fallback
      const soilType = profileSoil
        ? SOIL_LABELS[profileSoil] || profileSoil
        : "Loamy";

      return apiService.post("/api/crops/", {
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

  const handleAddCrop = (name: string, stage?: string, notes?: string) => {
    addCropMutation.mutate({ name, stage, notes });
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
                    {t.irrigation.title}
                  </h1>
                  <p className="text-muted-foreground text-lg max-w-md">
                    {t.irrigation.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="flex items-center gap-3">
              <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium text-foreground/80 border-primary/10">
                <MapPin className="w-4 h-4 text-primary" />
                {location ? t.irrigation.stationActive : t.irrigation.locating}
              </div>
              <Button variant="outline" size="icon" onClick={() => refetchWeather()} className="rounded-xl border-primary/10">
                <RefreshCw className={`w-4 h-4 ${isWeatherLoading ? "animate-spin" : ""}`} />
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
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-24 space-y-16">
        <InsightsBanner 
          days={weatherData || []} 
          cropCount={crops.length} 
          aiInsights={aiInsights}
          loading={isAIWaiting || isWeatherLoading}
        />

        <div className="relative">
          <div className="absolute inset-0 bg-primary/5 rounded-[2rem] -rotate-1 pointer-events-none" />
          <div className="relative glass p-8 rounded-[2rem] border-primary/10">
            <WeatherCalendar days={weatherData || []} loading={isWeatherLoading} />
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
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CropIrrigation;
