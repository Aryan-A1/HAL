import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  hasFile: boolean;
  analyzing: boolean;
  onAnalyze: () => void;
}

const AnalyzeSection = ({ hasFile, analyzing, onAnalyze }: Props) => {
  return (
    <div className="flex justify-center">
      <motion.div whileHover={{ scale: hasFile && !analyzing ? 1.03 : 1 }} whileTap={{ scale: 0.97 }}>
        <Button
          size="lg"
          disabled={!hasFile || analyzing}
          onClick={onAnalyze}
          className="rounded-full px-10 py-6 text-base font-heading font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow gap-3"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Diagnose Crop
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default AnalyzeSection;
