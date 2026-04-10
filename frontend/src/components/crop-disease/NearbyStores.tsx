import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Store, Loader2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/apiService";

interface Place {
  id: string;
  name: string;
  rating?: number;
  address: string;
  lat: number;
  lng: number;
  distance_str: string;
  distance_value: number;
}

const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 }; // Delhi

export const NearbyStores = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoc, setUserLoc] = useState(DEFAULT_CENTER);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      // 1. Get user location
      let currentLoc = DEFAULT_CENTER;
      try {
        currentLoc = await new Promise((resolve) => {
          if (!navigator.geolocation) {
            resolve(DEFAULT_CENTER);
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => resolve(DEFAULT_CENTER), // fallback
            { timeout: 5000 }
          );
        });
        setUserLoc(currentLoc);
      } catch (e) {
        currentLoc = DEFAULT_CENTER;
      }

      // 2. Fetch from backend endpoint instead of Google Maps API
      try {
        const data = await apiService.get(`/api/nearby-stores?lat=${currentLoc.lat}&lng=${currentLoc.lng}`);
        setPlaces(data);
      } catch (err) {
        setError("Failed to locate nearby stores. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handlePanTo = (lat: number, lng: number) => {
    // Simulated map pan or redirect
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
  };

  return (
    <section className="section-padding py-12 mt-6 bg-gradient-to-br from-green-50 to-white border-t border-green-100">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Store className="w-3 h-3" />
            Nearby Stores
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-black text-foreground">
            Agricultural Supplies Near You
          </h2>
          <p className="text-muted-foreground mt-2">
            Find the right fertilizers and pesticides to treat your crops immediately.
          </p>
        </motion.div>

        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-auto w-full">
            {/* Simulation Header */}
            <div className="lg:col-span-2 text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-yellow-800 text-sm">
              Note: This is simulated data running from our backend API for demonstration purposes, bypassing Google Maps.
            </div>

            <div className="h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar col-span-2">
              {!loading && places.length === 0 && (
                <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100 text-gray-500">
                  No stores found within 10km of your location.
                </div>
              )}
              
              {!loading && places.map((place, idx) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-green-200 hover:shadow-md transition-all group"
                >
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-1 group-hover:text-green-700 transition-colors">
                    {place.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {place.rating && (
                      <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">
                        ⭐ {place.rating}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {place.distance_str}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-1">
                    {place.address}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handlePanTo(place.lat, place.lng)}
                    className="w-full mt-3 text-green-700 bg-green-50 hover:bg-green-100 hover:text-green-800 text-xs font-semibold h-8"
                  >
                    <Navigation className="w-3 h-3 mr-1.5" />
                    Open in Google Maps
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
