import { motion } from "framer-motion";
import {
  Droplets,
  Leaf,
  Sprout,
  FlaskConical,
  BadgeCheck,
  Clock,
} from "lucide-react";
import type { CropActivity, ActivityType } from "@/types/catch-up";

const activityConfig: Record<
  ActivityType,
  { icon: React.ElementType; color: string; bg: string; border: string; label: string }
> = {
  watered: {
    icon: Droplets,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    label: "Watered",
  },
  scanned: {
    icon: Leaf,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
    label: "Disease Scan",
  },
  fertilized: {
    icon: FlaskConical,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    label: "Fertilized",
  },
  harvested: {
    icon: BadgeCheck,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    label: "Harvested",
  },
  planted: {
    icon: Sprout,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    label: "Planted",
  },
};

const formatDate = (date: Date): string =>
  date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const formatTimeAgo = (date: Date): string => {
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${days >= 14 ? "s" : ""} ago`;
  return formatDate(date);
};

interface ActivityHistoryProps {
  activities: CropActivity[];
}

export const ActivityHistory = ({ activities }: ActivityHistoryProps) => {
  const sorted = [...activities].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 15);

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
        <Clock className="w-10 h-10 text-gray-200 mb-3" />
        <p className="text-gray-400 font-medium">No activity recorded yet</p>
        <p className="text-gray-300 text-sm mt-1">Actions will appear here after you water, scan, or fertilize</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <h3 className="font-bold text-gray-800">Recent Activity</h3>
          <span className="ml-auto text-xs text-gray-400 font-medium">Last {sorted.length} actions</span>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {sorted.map((activity, i) => {
          const cfg = activityConfig[activity.type];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors"
            >
              {/* Timeline dot + line */}
              <div className="relative flex flex-col items-center flex-shrink-0">
                <div className={`w-9 h-9 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                {i < sorted.length - 1 && (
                  <div className="w-px flex-1 bg-gray-100 mt-1 min-h-[12px]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-black uppercase tracking-wide ${cfg.color}`}>{cfg.label}</span>
                      <span className="text-xs text-gray-400 font-medium">· {activity.cropName}</span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium mt-0.5 leading-snug">{activity.note}</p>
                  </div>
                  <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">
                    {formatTimeAgo(activity.date)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
