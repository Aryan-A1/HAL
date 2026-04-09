import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DashboardPreviewSection from "@/components/DashboardPreviewSection";
import FeaturesSection from "@/components/FeaturesSection";
import FAQSection from "@/components/FAQSection";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Navbar />
      <HeroSection />
      <DashboardPreviewSection />
      <FeaturesSection />
      <FAQSection />
      <TeamSection />
      <Footer />
    </div>
  );
};

export default Index;
