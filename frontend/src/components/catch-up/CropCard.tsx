import { motion } from "framer-motion";
import { Droplets, Bug, Clock, ChevronRight, Calendar, Zap } from "lucide-react";
import type { CatchUpCrop } from "@/types/catch-up";

const statusConfig = {
  healthy: {
    border: "border-l-green-400",
    badge: "bg-green-100 text-green-800",
    label: "Healthy",
    dot: "bg-green-400",
  },
  "at-risk": {
    border: "border-l-amber-400",
    badge: "bg-amber-100 text-amber-800",
    label: "At Risk",
    dot: "bg-amber-400",
  },
  "needs-attention": {
    border: "border-l-red-400",
    badge: "bg-red-100 text-red-800",
    label: "Needs Attention",
    dot: "bg-red-400",
  },
};

const waterConfig = {
  good: {
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-100",
    label: "Well Watered",
    pulse: false,
  },
  "needs-water": {
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-100",
    label: "Needs Water",
    pulse: true,
  },
  overwatered: {
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    label: "Overwatered",
    pulse: false,
  },
};

const diseaseConfig = {
  healthy: { color: "text-green-700", bg: "bg-green-50", border: "border-green-100", label: "No Disease" },
  monitor: { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-100", label: "Monitoring" },
  issue: { color: "text-red-700", bg: "bg-red-50", border: "border-red-100", label: "Disease Found" },
};

const formatTimeAgo = (date: Date): string => {
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
};

const formatTimeUntil = (date: Date): string => {
  const days = Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return "Overdue!";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
};

interface CropCardProps {
  crop: CatchUpCrop;
  onClick: (crop: CatchUpCrop) => void;
  index: number;
}

export const CropCard = ({ crop, onClick, index }: CropCardProps) => {
  const s = statusConfig[crop.status];
  const w = waterConfig[crop.waterStatus];
  const d = diseaseConfig[crop.diseaseStatus];
  const isOverdue = crop.waterStatus === "needs-water";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      onClick={() => onClick(crop)}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${s.border} cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden`}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-3xl leading-none flex-shrink-0">{crop.emoji}</span>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">{crop.name}</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{crop.growthStage}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${s.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${crop.status === 'needs-attention' ? 'animate-pulse' : ''}`} />
              {s.label}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </div>
        </div>

        {/* ── Water + Disease Row ─────────────────────── */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <div className={`${w.bg} border ${w.border} rounded-xl p-3`}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Droplets className={`w-3.5 h-3.5 ${w.color} ${w.pulse ? "animate-pulse" : ""}`} />
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Water</span>
            </div>
            <p className={`text-xs font-bold ${w.color}`}>{w.label}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Last: {formatTimeAgo(crop.lastWatered)}</p>
          </div>

          <div className={`${d.bg} border ${d.border} rounded-xl p-3`}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Bug className={`w-3.5 h-3.5 ${d.color}`} />
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Disease</span>
            </div>
            <p className={`text-xs font-bold ${d.color}`}>{d.label}</p>
            {crop.diseaseName ? (
              <p className="text-[10px] text-gray-400 mt-0.5 truncate" title={crop.diseaseName}>{crop.diseaseName}</p>
            ) : (
              <p className="text-[10px] text-gray-400 mt-0.5">Clear scan</p>
            )}
          </div>
        </div>

        {/* ── Meta strip ────────────────────────────────── */}
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
            <Calendar className="w-3 h-3" />
            Harvest {crop.harvestEstimate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
          <span className={`flex items-center gap-1 text-[11px] font-semibold ${isOverdue ? "text-red-600" : "text-gray-400"}`}>
            <Clock className="w-3 h-3" />
            Water {formatTimeUntil(crop.nextWatering)}
          </span>
        </div>
      </div>

      {/* ── Smart Suggestion strip ─────────────────────── */}
      {crop.suggestions[0] && (
        <div className="border-t border-gray-50 px-5 py-3 bg-amber-50/40">
          <div className="flex items-start gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-600 leading-relaxed font-medium">{crop.suggestions[0]}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
