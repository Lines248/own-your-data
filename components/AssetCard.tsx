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

  const auraColors = ["#6C63FF", "#9B5DE5", "#00E5FF", "#FF6EC7"];
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
      whileHover={{
        scale: 1.05,
        boxShadow: `0 0 25px ${aura}`,
      }}
    >
      {/* Inner rotating wrapper */}
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-full w-full rounded-2xl"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/70 
                     backdrop-blur-md p-4 shadow-lg ring-1 ring-white/10"
          style={{ backfaceVisibility: "hidden" }}
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
            className={`mt-3 rounded-full px-4 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all
              ${
                claimed
                  ? "bg-gradient-to-r from-indigo-500 to-pink-400 text-white shadow-[0_0_15px_rgba(108,99,255,0.4)]"
                  : "bg-indigo-500 hover:bg-indigo-400 text-white"
              }`}
          >
            {claimed ? "Yours ✓" : "Make It Mine"}
          </button>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-indigo-600 text-white"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <p className="text-sm opacity-80">Metadata</p>
          <p className="text-xs mt-1">Powered by Dapper Flow</p>
          <p className="text-xs">Token ID #{asset.id}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}