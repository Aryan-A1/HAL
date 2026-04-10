import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CalendarDays } from "lucide-react";
import type { Crop, DayWeather } from "@/types/crop-irrigation";

// ─── Event types ───────────────────────────────────────────────────────────────

type EventType = "planted" | "irrigation" | "fertilizer" | "pesticide" | "inspection" | "harvest";

interface ScheduleEvent {
  date: Date;
  label: string;
  type: EventType;
  done: boolean;
}

const EVENT_CONFIG: Record<EventType, { emoji: string; pillClass: string; dotClass: string }> = {
  planted:    { emoji: "🌱", pillClass: "bg-green-50  text-green-700  border-green-200",  dotClass: "bg-green-500"  },
  irrigation: { emoji: "💧", pillClass: "bg-blue-50   text-blue-700   border-blue-200",   dotClass: "bg-blue-500"   },
  fertilizer: { emoji: "🧪", pillClass: "bg-yellow-50 text-yellow-700 border-yellow-200", dotClass: "bg-yellow-400" },
  pesticide:  { emoji: "🛡️", pillClass: "bg-orange-50 text-orange-700 border-orange-200", dotClass: "bg-orange-500" },
  inspection: { emoji: "🔍", pillClass: "bg-purple-50 text-purple-700 border-purple-200", dotClass: "bg-purple-500" },
  harvest:    { emoji: "🌾", pillClass: "bg-amber-50  text-amber-700  border-amber-200",  dotClass: "bg-amber-500"  },
};

// ─── Schedule generator ────────────────────────────────────────────────────────

function generateSchedule(crop: Crop, forecastDays?: DayWeather[]): ScheduleEvent[] {
  const start = new Date(crop.createdAt);
  const now   = new Date();

  const add = (d: number): Date => {
    const dt = new Date(start);
    dt.setDate(dt.getDate() + d);
    return dt;
  };

  const ev = (offset: number, label: string, type: EventType): ScheduleEvent => ({
    date: add(offset),
    label,
    type,
    done: add(offset) <= now,
  });

  const evDate = (date: Date, label: string, type: EventType): ScheduleEvent => ({
    date,
    label,
    type,
    done: date < now,
  });

  const stageDays: Record<string, number> = {
    Seedling: 90, Vegetative: 60, Flowering: 30, Harvesting: 7,
  };

  const baseEvents = [
    ev(0,  "Planted",            "planted"),
    ev(7,  "Inspection",         "inspection"),
    ev(10, "Fertilizer Applied", "fertilizer"),
    ev(18, "Pest Control",       "pesticide"),
    ev(21, "Inspection",         "inspection"),
    ev(28, "Fertilizer Top-up",  "fertilizer"),
    ev(stageDays[crop.stage || "Seedling"] ?? 90, "Expected Harvest", "harvest"),
  ];

  let irrigationEvents: ScheduleEvent[] = [];
  
  if (forecastDays && forecastDays.length > 0) {
    irrigationEvents = forecastDays
      .filter((d) => d.irrigationNeeded)
      .map((d) => evDate(new Date(d.date), `Irrigate (+${d.gross_amount_mm}mm)`, "irrigation"));
  } else {
    // Fallback static schedule if forecast isn't ready
    irrigationEvents = [
      ev(3,  "First Irrigation",   "irrigation"),
      ev(14, "Second Irrigation",  "irrigation"),
      ev(25, "Irrigation",         "irrigation"),
    ];
  }

  return [...baseEvents, ...irrigationEvents].sort((a, b) => a.date.getTime() - b.date.getTime());
}

const fmt = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

// ─── Component ─────────────────────────────────────────────────────────────────

const ALWAYS_VISIBLE = 3; // always show first 3 events

const CropTimeline = ({ crop, forecastDays }: { crop: Crop; forecastDays?: DayWeather[] }) => {
  const [showAll, setShowAll] = useState(false);
  const schedule  = generateSchedule(crop, forecastDays);
  const doneCount = schedule.filter((e) => e.done).length;
  const nextEvent = schedule.find((e) => !e.done);
  const progress  = Math.round((doneCount / schedule.length) * 100);
  const visible   = showAll ? schedule : schedule.slice(0, ALWAYS_VISIBLE);
  const remaining = schedule.length - ALWAYS_VISIBLE;

  return (
    <div className="mt-5 pt-4 border-t border-dashed border-gray-200">

      {/* ── Section header ── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-3.5 h-3.5 text-primary/60" />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            Crop Timeline
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Progress pill */}
          <div className="flex items-center gap-1.5 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full">
            <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <span className="text-[9px] font-black text-primary">{progress}%</span>
          </div>
          {nextEvent && (
            <span className="text-[10px] text-gray-400 font-medium hidden sm:block">
              Next: <span className="font-bold text-gray-600">{nextEvent.emoji} {fmt(nextEvent.date)}</span>
            </span>
          )}
        </div>
      </div>

      {/* ── Always-visible events ── */}
      <div className="space-y-1.5">
        {visible.map((ev, i) => {
          const cfg    = EVENT_CONFIG[ev.type];
          const isNext = ev === nextEvent;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs transition-all ${
                ev.done
                  ? "bg-gray-50 border-gray-100"
                  : isNext
                  ? `${cfg.pillClass} border shadow-sm ring-1 ring-primary/20`
                  : `${cfg.pillClass} border`
              }`}
            >
              {/* Connector dot */}
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  ev.done ? "bg-gray-300" : cfg.dotClass
                } ${isNext ? "animate-pulse" : ""}`}
              />

              {/* Emoji */}
              <span className="text-sm leading-none">{ev.emoji}</span>

              {/* Label */}
              <span
                className={`flex-1 font-bold leading-tight ${
                  ev.done ? "text-gray-400 line-through decoration-gray-300" : "text-gray-700"
                }`}
              >
                {ev.label}
              </span>

              {/* Date & Status Chip Container */}
              <div className="flex items-center justify-end w-[85px] gap-2">
                <span className={`tabular-nums font-medium whitespace-nowrap ${ev.done ? "text-gray-400" : "text-gray-500"}`}>
                  {fmt(ev.date)}
                </span>
                <div className="w-8 flex justify-end flex-shrink-0">
                  {ev.done ? (
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">✓</span>
                  ) : isNext ? (
                    <span className="text-[9px] font-black text-primary uppercase tracking-wider animate-pulse">Next</span>
                  ) : null}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Show more / less toggle ── */}
      {schedule.length > ALWAYS_VISIBLE && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[10px] font-black text-primary/70 hover:text-primary hover:bg-primary/5 border border-dashed border-primary/20 hover:border-primary/40 transition-all"
        >
          {showAll ? (
            <><ChevronUp className="w-3 h-3" /> Show Less</>
          ) : (
            <><ChevronDown className="w-3 h-3" /> +{remaining} more events</>
          )}
        </button>
      )}
    </div>
  );
};

export default CropTimeline;
