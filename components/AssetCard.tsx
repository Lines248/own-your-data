"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface Asset {
  id: number;
  title: string;
  img: string;
}

interface AssetCardProps {
  asset: Asset;
  setThemeSignal: (color: string) => void;
  createOscillator: (freq: number) => { osc: OscillatorNode; gain: GainNode };
}

export default function AssetCard({
  asset,
  setThemeSignal,
  createOscillator,
}: AssetCardProps) {
  const [claimed, setClaimed] = useState(false);
  const [muted, setMuted] = useState(false);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const auraColors = [
    "var(--signal-cyan)",
    "var(--signal-violet)",
    "var(--signal-pink)",
    "var(--signal-gold)",
  ];
  const aura = auraColors[asset.id % auraColors.length];

  // stop sound when unmounting
  useEffect(() => {
    return () => {
      if (oscRef.current) oscRef.current.stop();
    };
  }, []);

  const handleTuneIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!claimed) {
      setClaimed(true);
      setThemeSignal(aura);
      const { osc, gain } = createOscillator(220 + asset.id * 60);
      oscRef.current = osc;
      gainRef.current = gain;
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gainRef.current) {
      gainRef.current.gain.value = muted ? 0.05 : 0;
      setMuted(!muted);
    }
  };

  return (
    <motion.div
      className="relative h-72 w-full cursor-pointer rounded-2xl"
      style={{ perspective: "1000px" }}
  variants={{
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } // soft “spring-ease” curve
    }
  }}
  whileHover={{
    scale: 1.03,
    rotateX: 2,
    rotateY: -2,
    boxShadow: `0 0 45px ${aura}`,
  }}
  transition={{ type: "spring", stiffness: 120, damping: 14 }}
>
      {/* FRONT FACE */}
<div className="relative w-full h-full flex flex-col items-center justify-center rounded-2xl overflow-hidden border border-white/10 backdrop-blur-md bg-gradient-to-br from-slate-900/60 to-slate-800/20">
  <img
    src={asset.img}
    alt={asset.title}
    className="absolute inset-0 h-full w-full object-cover opacity-70 mix-blend-overlay"
  />

        {claimed && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-3 right-3 bg-white/10 rounded-full px-2 py-1 text-xs backdrop-blur-md text-white/90"
          >
            LS
          </motion.div>
        )}

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <h3 className="font-semibold text-lg tracking-wide">{asset.title}</h3>
          <button
            onClick={handleTuneIn}
            aria-pressed={claimed}
            className={`mt-3 rounded-full px-4 py-1 text-sm font-medium transition-all duration-300
              ${
                claimed
                  ? "bg-gradient-to-r from-[var(--signal-violet)] to-[var(--signal-pink)] text-white shadow-[0_0_12px_rgba(255,92,186,0.6)]"
                  : "bg-[var(--signal-cyan)] text-slate-900 hover:shadow-[0_0_15px_rgba(0,255,240,0.6)] hover:scale-105 hover:-translate-y-[1px]"
              }`}
          >
            {claimed ? "Live ✓" : "Tune In"}
          </button>

          {claimed && (
            <button
              onClick={toggleMute}
              className="mt-2 text-xs text-white/70 hover:text-white transition"
            >
              {muted ? "Unmute" : "Mute"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}