import { motion } from "framer-motion";
import { Lightbulb, Droplets, CloudRain, AlertTriangle, Sparkles, BrainCircuit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DayWeather, AIInsights } from "@/types/crop-irrigation";
import { Skeleton } from "@/components/ui/skeleton";

interface InsightsBannerProps {
  days: DayWeather[];
  cropCount: number;
  aiInsights?: AIInsights;
  loading?: boolean;
}

const InsightsBanner = ({ days, cropCount, aiInsights, loading }: InsightsBannerProps) => {
  const rainyDays = aiInsights?.rain_expected ?? days.filter((d) => d.condition === "rainy" || d.condition === "thunderstorm").length;
  const irrigationDays = aiInsights?.irrigation_days ?? days.filter((d) => d.irrigationNeeded).length;
  const stormDays = aiInsights?.storm_alerted ?? days.filter((d) => d.condition === "thunderstorm").length;

  const insights = [
    {
      icon: Droplets,
      title: "Irrigation Needed",
      value: loading ? "..." : `${irrigationDays} Day${irrigationDays !== 1 ? "s" : ""}`,
      description: "Based on soil moisture & heat",
      color: "text-blue-600",
      bg: "bg-blue-50/50",
    },
    {
      icon: CloudRain,
      title: "Rain Expected",
      value: loading ? "..." : `${rainyDays} Day${rainyDays !== 1 ? "s" : ""}`,
      description: "Natural watering potential",
      color: "text-indigo-600",
      bg: "bg-indigo-50/50",
    },
    {
      icon: AlertTriangle,
      title: "Storm Alerts",
      value: loading ? "..." : stormDays > 0 ? `${stormDays} Alert${stormDays !== 1 ? "s" : ""}` : "None",
      description: stormDays > 0 ? "High wind speeds detected" : "Safe conditions expected",
      color: "text-amber-600",
      bg: "bg-amber-50/50",
    },
    {
      icon: Lightbulb,
      title: "Crops Tracked",
      value: `${cropCount}`,
      description: "Active health monitoring",
      color: "text-emerald-600",
      bg: "bg-emerald-50/50",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-heading font-black text-foreground">
            Weekly AI Insights
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-none bg-white p-1 rounded-2xl group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <CardContent className="p-4 rounded-[1.25rem] border border-transparent group-hover:border-primary/10 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${insight.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <Icon className={`w-5 h-5 ${insight.color}`} />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {insight.title}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-heading font-black text-foreground tracking-tight">
                      {insight.value}
                    </p>
                    <p className="text-[11px] leading-tight text-muted-foreground/80 font-medium font-body">
                      {insight.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* AI Summary Marquee */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden premium-gradient p-[1px] rounded-2xl premium-shadow"
      >
        <div className="bg-white/95 backdrop-blur-sm px-6 py-5 rounded-[0.95rem] flex flex-col sm:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-xs font-black text-primary uppercase tracking-widest">HAL AI VERDICT</span>
              <div className="h-1 w-1 rounded-full bg-primary/30" />
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Live Analysis</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-primary/30" />
              <span className="text-[10px] text-muted-foreground font-bold uppercase">Next 7 Days</span>
            </div>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-2/3 bg-muted" />
              </div>
            ) : (
              <p className="text-foreground font-semibold leading-snug">
                {aiInsights?.summary || "Analyzing weather patterns and crop requirements for a tailored irrigation strategy..."}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default InsightsBanner;
