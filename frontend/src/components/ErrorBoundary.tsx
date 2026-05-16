"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050608] flex items-center justify-center p-6 text-slate-200">
          <div className="max-w-md w-full bg-[#0d0e12] border border-white/5 rounded-3xl p-10 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">System Interruption</h1>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              The neural core encountered an unexpected state. This incident has been logged for remediation.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                REBOOT CORE
              </button>
              
              <Link 
                href="/"
                className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-white/5"
              >
                <Home className="w-4 h-4" />
                RETURN HOME
              </Link>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-8 text-[10px] text-red-400 text-left overflow-auto max-h-32 p-3 bg-black/40 rounded-lg border border-red-500/20">
                {this.state.error?.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
