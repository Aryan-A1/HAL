import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { Sprout, RefreshCw, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { CatchUpWidget } from "@/components/CatchUpWidget";

export default function CatchUpPage() {
  const user = useAuthStore((s) => s.user);
  const profile = useProfileStore((s) => s);
  
  const firstName = user?.full_name?.split(" ")[0] || "Farmer";
  const mainCrop = profile.crops?.[0];

  return (
    <div className="min-h-screen bg-[#F0F7F0]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">
        {/* ── Page Header ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <p className="text-sm text-green-700 font-semibold mb-1">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              Good morning, {firstName}! 👋
            </h1>
            <p className="text-gray-500 mt-1 font-medium">Your personalized farming insights.</p>
          </div>
          <button
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-4 py-2 rounded-xl transition-colors self-start sm:self-auto"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </motion.div>

        {/* ── Catch Up Feature ─────────────────────────────── */}
        <section>
          {profile.crops && profile.crops.length > 0 ? (
            <CatchUpWidget />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-2">Please complete your profile to view crop insights</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                Add your crop details and location to activate personalized AI recommendations.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-[#1B5E20] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#2E7D32] transition-colors shadow-sm"
              >
                <Sprout className="w-4 h-4" /> Complete Profile
              </Link>
            </motion.div>
          )}
        </section>

        {/* Real Crop Data (No Dummy) */}
        {profile.crops && profile.crops.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-black text-gray-800 mb-5">Your Tracked Crops</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {profile.crops.map((crop) => (
                <div key={crop.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:border-green-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      🌾 {crop.name}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-2 mt-4 max-w-sm">
                    {crop.growthStage && (
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-xs text-gray-500 uppercase font-bold">Growth Stage</span>
                        <span className="text-sm font-semibold text-gray-800">{crop.growthStage}</span>
                      </div>
                    )}
                    {crop.plantingDate && (
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-xs text-gray-500 uppercase font-bold">Planting Date</span>
                        <span className="text-sm font-semibold text-gray-800">{crop.plantingDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      <Footer />
    </div>
  );
}
