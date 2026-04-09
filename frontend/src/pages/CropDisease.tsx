import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DragDropUpload from "@/components/crop-disease/DragDropUpload";
import AnalyzeSection from "@/components/crop-disease/AnalyzeSection";
import ReportSection from "@/components/crop-disease/ReportSection";
import HistorySection from "@/components/crop-disease/HistorySection";
import type { AnalysisResult, HistoryEntry } from "@/types/crop-disease";

const CropDiseasePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const handleFile = useCallback((f: File) => {
    const valid = ["image/jpeg", "image/png", "image/webp"];
    if (!valid.includes(f.type)) {
      setError("Unsupported format. Please upload JPG, PNG, or WEBP.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File too large. Maximum size is 10MB.");
      return;
    }
    setError(null);
    setResult(null);
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError(null);
    setResult(null);

    // Simulated AI analysis
    await new Promise((r) => setTimeout(r, 2500));

    const mockResults: AnalysisResult[] = [
      {
        diseaseName: "Leaf Blight",
        confidence: 87,
        description: "A fungal infection causing brown spots and leaf withering, commonly seen in humid conditions.",
        chemical: "Apply Mancozeb 75% WP at 2.5g/L or Copper Oxychloride spray at recommended dosage every 10–14 days.",
        organic: "Spray neem oil solution (5ml/L) or prepare a garlic-chili extract. Apply Trichoderma-based bio-fungicide to soil.",
        precautions: "Remove and destroy infected leaves. Ensure proper plant spacing for air circulation. Avoid overhead watering. Rotate crops each season.",
        stores: "Search for agricultural supply stores near your location for Mancozeb, neem oil, and bio-fungicides.",
      },
      {
        diseaseName: "Powdery Mildew",
        confidence: 92,
        description: "White powdery coating on leaves caused by fungal spores, reduces photosynthesis and crop yield.",
        chemical: "Apply Sulfur-based fungicide (Wettable Sulfur) at 3g/L or Propiconazole 25% EC at 1ml/L water.",
        organic: "Mix 1 tbsp baking soda + 1 tsp liquid soap in 4L water. Apply milk spray (40% milk, 60% water) weekly.",
        precautions: "Plant resistant varieties when possible. Ensure adequate sunlight. Prune overcrowded foliage. Water at the base, not overhead.",
        stores: "Look for Wettable Sulfur and Propiconazole at your nearest Krishi Kendra or agricultural cooperative.",
      },
      {
        diseaseName: "Bacterial Wilt",
        confidence: 78,
        description: "Causes sudden wilting without yellowing, often affecting tomato, potato, and eggplant crops.",
        chemical: "Drench soil with Streptocycline (1g/10L water) or Copper Hydroxide. No direct cure once fully established.",
        organic: "Apply Pseudomonas fluorescens as soil drench. Incorporate mustard cake into soil. Use bio-compost for soil health.",
        precautions: "Practice crop rotation with non-host plants. Sterilize tools between plants. Improve soil drainage. Remove affected plants immediately.",
        stores: "Visit local agri-input shops for Streptocycline, Pseudomonas bio-agents, and copper-based products.",
      },
    ];

    const rand = Math.random();
    if (rand < 0.1) {
      setError("Analysis failed. Please try again or upload a clearer image.");
      setAnalyzing(false);
      return;
    }

    if (rand < 0.2) {
      setResult({
        diseaseName: "",
        confidence: 0,
        description: "",
        chemical: "",
        organic: "",
        precautions: "",
        stores: "",
      });
      setAnalyzing(false);
      return;
    }

    const chosen = mockResults[Math.floor(Math.random() * mockResults.length)];
    setResult(chosen);
    setHistory((prev) => [
      {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        imageSrc: preview!,
        diseaseName: chosen.diseaseName,
        confidence: chosen.confidence,
      },
      ...prev,
    ]);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Navbar />

      {/* Hero banner */}
      <section className="pt-28 pb-8 section-padding bg-gradient-to-br from-muted via-background to-muted">
        <div className="container mx-auto text-center max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground font-heading"
          >
            Crop Disease <span className="text-secondary">Detection</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-muted-foreground text-base md:text-lg"
          >
            Upload a clear leaf image and let our AI diagnose diseases instantly with actionable solutions.
          </motion.p>
        </div>
      </section>

      {/* Upload + Analyze */}
      <section className="section-padding">
        <div className="container mx-auto max-w-2xl space-y-6">
          <DragDropUpload
            preview={preview}
            onFile={handleFile}
            onClear={clearFile}
            error={error}
          />
          <AnalyzeSection
            hasFile={!!file}
            analyzing={analyzing}
            onAnalyze={handleAnalyze}
          />
        </div>
      </section>

      {/* Report */}
      <AnimatePresence>
        {result && (
          <ReportSection result={result} imageSrc={preview!} />
        )}
      </AnimatePresence>

      {/* History */}
      {history.length > 0 && <HistorySection entries={history} />}

      <Footer />
    </div>
  );
};

export default CropDiseasePage;
