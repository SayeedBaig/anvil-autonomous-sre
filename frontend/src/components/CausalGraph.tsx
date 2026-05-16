"use client";
import { motion, AnimatePresence } from "framer-motion";

interface GraphData {
  nodes: { id: string; label: string; type?: string }[];
  edges?: { source: string; target: string }[];
  links?: { source: string; target: string }[];
}

const NODE_STYLES: Record<string, { border: string; bg: string; color: string }> = {
  root_cause: { border:"rgba(239,68,68,0.4)",  bg:"rgba(239,68,68,0.06)",  color:"#DC2626" },
  event:      { border:"rgba(59,130,246,0.3)",  bg:"rgba(59,130,246,0.06)", color:"#2563EB" },
  symptom:    { border:"rgba(245,158,11,0.3)",  bg:"rgba(245,158,11,0.06)", color:"#D97706" },
  default:    { border:"rgba(148,180,255,0.3)", bg:"rgba(248,251,255,1)",   color:"#334155" },
};

const POSITIONS: [number, number][] = [[50,15],[50,50],[50,85]];

export default function CausalGraph({ graphData }: { graphData: GraphData | null }) {
  if (!graphData) return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"0.75rem",color:"#94A3B8"}}>
      <motion.div animate={{rotate:360}} transition={{duration:8,repeat:Infinity,ease:"linear"}}
        style={{width:28,height:28,borderRadius:"50%",border:"1.5px solid rgba(148,180,255,0.3)",borderTopColor:"#3B82F6"}}/>
      <span style={{fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase"}}>Awaiting analysis</span>
    </div>
  );

  const edges = graphData.edges ?? graphData.links ?? [];
  const nodes = graphData.nodes ?? [];
  const positioned = nodes.map((n,i) => ({...n, x:POSITIONS[i]?.[0]??50, y:POSITIONS[i]?.[1]??50}));
  const nodeMap = Object.fromEntries(positioned.map(n=>[n.id,n]));

  return (
    <div style={{height:"100%",width:"100%",position:"relative",overflow:"hidden"}}>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="rgba(59,130,246,0.4)"/>
          </marker>
        </defs>
        {edges.map((e,i)=>{
          const s=nodeMap[e.source], t=nodeMap[e.target];
          if(!s||!t) return null;
          return <motion.line key={i} x1={`${s.x}%`} y1={`${s.y}%`} x2={`${t.x}%`} y2={`${t.y}%`}
            stroke="rgba(59,130,246,0.2)" strokeWidth="0.8" strokeDasharray="3 3"
            initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1}}
            markerEnd="url(#arr)"/>;
        })}
      </svg>
      <AnimatePresence>
        {positioned.map((node,i)=>{
          const style = NODE_STYLES[node.type??"default"] ?? NODE_STYLES.default;
          return (
            <motion.div key={node.id}
              initial={{opacity:0,scale:0.7}} animate={{opacity:1,scale:1}}
              transition={{delay:i*0.2,duration:0.5,ease:[0.22,1,0.36,1]}}
              style={{position:"absolute",transform:"translate(-50%,-50%)",left:`${node.x}%`,top:`${node.y}%`,
                padding:"0.35rem 0.75rem",borderRadius:8,border:`1px solid ${style.border}`,
                background:style.bg,fontSize:"0.62rem",fontWeight:800,letterSpacing:"0.08em",
                textTransform:"uppercase",color:style.color,whiteSpace:"nowrap"}}>
              {node.label}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
