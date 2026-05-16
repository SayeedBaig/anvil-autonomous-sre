"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { apiUrl, authHeaders } from "@/lib/config";
import { Shield, ArrowLeft, Plus, Globe, Server, Activity, CheckCircle2, AlertCircle, Trash2, ExternalLink, LogOut } from "lucide-react";

interface Service {
  id: number;
  name: string;
  url: string;
  environment: string;
  status: string;
  created_at: string;
}

export default function InfrastructurePage() {
  const { token, user, logout } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newService, setNewService] = useState({ name: "", url: "", environment: "production" });
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (token) fetchServices();
  }, [token]);

  const fetchServices = async () => {
    try {
      const res = await fetch(apiUrl("/api/infrastructure/services"), {
        headers: authHeaders(token)
      });
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Failed to fetch services", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    try {
      const res = await fetch(apiUrl("/api/infrastructure/connect"), {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(newService),
      });
      if (res.ok) {
        await fetchServices();
        setIsModalOpen(false);
        setNewService({ name: "", url: "", environment: "production" });
      }
    } catch (err) {
      console.error("Failed to connect service", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(apiUrl("/api/infrastructure/services/" + id), { 
        method: "DELETE",
        headers: authHeaders(token)
      });
      setServices(services.filter(s => s.id !== id));
    } catch (err) {
      console.error("Failed to delete service", err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FBFF", color: "#0F172A", fontFamily: "var(--font-sans)" }}>
      {/* Header */}
      <header style={{ 
        display: "flex", justifyContent: "space-between", alignItems: "center", 
        padding: "0 2rem", height: 70, borderBottom: "1px solid rgba(148,180,255,0.18)",
        background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 40 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link href="/dashboard" style={{ color: "#94A3B8", display: "flex", transition: "color 0.2s" }} className="hover:text-blue-500">
            <ArrowLeft size={18} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Shield size={20} style={{ color: "#3B82F6" }} strokeWidth={2.5} />
            <h1 style={{ fontSize: "1rem", fontWeight: 900, letterSpacing: "-0.02em" }}>Infrastructure Management</h1>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.75rem", borderRadius: 10, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Plus size={14} /> Connect New Service
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "white", padding: "0.3rem 0.75rem", borderRadius: 100, border: "1px solid rgba(148,180,255,0.2)" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#1E293B", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800 }}>
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{user?.full_name}</span>
          </div>

          <button onClick={logout} style={{ color: "#64748B", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", fontWeight: 700 }} className="hover:text-red-500 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 2rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#0F172A", marginBottom: "0.5rem" }}>Cloud Ecosystem</h2>
          <p style={{ color: "#64748B", fontSize: "0.85rem" }}>Monitor and manage all connected infrastructure in real-time with AI-powered observability.</p>
        </div>

        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "5rem" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ width: 30, height: 30, borderRadius: "50%", border: "2px solid rgba(59,130,246,0.1)", borderTopColor: "#3B82F6" }} />
          </div>
        ) : services.length === 0 ? (
          <div style={{ background: "white", borderRadius: 24, padding: "5rem 2rem", textAlign: "center", border: "1px dashed rgba(148,180,255,0.5)" }}>
            <div style={{ width: 60, height: 60, borderRadius: 20, background: "rgba(59,130,246,0.05)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <Server size={28} style={{ color: "#3B82F6" }} />
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.5rem" }}>No Infrastructure Connected</h3>
            <p style={{ color: "#64748B", fontSize: "0.85rem", maxWidth: 400, margin: "0 auto 2rem" }}>
              Connect your deployed applications, APIs, or local services to enable autonomous monitoring and AI operational reasoning.
            </p>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "0.85rem", borderRadius: 12 }}>
              Add Your First Service
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
            {services.map((service) => (
              <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: "white", borderRadius: 20, padding: "1.5rem", border: "1px solid rgba(148,180,255,0.18)", boxShadow: "0 10px 30px rgba(0,0,0,0.02)", position: "relative", overflow: "hidden" }}>
                
                {/* Status Indicator */}
                <div style={{ position: "absolute", top: 0, right: 0, padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.25rem 0.6rem", borderRadius: 100, background: "rgba(16,185,129,0.08)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                    <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#10B981", textTransform: "uppercase" }}>{service.status}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(59,130,246,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Globe size={20} style={{ color: "#3B82F6" }} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 2 }}>{service.name}</h4>
                    <p style={{ fontSize: "0.7rem", color: "#64748B", fontFamily: "var(--font-mono)" }}>{service.url}</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ padding: "0.75rem", borderRadius: 12, background: "#F8FAFC" }}>
                    <p style={{ fontSize: "0.55rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: 4 }}>Environment</p>
                    <p style={{ fontSize: "0.75rem", fontWeight: 800, color: "#0F172A", textTransform: "capitalize" }}>{service.environment}</p>
                  </div>
                  <div style={{ padding: "0.75rem", borderRadius: 12, background: "#F8FAFC" }}>
                    <p style={{ fontSize: "0.55rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: 4 }}>Added On</p>
                    <p style={{ fontSize: "0.75rem", fontWeight: 800, color: "#0F172A" }}>{new Date(service.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link href="/dashboard" className="btn-ghost" style={{ padding: "0.4rem 0.8rem", fontSize: "0.65rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Activity size={12} /> Inspect
                    </Link>
                    <a href={service.url} target="_blank" className="btn-ghost" style={{ padding: "0.4rem 0.8rem", fontSize: "0.65rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <ExternalLink size={12} /> Visit
                    </a>
                  </div>
                  <button onClick={() => handleDelete(service.id)} style={{ color: "#EF4444", padding: 8 }} className="hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Connect Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.4)", backdropFilter: "blur(8px)" }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ position: "relative", width: "100%", maxWidth: 500, background: "white", borderRadius: 24, padding: "2.5rem", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}>
              
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.5rem" }}>Connect New Infrastructure</h3>
                <p style={{ color: "#64748B", fontSize: "0.85rem" }}>Onboard your service to the Sentinel autonomous mesh.</p>
              </div>

              <form onSubmit={handleConnect} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.05em" }}>Service Name</label>
                  <input required type="text" placeholder="e.g. checkout-api" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })}
                    style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: 12, border: "1px solid rgba(148,180,255,0.25)", fontSize: "0.9rem", outline: "none" }} className="focus:border-blue-500 transition-colors" />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.05em" }}>Endpoint URL</label>
                  <div style={{ position: "relative" }}>
                    <Globe size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                    <input required type="url" placeholder="https://api.myapp.com" value={newService.url} onChange={e => setNewService({ ...newService, url: e.target.value })}
                      style={{ width: "100%", padding: "0.8rem 1rem 0.8rem 2.75rem", borderRadius: 12, border: "1px solid rgba(148,180,255,0.25)", fontSize: "0.9rem", outline: "none" }} className="focus:border-blue-500 transition-colors" />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.05em" }}>Environment</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                    {["production", "staging", "development"].map(env => (
                      <button key={env} type="button" onClick={() => setNewService({ ...newService, environment: env })}
                        style={{ 
                          padding: "0.6rem", borderRadius: 10, fontSize: "0.7rem", fontWeight: 700, textTransform: "capitalize",
                          border: "1px solid", transition: "all 0.2s",
                          borderColor: newService.environment === env ? "#3B82F6" : "rgba(148,180,255,0.25)",
                          background: newService.environment === env ? "rgba(59,130,246,0.05)" : "transparent",
                          color: newService.environment === env ? "#3B82F6" : "#64748B"
                        }}>
                        {env}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: "0.8rem", borderRadius: 12, fontSize: "0.85rem", fontWeight: 700, background: "#F1F5F9", color: "#475569" }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isConnecting} className="btn-primary" style={{ flex: 1, padding: "0.8rem", borderRadius: 12, fontSize: "0.85rem", fontWeight: 700, opacity: isConnecting ? 0.7 : 1 }}>
                    {isConnecting ? "Establishing Link..." : "Connect Infrastructure"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
