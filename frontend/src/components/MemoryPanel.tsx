"use client";
import { motion, AnimatePresence } from "framer-motion";

interface MemoryItem { id: string; title: string; similarity?: number; }

export default function MemoryPanel({ memory = [] }: { memory?: MemoryItem[] }) {
  const items = Array.isArray(memory) ? memory : [];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",overflowY:"auto",height:"100%"}} className="scrollbar-hide">
      <AnimatePresence initial={false}>
        {items.map((inc, i) => {
          const pct = inc.similarity != null ? Math.round(inc.similarity * 100) : 94;
          return (
            <motion.div key={inc.id}
              initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}
              transition={{delay:i*0.1,duration:0.4,ease:[0.22,1,0.36,1]}}
              style={{padding:"0.65rem 0.85rem",borderRadius:10,border:"1px solid rgba(148,180,255,0.2)",
                background:"rgba(248,251,255,0.8)",cursor:"default",transition:"all 0.2s"}}
              onMouseEnter={e=>(e.currentTarget.style.borderColor="rgba(59,130,246,0.3)")}
              onMouseLeave={e=>(e.currentTarget.style.borderColor="rgba(148,180,255,0.2)")}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                <span style={{fontSize:"0.6rem",fontFamily:"var(--font-mono)",color:"#94A3B8"}}>{inc.id}</span>
                <span style={{fontSize:"0.6rem",fontWeight:800,color:"#3B82F6",background:"rgba(59,130,246,0.08)",
                  padding:"0.15rem 0.5rem",borderRadius:100,border:"1px solid rgba(59,130,246,0.15)"}}>{pct}% match</span>
              </div>
              <p style={{fontSize:"0.72rem",fontWeight:700,color:"#0F172A"}}>{inc.title}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {items.length === 0 && (
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",
          fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#94A3B8"}}>
          No patterns in memory
        </div>
      )}
    </div>
  );
}
