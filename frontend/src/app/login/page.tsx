"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Shield, ArrowRight, Mail, Lock, Loader2, Server } from "lucide-react";
import { apiUrl } from "@/lib/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.access_token, data.user);
      } else {
        const detail = data.detail;
        const msg =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail.map((d: { msg?: string }) => d.msg || JSON.stringify(d)).join("; ")
              : detail
                ? JSON.stringify(detail)
                : "Authentication failed.";
        setError(msg);
      }
    } catch (err) {
      setError("Network error. Please ensure backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#F8FBFF", color: "#0F172A", position: "relative", overflow: "hidden", fontFamily: "var(--font-sans)" }}>
      {/* Background Neural Grid */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", backgroundImage: "radial-gradient(#3B82F6 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem", zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", maxWidth: 400 }}>
          
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(103,232,249,0.15))", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(59,130,246,0.2)" }}>
              <Shield size={24} style={{ color: "#3B82F6" }} strokeWidth={2.5} />
            </div>
          </div>

          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>Welcome Back</h1>
            <p style={{ color: "#64748B", fontSize: "0.9rem" }}>Sign in to Sentinel Infrastructure Copilot.</p>
          </div>

          <div style={{ background: "white", padding: "2.5rem", borderRadius: 24, border: "1px solid rgba(148,180,255,0.2)", boxShadow: "0 20px 40px -12px rgba(0,0,0,0.08)" }}>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {error && (
                <div style={{ padding: "0.75rem 1rem", borderRadius: 12, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", color: "#EF4444", fontSize: "0.8rem", fontWeight: 600 }}>
                  {error}
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.05em" }}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "0.8rem 1rem 0.8rem 2.75rem", borderRadius: 12, border: "1px solid rgba(148,180,255,0.25)", fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s" }} className="focus:border-blue-500" />
                </div>
              </div>

              <div>
                <label style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.05em" }}>
                  <span>Password</span>
                  <a href="#" style={{ color: "#3B82F6", textTransform: "none", fontWeight: 600 }}>Forgot?</a>
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                    style={{ width: "100%", padding: "0.8rem 1rem 0.8rem 2.75rem", borderRadius: 12, border: "1px solid rgba(148,180,255,0.25)", fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s" }} className="focus:border-blue-500" />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ marginTop: "0.5rem", padding: "0.85rem", borderRadius: 12, fontSize: "0.9rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>
          
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <p style={{ color: "#64748B", fontSize: "0.85rem" }}>
              Don't have an account? <Link href="/signup" style={{ color: "#3B82F6", fontWeight: 700 }}>Request Access</Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Decorative Right Panel */}
      <div style={{ flex: 1, background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", position: "relative" }} className="hidden lg:block">
        <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center", mixBlendMode: "overlay" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "4rem" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", padding: "2.5rem", borderRadius: 24, border: "1px solid rgba(255,255,255,0.05)" }}>
             <Server size={32} style={{ color: "#3B82F6", marginBottom: "1.5rem" }} />
             <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>Autonomous Mesh Operations</h2>
             <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6 }}>Securely connect your infrastructure to SENTINEL_ONE. The neural engine analyzes telemetry streams in real-time, isolating cascading failures before they impact availability.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
