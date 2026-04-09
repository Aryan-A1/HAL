import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "How does HAL detect crop diseases?", a: "HAL uses advanced image recognition and machine learning models trained on thousands of crop disease samples. Simply upload a photo of your crop and our AI will identify the disease and suggest treatment options." },
  { q: "How accurate is the irrigation recommendation system?", a: "Our irrigation system combines soil moisture data, weather forecasts, and crop-specific water needs to achieve over 95% accuracy in recommendations, helping you save up to 40% water." },
  { q: "Is my farm data secure?", a: "Absolutely. We use bank-grade encryption for all data in transit and at rest. Your farm data is never shared with third parties and you maintain full ownership of your information." },
  { q: "How much does HAL cost?", a: "HAL offers a free tier for small farms (up to 5 acres). Our Pro plan starts at $29/month for unlimited acreage with premium features including real-time alerts and detailed analytics." },
  { q: "Can I use HAL on multiple farms?", a: "Yes! HAL supports multi-farm management. You can add unlimited farms to your account and switch between them seamlessly from a single dashboard." },
];

const FAQSection = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-foreground"
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card rounded-xl border border-border px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
