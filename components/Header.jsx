"use client";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="p-10 text-center"
    >
     <h1
  className="relative text-5xl md:text-6xl font-extrabold leading-tight text-center tracking-tight
             text-transparent bg-clip-text 
             bg-gradient-to-r from-[var(--signal-violet)] via-[var(--signal-pink)] to-[var(--signal-cyan)]
             drop-shadow-[0_2px_6px_rgba(255,255,255,0.2)]"
  style={{
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: `
      0 0 15px rgba(255, 92, 186, 0.5),
      0 0 25px rgba(0, 255, 240, 0.25)
    `,
  }}
>
  Claim Your Signal
</h1>
    <motion.div
     className="absolute inset-x-0 -bottom-1 mx-auto h-px w-2/3 bg-gradient-to-r 
        from-transparent via-[var(--signal-pink)] to-transparent opacity-60 blur-sm"
    />
      <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
        Each card holds a frequency, a digital heartbeat waiting to be tuned. Click to claim your signal and make it yours.
      </p>
    </motion.header>
  );
}
