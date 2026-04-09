import { X, Droplets, Bug, Calendar, Clock, Zap, ChevronRight, Sprout, FlaskConical, Leaf, BadgeCheck, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CatchUpCrop, ActivityType } from "@/types/catch-up";

// ── Config ──────────────────────────────────────────────────────────────

const statusBadge = {
  healthy: "bg-green-100 text-green-800 border-green-200",
  "at-risk": "bg-amber-100 text-amber-800 border-amber-200",
  "needs-attention": "bg-red-100 text-red-800 border-red-200",
};

const statusLabel = {
  healthy: "Healthy",
  "at-risk": "At Risk",
  "needs-attention": "Needs Attention",
};

const waterLabel = {
  good: { text: "Well Watered", color: "text-blue-700", bg: "bg-blue-50 border-blue-100" },
  "needs-water": { text: "Needs Water Now", color: "text-red-700", bg: "bg-red-50 border-red-100" },
  overwatered: { text: "Overwatered", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-100" },
};

const diseaseLabel = {
  healthy: { text: "No Disease Found", color: "text-green-700", bg: "bg-green-50 border-green-100" },
  monitor: { text: "Monitoring", color: "text-amber-700", bg: "bg-amber-50 border-amber-100" },
  issue: { text: "Disease Detected", color: "text-red-700", bg: "bg-red-50 border-red-100" },
};

const activityIcon: Record<ActivityType, React.ElementType> = {
  watered: Droplets,
  scanned: Leaf,
  fertilized: FlaskConical,
  harvested: BadgeCheck,
  planted: Sprout,
};

const activityColor: Record<ActivityType, string> = {
  watered: "text-blue-600 bg-blue-50",
  scanned: "text-green-600 bg-green-50",
  fertilized: "text-purple-600 bg-purple-50",
  harvested: "text-amber-600 bg-amber-50",
  planted: "text-emerald-600 bg-emerald-50",
};

// Growth stages for timeline
const GROWTH_STAGES = ["Seedling", "Vegetative", "Flowering", "Fruiting", "Harvest"];
const STAGE_ICONS = [Sprout, Leaf, Leaf, BadgeCheck, BadgeCheck];

const getStageIndex = (stage: string): number => {
  const s = stage.toLowerCase();
  if (s.includes("seed") || s.includes("germina")) return 0;
  if (s.includes("vegetat") || s.includes("tiller") || s.includes("growth")) return 1;
  if (s.includes("flower")) return 2;
  if (s.includes("fruit") || s.includes("boll") || s.includes("tuber") || s.includes("bulking")) return 3;
  if (s.includes("harvest") || s.includes("mature")) return 4;
  return 1;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const formatTimeAgo = (date: Date): string => {
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};

const formatTimeUntil = (date: Date): string => {
  const days = Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return "Overdue!";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
};

// ── Component ─────────────────────────────────────────────────────────────

interface CropDetailsModalProps {
  crop: CatchUpCrop | null;
  onClose: () => void;
}

export const CropDetailsModal = ({ crop, onClose }: CropDetailsModalProps) => {
  if (!crop) return null;

  const currentStageIndex = getStageIndex(crop.growthStage);
  const w = waterLabel[crop.waterStatus];
  const d = diseaseLabel[crop.diseaseStatus];
  const sortedActivities = [...crop.activities].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        key="panel"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="fixed inset-x-4 top-[5vh] bottom-[5vh] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[680px] z-50 flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* ── Modal Header ─────────────────────────────── */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-[#F0F7F0] to-white flex-shrink-0">
          <span className="text-4xl">{crop.emoji}</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-gray-900 leading-tight">{crop.name}</h2>
            <p className="text-sm text-gray-500 font-medium">{crop.growthStage}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${statusBadge[crop.status]}`}>
              {statusLabel[crop.status]}
            </span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* ── Scrollable Body ───────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Growth Timeline */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Growth Timeline</h3>
            <div className="flex items-center gap-0">
              {GROWTH_STAGES.map((stage, i) => {
                const StageIcon = STAGE_ICONS[i];
                const isPast = i < currentStageIndex;
                const isCurrent = i === currentStageIndex;
                const isFuture = i > currentStageIndex;
                return (
                  <div key={stage} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCurrent
                            ? "bg-[#1B5E20] border-[#1B5E20] text-white shadow-lg shadow-green-200"
                            : isPast
                            ? "bg-green-100 border-green-300 text-green-600"
                            : "bg-gray-50 border-gray-200 text-gray-300"
                        }`}
                      >
                        <StageIcon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[9px] font-bold text-center leading-tight px-1 ${
                          isCurrent ? "text-[#1B5E20]" : isPast ? "text-green-600" : "text-gray-300"
                        }`}
                      >
                        {stage}
                      </span>
                    </div>
                    {i < GROWTH_STAGES.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mb-5 mx-1 ${isPast || isCurrent ? "bg-green-300" : "bg-gray-100"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-1">
                <Sprout className="w-3 h-3" /> Planted {formatDate(crop.plantingDate)}
              </span>
              <span className="flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" /> Harvest ~{formatDate(crop.harvestEstimate)}
              </span>
            </div>
          </div>

          {/* Water + Disease Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-2xl border p-4 ${w.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <Droplets className={`w-4 h-4 ${w.color}`} />
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">Irrigation</span>
              </div>
              <p className={`text-base font-bold ${w.color} mb-2`}>{w.text}</p>
              <div className="space-y-1.5 text-[11px] text-gray-500 font-medium">
                <div className="flex items-center justify-between">
                  <span>Last watered</span>
                  <span className="font-bold text-gray-700">{formatTimeAgo(crop.lastWatered)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Next watering</span>
                  <span className={`font-bold ${crop.waterStatus === "needs-water" ? "text-red-600" : "text-gray-700"}`}>
                    {formatTimeUntil(crop.nextWatering)}
                  </span>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl border p-4 ${d.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <Bug className={`w-4 h-4 ${d.color}`} />
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">Disease</span>
              </div>
              <p className={`text-base font-bold ${d.color} mb-2`}>{d.text}</p>
              {crop.diseaseName ? (
                <div className="space-y-1.5 text-[11px] text-gray-500 font-medium">
                  <div className="flex items-center justify-between">
                    <span>Detected</span>
                    <span className="font-bold text-gray-700 truncate ml-2">{crop.diseaseName}</span>
                  </div>
                  {crop.diseaseConfidence && (
                    <div className="flex items-center justify-between">
                      <span>Confidence</span>
                      <span className="font-bold text-gray-700">{crop.diseaseConfidence}%</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-gray-500">Last scan: Clear</p>
              )}
            </div>
          </div>

          {/* Notes */}
          {crop.notes && (
            <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Field Notes</p>
              <p className="text-sm text-gray-700 leading-relaxed">{crop.notes}</p>
            </div>
          )}

          {/* Smart Suggestions */}
          {crop.suggestions.length > 0 && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                Smart Suggestions
              </h3>
              <div className="space-y-2">
                {crop.suggestions.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-900 font-medium leading-snug">{s}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Activity History for this crop */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Activity History</h3>
            {sortedActivities.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No activity recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {sortedActivities.map((activity, i) => {
                  const AIcon = activityIcon[activity.type];
                  const aColor = activityColor[activity.type];
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl ${aColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <AIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 font-medium leading-snug">{activity.note}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(activity.date)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Date/Location meta */}
          <div className="flex items-center gap-4 text-xs text-gray-400 font-medium pt-2 border-t border-gray-50">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Updated {formatTimeAgo(crop.lastUpdated)}
            </span>
            {crop.area && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {crop.area}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
