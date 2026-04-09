import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Info, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SchemeCard } from "@/components/SchemeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Scheme {
  id: number;
  name: string;
  description: string;
  benefit: string;
  source: string;
  crop: string;
  state: string;
}

const Schemes = () => {
  const [crop, setCrop] = useState("");
  const [state, setState] = useState("");
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchSchemes = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      console.log("Fetching schemes for:", { crop, state });
      const queryParams = new URLSearchParams();
      if (crop) queryParams.append("crop", crop);
      if (state) queryParams.append("state", state);
      
      const response = await fetch(`http://localhost:8000/schemes/?${queryParams.toString()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      console.log("API Response received. Count:", data?.length);
      console.table(data); // Helpful for the user to see in their console
      
      if (Array.isArray(data)) {
        setSchemes(data);
      } else {
        console.error("API Response is not an array:", data);
        setSchemes([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load schemes.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchSchemes();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header Section */}
      <section className="pt-28 pb-8 section-padding">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                Government Schemes
              </h1>
              <p className="text-muted-foreground">
                Find the right financial and technical support for your farm
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="section-padding py-0 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card border border-primary/10 rounded-2xl p-6 md:p-8 shadow-sm">
            <form onSubmit={fetchSchemes} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <Label htmlFor="crop">Crop Type</Label>
                <Input
                  id="crop"
                  placeholder="e.g. Wheat, Rice, All"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State / Region</Label>
                <Input
                  id="state"
                  placeholder="e.g. Punjab, All"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="bg-background"
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Get Schemes
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary/50" />
            <p>Searching for best schemes...</p>
          </div>
        ) : schemes && schemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <SchemeCard
                  name={scheme.name}
                  description={scheme.description}
                  benefit={scheme.benefit}
                  source={scheme.source}
                />
              </motion.div>
            ))}
          </div>
        ) : hasSearched ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-dashed border-primary/20">
            <Search className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-medium text-foreground mb-2">No schemes found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Try searching with different keywords or check back later for new government updates.
            </p>
          </div>
        ) : null}
      </section>

      <Footer />
    </div>
  );
};

export default Schemes;
