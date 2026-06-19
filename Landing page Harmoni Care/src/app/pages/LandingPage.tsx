import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Benefits } from '../components/Benefits';
import { Features } from '../components/Features';
import { MultidisciplinarySection } from '../components/MultidisciplinarySection';
import { ToolsSection } from '../components/ToolsSection';
import { SecuritySection } from '../components/SecuritySection';
import { Testimonials } from '../components/Testimonials';
import { Pricing } from '../components/Pricing';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Benefits />
      <Features />
      <MultidisciplinarySection />
      <ToolsSection />
      <SecuritySection />
      <Testimonials />
      <Pricing />
      <CTASection />
      <Footer />
    </div>
  );
}
