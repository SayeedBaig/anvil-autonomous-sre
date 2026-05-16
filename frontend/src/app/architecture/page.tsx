"use client";

import { motion } from "framer-motion";
import { Shield, Network, Workflow, Database, Cpu, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-100 overflow-hidden relative font-sans">
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <nav className="relative z-10 flex justify-between items-center px-12 py-8 max-w-[1400px] mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-black uppercase tracking-tight">Back to Home</span>
        </Link>
        <span className="text-sm font-black uppercase tracking-widest text-cyan-500">System Architecture</span>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-8 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-black tracking-tighter mb-6">The Neural Backbone</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Sentinel_One is built on a stateful multi-agent orchestration layer that leverages persistent memory and causal reasoning.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ArchCard 
            icon={<Network className="w-8 h-8 text-cyan-400" />}
            title="LangGraph Orchestrator"
            description="A stateful directed graph that manages 10 specialized AI agents, ensuring consistent reasoning and zero-loss operational state."
          />
          <ArchCard 
            icon={<Database className="w-8 h-8 text-purple-400" />}
            title="Operational Memory"
            description="Combines pgvector for semantic similarity search with a causal graph database to map complex infrastructure dependencies."
          />
          <ArchCard 
            icon={<Workflow className="w-8 h-8 text-emerald-400" />}
            title="Real-time Telemetry Simulator"
            description="High-fidelity synthetic metric generation that models real-world outages, thread leaks, and security anomalies."
          />
          <ArchCard 
            icon={<Zap className="w-8 h-8 text-amber-400" />}
            title="Autonomous Execution"
            description="Secure side-effect layer that performs rollbacks, service restarts, and auto-scaling events with human-grade verification."
          />
        </div>

        <div className="mt-32 p-12 bg-[#191a1f] border border-slate-800 rounded-[32px] text-center">
           <Cpu className="w-12 h-12 text-cyan-500 mx-auto mb-6" />
           <h3 className="text-2xl font-bold mb-4 text-white">Production-Ready Integration</h3>
           <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed mb-8">
              Seamlessly integrates with Kubernetes, AWS, GCP, and GitHub via secure webhooks and telemetry exporters.
           </p>
           <Link href="/dashboard" className="inline-flex px-8 py-3 bg-cyan-500 text-slate-900 rounded-full font-black uppercase tracking-widest text-[10px]">
              Deploy Simulation
           </Link>
        </div>
      </main>
    </div>
  );
}

function ArchCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-8 bg-[#191a1f]/60 backdrop-blur-xl border border-slate-800/50 rounded-[24px] hover:border-cyan-500/30 transition-all">
       <div className="mb-6">{icon}</div>
       <h3 className="text-xl font-bold mb-3">{title}</h3>
       <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
