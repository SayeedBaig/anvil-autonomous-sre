"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, Database, Search, Network, Workflow, Settings, LayoutDashboard, ArrowLeft, Plus, Globe, AlertTriangle, RefreshCw, Command, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiUrl, SOCKET_URL, authHeaders } from "@/lib/config";
import { useDemoData } from "@/hooks/useDemoData";
import Skeleton from "@/components/Skeleton";

const AgentActivity  = dynamic(() => import("@/components/AgentActivity"),  { ssr: false });
const CausalGraph    = dynamic(() => import("@/components/CausalGraph"),    { ssr: false });
const TelemetryChart = dynamic(() => import("@/components/TelemetryChart"), { ssr: false });
const DependencyMap  = dynamic(() => import("@/components/DependencyMap"),  { ssr: false });
const MemoryPanel    = dynamic(() => import("@/components/MemoryPanel"),    { ssr: false });
const IncidentBanner = dynamic(() => import("@/components/IncidentBanner"), { ssr: false });
const DeploymentIntelligence = dynamic(() => import("@/components/DeploymentIntelligence"), { ssr: false });

type Status = "healthy"|"investigating"|"remediating"|"incident";

interface Service {
  id: number;
  name: string;
  url: string;
  status: string;
  environment: string;
}



export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [thoughts,   setThoughts]   = useState<any[]>([{agent:"System",content:"Neural Core initialized. Waiting for infrastructure link.",timestamp:Date.now()/1000}]);
  const [telemetry,  setTelemetry]  = useState<any[]>([]);
  const [status,     setStatus]     = useState<Status>("healthy");
  const [incidentId, setIncidentId] = useState<string|null>(null);
  const [services,   setServices]   = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [memoryResults, setMemoryResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [causalGraph, setCausalGraph] = useState<any>(null);
  
  const [isOnline,   setIsOnline]   = useState(false);
  const [isBooting,  setIsBooting]  = useState(false);
  const [activeTab,  setActiveTab]  = useState("Operations");
  const [activeNav,  setActiveNav]  = useState(0);

  const socketRef = useRef<any>(null);
  const mockData = useDemoData(isOnline);
  const displayTelemetry = isOnline ? telemetry : mockData;

  // Fetch services on load
  useEffect(() => {
    if (token) {
      fetchServices();
    }
  }, [token]);

  const fetchServices = async () => {
    try {
      const res = await fetch(apiUrl("/api/infrastructure/services"), {
        headers: authHeaders(token)
      });
      if (res.ok) {
        const data = await res.json();
        setServices(data);
        if (data.length > 0 && !selectedService) {
          setSelectedService(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch services", err);
    }
  };

  useEffect(() => {
    let socket: any;
    (async () => {
      try {
        const { io } = await import("socket.io-client");
        socket = io(SOCKET_URL, { 
          transports: ["websocket", "polling"],
          reconnectionAttempts: 5,
          reconnectionDelay: 2000
        });
        socketRef.current = socket;

        socket.on("connect", () => setIsOnline(true));
        socket.on("disconnect", () => setIsOnline(false));
        socket.on("agent_thought", (t: any) => setThoughts(p => [...p, t]));
        
        socket.on("telemetry_update", (data: any) => {
          setTelemetry(p => {
            const next = [...p];
            const newPoint = {
              timestamp: data.timestamp || Date.now() / 1000,
              services: {
                [data.service_name || "System"]: {
                  cpu: data.cpu_usage || 20,
                  latency: data.latency,
                  error_rate: data.status !== "healthy" ? 5 : 0
                }
              }
            };
            next.push(newPoint);
            return next.slice(-50);
          });

          if (data.status !== "healthy" && status === "healthy") {
            setStatus("incident");
            setIncidentId("INC-" + Math.floor(Math.random()*10000));
          } else if (data.status === "healthy" && status !== "healthy") {
            setStatus("healthy");
            setIncidentId(null);
          }
        });

        socket.on("event", (e: any) => {
          if (e.type === "INCIDENT_RESOLVED") {
            setStatus("healthy");
            setIncidentId(null);
            setCausalGraph(null);
          }
          if (e.type === "CAUSAL_GRAPH_UPDATE") {
            setCausalGraph(e.data);
          }
        });
      } catch (err) {
        console.error("Socket connection failed", err);
      }
    })();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [selectedService, status]);

  const triggerIncident = async (type: string) => {
    if (!selectedService) return;
    setIsBooting(true);
    setThoughts([]);
    try {
      await fetch(apiUrl("/api/incidents/trigger"), {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({ service_id: selectedService.id, type })
      });
      setStatus("investigating");
    } catch (err) {
      console.error("Failed to trigger incident", err);
    } finally {
      setIsBooting(false);
    }
  };

  const searchMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    try {
      const res = await fetch(apiUrl(`/api/memory/search?query=${encodeURIComponent(searchQuery)}`), {
        headers: authHeaders(token)
      });
      if (res.ok) {
        const data = await res.json();
        setMemoryResults(data.matches);
        return;
      }
    } catch (err) {
      console.error("Memory search failed, using demo fallback", err);
    }

    // Fallback: Demo Safe Mode
    const mockResults = [
      { id: "INC-2091", title: "Cascading Latency Spike in Checkout", similarity: 0.94 },
      { id: "INC-2092", title: "Redis Connection Pool Exhaustion", similarity: 0.88 },
      { id: "INC-2093", title: "Stripe API Gateway Timeout", similarity: 0.82 },
      { id: "SIM-01", title: `Analyzing related patterns for "${searchQuery}"`, similarity: 0.75 },
    ].filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.includes(searchQuery.toUpperCase()));
    
    setMemoryResults(mockResults.length > 0 ? mockResults : [{ id: "SIM-02", title: "No historical patterns found in cache", similarity: 0 }]);
  };

  const S = {
    sidebar: { width: 44, flexShrink: 0, background: "white", borderRight: "1px solid rgba(148,180,255,0.18)", display: "flex", flexDirection: "column" as const, alignItems: "center", paddingTop: 16, paddingBottom: 16, gap: 4, zIndex: 50 },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2rem", height: 60, borderBottom: "1px solid rgba(148,180,255,0.18)", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", position: "sticky" as const, top: 0, zIndex: 40 },
    navBtn: { width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", transition: "all 0.2s" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FBFF", color: "#0F172A", display: "flex", fontFamily: "var(--font-sans)", width: "100%" }}>
      
      {/* Boot Overlay */}
      <AnimatePresence>
        {isBooting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(248,251,255,0.95)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(59,130,246,0.15)", borderTopColor: "#3B82F6" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", color: "#0F172A" }}>Neural Link Active</p>
              <p style={{ fontSize: "0.65rem", color: "#94A3B8", fontFamily: "var(--font-mono)", marginTop: 4 }}>Injecting operational anomaly...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside style={S.sidebar}>
        <Shield size={16} style={{ color: "#3B82F6", marginBottom: 16 }} strokeWidth={2.5} />
        {[
          { icon: <LayoutDashboard size={15} />, id: 0, tab: "Operations" },
          { icon: <Network size={15} />, id: 1, tab: "Topology" },
          { icon: <Workflow size={15} />, id: 2, tab: "History" },
          { icon: <Plus size={15} />, id: 4, tab: "Connect", link: "/infrastructure" },
        ].map((item) => (
          <button key={item.id} onClick={() => { 
            if(item.link) window.location.href = item.link;
            else { setActiveNav(item.id); setActiveTab(item.tab); }
          }}
            style={{ ...S.navBtn, color: activeNav === item.id ? "#3B82F6" : "#94A3B8", background: activeNav === item.id ? "rgba(59,130,246,0.12)" : "transparent" }}
            className="hover:bg-slate-50 transition-transform">
            {item.icon}
          </button>
        ))}
        <div style={{ marginTop: "auto" }}>
          <Settings size={14} style={{ color: "#94A3B8" }} />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={S.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <Link href="/" style={{ color: "#94A3B8" }}><ArrowLeft size={15} /></Link>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              {["Operations", "Topology", "History"].map((tab, idx) => (
                <span key={tab} onClick={() => { setActiveTab(tab); setActiveNav(idx) }}
                  style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: activeTab === tab ? "#0F172A" : "#94A3B8", borderBottom: activeTab === tab ? "2px solid #3B82F6" : "2px solid transparent", paddingBottom: 18, marginTop: 20, cursor: "pointer" }}>
                  {tab}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            {/* Service Selector */}
            <div style={{ position: "relative" }}>
              <select value={selectedService?.id} onChange={(e) => setSelectedService(services.find(s => s.id === parseInt(e.target.value)) || null)}
                style={{ padding: "0.4rem 2rem 0.4rem 1rem", borderRadius: 10, border: "1px solid rgba(148,180,255,0.25)", background: "white", fontSize: "0.7rem", fontWeight: 700, appearance: "none", outline: "none" }}>
                {services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.environment})</option>)}
                {services.length === 0 && <option>No services connected</option>}
              </select>
              <Globe size={12} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "white", padding: "0.3rem 0.75rem", borderRadius: 100, border: "1px solid rgba(148,180,255,0.2)" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#1E293B", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 800 }}>
                {user?.full_name?.charAt(0) || "U"}
              </div>
              <span style={{ fontSize: "0.7rem", fontWeight: 700 }}>{user?.full_name}</span>
            </div>

            <button onClick={logout} style={{ color: "#64748B", display: "flex", alignItems: "center", gap: "0.2rem", fontSize: "0.7rem", fontWeight: 700 }} className="hover:text-red-500 transition-colors">
              <LogOut size={14} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.9rem", border: "1px solid rgba(148,180,255,0.25)", borderRadius: 100, background: "white" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: isOnline ? "#10B981" : "#F59E0B" }} />
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: isOnline ? "#10B981" : "#F59E0B" }}>{isOnline ? "Live Engine" : "Offline"}</span>
            </div>

            <button onClick={() => triggerIncident("latency_spike")} disabled={!selectedService} className="btn-primary" style={{ padding: "0.45rem 1.1rem", fontSize: "0.62rem" }}>
              Inject Latency Anomaly
            </button>
          </div>
        </header>

        <div style={{ flex: 1, padding: "1rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <IncidentBanner status={status} incidentId={incidentId} />

          {/* Search Bar */}
          <div style={{ background: "white", borderRadius: 16, padding: "0.5rem 1rem", border: "1px solid rgba(148,180,255,0.18)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Search size={16} style={{ color: "#94A3B8" }} />
            <form onSubmit={searchMemory} style={{ flex: 1 }}>
              <input type="text" placeholder="Search operational memory... (e.g. 'latency spike in checkout')" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", border: "none", outline: "none", fontSize: "0.8rem", background: "transparent" }} />
            </form>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.25rem 0.5rem", borderRadius: 6, background: "#F1F5F9", color: "#64748B", fontSize: "0.6rem", fontWeight: 800 }}>
              <Command size={10} /> K
            </div>
          </div>

          {services.length === 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1rem" }}>
              <Skeleton className="h-[350px] w-full" />
              <div className="flex flex-col gap-4">
                <Skeleton className="h-[150px] w-full" />
                <Skeleton className="h-[150px] w-full" />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === "Operations" && (
              <motion.div key="ops" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1rem" }}>
                  <div style={{ background: "#0F172A", borderRadius: 16, height: 350, overflow: "hidden" }}>
                    <AgentActivity thoughts={thoughts} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="card" style={{ padding: "1rem", flex: 1 }}>
                      <p style={{ fontSize: "0.6rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Activity size={12} style={{ color: "#3B82F6" }} /> {selectedService?.name || "Service"} Latency
                      </p>
                      <div style={{ height: 120 }}>
                        <TelemetryChart data={displayTelemetry} service={selectedService?.name || ""} metric="latency" color="#3B82F6" />
                      </div>
                      <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                        <div style={{ padding: "0.5rem", borderRadius: 8, background: "#F8FAFC" }}>
                          <p style={{ fontSize: "0.5rem", fontWeight: 700, color: "#94A3B8" }}>P99 LATENCY</p>
                          <p style={{ fontSize: "0.9rem", fontWeight: 900 }}>
                            {displayTelemetry.length > 0 
                              ? (displayTelemetry[displayTelemetry.length-1].services?.[selectedService?.name || ""]?.latency?.toFixed(2) || "0.00") 
                              : "0.00"}ms
                          </p>
                        </div>
                        <div style={{ padding: "0.5rem", borderRadius: 8, background: "#F8FAFC" }}>
                          <p style={{ fontSize: "0.5rem", fontWeight: 700, color: "#94A3B8" }}>UPTIME</p>
                          <p style={{ fontSize: "0.9rem", fontWeight: 900, color: "#10B981" }}>99.98%</p>
                        </div>
                      </div>
                    </div>
                    <div className="card" style={{ padding: "1rem" }}>
                      <DeploymentIntelligence status={status} />
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1rem" }}>
                  <div className="card" style={{ height: 300, overflow: "hidden" }}>
                    <div style={{ padding: "1rem", borderBottom: "1px solid rgba(148,180,255,0.12)", display: "flex", justifyContent: "space-between" }}>
                      <p style={{ fontSize: "0.6rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>{status === 'healthy' ? 'Real-time Topology' : 'Root Cause Analysis'}</p>
                      <span style={{ fontSize: "0.5rem", fontWeight: 800, color: "#3B82F6" }}>{status === 'healthy' ? '5 Nodes Discovered' : 'Causal Graph Active'}</span>
                    </div>
                    {status === 'healthy' ? <DependencyMap /> : <CausalGraph graphData={causalGraph} />}
                  </div>
                  <MemoryPanel memory={memoryResults.length > 0 ? memoryResults : [{ id: "SIM-01", title: "Wait for incident analysis...", similarity: 0 }]} />
                </div>
              </motion.div>
            )}

            {activeTab === "Topology" && (
              <motion.div key="topo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 600 }}>
                <div className="card" style={{ height: "100%", overflow: "hidden" }}>
                  <DependencyMap />
                </div>
              </motion.div>
            )}

            {activeTab === "History" && (
              <motion.div key="hist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1rem" }}>
                <div className="card" style={{ padding: "2rem" }}>
                  <h3 style={{ fontWeight: 900, fontSize: "1.1rem", marginBottom: "2rem" }}>Incident Audit Log</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {[1,2,3].map(i => (
                      <div key={i} style={{ display: "flex", gap: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #F1F5F9" }}>
                        <div style={{ width: 80 }}>
                          <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#94A3B8" }}>14:22:0{i}</p>
                          <p style={{ fontSize: "0.6rem", fontWeight: 900, color: "#3B82F6" }}>INC-209{i}</p>
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontWeight: 800, fontSize: "0.9rem", marginBottom: 4 }}>Cascading Latency Spike</h4>
                          <p style={{ fontSize: "0.75rem", color: "#64748B" }}>Autonomous recovery executed in 142s. Patterns committed to memory.</p>
                        </div>
                        <span style={{ height: "fit-content", padding: "0.25rem 0.6rem", borderRadius: 6, background: "rgba(16,185,129,0.08)", color: "#10B981", fontSize: "0.6rem", fontWeight: 800 }}>RESOLVED</span>
                      </div>
                    ))}
                  </div>
                </div>
                <MemoryPanel memory={memoryResults} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
