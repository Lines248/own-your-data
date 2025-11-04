"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Asset {
  id: number;
  title: string;
  img: string;
}

export default function AssetCard({ asset }: { asset: Asset }) {
  const [claimed, setClaimed] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const auraColors = [
    "var(--signal-cyan)",
    "var(--signal-violet)",
    "var(--signal-pink)",
    "var(--signal-gold)",
  ];
  const aura = auraColors[asset.id % auraColors.length];

  const cardVariant: any = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={cardVariant}
      className="relative h-72 w-full cursor-pointer"
      style={{ perspective: 1000 }}
      onClick={() => setFlipped(!flipped)}
    >
      {/* OUTER GLOW WRAPPER */}
      <motion.div
        whileHover={{ 
          scale: 1.04,
          boxShadow: `0 0 45px 10px ${aura}`, 
        }}
        animate={flipped ? { rotateY: 180 } : { rotateY: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative h-full w-full rounded-2xl"
        style={{
          transformStyle: "preserve-3d",
          borderRadius: "1rem",
          boxShadow: flipped
            ? `0 0 45px 5px ${aura}`
            : `0 0 35px 2px ${aura}40`, // subtle transparency on hover
        }}
      >
        {/* FRONT FACE */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/70 
                     backdrop-blur-md p-4 shadow-inner ring-1 ring-white/10"
          style={{
            backfaceVisibility: "hidden",
            borderRadius: "1rem",
          }}
        >
          {claimed && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-3 right-3 bg-white/10 rounded-full px-2 py-1 text-xs backdrop-blur-md text-white/90"
            >
              LS
            </motion.div>
          )}

          <img
            src={asset.img}
            alt={asset.title}
            className="h-28 w-28 rounded-lg object-cover mb-2"
          />
          <h3 className="font-semibold tracking-wide">{asset.title}</h3>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setClaimed(true);
            }}
            aria-pressed={claimed}
            className={`mt-3 rounded-full px-4 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--signal-cyan)] transition-all
              ${
                claimed
                  ? "bg-gradient-to-r from-[var(--signal-violet)] to-[var(--signal-pink)] text-white shadow-[0_0_15px_rgba(255,92,186,0.4)]"
                  : "bg-[var(--signal-cyan)] hover:opacity-90 text-slate-900"
              }`}
          >
            {claimed ? "Live ✓" : "Tune In"}
          </button>
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