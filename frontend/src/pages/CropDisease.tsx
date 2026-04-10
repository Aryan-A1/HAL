import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DragDropUpload from "@/components/crop-disease/DragDropUpload";
import AnalyzeSection from "@/components/crop-disease/AnalyzeSection";
import ReportSection from "@/components/crop-disease/ReportSection";
import HistorySection from "@/components/crop-disease/HistorySection";
import { NearbyStores } from "@/components/crop-disease/NearbyStores";
import type { AnalysisResult, HistoryEntry } from "@/types/crop-disease";
import { diseaseApi } from "@/services/diseaseApi";
import { apiService } from "@/services/apiService";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export interface CropProfile {
  id: number;
  crop_name: string;
  crop_type: string;
}

const CropDiseasePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  
  // Mode selection
  const [mode, setMode] = useState<"quick" | "profile">("quick");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // Crop selection
  const [userCrops, setUserCrops] = useState<CropProfile[]>([]);
  const [selectedCropId, setSelectedCropId] = useState<number | null>(null);
  const [loadingCrops, setLoadingCrops] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoadingCrops(true);
      apiService.get("/api/crops")
        .then((data) => {
          setUserCrops(data);
          if (data.length > 0) {
            setSelectedCropId(data[0].id);
          }
        })
        .catch((err) => console.error("Failed to load crops", err))
        .finally(() => setLoadingCrops(false));
    }
  }, [isAuthenticated]);

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
    if (mode === "profile" && !selectedCropId) {
      setError("Please select a crop from your profile.");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      let analysisResult: AnalysisResult;
      
      if (mode === "profile" && selectedCropId) {
        analysisResult = await diseaseApi.detectDiseaseForCrop(file, selectedCropId);
      } else {
        analysisResult = await diseaseApi.detectDisease(file);
      }

      setResult(analysisResult);
      
      // Update history
      setHistory((prev) => [
        {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString(),
          imageSrc: preview!,
          diseaseName: analysisResult.diseaseName || "Healthy",
          confidence: Math.round(analysisResult.confidence),
        },
        ...prev,
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to analyze image. Please try again.");
    } finally {
      setAnalyzing(false);
    }
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

      {/* Mode Selection */}
      <section className="section-padding pb-2">
        <div className="container mx-auto max-w-2xl">
          <div className="flex p-1 bg-muted rounded-xl gap-1 w-full max-w-md mx-auto mb-6">
            <Button 
              variant={mode === "quick" ? "default" : "ghost"} 
              className={`flex-1 rounded-lg ${mode === "quick" ? "shadow-sm bg-background text-foreground" : ""}`}
              onClick={() => setMode("quick")}
            >
              Quick Scan
            </Button>
            <Button 
              variant={mode === "profile" ? "default" : "ghost"} 
              className={`flex-1 rounded-lg ${mode === "profile" ? "shadow-sm bg-background text-foreground" : ""}`}
              onClick={() => {
                if (!isAuthenticated) {
                  setError("You need to be logged in to use Crop Profiles.");
                  return;
                }
                setMode("profile");
                setError(null);
              }}
            >
              From My Crops
            </Button>
          </div>
          
          {mode === "profile" && isAuthenticated && (
            <div className="bg-card border border-border rounded-xl p-4 mb-6 shadow-sm">
              <label className="block text-sm font-medium mb-2 text-foreground">Select Crop Profile</label>
              {loadingCrops ? (
                <div className="text-sm text-muted-foreground">Loading your crops...</div>
              ) : userCrops.length > 0 ? (
                <select 
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  value={selectedCropId || ""}
                  onChange={(e) => setSelectedCropId(Number(e.target.value))}
                >
                  <option value="" disabled>Select a crop...</option>
                  {userCrops.map(c => (
                    <option key={c.id} value={c.id}>{c.crop_name.charAt(0).toUpperCase() + c.crop_name.slice(1)} ({c.crop_type})</option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  You don't have any crop profiles yet. Add them in the Irrigation/Dashboard section.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Upload + Analyze */}
      <section className="section-padding pt-0">
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
          <>
            <ReportSection result={result} imageSrc={preview!} />
            <NearbyStores />
          </>
        )}
      </AnimatePresence>

      {/* History */}
      {history.length > 0 && <HistorySection entries={history} />}

      <Footer />
    </div>
  );
};

export default CropDiseasePage;
