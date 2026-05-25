import React, { useState } from "react";
import { Mail, Sparkles, BookOpen, AlertCircle, Check } from "lucide-react";
import { translations } from "../translations";

interface BlogPlaceholderProps {
  lang: "en" | "ar";
}

export default function BlogPlaceholder({ lang }: BlogPlaceholderProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const t = translations[lang];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Persist subscription natively in localstorage
    const subs = JSON.parse(localStorage.getItem("saber_subscribers") || "[]");
    if (!subs.includes(email.trim())) {
      subs.push(email.trim());
      localStorage.setItem("saber_subscribers", JSON.stringify(subs));
    }

    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000); // Clear after 5 seconds
  };

  return (
    <section 
      id="blog" 
      className="py-12 md:py-20 section-shading-primary text-slate-900 dark:text-white"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 uppercase">
            {t.blogBadge}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-sans tracking-tight text-slate-900 dark:text-white">
            {t.blogTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-sans">
            {t.blogSubtitle}
          </p>
        </div>

        {/* Beautiful Glass Panel Container Card */}
        <div className="max-w-3xl mx-auto bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl text-center">
          {/* Neon Orb background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -space-y-1/2 h-44 w-44 bg-indigo-600/15 rounded-full blur-[80px]" style={{ animationDelay: "1s" }}></div>

          <div className="space-y-6 relative z-10 max-w-lg mx-auto">
            {/* Visual Header */}
            <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-650/10 dark:from-slate-900 dark:to-slate-950 dark:border dark:border-slate-800 text-blue-400 mx-auto animate-bounce" style={{ animationDuration: "3s" }}>
              <BookOpen className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-black font-sans tracking-tight text-slate-900 dark:text-white">
                {t.blogComingSoon}
              </h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                {t.blogComingSoonDesc}
              </p>
            </div>

            {/* Newsletter form */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto pt-4">
              <div className="relative w-full">
                <Mail className="absolute top-3.5 left-4.5 rtl:right-4.5 rtl:left-auto h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang === "ar" ? "أدخل بريدك الإلكتروني واشترك مسبقاً..." : "Enter your business email..."}
                  className="w-full rounded-xl bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-800 px-12 py-3 text-xs focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white shadow-inner"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-sans font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer hover:scale-[1.03]"
              >
                {t.blogNotifyButton}
              </button>
            </form>

            {/* Subscribed Success Notification Feedback */}
            {subscribed && (
              <div className="flex items-center gap-2 justify-center bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-xl text-xs text-emerald-400 animate-slide-up">
                <Check className="h-4.5 w-4.5" />
                <span>
                  {lang === "ar" 
                    ? "تهانينا! لقد تم إدراج بريدك في لائحة الشرف وسنرسل لك إشعاراً فور الصدور." 
                    : "Excellent! Your email is verified. Saber's technical specs will arrive directly in your inbox!"}
                </span>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
