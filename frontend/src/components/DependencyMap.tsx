"use client";
import { motion } from "framer-motion";
import { Server, Database, Globe, Cpu, Wifi } from "lucide-react";

const NODES = [
  { id:"gateway", label:"API Gateway",    icon:<Globe   size={14}/>, center:true,  pos:{left:"50%",top:"46%"} },
  { id:"auth",    label:"Auth",           icon:<Server  size={10}/>, center:false, pos:{left:"28%",top:"30%"} },
  { id:"db",      label:"DB",             icon:<Database size={10}/>,center:false, pos:{left:"72%",top:"30%"} },
  { id:"worker",  label:"Worker",         icon:<Cpu     size={10}/>, center:false, pos:{left:"28%",top:"62%"} },
  { id:"cache",   label:"Cache",          icon:<Wifi    size={10}/>, center:false, pos:{left:"72%",top:"62%"} },
];

export default function DependencyMap() {
  return (
    <div style={{height:"100%",width:"100%",position:"relative",overflow:"hidden",padding:12}}>
      {/* SVG edges */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
        <defs>
          <linearGradient id="edgeG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#3B82F6" stopOpacity="0.05"/>
            <stop offset="50%"  stopColor="#3B82F6" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05"/>
          </linearGradient>
        </defs>
        {[["50%","46%","28%","30%"],["50%","46%","72%","30%"],["50%","46%","28%","62%"],["50%","46%","72%","62%"]].map(([x1,y1,x2,y2],i)=>(
          <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="url(#edgeG)" strokeWidth="1" strokeDasharray="6 6"
            animate={{strokeDashoffset:[0,-24]}}
            transition={{duration:3+i*0.5,repeat:Infinity,ease:"linear"}}/>
        ))}
      </svg>

      {/* Nodes */}
      {NODES.map((n,i)=>(
        <motion.div key={n.id}
          initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}}
          transition={{delay:i*0.1,duration:0.5,ease:[0.22,1,0.36,1]}}
          style={{position:"absolute",transform:"translate(-50%,-50%)",left:n.pos.left,top:n.pos.top,
            display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
          <div style={{
            width:n.center?38:28,height:n.center?38:28,
            borderRadius:n.center?12:8,
            display:"flex",alignItems:"center",justifyContent:"center",
            background:n.center?"linear-gradient(135deg,rgba(59,130,246,0.12),rgba(103,232,249,0.15))":"white",
            border:n.center?"1.5px solid rgba(59,130,246,0.3)":"1px solid rgba(148,180,255,0.25)",
            color:n.center?"#2563EB":"#64748B",
            boxShadow:n.center?"0 4px 16px rgba(59,130,246,0.1)":"0 1px 4px rgba(59,130,246,0.04)",
            transition:"all 0.2s",
          }}>
            {n.icon}
          </div>
          <span style={{fontSize:"0.58rem",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",
            color:n.center?"#0F172A":"#64748B",whiteSpace:"nowrap"}}>{n.label}</span>
          <span className="dot-green" style={{width:5,height:5,borderRadius:"50%",display:"inline-block"}}/>
        </motion.div>
      ))}

      {/* Footer stats */}
      <div style={{position:"absolute",bottom:10,left:12,right:12,display:"flex",gap:8}}>
        {[{label:"Nodes",val:"42"},{label:"Links",val:"128"},{label:"Health",val:"99.9%",c:"#10B981"}].map(m=>(
          <div key={m.label} style={{display:"flex",alignItems:"center",gap:5,padding:"0.3rem 0.6rem",
            background:"rgba(248,251,255,0.9)",border:"1px solid rgba(148,180,255,0.2)",borderRadius:8}}>
            <span style={{fontSize:"0.58rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#94A3B8"}}>{m.label}</span>
            <span style={{fontSize:"0.65rem",fontWeight:800,color:m.c??"#0F172A"}}>{m.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
