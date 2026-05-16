"use client";

import { motion } from "framer-motion";
import { Rocket, ShieldCheck, AlertTriangle, ArrowRight, Activity, Percent } from "lucide-react";

export default function DeploymentIntelligence({ status }: { status: string }) {
  const isIncident = status === "incident" || status === "investigating" || status === "remediating";
  
  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
         <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Live Deployment</span>
            <h3 className="text-xl font-black tracking-tight text-slate-900">{isIncident ? "v2.1.4-hotfix" : "v2.1.3-stable"}</h3>
         </div>
         <div className={`px-3 py-1 ${isIncident ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'} rounded-full flex items-center gap-2 border`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isIncident ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className={`text-[9px] font-black ${isIncident ? 'text-amber-500' : 'text-emerald-500'} uppercase tracking-widest`}>
               {isIncident ? "Active Canary" : "Steady State"}
            </span>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col gap-2">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Risk Score</span>
            <div className="flex items-end gap-2">
               <span className="text-3xl font-black text-slate-900">{isIncident ? "82" : "12"}</span>
               <span className={`text-[10px] ${isIncident ? 'text-amber-500' : 'text-slate-500'} font-bold mb-1`}>
                  {isIncident ? "HIGH RISK" : "NOMINAL"}
               </span>
            </div>
         </div>
         <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col gap-2">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Confidence</span>
            <div className="flex items-end gap-2">
               <span className="text-3xl font-black text-slate-900">{isIncident ? "94%" : "100%"}</span>
               <span className="text-[10px] text-emerald-500 font-bold mb-1">STABLE</span>
            </div>
         </div>
      </div>

      <div className="space-y-4">
         <IntelligenceItem 
            icon={<Activity className="w-3.5 h-3.5 text-blue-500" />}
            label="Traffic Shift"
            value="15% → 25%"
            progress={25}
         />
         <IntelligenceItem 
            icon={<AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
            label="Anomaly Delta"
            value="+12.4% Latency"
            progress={65}
            isWarning
         />
         <IntelligenceItem 
            icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
            label="Security Audit"
            value="PASSED"
            progress={100}
         />
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100">
          <button 
            onClick={() => alert("Deployment Graph view under development for next phase.")}
            className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900 shadow-sm active:scale-95">
            View Deployment Graph <ArrowRight className="w-3 h-3" />
          </button>
      </div>
    </div>
  );
}

function IntelligenceItem({ icon, label, value, progress, isWarning = false }: { icon: any, label: string, value: string, progress: number, isWarning?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2 text-slate-500">
             {icon}
             {label}
          </div>
          <span className={isWarning ? "text-amber-500" : "text-slate-900"}>{value}</span>
       </div>
       <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full ${isWarning ? "bg-amber-500" : "bg-blue-500"}`}
          />
       </div>
    </div>
  );
}
