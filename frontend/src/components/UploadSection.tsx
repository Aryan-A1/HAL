import { motion } from "framer-motion";
import { CloudUpload } from "lucide-react";

const UploadSection = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Upload box */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border-2 border-dashed border-secondary/40 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-secondary hover:bg-muted/50 transition-colors group"
          >
            <CloudUpload className="w-14 h-14 text-secondary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-foreground">Add Your Crops</h3>
            <p className="text-muted-foreground mt-2 text-sm">Drag & drop or click to upload</p>
            <p className="text-muted-foreground text-xs mt-1">Supported formats: JPG, PNG, PDF</p>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-muted rounded-2xl p-12 flex flex-col justify-center"
          >
            <h3 className="text-2xl font-bold text-foreground">Create your Digital Warehouse</h3>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              All the details of your crops and farmland are used to create a digital warehouse where you can access and manage everything in one place. Track growth, monitor health, and plan your harvest — all powered by AI.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
