"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import AssetCard from "@/components/AssetCard";

export default function Home() {
  const [themeSignal, setThemeSignal] = useState<string | null>(null);

  const assets = [
    { id: 1, title: "Echo Fragment", img: "/signals/signal1.png" },
    { id: 2, title: "Neural Bloom", img: "/signals/signal2.png" },
    { id: 3, title: "Spectral Field", img: "/signals/signal3.png" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.25, delayChildren: 0.2 } },
  };

  return (
    <main
      className="min-h-screen text-white transition-all duration-700"
      style={{
        background: themeSignal
          ? `radial-gradient(circle at center, ${themeSignal}40 0%, #0a0a0f 80%)`
          : "linear-gradient(135deg,#0a0a0f,#12122b,#1b0035)",
      }}
    >
      <Header />
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 p-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} setThemeSignal={setThemeSignal} />
        ))}
      </motion.section>
    </main>
  );
}