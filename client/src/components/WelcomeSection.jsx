import React from "react";
import { Sparkles, BookOpen, Award, FileText, Library, HelpCircle, Briefcase } from "lucide-react";

const CATEGORY_ITEMS = [
  { icon: FileText, label: "Admissions & Documents" },
  { icon: BookOpen, label: "Courses & Eligibility" },
  { icon: Award, label: "Fees & Scholarships" },
  { icon: HelpCircle, label: "Examinations & Grading" },
  { icon: Library, label: "Library & Lab Facilities" },
  { icon: Briefcase, label: "Placements & Internships" },
  { icon: Sparkles, label: "Department Support & HOD" },
];

export function WelcomeSection() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 mb-6 shadow-sm">
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Welcome to the Department FAQ Assistant!
          </h2>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            I can assist you with frequently asked questions regarding academics, admissions, campus amenities, examinations, and departmental resources.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-slate-100">
        {CATEGORY_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-50/80 rounded-lg text-xs font-medium text-slate-700"
            >
              <Icon className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
