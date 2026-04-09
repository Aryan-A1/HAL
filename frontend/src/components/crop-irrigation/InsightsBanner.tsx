import { motion } from "framer-motion";
import { Lightbulb, Droplets, CloudRain, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DayWeather } from "@/types/crop-irrigation";

interface InsightsBannerProps {
  days: DayWeather[];
  cropCount: number;
}

const InsightsBanner = ({ days, cropCount }: InsightsBannerProps) => {
  const rainyDays = days.filter((d) => d.condition === "rainy" || d.condition === "thunderstorm").length;
  const irrigationDays = days.filter((d) => d.irrigationNeeded).length;
  const stormDays = days.filter((d) => d.condition === "thunderstorm").length;

  const insights = [
    {
      icon: Droplets,
      title: "Irrigation Days",
      value: `${irrigationDays} of ${days.length} days`,
      description: irrigationDays > 3
        ? "Dry spell ahead — plan your water supply"
        : "Moderate irrigation needed this week",
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      icon: CloudRain,
      title: "Rain Expected",
      value: `${rainyDays} day${rainyDays !== 1 ? "s" : ""}`,
      description: rainyDays > 0
        ? "Natural watering expected — save resources"
        : "No rain forecast — irrigation is critical",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: AlertTriangle,
      title: "Storm Alert",
      value: stormDays > 0 ? `${stormDays} day${stormDays !== 1 ? "s" : ""}` : "None",
      description: stormDays > 0
        ? "Avoid irrigation on stormy days"
        : "Clear weather — safe for field work",
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      icon: Lightbulb,
      title: "Crops Tracked",
      value: `${cropCount}`,
      description: cropCount > 0
        ? "Your crops are being monitored"
        : "Add crops for personalized insights",
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
        Weekly Insights
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover-lift h-full">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg ${insight.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${insight.color}`} />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {insight.title}
                    </span>
                  </div>
                  <p className="text-2xl font-heading font-bold text-foreground mb-1">
                    {insight.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default InsightsBanner;
