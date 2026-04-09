import { motion } from "framer-motion";
import heroImg from "@/assets/hero-illustration.png";

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center pt-24 section-padding bg-gradient-to-br from-muted via-background to-muted">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-tight tracking-tight text-foreground">
              Precision Agriculture,{" "}
              <span className="text-secondary">Powered by Intelligence</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
              HAL uses cutting-edge AI to detect crop diseases early, optimize irrigation schedules, and boost your farm's productivity — all from a single dashboard.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 bg-secondary text-secondary-foreground font-heading font-semibold px-8 py-3.5 rounded-full text-base shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow"
            >
              Get Started
            </motion.button>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center"
          >
            <img src={heroImg} alt="AI-powered farming assistant" className="w-full max-w-md lg:max-w-lg" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
