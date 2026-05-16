"use client";

import { motion } from "framer-motion";
import { TrendingDown, DollarSign, Zap, BarChart3, PieChart } from "lucide-react";

export default function CloudOptimization({ status }: { status: string }) {
  const isIncident = status !== "healthy";

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
         <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Cloud Economics</span>
            <h3 className="text-xl font-black tracking-tight text-white">Efficiency Engine</h3>
         </div>
         <TrendingDown className="w-5 h-5 text-cyan-400 opacity-50" />
      </div>

      <div className="bg-[#0d0e12] border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-12 h-12 text-cyan-500" />
         </div>
         <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Annual Projected Savings</p>
         <h4 className="text-4xl font-black text-white">{isIncident ? "$98,200" : "$124,500"}</h4>
         <div className={`mt-4 flex items-center gap-2 ${isIncident ? 'text-amber-500' : 'text-emerald-500'} text-[10px] font-black uppercase tracking-widest`}>
            <Zap className={`w-3 h-3 ${isIncident ? 'fill-amber-500' : 'fill-emerald-500'}`} />
            {isIncident ? "+12% Anomaly Overhead" : "+22% Efficiency Increase"}
         </div>
      </div>

      <div className="space-y-4">
         <OptimizationItem 
            label="Compute Rightsizing" 
            desc="Reduce 12x i3.large → t3.medium"
            impact="HIGH"
            savings="$42k"
         />
         <OptimizationItem 
            label="Idle Resource Harvest" 
            desc="Terminate 4 unused RDS instances"
            impact="MED"
            savings="$18k"
         />
      </div>

      <div className="mt-auto flex gap-4">
         <div className="flex-1 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col gap-1">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">CPU Idle</span>
            <span className="text-sm font-black text-white">{isIncident ? "4.2%" : "12.4%"}</span>
         </div>
         <div className="flex-1 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col gap-1">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Waste Score</span>
            <span className={`text-sm font-black ${isIncident ? 'text-emerald-500' : 'text-red-400'}`}>{isIncident ? "Zero" : "Low"}</span>
         </div>
      </div>
    </div>
  );
}

function OptimizationItem({ label, desc, impact, savings }: { label: string, desc: string, impact: string, savings: string }) {
  return (
    <div className="p-4 bg-slate-900/30 border border-slate-800/50 rounded-2xl hover:border-cyan-500/30 transition-all cursor-pointer">
       <div className="flex justify-between items-start mb-1">
          <p className="text-[10px] font-black text-white uppercase tracking-tight">{label}</p>
          <span className="text-[9px] font-black text-cyan-400">{savings}</span>
       </div>
       <p className="text-[9px] text-slate-500 font-medium">{desc}</p>
    </div>
  );
}
