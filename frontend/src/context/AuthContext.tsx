"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiUrl } from "@/lib/config";

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("sentinel_token");
      if (storedToken) {
        try {
          const res = await fetch(apiUrl("/api/auth/me"), {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            setToken(storedToken);
          } else {
            localStorage.removeItem("sentinel_token");
          }
        } catch (error) {
          console.error("Auth init failed", error);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isPublicPath = ["/", "/login", "/signup"].includes(pathname);
      if (!user && !isPublicPath) {
        router.push("/login");
      } else if (user && (pathname === "/login" || pathname === "/signup")) {
        router.push(user.role === "admin" ? "/admin" : "/dashboard");
      } else if (user && pathname.startsWith("/admin") && user.role !== "admin") {
        router.push("/dashboard"); // Redirect normal users away from admin
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem("sentinel_token", newToken);
    setToken(newToken);
    setUser(userData);
    router.push(userData.role === "admin" ? "/admin" : "/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("sentinel_token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
