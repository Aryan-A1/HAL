import { motion } from "framer-motion";
import heroImg from "@/assets/pngKissan.png";
import CircularText from "./CircularText";

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
              HAL uses cutting-edge AI to detect crop diseases early, optimize irrigation schedules, and boost your farm's productivity - all from a single dashboard.
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
            className="flex justify-center relative z-0"
          >
            {/* Spinning badge centered around the farmer's head, behind the image */}
            <div className="absolute top-[25%] left-[55%] md:top-[28%] md:left-[65%] lg:top-[30%] lg:left-[68%] -translate-x-1/2 -translate-y-1/2 z-[-1] pointer-events-auto">
              <CircularText
                text="Grow Smarter • Farm Better • Harvest More • "
                onHover="speedUp"
                spinDuration={20}
                className="text-primary w-[200px] h-[200px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px]"
              />
            </div>
            
            <img 
              src={heroImg} 
              alt="AI-powered farming assistant" 
              className="w-[150%] max-w-[150%] -translate-x-[80px] md:-translate-x-[100px] object-contain relative z-10" 
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
