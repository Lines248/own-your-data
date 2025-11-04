"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import AssetCard from "@/components/AssetCard";

export default function Home() {
  const assets = [
    { id: 1, title: "Echo Fragment", img: "/signal1.png" },
    { id: 2, title: "Neural Bloom", img: "/signal2.png" },
    { id: 3, title: "Spectral Field", img: "/signal3.png" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.2 },
    },
  };

  return (
    <main className="min-h-screen text-white bg-gradient-to-br from-[#0a0a0f] via-[#12122b] to-[#1b0035]">
      <Header />
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 p-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </motion.section>
    </main>
  );
}