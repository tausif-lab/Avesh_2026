import React, { useEffect, useRef, useState } from "react";
import { soundFx } from "../utils/audio";
import { FEST_METRICS } from "../data/festivalData";
import { useSectionScrollFade } from "../hooks/useSectionScrollFade";

export const AboutSection: React.FC = () => {
  const { sectionRef, isVisible: sectionVisible } = useSectionScrollFade();
  const [pillarsVisible, setPillarsVisible] = useState(false);
  const [exitDirection, setExitDirection] = useState<"up" | "down">("down");
  const scrollDirection = useRef<"up" | "down">("down");

  useEffect(() => {
    let previousScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY !== previousScrollY) {
        scrollDirection.current = currentScrollY > previousScrollY ? "down" : "up";
        previousScrollY = currentScrollY;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (sectionVisible) {
      setPillarsVisible(true);
    } else {
      setExitDirection(scrollDirection.current === "down" ? "up" : "down");
      setPillarsVisible(false);
    }
  }, [sectionVisible]);

  const pillars = [
    {
      code: "01",
      title: "OCTOCODE",
      subtitle: "8-Hour Innovation Sprint & Demo",
      desc: "An innovation sprint where student teams collaborate, prototype and present practical ideas that solve real community, campus, and public service challenges.",
    },
    {
      code: "02",
      title: "ROBOTICS BATTLES",
      subtitle: "Robo Soccer & Sumo Dohyo",
      desc: "High-velocity bot soccer knockout matches and circular dohyo ring sumo bouts testing torque, traction, low-profile wedges, and driver strategy.",
    },
    {
      code: "03",
      title: "AI & E-SPORTS",
      subtitle: "PromptMe & Auditorium Gaming",
      desc: "An on-the-spot 3-hour Prompt Engineering challenge, plus BGMI and Free Fire championship matches telecast live on the auditorium big screen.",
    },
    {
      code: "04",
      title: "CULTURAL & ARTIST NIGHT",
      subtitle: "Stage Competitions & Live Headliner",
      desc: "Four live evening competitions in Solo/Group Singing and Dance, culminating in a star celebrity artist night and a dance floor DJ set.",
    },
  ];

  return (
    <section ref={sectionRef} id="about" className="relative py-24 sm:py-32 bg-[#0e1014] overflow-hidden border-t border-white/5">
      <div
        aria-hidden="true"
        className="about-background-image absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/gec9.jpeg')" }}
      />
      <div aria-hidden="true" className="about-background-fade absolute inset-0" />
      <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-sunset/5 rounded-full blur-[140px] pointer-events-none" />

      <div className={`section-scroll-fade max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${sectionVisible ? "is-visible" : ""}`}>
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div className="max-w-3xl">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05]">
              WHERE URBAN FUTURISM MEETS <span className="text-sunset">RAW ENGINEERING</span>.
            </h2>
          </div>

          <div className="lg:max-w-md">
            <p className="about-description-glow font-mono text-xs sm:text-sm tracking-wide text-silver-400 leading-relaxed mb-3">
              AVESH is the annual technical and cultural fest of <strong className="text-silver-200">CGIT Raipur</strong> (formerly known as GEC Raipur): four days where engineering meets expression. Two days of competitions in code, ideas, robotics and structures, a cultural evening on stage, and a closing artist night under the lights.
            </p>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {pillars.map((pillar, index) => {
            return (
              <div
                key={pillar.code}
                onMouseEnter={() => soundFx.playHover()}
                style={{ transitionDelay: `${index * 110}ms` }}
                className={`scroll-reveal-card group relative p-6 sm:p-7 bg-black backdrop-blur-none rounded-sm border border-white/10 hover:border-sunset/50 transition-all duration-500 clip-diagonal-card hover:shadow-[0_10px_30px_rgba(255,100,46,0.15)] flex flex-col justify-between hover:-translate-y-2 ${
                  pillarsVisible ? "is-visible" : `is-hidden-${exitDirection}`
                }`}
              >
                {/* Accent corner tag */}
                <div>
                  <h3 className="font-display font-bold text-xl text-white group-hover:text-silver-100 transition-colors mb-1">
                    {pillar.title}
                  </h3>
                  <span className="block font-mono text-[11px] tracking-wider text-sunset mb-3">
                    {pillar.subtitle}
                  </span>
                  <p className="font-mono text-[11px] sm:text-xs text-silver-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Fest By The Numbers Banner from Official Brochure */}
        <div className="relative p-8 sm:p-10 bg-gradient-to-r from-[#171717]/65 via-[#1c1e24]/55 to-[#171717]/65 backdrop-blur-md rounded-sm border border-white/15 shadow-[0_18px_48px_rgba(0,0,0,0.48)] overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-sunset/10 to-transparent pointer-events-none" />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            <div className="pt-4 lg:pt-0">
              <div className="flex items-center justify-center mb-1">
                <span className="font-display font-black text-3xl sm:text-4xl text-white">
                  8
                </span>
              </div>
              <span className="font-mono text-xs tracking-widest text-silver-400 uppercase">
                TECHNICAL COMPETITIONS
              </span>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="flex items-center justify-center mb-1">
                <span className="font-display font-black text-3xl sm:text-4xl text-white">
                  4
                </span>
              </div>
              <span className="font-mono text-xs tracking-widest text-silver-400 uppercase">
                CULTURAL COMPETITIONS
              </span>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="flex items-center justify-center mb-1">
                <span className="font-display font-black text-3xl sm:text-4xl text-white">
                  1
                </span>
              </div>
              <span className="font-mono text-xs tracking-widest text-silver-400 uppercase">
                GRAND ARTIST NIGHT
              </span>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="flex items-center justify-center mb-1">
                <span className="font-display font-black text-3xl sm:text-4xl text-white">
                  4 DAYS
                </span>
              </div>
              <span className="font-mono text-xs tracking-widest text-silver-400 uppercase">
                27 – 30 OCTOBER 2026
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
