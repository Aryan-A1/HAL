import { motion } from "framer-motion";
import { 
  Leaf, 
  Droplets, 
  AlertCircle, 
  CheckCircle, 
  Search, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";

const DashboardPreviewSection = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleCTAClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  const crops = [
    {
      name: "Wheat",
      status: "Healthy",
      health: 92,
      statusType: "success",
      icon: <Leaf className="w-5 h-5 text-green-600" />,
      indicator: <CheckCircle className="w-4 h-4 text-green-500" />
    },
    {
      name: "Rice",
      status: "Needs Irrigation",
      health: 45,
      statusType: "warning",
      icon: <Droplets className="w-5 h-5 text-blue-600" />,
      indicator: <Droplets className="w-4 h-4 text-orange-500" />
    },
    {
      name: "Tomato",
      status: "Disease Risk",
      health: 28,
      statusType: "destructive",
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      indicator: <AlertCircle className="w-4 h-4 text-red-500" />
    }
  ];

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Smart Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="relative">
              {/* Background Decorative Element */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary/5 rounded-full blur-3xl -z-10" />

              <div className="bg-card border border-border rounded-[2rem] p-8 shadow-elevated relative overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-foreground">Your Farm at a Glance</h3>
                  <Badge variant="outline" className="text-secondary border-secondary/30 bg-secondary/5 px-3 py-1">
                    Live Updates
                  </Badge>
                </div>

                <div className="space-y-6">
                  {crops.map((crop, index) => (
                    <motion.div
                      key={crop.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="bg-muted/30 hover:bg-muted/50 transition-colors p-5 rounded-2xl border border-border/50 group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                            {crop.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground text-base">{crop.name}</h4>
                            <div className="flex items-center gap-1">
                              {crop.indicator}
                              <span className={`text-xs font-medium ${
                                crop.statusType === "success" ? "text-green-600" : 
                                crop.statusType === "warning" ? "text-orange-600" : "text-red-600"
                              }`}>
                                {crop.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-foreground">{crop.health}%</span>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Health Score</p>
                        </div>
                      </div>
                      <Progress value={crop.health} className={`h-2 ${
                        crop.statusType === "success" ? "[&>div]:bg-green-500" : 
                        crop.statusType === "warning" ? "[&>div]:bg-orange-400" : "[&>div]:bg-red-500"
                      }`} />
                    </motion.div>
                  ))}
                </div>

                {/* Shimmer effect for "simulated live data" feel */}
                <div className="mt-8 pt-6 border-t border-border flex justify-center">
                   <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                      Analyzing latest satellite imagery...
                   </div>
                </div>
              </div>

              {/* Float Card Decoration */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-6 top-1/4 bg-white p-4 rounded-2xl shadow-lg border border-border z-10 hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Irrigation</p>
                    <p className="text-xs font-bold text-foreground">Optimal levels</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side: AI Insights Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              AI Insights for <br />
              <span className="text-secondary">Smarter Farming</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              Our advanced AI technology empowers you to monitor crop health with precision, allowing you to maximize output while minimizing resource consumption.
            </p>

            <div className="grid gap-4 mb-10">
              {[
                { icon: <ShieldCheck className="w-5 h-5" />, title: "Early Disease Detection" },
                { icon: <Droplets className="w-5 h-5" />, title: "Smart Irrigation Recommendations" },
                { icon: <Zap className="w-5 h-5" />, title: "Yield Prediction" },
                { icon: <BarChart3 className="w-5 h-5" />, title: "Soil and Crop Health Analysis" }
              ].map((feature, i) => (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                    {feature.icon}
                  </div>
                  <span className="font-semibold text-foreground">{feature.title}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Button 
                onClick={handleCTAClick}
                size="lg" 
                className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 py-6 h-auto text-base font-bold shadow-lg shadow-secondary/20 group"
              >
                Start Monitoring Your Crops
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="rounded-full px-8 py-6 h-auto text-base font-bold border-secondary/30 text-secondary hover:bg-secondary/5"
              >
                <Link to={isAuthenticated ? "/crop-disease" : "/signup"}>
                  <Search className="mr-2 w-5 h-5" />
                  Scan Your Crop
                </Link>
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default DashboardPreviewSection;
