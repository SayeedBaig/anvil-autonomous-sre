"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, Database, Shield, Zap, Search, Activity, Workflow } from "lucide-react";
import { useEffect, useRef } from "react";

interface Thought {
  agent: string;
  content: string;
  timestamp: number;
}

const AGENT_COLORS: Record<string, string> = {
  MonitoringAgent:  "agent-monitoring",
  ContextAgent:     "agent-context",
  RCAAgent:         "agent-rca",
  RemediationAgent: "agent-remediation",
  ExecutionAgent:   "agent-execution",
  SecurityAgent:    "agent-security",
  OptimizationAgent:"agent-optimization",
  LearningAgent:    "agent-learning",
  DeploymentAgent:  "agent-deployment",
  System:           "agent-system",
  Monitoring:       "agent-monitoring",
  Context:          "agent-context",
  RCA:              "agent-rca",
  Remediation:      "agent-remediation",
  Execution:        "agent-execution",
  Security:         "agent-security",
};

const AGENT_ICONS: Record<string, React.ReactNode> = {
  MonitoringAgent:  <Activity className="w-3 h-3" />,
  ContextAgent:     <Database className="w-3 h-3" />,
  RCAAgent:         <Search className="w-3 h-3" />,
  RemediationAgent: <Zap className="w-3 h-3" />,
  ExecutionAgent:   <Terminal className="w-3 h-3" />,
  SecurityAgent:    <Shield className="w-3 h-3" />,
  OptimizationAgent:<Cpu className="w-3 h-3" />,
  LearningAgent:    <Workflow className="w-3 h-3" />,
  System:           <Terminal className="w-3 h-3" />,
};

function formatAgent(name: string): string {
  return name.replace("Agent", "").toUpperCase();
}

function formatTime(ts: any): string {
  if (!ts) return "--:--:--";
  try {
    // Detect if ts is in seconds (e.g. < 10^11) or milliseconds
    const date = new Date(ts < 1e11 ? ts * 1000 : ts);
    if (isNaN(date.getTime())) return "--:--:--";
    return date.toLocaleTimeString([], { 
      hour12: false, 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit" 
    });
  } catch {
    return "--:--:--";
  }
}

export default function AgentActivity({ thoughts }: { thoughts: Thought[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thoughts.length]);

  return (
    <div className="flex flex-col h-full bg-[#08090c] rounded-2xl overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/6 bg-[#0d0e12] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400 pulse-soft status-dot-cyan" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 font-mono">
            SENTINEL REASONING ENGINE
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30" />
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-5 space-y-1 font-mono scrollbar-hide">
        <AnimatePresence initial={false}>
          {thoughts.map((thought, i) => {
            const colorClass = AGENT_COLORS[thought.agent] || "agent-system";
            const icon = AGENT_ICONS[thought.agent] ?? <Terminal className="w-3 h-3" />;
            const isLast = i === thoughts.length - 1;

            return (
              <motion.div
                key={`${thought.timestamp}-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group"
              >
                {/* Agent header line */}
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${colorClass} mt-3 mb-1`}>
                  <span className="opacity-60">{icon}</span>
                  <span>[{formatAgent(thought.agent)}]</span>
                  <span className="text-slate-700 font-normal normal-case tracking-normal ml-auto">
                    {formatTime(thought.timestamp)}
                  </span>
                </div>

                {/* Content line */}
                <div className="text-[12px] text-slate-300 leading-relaxed pl-5 border-l border-white/5">
                  {thought.content}
                  {isLast && (
                    <span className="inline-block w-2 h-3.5 bg-cyan-400 ml-1 cursor-blink align-middle opacity-80" />
                  )}
                </div>

                {/* Execution progress bar */}
                {thought.agent === "ExecutionAgent" && (
                  <div className="mt-2 ml-5 h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, ease: "linear" }}
                      className="h-full bg-emerald-400 rounded-full"
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {thoughts.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-700 py-16">
            <Terminal className="w-6 h-6 opacity-40" />
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Listening for infrastructure events</p>
            <span className="inline-block w-2 h-4 bg-slate-700 cursor-blink" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
