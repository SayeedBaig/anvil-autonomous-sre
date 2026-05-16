"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, AlertCircle, Radar } from "lucide-react";

export default function SecurityIntelligence({ status }: { status: string }) {
  const isIncident = status !== "healthy";

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
         <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Security Shield</span>
            <h3 className="text-xl font-black tracking-tight text-white">Threat Intelligence</h3>
         </div>
         <div className={`px-3 py-1 ${isIncident ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'} rounded-full flex items-center gap-2`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isIncident ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className={`text-[9px] font-black ${isIncident ? 'text-amber-500' : 'text-emerald-500'} uppercase tracking-widest`}>
               {isIncident ? "Threat Detected" : "Hardened"}
            </span>
         </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center py-4">
         {/* Radar Animation */}
         <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <motion.div 
               animate={{ scale: [1, 2], opacity: [0.5, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
               className="w-32 h-32 border border-emerald-500 rounded-full"
            />
            <motion.div 
               animate={{ scale: [1, 2], opacity: [0.5, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 2 }}
               className="w-32 h-32 border border-emerald-500 rounded-full"
            />
         </div>
         <Radar className="w-12 h-12 text-emerald-400/50" />
      </div>

      <div className="space-y-3">
         <SecurityMetric label="Anomaly Detection" value="Active" status="OPTIMAL" />
         <SecurityMetric label="Access Patterns" value="Normal" status="SECURE" />
         <SecurityMetric label="Auth Integrity" value="100%" status="VERIFIED" />
      </div>

      <div className="mt-auto p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
         <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-emerald-500" />
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
               All remediation scripts verified against local security protocols. No privilege escalation detected.
            </p>
         </div>
      </div>
    </div>
  );
}

function SecurityMetric({ label, value, status }: { label: string, value: string, status: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
       <div>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
          <p className="text-sm font-black text-white">{value}</p>
       </div>
       <span className="text-[8px] font-black text-emerald-500 px-2 py-0.5 bg-emerald-500/10 rounded-md tracking-widest">{status}</span>
    </div>
  );
}
