import React, { useState } from "react";
import { Search, Globe, Github, Star, Sparkles, FolderKanban } from "lucide-react";
import { translations } from "../translations";
import { Project } from "../types";

interface ProjectsProps {
  lang: "en" | "ar";
  projects: Project[];
}

export default function Projects({ lang, projects }: ProjectsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const t = translations[lang];

  // Dynamic categories in database
  const baseCategories = ["SaaS", "AI Platforms", "Dashboards", "LMS", "E-commerce", "Booking Systems", "Company Websites"];
  const dynamicCategories = projects.reduce<string[]>((acc, proj) => {
    if (proj.category) {
      proj.category.split(",").forEach(cat => {
        const trimmed = cat.trim();
        if (trimmed && !acc.includes(trimmed)) {
          acc.push(trimmed);
        }
      });
    }
    return acc;
  }, []);
  
  // Combine base default categories and any custom categories created by user
  const allUniqueCategories = Array.from(new Set([...baseCategories, ...dynamicCategories]));
  const categories = ["All", ...allUniqueCategories];

  // Filter & Search Logic
  const filteredProjects = projects.filter((proj) => {
    // Category match
    const projCategories = proj.category ? proj.category.split(",").map(c => c.trim()) : [];
    const categoryMatch = activeCategory === "All" || projCategories.includes(activeCategory);
    
    // Keyword match
    const searchLow = searchTerm.toLowerCase();
    const titleMatch = (proj.titleEn ?? "").toLowerCase().includes(searchLow) || (proj.titleAr ?? "").toLowerCase().includes(searchLow);
    const descMatch = (proj.descEn ?? "").toLowerCase().includes(searchLow) || (proj.descAr ?? "").toLowerCase().includes(searchLow);
    const techMatch = proj.technologies.some(tech => tech.toLowerCase().includes(searchLow));
    const keywordMatch = !searchTerm || titleMatch || descMatch || techMatch;

    return categoryMatch && keywordMatch;
  });

  return (
    <section 
      id="projects" 
      className="py-10 md:py-20 section-shading-secondary text-slate-900 dark:text-white"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12 space-y-3">
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 uppercase">
            {t.projectsBadge}
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold font-sans tracking-tight text-slate-900 dark:text-white">
            {t.projectsTitle}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-sans">
            {t.projectsSubtitle}
          </p>
        </div>

        {/* Search Bar & Categories Filter bar */}
        <div className="max-w-4xl mx-auto mb-8 md:mb-12 space-y-4 md:space-y-6">
          {/* Live Search */}
          <div className="relative">
            <Search className="absolute top-2.5 md:top-3.5 left-4.5 rtl:right-4.5 rtl:left-auto h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.projectSearchPlaceholder}
              className="w-full rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 px-10 md:px-12 py-2.5 md:py-3.5 text-xs md:text-sm focus:outline-none focus:border-blue-500 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-inner text-slate-900 dark:text-white"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] md:text-xs font-bold font-sans px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl transition-all border cursor-pointer ${
                  activeCategory === cat
                    ? "bg-blue-600 border-blue-500 text-white scale-105"
                    : "bg-white border-slate-200 dark:bg-slate-900/50 dark:border-slate-850 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {cat === "All" ? t.tabAll : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 md:py-16 text-slate-500">
            <FolderKanban className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-3 opacity-40 animate-pulse" />
            <p className="text-xs md:text-sm font-sans">{t.projectNoResults}</p>
          </div>
        ) : (
          <div 
            id="projects-grid-container" 
            className="flex md:grid overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {filteredProjects.map((proj) => (
              <div 
                key={proj.id}
                className={`snap-start shrink-0 w-[78vw] sm:w-[46vw] md:w-auto flex flex-col rounded-2xl md:rounded-3xl overflow-hidden bg-white dark:bg-slate-900/40 border hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-md group relative ${
                  proj.featured 
                    ? "border-blue-500/40 shadow-blue-500/5" 
                    : "border-slate-200 dark:border-white/5"
                }`}
              >
                {/* Featured Gold Badge */}
                {proj.featured && (
                  <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1 bg-amber-500/95 text-slate-950 text-[9px] md:text-[10px] font-black font-sans px-2 py-0.5 md:px-2.5 md:py-1 rounded-full uppercase tracking-wider shadow-sm">
                    <Sparkles className="h-2.5 w-2.5 animate-spin" style={{ animationDuration: "5s" }} />
                    {t.projectFeatured}
                  </div>
                )}

                {/* Cover Thumbnail Image Box with hover gradient overlay */}
                <div className="relative h-32 md:h-48 w-full bg-slate-950 overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 z-10"></div>
                  <img 
                    src={proj.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600"} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter saturate-120"
                    referrerPolicy="no-referrer"
                    alt={proj.titleEn}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600";
                    }}
                  />
                  {/* Category overlay label */}
                  <div className="absolute bottom-2.5 right-2 text-right z-20 flex flex-wrap gap-1 justify-end max-w-[85%]">
                    {(proj.category || "SaaS").split(",").map(c => c.trim()).filter(Boolean).map((cat) => (
                      <span key={cat} className="text-[7.5px] md:text-[8.5px] font-extrabold tracking-widest uppercase bg-slate-100/90 dark:bg-slate-900/90 text-slate-850 dark:text-slate-100 border border-slate-200 dark:border-white/10 px-1.5 py-0.5 md:py-1 rounded shadow-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content body descriptors */}
                <div className="p-4 md:p-6 flex-1 flex flex-col justify-between space-y-3.5">
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-sm md:text-base lg:text-lg font-sans tracking-tight text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {lang === "ar" ? proj.titleAr : proj.titleEn}
                    </h3>
                    <p className="text-[11px] md:text-xs lg:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans line-clamp-2 md:line-clamp-3">
                      {lang === "ar" ? proj.descAr : proj.descEn}
                    </p>
                  </div>

                  {/* Tech stack badges tags list */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.technologies.slice(0, 4).map((tech) => (
                      <span 
                        key={tech} 
                        className="text-[9px] md:text-[10px] font-mono font-bold text-indigo-400 dark:text-indigo-450 bg-indigo-950/15 px-1.5 py-0.5 rounded border border-indigo-900/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Redirection Links bottom CTA toolbar */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-950/55">
                    {proj.liveUrl && (
                      <a 
                        href={proj.liveUrl} 
                        target="_blank" 
                        referrerPolicy="no-referrer"
                        className="flex-1 flex items-center justify-center gap-1 text-[10px] md:text-xs font-bold font-sans tracking-tight bg-blue-600 hover:bg-blue-500 text-white py-1.5 md:py-2 rounded-lg md:rounded-xl transition-all cursor-pointer shadow-md"
                      >
                        <Globe className="h-3 w-3 md:h-3.5 md:w-3.5" />
                        {t.projectLiveDemo}
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a 
                        href={proj.githubUrl} 
                        target="_blank" 
                        referrerPolicy="no-referrer"
                        className="flex-1 flex items-center justify-center gap-1 text-[10px] md:text-xs font-bold font-sans tracking-tight bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-755 dark:text-slate-300 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
                      >
                        <Github className="h-3 w-3 md:h-3.5 md:w-3.5 text-slate-500 dark:text-slate-400" />
                        {t.projectCode}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
