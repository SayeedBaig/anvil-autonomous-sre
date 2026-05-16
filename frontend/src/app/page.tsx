"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
const AgentActivity = dynamic(() => import("@/components/AgentActivity"), { ssr: false });

const DEMO = [
  { agent: "MonitoringAgent",  content: "ALERT — checkout-service p99 latency: 4.2s. Threshold exceeded. Activating investigation.", timestamp: Date.now()/1000-90 },
  { agent: "ContextAgent",     content: "Topology reconstructed. 12 dependencies mapped. Correlating deployment v2.1.4 (6 min ago).", timestamp: Date.now()/1000-72 },
  { agent: "RCAAgent",         content: "Root cause confirmed: thread leak in batch processor. Connection pool exhausted (100/100).", timestamp: Date.now()/1000-52 },
  { agent: "RemediationAgent", content: "Rollback to v2.1.3 authorized. Confidence: 98.4%. L2 severity — executing autonomously.", timestamp: Date.now()/1000-32 },
  { agent: "ExecutionAgent",   content: "kubectl rollout undo deployment/checkout-service — complete. Health checks passing.", timestamp: Date.now()/1000-10 },
  { agent: "System",           content: "RESOLVED — Latency: 94ms. All nodes nominal. Pattern stored to neural memory.", timestamp: Date.now()/1000 },
];

function Reveal({ children, delay=0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref}>
      <motion.div initial={{opacity:0,y:28}} animate={v?{opacity:1,y:0}:{}} transition={{duration:0.85,delay,ease:[0.22,1,0.36,1]}}>
        {children}
      </motion.div>
    </div>
  );
}

const AGENTS = [
  { name:"MonitoringAgent", status:"Scanning 4.1M metrics/s", dot:"dot-blue",  float:"float-1", top:"12%",  left:"62%" },
  { name:"RCAAgent",        status:"Causal model converged",  dot:"dot-amber", float:"float-2", top:"28%",  left:"82%" },
  { name:"RemediationAgent",status:"Rollback armed: 98.4%",   dot:"dot-purple",float:"float-3", top:"58%",  left:"78%" },
  { name:"ContextAgent",    status:"42 nodes mapped",         dot:"dot-cyan",  float:"float-4", top:"70%",  left:"58%" },
  { name:"ExecutionAgent",  status:"kubectl session active",  dot:"dot-green", float:"float-5", top:"44%",  left:"88%" },
];

export default function Landing() {
  const [demoThoughts, setDemoThoughts] = useState<any[]>(DEMO);

  useEffect(() => {
    fetch("/api/ai/live-feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service: "landing-page-demo", version: "v1.0.0" })
    })
      .then(r => r.json())
      .then(data => {
        if (data.thoughts && Array.isArray(data.thoughts)) {
          // Adjust timestamps to look historical like the mock data
          const now = Date.now() / 1000;
          const timedThoughts = data.thoughts.map((t: any, i: number) => ({
            ...t,
            timestamp: now - (data.thoughts.length - i) * 15
          }));
          setDemoThoughts(timedThoughts);
        }
      })
      .catch(console.error);
  }, []);
  return (
    <div style={{background:"#F8FBFF",color:"#0F172A",minHeight:"100vh",overflow:"hidden"}}>

      {/* ── Ambient ── */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div className="dot-grid-light" style={{position:"absolute",inset:0,opacity:0.6}} />
        <img 
          src="/sentinel_hero_abstract_1778860302805.png" 
          alt="Ambient AI Background" 
          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.04,mixBlendMode:"multiply"}}
        />
        <div style={{position:"absolute",width:"80vw",height:"70vh",top:"-15vh",left:"10vw",background:"radial-gradient(ellipse,rgba(59,130,246,0.07) 0%,transparent 65%)",borderRadius:"50%"}} />
        <div style={{position:"absolute",width:"50vw",height:"50vh",bottom:"-10vh",right:"-5vw",background:"radial-gradient(ellipse,rgba(103,232,249,0.08) 0%,transparent 60%)",borderRadius:"50%"}} />
      </div>

      {/* ── NAV ── */}
      <nav style={{position:"sticky",top:0,zIndex:50,borderBottom:"1px solid rgba(148,180,255,0.15)",background:"rgba(248,251,255,0.85)",backdropFilter:"blur(20px)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 2rem",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
            <Shield size={16} style={{color:"#3B82F6"}} strokeWidth={2.5} />
            <span style={{fontSize:"0.78rem",fontWeight:900,letterSpacing:"0.15em",textTransform:"uppercase",color:"#0F172A"}}>SENTINEL_ONE</span>
          </div>
          <div style={{display:"flex",gap:"2.5rem"}}>
            {["Product","Agents","Architecture"].map(l=>(
              <a key={l} href={`#${l.toLowerCase()}`} style={{fontSize:"0.72rem",fontWeight:600,color:"#64748B",letterSpacing:"0.05em",textDecoration:"none",transition:"color 0.2s"}}
                onMouseEnter={e=>(e.currentTarget.style.color="#0F172A")} onMouseLeave={e=>(e.currentTarget.style.color="#64748B")}>{l}</a>
            ))}
          </div>
          <Link href="/login" className="btn-primary" style={{padding:"0.55rem 1.25rem",fontSize:"0.7rem"}}>
            Open Dashboard <ArrowRight size={12} />
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{minHeight:"calc(100vh - 64px)",display:"grid",gridTemplateColumns:"1.2fr 0.8fr",alignItems:"center",maxWidth:1200,margin:"0 auto",padding:"2rem 2rem",gap:"4rem",position:"relative",zIndex:10}}>
        {/* Left */}
        <div>
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.8,ease:[0.22,1,0.36,1]}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:"0.6rem",padding:"0.4rem 0.85rem",border:"1px solid rgba(59,130,246,0.2)",borderRadius:100,marginBottom:"1.75rem",background:"rgba(59,130,246,0.05)"}}>
              <span className="dot-blue" style={{width:5,height:5,borderRadius:"50%",display:"inline-block",animation:"blink 2s ease-in-out infinite"}} />
              <span style={{fontSize:"0.6rem",fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#3B82F6"}}>Autonomous System · Live</span>
            </div>
          </motion.div>

          <motion.h1 initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:1,delay:0.1,ease:[0.22,1,0.36,1]}}
            className="display-hero" style={{marginBottom:"1.25rem",lineHeight:0.95,maxWidth:600}}>
            Infrastructure<br/>
            <span className="shimmer-text">That Heals Itself.</span>
          </motion.h1>

          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.9,delay:0.25,ease:[0.22,1,0.36,1]}}
            style={{fontSize:"1rem",color:"#64748B",lineHeight:1.7,maxWidth:460,marginBottom:"2.5rem",fontWeight:450}}>
            Autonomous AI agents orchestrating production infrastructure in real time. Zero human intervention.
          </motion.p>

          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.8,delay:0.4,ease:[0.22,1,0.36,1]}}
            style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
            <Link href="/login" className="btn-primary">Launch Simulation <ArrowRight size={14}/></Link>
            <a href="#product" className="btn-ghost">See How It Thinks</a>
          </motion.div>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8}}
            style={{display:"flex",gap:"2.5rem",marginTop:"2.5rem",paddingTop:"1.75rem",borderTop:"1px solid rgba(148,180,255,0.15)"}}>
            {[{val:"< 45s",label:"MTTR"},{val:"98.4%",label:"RCA Conf."},{val:"99.999%",label:"Uptime"}].map(s=>(
              <div key={s.label}>
                <div style={{fontSize:"1.4rem",fontWeight:900,letterSpacing:"-0.04em",color:"#0F172A",fontFamily:"var(--font-display)"}}>{s.val}</div>
                <div style={{fontSize:"0.6rem",color:"#94A3B8",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:3}}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — orbital visualization */}
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{duration:1.2,delay:0.3,ease:[0.22,1,0.36,1]}}
          style={{position:"relative",height:560,display:"flex",alignItems:"center",justifyContent:"center"}}>

          {/* SVG neural lines */}
          <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} viewBox="0 0 560 560">
            {[[280,280,170,67],[280,280,452,156],[280,280,490,324],[280,280,435,390],[280,280,325,420]].map(([x1,y1,x2,y2],i)=>(
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="6 6" opacity="0.5"
                style={{animation:`signal-flow ${2+i*0.4}s linear infinite`}} />
            ))}
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.05"/>
                <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05"/>
              </linearGradient>
            </defs>
          </svg>

          {/* Core sphere */}
          <div className="orbit-pulse" style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
            width:100,height:100,borderRadius:"50%",
            background:"linear-gradient(135deg,rgba(59,130,246,0.12),rgba(103,232,249,0.18))",
            border:"1.5px solid rgba(59,130,246,0.25)",
            display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#3B82F6,#67E8F9)",
              display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 30px rgba(59,130,246,0.4)"}}>
              <Shield size={22} style={{color:"white"}} strokeWidth={2.5}/>
            </div>
          </div>

          {/* Agent cards */}
          {AGENTS.map((a)=>(
            <div key={a.name} className={`glass ${a.float}`}
              style={{position:"absolute",top:a.top,left:a.left,transform:"translate(-50%,-50%)",
                padding:"0.75rem 1rem",minWidth:170,zIndex:3}}>
              <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.3rem"}}>
                <span className={a.dot} style={{width:6,height:6,borderRadius:"50%",display:"inline-block",flexShrink:0}}/>
                <span style={{fontSize:"0.68rem",fontWeight:800,color:"#0F172A",letterSpacing:"0.02em"}}>{a.name}</span>
              </div>
              <p style={{fontSize:"0.63rem",color:"#64748B",fontFamily:"var(--font-mono)",lineHeight:1.5}}>{a.status}</p>
            </div>
          ))}
        </motion.div>
      </section>

      <div className="divider"/>

      {/* ── HOW IT THINKS ── */}
      <section id="product" style={{padding:"8rem 0",background:"white",position:"relative",zIndex:10}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 2rem"}}>
          <Reveal>
            <p className="label-blue" style={{marginBottom:"1.25rem"}}>The Orchestration Pipeline</p>
            <h2 className="display-2" style={{maxWidth:560,marginBottom:"5rem"}}>How Sentinel<br/>Thinks.</h2>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)"}}>
            {[
              {n:"01",label:"Ingest",    desc:"4M telemetry events/sec from all nodes."},
              {n:"02",label:"Correlate", desc:"Operational context reconstructed instantly."},
              {n:"03",label:"Detect",    desc:"Anomalies found via causal structural models."},
              {n:"04",label:"Reason",    desc:"6-agent fleet isolates root cause in seconds."},
              {n:"05",label:"Execute",   desc:"Autonomous rollback with zero human input."},
              {n:"06",label:"Learn",     desc:"Patterns encoded to persistent neural memory."},
            ].map((s,i)=>(
              <Reveal key={s.n} delay={i*0.07}>
                <div style={{padding:"2rem 1.5rem",borderTop:"2px solid rgba(148,180,255,0.2)",borderRight:i<5?"1px solid rgba(148,180,255,0.12)":"none"}}>
                  <div style={{fontSize:"0.6rem",fontWeight:700,color:"#3B82F6",letterSpacing:"0.2em",marginBottom:"1.25rem"}}>{s.n}</div>
                  <div style={{fontSize:"1rem",fontWeight:800,color:"#0F172A",marginBottom:"0.6rem",letterSpacing:"-0.02em"}}>{s.label}</div>
                  <p style={{fontSize:"0.75rem",color:"#64748B",lineHeight:1.65}}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="divider"/>

      {/* ── LIVE DEMO ── */}
      <section id="agents" style={{padding:"8rem 0",background:"#F8FBFF",position:"relative",zIndex:10}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 2rem"}}>
          <Reveal>
            <p className="label-blue" style={{marginBottom:"1.25rem"}}>Simulation Engine</p>
            <h2 className="display-2" style={{marginBottom:"1.25rem"}}>See It Think.</h2>
            <p style={{fontSize:"1rem",color:"#64748B",maxWidth:480,marginBottom:"4rem",lineHeight:1.75}}>
              Watch Sentinel autonomously resolve a cascading database failure with zero human intervention.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:"2rem"}}>
              <div>
                <div className="card" style={{padding:"1.75rem",marginBottom:"1.25rem"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
                    <span style={{fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.15em",textTransform:"uppercase",color:"#94A3B8"}}>INC-992</span>
                    <span style={{fontSize:"0.6rem",fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase",color:"#EF4444",background:"rgba(239,68,68,0.08)",padding:"0.25rem 0.65rem",borderRadius:100,border:"1px solid rgba(239,68,68,0.2)"}}>Critical</span>
                  </div>
                  <h3 style={{fontSize:"1.1rem",fontWeight:800,color:"#0F172A",marginBottom:"0.75rem",letterSpacing:"-0.02em"}}>Database Saturation</h3>
                  <p style={{fontSize:"0.75rem",color:"#64748B",lineHeight:1.65}}>Connection pool exhausted (100/100) in order-service. Latency at 4.2s. Cascade risk: HIGH.</p>
                </div>
                {["Deploy hook received","Anomaly detected","Root cause isolated","Rollback executed","System recovered"].map((s,i)=>(
                  <div key={s} style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.75rem 1rem",borderRadius:12,marginBottom:"0.5rem",
                    background:i<4?"rgba(59,130,246,0.05)":"transparent",border:`1px solid ${i<4?"rgba(59,130,246,0.15)":"rgba(148,180,255,0.15)"}`}}>
                    <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:"0.6rem",fontWeight:900,flexShrink:0,
                      background:i<4?"#3B82F6":"#F1F5F9",color:i<4?"white":"#94A3B8"}}>{i+1}</div>
                    <span style={{fontSize:"0.72rem",fontWeight:700,color:i<4?"#0F172A":"#94A3B8"}}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{background:"#0F172A",borderRadius:20,overflow:"hidden",height:480,boxShadow:"0 20px 60px rgba(15,23,42,0.15)"}}>
                <AgentActivity thoughts={demoThoughts} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="divider"/>

      {/* ── ARCHITECTURE ── */}
      <section id="architecture" style={{padding:"8rem 0",background:"white",position:"relative",zIndex:10}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 2rem"}}>
          <Reveal><p className="label-blue" style={{marginBottom:"1.25rem"}}>Technical Foundation</p>
            <h2 className="display-2" style={{marginBottom:"5rem"}}>Built for<br/>production scale.</h2>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.25rem"}}>
            {[
              {tag:"Core Engine",title:"LangGraph Orchestration",desc:"Stateful multi-agent workflows with branching, parallel execution, and conditional routing across the full incident lifecycle."},
              {tag:"Memory Layer",title:"pgvector Memory",desc:"Persistent episodic memory via vector similarity. Every resolved incident is encoded and retrieved with 0.94+ accuracy."},
              {tag:"Data Pipeline",title:"WebSocket Telemetry",desc:"Sub-100ms event streaming. Zero-buffering anomaly detection at 4M telemetry events per second."},
              {tag:"Execution",title:"Autonomous Actions",desc:"Direct kubectl integration for rollbacks, scaling, and patching — no human-in-the-loop for L1/L2 incidents."},
              {tag:"RCA Engine",title:"Causal Graph Engine",desc:"Structural causal models trained on operational topology. 98.4% confidence across complex microservice chains."},
              {tag:"Security",title:"Policy Enforcement",desc:"All remediation scripts validated before execution. Privilege escalation detection and cryptographic audit trails."},
            ].map((c,i)=>(
              <Reveal key={c.title} delay={i*0.07}>
                <div className="card" style={{padding:"2rem"}}>
                  <p className="label-blue" style={{marginBottom:"1rem"}}>{c.tag}</p>
                  <h3 style={{fontSize:"1rem",fontWeight:800,color:"#0F172A",marginBottom:"0.75rem",letterSpacing:"-0.02em"}}>{c.title}</h3>
                  <p style={{fontSize:"0.78rem",color:"#64748B",lineHeight:1.7}}>{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="divider"/>

      {/* ── CTA ── */}
      <section style={{padding:"10rem 0",textAlign:"center",position:"relative",zIndex:10}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"60vw",height:"50vh",borderRadius:"50%",
          background:"radial-gradient(ellipse,rgba(59,130,246,0.07) 0%,transparent 65%)",pointerEvents:"none"}}/>
        <div style={{maxWidth:800,margin:"0 auto",padding:"0 2rem",position:"relative"}}>
          <Reveal>
            <h2 className="display-2" style={{marginBottom:"1.5rem",lineHeight:1}}>
              The Future of DevOps<br/><span className="text-grad-blue">Is Autonomous.</span>
            </h2>
            <p style={{fontSize:"1.1rem",color:"#64748B",marginBottom:"3rem",fontWeight:450}}>
              AI agents operating production infrastructure in real time.
            </p>
            <Link href="/login" className="btn-primary" style={{fontSize:"0.82rem",padding:"1rem 2.5rem"}}>
              Start Autonomous Recovery <ArrowUpRight size={15}/>
            </Link>
          </Reveal>
        </div>
      </section>

      <div className="divider"/>

      {/* ── FOOTER ── */}
      <footer style={{padding:"3rem 0",background:"white",position:"relative",zIndex:10}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 2rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
            <Shield size={14} style={{color:"#3B82F6"}} strokeWidth={2.5}/>
            <span style={{fontSize:"0.75rem",fontWeight:900,letterSpacing:"0.15em",textTransform:"uppercase",color:"#0F172A"}}>SENTINEL_ONE</span>
          </div>
          <p style={{fontSize:"0.65rem",fontWeight:600,color:"#94A3B8",letterSpacing:"0.1em",textTransform:"uppercase"}}>Autonomous Infrastructure Intelligence · 2025</p>
          <Link href="/login" style={{fontSize:"0.65rem",fontWeight:700,color:"#3B82F6",letterSpacing:"0.1em",textTransform:"uppercase",textDecoration:"none"}}>Dashboard →</Link>
        </div>
      </footer>
    </div>
  );
}
