// app/page.tsx (minimal, keeps your gradient + alignment)
"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import AssetCard from "@/components/AssetCard";

export default function Home() {
  const [themeSignal, setThemeSignal] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  function ensureAudio() {
    if (!audioCtxRef.current) {
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)!();
      const gain = ctx.createGain();
      gain.gain.value = 0.05;
      gain.connect(ctx.destination);
      audioCtxRef.current = ctx;
      masterGainRef.current = gain;
    }
  }

  function createOscillator(freq: number) {
    ensureAudio();
    const ctx = audioCtxRef.current!;
    const cardGain = ctx.createGain();
    cardGain.gain.value = 0.05;
    cardGain.connect(masterGainRef.current!);
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(cardGain);
    osc.start();
    return { osc, gain: cardGain };
  }

  function toggleGlobalMute() {
    if (!masterGainRef.current) return;
    const ctx = audioCtxRef.current!;
    masterGainRef.current.gain.linearRampToValueAtTime(
      muted ? 0.05 : 0,
      ctx.currentTime + 0.25
    );
    setMuted(!muted);
  }

  const assets = [
    { id: 1, title: "Echo Fragment", img: "/signals/signal1.webp" },
    { id: 2, title: "Neural Bloom", img: "/signals/signal2.webp" },
    { id: 3, title: "Spectral Field", img: "/signals/signal3.webp" },
  ];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,     // cards appear one after another
      delayChildren: 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

  return (
    <main
      className="min-h-screen w-full text-white transition-all duration-700 overflow-auto"
      style={{
        background: themeSignal
          ? `radial-gradient(circle at center, ${themeSignal}40 0%, #0a0a0f 80%)`
          : "linear-gradient(135deg,#0a0a0f,#12122b,#1b0035)",
      }}
    >
      <Header />

      <div className="flex justify-end px-8 mt-4">
        <button
          onClick={toggleGlobalMute}
          className="rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur hover:bg-white/20 transition"
        >
          {muted ? "Unmute All" : "Mute All"}
        </button>
      </div>

<motion.section
  variants={container as any}
  initial="hidden"
  animate="show"
  className="grid gap-6 p-8 sm:grid-cols-2 lg:grid-cols-3"
>
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            setThemeSignal={setThemeSignal}
            createOscillator={createOscillator}
          />
        ))}
      </motion.section>

      {/* small spacer so the last row isn't flush to the edge */}
      <div className="h-24" />
    </main>
  );
}