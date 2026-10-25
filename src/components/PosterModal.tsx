import React from "react";
import { soundFx } from "../utils/audio";
import { X, CheckCircle2, Image as ImageIcon } from "lucide-react";

interface PosterModalProps {
  onClose: () => void;
}

export const PosterModal: React.FC<PosterModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-[#171717] rounded-sm border border-sunset/40 shadow-2xl overflow-hidden clip-diagonal-card max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#1f2229] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-sunset" />
            <span className="font-mono text-xs tracking-widest text-white uppercase font-bold">
              DESIGN INSPIRATION // REFERENCE POSTER BREAKDOWN
            </span>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-silver-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left: Poster Image Preview */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative rounded-sm border border-white/20 p-2 bg-[#0e1014] shadow-2xl max-w-[280px]">
                <img
                  src="/assets/reference-poster.jpg"
                  alt="Original Reference Poster Inspiration"
                  className="w-full h-auto rounded-sm object-contain"
                />
                <span className="block text-center font-mono text-[10px] text-silver-500 uppercase tracking-widest mt-2">
                  ATTACHED REFERENCE POSTER
                </span>
              </div>
            </div>

            {/* Right: Creative Translation Notes */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="font-mono text-xs text-sunset font-bold tracking-widest uppercase">
                  CREATIVE DIRECTION REINTERPRETATION
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
                  FROM STATIC POSTER TO CINEMATIC DIGITAL WORLD
                </h3>
              </div>

              <div className="space-y-3 font-sans text-xs sm:text-sm text-silver-300">
                <div className="p-3.5 bg-white/5 rounded-sm border border-white/5 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sunset shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-mono block mb-0.5">1. Sharp 45° Diagonal Slashes:</strong>
                    Faithfully preserved through CSS `clip-path` masks, creating an unmistakable geometric signature across all sections.
                  </div>
                </div>

                <div className="p-3.5 bg-white/5 rounded-sm border border-white/5 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sunset shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-mono block mb-0.5">2. Upper Monochrome City & 2x2 Grid Motif:</strong>
                    Hand-crafted SVG architectural high-rises against pale metallic dawn skies with the signature 4-square geometric badge.
                  </div>
                </div>

                <div className="p-3.5 bg-white/5 rounded-sm border border-white/5 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sunset shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-mono block mb-0.5">3. Glowing Sunset Orange Horizon:</strong>
                    Vivid gradient bands from vermilion (#FF642E) to amber (#FFA843), illuminated highways, and drifting digital ember particles.
                  </div>
                </div>

                <div className="p-3.5 bg-white/5 rounded-sm border border-white/5 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sunset shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-mono block mb-0.5">4. Integrated Typography & Motto:</strong>
                    Re-engineered as interactive vector letterforms: "THE", "M", "O", "RE", "YOU LEARN", and baseline "THE MORE YOU CAN" with multi-plane mouse parallax.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-[#121418] border-t border-white/10 flex justify-end">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-sm bg-sunset hover:bg-sunset-hover text-white font-mono text-xs font-bold tracking-widest clip-diagonal-btn"
          >
            RETURN TO EXPERIENCE
          </button>
        </div>

      </div>
    </div>
  );
};
