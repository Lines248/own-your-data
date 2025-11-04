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
  className="text-5xl md:text-6xl font-extrabold leading-tight
             bg-gradient-to-r from-[var(--signal-violet)] via-[var(--signal-pink)] to-[var(--signal-cyan)]
             bg-clip-text text-transparent inline-block pb-1"
             style={{
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
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
