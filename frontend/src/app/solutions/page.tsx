"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Activity, Globe, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-100 overflow-hidden relative font-sans">
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <nav className="relative z-10 flex justify-between items-center px-12 py-8 max-w-[1400px] mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-black uppercase tracking-tight">Back to Home</span>
        </Link>
        <span className="text-sm font-black uppercase tracking-widest text-cyan-500">Autonomous Solutions</span>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-8 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-black tracking-tighter mb-6">Designed for Scale.</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Sentinel_One provides tailored autonomous operations for every layer of the enterprise stack.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SolutionCard 
            title="SRE Teams"
            description="Eliminate on-call burnout. Sentinel handles Level 1 and Level 2 incidents autonomously, escalating only the most complex architectural anomalies."
            features={["45s MTTR", "Automatic Root Cause Analysis", "Zero-Manual Execution"]}
          />
          <SolutionCard 
            title="FinOps"
            description="Dynamic infrastructure optimization. Sentinel continuously rightsizes instances and identifies cost-leaks in real-time."
            features={["30% Cloud Cost Reduction", "Predictive Scaling", "Idle Resource Harvest"]}
          />
          <SolutionCard 
            title="Security Ops"
            description="Autonomous threat remediation. Sentinel identifies anomalous traffic patterns and performs automatic firewall patching."
            features={["Real-time IP Blocking", "Anomaly Detection", "Automated Compliance"]}
          />
        </div>
      </main>
    </div>
  );
}

function SolutionCard({ title, description, features }: { title: string, description: string, features: string[] }) {
  return (
    <div className="p-8 bg-[#191a1f] border border-slate-800 rounded-[32px] flex flex-col gap-6 hover:bg-[#202124] transition-all">
       <h3 className="text-2xl font-bold">{title}</h3>
       <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
       <div className="flex flex-col gap-3 mt-4">
          {features.map((f, i) => (
             <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                <CheckCircle2 className="w-3 h-3" />
                {f}
             </div>
          ))}
       </div>
    </div>
  );
}
