import { motion } from "framer-motion";
import { Linkedin, Mail, Instagram } from "lucide-react";

const team = [
  { 
    name: "Aryan Kumar Singh",
    linkedin: "https://www.linkedin.com/in/aryan-kumar-singh-784289314/",
    instagram: "https://www.instagram.com/aryan_variant/",
    email: "aryankumarsingh9370@gmail.com"
  },
  { 
    name: "Sejal Jaswal",
    linkedin: "https://www.linkedin.com/in/sejaljaswal/",
    instagram: "https://www.instagram.com/sejal__jaswal/",
    email: "sejaljaswal2020@gmail.com"
  },
  { 
    name: "Harsh Thakur",
    linkedin: "https://www.linkedin.com/in/harsh-thakur-21080a32a/",
    instagram: "https://www.instagram.com/absolutelyitsharsh/",
    email: "tsayamonly@gmail.com"
  },
  { 
    name: "Krishan Goyal",
    linkedin: "https://www.linkedin.com/in/krishangoyal717/",
    instagram: "https://www.instagram.com/krishangoyal_23/",
    email: "krishangoyal717@gmaill.com"
  },
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
    <section id="team" className="section-padding bg-muted/30">
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
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-secondary transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
                <a 
                  href={`mailto:${member.email}`} 
                  className="text-muted-foreground hover:text-secondary transition-colors"
                  title="Email"
                >
                  <Mail size={16} />
                </a>
                <a 
                  href={member.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-secondary transition-colors"
                  title="Instagram"
                >
                  <Instagram size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
