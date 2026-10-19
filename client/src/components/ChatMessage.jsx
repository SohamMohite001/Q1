import React, { useState } from "react";
import { Bot, User, Check, Copy, AlertTriangle, ShieldCheck, Sparkles, RefreshCw } from "lucide-react";

export function ChatMessage({ message, onRetry }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end items-start space-x-2.5 mb-4 group">
        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
          <div className="bg-brand-600 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 px-1">
            {message.timestamp}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // Assistant Message
  const isFallback = message.mode === "fallback" || message.answeredFromKnowledgeBase === false;
  const isAiGrounded = message.mode === "ai";

  return (
    <div className="flex justify-start items-start space-x-2.5 mb-4 group">
      <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
        <Bot className="w-4 h-4 text-brand-300" />
      </div>

      <div className="flex flex-col items-start max-w-[90%] sm:max-w-[80%]">
        <div
          className={`w-full rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs text-sm leading-relaxed border ${
            message.isError
              ? "bg-red-50/80 border-red-200 text-red-900"
              : isFallback
              ? "bg-amber-50/60 border-amber-200/80 text-slate-800"
              : "bg-white border-slate-200 text-slate-800"
          }`}
        >
          {/* Answer text safely rendered */}
          <div className="whitespace-pre-wrap break-words">{message.content}</div>

          {/* Badges & Meta */}
          {!message.isError && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              {message.answeredFromKnowledgeBase && message.sourceFaqIds?.length > 0 && (
                <div className="inline-flex items-center space-x-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-medium text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Verified Source: {message.sourceFaqIds.join(", ")}</span>
                </div>
              )}

              {isAiGrounded && (
                <div className="inline-flex items-center space-x-1 px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md font-medium text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Nemotron Grounded</span>
                </div>
              )}

              {isFallback && (
                <div className="inline-flex items-center space-x-1 px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded-md font-medium text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Knowledge Base Fallback</span>
                </div>
              )}

              {message.score && (
                <span className="text-[10px] text-slate-400 font-mono">
                  Confidence: {Math.round(message.score * 100)}%
                </span>
              )}
            </div>
          )}

          {/* Error retry option */}
          {message.isError && onRetry && (
            <div className="mt-2 pt-2 border-t border-red-200 flex items-center justify-between">
              <span className="text-xs text-red-700 font-medium">Failed to reach department server.</span>
              <button
                onClick={onRetry}
                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-xs font-semibold transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer info: timestamp and copy button */}
        <div className="flex items-center space-x-2 mt-1 px-1 text-[10px] text-slate-400">
          <span>{message.timestamp}</span>
          {!message.isError && (
            <>
              <span>•</span>
              <button
                onClick={handleCopy}
                className="hover:text-slate-600 inline-flex items-center space-x-1 transition-colors"
                title="Copy message to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
