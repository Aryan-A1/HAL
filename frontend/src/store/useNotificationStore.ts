import { create } from 'zustand';

export type NotificationSeverity = 'critical' | 'warning' | 'info';
export type NotificationCategory = 'irrigation' | 'fertilizer' | 'pest' | 'weather' | 'general';

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  severity: NotificationSeverity;
  category: NotificationCategory;
  read: boolean;
}

// Dummy data — structured so it can later be replaced by a real API call
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: "Irrigation Alert",
    message: "Do not irrigate your field. Heavy rain expected tomorrow — let nature do the work.",
    time: "2 hours ago",
    severity: "critical",
    category: "irrigation",
    read: false,
  },
  {
    id: 2,
    title: "Fertilizer Advisory",
    message: "Avoid applying fertilizers for the next 2–3 days. Rain will wash nutrients away before absorption.",
    time: "5 hours ago",
    severity: "warning",
    category: "fertilizer",
    read: false,
  },
  {
    id: 3,
    title: "Pest Risk Warning",
    message: "High humidity levels detected. Elevated risk of aphid and fungal attack — inspect crops now.",
    time: "1 day ago",
    severity: "critical",
    category: "pest",
    read: false,
  },
  {
    id: 4,
    title: "Weather Update",
    message: "Clear skies for the next 4 days. Optimal window for spraying and field operations.",
    time: "1 day ago",
    severity: "info",
    category: "weather",
    read: true,
  },
  {
    id: 5,
    title: "Soil Moisture Info",
    message: "Soil moisture levels are adequate. No immediate irrigation required for wheat crops.",
    time: "2 days ago",
    severity: "info",
    category: "irrigation",
    read: true,
  },
];

interface NotificationState {
  notifications: Notification[];
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: INITIAL_NOTIFICATIONS,

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  clearAll: () => set({ notifications: [] }),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
