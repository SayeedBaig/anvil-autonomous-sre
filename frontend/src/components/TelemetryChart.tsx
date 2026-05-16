import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface TelemetryChartProps {
  data: any[];
  service: string;
  metric: "cpu" | "latency" | "error_rate";
  color: string;
}

export default function TelemetryChart({ data, service, metric, color }: TelemetryChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function formatTime(ts: any): string {
    if (!ts) return "--:--:--";
    try {
      // Detect if ts is in seconds (e.g. < 10^11) or milliseconds
      const date = new Date(ts < 1e11 ? ts * 1000 : ts);
      if (isNaN(date.getTime())) return "--:--:--";
      return date.toLocaleTimeString([], { 
        hour12: false, 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit" 
      });
    } catch {
      return "--:--:--";
    }
  }

  const chartData = data.map(d => {
    // Handle socket telemetry format { timestamp, services: { [svc]: { cpu, latency, error_rate } } }
    if (d.services) {
      return {
        time: formatTime(d.timestamp),
        value: d.services[service]?.[metric] ?? 0,
      };
    }
    // Handle mock format { time, value }
    return { time: d.time ?? "", value: d.value ?? 0 };
  }).slice(-30);

  if (!isMounted) return <div className="w-full h-full bg-white/2 rounded-lg" />;

  return (
    <div style={{ width: "100%", height: "100%", minHeight: 40 }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={40}>
        <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <XAxis dataKey="time" hide />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0d0e12",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              fontSize: "10px",
              fontFamily: "monospace",
            }}
            itemStyle={{ color }}
            labelStyle={{ color: "#475569", fontSize: "9px" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
