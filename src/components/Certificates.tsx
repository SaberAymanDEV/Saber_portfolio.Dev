import React, { useState } from "react";
import { Award, ExternalLink, X, ShieldCheck, Calendar, Sparkles } from "lucide-react";
import { translations } from "../translations";
import { Certificate } from "../types";

interface CertificatesProps {
  lang: "en" | "ar";
  certificates: Certificate[];
}

export default function Certificates({ lang, certificates }: CertificatesProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const t = translations[lang];

  return (
    <section 
      id="certificates" 
      className="py-12 md:py-20 section-shading-primary text-slate-900 dark:text-white"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16 space-y-3">
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 uppercase">
            {t.certificatesBadge}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-sans tracking-tight text-slate-900 dark:text-white">
            {t.certificatesTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-sans">
            {t.certificatesSubtitle}
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {certificates.map((cert) => (
            <div 
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className="p-3 md:p-6 rounded-2xl md:rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-slate-305 dark:hover:border-slate-800 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-sm group cursor-pointer relative overflow-hidden flex flex-col justify-between"
            >
              {/* Star sparkles banner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-550/10 rounded-full blur-xl group-hover:bg-blue-550/20 transition-all pointer-events-none"></div>

              <div>
                {/* Cover display thumbnail */}
                <div className="relative h-24 md:h-40 w-full rounded-xl md:rounded-2xl bg-slate-950 overflow-hidden mb-3 md:mb-5 border border-white/5 shadow-inner shrink-0">
                  <img 
                    src={cert.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    alt={cert.titleEn}
                  />
                  {/* View Overlay - desktop only */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center backdrop-blur-xs">
                    <span className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold font-sans px-3.5 py-2 rounded-xl">
                      <ExternalLink className="h-3.5 w-3.5" />
                      {t.certViewCredential}
                    </span>
                  </div>
                </div>

                {/* Title & metadata */}
                <div className="space-y-1.5 md:space-y-3">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between text-[9px] md:text-[11px] text-slate-500 font-sans gap-1">
                    <span className="flex items-center gap-1 shrink-0">
                      <Calendar className="h-3 w-3 text-blue-400" />
                      {cert.year}
                    </span>
                    <span className="bg-slate-200 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-250 dark:border-slate-900 px-1.5 py-0.5 rounded uppercase font-bold text-[8px] md:text-[9px] tracking-wider font-sans truncate max-w-[90px] md:max-w-none">
                      {lang === "ar" ? cert.issuerAr : cert.issuerEn}
                    </span>
                  </div>

                  <h3 className="text-xs md:text-sm font-bold font-sans leading-snug text-slate-900 dark:text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {lang === "ar" ? cert.titleAr : cert.titleEn}
                  </h3>
                </div>
              </div>

              {/* Sub tags */}
              <div className="flex flex-wrap gap-1 pt-2 md:pt-3 border-t border-slate-100 dark:border-white/5 mt-2 md:mt-4">
                {cert.tags.slice(0, 2).map((tag) => (
                  <span 
                    key={tag}
                    className="text-[8px] font-mono text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-950 border border-slate-250 dark:border-slate-900 px-1 py-0.2 rounded truncate max-w-[70px] md:max-w-none"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Zoom Lightbox Preview Modal overlay popup */}
        {selectedCert && (
          <div 
            id="certificate-modal-overlay"
            className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-955/90 backdrop-blur-md transition-all animate-fade-in"
            onClick={() => setSelectedCert(null)}
          >
            <div 
              id="certificate-modal-content"
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl overflow-hidden text-white"
              onClick={(e) => e.stopPropagation()} // Stop bubbling up click triggers
            >
              {/* Glow lines background */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

              {/* Close badge */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 bg-slate-950/80 hover:bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Media image preview */}
              <div className="w-full h-64 md:h-80 rounded-2xl bg-slate-950 overflow-hidden border border-white/5">
                <img 
                  src={selectedCert.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  alt={selectedCert.titleEn}
                />
              </div>

              {/* Meta information tags */}
              <div className="space-y-3 font-sans max-w-lg">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest">
                  <Award className="h-4 w-4 shrink-0 animate-spin" style={{ animationDuration: "15s" }} />
                  {selectedCert.year} Accreditation
                </div>
                <h4 className="text-lg md:text-xl font-bold tracking-tight text-white leading-snug">
                  {lang === "ar" ? selectedCert.titleAr : selectedCert.titleEn}
                </h4>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-850 p-3 rounded-xl text-slate-300 text-xs">
                  <ShieldCheck className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                  <span>
                    Issued by: <strong className="text-white">{lang === "ar" ? selectedCert.issuerAr : selectedCert.issuerEn}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {selectedCert.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-[10px] font-mono text-indigo-400 bg-indigo-950/25 px-2.5 py-1 rounded-md border border-indigo-900/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
