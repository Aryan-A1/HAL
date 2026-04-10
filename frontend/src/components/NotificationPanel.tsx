import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Droplets,
  Leaf,
  Bug,
  CloudRain,
  Info,
  CheckCheck,
  Trash2,
  X,
} from "lucide-react";
import { useNotificationStore, Notification, NotificationCategory, NotificationSeverity } from "@/store/useNotificationStore";

// --- Icon & Color helpers (pure functions — easy to extend) ---
const getCategoryIcon = (category: NotificationCategory) => {
  switch (category) {
    case "irrigation": return Droplets;
    case "fertilizer": return Leaf;
    case "pest":       return Bug;
    case "weather":    return CloudRain;
    default:           return Info;
  }
};

const getSeverityStyles = (severity: NotificationSeverity) => {
  switch (severity) {
    case "critical":
      return {
        badge: "bg-red-100 text-red-700 border-red-200",
        icon:  "bg-red-100 text-red-600",
        dot:   "bg-red-500",
        border: "border-l-red-500",
      };
    case "warning":
      return {
        badge: "bg-amber-100 text-amber-700 border-amber-200",
        icon:  "bg-amber-100 text-amber-600",
        dot:   "bg-amber-400",
        border: "border-l-amber-400",
      };
    default:
      return {
        badge: "bg-blue-100 text-blue-700 border-blue-200",
        icon:  "bg-blue-100 text-blue-600",
        dot:   "bg-blue-400",
        border: "border-l-blue-400",
      };
  }
};

// --- Single notification card ---
interface NotificationCardProps {
  notification: Notification;
  onRead: (id: number) => void;
}

const NotificationCard = ({ notification, onRead }: NotificationCardProps) => {
  const Icon = getCategoryIcon(notification.category);
  const styles = getSeverityStyles(notification.severity);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      onClick={() => onRead(notification.id)}
      className={`
        relative flex gap-3 p-3 rounded-xl border-l-4 cursor-pointer
        transition-all duration-200 group
        ${styles.border}
        ${notification.read
          ? "bg-gray-50/70 opacity-70"
          : "bg-white hover:bg-gray-50 shadow-sm"}
      `}
    >
      {/* Icon */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className={`text-xs font-bold truncate ${notification.read ? "text-gray-500" : "text-gray-800"}`}>
            {notification.title}
          </p>
          <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border flex-shrink-0 ${styles.badge}`}>
            {notification.severity}
          </span>
        </div>
        <p className={`text-xs leading-snug ${notification.read ? "text-gray-400" : "text-gray-600"}`}>
          {notification.message}
        </p>
        <p className="text-[10px] text-gray-400 mt-1 font-medium">{notification.time}</p>
      </div>

      {/* Unread dot */}
      {!notification.read && (
        <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${styles.dot}`} />
      )}
    </motion.div>
  );
};


import { useTranslation } from "@/hooks/useTranslation";

// --- Main panel ---
interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const { notifications, markAsRead, markAllAsRead, clearAll, unreadCount } = useNotificationStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const count = unreadCount();
  const { t } = useTranslation();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-black text-gray-800">{t.notifications.title}</h3>
              {count > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {count} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {count > 0 && (
                <button
                  onClick={markAllAsRead}
                  title="Mark all as read"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  title="Clear all"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div className="max-h-[420px] overflow-y-auto p-2 space-y-1.5">
            <AnimatePresence>
              {notifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 flex flex-col items-center gap-3 text-gray-400"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-gray-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-500">All clear! 🌱</p>
                    <p className="text-xs text-gray-400 mt-0.5">No active alerts for your farm.</p>
                  </div>
                </motion.div>
              ) : (
                notifications.map((n) => (
                  <NotificationCard key={n.id} notification={n} onRead={markAsRead} />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
              <p className="text-[10px] text-gray-400 text-center font-medium">
                Click a notification to mark it as read · Powered by HAL AI
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
