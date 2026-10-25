import React from "react";

export const ExploreExperience: React.FC = () => {
  const chapters = [
    {
      id: "arena",
      index: "01",
      title: "THE STEEL ARENA",
      tagline: "Combat Robotics & Kinetic Warfare",
      description: "Step into the reinforced perimeter where high-torque spinner discs, hardened titanium wedges, and pneumatic lifters clash under blinding tungsten spotlights. Every spark tells a story of custom gearboxes and driver nerves.",
      stats: [
        { label: "Impact Force", value: "850+ RPM" },
        { label: "Armor Thickness", value: "6mm Hardox" },
        { label: "Spectator Capacity", value: "1,200 Seats" }
      ],
      color: "from-[#FF642E] to-[#992600]",
      accent: "text-sunset",
      bgGradient: "bg-gradient-to-tr from-[#250d06] via-[#171717] to-[#0e1014]"
    },
    {
      id: "crucible",
      index: "02",
      title: "THE SYNAPSE CRUCIBLE",
      tagline: "36 Hours of Relentless Code & Hardware",
      description: "When the campus clock strikes midnight, 400 developers, ML engineers, and UX architects turn caffeine into production software. Cloud pipelines deployed live before venture juries and senior engineering mentors.",
      stats: [
        { label: "Continuous Sprint", value: "36 Hours" },
        { label: "Prototypes Built", value: "80+ Repos" },
        { label: "Cloud Credits", value: "$25,000" }
      ],
      color: "from-[#FFA843] to-[#FF642E]",
      accent: "text-amber",
      bgGradient: "bg-gradient-to-tr from-[#221706] via-[#171717] to-[#0e1014]"
    },
    {
      id: "nexus",
      index: "03",
      title: "THE HORIZON NEXUS",
      tagline: "Patent Demonstrations & Venture Summits",
      description: "Witness the next wave of indigenous tech created in CGIT Raipur laboratories. From micro-satellite sensor boards to solar-assisted robotics and edge-computing biomedical telemetry.",
      stats: [
        { label: "Patents Displayed", value: "18 Prototypes" },
        { label: "Industry CTOs", value: "12 Keynotes" },
        { label: "Venture Grants", value: "₹5,00,000+" }
      ],
      color: "from-[#FF8C66] to-[#FFA843]",
      accent: "text-coral",
      bgGradient: "bg-gradient-to-tr from-[#201016] via-[#171717] to-[#0e1014]"
    },
    {
      id: "celebration",
      index: "04",
      title: "THE SUNSET CELEBRATION",
      tagline: "Live Rock, EDM Symphony & Cultural Grandeur",
      description: "As dusk washes the Raipur skyline in vermilion and amber, the central amphitheater erupts into thunderous double-kick drums, soaring vocal harmonies, and synchronized dance crew battles.",
      stats: [
        { label: "Concert PA", value: "45,000 Watts" },
        { label: "Live Bands", value: "14 Ensembles" },
        { label: "Night Attendance", value: "3,500+ Strong" }
      ],
      color: "from-[#FF642E] to-[#FF8C66]",
      accent: "text-sunset",
      bgGradient: "bg-gradient-to-tr from-[#2a0e08] via-[#171717] to-[#0e1014]"
    }
  ];

  const current = chapters[3];

  return (
    <section id="explore" className="relative py-24 sm:py-32 bg-[#0e1014] border-t border-white/5 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url('/assets/experience-background.jpg')" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              EXPLORE <span className="text-sunset">THE FESTIVAL</span>.
            </h2>
            <p className="about-description-glow font-sans text-sm sm:text-base text-silver-400 mt-2 max-w-xl">
              Immerse yourself across four signature dimensions of AVESH 2026.
            </p>
          </div>

        </div>

        {/* Big Editorial Feature Canvas */}
        <div className="explore-glass-panel relative p-8 sm:p-12 lg:p-16 rounded-sm border clip-diagonal-card overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-12">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="font-mono text-sm font-bold tracking-[0.3em] text-sunset">
                  CHAPTER {current.index}
                </span>
                <span className="text-white/20">•</span>
                <span className="font-mono text-xs tracking-wider text-silver-400 uppercase">
                  AVESH DIMENSION
                </span>
              </div>

              <h3 className="explore-chapter-title text-4xl sm:text-6xl text-white mb-2">
                {current.title}
              </h3>

              <p className="font-mono text-sm sm:text-base text-amber tracking-wide mb-6">
                {current.tagline}
              </p>

              {current.id !== "celebration" && (
                <p className="font-sans text-sm sm:text-base text-silver-300 leading-relaxed mb-8 max-w-2xl">
                  {current.description}
                </p>
              )}

              {current.id !== "celebration" && (
                <div className="pt-6 border-t border-white/10">
                  <div className="grid grid-cols-3 gap-4">
                    {current.stats.map((st, i) => (
                      <div key={i} className="min-w-0">
                        <span className="explore-stat-value block text-xl sm:text-2xl text-white">
                          {st.value}
                        </span>
                        <span className="block font-mono text-[10px] sm:text-xs text-silver-400 uppercase tracking-wider mt-0.5">
                          {st.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
