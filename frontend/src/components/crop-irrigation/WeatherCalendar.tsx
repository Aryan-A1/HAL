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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DayWeather } from "@/types/crop-irrigation";

interface WeatherCalendarProps {
  days: DayWeather[];
}

const conditionConfig = {
  sunny: {
    icon: Sun,
    label: "Sunny",
    bgClass: "bg-amber-50",
    iconClass: "text-amber-500",
    borderClass: "border-amber-200",
  },
  rainy: {
    icon: CloudRain,
    label: "Rainy",
    bgClass: "bg-blue-50",
    iconClass: "text-blue-500",
    borderClass: "border-blue-200",
  },
  windy: {
    icon: Wind,
    label: "Windy",
    bgClass: "bg-slate-50",
    iconClass: "text-slate-500",
    borderClass: "border-slate-200",
  },
  thunderstorm: {
    icon: CloudLightning,
    label: "Storm",
    bgClass: "bg-purple-50",
    iconClass: "text-purple-500",
    borderClass: "border-purple-200",
  },
  cloudy: {
    icon: Cloud,
    label: "Cloudy",
    bgClass: "bg-gray-50",
    iconClass: "text-gray-500",
    borderClass: "border-gray-200",
  },
};

const WeatherCalendar = ({ days }: WeatherCalendarProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            Weather Forecast
          </h2>
          <p className="text-muted-foreground mt-1">
            7-day outlook with irrigation recommendations
          </p>
        </div>
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {days.map((day, i) => {
          const config = conditionConfig[day.condition];
          const Icon = config.icon;
          const dayDate = new Date(day.date);
          dayDate.setHours(0, 0, 0, 0);
          const isToday = dayDate.getTime() === today.getTime();

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="snap-start"
            >
              <Card
                className={`min-w-[160px] w-[160px] hover-lift ${
                  isToday ? "ring-2 ring-primary" : ""
                }`}
              >
                <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                  <div className="text-sm font-medium text-foreground">
                    {dayDate.toLocaleDateString("en-US", { weekday: "short" })}
                    {isToday && (
                      <span className="ml-1.5 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        Today
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {dayDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div
                    className={`w-14 h-14 rounded-full ${config.bgClass} flex items-center justify-center`}
                  >
                    <Icon className={`w-7 h-7 ${config.iconClass}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {config.label}
                  </span>
                  {day.temperature !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {day.temperature}°C
                    </span>
                  )}
                  <div
                    className={`w-full rounded-lg px-3 py-2 text-xs font-medium ${
                      day.irrigationNeeded
                        ? "bg-secondary/15 text-secondary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Droplets className="w-3 h-3" />
                      {day.recommendation}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default WeatherCalendar;
