import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Certificates from "./components/Certificates";
import Testimonials from "./components/Testimonials";
import BlogPlaceholder from "./components/BlogPlaceholder";
import Contact from "./components/Contact";
import Chatbot from "./components/Chatbot";
import AdminCMS from "./components/AdminCMS";
import { translations } from "./translations";
import { Profile, Skill, Service, Project, Certificate, Testimonial, BlogPost } from "./types";
import { Cpu, ChevronUp, Github, Linkedin, MessageCircle, Mail, Sparkles, Volume2 } from "lucide-react";

export default function App() {
  const [lang, setLang] = useState<"en" | "ar">("ar");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showCMS, setShowCMS] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadPercent, setLoadPercent] = useState(0);

  // Core portfolio database values
  const [portfolioData, setPortfolioData] = useState<{
    profile: Profile;
    skills: Skill[];
    services: Service[];
    projects: Project[];
    certificates: Certificate[];
    testimonials: Testimonial[];
    blogs?: BlogPost[];
  } | null>(null);

  // Fetch bilingual portfolio database on bootup
  const loadPortfolioData = async () => {
    try {
      const response = await fetch("/api/portfolio");
      if (response.ok) {
        const data = await response.json();
        setPortfolioData(data);
      } else {
        throw new Error("Failed to load database");
      }
    } catch (error) {
      console.error("API error, falling back to static cache:", error);
      // Hardcoded fallback if server is rebuilding
      setPortfolioData({
        profile: {
          name: "Saber Ayman Saber",
          titleEn: "Full Stack Developer (MERN & Python Django)",
          titleAr: "مطور ويب متكامل — MERN Stack & Python (Django)",
          bioEn: "Self-taught developer passionate about AI and scalable systems. Experienced in MERN Stack, React, and Django.",
          bioAr: "مطور ويب عصامي شغوف بذكاء تطبيقات الويب والأنظمة القابلة للتوسع. خبير في MERN Stack، React، وخوادم Django.",
          whatsapp: "+20 1017413228",
          email: "saberayman.dev@gmail.com",
          linkedin: "https://www.linkedin.com/in/saber-ayman-saber",
          educationEn: "Helwan National University — BIDT",
          educationAr: "جامعة حلوان الأهلية — برنامج تكنولوجيا معلومات الأعمال BIDT",
          yearsOfExperience: 3,
          completedProjects: 50
        },
        skills: [],
        services: [],
        projects: [],
        certificates: [],
        testimonials: []
      });
    } finally {
      // Governed by dynamic percent counter effect
    }
  };

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadPercent(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const jump = Math.floor(Math.random() * 8) + 6;
          return Math.min(prev + jump, 100);
        });
      }, 55);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    if (loadPercent === 100 && portfolioData) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [loadPercent, portfolioData]);

  useEffect(() => {
    loadPortfolioData();

    // Check language from localStorage
    const savedLang = localStorage.getItem("saber_portfolio_lang") as "en" | "ar";
    if (savedLang) {
      setLang(savedLang);
    } else {
      // Auto-detect based on navigator browser settings
      const userLang = navigator.language.toLowerCase();
      if (userLang.startsWith("ar")) {
        setLang("ar");
      }
    }

    // Check theme from localStorage
    const savedTheme = localStorage.getItem("saber_portfolio_theme") as "dark" | "light";
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Show Back to Top scroll listener
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync theme changes to document DOM root elements
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    localStorage.setItem("saber_portfolio_theme", theme);
  }, [theme]);

  // Sync language selection & save persistence
  const handleLangToggle = () => {
    const nextLang = lang === "en" ? "ar" : "en";
    setLang(nextLang);
    localStorage.setItem("saber_portfolio_lang", nextLang);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Checking Hash values and Keyboard shortcuts/clicks for secret admin portals
  useEffect(() => {
    const checkHash = () => {
      if (
        window.location.hash === "#saber-portal-gate" ||
        window.location.hash === "#saber-gate" ||
        window.location.pathname === "/saber-admin"
      ) {
        setShowCMS(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Trigger gateway with Ctrl + Shift + S or Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && (e.key === "S" || e.key === "s" || e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setShowCMS(prev => !prev);
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("hashchange", checkHash);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (loading || !portfolioData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-sans overflow-hidden relative">
        {/* Subtle background ambient particles */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8 text-center max-w-md px-6 z-10"
        >
          {/* Logo assembly inside rotating rings */}
          <div className="relative mx-auto flex items-center justify-center h-24 w-24">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-3xl border border-dashed border-blue-500/30"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-2xl border border-double border-indigo-400/20"
            />
            <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-650 border border-white/10 shadow-lg shadow-blue-500/20 relative">
              <Cpu className="h-7 w-7 text-white animate-pulse" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-3.5 w-3.5 text-blue-300 animate-bounce" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-sans font-black text-lg md:text-xl tracking-widest text-slate-100 uppercase">
              SABER AYMAN SABER
            </h3>

            {/* Sound Wave Vibe waveform bars */}
            <div className="flex justify-center items-center gap-1.5 h-12 my-4">
              {[0.4, 1.0, 0.6, 1.4, 0.8, 0.3, 1.1].map((delay, index) => (
                <motion.div
                  key={index}
                  animate={{
                    height: ["12px", "40px", "12px"],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: delay * 0.15,
                    ease: "easeInOut"
                  }}
                  className="w-1 rounded-full bg-gradient-to-t from-blue-600 via-indigo-500 to-violet-500"
                />
              ))}
            </div>

            <p className="text-xs text-slate-400 font-mono tracking-wider">
              {lang === "ar" ? "جاري تهيئة قنوات الاتصال والذكاء الاصطناعي..." : "TUNING AI ENGINE & INTERACTIVE PORTS..."}
            </p>

            {/* Progress tracks */}
            <div className="w-64 mx-auto space-y-1">
              <div className="w-full bg-slate-900 rounded-full h-1 border border-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${loadPercent}%` }}
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 h-full rounded-full"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>{loadPercent}% SECURED</span>
                <span>SYSTEM ONLINE</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const t = translations[lang];

  return (
    <div 
      className={`min-h-screen relative transition-colors duration-300 ${
        theme === "dark" ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Background static grids */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]"></div>
      </div>

      {/* Main Headers */}
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        theme={theme} 
        setTheme={setTheme} 
        onAdminClick={() => setShowCMS(true)} 
        langToggle={handleLangToggle}
        profile={portfolioData.profile}
      />

      {/* Page content blocks */}
      <main className="relative z-10">
        <Hero lang={lang} profile={portfolioData.profile} theme={theme} />
        <About lang={lang} profile={portfolioData.profile} />
        <Skills lang={lang} skills={portfolioData.skills} />
        <Services lang={lang} services={portfolioData.services} />
        <Projects lang={lang} projects={portfolioData.projects} />
        <Certificates lang={lang} certificates={portfolioData.certificates} />
        <Testimonials lang={lang} testimonials={portfolioData.testimonials} />
        <BlogPlaceholder lang={lang} />
        <Contact lang={lang} profile={portfolioData.profile} />
      </main>

      {/* Footer component standard credits */}
      <footer className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 border-t border-slate-200 dark:border-slate-900 text-center relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
          {/* Brand logotype markup */}
          <div className="flex items-center justify-center gap-2">
            <span className="font-extrabold font-sans text-slate-900 dark:text-white text-base md:text-lg tracking-tight uppercase animate-fadeIn">
              {lang === "ar" 
                ? (portfolioData?.profile?.websiteNameAr || "صابر أيمن") 
                : (portfolioData?.profile?.websiteNameEn || "SABER.S")}
            </span>
          </div>

          <p className="text-xs font-sans tracking-wide leading-relaxed max-w-md mx-auto text-slate-550 dark:text-slate-500">
            {lang === "ar"
              ? "مهندس ويب متكامل متخصص في حلول الواجهات الذكية، وهندسة البرمجيات القابلة للتوسع وقواعد البيانات للشركات العالمية الناشئة والكبرى."
              : "Full Stack Engineer specializing in premium frontends, robust backend microservices, and specialized AI integrations for scaling global tech companies."}
          </p>

          {/* Social icons toolbar rows */}
          <div className="flex justify-center gap-4 text-slate-500 dark:text-slate-400">
            <a href="https://github.com" target="_blank" referrerPolicy="no-referrer" className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-550 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all hover:scale-105 shadow-sm">
              <Github className="h-4.5 w-4.5" />
            </a>
            <a href="https://linkedin.com/in/saber-ayman-saber" target="_blank" referrerPolicy="no-referrer" className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-550 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all hover:scale-105 shadow-sm">
              <Linkedin className="h-4.5 w-4.5" />
            </a>
            <a href="https://wa.me/201017413228" target="_blank" referrerPolicy="no-referrer" className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-550 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all hover:scale-105 shadow-sm">
              <MessageCircle className="h-4.5 w-4.5" />
            </a>
            <a href="mailto:saberayman.dev@gmail.com" className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-550 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all hover:scale-105 shadow-sm">
              <Mail className="h-4.5 w-4.5" />
            </a>
          </div>

          {/* Subtle click listener on copyright to activate portal securely */}
          <div 
            onClick={() => {
              // Secret click sequence to toggle portal (5 rapid clicks)
              (window as any)._portal_click_count = ((window as any)._portal_click_count || 0) + 1;
              if ((window as any)._portal_click_count >= 5) {
                setShowCMS(true);
                (window as any)._portal_click_count = 0;
              }
            }}
            onDoubleClick={() => setShowCMS(true)}
            className="text-[10px] text-slate-500 dark:text-slate-600 font-mono flex items-center justify-center gap-2 cursor-default select-none transition-all hover:text-slate-600 dark:hover:text-slate-400 active:scale-98"
            title="Copyright info"
          >
            <span>© 2026 {lang === "ar" ? (portfolioData?.profile?.websiteNameAr || "صابر أيمن") : (portfolioData?.profile?.websiteNameEn || "saber.s")}. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant Copilot */}
      <Chatbot lang={lang} />

      {/* Hidden Admin CMS Portal Overlay popup */}
      {showCMS && (
        <AdminCMS 
          lang={lang} 
          onClose={() => {
            setShowCMS(false);
            window.location.hash = ""; // Clean hash
          }} 
          portfolioData={portfolioData}
          refreshData={loadPortfolioData}
        />
      )}

      {/* Back to Top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-30 h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-all"
          title="Scroll back to top spacer"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
