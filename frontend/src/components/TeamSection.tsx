import { motion } from "framer-motion";
import { Linkedin, Twitter, Instagram } from "lucide-react";

const team = [
  { name: "Aryan Kumar Singh" },
  { name: "Krishan Goyal" },
  { name: "Sejal Jaswal" },
  { name: "Harsh Thakur" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const TeamSection = () => {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground">
          Meet Our Team
        </h2>
        <p className="text-center text-muted-foreground mt-3">The people behind HAL</p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14"
        >
          {team.map((member) => (
            <motion.div
              key={member.name}
              variants={item}
              className="bg-card rounded-2xl p-6 shadow-[var(--shadow-card)] hover-lift text-center"
            >
              <div className="w-20 h-20 rounded-full bg-secondary/15 mx-auto flex items-center justify-center text-secondary font-heading font-bold text-2xl">
                {member.name.split(" ").map(n => n[0]).join("")}
              </div>
              <h4 className="mt-4 font-bold text-foreground text-sm">{member.name}</h4>
              <div className="flex justify-center gap-3 mt-3">
                <a href="#" className="text-muted-foreground hover:text-secondary transition-colors"><Linkedin size={16} /></a>
                <a href="#" className="text-muted-foreground hover:text-secondary transition-colors"><Twitter size={16} /></a>
                <a href="#" className="text-muted-foreground hover:text-secondary transition-colors"><Instagram size={16} /></a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
