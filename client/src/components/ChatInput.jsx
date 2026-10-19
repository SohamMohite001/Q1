import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

export function ChatInput({ onSendMessage, disabled, placeholder = "Ask a question about admissions, courses, fees, exams..." }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const maxLength = 500;

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 p-3 sm:p-4 sticky bottom-0 z-10 shadow-lg">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, maxLength))}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            aria-label="Question to college FAQ assistant"
            className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 text-sm rounded-xl pl-4 pr-24 py-3.5 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
          />

          <div className="absolute right-2 flex items-center space-x-1.5">
            <span className={`text-[10px] font-mono mr-1 hidden sm:inline ${
              input.length > 450 ? "text-amber-600 font-bold" : "text-slate-400"
            }`}>
              {input.length}/{maxLength}
            </span>

            <button
              type="submit"
              disabled={disabled || !input.trim()}
              title="Send question (Enter)"
              className="w-9 h-9 rounded-lg bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center transition-all shadow-xs disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-1">
          <span>Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] text-slate-600">Enter ↵</kbd> to submit</span>
          <span className="hidden sm:inline">Answers are retrieved exclusively from the structured knowledge base</span>
        </div>
      </form>
    </div>
  );
}
