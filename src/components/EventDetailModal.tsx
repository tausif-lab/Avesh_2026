import React from "react";
import { TechEvent } from "../types";
import { soundFx } from "../utils/audio";
import { X, Trophy, Users, Clock, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

interface EventDetailModalProps {
  event: TechEvent | null;
  onClose: () => void;
  onRegister: (event: TechEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose, onRegister }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#171717] rounded-sm border border-sunset/40 shadow-2xl overflow-hidden clip-diagonal-card max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="p-5 sm:p-6 bg-[#1f2229] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase bg-sunset/20 text-sunset border border-sunset/40 rounded">
              {event.categoryLabel}
            </span>
            <span className="font-mono text-xs text-silver-400">
              // {event.day}
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

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          <div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
              {event.title}
            </h3>
            <p className="font-mono text-xs sm:text-sm text-amber mt-1 tracking-wide">
              {event.tagline}
            </p>
            <p className="font-sans text-xs sm:text-sm text-silver-300 mt-3 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-sm bg-[#0e1014] border border-white/5 font-mono text-xs">
            <div>
              <span className="text-[10px] text-silver-500 uppercase block">PRIZE POOL</span>
              <span className="font-bold text-white text-sm text-sunset">{event.prizePool}</span>
            </div>
            <div>
              <span className="text-[10px] text-silver-500 uppercase block">TEAM SIZE</span>
              <span className="font-bold text-white text-sm">{event.teamSize}</span>
            </div>
            <div>
              <span className="text-[10px] text-silver-500 uppercase block">ENTRY FEE</span>
              <span className="font-bold text-white text-sm">{event.entryFee}</span>
            </div>
            <div>
              <span className="text-[10px] text-silver-500 uppercase block">VENUE</span>
              <span className="font-bold text-white text-xs truncate block">{event.venue}</span>
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h4 className="font-mono text-xs font-bold tracking-widest text-white uppercase mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sunset" />
              EVENT HIGHLIGHTS & PERKS
            </h4>
            <ul className="space-y-2 font-sans text-xs sm:text-sm text-silver-400">
              {event.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-sunset mt-1">•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Rules */}
          <div>
            <h4 className="font-mono text-xs font-bold tracking-widest text-white uppercase mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber" />
              RULES & REGULATIONS
            </h4>
            <ul className="space-y-2 font-sans text-xs sm:text-sm text-silver-400 bg-white/5 p-4 rounded-sm border border-white/5">
              {event.rules.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber font-mono text-xs mt-0.5">{i + 1}.</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#121418] border-t border-white/10 flex items-center justify-between gap-4">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-sm bg-white/5 hover:bg-white/10 text-silver-300 font-mono text-xs tracking-wider transition-all"
          >
            CLOSE
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onRegister(event);
            }}
            className="px-6 py-2.5 rounded-sm bg-sunset hover:bg-sunset-hover text-white font-mono text-xs font-bold tracking-widest clip-diagonal-btn shadow-md transition-all flex items-center gap-2"
          >
            <span>REGISTER FOR THIS EVENT</span>
          </button>
        </div>

      </div>
    </div>
  );
};
