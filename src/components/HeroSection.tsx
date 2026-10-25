import React, { useEffect, useState } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { soundFx } from "../utils/audio";
import { HalftoneWordmarkFooter } from "./ui/halftone-wordmark-footer";
import { useSectionScrollFade } from "../hooks/useSectionScrollFade";

interface HeroSectionProps {
  onOpenRegister: () => void;
}

const FEST_START = new Date("2026-10-27T09:00:00+05:30").getTime();

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenRegister }) => {
  const { sectionRef, isVisible } = useSectionScrollFade();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const difference = Math.max(0, FEST_START - Date.now());
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const countdownUnits = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINS", value: timeLeft.minutes },
    { label: "SECS", value: timeLeft.seconds },
  ];

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#0d0e11] px-4 pb-12 pt-32 sm:px-6 sm:pb-16 sm:pt-36"
    >
      {/* Background Image - natural brightness so it remains clearly visible */}
      <img
        src="/assets/avesh-campus-hero.webp"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center select-none"
      />

      {/* 70% dark shade overlay */}
      <div
        aria-hidden="true"
        className="hero-dark-shade pointer-events-none absolute inset-0 opacity-50"
      />

      {/* Soft Bottom Transition */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0d0e11] to-transparent opacity-40"
      />

      <div
        className={`hero-wordmark-position section-scroll-fade absolute inset-x-0 z-10 pl-10 pr-4 ${
          isVisible ? "is-visible" : ""
        }`}
      >
        <HalftoneWordmarkFooter />
      </div>

      <div className={`section-scroll-fade relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center text-center ${isVisible ? "is-visible" : ""}`}>
        {/* Semi-transparent Glass Scrim for Festival Dates & Countdown */}
        <div className="mt-8 flex w-full max-w-7xl flex-col items-center justify-center gap-4 sm:mt-10 lg:flex-row lg:gap-8">
          <div className="relative w-full max-w-xl overflow-hidden rounded-sm border border-white/10 bg-[#08090b]/40 px-5 py-5 backdrop-blur-sm shadow-[0_12px_32px_rgba(0,0,0,0.5)] sm:px-8 sm:py-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-black/25"
            />
            <div className="relative z-10">
              <p className="mb-4 flex items-center justify-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-sunset sm:text-xs">
                <Calendar className="h-3.5 w-3.5" />
                27 — 30 October 2026
              </p>
              <div className="grid grid-cols-4 gap-2 sm:gap-6">
                {countdownUnits.map(({ label, value }) => (
                  <div key={label}>
                    <span className="block font-mono text-2xl font-bold tabular-nums text-white sm:text-3xl">
                      {String(value).padStart(2, "0")}
                    </span>
                    <span className="mt-1 block font-mono text-[9px] tracking-[0.2em] text-silver-500">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="hero-countdown-caption text-white">to begin</p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            onOpenRegister();
          }}
          className="hero-register-button mt-8 inline-flex items-center gap-3 rounded-sm bg-sunset px-7 py-3.5 font-mono text-xs font-bold tracking-[0.2em] text-white sm:mt-10"
        >
          REGISTER NOW
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};
