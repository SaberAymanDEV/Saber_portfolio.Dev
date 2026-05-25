import React, { useState, useEffect } from "react";
import { Globe, Sun, Moon, ShieldAlert, Cpu, Menu, X } from "lucide-react";
import { translations } from "../translations";
import { Profile } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  lang: "en" | "ar";
  setLang: (l: "en" | "ar") => void;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  onAdminClick: () => void;
  langToggle: () => void;
  profile?: Profile;
}

export default function Navbar({ lang, setLang, theme, setTheme, onAdminClick, langToggle, profile }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [secretCounter, setSecretCounter] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[lang];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Simple active link tracking
      const sections = ["home", "about", "skills", "services", "projects", "certificates", "testimonials", "contact"];
      const scrollPos = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSecretSaberClick = () => {
    const next = secretCounter + 1;
    if (next >= 5) {
      onAdminClick();
      setSecretCounter(0);
    } else {
      setSecretCounter(next);
    }
  };

  return (
    <nav
      id="main-navigation-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-sans ${
        scrolled 
          ? "py-2 md:py-3 bg-slate-950/90 dark:bg-slate-950/90 light:bg-white/95 backdrop-blur-md shadow-lg border-b border-white/5 dark:border-white/5 light:border-slate-200" 
          : "py-3.5 md:py-5 bg-transparent"
      }`}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand Logo / Dev Signature */}
        <div 
          id="navbar-brand-logo" 
          className="flex items-center gap-1.5 md:gap-2 cursor-pointer select-none"
          onClick={handleSecretSaberClick}
          title="Top candidate: Double-click or tap logo 5 times to reveal hidden Admin Panel"
        >
          <div className="h-8 w-8 md:h-9 md:w-9 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold tracking-tighter shadow-md">
            <Cpu className="h-3.5 w-3.5 md:h-4 md:w-4 animate-pulse text-blue-100" />
          </div>
          <div>
            <span className="font-sans font-black text-sm xs:text-base md:text-xl tracking-tight text-white dark:text-white light:text-slate-900">
              {lang === "ar" 
                ? (profile?.websiteNameAr || "صابر أيمن") 
                : (profile?.websiteNameEn || "SABER.S")}
            </span>
          </div>
        </div>

        {/* Links viewport - Desktop Only */}
        <div id="navbar-links-desktop" className="hidden lg:flex items-center gap-1.5 bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-100/80 p-1.5 rounded-full border border-white/5 dark:border-white/5 light:border-slate-200 shadow-inner">
          {[
            { id: "home", label: t.navHome },
            { id: "about", label: t.navAbout },
            { id: "skills", label: t.navSkills },
            { id: "services", label: t.navServices },
            { id: "projects", label: t.navProjects },
            { id: "certificates", label: t.navCertificates },
            { id: "testimonials", label: t.navTestimonials },
            { id: "contact", label: t.navContact }
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => handleScrollTo(sec.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                activeSection === sec.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold"
                  : "text-slate-400 hover:text-white dark:text-slate-400 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900"
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div id="navbar-actions-panel" className="flex items-center gap-1.5 md:gap-3.5">
          {/* Language Switch */}
          <button
            id="nav-lang-switcher"
            onClick={langToggle}
            className="flex items-center gap-1 border border-slate-800 dark:border-slate-800 light:border-slate-200 text-[10px] md:text-xs px-2 py-1.5 md:px-3 md:py-2 rounded-xl hover:bg-slate-900/50 dark:hover:bg-slate-900/50 light:hover:bg-slate-100 dark:text-slate-200 light:text-slate-700 font-bold transition-all cursor-pointer"
            title="Switch Language"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{lang === "en" ? "العربية" : "English"}</span>
          </button>

          {/* Theme Switch */}
          <button
            id="nav-theme-switcher"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="border border-slate-800 dark:border-slate-800 light:border-slate-200 p-1.5 md:p-2 rounded-xl text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 cursor-pointer transition-colors"
            title="Toggle theme mode"
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5 md:h-4 md:w-4" /> : <Moon className="h-3.5 w-3.5 md:h-4 md:w-4" />}
          </button>

          {/* Quick Hires Button - Hidden on very small phones to leave space */}
          <button
            id="nav-cta-hire-button"
            onClick={() => handleScrollTo("contact")}
            className="hidden md:block bg-blue-600 hover:bg-blue-500 text-white font-sans font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-blue-600/15 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            {lang === "ar" ? "ابدأ مشروعاً" : "Hire Me"}
          </button>

          {/* Mobile Hamburger Navigation Menu Button */}
          <button
            id="nav-mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-200 text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 cursor-pointer focus:outline-none transition-colors"
            title="Select Navigation Page"
          >
            {mobileMenuOpen ? <X className="h-4 w-4 md:h-4.5 md:w-4.5" /> : <Menu className="h-4 w-4 md:h-4.5 md:w-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Overlays */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            id="mobile-nav-drawer" 
            initial={{ opacity: 0, height: 0, y: -15 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden absolute top-full left-4 right-4 bg-slate-950/95 dark:bg-slate-950/95 light:bg-white/95 backdrop-blur-lg border border-white/10 dark:border-white/10 light:border-slate-200 py-3 px-4 rounded-2xl mt-2 shadow-2xl flex flex-col gap-1.5 z-50 text-[12px] font-bold overflow-hidden"
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-0.5 px-2 border-b border-slate-900/60 pb-1.5">
              {lang === "ar" ? "قائمة الانتقال السريع للموقع" : "Quick Section Navigator"}
            </div>
            {[
              { id: "home", label: t.navHome },
              { id: "about", label: t.navAbout },
              { id: "skills", label: t.navSkills },
              { id: "services", label: t.navServices },
              { id: "projects", label: t.navProjects },
              { id: "certificates", label: t.navCertificates },
              { id: "testimonials", label: t.navTestimonials },
              { id: "contact", label: t.navContact }
            ].map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleScrollTo(sec.id);
                }}
                className={`w-full text-right p-2.5 rounded-xl cursor-pointer font-sans transition-all flex items-center justify-between ${
                  activeSection === sec.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-md shadow-blue-600/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/40 dark:text-slate-400 dark:hover:text-white light:text-slate-700 light:hover:text-slate-900 light:hover:bg-slate-100"
                }`}
              >
                <span>{sec.label}</span>
                <span className="text-[9px] opacity-40 font-mono">#{sec.id}</span>
              </button>
            ))}
            
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleScrollTo("contact");
              }}
              className="w-full mt-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-center py-2 rounded-xl font-sans text-xs shadow-lg transition-all cursor-pointer font-bold"
            >
              {lang === "ar" ? "✉️ ابدأ مشروعاً جديداً اليوم" : "✉️ Let's Start a Project"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
