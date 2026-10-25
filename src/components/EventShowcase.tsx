import React, { useEffect, useRef, useState } from "react";
import { EventCategory } from "../types";
import { EVENTS_DATA } from "../data/festivalData";
import { soundFx } from "../utils/audio";
import { Trophy, Users, Clock, MapPin, Filter, Volume2, VolumeX } from "lucide-react";
import { useSectionScrollFade } from "../hooks/useSectionScrollFade";
import { useScrollDownActivation } from "../hooks/useScrollDownActivation";

const TARGET_VOLUME = 0.35;

export const EventShowcase: React.FC = () => {
  const { sectionRef, isVisible } = useSectionScrollFade();
  const hasScrollActivated = useScrollDownActivation(sectionRef);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const toggleSoundRef = useRef<() => void>(() => {});
  const [activeCategory, setActiveCategory] = useState<EventCategory>("all");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const video = backgroundVideoRef.current;
    if (!video) return;

    let sectionIsVisible = false;
    let userMutedOnPurpose = false;
    let primed = false;
    let fadeFrame = 0;
    let fadeStartedAt = 0;
    let fadeStartVolume = 0;
    let fadeTargetVolume = 0;

    const fadeVolumeTo = (target: number) => {
      window.cancelAnimationFrame(fadeFrame);
      fadeStartedAt = performance.now();
      fadeStartVolume = video.volume;
      fadeTargetVolume = target;

      const step = (now: number) => {
        const progress = Math.min((now - fadeStartedAt) / 900, 1);
        video.volume = fadeStartVolume + (fadeTargetVolume - fadeStartVolume) * progress;
        if (progress < 1) {
          fadeFrame = window.requestAnimationFrame(step);
        } else if (fadeTargetVolume === 0 && !sectionIsVisible) {
          video.pause();
        }
      };

      fadeFrame = window.requestAnimationFrame(step);
    };

    // Try to play WITH sound. If the browser refuses (no user gesture yet),
    // fall back to silent playback so the video still shows.
    const startPlayback = async () => {
      if (userMutedOnPurpose) {
        video.muted = true;
        try {
          await video.play();
        } catch {
          // ignore
        }
        return;
      }

      video.volume = 0;
      video.muted = false;
      try {
        await video.play();
        setIsMuted(false);
        fadeVolumeTo(TARGET_VOLUME);
      } catch {
        video.muted = true;
        setIsMuted(true);
        try {
          await video.play();
        } catch {
          // Playback can still be blocked until the user interacts with the page.
        }
      }
    };

    // Runs on the first real gesture ANYWHERE on the page (tap, click, key press),
    // even when this section is not on screen yet. This is what lets the music start
    // later by plain scrolling, instead of only after a navbar click.
    const prime = () => {
      if (primed) return;
      primed = true;
      video.muted = false;
      video.volume = 0;
      void video
        .play()
        .then(() => {
          if (!sectionIsVisible) video.pause();
        })
        .catch(() => {
          video.muted = true;
          primed = false; // try again on the next gesture
        });
    };

    const onUserGesture = () => {
      if (!sectionIsVisible) {
        prime();
        return;
      }
      // Section is on screen but was playing silently: turn the sound on now.
      if (video.muted && !userMutedOnPurpose) void startPlayback();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        sectionIsVisible = entry.isIntersecting;
        setInView(entry.isIntersecting);
        if (sectionIsVisible) {
          void startPlayback();
        } else {
          fadeVolumeTo(0);
        }
      },
      // The section is very tall on phones, so a ratio like 0.2 can never be reached.
      // Any visible part counts instead.
      { threshold: 0 },
    );

    toggleSoundRef.current = () => {
      if (video.muted || video.volume === 0) {
        userMutedOnPurpose = false;
        void startPlayback();
      } else {
        userMutedOnPurpose = true;
        video.muted = true;
        setIsMuted(true);
      }
    };

    // "touchend" / "pointerup" / "click" are the events mobile browsers accept as a gesture.
    const gestureEvents: Array<keyof WindowEventMap> = [
      "pointerdown",
      "pointerup",
      "click",
      "touchend",
      "keydown",
    ];

    observer.observe(video.closest("section") ?? video);
    gestureEvents.forEach((e) => window.addEventListener(e, onUserGesture));

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(fadeFrame);
      gestureEvents.forEach((e) => window.removeEventListener(e, onUserGesture));
      video.pause();
    };
  }, []);

  const categories: { key: EventCategory; label: string }[] = [
    { key: "all", label: "ALL EVENTS" },
    { key: "coding", label: "CODING & HACK" },
    { key: "robotics", label: "ROBOTICS" },
    { key: "gaming", label: "ESPORTS" },
    { key: "creative", label: "CREATIVE & R&D" },
    { key: "cultural", label: "CULTURAL & STAGE" },
  ];

  const filteredEvents = activeCategory === "all" 
    ? EVENTS_DATA 
    : EVENTS_DATA.filter((e) => e.category === activeCategory);

  return (
    <section ref={sectionRef} id="events" className="relative py-24 sm:py-32 bg-[#0d0e11] overflow-hidden">
      <video
        ref={backgroundVideoRef}
        aria-hidden="true"
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover opacity-40 pointer-events-none"
      >
        <source src="/assets/featured-competitions-background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-x-0 top-0 z-[1] h-52 sm:h-72 bg-gradient-to-b from-[#050607] via-[#0d0e11]/85 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-52 sm:h-72 bg-gradient-to-t from-[#050607] via-[#0d0e11]/85 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />

      {/* Sound control: visitors who only scroll (never tap) can turn the music on here */}
      {inView && (
        <button
          type="button"
          onClick={() => toggleSoundRef.current()}
          aria-label={isMuted ? "Turn background sound on" : "Turn background sound off"}
          className="fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-sm border border-white/15 bg-[#171717]/80 px-3 py-2 font-mono text-[10px] font-bold tracking-widest text-white backdrop-blur-md transition-colors hover:border-sunset"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4 text-silver-400" />
          ) : (
            <Volume2 className="h-4 w-4 text-sunset" />
          )}
          {isMuted ? "TAP FOR SOUND" : "SOUND ON"}
        </button>
      )}
      
      <div className={`section-scroll-fade max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${isVisible && hasScrollActivated ? "is-visible" : ""}`}>
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              FEATURED <span className="text-sunset">COMPETITIONS</span>.
            </h2>
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <Filter className="w-4 h-4 text-silver-500 mr-1 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                soundFx.playClick();
                setActiveCategory(cat.key);
              }}
              className={`px-4 py-2 rounded-sm font-mono text-xs tracking-wider uppercase whitespace-nowrap transition-all duration-200 clip-diagonal-badge ${
                activeCategory === cat.key
                  ? "bg-sunset text-white font-bold shadow-[0_0_15px_rgba(255,100,46,0.5)]"
                  : "bg-white/5 text-silver-400 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Asymmetrical Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`group relative bg-[#171717] rounded-sm border transition-all duration-300 flex flex-col justify-between overflow-hidden clip-diagonal-card hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] ${
                selectedEventId === event.id ? "-translate-y-2 scale-[1.03] z-10 shadow-[0_20px_45px_rgba(255,100,46,0.2)]" : ""
              } ${
                event.featured 
                  ? "border-sunset/40 hover:border-sunset" 
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              {/* CGIT-only Badge */}
              {event.cgitOnly && (
                <div className="absolute top-0 right-0 bg-sunset px-3 py-0.5 text-[9px] font-mono font-bold tracking-widest text-white clip-diagonal-badge z-20">
                  ONLY FOR CGIT STUDENTS
                </div>
              )}

              {/* Card Header & Content */}
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider uppercase bg-white/5 text-silver-300 border border-white/10 rounded">
                    {event.categoryLabel}
                  </span>
                  <span className="font-mono text-xs text-silver-400">
                    {event.day}
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-2xl text-white group-hover:text-sunset transition-colors leading-tight mb-2">
                  {event.title}
                </h3>

                <p className="font-mono text-xs text-amber mb-3 tracking-wide">
                  {event.tagline}
                </p>

                <p className="font-sans text-xs sm:text-sm text-silver-400 leading-relaxed mb-6">
                  {event.description}
                </p>

                {/* Key metadata badges */}
                <div className="space-y-2 py-4 border-y border-white/5 font-mono text-xs text-silver-300">
                  <div className="flex items-center justify-between">
                    <span className="text-silver-500 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber" />
                      Prize Pool
                    </span>
                    <span className="font-bold text-white text-sm">
                      {event.prizePool}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-silver-500 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-sunset" />
                      Team Size
                    </span>
                    <span>{event.teamSize}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-silver-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-silver-400" />
                      Schedule
                    </span>
                    <span className="text-[11px] truncate max-w-[170px]">{event.scheduleTime}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-silver-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-silver-400" />
                      Venue
                    </span>
                    <span className="text-[11px] truncate max-w-[170px]">{event.venue}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 sm:p-6 bg-[#121418] border-t border-white/5 grid grid-cols-2 gap-3">
                {event.registrationLink ? (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedEventId(event.id);
                    }}
                    className="py-2.5 px-3 rounded-sm bg-sunset hover:bg-sunset-hover text-white font-mono text-xs font-bold tracking-wider clip-diagonal-btn transition-all flex items-center justify-center gap-1 shadow-md hover:shadow-sunset/40"
                  >
                    <span>REGISTER</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="py-2.5 px-3 rounded-sm bg-white/5 border border-white/10 text-silver-500 font-mono text-[10px] font-bold tracking-wider cursor-not-allowed flex items-center justify-center"
                  >
                    OPENING SOON
                  </button>
                )}

                {event.guidelinesLink ? (
                  <a
                    href={event.guidelinesLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFx.playClick()}
                    className="py-2.5 px-3 rounded-sm border border-sunset/60 text-white hover:bg-sunset/15 font-mono text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-1"
                  >
                    <span>GUIDELINES</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="py-2.5 px-3 rounded-sm bg-white/5 border border-white/10 text-silver-500 font-mono text-[10px] font-bold tracking-wider cursor-not-allowed flex items-center justify-center"
                  >
                    GUIDELINES SOON
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// import React, { useEffect, useRef, useState } from "react";
// import { EventCategory } from "../types";
// import { EVENTS_DATA } from "../data/festivalData";
// import { soundFx } from "../utils/audio";
// import { Trophy, Users, Clock, MapPin, Filter, Volume2, VolumeX } from "lucide-react";
// import { useSectionScrollFade } from "../hooks/useSectionScrollFade";
// import { useScrollDownActivation } from "../hooks/useScrollDownActivation";

// const TARGET_VOLUME = 0.35;

// export const EventShowcase: React.FC = () => {
//   const { sectionRef, isVisible } = useSectionScrollFade();
//   const hasScrollActivated = useScrollDownActivation(sectionRef);
//   const backgroundVideoRef = useRef<HTMLVideoElement>(null);
//   const toggleSoundRef = useRef<() => void>(() => {});
//   const [activeCategory, setActiveCategory] = useState<EventCategory>("all");
//   const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
//   const [isMuted, setIsMuted] = useState(true);
//   const [inView, setInView] = useState(false);

//   useEffect(() => {
//     const video = backgroundVideoRef.current;
//     if (!video) return;

//     let sectionIsVisible = false;
//     let userMutedOnPurpose = false;
//     let primed = false;
//     let fadeFrame = 0;
//     let fadeStartedAt = 0;
//     let fadeStartVolume = 0;
//     let fadeTargetVolume = 0;

//     const fadeVolumeTo = (target: number) => {
//       window.cancelAnimationFrame(fadeFrame);
//       fadeStartedAt = performance.now();
//       fadeStartVolume = video.volume;
//       fadeTargetVolume = target;

//       const step = (now: number) => {
//         const progress = Math.min((now - fadeStartedAt) / 900, 1);
//         video.volume = fadeStartVolume + (fadeTargetVolume - fadeStartVolume) * progress;
//         if (progress < 1) {
//           fadeFrame = window.requestAnimationFrame(step);
//         } else if (fadeTargetVolume === 0 && !sectionIsVisible) {
//           video.pause();
//         }
//       };

//       fadeFrame = window.requestAnimationFrame(step);
//     };

//     // Try to play WITH sound. If the browser refuses (no user gesture yet),
//     // fall back to silent playback so the video still shows.
//     const startPlayback = async () => {
//       if (userMutedOnPurpose) {
//         video.muted = true;
//         try {
//           await video.play();
//         } catch {
//           // ignore
//         }
//         return;
//       }

//       video.volume = 0;
//       video.muted = false;
//       try {
//         await video.play();
//         setIsMuted(false);
//         fadeVolumeTo(TARGET_VOLUME);
//       } catch {
//         video.muted = true;
//         setIsMuted(true);
//         try {
//           await video.play();
//         } catch {
//           // Playback can still be blocked until the user interacts with the page.
//         }
//       }
//     };

//     // Runs on the first real gesture ANYWHERE on the page (tap, click, key press),
//     // even when this section is not on screen yet. This is what lets the music start
//     // later by plain scrolling, instead of only after a navbar click.
//     const prime = () => {
//       if (primed) return;
//       primed = true;
//       video.muted = false;
//       video.volume = 0;
//       void video
//         .play()
//         .then(() => {
//           if (!sectionIsVisible) video.pause();
//         })
//         .catch(() => {
//           video.muted = true;
//           primed = false; // try again on the next gesture
//         });
//     };

//     const onUserGesture = () => {
//       if (!sectionIsVisible) {
//         prime();
//         return;
//       }
//       // Section is on screen but was playing silently: turn the sound on now.
//       if (video.muted && !userMutedOnPurpose) void startPlayback();
//     };

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         sectionIsVisible = entry.isIntersecting;
//         setInView(entry.isIntersecting);
//         if (sectionIsVisible) {
//           void startPlayback();
//         } else {
//           fadeVolumeTo(0);
//         }
//       },
//       // The section is very tall on phones, so a ratio like 0.2 can never be reached.
//       // Any visible part counts instead.
//       { threshold: 0 },
//     );

//     toggleSoundRef.current = () => {
//       if (video.muted || video.volume === 0) {
//         userMutedOnPurpose = false;
//         void startPlayback();
//       } else {
//         userMutedOnPurpose = true;
//         video.muted = true;
//         setIsMuted(true);
//       }
//     };

//     // "touchend" / "pointerup" / "click" are the events mobile browsers accept as a gesture.
//     const gestureEvents: Array<keyof WindowEventMap> = [
//       "pointerdown",
//       "pointerup",
//       "click",
//       "touchend",
//       "keydown",
//     ];

//     observer.observe(video.closest("section") ?? video);
//     gestureEvents.forEach((e) => window.addEventListener(e, onUserGesture));

//     return () => {
//       observer.disconnect();
//       window.cancelAnimationFrame(fadeFrame);
//       gestureEvents.forEach((e) => window.removeEventListener(e, onUserGesture));
//       video.pause();
//     };
//   }, []);

//   const categories: { key: EventCategory; label: string }[] = [
//     { key: "all", label: "ALL EVENTS" },
//     { key: "coding", label: "CODING & HACK" },
//     { key: "robotics", label: "ROBOTICS" },
//     { key: "gaming", label: "ESPORTS" },
//     { key: "creative", label: "CREATIVE & R&D" },
//     { key: "cultural", label: "CULTURAL & STAGE" },
//   ];

//   const filteredEvents = activeCategory === "all" 
//     ? EVENTS_DATA 
//     : EVENTS_DATA.filter((e) => e.category === activeCategory);

//   return (
//     <section ref={sectionRef} id="events" className="relative py-24 sm:py-32 bg-[#0d0e11] overflow-hidden">
//       <video
//         ref={backgroundVideoRef}
//         aria-hidden="true"
//         loop
//         playsInline
//         preload="auto"
//         className="absolute inset-0 h-full w-full object-cover opacity-40 pointer-events-none"
//       >
//         <source src="/assets/featured-competitions-background.mp4" type="video/mp4" />
//       </video>
//       <div className="absolute inset-x-0 top-0 z-[1] h-52 sm:h-72 bg-gradient-to-b from-[#050607] via-[#0d0e11]/85 to-transparent pointer-events-none" />
//       <div className="absolute inset-x-0 bottom-0 z-[1] h-52 sm:h-72 bg-gradient-to-t from-[#050607] via-[#0d0e11]/85 to-transparent pointer-events-none" />
//       <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />

//       {/* Sound control: visitors who only scroll (never tap) can turn the music on here */}
//       {inView && (
//         <button
//           type="button"
//           onClick={() => toggleSoundRef.current()}
//           aria-label={isMuted ? "Turn background sound on" : "Turn background sound off"}
//           className="fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-sm border border-white/15 bg-[#171717]/80 px-3 py-2 font-mono text-[10px] font-bold tracking-widest text-white backdrop-blur-md transition-colors hover:border-sunset"
//         >
//           {isMuted ? (
//             <VolumeX className="h-4 w-4 text-silver-400" />
//           ) : (
//             <Volume2 className="h-4 w-4 text-sunset" />
//           )}
//           {isMuted ? "TAP FOR SOUND" : "SOUND ON"}
//         </button>
//       )}
      
//       <div className={`section-scroll-fade max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${isVisible && hasScrollActivated ? "is-visible" : ""}`}>
        
//         {/* Section Header */}
//         <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
//           <div>
//             <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
//               FEATURED <span className="text-sunset">COMPETITIONS</span>.
//             </h2>
//           </div>

//         </div>

//         {/* Category Filter Pills */}
//         <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
//           <Filter className="w-4 h-4 text-silver-500 mr-1 shrink-0" />
//           {categories.map((cat) => (
//             <button
//               key={cat.key}
//               onClick={() => {
//                 soundFx.playClick();
//                 setActiveCategory(cat.key);
//               }}
//               className={`px-4 py-2 rounded-sm font-mono text-xs tracking-wider uppercase whitespace-nowrap transition-all duration-200 clip-diagonal-badge ${
//                 activeCategory === cat.key
//                   ? "bg-sunset text-white font-bold shadow-[0_0_15px_rgba(255,100,46,0.5)]"
//                   : "bg-white/5 text-silver-400 hover:text-white hover:bg-white/10 border border-white/5"
//               }`}
//             >
//               {cat.label}
//             </button>
//           ))}
//         </div>

//         {/* Asymmetrical Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
//           {filteredEvents.map((event) => (
//             <div
//               key={event.id}
//               className={`group relative bg-[#171717] rounded-sm border transition-all duration-300 flex flex-col justify-between overflow-hidden clip-diagonal-card hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] ${
//                 selectedEventId === event.id ? "-translate-y-2 scale-[1.03] z-10 shadow-[0_20px_45px_rgba(255,100,46,0.2)]" : ""
//               } ${
//                 event.featured 
//                   ? "border-sunset/40 hover:border-sunset" 
//                   : "border-white/10 hover:border-white/30"
//               }`}
//             >
//               {/* Featured Badge */}
//               {event.featured && (
//                 <div className="absolute top-0 right-0 bg-sunset px-3 py-0.5 text-[9px] font-mono font-bold tracking-widest text-white clip-diagonal-badge z-20">
//                   FLAGSHIP
//                 </div>
//               )}

//               {/* Card Header & Content */}
//               <div className="p-6 sm:p-7">
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider uppercase bg-white/5 text-silver-300 border border-white/10 rounded">
//                     {event.categoryLabel}
//                   </span>
//                   <span className="font-mono text-xs text-silver-400">
//                     {event.day}
//                   </span>
//                 </div>

//                 <h3 className="font-display font-extrabold text-2xl text-white group-hover:text-sunset transition-colors leading-tight mb-2">
//                   {event.title}
//                 </h3>

//                 <p className="font-mono text-xs text-amber mb-3 tracking-wide">
//                   {event.tagline}
//                 </p>

//                 <p className="font-sans text-xs sm:text-sm text-silver-400 leading-relaxed mb-6">
//                   {event.description}
//                 </p>

//                 {/* Key metadata badges */}
//                 <div className="space-y-2 py-4 border-y border-white/5 font-mono text-xs text-silver-300">
//                   <div className="flex items-center justify-between">
//                     <span className="text-silver-500 flex items-center gap-1.5">
//                       <Trophy className="w-3.5 h-3.5 text-amber" />
//                       Prize Pool
//                     </span>
//                     <span className="font-bold text-white text-sm">
//                       {event.prizePool}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <span className="text-silver-500 flex items-center gap-1.5">
//                       <Users className="w-3.5 h-3.5 text-sunset" />
//                       Team Size
//                     </span>
//                     <span>{event.teamSize}</span>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <span className="text-silver-500 flex items-center gap-1.5">
//                       <Clock className="w-3.5 h-3.5 text-silver-400" />
//                       Schedule
//                     </span>
//                     <span className="text-[11px] truncate max-w-[170px]">{event.scheduleTime}</span>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <span className="text-silver-500 flex items-center gap-1.5">
//                       <MapPin className="w-3.5 h-3.5 text-silver-400" />
//                       Venue
//                     </span>
//                     <span className="text-[11px] truncate max-w-[170px]">{event.venue}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Card Footer Actions */}
//               <div className="p-4 sm:p-6 bg-[#121418] border-t border-white/5 flex items-center">
//                 <a
//                   href="https://drive.google.com/drive/folders/1G5mDRmH-S307zFAsotMWS2qvkrLFNrT9?usp=drive_link"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   onClick={() => {
//                     soundFx.playClick();
//                     setSelectedEventId(event.id);
//                   }}
//                   className="flex-1 py-2.5 px-4 rounded-sm bg-sunset hover:bg-sunset-hover text-white font-mono text-xs font-bold tracking-wider clip-diagonal-btn transition-all flex items-center justify-center gap-1 shadow-md hover:shadow-sunset/40"
//                 >
//                   <span>REGISTER</span>
//                 </a>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// };

