import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CropSection from "@/components/crop-irrigation/CropSection";
import WeatherCalendar from "@/components/crop-irrigation/WeatherCalendar";
import InsightsBanner from "@/components/crop-irrigation/InsightsBanner";
import type { Crop, DayWeather, WeatherCondition } from "@/types/crop-irrigation";

const generateMockWeather = (): DayWeather[] => {
  const conditions: WeatherCondition[] = ["sunny", "rainy", "windy", "thunderstorm", "cloudy"];
  const today = new Date();
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temperature = Math.floor(Math.random() * 15) + 20;

    let recommendation: string;
    let irrigationNeeded: boolean;

    switch (condition) {
      case "rainy":
        recommendation = "No watering needed";
        irrigationNeeded = false;
        break;
      case "thunderstorm":
        recommendation = "Avoid irrigation";
        irrigationNeeded = false;
        break;
      case "sunny":
        recommendation = "Water crops today";
        irrigationNeeded = true;
        break;
      case "windy":
        recommendation = "Monitor moisture";
        irrigationNeeded = true;
        break;
      case "cloudy":
        recommendation = "Check soil first";
        irrigationNeeded = false;
        break;
      default:
        recommendation = "Monitor conditions";
        irrigationNeeded = false;
    }

    return { date, condition, temperature, recommendation, irrigationNeeded };
  });
};

const CropIrrigation = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const weatherData = useMemo(() => generateMockWeather(), []);

  const addCrop = (name: string, stage?: string, notes?: string) => {
    const newCrop: Crop = {
      id: crypto.randomUUID(),
      name,
      stage,
      notes,
      createdAt: new Date(),
    };
    setCrops((prev) => [...prev, newCrop]);
  };

  const removeCrop = (id: string) => {
    setCrops((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-8 section-padding">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                Crop Irrigation
              </h1>
              <p className="text-muted-foreground">
                Smart watering decisions powered by weather data
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 pb-20 space-y-12">
        <CropSection crops={crops} onAddCrop={addCrop} onRemoveCrop={removeCrop} />
        <WeatherCalendar days={weatherData} />
        <InsightsBanner days={weatherData} cropCount={crops.length} />
      </div>

      <Footer />
    </div>
  );
};

export default CropIrrigation;
