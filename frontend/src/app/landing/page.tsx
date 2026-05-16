"use client";

import { motion } from "framer-motion";
import { Shield, ArrowRight, Zap, Cpu, MemoryStick as Memory, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero-bg.png" 
          alt="Neural Infrastructure" 
          fill 
          className="object-cover opacity-40 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/20 to-slate-950" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-cyan-500 p-1.5 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">SENTINEL<span className="text-cyan-500">_ONE</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Agents</a>
          <a href="#" className="hover:text-white transition-colors">Memory Engine</a>
          <a href="#" className="hover:text-white transition-colors">Enterprise</a>
        </div>
        <Link 
          href="/"
          className="px-6 py-2 border border-slate-700 hover:border-cyan-500 rounded-full text-sm font-bold transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-8 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-6 tracking-widest uppercase">
            <Zap className="w-3 h-3" />
            Autonomous DevOps Operating System
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-blue-600">AUTONOMOUS</span> <br />
            INFRASTRUCTURE INTEL.
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Sentinel continuously monitors, reasons, remembers, and autonomously heals your production systems with persistent operational memory.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link 
              href="/"
              className="group relative px-10 py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black transition-all shadow-[0_0_30px_rgba(8,145,178,0.4)] hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">LAUNCH LIVE SIMULATION</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Link>
            
            <button className="px-10 py-5 bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-slate-600 rounded-2xl font-bold transition-all">
              EXPLORE ARCHITECTURE
            </button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40">
          <FeatureCard 
            icon={<Cpu className="w-8 h-8 text-cyan-400" />}
            title="Multi-Agent Brain"
            description="10 specialized agents collaborating autonomously via stateful LangGraph orchestration."
          />
          <FeatureCard 
            icon={<Memory className="w-8 h-8 text-blue-400" />}
            title="Operational Memory"
            description="Persistent vector and causal graph memory that grows smarter with every production event."
          />
          <FeatureCard 
            icon={<Globe className="w-8 h-8 text-purple-400" />}
            title="Self-Healing Loop"
            description="Zero-touch incident resolution, deployment rollbacks, and proactive security mitigation."
          />
        </div>
      </main>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-8 bg-slate-900/30 backdrop-blur-md border border-slate-800 rounded-3xl hover:bg-slate-900/50 transition-all text-left">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
