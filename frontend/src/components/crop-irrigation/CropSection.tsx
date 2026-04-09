import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Leaf, Trash2, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Crop } from "@/types/crop-irrigation";

interface CropSectionProps {
  crops: Crop[];
  onAddCrop: (name: string, stage?: string, notes?: string) => void;
  onRemoveCrop: (id: string) => void;
}

const CropSection = ({ crops, onAddCrop, onRemoveCrop }: CropSectionProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [stage, setStage] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAddCrop(name.trim(), stage.trim() || undefined, notes.trim() || undefined);
    setName("");
    setStage("");
    setNotes("");
    setOpen(false);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            Your Crops
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage crops to receive personalized irrigation insights
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Crop
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Crop</DialogTitle>
              <DialogDescription>
                Enter crop details to receive tailored irrigation advice.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Crop Name <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. Wheat, Rice, Tomato"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Growth Stage
                </label>
                <Input
                  placeholder="e.g. Seedling, Flowering"
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  maxLength={50}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Notes
                </label>
                <Input
                  placeholder="Any additional notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={200}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full" disabled={!name.trim()}>
                Save Crop
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {crops.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border-2 border-dashed border-border bg-muted/30"
        >
          <Sprout className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
            No crops added yet
          </h3>
          <p className="text-muted-foreground text-center max-w-sm mb-6">
            Add crops to receive irrigation insights tailored to your farm.
          </p>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Crop
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {crops.map((crop) => (
              <motion.div
                key={crop.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
              >
                <Card className="hover-lift group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                          <Leaf className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <h4 className="font-heading font-semibold text-foreground">
                            {crop.name}
                          </h4>
                          {crop.stage && (
                            <span className="text-xs text-muted-foreground">
                              {crop.stage}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveCrop(crop.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${crop.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {crop.notes && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                        {crop.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

export default CropSection;
