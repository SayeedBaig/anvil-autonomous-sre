"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("SENTINEL_ONE_RUNTIME_ERROR:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#08090c] flex items-center justify-center p-8 font-sans">
      <div className="dot-grid fixed inset-0 opacity-100 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-md w-full text-center"
      >
        {/* Ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(239,68,68,0.06) 0%, transparent 70%)" }}
        />

        {/* Icon */}
        <div className="relative w-16 h-16 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-red-500/10 border border-red-500/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-red-500/60 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-red-500 pulse-soft" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-[-0.03em] text-white mb-3 font-display">
          Neural Link Severed.
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          An unexpected interruption occurred in the autonomous reasoning engine.
          The core has been placed into safe mode.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full py-4 bg-white text-slate-950 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Re-Initialize Core
          </button>
          <Link
            href="/"
            className="w-full py-4 bg-transparent border border-white/8 text-slate-400 rounded-full font-black text-[11px] uppercase tracking-widest hover:border-white/15 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Command
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
