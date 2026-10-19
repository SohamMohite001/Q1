import React from "react";
import { MessageSquare, HelpCircle } from "lucide-react";

const SUGGESTED_QUERIES = [
  { text: "How can I apply for admission to the college?", tag: "Admissions" },
  { text: "What documents are required during admission verification?", tag: "Admissions" },
  { text: "What undergraduate academic programs are offered?", tag: "Courses" },
  { text: "What are the accepted modes of payment for tuition fees?", tag: "Fees" },
  { text: "What is the minimum mandatory attendance percentage?", tag: "Exams" },
  { text: "How does the Training and Placement Cell assist students?", tag: "Placements" },
  { text: "Where is the department office located?", tag: "Support" },
  { text: "Can I bring a pet parrot into the computer laboratory?", tag: "Absent / Fallback Test" }
];

export function SuggestedQuestions({ onSelectQuestion, disabled }) {
  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
        <span>Suggested Frequently Asked Questions:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_QUERIES.map((item, idx) => (
          <button
            key={idx}
            disabled={disabled}
            onClick={() => onSelectQuestion(item.text)}
            className="group inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-brand-50/80 active:bg-brand-100/80 border border-slate-200 hover:border-brand-300 rounded-full text-xs text-slate-700 hover:text-brand-700 font-medium transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed text-left"
          >
            <span className="truncate max-w-[280px] sm:max-w-none">{item.text}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-brand-600 bg-slate-100 group-hover:bg-brand-100 px-1.5 py-0.5 rounded-full">
              {item.tag}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
