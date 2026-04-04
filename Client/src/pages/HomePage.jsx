import Navbar from "../components/LandingPage/layout/Navbar";
import Footer from "../components/LandingPage/layout/Footer";
import HeroSection from "../components/LandingPage/home/HeroSection";
import BenefitsSection from "../components/LandingPage/home/BenefitsSection";
import HowItWorksSection from "../components/LandingPage/home/HowItWorksSection";
import CTASection from "../components/LandingPage/home/CTASection";

const HomePage = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-slate-900 font-display text-text-main overflow-x-hidden antialiased selection:bg-primary selection:text-white">
      <Navbar />
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
