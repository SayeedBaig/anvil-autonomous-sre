import { useState, useEffect } from 'react';

export interface TelemetryPoint {
  timestamp: number;
  services: Record<string, {
    cpu: number;
    latency: number;
    error_rate: number;
  }>;
}

const MOCK_SERVICES = ['election ai (production)', 'checkout-svc', 'payment-gateway', 'auth-provider'];

export function useDemoData(isLive: boolean) {
  const [mockTelemetry, setMockTelemetry] = useState<TelemetryPoint[]>([]);

  useEffect(() => {
    if (isLive) return;

    // Initialize with 30 points
    const now = Date.now() / 1000;
    const initial = Array.from({ length: 30 }).map((_, i) => ({
      timestamp: now - (30 - i) * 5,
      services: MOCK_SERVICES.reduce((acc, svc) => ({
        ...acc,
        [svc]: {
          cpu: 20 + Math.random() * 40,
          latency: 100 + Math.random() * 200,
          error_rate: Math.random() * 0.05
        }
      }), {})
    }));
    setMockTelemetry(initial);

    // Update every 5s
    const interval = setInterval(() => {
      setMockTelemetry(prev => {
        const next = [...prev.slice(1)];
        const lastTs = prev[prev.length - 1]?.timestamp || Date.now() / 1000;
        next.push({
          timestamp: lastTs + 5,
          services: MOCK_SERVICES.reduce((acc, svc) => ({
            ...acc,
            [svc]: {
              cpu: 20 + Math.random() * 40,
              latency: 100 + Math.random() * 200,
              error_rate: Math.random() * 0.05
            }
          }), {})
        });
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  return mockTelemetry;
}
