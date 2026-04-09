import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertsBanner } from "@/components/catch-up/AlertsBanner";
import { SummaryCards } from "@/components/catch-up/SummaryCards";
import { CropCard } from "@/components/catch-up/CropCard";
import { CropDetailsModal } from "@/components/catch-up/CropDetailsModal";
import { ActivityHistory } from "@/components/catch-up/ActivityHistory";
import { useAuthStore } from "@/store/useAuthStore";
import type { CatchUpCrop, CropAlert, CropActivity } from "@/types/catch-up";
import { Sprout, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

// ── Mock Data (replace with API calls in production) ────────────────────────

const today = new Date();
const daysAgo = (n: number) => new Date(today.getTime() - n * 86400000);
const daysFrom = (n: number) => new Date(today.getTime() + n * 86400000);

const mockCrops: CatchUpCrop[] = [
  {
    id: "1",
    name: "Wheat",
    emoji: "🌾",
    status: "healthy",
    growthStage: "Tillering",
    plantingDate: new Date("2026-01-15"),
    harvestEstimate: new Date("2026-05-20"),
    lastUpdated: daysAgo(1),
    lastWatered: daysAgo(1),
    nextWatering: daysFrom(1),
    waterStatus: "good",
    diseaseStatus: "healthy",
    area: "3 Bigha, Field A",
    notes: "Growing well. Good yield expected this season.",
    suggestions: [
      "Schedule watering for tomorrow morning",
      "Apply nitrogen fertilizer in 3 days for better tillering",
      "Next disease scan recommended in 1 week",
    ],
    activities: [
      { id: "a1", cropId: "1", cropName: "Wheat", date: daysAgo(1), type: "watered", note: "Drip irrigation — 45 min session" },
      { id: "a2", cropId: "1", cropName: "Wheat", date: daysAgo(3), type: "scanned", note: "Disease scan — Healthy (96% confidence)" },
      { id: "a3", cropId: "1", cropName: "Wheat", date: daysAgo(7), type: "fertilized", note: "Urea application — 25 kg/bigha" },
      { id: "a4", cropId: "1", cropName: "Wheat", date: new Date("2026-01-15"), type: "planted", note: "Initial sowing completed" },
    ],
  },
  {
    id: "2",
    name: "Tomato",
    emoji: "🍅",
    status: "at-risk",
    growthStage: "Flowering",
    plantingDate: new Date("2026-02-01"),
    harvestEstimate: daysFrom(21),
    lastUpdated: daysAgo(2),
    lastWatered: daysAgo(3),
    nextWatering: today,
    waterStatus: "needs-water",
    diseaseStatus: "monitor",
    diseaseName: "Early Blight (suspected)",
    diseaseConfidence: 62,
    area: "1.5 Bigha, Field B",
    notes: "Some yellowing on lower leaves. Monitor closely for spread.",
    suggestions: [
      "Water immediately — 3 days without irrigation",
      "Inspect lower leaves for early blight spread",
      "Consider neem oil spray as organic precaution",
    ],
    activities: [
      { id: "b1", cropId: "2", cropName: "Tomato", date: daysAgo(2), type: "scanned", note: "Disease scan — Early Blight suspected (62%)" },
      { id: "b2", cropId: "2", cropName: "Tomato", date: daysAgo(3), type: "watered", note: "Overhead irrigation — 30 min" },
      { id: "b3", cropId: "2", cropName: "Tomato", date: daysAgo(9), type: "fertilized", note: "DAP fertilizer applied" },
      { id: "b4", cropId: "2", cropName: "Tomato", date: new Date("2026-02-01"), type: "planted", note: "Seedlings transplanted" },
    ],
  },
  {
    id: "3",
    name: "Cotton",
    emoji: "🌿",
    status: "needs-attention",
    growthStage: "Boll Formation",
    plantingDate: new Date("2025-12-10"),
    harvestEstimate: daysFrom(20),
    lastUpdated: daysAgo(2),
    lastWatered: daysAgo(5),
    nextWatering: daysAgo(1),
    waterStatus: "needs-water",
    diseaseStatus: "issue",
    diseaseName: "Leaf Blight",
    diseaseConfidence: 87,
    area: "5 Bigha, Field C",
    notes: "Active disease detected. Immediate action required before harvest.",
    suggestions: [
      "⚠️ Apply Mancozeb 75% WP spray immediately",
      "Water urgently — 5 days without irrigation",
      "Harvest preparation begins in ~20 days",
    ],
    activities: [
      { id: "c1", cropId: "3", cropName: "Cotton", date: daysAgo(2), type: "scanned", note: "Disease scan — Leaf Blight detected (87% confidence)" },
      { id: "c2", cropId: "3", cropName: "Cotton", date: daysAgo(5), type: "watered", note: "Flood irrigation" },
      { id: "c3", cropId: "3", cropName: "Cotton", date: daysAgo(8), type: "fertilized", note: "Potash fertilizer — K boost" },
      { id: "c4", cropId: "3", cropName: "Cotton", date: new Date("2025-12-10"), type: "planted", note: "Seeds sown" },
    ],
  },
  {
    id: "4",
    name: "Rice",
    emoji: "🌾",
    status: "healthy",
    growthStage: "Vegetative",
    plantingDate: new Date("2026-03-01"),
    harvestEstimate: new Date("2026-07-15"),
    lastUpdated: today,
    lastWatered: today,
    nextWatering: daysFrom(3),
    waterStatus: "good",
    diseaseStatus: "healthy",
    area: "4 Bigha, Field D",
    notes: "Early stage. Water logging maintained at 5–7 cm as recommended.",
    suggestions: [
      "Maintain water level at 5–7 cm depth",
      "Apply nitrogen fertilizer next week",
      "Next scan recommended in 2 weeks",
    ],
    activities: [
      { id: "d1", cropId: "4", cropName: "Rice", date: today, type: "watered", note: "Water level maintained — flood method" },
      { id: "d2", cropId: "4", cropName: "Rice", date: daysAgo(5), type: "scanned", note: "Disease scan — Healthy (91% confidence)" },
      { id: "d3", cropId: "4", cropName: "Rice", date: new Date("2026-03-01"), type: "planted", note: "Paddy seedlings transplanted" },
    ],
  },
  {
    id: "5",
    name: "Potato",
    emoji: "🥔",
    status: "at-risk",
    growthStage: "Tuber Bulking",
    plantingDate: new Date("2026-01-20"),
    harvestEstimate: daysFrom(15),
    lastUpdated: daysAgo(3),
    lastWatered: daysAgo(3),
    nextWatering: today,
    waterStatus: "needs-water",
    diseaseStatus: "monitor",
    diseaseName: "Possible Late Blight",
    diseaseConfidence: 55,
    area: "2 Bigha, Field E",
    notes: "Harvest approaching in 2 weeks. Watch for late blight symptoms.",
    suggestions: [
      "Water today — scheduled irrigation overdue",
      "Harvest readiness check in 10 days",
      "Apply copper oxychloride as precaution",
    ],
    activities: [
      { id: "e1", cropId: "5", cropName: "Potato", date: daysAgo(3), type: "watered", note: "Drip irrigation — 20 min" },
      { id: "e2", cropId: "5", cropName: "Potato", date: daysAgo(4), type: "scanned", note: "Disease scan — Monitoring advised (55%)" },
      { id: "e3", cropId: "5", cropName: "Potato", date: daysAgo(15), type: "fertilized", note: "Potassium application" },
      { id: "e4", cropId: "5", cropName: "Potato", date: new Date("2026-01-20"), type: "planted", note: "Seed potatoes planted" },
    ],
  },
];

// ── Filter tabs ─────────────────────────────────────────────────────────────

type FilterType = "all" | "healthy" | "at-risk" | "needs-attention";

const FILTERS: { key: FilterType; label: string; dot?: string }[] = [
  { key: "all", label: "All Crops" },
  { key: "healthy", label: "Healthy", dot: "bg-green-400" },
  { key: "at-risk", label: "At Risk", dot: "bg-amber-400" },
  { key: "needs-attention", label: "Needs Attention", dot: "bg-red-400" },
];

// ── Page Component ───────────────────────────────────────────────────────────

export default function CatchUpPage() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.full_name?.split(" ")[0] || "Farmer";

  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedCrop, setSelectedCrop] = useState<CatchUpCrop | null>(null);

  // Compute alerts from crop data
  const alerts = useMemo<CropAlert[]>(() => {
    const result: CropAlert[] = [];
    let waterCount = 0;
    let diseaseIssueCount = 0;
    let diseaseMonitorCount = 0;
    let harvestSoonCount = 0;

    mockCrops.forEach((crop) => {
      if (crop.waterStatus === "needs-water") waterCount++;
      if (crop.diseaseStatus === "issue") diseaseIssueCount++;
      if (crop.diseaseStatus === "monitor") diseaseMonitorCount++;
      const daysToHarvest = Math.floor((crop.harvestEstimate.getTime() - Date.now()) / 86400000);
      if (daysToHarvest > 0 && daysToHarvest <= 25) harvestSoonCount++;
    });

    if (waterCount > 0) {
      result.push({
        id: "water-alert",
        type: "urgent",
        message: `${waterCount} crop${waterCount > 1 ? "s" : ""} need watering today`,
        sub: "Check tomato and potato fields immediately",
      });
    }
    if (diseaseIssueCount > 0) {
      result.push({
        id: "disease-alert",
        type: "urgent",
        message: `${diseaseIssueCount} crop${diseaseIssueCount > 1 ? "s" : ""} with active disease detected`,
        sub: "Cotton: Leaf Blight at 87% confidence — spray required",
      });
    }
    if (diseaseMonitorCount > 0) {
      result.push({
        id: "monitor-alert",
        type: "warning",
        message: `${diseaseMonitorCount} crop${diseaseMonitorCount > 1 ? "s" : ""} under disease monitoring`,
        sub: "Tomato and Potato show early signs — watch closely",
      });
    }
    if (harvestSoonCount > 0) {
      result.push({
        id: "harvest-alert",
        type: "info",
        message: `${harvestSoonCount} crop${harvestSoonCount > 1 ? "s" : ""} approaching harvest`,
        sub: "Cotton (20 days) and Potato (15 days) — prepare equipment",
      });
    }
    return result;
  }, []);

  // Summary stats
  const stats = useMemo(() => ({
    total: mockCrops.length,
    healthy: mockCrops.filter((c) => c.status === "healthy").length,
    atRisk: mockCrops.filter((c) => c.status !== "healthy").length,
    tasksPending: alerts.filter((a) => a.type === "urgent").length,
  }), [alerts]);

  // Filtered + sorted crops (needs-attention first)
  const visibleCrops = useMemo(() => {
    const statusOrder = { "needs-attention": 0, "at-risk": 1, healthy: 2 };
    return mockCrops
      .filter((c) => filter === "all" || c.status === filter)
      .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  }, [filter]);

  // All activities across all crops
  const allActivities = useMemo<CropActivity[]>(() =>
    mockCrops.flatMap((c) => c.activities), []);

  return (
    <div className="min-h-screen bg-[#F0F7F0]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">

        {/* ── Page Header ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <p className="text-sm text-green-700 font-semibold mb-1">
              {today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              Good morning, {firstName}! 👋
            </h1>
            <p className="text-gray-500 mt-1 font-medium">Here's your full farm overview for today.</p>
          </div>
          <button
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-4 py-2 rounded-xl transition-colors self-start sm:self-auto"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </motion.div>

        {/* ── Alerts ──────────────────────────────────────── */}
        <AlertsBanner alerts={alerts} />

        {/* ── Summary Stats ───────────────────────────────── */}
        <SummaryCards {...stats} />

        {/* ── Crop Gallery ────────────────────────────────── */}
        <div>
          {/* Filter Tabs */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2 className="text-xl font-black text-gray-800">Your Crops</h2>
            <div className="flex items-center gap-2 flex-wrap">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    filter === f.key
                      ? "bg-[#1B5E20] text-white border-[#1B5E20] shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {f.dot && <span className={`w-1.5 h-1.5 rounded-full ${f.dot}`} />}
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {visibleCrops.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-center"
            >
              <Sprout className="w-12 h-12 text-gray-200 mb-4" />
              <h3 className="text-lg font-bold text-gray-500">No crops in this category</h3>
              <p className="text-sm text-gray-400 mt-1 mb-6">Add crops from the Irrigation page to track them here.</p>
              <Link
                to="/crop-irrigation"
                className="inline-flex items-center gap-2 bg-[#1B5E20] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#2E7D32] transition-colors"
              >
                <Sprout className="w-4 h-4" /> Add a Crop
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {visibleCrops.map((crop, i) => (
                <CropCard key={crop.id} crop={crop} onClick={setSelectedCrop} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* ── Activity History ─────────────────────────────── */}
        <div>
          <h2 className="text-xl font-black text-gray-800 mb-4">Farm Activity Log</h2>
          <ActivityHistory activities={allActivities} />
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 py-2">
          HAL AI — Intelligent Agriculture Platform &nbsp;•&nbsp; Data updates every 24 hours
        </p>
      </div>

      <Footer />

      {/* ── Crop Details Modal ───────────────────────────── */}
      <CropDetailsModal crop={selectedCrop} onClose={() => setSelectedCrop(null)} />
    </div>
  );
}
