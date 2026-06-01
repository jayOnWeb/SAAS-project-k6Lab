import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import AIAnalysis from '../components/AIAnalysis';
import DashboardShowcase from '../components/DashboardShowcase';
import About from '../components/About';
import TelemetryBento from '../components/TelemetryBento';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="page-shell">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <AIAnalysis />
        <DashboardShowcase />
        <About />
        <TelemetryBento />
      </main>
      <Footer />
    </div>
  );
}
