import { motion } from "framer-motion";
import { History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { HistoryEntry } from "@/types/crop-disease";

interface Props {
  entries: HistoryEntry[];
}

const HistorySection = ({ entries }: Props) => {
  return (
    <section className="section-padding bg-muted/40">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-2 mb-6">
          <History className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-bold font-heading text-foreground">Recent Analyses</h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {entries.slice(0, 6).map((e) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hover-lift"
            >
              <Card className="overflow-hidden">
                <img src={e.imageSrc} alt={e.diseaseName} className="w-full h-32 object-cover bg-muted" />
                <CardContent className="p-3 space-y-1">
                  <p className="font-semibold text-sm text-foreground">{e.diseaseName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{e.date}</span>
                    <Badge variant="outline" className="text-xs">{e.confidence}%</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
