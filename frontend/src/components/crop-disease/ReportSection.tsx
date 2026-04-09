import { motion } from "framer-motion";
import { Leaf, FlaskConical, Sprout, ShieldCheck, MapPin, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { AnalysisResult } from "@/types/crop-disease";

interface Props {
  result: AnalysisResult;
  imageSrc: string;
}

const ReportSection = ({ result, imageSrc }: Props) => {
  // No disease detected
  if (!result.diseaseName) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="section-padding"
      >
        <div className="container mx-auto max-w-2xl">
          <Card className="text-center py-10">
            <CardContent className="space-y-4">
              <Leaf className="w-12 h-12 text-secondary mx-auto" />
              <h3 className="text-xl font-bold font-heading text-foreground">No Disease Detected</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                No clear disease was detected. Try uploading another image with a clearer view of the affected leaf, or consult a local agricultural expert.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    );
  }

  const confidenceColor =
    result.confidence >= 80 ? "text-secondary" : result.confidence >= 50 ? "text-accent" : "text-destructive";

  const solutions = [
    { icon: FlaskConical, title: "Chemical Solution", body: result.chemical, color: "text-primary" },
    { icon: Sprout, title: "Organic Solution", body: result.organic, color: "text-secondary" },
    { icon: ShieldCheck, title: "Precautions", body: result.precautions, color: "text-accent" },
    { icon: MapPin, title: "Nearby Stores", body: result.stores, color: "text-muted-foreground" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="section-padding"
    >
      <div className="container mx-auto max-w-4xl space-y-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center font-heading text-foreground">
          Diagnosis <span className="text-secondary">Report</span>
        </h2>

        {/* Top: image + disease info */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <img src={imageSrc} alt="Analyzed crop" className="w-full h-56 object-contain bg-muted p-3" />
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <CardTitle className="text-xl">{result.diseaseName}</CardTitle>
              </div>
              <Badge variant="secondary" className="w-fit mt-1">Detected</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{result.description}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm font-medium">
                  <span>Confidence</span>
                  <span className={confidenceColor}>{result.confidence}%</span>
                </div>
                <Progress value={result.confidence} className="h-2.5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Solutions grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {solutions.map((s) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hover-lift"
            >
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                    <CardTitle className="text-base">{s.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ReportSection;
