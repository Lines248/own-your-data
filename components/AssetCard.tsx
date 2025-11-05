"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Asset {
  id: number;
  title: string;
  img: string;
}

export default function AssetCard({
  asset,
  setThemeSignal,
}: {
  asset: Asset;
  setThemeSignal: (color: string) => void;
}) {
  const [claimed, setClaimed] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const auraColors = [
    "var(--signal-cyan)",
    "var(--signal-violet)",
    "var(--signal-pink)",
    "var(--signal-gold)",
  ];
  const aura = auraColors[asset.id % auraColors.length];

  return (
    <motion.div
      className="relative h-72 w-full cursor-pointer rounded-2xl"
      style={{ perspective: 1000 }}
      onClick={() => setFlipped(!flipped)}
      whileHover={{
        scale: 1.03,
        rotateX: 2,
        rotateY: -2,
        boxShadow: `0 0 45px ${aura}`,
      }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
    >
      {/* INNER WRAPPER: handles flipping */}
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-full w-full rounded-2xl"
        style={{
          transformStyle: "preserve-3d",
          borderRadius: "1rem",
        }}
      >
        {/* FRONT FACE */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl overflow-hidden 
                     border border-white/10 backdrop-blur-md bg-gradient-to-br from-slate-900/60 to-slate-800/20"
          style={{
            backfaceVisibility: "hidden",
            borderRadius: "1rem",
          }}
        >
          {/* Blended image background */}
          <img
            src={asset.img}
            alt={asset.title}
            className="absolute inset-0 h-full w-full object-cover opacity-70 mix-blend-overlay"
          />

          {/* Ownership initials badge */}
          {claimed && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-3 right-3 bg-white/10 rounded-full px-2 py-1 text-xs backdrop-blur-md text-white/90"
            >
              LS
            </motion.div>
          )}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
            <h3 className="font-semibold text-lg tracking-wide">{asset.title}</h3>
         <button
            onClick={(e) => {
            e.stopPropagation();
           setClaimed(true);
           setThemeSignal(aura);
            }}
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
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[var(--signal-violet)] text-white"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            borderRadius: "1rem",
          }}
        >
          <p className="text-sm opacity-80">Signal verified on Flow</p>
          <p className="text-xs mt-1">Owner: Inline Access Studio</p>
          <p className="text-xs">Signal ID #{asset.id}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}