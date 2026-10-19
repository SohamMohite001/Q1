import React from "react";
import { Bot } from "lucide-react";

export function LoadingIndicator() {
  return (
    <div className="flex items-start space-x-3 mb-4 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
        <Bot className="w-4 h-4" />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
          <span>Searching knowledge base</span>
          <div className="flex space-x-1">
            <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
            <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
            <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
          </div>
        </div>
      </div>
    </div>
  );
}
