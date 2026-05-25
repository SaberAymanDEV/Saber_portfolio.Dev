import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Download, ArrowRight, Code, Server, Cpu, Database, Sparkles, Wand2 } from "lucide-react";
import { translations } from "../translations";
import { Profile } from "../types";

interface HeroProps {
  lang: "en" | "ar";
  profile: Profile;
  theme: "dark" | "light";
}

export default function Hero({ lang, profile, theme }: HeroProps) {
  const [typedText, setTypedText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Counter states for smooth numbers tickers
  const [expCount, setExpCount] = useState(0);
  const [projCount, setProjCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);

  const t = translations[lang];

  // Typewriter phrases bilingually memoized
  const phrases = React.useMemo(() => {
    return [t.heroTypedMern, t.heroTypedDjango, t.heroTypedAi, t.heroTypedScalable];
  }, [lang, t]);

  // Stat Counters increments
  useEffect(() => {
    setExpCount(0);
    setProjCount(0);
    setClientCount(0);

    const expEnd = profile.yearsOfExperience || 3;
    const projEnd = profile.completedProjects || 50;
    const clientEnd = 30;

    const expInterval = setInterval(() => {
      setExpCount(prev => {
        if (prev < expEnd) return prev + 1;
        clearInterval(expInterval);
        return expEnd;
      });
    }, 150);

    const projInterval = setInterval(() => {
      setProjCount(prev => {
        if (prev < projEnd) {
          const added = Math.min(2, projEnd - prev);
          return prev + added;
        }
        clearInterval(projInterval);
        return projEnd;
      });
    }, 30);

    const clientInterval = setInterval(() => {
      setClientCount(prev => {
        if (prev < clientEnd) return prev + 1;
        clearInterval(clientInterval);
        return clientEnd;
      });
    }, 40);

    return () => {
      clearInterval(expInterval);
      clearInterval(projInterval);
      clearInterval(clientInterval);
    };
  }, [profile, lang]);

  // Reset indices on language change to prevent out of bounds
  useEffect(() => {
    setTypedText("");
    setCharIndex(0);
    setPhraseIndex(0);
    setIsDeleting(false);
  }, [lang]);

  // Typing effect loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentPhrase = phrases[phraseIndex];
    if (!currentPhrase) return;

    if (isDeleting) {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setTypedText(currentPhrase.substring(0, charIndex - 1));
          setCharIndex(prev => prev - 1);
        }, 30);
      } else {
        setIsDeleting(false);
        setPhraseIndex(prev => (prev + 1) % phrases.length);
      }
    } else {
      if (charIndex < currentPhrase.length) {
        timer = setTimeout(() => {
          setTypedText(currentPhrase.substring(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        }, 75);
      } else {
        // Pause at the end of typing before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex, phrases]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleDownloadCV = () => {
    window.open("/api/portfolio/cv/download", "_blank");
  };

  const isDark = theme === "dark";

  return (
    <section 
      id="home" 
      className={`relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden transition-colors duration-500 ${
        isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Background Interactive Lighting Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.12, 0.18, 0.12],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[110px] ${
            isDark ? "bg-blue-600" : "bg-blue-400"
          }`}
        />
        <motion.div 
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.12, 0.18, 0.12],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[110px] ${
            isDark ? "bg-violet-600" : "bg-violet-400"
          }`}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left copy text block with reveal animations */}
        <motion.div 
          initial={{ opacity: 0, x: lang === "ar" ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 text-center lg:text-left rtl:lg:text-right"
        >
          {/* Active Status Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm ${
            isDark 
              ? "bg-slate-900/80 border-slate-800 text-slate-300" 
              : "bg-white border-slate-200 text-slate-600"
          }`}>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-extrabold tracking-wider uppercase font-mono">
              {t.heroRemoteBadge}
            </span>
          </div>

          <div className="space-y-3">
            <p className={`text-xs md:text-sm font-black font-mono tracking-wider uppercase ${
              isDark ? "text-slate-400" : "text-blue-600"
            }`}>
              {t.heroGreeting}
            </p>
            {/* Ambient sliding gradient header text */}
            <h1 className="text-3xl md:text-5xl xl:text-6xl font-extrabold font-sans tracking-tight leading-[1.12]">
              <span className={isDark ? "text-white" : "text-slate-900"}>
                {profile.name}
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent inline-block mt-1">
                {lang === "ar" ? "حلول ذكية مخصصة" : "AI-Powered SaaS Systems"}
              </span>
            </h1>

            {/* Typewriter text line block */}
            <div className="h-10 flex items-center justify-center lg:justify-start rtl:lg:justify-start">
              <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent font-mono">
                {typedText}
              </span>
              <motion.span 
                animate={{ opacity: [1, 0] }} 
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="ml-1 rtl:mr-1 w-0.5 h-6 bg-blue-500"
              />
            </div>
          </div>

          <p className={`text-sm md:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed font-sans whitespace-pre-line ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}>
            {lang === "ar" ? profile.bioAr : profile.bioEn}
          </p>

          {/* Action CTAs with magnetic hover states */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleScrollTo("projects")}
              className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-650 hover:shadow-indigo-500/20 text-white font-sans font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer border border-white/5"
            >
              <Sparkles className="h-4 w-4 animate-pulse text-amber-300" />
              {t.heroViewProjects}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadCV}
              className={`flex items-center gap-2 font-sans font-bold text-xs px-6 py-3.5 rounded-xl border transition-all cursor-pointer shadow-md ${
                isDark 
                  ? "bg-slate-900 border-slate-800 text-slate-100 hover:bg-slate-850" 
                  : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Download className="h-4 w-4 text-blue-500" />
              {t.heroDownloadCV}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleScrollTo("contact")}
              className={`text-xs font-bold hover:underline transition-all cursor-pointer py-2 px-3 ${
                isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {t.heroContactMe}
            </motion.button>
          </div>

          {/* Glowing dynamic stats counter panels */}
          <div className={`pt-8 grid grid-cols-3 gap-6 border-t ${
            isDark ? "border-slate-900" : "border-slate-200"
          }`}>
            <div className="text-center lg:text-left rtl:lg:text-right">
              <p className={`text-2xl md:text-4xl font-extrabold font-sans ${isDark ? "text-white" : "text-slate-900"}`}>
                {expCount}+
              </p>
              <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mt-1 font-mono">{t.heroExpYrs}</p>
            </div>
            <div className="text-center lg:text-left rtl:lg:text-right">
              <p className={`text-2xl md:text-4xl font-extrabold font-sans ${isDark ? "text-white" : "text-slate-900"}`}>
                {projCount}+
              </p>
              <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mt-1 font-mono">{t.heroProjDel}</p>
            </div>
            <div className="text-center lg:text-left rtl:lg:text-right">
              <p className={`text-2xl md:text-4xl font-extrabold font-sans ${isDark ? "text-white" : "text-slate-900"}`}>
                {clientCount}+
              </p>
              <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mt-1 font-mono">{t.heroClientsHpy}</p>
            </div>
          </div>
        </motion.div>

        {/* Right developer avatar representation with floating 3D glow orbit effect */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="flex items-center justify-center relative select-none w-full"
        >
          {/* Animated Ambient background circle halo */}
          <div className={`absolute h-76 w-76 md:h-96 md:w-96 rounded-full blur-[65px] animate-pulse opacity-40 ${
            isDark ? "bg-indigo-600/30" : "bg-indigo-400/20"
          }`} />

          {/* Central responsive profile portrait layout with elegant 3D tilt frame */}
          <motion.div 
            whileHover={{ rotateY: 8, rotateX: -6 }}
            className={`relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center rounded-full shadow-2xl p-4 overflow-hidden border transition-all duration-300 ${
              isDark 
                ? "bg-slate-905/85 border-slate-800 shadow-blue-900/10" 
                : "bg-white border-slate-200 shadow-slate-300/30"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/15 via-transparent to-indigo-500/15"></div>
            <img 
              src={profile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"} 
              className="w-full h-full object-cover rounded-full opacity-90 border border-slate-500/10"
              referrerPolicy="no-referrer"
              alt="Saber Ayman Saber portrait representation"
            />
          </motion.div>

          {/* Orbit Tech badging floating particles */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-[8%] right-[5%] p-3 rounded-2xl shadow-lg border text-amber-500 z-10 ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}
            title="Saber's Smart Core System"
          >
            <Cpu className="h-5 w-5 animate-spin" style={{ animationDuration: "12s" }} />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className={`absolute bottom-[18%] left-[0%] p-3 rounded-2xl shadow-lg border text-blue-500 z-10 ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <Code className="h-5 w-5" />
          </motion.div>

          <motion.div 
            animate={{ x: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className={`absolute top-[45%] left-[-6%] p-3 rounded-2xl shadow-lg border text-indigo-500 z-10 ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <Server className="h-5 w-5 animate-pulse" />
          </motion.div>

          <motion.div 
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className={`absolute bottom-[8%] right-[10%] p-3 rounded-2xl shadow-lg border text-violet-500 z-10 ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <Database className="h-5 w-5" />
          </motion.div>

          {/* AI solutions element */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute -bottom-2 md:bottom-2 left-1/3 p-2.5 rounded-xl border flex items-center gap-1.5 shadow-xl text-emerald-500 z-10 text-[10px] font-bold font-mono ${
              isDark ? "bg-slate-900 border-emerald-950/20" : "bg-white border-slate-200"
            }`}
          >
            <Wand2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>AI CORE ENABLED</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
