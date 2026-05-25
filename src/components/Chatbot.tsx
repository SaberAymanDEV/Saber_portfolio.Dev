import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, Send, X, Bot, User, Sparkles, MessageCircle, ExternalLink,
  Mic, MicOff, Volume2, VolumeX, Calendar, FileText, CheckCircle2, ChevronRight, ChevronLeft,
  ChevronDown, ChevronUp,
  DollarSign, Clock, HelpCircle, Briefcase, Award, ArrowLeft, Loader2
} from "lucide-react";
import { translations } from "../translations";

interface Message {
  role: "user" | "model";
  text: string;
  isSpecial?: boolean;
}

interface ChatbotProps {
  lang: "en" | "ar";
}

export default function Chatbot({ lang }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [showTooltip, setShowTooltip] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("saber_tooltip_dismissed") !== "true";
    }
    return true;
  });
  const [robotHovered, setRobotHovered] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const dismissTooltip = () => {
    setShowTooltip(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("saber_tooltip_dismissed", "true");
    }
  };

  useEffect(() => {
    if (isOpen) {
      dismissTooltip();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!showTooltip) return;
    // Auto-hide after 14 seconds
    const timer = setTimeout(() => {
      dismissTooltip();
    }, 14000);
    return () => clearTimeout(timer);
  }, [showTooltip]);

  // Dismiss welcome tooltip when clicking/touching outside or scrolling
  useEffect(() => {
    if (!showTooltip || isOpen) return;

    const handleGlobalClick = (event: MouseEvent | TouchEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        dismissTooltip();
      }
    };

    const handleScroll = () => {
      dismissTooltip();
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleGlobalClick);
      document.addEventListener("touchstart", handleGlobalClick);
      window.addEventListener("scroll", handleScroll, { passive: true });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleGlobalClick);
      document.removeEventListener("touchstart", handleGlobalClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showTooltip, isOpen]);

  // Persistent chat memory
  const [messages, setMessages] = useState<Message[]>(() => {
    const cached = localStorage.getItem("saber_sales_chats");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Cached chat parsing failed", e);
      }
    }
    return [
      { role: "model", text: translations[lang].chatbotGreeting }
    ];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isListening, setIsListening] = useState(false);
  
  // Wizards state: null | "booking"
  const [activeWizard, setActiveWizard] = useState<null | "booking">(null);
  
  // Wizard page sliders
  const [wizardStep, setWizardStep] = useState(1);
  const [submittingWizard, setSubmittingWizard] = useState(false);
  const [wizardError, setWizardError] = useState<string | null>(null);

  // Booking Wizard Data
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingComplete, setBookingComplete] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isShortcutsExpanded, setIsShortcutsExpanded] = useState(true);

  // Auto clean errors when navigation inside wizards occurs
  useEffect(() => {
    setWizardError(null);
  }, [activeWizard, wizardStep]);

  const listRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const t = translations[lang];

  const renderMessageText = (text: string) => {
    // Split by newlines
    const lines = text.split("\n");
    return (
      <div className="space-y-2 break-words select-text">
        {lines.map((line, index) => {
          let currentLine = line.trim();
          if (!currentLine) {
            return <div key={index} className="h-2" />;
          }

          // Check if line is a bullet item starting with ✔, •, * or -
          const isCheckBullet = currentLine.startsWith("✔");
          const isBullet = currentLine.startsWith("•") || currentLine.startsWith("*") || currentLine.startsWith("-");
          
          if (isCheckBullet) {
            currentLine = currentLine.substring(1).trim();
          } else if (isBullet) {
            currentLine = currentLine.substring(1).trim();
          }

          // Parse bold markdown **text**
          const parts = [];
          const boldRegex = /\*\*(.*?)\*\*/g;
          let match;
          let lastIndex = 0;

          while ((match = boldRegex.exec(currentLine)) !== null) {
            const matchIndex = match.index;
            const matchText = match[1];

            if (matchIndex > lastIndex) {
              parts.push({ type: "text", content: currentLine.substring(lastIndex, matchIndex) });
            }
            parts.push({ type: "bold", content: matchText });
            lastIndex = boldRegex.lastIndex;
          }

          if (lastIndex < currentLine.length) {
            parts.push({ type: "text", content: currentLine.substring(lastIndex) });
          }

          const renderedLineContent = parts.map((part, pIdx) => {
            if (part.type === "bold") {
              return (
                <strong key={pIdx} className="font-extrabold text-blue-300">
                  {part.content}
                </strong>
              );
            }
            return <span key={pIdx}>{part.content}</span>;
          });

          // Style bullet lines
          if (isCheckBullet) {
            return (
              <div key={index} className="flex items-start gap-2 text-[13px] text-slate-200">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✔</span>
                <span className="leading-relaxed">{renderedLineContent}</span>
              </div>
            );
          }
          
          if (isBullet) {
            return (
              <div key={index} className="flex items-start gap-2 text-[13px] text-slate-200">
                <span className="text-blue-400 shrink-0 mt-1">•</span>
                <span className="leading-relaxed">{renderedLineContent}</span>
              </div>
            );
          }

          // Regular paragraph lines
          return (
            <p key={index} className="text-[13px] leading-relaxed text-slate-200">
              {renderedLineContent}
            </p>
          );
        })}
      </div>
    );
  };

  // Auto scroll to bottom
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen, activeWizard]);

  // Synchronize memory localstorage
  useEffect(() => {
    localStorage.setItem("saber_sales_chats", JSON.stringify(messages));
  }, [messages]);

  // Speech Recognition (Dictation) Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === "ar" ? "ar-EG" : "en-US";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(prev => prev ? prev + " " + transcript : transcript);
        }
      };

      rec.onerror = (e: any) => {
        console.error("Speech to text recognition error:", e);
        setIsListening(false);
        if (e.error === "not-allowed" || (e.error === undefined && e.isTrusted)) {
          // Typically iframe permission block or user decline
          console.warn("Microphone access blocked (possibly by iframe limitations or browser settings).");
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [lang]);

  // Text-To-Speech Reader functions
  const speakVoice = (text: string) => {
    if (isMuted) return;
    try {
      window.speechSynthesis.cancel();
      const cleanRepl = text.replace(/[*#-_]/g, " "); // remove markdown anchors
      const utterance = new SpeechSynthesisUtterance(cleanRepl);
      utterance.lang = lang === "ar" ? "ar-EG" : "en-US";
      
      const voices = window.speechSynthesis.getVoices();
      if (lang === "ar") {
        const arVoice = voices.find(v => v.lang.startsWith("ar"));
        if (arVoice) utterance.voice = arVoice;
      } else {
        const enVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google"));
        if (enVoice) utterance.voice = enVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS read aloud interrupted:", e);
    }
  };

  // Speak when a model's turn completes - disabled as per user request to turn off automatic reading
  useEffect(() => {
    // Disabled auto-reads
  }, []);

  // Toggle Dictation Listening
  const handleDictation = () => {
    if (!recognitionRef.current) {
      alert(lang === "ar" 
        ? "ميزة إملاء الصوت غير مدعومة بالكامل على متصفحك الحالي. يرجى تجربة متصفح Google Chrome." 
        : "Speech Recognition API is not supported in this browser. Please use Chrome/Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Send normal message
  const handleSend = async (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const queryText = customMsg ? customMsg.trim() : input.trim();
    if (!queryText || isLoading) return;

    if (!customMsg) setInput("");

    const updated = [...messages, { role: "user" as const, text: queryText }];
    setMessages(updated);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          history: updated.map(m => ({ role: m.role, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error("Chat response status failure");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: "model", text: data.reply }]);
      
      // Auto-expand if the bot recommends booking a call / meeting
      const replyText = (data.reply || "").toLowerCase();
      const bookingKeywords = ["حجز", "احجز", "مكالمة", "استشارة", "اجتماع", "موعد", "سجل", "calendar", "booking", "schedule", "call", "consultation", "meeting"];
      if (bookingKeywords.some(kw => replyText.includes(kw))) {
        setIsShortcutsExpanded(true);
      }
    } catch (err) {
      console.error("AI Sales Chat Endpoint Failure:", err);
      const isAr = /[\u0600-\u06FF]/.test(queryText);
      const fallback = isAr
        ? "أهلاً بك، واجهت مشكلة قصيرة في خوادم الذكاء الاصطناعي. تفضل بمناقشة مشروعك والحصول على تسعير فوري مباشر عبر مكالمة أو واتساب: +201017413228"
        : "I apologize, but we experienced a brief network handshake limit. Please dial my WhatsApp directly at +201017413228 for immediate project configuration!";
      setMessages(prev => [...prev, { role: "model", text: fallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(undefined, question);
  };

  // Submit Meeting Booking
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWizardError(null);
    if (!bookingName || !bookingEmail || !bookingDate || !bookingTime) {
      setWizardError(lang === "ar" ? "يرجى ملء جميع التفاصيل المطلوبة لحجز اللقاء" : "Please fill out all booking details.");
      return;
    }
    setSubmittingWizard(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bookingName,
          email: bookingEmail,
          date: bookingDate,
          time: bookingTime,
          notes: bookingNotes
        })
      });

      if (response.ok) {
        setBookingComplete(true);
        const bookingText = lang === "ar" 
          ? `📅 **تم طلب موعد مكالمتك الاستشارية بنجاح!**
          
          👤 **العضو المستفيد:** ${bookingName}
          📁 **تاريخ اللقاء:** ${bookingDate}
          ⏰ **التوقيت:** ${bookingTime} (توقيت العميل المحلى)
          
          *سيتواصل صابر لتأكيد تفاصيل رابط المقابلة (Google Meet) وإرسال الدعوة لتقويمك.*`
          : `📅 **Strategic Consulting Session Booked!**
          
          👤 **Attendee Name:** ${bookingName}
          📁 **Proposed Date:** ${bookingDate}
          ⏰ **Time Slot:** ${bookingTime} (Local client time)
          
          *Saber's calendar system registered your slot. An calendar invite containing Google Meet codes will be dispatched to ${bookingEmail} shortly!*`;

        setMessages(prev => [
          ...prev,
          { role: "user", text: lang === "ar" ? "أتمنى جدولة مكالمة عمل مخصصة" : "I want to schedule a brief team session with Saber" },
          { role: "model", text: bookingText }
        ]);

        setTimeout(() => {
          setActiveWizard(null);
          setBookingComplete(false);
          setBookingName("");
          setBookingEmail("");
          setBookingNotes("");
          setBookingDate("");
          setBookingTime("");
        }, 3200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingWizard(false);
    }
  };

  // Clear messages history
  const handleClearHistory = () => {
    if (!showClearConfirm) {
      setShowClearConfirm(true);
      setTimeout(() => {
        setShowClearConfirm(false);
      }, 4000);
    } else {
      const defaultState = [{ role: "model" as const, text: translations[lang].chatbotGreeting }];
      setMessages(defaultState);
      localStorage.setItem("saber_sales_chats", JSON.stringify(defaultState));
      setShowClearConfirm(false);
    }
  };

  return (
    <div 
      id="ai-chatbot-wrapper" 
      className={`fixed z-50 pointer-events-none flex flex-col items-end transition-all duration-300 ${
        isOpen
          ? "bottom-0 right-0 left-0 md:bottom-6 md:right-6 md:left-auto"
          : "bottom-4 right-4 md:bottom-6 md:right-6"
      }`}
      style={{
        width: isOpen ? "100%" : "75px",
        maxWidth: isOpen ? (isMobile ? "100%" : "392px") : "75px",
        height: isOpen ? (isMobile ? "75vh" : "570px") : "75px",
        maxHeight: isMobile ? "75vh" : "90vh"
      }}
    >
      {/* Speech welcome tooltip */}
      <AnimatePresence>
        {!isOpen && showTooltip && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="pointer-events-auto absolute max-w-[280px] md:max-w-[320px] bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-blue-500/30 text-white text-[11px] font-sans leading-relaxed flex gap-2"
            dir={lang === "ar" ? "rtl" : "ltr"}
            style={{ width: "max-content", bottom: "82px", right: 0, zIndex: 60 }}
          >
            <div>
              <p className="font-bold flex items-center gap-1 text-blue-400 mb-1">
                <Sparkles className="h-3 w-3 animate-spin" style={{ animationDuration: "6s" }} />
                {lang === "ar" ? "مستشار صابر الذكي:" : "Saber's Smart Guide:"}
              </p>
              <p className="font-medium whitespace-normal max-w-[240px] md:max-w-[280px]">
                {lang === "ar"
                  ? "أهلاً بيك 👋 أنا المساعد الذكي الخاص بصابر. ممكن أساعدك تختار أفضل خدمة أو أجاوب على أي سؤال بخصوص ميزانيتك ومشاريعك!"
                  : "Hey 👋 I'm Saber's intelligent technical assistant. Need help scoping out features, budgets, or architectures? Let's talk!"}
              </p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                dismissTooltip();
              }}
              className="p-1 self-start text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <div className={`absolute -bottom-1.5 right-6 w-3.5 h-3.5 rotate-45 border-r border-b bg-slate-900/95 ${
              lang === "ar" ? "right-auto left-9" : "right-9"
            } border-blue-500/20`} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Robot trigger element */}
      {!isOpen && (
        <motion.div
          id="chatbot-open-button-container"
          className="pointer-events-auto absolute bottom-0 right-0 cursor-pointer group flex flex-col items-center"
          onMouseEnter={() => setRobotHovered(true)}
          onMouseLeave={() => setRobotHovered(false)}
          onClick={() => setIsOpen(true)}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Pulsing blue laser launchpad halo rings under the robot */}
          <motion.div
            animate={{
              scale: robotHovered ? [0.9, 1.4, 0.9] : [0.8, 1.15, 0.8],
              opacity: robotHovered ? [0.3, 0.7, 0.3] : [0.15, 0.45, 0.15],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-10px] w-14 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-[6px]"
          />

          {/* Flying Robot Figure */}
          <motion.div
            animate={{
              y: robotHovered ? [0, -16, 0] : [0, -7, 0],
              rotateZ: robotHovered ? [0, 4, -4, 0] : [0, 1.5, -1.5, 0],
            }}
            transition={{
              duration: robotHovered ? 1.4 : 3.0,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative h-18 w-18 flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(59,130,246,0.3)]"
          >
            {/* Robot Head Body */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full transition-transform duration-300"
            >
              {/* Ears/Antenna Receiver */}
              <rect x="25" y="24" width="50" height="4" rx="2" fill="#3b82f6" opacity="0.8" />
              <line x1="50" y1="24" x2="50" y2="10" stroke="#4f46e5" strokeWidth="3" />
              <motion.circle 
                cx="50" 
                cy="10" 
                r="4.5" 
                animate={{
                  fill: robotHovered ? ["#ef4444", "#3b82f6", "#ef4444"] : ["#10b981", "#3b82f6", "#10b981"]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />

              {/* Side Audio Wings */}
              <path d="M 12,42 L 20,40 L 20,62 L 12,60 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
              <path d="M 88,42 L 80,40 L 80,62 L 88,60 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />

              {/* Head Shell Capsule */}
              <rect x="20" y="28" width="60" height="48" rx="24" fill="#0f172a" stroke="#4f46e5" strokeWidth="3" />
              
              {/* Inner glowing visor shield */}
              <rect x="26" y="38" width="48" height="20" rx="10" fill="#020617" stroke="#3b82f6" strokeWidth="1.5" />

              {/* Blinking Cyber LED Eyes */}
              <motion.ellipse 
                cx="38" 
                cy="48" 
                rx="5" 
                animate={{
                  ry: [5, 5, 0.5, 5, 5],
                  fill: robotHovered ? ["#f59e0b", "#10b981", "#f59e0b"] : ["#3b82f6", "#60a5fa", "#3b82f6"]
                }}
                transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1 }}
              />
              <motion.ellipse 
                cx="62" 
                cy="48" 
                rx="5" 
                animate={{
                  ry: [5, 5, 0.5, 5, 5],
                  fill: robotHovered ? ["#f59e0b", "#10b981", "#f59e0b"] : ["#3b82f6", "#60a5fa", "#3b82f6"]
                }}
                transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1 }}
              />

              {/* Glowing smile indicator */}
              <path d="M 44,64 Q 50,68 56,64" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Hands */}
              <motion.circle 
                cx="14" 
                cy="51" 
                r="3.5" 
                animate={{ y: [-1, 2, -1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                fill="#3b82f6" 
              />
              <motion.circle 
                cx="86" 
                cy="51" 
                r="3.5" 
                animate={{ y: [1, -2, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                fill="#3b82f6" 
              />
            </svg>

            {/* Thruster exhaust fire sparks */}
            <motion.div
              animate={{
                scaleY: robotHovered ? [0.8, 1.8, 0.8] : [0.8, 1.3, 0.8],
                opacity: [0.6, 0.95, 0.6],
              }}
              transition={{ duration: 0.15, repeat: Infinity }}
              className="absolute bottom-[-1px] w-4.5 h-6 bg-gradient-to-t from-transparent via-blue-500 to-indigo-600 rounded-b-full origin-top blur-[1px]"
            />
          </motion.div>
        </motion.div>
      )}

      {/* Main Chat Box Container with glassmorphic layers */}
      {isOpen && (
        <motion.div
          id="chatbot-box"
          drag={isMobile ? "y" : false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.5 }}
          onDragEnd={(e, info) => {
            if (info.offset.y > 100) {
              setIsOpen(false);
            }
          }}
          initial={{ opacity: 0, y: isMobile ? "100%" : 35 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: isMobile ? "100%" : 35 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="pointer-events-auto absolute bottom-0 right-0 left-0 md:left-auto flex h-full w-full md:w-98 flex-col rounded-t-[2rem] md:rounded-2xl bg-slate-950/95 backdrop-blur-xl border-t md:border border-blue-500/20 text-white shadow-2xl overflow-hidden shadow-blue-500/10 origin-bottom"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          {isMobile && (
            <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto my-2.5 shrink-0 cursor-grab active:cursor-grabbing" />
          )}
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 px-4 py-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/30">
                <Sparkles className="h-4.5 w-4.5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs tracking-tight text-white flex items-center gap-1">
                  {lang === "ar" ? "المستشار الفني الذكي وصاحب الصفقات" : "AI Sales Strategist & Architect"}
                </h4>
                <p className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  {lang === "ar" ? "عملاء نشطون ومتابعة فورية" : "Client Lead Capture Active"}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2.5">
              {/* Text to Speech Narration Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? "Unmute Bot Voice" : "Mute Voice Response"}
                className={`p-1.5 rounded-lg border cursor-pointer hover:bg-slate-900 transition-colors ${
                  isMuted ? "border-slate-800 text-slate-500" : "border-blue-500/50 bg-blue-950/20 text-blue-400"
                }`}
              >
                {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              </button>

              <button
                id="chatbot-close-button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-900 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* CHAT LOG SCREEN */}
          {activeWizard === null && (
            <>
              {/* Message Scroll View */}
              <div
                id="chatbot-messages-container"
                ref={listRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950 scrollbar-thin scrollbar-thumb-slate-800"
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 max-w-[88%] ${
                      msg.role === "user"
                        ? "ms-auto flex-row-reverse"
                        : "me-auto"
                    }`}
                  >
                    {/* Icons */}
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        msg.role === "user"
                          ? "bg-slate-800 text-slate-300"
                          : msg.isSpecial 
                            ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white animate-bounce"
                            : "bg-blue-600 text-white"
                      }`}
                    >
                      {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-[13px] shadow-md border ${
                        msg.role === "user"
                          ? "bg-indigo-600/95 border-indigo-500/20 text-white rounded-br-none"
                          : msg.isSpecial
                            ? "bg-slate-900 border-amber-500/30 text-slate-100 rounded-bl-none font-sans"
                            : "bg-slate-900 border-slate-800/80 text-slate-200 rounded-bl-none"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="whitespace-pre-line leading-relaxed break-words font-sans text-[13px]">{msg.text}</p>
                      ) : (
                        renderMessageText(msg.text)
                      )}
                    </div>
                  </div>
                ))}

                {/* AI Loading state */}
                {isLoading && (
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="rounded-2xl rounded-bl-none bg-slate-900 border border-slate-800/80 px-4 py-2.5 shadow-sm flex items-center justify-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Collapsible Panel Handle */}
              <div 
                onClick={() => setIsShortcutsExpanded(!isShortcutsExpanded)}
                className="px-3 py-1.5 bg-slate-900 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium hover:text-white hover:bg-slate-800/40 cursor-pointer transition-all select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isShortcutsExpanded ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  {lang === "ar" ? "⚡ أدوات التخطيط السريعة والاستشارات" : "⚡ Fast Planning & Consulting Tools"}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500">
                    {isShortcutsExpanded 
                      ? (lang === "ar" ? "إخفاء" : "Hide") 
                      : (lang === "ar" ? "إظهار أدوات الحجز والتسعير 📊" : "Show Planning Tools 📊")
                    }
                  </span>
                  {isShortcutsExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronUp className="h-3.5 w-3.5" />
                  )}
                </div>
              </div>

              {/* Launcher shortcuts & Suggested triggers enclosed inside collapsable container */}
              {isShortcutsExpanded && (
                <>
                  {/* Advanced UI Launcher shortcuts */}
                  <div id="ai-launcher-shortcuts" className="px-3 py-2 bg-slate-900/40 border-t border-slate-800/60 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveWizard("booking");
                        setWizardStep(1);
                      }}
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-indigo-500/25 bg-indigo-500/15 text-indigo-300 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition-all cursor-pointer shadow-sm shadow-indigo-500/5 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <Calendar className="h-4 w-4 text-indigo-400" />
                      {lang === "ar" ? "📅 حجز مكالمة عمل استشارية مع صابر" : "📅 Book Consultation Session with Saber"}
                    </button>
                  </div>

                  {/* Dynamic Suggested triggers in footer */}
                  <div id="chatbot-suggestions" className="px-3 py-1.5 bg-slate-950 border-t border-slate-900/60 overflow-x-auto flex gap-1.5 whitespace-nowrap scrollbar-none">
                    <button
                      onClick={() => handleQuickQuestion(lang === "ar" ? "ما هي الميزانية التقريبية لبناء منصة SaaS كخدمة؟" : "What is the typical budget for an AI SaaS platform?")}
                      className="text-[10px] bg-slate-900/80 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-full hover:text-white hover:border-blue-500 transition-all cursor-pointer"
                    >
                      {lang === "ar" ? "💰 أسعار المنصات" : "💰 SaaS Estimations"}
                    </button>
                    <button
                      onClick={() => handleQuickQuestion(lang === "ar" ? "ما الفارق بين فروم ورك React وتطوير Django التقليدي؟" : "Why use Django for backends instead of simple Node?")}
                      className="text-[10px] bg-slate-900/80 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-full hover:text-white hover:border-blue-500 transition-all cursor-pointer"
                    >
                      {lang === "ar" ? "🛠️ كفاءة لغات البرمجة" : "🛠️ React vs Django"}
                    </button>
                    <button
                      onClick={handleClearHistory}
                      className={`text-[10px] border px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                        showClearConfirm
                          ? "bg-red-950/80 border-red-500 text-red-200 hover:text-white hover:bg-red-600 font-medium animate-pulse"
                          : "bg-slate-900/80 border-red-950/40 text-red-400/80 hover:text-red-300 hover:bg-red-950 hover:border-red-800"
                      }`}
                    >
                      {showClearConfirm 
                        ? (lang === "ar" ? "⚠️ اضغط للتأكيد" : "⚠️ Click to Confirm")
                        : (lang === "ar" ? "🗑️ تصفية الذاكرة" : "🗑️ Clear Context")
                      }
                    </button>
                  </div>
                </>
              )}

              {/* Message inputs form */}
              <form
                id="chatbot-form"
                onSubmit={handleSend}
                className="flex items-center gap-2 p-3 bg-slate-900 border-t border-slate-800/50"
              >
                {/* Voice input mic button */}
                <button
                  type="button"
                  onClick={handleDictation}
                  title={isListening ? "Listening... click to stop" : "Use Voice Dictation typing"}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all cursor-pointer ${
                    isListening 
                      ? "bg-red-650 text-white animate-pulse border-red-500" 
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>

                <input
                  id="chatbot-input-field"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? (lang === "ar" ? "جاري الاستماع..." : "Listening...") : t.chatbotPlaceholder}
                  disabled={isLoading}
                  className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
                <button
                  id="chat-submit-btn"
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white cursor-pointer hover:opacity-90 disabled:opacity-30 transition-all font-bold"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </>
          )}



          {/* DYNAMIC WIZARD 2: 📅 STRATEGY MEETING BOOKING */}
          {activeWizard === "booking" && (
            <div className="flex-1 flex flex-col bg-slate-950 p-4 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-2">
                <button 
                  onClick={() => setActiveWizard(null)}
                  className="p-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4.5 w-4.5 text-indigo-400" />
                  <span className="text-xs font-bold font-sans">
                    {lang === "ar" ? "جدولة مكالمة استشارية فورية" : "Book Consultant Call"}
                  </span>
                </div>
              </div>

              {bookingComplete ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3.5 px-2 py-4 animate-scaleUp">
                  <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="h-8 w-8 animate-bounce" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm tracking-tight">{lang === "ar" ? "تم حجز جلستك الاستشارية!" : "Consult Session Slot Logged!"}</h5>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {lang === "ar" ? "قام النظام بحفظ طلب اللقاء. سيتم إرسال دعوة Google Meet إلي بريدك فوراً." : "Meeting proposal logged. Google Meet invites will slide into your calendar."}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-1 uppercase tracking-tight">Full Name / Entity</label>
                      <input 
                        type="text"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="Saber Ayman"
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-1 uppercase tracking-tight">Email invite destination</label>
                      <input 
                        type="email"
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        placeholder="client@company.is"
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-semibold mb-1 uppercase">Date</label>
                        <input 
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-semibold mb-1 uppercase">Preferred Hour</label>
                        <select
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        >
                          <option value="">Select slot</option>
                          <option value="10:00 AM">10:00 AM Client timezone</option>
                          <option value="11:30 AM">11:30 AM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="3:30 PM">3:30 PM</option>
                          <option value="05:00 PM">05:00 PM EST/KSA</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-1 uppercase">Notes / Project focus (optional)</label>
                      <textarea 
                        rows={2.5}
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        placeholder={lang === "ar" ? "بناء موقع تسوق ومناقشة تفاصيل طرق الربط ببنك..." : "To scope out MERN portal contract scope..."}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Wizard Error Message */}
                  {wizardError && (
                    <div className="text-[12px] text-rose-400 bg-rose-950/20 border border-rose-900/30 px-3.5 py-2 rounded-xl animate-fadeIn mt-4" dir={lang === "ar" ? "rtl" : "ltr"}>
                      ⚠️ {wizardError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submittingWizard}
                    className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-indigo-800 hover:opacity-90 py-2 rounded-xl text-xs font-bold text-white cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    {submittingWizard ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {lang === "ar" ? "جاري حجز التوقيت..." : "Locking Slot..."}
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4.5 w-4.5" />
                        {lang === "ar" ? "تأكيد واستخراج طلب اللقاء!" : "Reserve My Consulting Slot"}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
