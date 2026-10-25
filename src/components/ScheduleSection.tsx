import React, { useEffect, useRef, useState } from "react";
import { SCHEDULE_DATA } from "../data/festivalData";
import { Clock, MapPin, User, ChevronDown } from "lucide-react";
import { useSectionScrollFade } from "../hooks/useSectionScrollFade";

const DAYS = [
  { day: 1 as const, date: "27 OCTOBER", title: "TECHNICAL DAY 01", hours: "10 AM — 4 PM" },
  { day: 2 as const, date: "28 OCTOBER", title: "TECHNICAL DAY 02", hours: "10 AM — 4 PM" },
  { day: 3 as const, date: "29 OCTOBER", title: "CULTURAL DAY", hours: "3 PM — 8 PM" },
  { day: 4 as const, date: "30 OCTOBER", title: "GRAND ARTIST NIGHT", hours: "5 PM ONWARDS" },
];

const LAST = DAYS.length - 1;

// Extra scroll length (in screens) so every day, especially the last one, has room to "rest".
const EXTRA_HOLD_SCREENS = 1;

// Fraction of the total scroll at the very end where the last day stays fully in view.
const END_HOLD = 0.22;

// Fraction of each day-to-day step that is spent "resting" on the day (split before/after).
const DWELL = 0.3;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Converts raw scroll progress (0..1) into a day position (0..LAST) that
 * pauses on every day, and fully rests on the last day at the end.
 */
const toDayPosition = (raw: number) => {
  const travel = clamp(raw / (1 - END_HOLD)) * LAST;
  const index = Math.min(LAST - 1, Math.floor(travel));
  const fraction = travel - index;
  const eased = smooth(clamp((fraction - DWELL / 2) / (1 - DWELL)));
  return travel >= LAST ? LAST : index + eased;
};

export const ScheduleSection: React.FC = () => {
  const { sectionRef, isVisible } = useSectionScrollFade();
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);

  const activePosition = toDayPosition(progress);
  const activeDay = Math.min(LAST, Math.round(activePosition));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const compute = () => {
      frame.current = 0;
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      setProgress(scrollable > 0 ? clamp(-rect.top / scrollable) : 1);
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame.current) window.cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionRef]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !isVisible) return;

    const audio = new Audio("/assets/schedule-swipe.mp3");
    audio.preload = "auto";

    let wheelEndTimer = 0;
    let wheelGestureActive = false;
    let touchStartY: number | null = null;

    const playSwipeSound = () => {
      audio.currentTime = 0;
      void audio.play().catch(() => {
        // Browsers may block playback until a user gesture is registered.
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) return;
      if (!wheelGestureActive) {
        wheelGestureActive = true;
        playSwipeSound();
      }
      window.clearTimeout(wheelEndTimer);
      wheelEndTimer = window.setTimeout(() => {
        wheelGestureActive = false;
      }, 350);
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (event: TouchEvent) => {
      const endY = event.changedTouches[0]?.clientY;
      if (touchStartY !== null && endY !== undefined && Math.abs(touchStartY - endY) > 24) {
        playSwipeSound();
      }
      touchStartY = null;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.clearTimeout(wheelEndTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      audio.pause();
    };
  }, [isVisible, sectionRef]);

  return (
    <section
      id="schedule"
      ref={sectionRef}
      className="relative bg-[#0d0e11]"
      style={{ height: `${(DAYS.length + EXTRA_HOLD_SCREENS) * 100}svh` }}
    >
      <div
        className={`section-scroll-fade sticky top-0 flex h-[100svh] flex-col overflow-hidden ${
          isVisible ? "is-visible" : ""
        }`}
      >
        <video
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
        >
          <source src="/assets/event-schedule-background.mp4" type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0d0e11]/78 via-[#0d0e11]/72 to-[#0d0e11]/82" />
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-25" />

        <header className="relative z-10 mx-auto flex w-full max-w-7xl items-end justify-between gap-6 px-4 pb-2 pt-20 sm:px-6 sm:pb-6 sm:pt-32 lg:px-8">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-5xl">
            EVENT <span className="text-sunset">SCHEDULE</span>.
          </h2>
          <div className="hidden shrink-0 items-center gap-2 pb-1 font-mono text-[10px] uppercase tracking-widest text-silver-400 sm:flex">
            <ChevronDown className="h-4 w-4 animate-bounce text-sunset" />
            Keep scrolling
          </div>
        </header>

        <div className="relative z-10 mx-auto mb-2 flex w-full max-w-7xl items-center gap-3 px-4 sm:mb-5 sm:px-6 lg:px-8">
          <div className="relative h-px flex-1 bg-white/10">
            <div
              className="absolute inset-y-0 left-0 bg-sunset"
              style={{ width: `${(activePosition / LAST) * 100}%` }}
            />
          </div>
          <span className="min-w-16 text-right font-mono text-[10px] tracking-widest text-sunset">
            DAY 0{activeDay + 1} / 0{DAYS.length}
          </span>
        </div>

        <div className="schedule-panels relative z-10 flex min-h-0 w-full flex-1 overflow-hidden">
          <div
            className="schedule-panels-track flex h-full shrink-0 will-change-transform"
            style={{
              width: `${DAYS.length * 100}%`,
              transform: `translate3d(-${(activePosition / DAYS.length) * 100}%, 0, 0)`,
            }}
          >
            {DAYS.map((day, index) => {
              const dayProgress = clamp(1 - Math.abs(activePosition - index));
              const events = SCHEDULE_DATA.filter((event) => event.day === day.day);

              return (
                <article
                  key={day.day}
                  aria-label={`${day.title}, ${day.date}`}
                  className="schedule-day-panel h-full shrink-0 overflow-y-auto overscroll-auto px-4 pb-24 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-8 sm:pb-16 sm:pt-6 lg:px-12"
                  style={{ width: `${100 / DAYS.length}%` }}
                >
                  <div className="mx-auto w-full max-w-5xl">
                    <div
                      className={`mb-3 transition-all duration-500 sm:mb-6 ${
                        dayProgress > 0.15 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      }`}
                    >
                      <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-sunset sm:text-xs sm:tracking-[0.25em]">
                        DAY 0{day.day} <span className="text-silver-500">/</span> {day.date}
                        <span className="ml-2 text-silver-400 sm:ml-3">{day.hours}</span>
                      </p>
                      <h3 className="mt-1 font-display text-3xl font-extrabold leading-none text-white sm:text-7xl">
                        {day.title}
                      </h3>
                    </div>

                    <div className="schedule-event-list space-y-1.5 sm:space-y-2.5">
                      {events.map((event, eventIndex) => {
                        const revealAt = ((eventIndex + 1) / events.length) * 0.6;
                        const visible = dayProgress >= revealAt;

                        return (
                          <div
                            key={event.id}
                            className={`flex flex-col gap-1 border border-white/15 bg-[#171717]/65 px-3 py-2 shadow-[0_10px_35px_rgba(0,0,0,0.24)] backdrop-blur-md transition-all duration-500 sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-3 ${
                              visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                            }`}
                          >
                            {/* Mobile: time on the left, venue on the right of one compact row */}
                            <div className="flex items-center justify-between gap-2 sm:w-44 sm:shrink-0 sm:justify-start">
                              <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-sunset sm:text-sm">
                                <Clock className="h-3.5 w-3.5" />
                                {event.time}
                              </span>
                              <span className="hidden border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-silver-400 md:inline">
                                {event.category}
                              </span>
                              <span className="flex min-w-0 items-center gap-1 font-mono text-[10px] text-silver-300 sm:hidden">
                                <MapPin className="h-3 w-3 shrink-0 text-sunset" />
                                <span className="truncate">{event.venue}</span>
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="font-display text-sm font-bold leading-snug text-white sm:text-base">
                                {event.title}
                              </h4>
                              {event.speakerOrHost && (
                                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-amber sm:text-xs">
                                  <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                  {event.speakerOrHost}
                                </p>
                              )}
                            </div>

                            <div className="hidden items-center gap-1.5 font-mono text-xs text-silver-300 sm:flex sm:w-48 sm:justify-end">
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-sunset" />
                              <span className="truncate">{event.venue}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-[#050607] via-[#0d0e11]/85 to-transparent sm:h-52" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-[#050607] via-[#0d0e11]/85 to-transparent sm:h-52" />
    </section>
  );
};

// import React, { useEffect, useState } from "react";
// import { SCHEDULE_DATA } from "../data/festivalData";
// import { Clock, MapPin, User, ChevronDown } from "lucide-react";
// import { useSectionScrollFade } from "../hooks/useSectionScrollFade";

// const DAYS = [
//   { day: 1 as const, date: "27 OCTOBER", title: "TECHNICAL DAY 01", hours: "10 AM — 4 PM" },
//   { day: 2 as const, date: "28 OCTOBER", title: "TECHNICAL DAY 02", hours: "10 AM — 4 PM" },
//   { day: 3 as const, date: "29 OCTOBER", title: "CULTURAL DAY", hours: "3 PM — 8 PM" },
//   { day: 4 as const, date: "30 OCTOBER", title: "GRAND ARTIST NIGHT", hours: "5 PM ONWARDS" },
// ];

// const clamp = (value: number) => Math.min(1, Math.max(0, value));

// export const ScheduleSection: React.FC = () => {
//   const { sectionRef, isVisible } = useSectionScrollFade();
//   const [progress, setProgress] = useState(0);
//   const activePosition = progress * (DAYS.length - 1);
//   const activeDay = Math.min(DAYS.length - 1, Math.round(activePosition));

//   useEffect(() => {
//     const section = sectionRef.current;
//     if (!section) return;

//     const scrollDistance = section.offsetHeight - window.innerHeight;
//     const activationStart = Math.max(0, -section.getBoundingClientRect().top);

//     const updateProgress = () => {
//       const scrolled = Math.max(0, -section.getBoundingClientRect().top);
//       const remainingDistance = scrollDistance - activationStart;
//       setProgress(
//         remainingDistance > 0
//           ? clamp((scrolled - activationStart) / remainingDistance)
//           : 1,
//       );
//     };

//     updateProgress();
//     window.addEventListener("scroll", updateProgress, { passive: true });
//     window.addEventListener("resize", updateProgress);

//     return () => {
//       window.removeEventListener("scroll", updateProgress);
//       window.removeEventListener("resize", updateProgress);
//     };
//   }, []);

//   useEffect(() => {
//     const section = sectionRef.current;
//     if (!section || !isVisible) return;

//     const audio = new Audio("/assets/schedule-swipe.mp3");
//     audio.preload = "auto";

//     let wheelEndTimer = 0;
//     let wheelGestureActive = false;
//     let touchStartY: number | null = null;

//     const playSwipeSound = () => {
//       audio.currentTime = 0;
//       void audio.play().catch(() => {
//         // Browsers may block playback until a user gesture is registered.
//       });
//     };

//     const onWheel = (event: WheelEvent) => {
//       if (event.deltaY === 0) return;
//       if (!wheelGestureActive) {
//         wheelGestureActive = true;
//         playSwipeSound();
//       }
//       window.clearTimeout(wheelEndTimer);
//       wheelEndTimer = window.setTimeout(() => {
//         wheelGestureActive = false;
//       }, 350);
//     };

//     const onTouchStart = (event: TouchEvent) => {
//       touchStartY = event.touches[0]?.clientY ?? null;
//     };

//     const onTouchEnd = (event: TouchEvent) => {
//       const endY = event.changedTouches[0]?.clientY;
//       if (touchStartY !== null && endY !== undefined && Math.abs(touchStartY - endY) > 24) {
//         playSwipeSound();
//       }
//       touchStartY = null;
//     };

//     window.addEventListener("wheel", onWheel, { passive: true });
//     window.addEventListener("touchstart", onTouchStart, { passive: true });
//     window.addEventListener("touchend", onTouchEnd, { passive: true });

//     return () => {
//       window.clearTimeout(wheelEndTimer);
//       window.removeEventListener("wheel", onWheel);
//       window.removeEventListener("touchstart", onTouchStart);
//       window.removeEventListener("touchend", onTouchEnd);
//       audio.pause();
//     };
//   }, [isVisible]);

//   return (
//     <section
//       id="schedule"
//       ref={sectionRef}
//       className="relative bg-[#0d0e11]"
//       style={{ height: `${DAYS.length * 100}svh` }}
//     >
//       <div className={`section-scroll-fade sticky top-0 flex h-[100svh] flex-col overflow-hidden ${isVisible ? "is-visible" : ""}`}>
//         <video
//           aria-hidden="true"
//           autoPlay
//           muted
//           loop
//           playsInline
//           preload="metadata"
//           className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
//         >
//           <source src="/assets/event-schedule-background.mp4" type="video/mp4" />
//         </video>
//         <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0d0e11]/78 via-[#0d0e11]/72 to-[#0d0e11]/82" />
//         <div className="pointer-events-none absolute inset-0 bg-grain opacity-25" />

//         <header className="relative z-10 mx-auto flex w-full max-w-7xl items-end justify-between gap-6 px-4 pb-4 pt-28 sm:px-6 sm:pb-6 sm:pt-32 lg:px-8">
//           <div>
//             <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
//               EVENT <span className="text-sunset">SCHEDULE</span>.
//             </h2>
//           </div>
//           <div className="hidden shrink-0 items-center gap-2 pb-1 font-mono text-[10px] uppercase tracking-widest text-silver-400 sm:flex">
//             <ChevronDown className="h-4 w-4 animate-bounce text-sunset" />
//             Keep scrolling
//           </div>
//         </header>

//         <div className="relative z-10 mx-auto mb-3 flex w-full max-w-7xl items-center gap-3 px-4 sm:mb-5 sm:px-6 lg:px-8">
//           <div className="relative h-px flex-1 bg-white/10">
//             <div className="absolute inset-y-0 left-0 bg-sunset" style={{ width: `${progress * 100}%` }} />
//           </div>
//           <span className="min-w-16 text-right font-mono text-[10px] tracking-widest text-sunset">
//             DAY 0{activeDay + 1} / 0{DAYS.length}
//           </span>
//         </div>

//         <div className="schedule-panels relative z-10 flex min-h-0 w-full flex-1 items-center">
//           <div
//             className="schedule-panels-track flex h-full will-change-transform"
//             style={{ transform: `translate3d(-${progress * (DAYS.length - 1) * 25}%, 0, 0)` }}
//           >
//             {DAYS.map((day, index) => {
//               const dayProgress = clamp(1 - Math.abs(activePosition - index));
//               const events = SCHEDULE_DATA.filter((event) => event.day === day.day);

//               return (
//                 <article
//                   key={day.day}
//                   aria-label={`${day.title}, ${day.date}`}
//                   className="schedule-day-panel flex h-full shrink-0 flex-col justify-start px-4 pt-4 sm:px-8 sm:pt-6 lg:px-12"
//                 >
//                   <div className="mx-auto w-full max-w-5xl">
//                     <div
//                       className={`mb-4 transition-all duration-500 sm:mb-6 ${
//                         dayProgress > 0.15 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
//                       }`}
//                     >
//                       <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-sunset sm:text-xs">
//                         DAY 0{day.day} <span className="text-silver-500">/</span> {day.date}
//                         <span className="ml-3 text-silver-400">{day.hours}</span>
//                       </p>
//                       <h3 className="mt-1 font-display text-5xl font-extrabold text-white sm:text-7xl">
//                         {day.title}
//                       </h3>
//                     </div>

//                     <div className="schedule-event-list space-y-2 sm:space-y-2.5">
//                       {events.map((event, eventIndex) => {
//                         const revealAt = ((eventIndex + 1) / events.length) * 0.72;
//                         const visible = dayProgress >= revealAt;

//                         return (
//                           <div
//                             key={event.id}
//                             className={`flex flex-col gap-2 border border-white/15 bg-[#171717]/55 px-3 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.24)] backdrop-blur-md transition-all duration-500 sm:flex-row sm:items-center sm:gap-4 sm:px-4 ${
//                               visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
//                             }`}
//                           >
//                             <div className="flex shrink-0 items-center gap-2 sm:w-44">
//                               <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-sunset sm:text-sm">
//                                 <Clock className="h-3.5 w-3.5" />
//                                 {event.time}
//                               </span>
//                               <span className="hidden border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-silver-400 md:inline">
//                                 {event.category}
//                               </span>
//                             </div>

//                             <div className="min-w-0 flex-1">
//                                 <h4 className="font-display text-sm font-bold text-white sm:text-base">
//                                 {event.title}
//                               </h4>
//                               {event.speakerOrHost && (
//                                 <p className="mt-0.5 flex items-center gap-1 text-xs text-amber">
//                                   <User className="h-3.5 w-3.5" />
//                                   {event.speakerOrHost}
//                                 </p>
//                               )}
//                             </div>

//                             <div className="flex items-center gap-1.5 font-mono text-[11px] text-silver-300 sm:w-48 sm:justify-end sm:text-xs">
//                               <MapPin className="h-3.5 w-3.5 shrink-0 text-sunset" />
//                               <span className="truncate">{event.venue}</span>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </article>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//       <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-52 bg-gradient-to-b from-[#050607] via-[#0d0e11]/85 to-transparent" />
//       <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-52 bg-gradient-to-t from-[#050607] via-[#0d0e11]/85 to-transparent" />
//     </section>
//   );
// };
