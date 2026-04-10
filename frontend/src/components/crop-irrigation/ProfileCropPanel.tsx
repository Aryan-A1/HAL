import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Leaf, FlaskConical, Calendar, Sprout,
  ArrowRight, UserCheck, PlusCircle, Sparkles,
} from "lucide-react";
import type { ProfileCrop } from "@/store/useProfileStore";

// ─── Soil label map ───────────────────────────────────────────────────────────
const SOIL_LABELS: Record<string, string> = {
  alluvial:   'Alluvial Soil',
  black:      'Black Soil',
  red_yellow: 'Red & Yellow Soil',
  laterite:   'Laterite Soil',
  desert:     'Desert Soil',
  peaty:      'Peaty & Marshy Soil',
  forest:     'Forest & Mountain Soil',
};

// ─── Stage colour ─────────────────────────────────────────────────────────────
const stageColor: Record<string, string> = {
  Seedling:   'bg-green-100 text-green-700',
  Vegetative: 'bg-blue-100 text-blue-700',
  Flowering:  'bg-purple-100 text-purple-700',
  Harvesting: 'bg-amber-100 text-amber-700',
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface ProfileCropPanelProps {
  profileCrops: ProfileCrop[];
  soilType: string;
  savedAt: string | null;
}

// ─── Compact crop chip ────────────────────────────────────────────────────────
const CropChip = ({ crop, delay }: { crop: ProfileCrop; delay: number }) => {
  const stageClass = stageColor[crop.growthStage] || 'bg-gray-100 text-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 bg-white rounded-2xl border border-primary/10 px-4 py-3 shadow-sm group hover:shadow-md hover:border-primary/30 transition-all duration-200"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
        <Leaf className="w-5 h-5 text-primary" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-gray-900 truncate">{crop.name}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stageClass}`}>
            {crop.growthStage}
          </span>
          {crop.plantingDate && (
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" />
              Planted {new Date(crop.plantingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      </div>

      {/* "Active" badge */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-100">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">Tracked</span>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main panel ───────────────────────────────────────────────────────────────
const ProfileCropPanel = ({ profileCrops, soilType, savedAt }: ProfileCropPanelProps) => {
  const hasCrops = profileCrops.length > 0;
  const hasSoil  = !!soilType;

  // ── No profile at all ──────────────────────────────────────────────────────
  if (!hasCrops && !hasSoil) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Sprout className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-black text-amber-800">No crop profile found</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Add your crops & soil type in your Profile for personalised irrigation recommendations
            </p>
          </div>
        </div>
        <Link
          to="/dashboard"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Set Up Profile
        </Link>
      </motion.div>
    );
  }

  // ── Has profile data ───────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Header strip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
            <UserCheck className="w-3.5 h-3.5" />
            <span className="text-xs font-black">Using your saved profile data</span>
          </div>
          {savedAt && (
            <span className="text-[10px] text-gray-400 font-medium hidden sm:block">
              Last updated {new Date(savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/70 transition-colors"
        >
          Edit Profile <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Soil type pill (if set) */}
      {hasSoil && (
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 bg-white border border-primary/10 rounded-xl px-4 py-2 shadow-sm"
        >
          <FlaskConical className="w-4 h-4 text-primary/60" />
          <span className="text-xs text-gray-500 font-medium">Soil Type:</span>
          <span className="text-xs font-black text-gray-800">{SOIL_LABELS[soilType] || soilType}</span>
          <div className="flex items-center gap-1 ml-1 px-2 py-0.5 rounded-md bg-primary/5 border border-primary/10">
            <Sparkles className="w-2.5 h-2.5 text-primary" />
            <span className="text-[9px] font-black text-primary uppercase tracking-wide">Auto-Applied</span>
          </div>
        </motion.div>
      )}

      {/* Crop cards */}
      {hasCrops && (
        <div className={`grid gap-3 ${profileCrops.length === 1 ? 'grid-cols-1 max-w-sm' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          <AnimatePresence>
            {profileCrops.map((crop, i) => (
              <CropChip key={crop.id} crop={crop} delay={i * 0.06} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* No crops but has soil */}
      {!hasCrops && hasSoil && (
        <div className="flex items-center gap-3 bg-white/60 border border-dashed border-primary/20 rounded-2xl px-4 py-3">
          <Leaf className="w-4 h-4 text-primary/40" />
          <p className="text-xs text-gray-500">
            No crops in profile yet.{' '}
            <Link to="/dashboard" className="text-primary font-bold hover:underline">
              Add crops to your profile
            </Link>{' '}
            for smarter irrigation scheduling.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileCropPanel;
