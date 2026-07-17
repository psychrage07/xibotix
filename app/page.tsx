import HeroSection from '@/components/HeroSection';
import ScrollRevealSection from '@/components/ScrollRevealSection';
import HorizontalScrollSection from '@/components/HorizontalScrollSection';
import MaskedReveal from '@/components/MaskedReveal';
import HumanoidScrollSection from '@/components/HumanoidScrollSection';
import FooterSection from '@/components/FooterSection';

export default function Home() {
  return (
    <main style={{ background: '#000' }}>
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Section A: Rehabilitation ── */}
      <section id="section-a" className="section">
        <div className="section__divider" />
        <ScrollRevealSection
          tag="Robotic Rehabilitation Devices"
          title="Restoring Strength, Redefining Mobility"
          body="Our smart rehabilitation technology is clinically proven and ready for recovery at home or in clinic. Our affordable robotic solutions ensure faster recovery and personalized therapy."
        />
      </section>

      {/* ── Horizontal Scroll Solutions Section ── */}
      {/* sticky + low z-index so the next section slides OVER it from below */}
      <div className="relative z-10">
        <HorizontalScrollSection />
      </div>

      {/* ── Section B: Humanoids intro — z-20 so it slides OVER the horizontal scroll section ── */}
      <section
        id="section-b"
        className="relative bg-black overflow-hidden py-28 flex flex-col items-center"
        style={{ position: 'relative', zIndex: 20 }}
      >
        <div className="section__divider" />
        
        <div className="w-full max-w-5xl mx-auto px-6 text-center mb-0 relative z-10">
          <MaskedReveal delay={0}>
            <p className="section__tag">Humanoids</p>
          </MaskedReveal>
          
          <MaskedReveal delay={150}>
            <h2 className="section__title">Human-Like Intelligence, Machine Precision</h2>
          </MaskedReveal>
          
          <MaskedReveal delay={300}>
            <p className="section__body">
              Uniting Humans and AI-Powered Robotics. Our advanced humanoid systems are designed to interact, assist, and operate with unprecedented emotional and physical fidelity.
            </p>
          </MaskedReveal>
        </div>
      </section>

      {/* ── Humanoid Scroll Cards — z-20 so it stays above the horizontal section ── */}
      <div className="bg-black" style={{ position: 'relative', zIndex: 20 }}>
        <HumanoidScrollSection />
      </div>
      {/* ── Footer — NO z-index wrapper so position:sticky inside works ── */}
      <FooterSection />

    </main>
  );
}