"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CheckCircle2 } from "lucide-react";

export default function IncidentBanner({ status, incidentId }: { status: string; incidentId: string | null }) {
  const isHealthy     = status === "healthy";
  const isRemediating = status === "remediating";

  const config = isHealthy
    ? { bg:"rgba(16,185,129,0.05)",  border:"rgba(16,185,129,0.2)",  dot:"dot-green",  text:"#059669", label:"All Systems Nominal",           sub:"All 42 nodes operating within normal parameters." }
    : isRemediating
    ? { bg:"rgba(245,158,11,0.05)",  border:"rgba(245,158,11,0.2)",  dot:"dot-amber",  text:"#D97706", label:`Remediating · ${incidentId??""}`  , sub:"Autonomous rollback in progress. Draining traffic from affected nodes." }
    : { bg:"rgba(239,68,68,0.05)",   border:"rgba(239,68,68,0.2)",   dot:"dot-blue",   text:"#DC2626", label:`Active Incident · ${incidentId??""}`, sub:"Root cause investigation in progress. Agent fleet deployed." };

  return (
    <AnimatePresence mode="wait">
      <motion.div key={status}
        initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
        transition={{duration:0.35,ease:[0.22,1,0.36,1]}}
        style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"0.6rem 1rem",borderRadius:12,marginBottom:2,
          background:config.bg,border:`1px solid ${config.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
          <span className={config.dot} style={{width:7,height:7,borderRadius:"50%",display:"inline-block",flexShrink:0,animation:"blink 2s ease-in-out infinite"}}/>
          <div>
            <p style={{fontSize:"0.72rem",fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",color:config.text}}>{config.label}</p>
            <p style={{fontSize:"0.7rem",color:"#64748B",marginTop:2}}>{config.sub}</p>
          </div>
        </div>
        {!isHealthy && (
          <div style={{display:"flex",alignItems:"center",gap:"0.4rem",padding:"0.35rem 0.85rem",
            borderRadius:100,border:`1px solid ${config.border}`,background:config.bg}}>
            <Zap size={10} style={{color:config.text}}/>
            <span style={{fontSize:"0.6rem",fontWeight:800,letterSpacing:"0.15em",textTransform:"uppercase",color:config.text}}>
              {isRemediating?"Remediating":"Auto-Response"}
            </span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
