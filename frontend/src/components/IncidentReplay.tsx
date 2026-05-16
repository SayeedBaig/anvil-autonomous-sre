"use client";

import { motion } from "framer-motion";
import { Play, RotateCcw, FastForward, Rewind } from "lucide-react";

export default function IncidentReplay({ status }: { status: string }) {
  const isIncident = status !== "healthy";
  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
         <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Post-Mortem Engine</span>
            <h3 className="text-xl font-black tracking-tight text-white">Incident Replay</h3>
         </div>
         <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"><Rewind className="w-4 h-4" /></button>
            <button className="p-3 bg-cyan-500 text-slate-900 rounded-xl hover:bg-white transition-all"><Play className="w-4 h-4 fill-current" /></button>
            <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"><FastForward className="w-4 h-4" /></button>
         </div>
      </div>

      <div className="flex-1 relative bg-[#0d0e12] rounded-2xl border border-slate-800 p-4 flex flex-col gap-4">
         <div className="flex justify-between items-center text-[9px] font-mono text-slate-600">
            <span>T-Minus 120s</span>
            <span>LIVE</span>
         </div>
         <div className="flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-hide">
            <ReplayEvent time="14:00:02" label="Webhook Ingested" active={isIncident} />
            <ReplayEvent time="14:00:15" label="Anomaly Detected" active={status === "investigating" || status === "remediating"} />
            <ReplayEvent time="14:00:42" label="Agents Coordinated" active={status === "remediating"} />
            <ReplayEvent time="14:01:10" label="Remediation Armed" active={status === "remediating"} />
            <ReplayEvent time="14:01:45" label="Infrastructure Recovery" active={status === "healthy" && isIncident} />
         </div>
         <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
               animate={{ width: isIncident ? ["0%", "100%"] : "0%" }}
               transition={{ duration: 120, ease: "linear" }}
               className="h-full bg-cyan-500"
            />
         </div>
      </div>
    </div>
  );
}

function ReplayEvent({ time, label, active = false }: { time: string, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 py-2 ${active ? 'opacity-100' : 'opacity-30'}`}>
       <span className="text-[9px] font-mono text-slate-500">{time}</span>
       <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-slate-800'}`} />
       <span className="text-[10px] font-black text-white uppercase tracking-tight">{label}</span>
    </div>
  );
}
