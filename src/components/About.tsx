import React from "react";
import { GraduationCap, Brain, Zap, CheckCircle2, Award } from "lucide-react";
import { translations } from "../translations";
import { Profile } from "../types";

interface AboutProps {
  lang: "en" | "ar";
  profile: Profile;
}

export default function About({ lang, profile }: AboutProps) {
  const t = translations[lang];

  return (
    <section 
      id="about" 
      className="py-12 md:py-20 section-shading-primary text-slate-900 dark:text-white"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16 space-y-3">
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 uppercase">
            {t.aboutBadge}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-sans tracking-tight text-slate-900 dark:text-white">
            {t.aboutTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-sans">
            {t.aboutIntro}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Biography texts */}
          <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed font-sans text-sm md:text-base">
            <p className="border-l-4 border-blue-600 pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pr-4 font-medium text-slate-800 dark:text-slate-100 text-lg md:text-xl leading-relaxed">
              {lang === "ar" ? profile.bioAr.split("\n")[0] : profile.bioEn.split("\n")[0]}
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">
              {lang === "ar" ? profile.bioAr.split("\n")[1] : profile.bioEn.split("\n")[1]}
            </p>
            
            {/* Short education badge */}
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 mt-6">
              <GraduationCap className="h-6 w-6 text-indigo-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold font-sans">Education Credentials</p>
                <p className="text-xs md:text-sm font-semibold text-slate-850 dark:text-slate-200">
                  {lang === "ar" ? profile.educationAr : profile.educationEn}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive BENTO-style Highlights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {/* Bento-card 1 */}
            <div className="p-4 md:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-slate-800 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-sm">
              <div className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 mb-3 md:mb-4 animate-pulse">
                <GraduationCap className="h-4.5 w-4.5 md:h-5 md:w-5" />
              </div>
              <h4 className="text-sm font-bold font-sans mb-1 text-slate-900 dark:text-slate-100">
                {t.highlightSelfTaught}
              </h4>
              <p className="text-[11px] md:text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans mt-1">
                {t.highlightSelfTaughtDesc}
              </p>
            </div>

            {/* Bento-card 2 */}
            <div className="p-4 md:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-slate-800 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-sm">
              <div className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-xl bg-violet-600/10 text-violet-400 mb-3 md:mb-4">
                <Brain className="h-4.5 w-4.5 md:h-5 md:w-5" />
              </div>
              <h4 className="text-sm font-bold font-sans mb-1 text-slate-900 dark:text-slate-100">
                {t.highlightAi}
              </h4>
              <p className="text-[11px] md:text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans mt-1">
                {t.highlightAiDesc}
              </p>
            </div>

            {/* Bento-card 3 */}
            <div className="p-4 md:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-slate-800 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-sm">
              <div className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-xl bg-amber-600/10 text-amber-400 mb-3 md:mb-4">
                <Zap className="h-4.5 w-4.5 md:h-5 md:w-5" />
              </div>
              <h4 className="text-sm font-bold font-sans mb-1 text-slate-900 dark:text-slate-100">
                {t.highlightPerformance}
              </h4>
              <p className="text-[11px] md:text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans mt-1">
                {t.highlightPerformanceDesc}
              </p>
            </div>

            {/* Bento-card 4 */}
            <div className="p-4 md:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-slate-800 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-sm">
              <div className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-400 mb-3 md:mb-4">
                <CheckCircle2 className="h-4.5 w-4.5 md:h-5 md:w-5" />
              </div>
              <h4 className="text-sm font-bold font-sans mb-1 text-slate-900 dark:text-slate-100">
                {t.highlightProblemSolver}
              </h4>
              <p className="text-[11px] md:text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans mt-1">
                {t.highlightProblemSolverDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
