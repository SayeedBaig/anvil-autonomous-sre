"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Shield, Users, Server, Activity, LogOut, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ users: 0, services: 0, incidents: 0 });

  // In a real app, we would fetch these from a protected /api/admin/stats endpoint
  useEffect(() => {
    // Mocking stats for the demo
    setStats({ users: 12, services: 42, incidents: 128 });
  }, []);

  if (!user || user.role !== "admin") return null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F8FBFF", color: "#0F172A", fontFamily: "var(--font-sans)" }}>
      
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2rem", height: 70, borderBottom: "1px solid rgba(148,180,255,0.18)", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "0.5rem", background: "rgba(59,130,246,0.1)", borderRadius: 10 }}>
            <Shield size={20} style={{ color: "#3B82F6" }} strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: "1rem", fontWeight: 900, letterSpacing: "-0.02em", color: "#0F172A" }}>Global Command Center</h1>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#3B82F6", textTransform: "uppercase", letterSpacing: "0.1em" }}>Administrator</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "white", padding: "0.4rem 1rem", borderRadius: 100, border: "1px solid rgba(148,180,255,0.2)" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#1E293B", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800 }}>
              {user.full_name.charAt(0)}
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{user.full_name}</span>
          </div>
          <button onClick={logout} style={{ color: "#64748B", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", fontWeight: 700 }} className="hover:text-red-500 transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2.5rem 2rem", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        <div style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0F172A", marginBottom: "0.25rem" }}>Platform Overview</h2>
            <p style={{ color: "#64748B", fontSize: "0.85rem" }}>Monitor system health, manage users, and inspect global autonomous operations.</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#10B981", background: "rgba(16,185,129,0.1)", padding: "0.3rem 0.75rem", borderRadius: 100, display: "flex", alignItems: "center", gap: "0.4rem" }}>
               <CheckCircle2 size={12} /> ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>

        {/* Top KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", marginBottom: "2.5rem" }}>
          {[
            { label: "Active Users", value: stats.users, icon: <Users size={18}/>, color: "#8B5CF6" },
            { label: "Connected Nodes", value: stats.services, icon: <Server size={18}/>, color: "#3B82F6" },
            { label: "Total Incidents Handled", value: stats.incidents, icon: <ShieldAlert size={18}/>, color: "#F59E0B" },
            { label: "Autonomous Recovery Rate", value: "98.4%", icon: <Activity size={18}/>, color: "#10B981" }
          ].map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{ background: "white", padding: "1.5rem", borderRadius: 20, border: "1px solid rgba(148,180,255,0.15)", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${kpi.color}15`, color: kpi.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {kpi.icon}
                </div>
              </div>
              <p style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", color: "#64748B", letterSpacing: "0.05em", marginBottom: 4 }}>{kpi.label}</p>
              <h3 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#0F172A" }}>{kpi.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Administration Panels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          {/* User Management */}
          <div style={{ background: "white", borderRadius: 24, border: "1px solid rgba(148,180,255,0.15)", overflow: "hidden" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(148,180,255,0.1)" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 800 }}>Recent Users</h3>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {["Alex Chen", "Sarah Miller", "DevOps Team A"].map((name, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: i < 2 ? "1px solid #F1F5F9" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#64748B" }}>{name.charAt(0)}</div>
                    <div>
                      <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0F172A" }}>{name}</p>
                      <p style={{ fontSize: "0.7rem", color: "#64748B" }}>user{i+1}@company.com</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, background: "rgba(59,130,246,0.1)", color: "#3B82F6", padding: "0.25rem 0.6rem", borderRadius: 100, textTransform: "uppercase" }}>Standard</span>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Health */}
          <div style={{ background: "white", borderRadius: 24, border: "1px solid rgba(148,180,255,0.15)", overflow: "hidden" }}>
             <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(148,180,255,0.1)", display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 800 }}>Global Event Log</h3>
              <Link href="/dashboard" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#3B82F6", display: "flex", alignItems: "center", gap: "0.25rem" }}>Go to Operations <ArrowRight size={12} /></Link>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { evt: "User 'DevOps Team A' connected new service 'Payment Gateway'", time: "2m ago", color: "#10B981" },
                { evt: "Autonomous recovery executed for 'Checkout API' (INC-922)", time: "14m ago", color: "#F59E0B" },
                { evt: "System generated new operational memory index", time: "1h ago", color: "#3B82F6" },
              ].map((log, i) => (
                <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", paddingBottom: "1rem", borderBottom: i < 2 ? "1px solid #F1F5F9" : "none" }}>
                  <div style={{ marginTop: 4, width: 8, height: 8, borderRadius: "50%", background: log.color }} />
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0F172A", marginBottom: 2 }}>{log.evt}</p>
                    <p style={{ fontSize: "0.65rem", color: "#94A3B8", fontWeight: 700 }}>{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
