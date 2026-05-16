"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Activity, Database, Server, Cpu, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-100 overflow-hidden relative font-sans">
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <nav className="relative z-10 flex justify-between items-center px-12 py-8 max-w-[1400px] mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-black uppercase tracking-tight">Home</span>
        </Link>
        <span className="text-sm font-black uppercase tracking-widest text-cyan-500">Product Capabilities</span>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-8 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-black tracking-tighter mb-6">Autonomous Intelligence Engine</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            A comprehensive suite of agents designed to observe, reason, and remediate across your entire infrastructure stack.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductFeature icon={<Activity />} title="Real-time Observation" description="High-resolution telemetry ingestion with sub-second anomaly detection." />
          <ProductFeature icon={<Cpu />} title="Causal Reasoning" description="Autonomous derivation of root causes via structural causal modeling." />
          <ProductFeature icon={<Shield />} title="Self-Healing Workflows" description="Automated remediation playbooks executed with human-grade precision." />
          <ProductFeature icon={<Database />} title="Operational Memory" description="Semantic indexing of past incidents to prevent recurring failures." />
          <ProductFeature icon={<Zap />} title="One-Click Simulation" description="Safely test your resiliency with production-grade failure modeling." />
          <ProductFeature icon={<Server />} title="Multi-Cloud Support" description="Unified intelligence across AWS, Azure, GCP, and On-Prem." />
        </div>
      </main>
    </div>
  );
}

function ProductFeature({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-8 bg-[#191a1f] border border-slate-800 rounded-[32px] flex flex-col gap-4">
       <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500">
          {icon}
       </div>
       <h3 className="text-lg font-bold">{title}</h3>
       <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
