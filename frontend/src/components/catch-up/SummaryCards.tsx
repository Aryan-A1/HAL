import { motion } from "framer-motion";
import { Sprout, CheckCircle2, AlertTriangle, ListTodo } from "lucide-react";

interface SummaryCardsProps {
  total: number;
  healthy: number;
  atRisk: number;
  tasksPending: number;
}

const cards = (props: SummaryCardsProps) => [
  {
    label: "Total Crops",
    value: props.total,
    icon: Sprout,
    bg: "bg-green-50",
    iconColor: "text-green-600",
    valueColor: "text-green-900",
    border: "border-green-100",
    ring: "ring-green-100",
  },
  {
    label: "Healthy",
    value: props.healthy,
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    valueColor: "text-emerald-900",
    border: "border-emerald-100",
    ring: "ring-emerald-100",
  },
  {
    label: "Need Attention",
    value: props.atRisk,
    icon: AlertTriangle,
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    valueColor: "text-amber-900",
    border: "border-amber-100",
    ring: "ring-amber-100",
  },
  {
    label: "Tasks Pending",
    value: props.tasksPending,
    icon: ListTodo,
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    valueColor: "text-blue-900",
    border: "border-blue-100",
    ring: "ring-blue-100",
  },
];

export const SummaryCards = (props: SummaryCardsProps) => {
  const items = cards(props);
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`bg-white rounded-2xl border ${card.border} p-5 shadow-sm hover:shadow-md transition-shadow duration-200`}
        >
          <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
          </div>
          <p className={`text-4xl font-black ${card.valueColor} leading-none`}>{card.value}</p>
          <p className="text-xs text-gray-500 font-semibold mt-2 uppercase tracking-wide">{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
};
