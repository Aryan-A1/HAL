import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Leaf, Trash2, Sprout, Calendar, Tag, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import CropTimeline from "@/components/crop-irrigation/CropTimeline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Crop } from "@/types/crop-irrigation";
import type { ProfileCrop } from "@/store/useProfileStore";

interface CropSectionProps {
  crops: Crop[];
  onAddCrop: (name: string, stage?: string, notes?: string) => void;
  onRemoveCrop: (id: string) => void;
  profileCrops?: ProfileCrop[];
}

const CropSection = ({ crops, onAddCrop, onRemoveCrop, profileCrops = [] }: CropSectionProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [stage, setStage] = useState("");
  const [notes, setNotes] = useState("");

  // Per-crop tracking state — keyed by crop ID
  const [trackedMap, setTrackedMap] = useState<Record<string, boolean>>({});

  // Returns true if tracked; defaults to true for newly added crops
  const isTracked = (id: string) => trackedMap[id] !== false;

  const toggleTracking = (id: string) => {
    setTrackedMap((prev) => ({ ...prev, [id]: !isTracked(id) }));
  };

  // Quick-fill from profile crop chip
  const prefill = (pc: ProfileCrop) => {
    setName(pc.name);
    setStage(pc.growthStage);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAddCrop(name.trim(), stage.trim() || undefined, notes.trim() || undefined);
    setName("");
    setStage("");
    setNotes("");
    setOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-[2px] bg-secondary rounded-full" />
            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Asset Management</span>
          </div>
          <h2 className="text-3xl font-heading font-black text-foreground tracking-tight">
            Your Crops
          </h2>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl premium-gradient premium-shadow h-11 px-6 border-none text-white hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" />
              Add New Crop
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl border-primary/10">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Register New Crop</DialogTitle>
              <DialogDescription className="font-medium">
                Detailed parameters allow HAL AI to provide more precise watering advice.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 pt-4">

              {/* Profile crop quick-select */}
              {profileCrops.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                    From Your Profile
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profileCrops.map((pc) => (
                      <button
                        key={pc.id}
                        type="button"
                        onClick={() => prefill(pc)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          name === pc.name
                            ? 'bg-primary text-white border-primary'
                            : 'bg-primary/5 text-primary border-primary/20 hover:bg-primary/10'
                        }`}
                      >
                        {name === pc.name && <CheckCircle2 className="w-3 h-3" />}
                        🌾 {pc.name}
                        <span className="opacity-60 font-normal">· {pc.growthStage}</span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-dashed border-muted pt-3" />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  Crop Species
                </label>
                <Input
                  placeholder="e.g. Basmati Rice, Durum Wheat"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border-primary/10 h-12 bg-muted/30 focus:bg-white transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                    Growth Stage
                  </label>
                  <Input
                    placeholder="e.g. Seedling"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="rounded-xl border-primary/10 h-12 bg-muted/30 focus:bg-white transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                    Area (Bigha/Acre)
                  </label>
                  <Input
                    placeholder="e.g. 5"
                    className="rounded-xl border-primary/10 h-12 bg-muted/30 focus:bg-white transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  Notes / Observations
                </label>
                <Input
                  placeholder="Soil color, pests, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-xl border-primary/10 h-12 bg-muted/30 focus:bg-white transition-colors"
                />
              </div>
              <Button onClick={handleSubmit} className="w-full h-12 rounded-xl premium-gradient text-white border-none font-bold text-lg mt-2" disabled={!name.trim()}>
                Deploy Trackers
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {crops.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 px-6 rounded-[2.5rem] bg-white border border-dashed border-primary/20"
        >
          <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
            <Sprout className="w-10 h-10 text-primary/40" />
          </div>
          <h3 className="text-2xl font-heading font-black text-foreground mb-2">
            Fields are Empty
          </h3>
          <p className="text-muted-foreground text-center max-w-sm mb-8 font-medium">
            {profileCrops.length > 0
              ? `You have ${profileCrops.length} crop${profileCrops.length > 1 ? 's' : ''} in your profile. Click "Add New Crop" to import them.`
              : 'Register your crops to activate the HAL AI monitoring system.'}
          </p>
          <Button onClick={() => setOpen(true)} className="gap-2 rounded-xl premium-gradient px-8 h-12">
            <Plus className="w-5 h-5" />
            Add Your First Crop
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {crops.map((crop) => (
              <motion.div
                key={crop.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                layout
              >
                <Card className="border-none shadow-none bg-white p-1 rounded-[2rem] group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                  <CardContent className="p-6 rounded-[1.75rem] border border-transparent group-hover:border-primary/10 transition-colors relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700" />
                    
                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                          <Leaf className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-heading font-black text-foreground leading-tight">
                            {crop.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Tag className="w-3 h-3 text-secondary" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              {crop.stage || "Growth Phase 1"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveCrop(crop.id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                        aria-label={`Remove ${crop.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-dashed border-muted flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary/40" />
                        <span className="text-xs font-bold text-muted-foreground">Registered {new Date(crop.createdAt).toLocaleDateString()}</span>
                      </div>

                      {/* Per-crop tracking toggle */}
                      {isTracked(crop.id) ? (
                        <button
                          onClick={() => toggleTracking(crop.id)}
                          title="Click to untrack"
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 hover:bg-red-50 group/track transition-all"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse group-hover/track:bg-red-500 transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-tighter text-primary group-hover/track:text-red-500 transition-colors">
                            TRACKED
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleTracking(crop.id)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-dashed border-primary/30 text-primary/60 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                        >
                          <span className="text-[10px] font-black uppercase tracking-tighter">Track</span>
                        </button>
                      )}
                    </div>
                    
                    {crop.notes && (
                      <div className="mt-4 p-3 rounded-xl bg-muted/30 text-[11px] font-medium text-muted-foreground leading-relaxed italic">
                        "{crop.notes}"
                      </div>
                    )}

                    {/* Per-crop independent timeline */}
                    <CropTimeline crop={crop} />

                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default CropSection;
