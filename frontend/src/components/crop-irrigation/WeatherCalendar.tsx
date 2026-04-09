import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  CloudRain,
  Wind,
  CloudLightning,
  Cloud,
  Droplets,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DayWeather } from "@/types/crop-irrigation";
import { Skeleton } from "@/components/ui/skeleton";

interface WeatherCalendarProps {
  days: DayWeather[];
  loading?: boolean;
}

const conditionConfig = {
  sunny: {
    icon: Sun,
    label: "Sunny",
    bgClass: "bg-amber-500/10",
    iconClass: "text-amber-500",
    borderClass: "border-amber-500/20",
  },
  rainy: {
    icon: CloudRain,
    label: "Rainy",
    bgClass: "bg-blue-500/10",
    iconClass: "text-blue-500",
    borderClass: "border-blue-500/20",
  },
  windy: {
    icon: Wind,
    label: "Windy",
    bgClass: "bg-emerald-500/10",
    iconClass: "text-emerald-500",
    borderClass: "border-emerald-500/20",
  },
  thunderstorm: {
    icon: CloudLightning,
    label: "Storm",
    bgClass: "bg-purple-500/10",
    iconClass: "text-purple-500",
    borderClass: "border-purple-500/20",
  },
  cloudy: {
    icon: Cloud,
    label: "Cloudy",
    bgClass: "bg-slate-500/10",
    iconClass: "text-slate-500",
    borderClass: "border-slate-500/20",
  },
};

const WeatherCalendar = ({ days, loading }: WeatherCalendarProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-[2px] bg-primary rounded-full" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Live Outlook</span>
          </div>
          <h2 className="text-3xl font-heading font-black text-foreground tracking-tight">
            10-Day Forecast
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-xl border border-primary/10 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-xl border border-primary/10 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-6 pt-2 scrollbar-hide snap-x snap-mandatory px-1"
        style={{ scrollbarWidth: "none" }}
      >
        {(loading ? Array(10).fill(null) : days).map((day, i) => {
          if (!day) return (
            <div key={i} className="snap-start min-w-[150px]">
              <Skeleton className="h-[220px] w-full rounded-2xl bg-white/50" />
            </div>
          );

          const config = conditionConfig[day.condition as keyof typeof conditionConfig] || conditionConfig.sunny;
          const Icon = config.icon;
          const dayDate = new Date(day.date);
          dayDate.setHours(0, 0, 0, 0);
          const isToday = dayDate.getTime() === today.getTime();

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="snap-start"
            >
              <Card
                className={`min-w-[150px] w-[150px] border-none shadow-none transition-all duration-300 ${
                  isToday ? "scale-105" : "hover:scale-102"
                }`}
              >
                <CardContent className={`p-0 rounded-2xl overflow-hidden bg-white border border-transparent ${isToday ? "ring-2 ring-primary ring-offset-2" : "group-hover:border-primary/5 shadow-sm"}`}>
                  <div className={`p-4 text-center space-y-3 ${isToday ? "bg-primary/5" : ""}`}>
                    <div className="space-y-0.5">
                      <div className="text-sm font-black text-foreground uppercase tracking-tight">
                        {dayDate.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground/60">
                        {dayDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    </div>

                    <div className={`w-12 h-12 rounded-full mx-auto ${config.bgClass} flex items-center justify-center transition-transform hover:rotate-12`}>
                      <Icon className={`w-6 h-6 ${config.iconClass}`} />
                    </div>

                    <div className="space-y-1">
                      <div className="text-xl font-black text-foreground flex items-center justify-center gap-1">
                        {day.temperature ?? "--"}
                        <span className="text-xs font-bold text-muted-foreground">°C</span>
                      </div>
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        {config.label}
                      </div>
                    </div>
                  </div>

                  <div className={`px-3 py-3 text-[10px] font-bold text-center border-t border-dashed ${day.irrigationNeeded ? "bg-blue-50/50 text-blue-700" : "bg-muted/30 text-muted-foreground"}`}>
                    <div className="flex flex-col items-center gap-1">
                      {day.irrigationNeeded ? (
                        <>
                          <Droplets className="w-3 h-3 animate-bounce" />
                          <span>IRRIGATE</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                          <span>OPTIMAL</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherCalendar;
