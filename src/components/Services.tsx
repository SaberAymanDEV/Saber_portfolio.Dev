import React from "react";
import * as Icons from "lucide-react";
import { translations } from "../translations";
import { Service } from "../types";

interface ServicesProps {
  lang: "en" | "ar";
  services: Service[];
}

export default function Services({ lang, services }: ServicesProps) {
  const t = translations[lang];

  // Micro helper to render Lucide Icons by name dynamically
  const renderIcon = (iconName: string) => {
    // Resolve icon from lucide exports
    const LucideIcon = (Icons as any)[iconName] || Icons.Cpu;
    return <LucideIcon className="h-6 w-6" />;
  };

  return (
    <section 
      id="services" 
      className="py-12 md:py-20 section-shading-primary text-slate-900 dark:text-white"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16 space-y-3">
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 uppercase">
            {t.servicesBadge}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-sans tracking-tight text-slate-900 dark:text-white">
            {t.servicesTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-sans">
            {t.servicesSubtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-indigo-500/40 dark:hover:border-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-sm relative group overflow-hidden"
            >
              {/* Decorative top grid glow accent */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating Number indicator */}
              <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-xl md:text-2xl font-black font-mono text-slate-300 dark:text-slate-800/45">
                0{index + 1}
              </div>

              {/* Icon Container */}
              <div className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 dark:from-red-600/0 dark:to-red-600/0 dark:bg-slate-900 dark:border dark:border-slate-800 text-blue-400 mb-4 md:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                {renderIcon(service.iconName)}
              </div>

              {/* Title & Desc */}
              <h3 className="text-base md:text-lg font-bold font-sans tracking-tight mb-2 text-slate-900 dark:text-slate-100">
                {lang === "ar" ? service.titleAr : service.titleEn}
              </h3>
              
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans line-clamp-3 md:line-clamp-none">
                {lang === "ar" ? service.descAr : service.descEn}
              </p>

              {/* Tech tag highlights */}
              <div className="mt-4 md:mt-6 flex flex-wrap gap-1.5 border-t border-slate-200 dark:border-slate-900 pt-3 md:pt-4">
                <span className="text-[9px] md:text-[10px] font-mono text-slate-550 dark:text-slate-500 px-1.5 py-0.5 rounded bg-slate-205 dark:bg-slate-950">
                  Fully Responsive
                </span>
                <span className="text-[9px] md:text-[10px] font-mono text-slate-550 dark:text-slate-500 px-1.5 py-0.5 rounded bg-slate-205 dark:bg-slate-950">
                  Bilingual Support
                </span>
                <span className="text-[9px] md:text-[10px] font-mono text-slate-550 dark:text-slate-500 px-1.5 py-0.5 rounded bg-slate-205 dark:bg-slate-950">
                  CMS Managed
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
