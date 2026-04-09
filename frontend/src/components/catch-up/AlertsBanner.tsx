import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Flame, Clock, Droplets, Bug } from "lucide-react";
import type { CropAlert } from "@/types/catch-up";

const iconMap = {
  urgent: Flame,
  warning: AlertTriangle,
  info: Clock,
};

const styleMap = {
  urgent: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-900",
    sub: "text-red-600",
    iconBg: "bg-red-100",
    icon: "text-red-500",
    dot: "bg-red-500",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-900",
    sub: "text-amber-600",
    iconBg: "bg-amber-100",
    icon: "text-amber-500",
    dot: "bg-amber-400",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-900",
    sub: "text-blue-600",
    iconBg: "bg-blue-100",
    icon: "text-blue-500",
    dot: "bg-blue-400",
  },
};

interface AlertsBannerProps {
  alerts: CropAlert[];
}

export const AlertsBanner = ({ alerts }: AlertsBannerProps) => {
  if (alerts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-2xl px-6 py-4"
      >
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-bold text-green-800 text-base">All crops are healthy! 🌿</p>
          <p className="text-sm text-green-600/80 mt-0.5">No urgent actions required today. Keep up the great work.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Action Required</span>
        <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black">
          {alerts.length}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence>
          {alerts.map((alert, i) => {
            const s = styleMap[alert.type];
            const Icon = iconMap[alert.type];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`flex items-start gap-3 ${s.bg} border ${s.border} rounded-xl p-4`}
              >
                <div className="relative flex-shrink-0">
                  <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${s.icon}`} />
                  </div>
                  <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${s.dot} ring-2 ring-white animate-pulse`} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${s.text} leading-snug`}>{alert.message}</p>
                  {alert.sub && <p className={`text-xs ${s.sub} mt-0.5`}>{alert.sub}</p>}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
