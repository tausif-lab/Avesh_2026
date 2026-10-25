import React, { useState, useEffect, useRef } from "react";
import { soundFx } from "../utils/audio";

export const DiagonalArtwork: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundFx.playHover();
  };

  // Parallax offsets
  const skyOffsetX = mousePos.x * 6;
  const skyOffsetY = mousePos.y * 6;
  const cityOffsetX = mousePos.x * 12;
  const cityOffsetY = mousePos.y * 10;
  const textOffsetX = mousePos.x * -16;
  const textOffsetY = mousePos.y * -14;

  return (
    <div className="relative w-full max-w-[540px] mx-auto select-none group">
      {/* Outer subtle glow */}
      <div 
        className={`absolute -inset-4 bg-gradient-to-tr from-sunset/20 via-sunset/5 to-transparent rounded-2xl blur-2xl transition-opacity duration-700 pointer-events-none ${
          isHovered ? "opacity-100" : "opacity-40"
        }`} 
      />

      {/* Main Poster Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative aspect-[3/4] w-full bg-[#171717] rounded-sm p-4 sm:p-7 shadow-2xl transition-all duration-700 ease-out border border-white/5 overflow-hidden ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{
          boxShadow: isHovered
            ? "0 25px 60px -15px rgba(255, 100, 46, 0.25), 0 0 40px rgba(0,0,0,0.8)"
            : "0 20px 50px -10px rgba(0,0,0,0.7)",
        }}
      >
        {/* Subtle noise and scanlines */}
        <div className="absolute inset-0 bg-grain opacity-60 pointer-events-none z-30" />
        <div className="absolute inset-0 scanlines opacity-20 pointer-events-none z-30" />

        {/* Top Header Label: THE */}
        <div className="relative z-20 flex justify-between items-center mb-3 sm:mb-4 px-1">
          <span 
            className="font-mono text-xs sm:text-sm font-bold tracking-[0.4em] text-silver-300 uppercase transition-transform duration-300"
            style={{ transform: `translate3d(${textOffsetX * 0.4}px, ${textOffsetY * 0.4}px, 0)` }}
          >
            T H E
          </span>
        </div>

        {/* Inner Canvas / Artwork Area */}
        <div className="relative w-full h-[85%] bg-[#0e1014] overflow-hidden rounded-sm border border-white/10">
          
          {/* ======================================================== */}
          {/* 1. TOP SECTION: SILVER MONOCHROME CITY & "M" */}
          {/* ======================================================== */}
          <div 
            className="absolute inset-0 z-10 clip-poster-top transition-transform duration-300 ease-out pointer-events-none"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 48%, 0 88%)",
            }}
          >
            {/* Pale Dawn Sky Gradient */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-[#e3e7ee] via-[#cbd2de] to-[#9aa3b2]"
              style={{
                transform: `translate3d(${skyOffsetX}px, ${skyOffsetY}px, 0)`,
              }}
            />

            {/* Architectural 2x2 Accent Grid in Upper Right */}
            <div className="absolute top-5 right-6 sm:top-7 sm:right-8 grid grid-cols-2 gap-2 sm:gap-2.5 z-20 opacity-85">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white shadow-sm" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white shadow-sm" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white shadow-sm" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white shadow-sm" />
            </div>

            {/* Monochrome High-Rise Skyline SVG */}
            <svg
              viewBox="0 0 500 500"
              className="absolute bottom-0 left-0 w-full h-full object-cover transition-transform duration-300"
              style={{
                transform: `translate3d(${cityOffsetX * 0.8}px, ${cityOffsetY * 0.8}px, 0)`,
              }}
              preserveAspectRatio="xMidYMax slice"
            >
              {/* Distant building silhouettes */}
              <path d="M40 220 H90 V500 H40 Z" fill="#717a88" />
              <path d="M80 180 H150 V500 H80 Z" fill="#58616f" />
              <path d="M140 140 H210 V500 H140 Z" fill="#444b56" />
              <path d="M200 170 H270 V500 H200 Z" fill="#2d333c" />
              <path d="M260 210 H340 V500 H260 Z" fill="#3a424e" />
              <path d="M330 150 H410 V500 H330 Z" fill="#20242b" />
              <path d="M400 230 H480 V500 H400 Z" fill="#2d333c" />

              {/* Antennae */}
              <line x1="175" y1="110" x2="175" y2="140" stroke="#222" strokeWidth="2.5" />
              <line x1="370" y1="120" x2="370" y2="150" stroke="#222" strokeWidth="2.5" />

              {/* Midground high-contrast towers with lit window grids */}
              <g fill="#17191d">
                <rect x="60" y="240" width="85" height="260" />
                <rect x="170" y="190" width="95" height="310" />
                <rect x="290" y="230" width="105" height="270" />
              </g>

              {/* Grid window patterns */}
              <g fill="#ffffff" opacity="0.65">
                {[205, 220, 235, 250, 265, 280, 295].map((y) => (
                  <g key={`win-a-${y}`}>
                    <rect x="185" y={y} width="5" height="7" />
                    <rect x="195" y={y} width="5" height="7" />
                    <rect x="205" y={y} width="5" height="7" />
                    <rect x="225" y={y} width="5" height="7" />
                    <rect x="235" y={y} width="5" height="7" />
                    <rect x="245" y={y} width="5" height="7" />
                  </g>
                ))}
                {[250, 265, 280, 295, 310].map((y) => (
                  <g key={`win-b-${y}`}>
                    <rect x="75" y={y} width="6" height="8" />
                    <rect x="85" y={y} width="6" height="8" />
                    <rect x="95" y={y} width="6" height="8" />
                    <rect x="110" y={y} width="6" height="8" />
                    <rect x="120" y={y} width="6" height="8" />
                  </g>
                ))}
              </g>

              {/* Foreground foliage & architectural road silhouettes */}
              <path
                d="M30 330 C60 310, 80 340, 110 320 C140 340, 160 320, 190 350 L200 500 L20 500 Z"
                fill="#0f1114"
              />
              <path
                d="M240 370 C280 340, 310 380, 360 350 C400 370, 440 340, 480 380 L480 500 L240 500 Z"
                fill="#0a0c0e"
              />
            </svg>

            {/* Oversized "M" in Upper Region */}
            <div 
              className="absolute top-4 left-6 sm:top-6 sm:left-9 z-30 transition-transform duration-300"
              style={{
                transform: `translate3d(${textOffsetX}px, ${textOffsetY}px, 0)`,
              }}
            >
              <span className="font-display font-black text-6xl sm:text-8xl tracking-tighter text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                M
              </span>
            </div>

            {/* White horizontal architectural bar across M */}
            <div className="absolute top-[85px] sm:top-[115px] left-6 sm:left-9 w-24 sm:w-32 h-[3px] bg-white z-30 shadow-md" />
          </div>

          {/* ======================================================== */}
          {/* 2. DIAGONAL SEAM & ILLUMINATED SLICE LINE */}
          {/* ======================================================== */}
          <div 
            className="absolute inset-0 pointer-events-none z-15"
            style={{
              background: `linear-gradient(135deg, transparent 46.5%, rgba(255,255,255,0.9) 47%, #FF642E 47.8%, transparent 48.5%)`,
            }}
          />

          {/* ======================================================== */}
          {/* 3. MIDDLE & LOWER SECTION: VIVID SUNSET ORANGE HORIZON */}
          {/* ======================================================== */}
          <div 
            className="absolute inset-0 z-0 transition-transform duration-300 ease-out"
            style={{
              clipPath: "polygon(0 86%, 100% 46%, 100% 100%, 0 100%)",
            }}
          >
            {/* Sunset Horizon Glowing Gradient */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-[#FFA843] via-[#FF642E] to-[#601905]"
              style={{
                transform: `translate3d(${skyOffsetX * 1.2}px, ${skyOffsetY * 1.2}px, 0)`,
              }}
            >
              {/* Atmospheric sunset cloud bands */}
              <div className="absolute top-[18%] left-0 right-0 h-10 bg-gradient-to-r from-transparent via-[#FF8C66]/50 to-transparent blur-sm" />
              <div className="absolute top-[32%] left-0 right-0 h-12 bg-gradient-to-r from-[#FF7B4D]/40 via-[#FF4500]/60 to-transparent blur-md" />
              <div className="absolute top-[52%] left-0 right-0 h-16 bg-[#3d0f04]/40 blur-lg" />
            </div>

            {/* Silhouetted Urban Metropolis in Sunset Band */}
            <svg
              viewBox="0 0 500 500"
              className="absolute bottom-0 left-0 w-full h-full object-cover transition-transform duration-300"
              style={{
                transform: `translate3d(${cityOffsetX}px, ${cityOffsetY}px, 0)`,
              }}
              preserveAspectRatio="xMidYMax slice"
            >
              {/* Back silhouettes */}
              <g fill="#4a180b">
                <rect x="250" y="220" width="60" height="280" />
                <rect x="330" y="240" width="70" height="260" />
                <rect x="420" y="260" width="50" height="240" />
              </g>

              {/* Mid modern towers with high-contrast architectural facades */}
              <g fill="#17191d">
                <rect x="260" y="270" width="75" height="230" />
                <rect x="310" y="295" width="85" height="205" />
                <polygon points="340,295 365,240 375,295" fill="#17191d" />
              </g>

              {/* Crisp silver vertical architectural slats & windows */}
              <g fill="#f2f4f8" opacity="0.85">
                {[285, 300, 315, 330, 345, 360, 375].map((y) => (
                  <g key={`sun-win-${y}`}>
                    <rect x="275" y={y} width="5" height="8" />
                    <rect x="285" y={y} width="5" height="8" />
                    <rect x="295" y={y} width="5" height="8" />
                    <rect x="305" y={y} width="5" height="8" />
                  </g>
                ))}
              </g>

              {/* Highway flyovers, curved ramps, urban foliage */}
              <path
                d="M210 390 Q270 340 380 430 L400 500 L180 500 Z"
                fill="#0d0e11"
              />
              <path
                d="M330 420 Q400 370 480 410 L480 500 L320 500 Z"
                fill="#08090b"
              />

              {/* Ambient street lights on highway */}
              <circle cx="280" cy="385" r="3" fill="#FFA843" filter="drop-shadow(0 0 4px #FF642E)" />
              <circle cx="320" cy="395" r="3" fill="#FFA843" filter="drop-shadow(0 0 4px #FF642E)" />
              <circle cx="360" cy="415" r="3" fill="#FFA843" filter="drop-shadow(0 0 4px #FF642E)" />
            </svg>

            {/* Glowing Sunset Embers / Particle Simulation */}
            <div className="absolute inset-0 pointer-events-none">
              <span className="absolute bottom-[20%] left-[30%] w-1.5 h-1.5 bg-[#FFD27D] rounded-full blur-[0.5px] animate-pulse" />
              <span className="absolute bottom-[40%] left-[55%] w-1 h-1 bg-[#FFA843] rounded-full blur-[0.5px] animate-pulse delay-300" />
              <span className="absolute bottom-[60%] left-[75%] w-1.5 h-1.5 bg-white rounded-full blur-[0.5px] animate-pulse delay-700" />
              <span className="absolute bottom-[30%] left-[85%] w-1 h-1 bg-[#FF642E] rounded-full blur-[0.5px] animate-pulse delay-500" />
            </div>
          </div>

          {/* ======================================================== */}
          {/* 4. OVERSIZED TYPOGRAPHY: "O" & "RE" & "YOU LEARN" */}
          {/* ======================================================== */}
          <div 
            className="absolute inset-0 z-20 pointer-events-none transition-transform duration-300"
            style={{
              transform: `translate3d(${textOffsetX}px, ${textOffsetY}px, 0)`,
            }}
          >
            {/* The "O" in Middle Diagonal Band */}
            <div className="absolute top-[42%] left-6 sm:left-9">
              <span className="font-display font-black text-6xl sm:text-8xl tracking-tighter text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                O
              </span>
            </div>

            {/* The "RE" in Lower Sunset Band */}
            <div className="absolute top-[63%] left-6 sm:left-9">
              <span className="font-display font-black text-6xl sm:text-8xl tracking-tighter text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                RE
              </span>
              
              {/* "YOU LEARN" directly beneath the RE letterforms */}
              <div className="mt-1 sm:mt-1.5">
                <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.45em] text-[#f2f4f8] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase">
                  YOU LEARN
                </span>
              </div>
            </div>
          </div>

          {/* Interactive cursor highlight sweep */}
          {isHovered && (
            <div 
              className="absolute w-32 h-32 rounded-full pointer-events-none z-25 bg-sunset/20 blur-xl mix-blend-screen transition-transform duration-100 ease-out"
              style={{
                left: `${(mousePos.x + 0.5) * 100}%`,
                top: `${(mousePos.y + 0.5) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </div>

        {/* ======================================================== */}
        {/* 5. BOTTOM BASELINE MOTTO: "THE MORE YOU CAN" */}
        {/* ======================================================== */}
        <div className="relative z-20 text-center mt-3 sm:mt-4">
          <p 
            className="font-mono text-xs sm:text-sm font-bold tracking-[0.38em] sm:tracking-[0.45em] text-silver-300 uppercase transition-transform duration-300"
            style={{
              transform: `translate3d(${textOffsetX * 0.3}px, ${textOffsetY * 0.3}px, 0)`,
            }}
          >
            THE MORE YOU CAN
          </p>
        </div>

        {/* Diagonal cut corner indicators (tech markings) */}
        <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-white/20" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-white/20" />
        <div className="absolute top-2 left-2 w-2 h-2 border-l border-t border-white/20" />
        <div className="absolute top-2 right-2 w-2 h-2 border-r border-t border-white/20" />
      </div>

      {/* Interactive Hint Pill below artwork */}
      <div className="mt-3 text-center">
        <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-wider text-silver-500 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-sunset animate-ping" />
          Interactive 3D Layer Parallax // Move Cursor
        </span>
      </div>
    </div>
  );
};
