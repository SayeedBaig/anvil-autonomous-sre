// Central API configuration — reads from environment variables.
// Set NEXT_PUBLIC_API_URL in .env.local for local dev,
// or in your Vercel/Cloud Run deployment environment for production.

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || API_URL;

export function apiUrl(path: string): string {
  // Ensures no double-slash if path starts with /
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function authHeaders(token: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}
