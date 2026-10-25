import React from "react";
import { soundFx } from "../utils/audio";
import { useSectionScrollFade } from "../hooks/useSectionScrollFade";

export const SponsorsSection: React.FC = () => {
  const { sectionRef, isVisible } = useSectionScrollFade();

  return (
    <section ref={sectionRef} id="sponsors" className="relative py-24 sm:py-32 bg-[#0e1014] border-t border-white/5 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
        style={{ backgroundImage: "url('/assets/gec1.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e1014]/60 via-[#0e1014]/72 to-[#0e1014]/65 pointer-events-none" />
      <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />

      <div className={`section-scroll-fade max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${isVisible ? "is-visible" : ""}`}>
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            POWERED BY <span className="text-sunset">INDUSTRY LEADERS</span>.
          </h2>
          <p className="font-sans text-sm sm:text-base text-silver-400 mt-2">
            Sponsors to be revealed soon.
          </p>
        </div>

        {/* Call for Sponsorship Pill */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-4 rounded-sm bg-[#171717] border border-white/10 font-mono text-xs text-silver-400">
            <span>WANT TO PARTNER WITH AVESH 2026 AT CGIT RAIPUR?</span>
            <a
              href="mailto:sponsorships@cgitraipur.edu.in"
              onClick={() => soundFx.playClick()}
              className="text-sunset hover:text-white font-bold underline underline-offset-4 tracking-wider"
            >
              DOWNLOAD SPONSORSHIP BROCHURE →
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
