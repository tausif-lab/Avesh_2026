import React, { useEffect, useRef, useState } from "react";
import { soundFx } from "../utils/audio";
import { Volume2, VolumeX, Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const [navHidden, setNavHidden] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showSoundHint, setShowSoundHint] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const navHiddenRef = useRef(false);

  const navLinks = [
    { label: "HOME", href: "#hero" },
    { label: "ABOUT", href: "#about" },
    { label: "EVENTS", href: "#events" },
    { label: "EXPERIENCE", href: "#explore" },
    { label: "SCHEDULE", href: "#schedule" },
    { label: "SPONSORS", href: "#sponsors" },
    { label: "CONTACT", href: "#footer" },
  ];

  useEffect(() => {
    const scrollThreshold = 16;
    const topVisibilityThreshold = 40;
    let previousScrollY = Math.max(window.scrollY, 0);
    let downwardDistance = 0;
    let headerOffset = 0;
    let animationFrame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setHidden = (hidden: boolean) => {
      if (navHiddenRef.current === hidden) return;
      navHiddenRef.current = hidden;
      setNavHidden(hidden);
    };

    const applyHeaderOffset = () => {
      const header = headerRef.current;
      if (!header) return;

      const headerHeight = header.offsetHeight;
      headerOffset = Math.min(Math.max(headerOffset, 0), headerHeight);
      const progress = headerHeight ? headerOffset / headerHeight : 0;
      header.style.setProperty("--header-offset", `${headerOffset}px`);
      header.style.setProperty("--header-opacity", `${1 - progress}`);
      setHidden(progress >= 1);
    };

    const updateNavigationVisibility = () => {
      animationFrame = 0;
      const currentScrollY = Math.max(window.scrollY, 0);
      const scrollDelta = currentScrollY - previousScrollY;
      previousScrollY = currentScrollY;

      if (reducedMotion.matches || currentScrollY <= topVisibilityThreshold) {
        downwardDistance = 0;
        headerOffset = 0;
        applyHeaderOffset();
        setHidden(false);
        return;
      }

      if (scrollDelta < 0) {
        downwardDistance = 0;
        headerOffset += scrollDelta;
      }

      if (scrollDelta > 0) {
        downwardDistance += scrollDelta;
        if (downwardDistance >= scrollThreshold) headerOffset += scrollDelta;
      }

      applyHeaderOffset();
    };

    const scheduleNavigationUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateNavigationVisibility);
    };

    window.addEventListener("scroll", scheduleNavigationUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleNavigationUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Browsers only allow sound after a real tap / click / key press (scrolling does not count).
  // Show a small hint until the visitor does one, so background music can start when they scroll.
  useEffect(() => {
    const events: Array<keyof WindowEventMap> = ["pointerup", "click", "touchend", "keydown"];
    const dismiss = () => {
      setShowSoundHint(false);
      events.forEach((e) => window.removeEventListener(e, dismiss));
    };
    events.forEach((e) => window.addEventListener(e, dismiss));
    return () => events.forEach((e) => window.removeEventListener(e, dismiss));
  }, []);

  const toggleSound = () => {
    const newState = soundFx.toggle();
    setAudioActive(newState);
  };

  const handleSectionClick = (href: string) => {
    setActiveSection(href);
    soundFx.playClick();
  };

  return (
    <>
      <header
        ref={headerRef}
        aria-hidden={navHidden}
        inert={navHidden}
        className={`header-mirror fixed top-0 left-0 right-0 z-50 py-3 sm:py-3.5 ${
          navHidden ? "is-hidden" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Line: Brand (AVESH 2026) on Left, Action Bar on Right */}
          <div className="flex items-center justify-between pb-2.5">
            {/* Right Action Bar */}
            <div className="ml-auto flex items-center gap-2.5 sm:gap-3">
              {/* Audio Ambient Synth Toggle */}
              <button
                onClick={toggleSound}
                title={audioActive ? "Mute Ambient Sound" : "Enable Futuristic Audio Experience"}
                className={`p-2 rounded-sm border transition-all duration-300 ${
                  audioActive
                    ? "bg-sunset/20 border-sunset text-sunset"
                    : "bg-white/5 border-white/10 text-silver-400 hover:text-white hover:border-white/20"
                }`}
              >
                {audioActive ? (
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-sunset animate-pulse" />
                    <span className="hidden sm:inline-block font-mono text-[10px] tracking-wider text-sunset">
                      SFX ON
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <VolumeX className="w-4 h-4" />
                    <span className="hidden sm:inline-block font-mono text-[10px] tracking-wider">
                      SFX
                    </span>
                  </div>
                )}
              </button>

              {/* Outlined Orange "REGISTER NOW" CTA Button with diagonal styling */}
              <a
                href="#events"
                onClick={() => handleSectionClick("#events")}
                className="relative group overflow-hidden px-4 sm:px-5 py-2 rounded-sm border border-sunset font-mono text-xs font-bold tracking-[0.2em] text-white transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,100,46,0.5)] clip-diagonal-btn"
              >
                {/* Sliding fill background */}
                <span className="absolute inset-0 bg-sunset translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                <span className="relative z-10 flex items-center">
                  <span>REGISTER NOW</span>
                </span>
              </a>

              {/* Mobile Menu Icon */}
              <button
                onClick={() => {
                  soundFx.playClick();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="lg:hidden p-2 rounded-sm bg-white/5 border border-white/10 text-silver-300 hover:text-white"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <nav
            aria-label="Main navigation"
            className="header-mirror-nav mt-4 hidden lg:flex"
          >
            <div className="plain-nav-links">
              {navLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-current={activeSection === href ? "location" : undefined}
                  onClick={() => handleSectionClick(href)}
                  className={`plain-nav-link ${activeSection === href ? "is-active" : ""}`}
                >
                  {label}
                  <span className="plain-nav-underline" aria-hidden="true" />
                </a>
              ))}
            </div>
          </nav>

        </div>
      </header>

      {/* One-time "enable sound" hint: any tap/click/key press unlocks audio for the whole page */}
      {showSoundHint && (
        <div className="pointer-events-none fixed bottom-5 left-1/2 z-40 -translate-x-1/2 animate-fadeIn">
          <div className="flex items-center gap-2 rounded-sm border border-sunset/60 bg-[#0d0e11]/85 px-4 py-2 font-mono text-[10px] font-bold tracking-widest text-white backdrop-blur-md">
            <Volume2 className="h-4 w-4 animate-pulse text-sunset" />
            TAP ANYWHERE TO ENABLE SOUND
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-[#0d0e11]/95 backdrop-blur-xl pt-24 px-6 flex flex-col justify-between pb-8 animate-fadeIn">
          <nav className="flex flex-col gap-5">
            <span className="font-mono text-xs tracking-widest text-sunset uppercase">
              // NAVIGATION // CGIT RAIPUR
            </span>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  handleSectionClick(link.href);
                  setMobileMenuOpen(false);
                }}
                className="font-display font-bold text-2xl text-silver-200 hover:text-sunset transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
            <a
              href="#events"
              onClick={() => {
                handleSectionClick("#events");
                setMobileMenuOpen(false);
              }}
              className="w-full py-3.5 bg-sunset text-white font-mono font-bold text-sm tracking-widest rounded-sm clip-diagonal-btn text-center shadow-lg"
            >
              REGISTER FOR AVESH 2026
            </a>
          </div>
        </div>
      )}
    </>
  );
};

// import React, { useEffect, useRef, useState } from "react";
// import { soundFx } from "../utils/audio";
// import { Volume2, VolumeX, Menu, X } from "lucide-react";

// export const Header: React.FC = () => {
//   const [navHidden, setNavHidden] = useState(false);
//   const [audioActive, setAudioActive] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState<string | null>(null);
//   const headerRef = useRef<HTMLElement>(null);
//   const navHiddenRef = useRef(false);

//   const navLinks = [
//     { label: "HOME", href: "#hero" },
//     { label: "ABOUT", href: "#about" },
//     { label: "EVENTS", href: "#events" },
//     { label: "EXPERIENCE", href: "#explore" },
//     { label: "SCHEDULE", href: "#schedule" },
//     { label: "SPONSORS", href: "#sponsors" },
//     { label: "CONTACT", href: "#footer" },
//   ];

//   useEffect(() => {
//     const scrollThreshold = 16;
//     const topVisibilityThreshold = 40;
//     let previousScrollY = Math.max(window.scrollY, 0);
//     let downwardDistance = 0;
//     let headerOffset = 0;
//     let animationFrame = 0;
//     const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

//     const setHidden = (hidden: boolean) => {
//       if (navHiddenRef.current === hidden) return;
//       navHiddenRef.current = hidden;
//       setNavHidden(hidden);
//     };

//     const applyHeaderOffset = () => {
//       const header = headerRef.current;
//       if (!header) return;

//       const headerHeight = header.offsetHeight;
//       headerOffset = Math.min(Math.max(headerOffset, 0), headerHeight);
//       const progress = headerHeight ? headerOffset / headerHeight : 0;
//       header.style.setProperty("--header-offset", `${headerOffset}px`);
//       header.style.setProperty("--header-opacity", `${1 - progress}`);
//       setHidden(progress >= 1);
//     };

//     const updateNavigationVisibility = () => {
//       animationFrame = 0;
//       const currentScrollY = Math.max(window.scrollY, 0);
//       const scrollDelta = currentScrollY - previousScrollY;
//       previousScrollY = currentScrollY;

//       if (reducedMotion.matches || currentScrollY <= topVisibilityThreshold) {
//         downwardDistance = 0;
//         headerOffset = 0;
//         applyHeaderOffset();
//         setHidden(false);
//         return;
//       }

//       if (scrollDelta < 0) {
//         downwardDistance = 0;
//         headerOffset += scrollDelta;
//       }

//       if (scrollDelta > 0) {
//         downwardDistance += scrollDelta;
//         if (downwardDistance >= scrollThreshold) headerOffset += scrollDelta;
//       }

//       applyHeaderOffset();
//     };

//     const scheduleNavigationUpdate = () => {
//       if (animationFrame) return;
//       animationFrame = window.requestAnimationFrame(updateNavigationVisibility);
//     };

//     window.addEventListener("scroll", scheduleNavigationUpdate, { passive: true });
//     return () => {
//       window.removeEventListener("scroll", scheduleNavigationUpdate);
//       if (animationFrame) window.cancelAnimationFrame(animationFrame);
//     };
//   }, []);

//   const toggleSound = () => {
//     const newState = soundFx.toggle();
//     setAudioActive(newState);
//   };

//   const handleSectionClick = (href: string) => {
//     setActiveSection(href);
//     soundFx.playClick();
//   };

//   return (
//     <>
//       <header
//         ref={headerRef}
//         aria-hidden={navHidden}
//         inert={navHidden}
//         className={`header-mirror fixed top-0 left-0 right-0 z-50 py-3 sm:py-3.5 ${
//           navHidden ? "is-hidden" : ""
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
//           {/* Top Line: Brand (AVESH 2026) on Left, Action Bar on Right */}
//           <div className="flex items-center justify-between pb-2.5">
//             {/* Right Action Bar */}
//             <div className="ml-auto flex items-center gap-2.5 sm:gap-3">
//               {/* Audio Ambient Synth Toggle */}
//               <button
//                 onClick={toggleSound}
//                 title={audioActive ? "Mute Ambient Sound" : "Enable Futuristic Audio Experience"}
//                 className={`p-2 rounded-sm border transition-all duration-300 ${
//                   audioActive
//                     ? "bg-sunset/20 border-sunset text-sunset"
//                     : "bg-white/5 border-white/10 text-silver-400 hover:text-white hover:border-white/20"
//                 }`}
//               >
//                 {audioActive ? (
//                   <div className="flex items-center gap-1.5">
//                     <Volume2 className="w-4 h-4 text-sunset animate-pulse" />
//                     <span className="hidden sm:inline-block font-mono text-[10px] tracking-wider text-sunset">
//                       SFX ON
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-1.5">
//                     <VolumeX className="w-4 h-4" />
//                     <span className="hidden sm:inline-block font-mono text-[10px] tracking-wider">
//                       SFX
//                     </span>
//                   </div>
//                 )}
//               </button>

//               {/* Outlined Orange "REGISTER NOW" CTA Button with diagonal styling */}
//               <a
//                 href="#events"
//                 onClick={() => handleSectionClick("#events")}
//                 className="relative group overflow-hidden px-4 sm:px-5 py-2 rounded-sm border border-sunset font-mono text-xs font-bold tracking-[0.2em] text-white transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,100,46,0.5)] clip-diagonal-btn"
//               >
//                 {/* Sliding fill background */}
//                 <span className="absolute inset-0 bg-sunset translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
//                 <span className="relative z-10 flex items-center">
//                   <span>REGISTER NOW</span>
//                 </span>
//               </a>

//               {/* Mobile Menu Icon */}
//               <button
//                 onClick={() => {
//                   soundFx.playClick();
//                   setMobileMenuOpen(!mobileMenuOpen);
//                 }}
//                 className="lg:hidden p-2 rounded-sm bg-white/5 border border-white/10 text-silver-300 hover:text-white"
//                 aria-label="Toggle Navigation Menu"
//               >
//                 {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>

//           <nav
//             aria-label="Main navigation"
//             className="header-mirror-nav mt-4 hidden lg:flex"
//           >
//             <div className="plain-nav-links">
//               {navLinks.map(({ label, href }) => (
//                 <a
//                   key={label}
//                   href={href}
//                   aria-current={activeSection === href ? "location" : undefined}
//                   onClick={() => handleSectionClick(href)}
//                   className={`plain-nav-link ${activeSection === href ? "is-active" : ""}`}
//                 >
//                   {label}
//                   <span className="plain-nav-underline" aria-hidden="true" />
//                 </a>
//               ))}
//             </div>
//           </nav>

//         </div>
//       </header>

//       {/* Mobile Drawer */}
//       {mobileMenuOpen && (
//         <div className="fixed inset-0 z-40 lg:hidden bg-[#0d0e11]/95 backdrop-blur-xl pt-24 px-6 flex flex-col justify-between pb-8 animate-fadeIn">
//           <nav className="flex flex-col gap-5">
//             <span className="font-mono text-xs tracking-widest text-sunset uppercase">
//               // NAVIGATION // CGIT RAIPUR
//             </span>
//             {navLinks.map((link) => (
//               <a
//                 key={link.label}
//                 href={link.href}
//                 onClick={() => {
//                   handleSectionClick(link.href);
//                   setMobileMenuOpen(false);
//                 }}
//                 className="font-display font-bold text-2xl text-silver-200 hover:text-sunset transition-colors"
//               >
//                 {link.label}
//               </a>
//             ))}
//           </nav>

//           <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
//             <a
//               href="#events"
//               onClick={() => {
//                 handleSectionClick("#events");
//                 setMobileMenuOpen(false);
//               }}
//               className="w-full py-3.5 bg-sunset text-white font-mono font-bold text-sm tracking-widest rounded-sm clip-diagonal-btn text-center shadow-lg"
//             >
//               REGISTER FOR AVESH 2026
//             </a>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
