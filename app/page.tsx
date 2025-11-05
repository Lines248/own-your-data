"use client";

import { useRef, useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Header from "@/components/Header";
import AssetCard from "@/components/AssetCard";
import { track, subscribeAnalytics, type AnalyticsEvent } from "@/utils/analytics";

export default function Home() {
  const [themeSignal, setThemeSignal] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.25);

  // Ownership persistence
  const [claimedIds, setClaimedIds] = useState<number[]>([]);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [userInitials, setUserInitials] = useState<string>("");      
  const [initialDraft, setInitialDraft] = useState<string>("");    

  useEffect(() => {
    try {
      const storedClaims = localStorage.getItem("claimedIds");
      if (storedClaims !== null) {
        const parsed = JSON.parse(storedClaims);
        if (Array.isArray(parsed)) {
          // ts-expect-error safe cast from persisted JSON
          setClaimedIds(parsed as number[]);
        }
      }

      const storedInitials = localStorage.getItem("userInitials");
      if (storedInitials) setUserInitials(storedInitials);
    } catch (err) {
      console.warn("Failed to parse persisted data:", err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("claimedIds", JSON.stringify(claimedIds));
    } catch {}
  }, [claimedIds]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  function ensureAudio() {
    if (!audioCtxRef.current) {
      const Ctx =
        (window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext)!;
      const ctx = new Ctx();
      const gain = ctx.createGain();
      gain.gain.value = volume;
      gain.connect(ctx.destination);
      audioCtxRef.current = ctx;
      masterGainRef.current = gain;
    }
  }

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      masterGainRef.current.gain.linearRampToValueAtTime(
        muted ? 0 : volume,
        ctx.currentTime + 0.1
      );
    }
  }, [volume, muted]);

  function createOscillator(freq: number) {
    ensureAudio();
    const ctx = audioCtxRef.current!;
    const cardGain = ctx.createGain();
    cardGain.gain.value = 0.4; // base loudness
    cardGain.connect(masterGainRef.current!);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    const now = ctx.currentTime;
    cardGain.gain.setValueAtTime(0, now);
    cardGain.gain.linearRampToValueAtTime(0.3, now + 0.15);
    cardGain.gain.linearRampToValueAtTime(0.25, now + 2);

    osc.connect(cardGain);
    osc.start();
    return { osc, gain: cardGain };
  }

  function toggleGlobalMute() {
    if (!masterGainRef.current || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    track("muted", { context: "global", muted: !muted });
    masterGainRef.current.gain.linearRampToValueAtTime(
      muted ? volume : 0,
      ctx.currentTime + 0.25
    );
    setMuted((m) => !m);
  }

  function saveInitials() {
    const clean = initialDraft.trim().slice(0, 2).toUpperCase();
    if (!clean) return;
    setUserInitials(clean);
    try {
      localStorage.setItem("userInitials", clean);
    } catch {}
    setShowWalletModal(false);
  }

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { staggerChildren: 0.25, delayChildren: 0.1 },
    },
  };

  const assets = [
    { id: 1, title: "Echo Fragment", img: "/signals/signal1.webp" },
    { id: 2, title: "Neural Bloom", img: "/signals/signal2.webp" },
    { id: 3, title: "Spectral Field", img: "/signals/signal3.webp" },
  ];

  return (
    <main
      className="min-h-screen w-full text-white transition-all duration-700 overflow-auto"
      style={{
        background: themeSignal
          ? `radial-gradient(circle at center, ${themeSignal}40 0%, #0a0a0f 80%)`
          : "linear-gradient(135deg,#0a0a0f,#12122b,#1b0035)",
      }}
    >
         <a
        href="#signals"
        className="sr-only sr-only-focusable"
      >
        Skip to signals
      </a>

      <Header />
      <AnalyticsHUD /> 

      <div className="flex justify-between items-center px-8 mt-4">
        <button
          onClick={() => {
            setInitialDraft(userInitials || "");
            setShowWalletModal(true);
          }}
          aria-label="Open profile and connection options"
          aria-haspopup="dialog"
          aria-controls="wallet-modal"
          aria-expanded={showWalletModal}
       className={`relative flex items-center justify-center w-10 h-10 rounded-full border transition
          ${userInitials
              ? "border-[var(--signal-gold)]/60 bg-[var(--signal-gold)]/15 hover:bg-[var(--signal-gold)]/30 text-white/90"
              : "border-[var(--signal-cyan)]/40 bg-[var(--signal-cyan)]/20 hover:bg-[var(--signal-cyan)]/35 text-white/90"
            }
        focus-visible:ring-2 focus-visible:ring-[var(--signal-cyan)]`}
        >
          {userInitials ? (
            <span className="text-sm font-semibold tracking-wide">
              {userInitials}
            </span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 opacity-80"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M6 20c0-3.3137 2.6863-6 6-6s6 2.6863 6 6" />
            </svg>
          )}
          {claimedIds.length > 0 && (
            <span className="absolute bottom-1 right-1 block w-2 h-2 bg-[var(--signal-gold)] rounded-full" />
          )}
        </button>

        <div className="flex items-center gap-4">
          <label htmlFor="volume-slider" className="text-xs opacity-70">
            Volume
            </label>
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              track("volume_changed", { volume: v });
            }}
            className="w-32 accent-[var(--signal-cyan)] cursor-pointer"
          />
      <button
      onClick={toggleGlobalMute}
      className="rounded-full bg-white/10 text-white/90 px-4 py-2 text-sm backdrop-blur hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal-cyan)] transition"
      aria-pressed={muted}
    >
      {muted ? "Unmute All" : "Mute All"}
      </button>
     </div>
   </div>

  <h2 id="signals" className="sr-only">Available signals</h2>

      {assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center text-[var(--text-mid-contrast)]">
          <p className="text-lg font-medium">No signals available yet.</p>
          <p className="text-sm opacity-60">
            Check back soon to claim new frequencies.
          </p>
        </div>
      ) : (
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 p-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              isClaimed={claimedIds.includes(asset.id)}
              onClaim={() =>
                setClaimedIds((prev) =>
                  prev.includes(asset.id) ? prev : [...prev, asset.id]
                )
              }
              setThemeSignal={setThemeSignal}
              createOscillator={createOscillator}
              userInitials={userInitials || "LS"}
            />
          ))}
        </motion.section>
      )}

      <div className="h-24" />

      {showWalletModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wallet-title"
           onKeyDown={(e) => {
            if (e.key === "Escape") setShowWalletModal(false);
          }}
        >
          <div className="bg-[#141424] border border-white/10 rounded-2xl p-6 w-[90%] max-w-sm text-center shadow-lg">
            <h2 id="wallet-title" className="text-lg font-semibold mb-4">
              Connect Your Account
            </h2>
            <p className="text-sm text-[var(--text-mid-contrast)] mb-4">
              Choose how you’d like to connect.
            </p>

            <div className="flex flex-col gap-3 mb-4">
           <button className="rounded-full bg-[var(--signal-cyan)]/30 border border-[var(--signal-cyan)]/50 text-[var(--text-high-contrast)] py-2 hover:bg-[var(--signal-cyan)]/40 focus-visible:ring-2 focus-visible:ring-[var(--signal-cyan)] transition">
              Email (Custodial)
            </button>
           <button className="rounded-full bg-[var(--signal-violet)]/30 border border-[var(--signal-violet)]/50 text-[var(--text-high-contrast)] py-2 hover:bg-[var(--signal-violet)]/40 focus-visible:ring-2 focus-visible:ring-[var(--signal-cyan)] transition">
                Wallet (Non-Custodial)
              </button>
            </div>

            <div className="text-left space-y-2">
              <label htmlFor="initials" className="text-xs opacity-70">
                Profile initials (1–2 letters)
              </label>
              <input
                id="initials"
                value={initialDraft}
                onChange={(e) => {
              const lettersOnly = e.target.value.replace(/[^a-zA-Z]/g, "");
              setInitialDraft(lettersOnly.toUpperCase().slice(0, 2));
            }}
             inputMode="text"
             autoCapitalize="characters"
             pattern="[A-Za-z]*"
             maxLength={2}
             className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--signal-cyan)]"
             placeholder="LS"
             aria-describedby="initials-help"
            />
              <p id="initials-help" className="text-[11px] opacity-60">
                Shown in the profile circle and on claimed cards.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-xs text-white/60 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={saveInitials}
                className="rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function AnalyticsHUD() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    const unsub = subscribeAnalytics((e) => {
      setEvents((prev) => [...prev.slice(-4), e]); 
    });
    return unsub;
  }, []);

  return (
    <div className="fixed top-4 left-4 z-50 text-[11px] font-mono text-white/80 bg-black/40 rounded-lg p-2 backdrop-blur-sm border border-white/10">
      {events.length === 0 ? (
        <span className="opacity-50">analytics: idle</span>
      ) : (
        events.map((e) => (
          <div key={e.timestamp} className="flex gap-2">
            <span className="text-[var(--signal-cyan)]">{e.name}</span>
            <span className="opacity-60">
              {new Date(e.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}