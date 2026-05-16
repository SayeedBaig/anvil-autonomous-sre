"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface TelemetryChartProps {
  data: any[];
  service: string;
  metric: "cpu" | "latency" | "error_rate";
  color: string;
}

export default function TelemetryChart({ data, service, metric, color }: TelemetryChartProps) {
  const chartData = data.map(d => {
    // Handle socket telemetry format { timestamp, services: { [svc]: { cpu, latency, error_rate } } }
    if (d.services) {
      return {
        time: new Date(d.timestamp * 1000).toLocaleTimeString(),
        value: d.services[service]?.[metric] ?? 0,
      };
    }
    // Handle mock format { time, value }
    return { time: d.time ?? "", value: d.value ?? 0 };
  }).slice(-30);

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
