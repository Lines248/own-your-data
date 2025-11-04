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
      <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
        Claim Your Signal

      </h1>
      <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
        Each card holds a frequency, a unique beat waiting to be tuned. Click to claim your signal and make it yours.
      </p>
    </motion.header>
  );
}