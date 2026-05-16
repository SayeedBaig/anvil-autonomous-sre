"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] bg-[#0d0e12] flex flex-col items-center justify-center gap-8">
       {/* Cinematic Neural Loader */}
       <div className="relative w-32 h-32 flex items-center justify-center">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 1, 0.3],
              rotate: [0, 180, 360] 
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-cyan-500/30 rounded-[32%] border-t-cyan-500"
          />
          <motion.div 
            animate={{ 
              scale: [0.8, 1, 0.8],
              opacity: [1, 0.5, 1],
              rotate: [360, 180, 0] 
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border-2 border-purple-500/20 rounded-[32%] border-b-purple-500"
          />
          <Shield className="w-8 h-8 text-white relative z-10 animate-pulse" />
       </div>

       <div className="flex flex-col items-center gap-2">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-black tracking-[0.5em] text-white uppercase"
          >
            SENTINEL_ONE
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.3em] flex gap-2 items-center"
          >
            Establishing Neural Link <span className="w-12 h-[1px] bg-slate-800 relative overflow-hidden"><motion.div animate={{ x: [-48, 48] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-cyan-500" /></span>
          </motion.div>
       </div>
    </div>
  );
}
