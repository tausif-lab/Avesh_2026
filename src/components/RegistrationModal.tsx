import React, { useState } from "react";
import { TechEvent } from "../types";
import { EVENTS_DATA } from "../data/festivalData";
import { soundFx } from "../utils/audio";
import confetti from "canvas-confetti";
import { X, CheckCircle, Download, ShieldCheck, QrCode } from "lucide-react";

interface RegistrationModalProps {
  initialEvent?: TechEvent | null;
  onClose: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ initialEvent, onClose }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    initialEvent ? initialEvent.id : EVENTS_DATA[0].id
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "CGIT Raipur",
    teamName: "",
    teamSize: "1",
  });
  const [submitted, setSubmitted] = useState(false);
  const [passId, setPassId] = useState("");

  const selectedEvent = EVENTS_DATA.find((e) => e.id === selectedEventId) || EVENTS_DATA[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    const generatedId = `AVESH-${Math.floor(100000 + Math.random() * 900000)}`;
    setPassId(generatedId);
    setSubmitted(true);
    soundFx.playSuccess();

    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF642E", "#FFA843", "#ffffff", "#D8DCE3"],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-[#171717] rounded-sm border border-sunset/50 shadow-2xl overflow-hidden clip-diagonal-card max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#1f2229] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sunset animate-ping" />
            <span className="font-mono text-xs tracking-widest text-white uppercase font-bold">
              AVESH 2026 // DELEGATE REGISTRATION
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

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-silver-400 mb-1">
                  Selected Event / Arena *
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0e1014] border border-white/10 rounded-sm text-white font-mono text-xs focus:border-sunset focus:outline-none transition-colors"
                >
                  <option value="general-pass">ALL-ACCESS STUDENT DELEGATE PASS (All Expo & Keynotes)</option>
                  {EVENTS_DATA.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} — {ev.categoryLabel} ({ev.prizePool} Prize)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-silver-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0e1014] border border-white/10 rounded-sm text-white font-sans text-sm focus:border-sunset focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-silver-400 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0e1014] border border-white/10 rounded-sm text-white font-sans text-sm focus:border-sunset focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-silver-400 mb-1">
                  Institutional Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@cgitraipur.edu.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#0e1014] border border-white/10 rounded-sm text-white font-sans text-sm focus:border-sunset focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-silver-400 mb-1">
                  College / University *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CGIT Raipur (Chhattisgarh Institute of Technology)"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#0e1014] border border-white/10 rounded-sm text-white font-sans text-sm focus:border-sunset focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-silver-400 mb-1">
                    Team Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CyberVanguard"
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0e1014] border border-white/10 rounded-sm text-white font-sans text-sm focus:border-sunset focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-silver-400 mb-1">
                    Team Members Count
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0e1014] border border-white/10 rounded-sm text-white font-mono text-xs focus:border-sunset focus:outline-none"
                  >
                    <option value="1">1 Member (Solo)</option>
                    <option value="2">2 Members</option>
                    <option value="3">3 Members</option>
                    <option value="4">4 Members</option>
                    <option value="5">5+ Members</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-xs text-silver-400">
                  Fee: <strong className="text-sunset">{selectedEvent?.entryFee || "FREE"}</strong>
                </span>

                <button
                  type="submit"
                  className="px-7 py-3 bg-sunset hover:bg-sunset-hover text-white font-mono text-xs font-bold tracking-[0.2em] rounded-sm clip-diagonal-btn shadow-lg transition-all flex items-center gap-2"
                >
                  <span>COMPLETE REGISTRATION</span>
                </button>
              </div>
            </form>
          ) : (
            /* Digital Delegate Pass Generated on Success */
            <div className="text-center py-4 space-y-6">
              <div className="inline-flex p-3 rounded-full bg-sunset/15 border border-sunset/40 text-sunset mb-2">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-display font-black text-3xl text-white">
                  REGISTRATION CONFIRMED!
                </h3>
                <p className="font-mono text-xs text-sunset tracking-wider mt-1">
                  OFFICIAL DELEGATE PASS GENERATED
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="p-6 bg-[#0e1014] rounded-sm border border-sunset/40 text-left space-y-4 clip-diagonal-card shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-sunset/20 to-transparent pointer-events-none" />
                
                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <div>
                    <span className="font-display font-black text-2xl text-white tracking-wider">
                      AVESH<span className="text-sunset">2026</span>
                    </span>
                    <span className="block font-mono text-[10px] text-silver-400 uppercase tracking-widest">
                      CGIT RAIPUR • TECH FEST
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-[10px] text-silver-500 uppercase block">PASS ID</span>
                    <span className="font-mono font-bold text-xs text-sunset">{passId}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-silver-500 uppercase block">DELEGATE</span>
                    <span className="font-bold text-white text-sm">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-silver-500 uppercase block">COLLEGE</span>
                    <span className="font-bold text-white text-xs truncate block">{formData.college}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-silver-500 uppercase block">REGISTERED ARENA</span>
                    <span className="font-bold text-sunset text-xs truncate block">{selectedEvent.title}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-silver-500 uppercase block">DATES & VENUE</span>
                    <span className="font-bold text-white text-xs block">27/10/26 – 30/10/26 • CGIT RAIPUR</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-silver-400 font-mono text-[11px]">
                    <QrCode className="w-8 h-8 text-sunset" />
                    <span>SCAN AT CAMPUS GATE ALPHA</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase bg-sunset/20 text-sunset border border-sunset/30 rounded">
                    VERIFIED
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    window.print();
                  }}
                  className="px-5 py-2.5 rounded-sm bg-white/5 hover:bg-white/10 text-silver-300 font-mono text-xs tracking-wider transition-all flex items-center gap-1.5 border border-white/10"
                >
                  <Download className="w-3.5 h-3.5 text-sunset" />
                  <span>PRINT / SAVE PASS</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-sm bg-sunset hover:bg-sunset-hover text-white font-mono text-xs font-bold tracking-wider clip-diagonal-btn"
                >
                  DONE
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
