"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import type { SyntheticEvent, KeyboardEvent } from "react";

interface Asset {
  id: number;
  title: string;
  img: string;
}

interface AssetCardProps {
  asset: Asset;
  isClaimed: boolean;
  onClaim: () => void;
  setThemeSignal: (color: string) => void;
  createOscillator: (freq: number) => { osc: OscillatorNode; gain: GainNode };
}

export default function AssetCard({
  asset,
  isClaimed,
  onClaim,
  setThemeSignal,
  createOscillator,
}: AssetCardProps) {
  const [muted, setMuted] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const auraColors = [
    "var(--signal-cyan)",
    "var(--signal-violet)",
    "var(--signal-pink)",
    "var(--signal-gold)",
  ];
  const aura = auraColors[asset.id % auraColors.length];

  useEffect(() => {
    return () => {
      if (oscRef.current) oscRef.current.stop();
    };
  }, []);

  const handleTuneIn = (e: SyntheticEvent) => {
    e.stopPropagation();
    if (!isClaimed) {
      onClaim();
      setThemeSignal(aura);
      const { osc, gain } = createOscillator(220 + asset.id * 60);
      oscRef.current = osc;
      gainRef.current = gain;
    }
  };

  const toggleMute = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (gainRef.current) {
      gainRef.current.gain.value = muted ? 0.25 : 0;
      setMuted(!muted);
    }
  };

  // Respect reduced motion
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <motion.div
      className="relative h-72 w-full cursor-pointer rounded-2xl"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped((f) => !f)}
      whileHover={{
        scale: 1.03,
        rotateX: 2,
        rotateY: -2,
        boxShadow: `0 0 45px ${aura}`,
      }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
    >
      {/* Flipping wrapper */}
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6 }}
        className="relative h-full w-full rounded-2xl"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl overflow-hidden 
                     border border-white/10 backdrop-blur-md bg-gradient-to-br from-slate-900/60 to-slate-800/20"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute inset-0 z-0">
            <Image
              src={asset.img}
              alt={asset.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              quality={70}
              className="object-cover opacity-70 mix-blend-overlay"
            />
          </div>

          {isClaimed && (
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
              onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleTuneIn(e);
                }
              }}
              aria-pressed={isClaimed}
              className={`mt-3 rounded-full px-4 py-1 text-sm font-medium transition-all duration-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal-cyan)]
                ${
                  isClaimed
                    ? "bg-gradient-to-r from-[var(--signal-violet)] to-[var(--signal-pink)] text-white shadow-[0_0_12px_rgba(255,92,186,0.6)]"
                    : "bg-[var(--signal-cyan)] text-slate-900 hover:shadow-[0_0_15px_rgba(0,255,240,0.6)] hover:scale-105 hover:-translate-y-[1px]"
                }`}
            >
              {isClaimed ? "Live ✓" : "Tune In"}
            </button>

            {isClaimed && (
              <button
                onClick={toggleMute}
                className="mt-2 text-xs text-white/70 hover:text-white transition"
              >
                {muted ? "Unmute" : "Mute"}
              </button>
            )}
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[var(--signal-violet)] text-white"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <p className="text-sm opacity-80">Signal verified on Flow</p>
          <p className="text-xs mt-1">Owner: Inline Access Studio</p>
          <p className="text-xs">Signal ID #{asset.id}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}