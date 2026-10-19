import React from "react";
import { GraduationCap, Trash2, ShieldAlert, Activity } from "lucide-react";

export function Header({ onClearChat, isConnected, totalFaqs = 34 }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Department of Computer Science & Engineering
            </h1>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">FAQ & Student Support Assistant</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}></span>
                <span>{isConnected ? "Service Online" : "Connecting..."}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right actions & Badges */}
        <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Sample Data Mode</span>
          </div>

          <button
            onClick={onClearChat}
            title="Clear chat conversation"
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Prominent Sample Data Notice Banner */}
      <div className="bg-amber-500/10 border-t border-amber-200/60 px-4 py-1.5 text-center text-xs text-amber-900">
        <span className="font-bold tracking-wide">SAMPLE DATA — NOT VERIFIED COLLEGE INFORMATION.</span>{" "}
        <span className="hidden sm:inline">Answers are illustrative for academic demonstration and do not reflect official institutional policies.</span>
      </div>
    </header>
  );
}
