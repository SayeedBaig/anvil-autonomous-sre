"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Shield, ArrowRight, Mail, Lock, Loader2, User as UserIcon } from "lucide-react";
import { apiUrl } from "@/lib/config";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(apiUrl("/api/auth/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: fullName, role: "user" }),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.access_token, data.user);
      } else {
        setError(data.detail || "Signup failed.");
      }
    } catch (err) {
      setError("Network error. Please ensure backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#F8FBFF", color: "#0F172A", position: "relative", overflow: "hidden", fontFamily: "var(--font-sans)" }}>
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
            <h1 style={{ fontSize: "1.75rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>Request Access</h1>
            <p style={{ color: "#64748B", fontSize: "0.9rem" }}>Join the autonomous observability mesh.</p>
          </div>

          <div style={{ background: "white", padding: "2.5rem", borderRadius: 24, border: "1px solid rgba(148,180,255,0.2)", boxShadow: "0 20px 40px -12px rgba(0,0,0,0.08)" }}>
            <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {error && (
                <div style={{ padding: "0.75rem 1rem", borderRadius: 12, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", color: "#EF4444", fontSize: "0.8rem", fontWeight: 600 }}>
                  {error}
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.05em" }}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <UserIcon size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                  <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                    style={{ width: "100%", padding: "0.8rem 1rem 0.8rem 2.75rem", borderRadius: 12, border: "1px solid rgba(148,180,255,0.25)", fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s" }} className="focus:border-blue-500" />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.05em" }}>Work Email</label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "0.8rem 1rem 0.8rem 2.75rem", borderRadius: 12, border: "1px solid rgba(148,180,255,0.25)", fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s" }} className="focus:border-blue-500" />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.05em" }}>Password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                  <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
                    style={{ width: "100%", padding: "0.8rem 1rem 0.8rem 2.75rem", borderRadius: 12, border: "1px solid rgba(148,180,255,0.25)", fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s" }} className="focus:border-blue-500" />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ marginTop: "0.5rem", padding: "0.85rem", borderRadius: 12, fontSize: "0.9rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>
          
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <p style={{ color: "#64748B", fontSize: "0.85rem" }}>
              Already have an account? <Link href="/login" style={{ color: "#3B82F6", fontWeight: 700 }}>Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
