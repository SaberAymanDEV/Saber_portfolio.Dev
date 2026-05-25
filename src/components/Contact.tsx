import React, { useState } from "react";
import { Mail, Phone, Linkedin, Send, MessageCircle, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { translations } from "../translations";
import { Profile } from "../types";

interface ContactProps {
  lang: "en" | "ar";
  profile: Profile;
}

export default function Contact({ lang, profile }: ContactProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus("sending");
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      });

      if (response.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <section 
      id="contact" 
      className="py-12 md:py-20 section-shading-secondary text-slate-900 dark:text-white"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16 space-y-3">
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 uppercase">
            {t.contactBadge}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-sans tracking-tight text-slate-900 dark:text-white">
            {t.contactTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-sans">
            {t.contactSubtitle}
          </p>
        </div>

        {/* Form and info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Info Panel Cards */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick WhatsApp chat CTA */}
            <a 
              href="https://wa.me/201017413228"
              target="_blank"
              referrerPolicy="no-referrer"
              className="group block p-6 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-emerald-900/20 hover:border-emerald-500/60 hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-md relative overflow-hidden text-slate-900 dark:text-white"
            >
              {/* Star sparkles overlay */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>

              <div className="flex items-center gap-4">
                <div className="h-11 w-11 flex items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-5.5 w-5.5 fill-current" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                    {lang === "ar" ? "تواصل معي عبر واتساب" : "Direct WhatsApp Chat"}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 tracking-wider">
                    {profile.whatsapp || "+20 1017413228"}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                {lang === "ar" ? "دردشة آمنة وفورية" : "Send Instant Prompt"}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </a>

            {/* Email contact */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 flex items-center gap-4 hover:scale-[1.01] transition-all">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs text-slate-550 font-bold uppercase tracking-wider">Email Address</h4>
                <a href={`mailto:${profile.email}`} className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:underline">
                  {profile.email || "saberayman.dev@gmail.com"}
                </a>
              </div>
            </div>

            {/* Phone contact */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 flex items-center gap-4 hover:scale-[1.01] transition-all">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs text-slate-550 font-bold uppercase tracking-wider">Direct Hotline</h4>
                <a href={`tel:${profile.whatsapp}`} className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:underline">
                  {profile.whatsapp || "+20 1017413228"}
                </a>
              </div>
            </div>

            {/* LinkedIn social handles linking */}
            <a 
              href="https://linkedin.com/in/saber-ayman-saber" 
              target="_blank" 
              referrerPolicy="no-referrer"
              className="group p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 flex items-center gap-4 hover:border-blue-500/20 hover:scale-[1.01] transition-all"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 group-hover:scale-110 transition-all">
                <Linkedin className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs text-slate-550 font-bold uppercase tracking-wider">Professional Profile</h4>
                <p className="text-xs md:text-sm font-semibold text-slate-755 dark:text-slate-250 group-hover:underline">{profile.name}</p>
              </div>
            </a>
          </div>

          {/* Contact POST message Form block */}
          <div className="lg:col-span-3">
            <form 
              onSubmit={handleSubmit}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 space-y-5 shadow-xl relative"
            >
              {/* Dynamic notification bars */}
              {status === "success" && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl flex items-center gap-3 text-sm text-emerald-400">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>{t.contactSuccessMsg}</span>
                </div>
              )}
              {status === "error" && (
                <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-2xl flex items-center gap-3 text-sm text-red-400">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{t.contactErrorMsg}</span>
                </div>
              )}

              {/* Grid selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-500 mb-1 font-bold">{t.contactFormName}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Saber Ayman"
                    className="w-full rounded-xl bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-800 p-3 text-xs focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-500 mb-1 font-bold">{t.contactFormEmail}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. company@gmail.com"
                    className="w-full rounded-xl bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-800 p-3 text-xs focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-500 mb-1 font-bold">{t.contactFormSubject}</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. remote full stack recruitment proposal"
                  className="w-full rounded-xl bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-800 p-3 text-xs focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-500 mb-1 font-bold">{t.contactFormMessage}</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your freelance requirements..."
                  className="w-full rounded-2xl bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-800 p-3 text-xs focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-500 py-3 font-sans font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 cursor-pointer transition-all disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
                {status === "sending" ? t.contactFormSending : t.contactFormSubmit}
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
