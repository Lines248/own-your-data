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
        Claim Your Space
      </h1>
      <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
        A micro-experience exploring digital ownership and identity, where every interaction belongs to you.
      </p>
    </motion.header>
  );
}