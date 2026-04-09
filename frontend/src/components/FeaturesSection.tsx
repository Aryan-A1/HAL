import { motion } from "framer-motion";
import { ShieldCheck, Droplets, Sprout } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Crop Disease Detection",
    description: "AI-based analysis of plant diseases with prevention and cure suggestions, helping you act before it's too late.",
  },
  {
    icon: Droplets,
    title: "Crop Irrigation",
    description: "Smart irrigation insights to reduce water wastage and improve efficiency based on real-time weather and soil data.",
  },
  {
    icon: Sprout,
    title: "Catch Up on Crops",
    description: "Helps improve overall crop health and maximize yield with personalized recommendations for your farmland.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section id="crop-disease" className="section-padding bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground">
          What HAL Can Do
        </h2>
        <p className="text-center text-muted-foreground mt-3 max-w-xl mx-auto">
          Powerful AI tools designed specifically for modern agriculture.
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mt-14"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="bg-card rounded-2xl p-8 shadow-[var(--shadow-card)] hover-lift hover:shadow-[var(--shadow-elevated)] transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-5">
                <f.icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{f.title}</h3>
              <p className="text-muted-foreground mt-3 leading-relaxed text-sm">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
