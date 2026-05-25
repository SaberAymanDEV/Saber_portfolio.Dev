import React, { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight, Star, MessageSquare } from "lucide-react";
import { translations } from "../translations";
import { Testimonial } from "../types";

interface TestimonialsProps {
  lang: "en" | "ar";
  testimonials: Testimonial[];
}

export default function Testimonials({ lang, testimonials }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const t = translations[lang];

  // Auto sliding timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000); // Shift every 8 seconds
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section 
      id="testimonials" 
      className="py-12 md:py-20 section-shading-secondary text-slate-900 dark:text-white"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16 space-y-3">
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 uppercase">
            {t.testimonialsBadge}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-sans tracking-tight text-slate-900 dark:text-white">
            {t.testimonialsTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-sans">
            {t.testimonialsSubtitle}
          </p>
        </div>

        {/* Carousel Slider Panel */}
        <div className="max-w-4xl mx-auto relative px-4 md:px-8">
          
          {/* Main Card viewport */}
          <div className="p-8 md:p-12 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 relative shadow-2xl overflow-hidden min-h-[300px] flex flex-col justify-between">
            {/* Ambient decorative glowing overlay */}
            <div className="absolute -top-12 -left-12 h-44 w-44 bg-blue-600/5 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <Quote className="absolute top-6 right-6 h-12 w-12 text-blue-600/15" />

            {/* Testimonial Active Item */}
            <div className="space-y-6 relative z-10">
              {/* Stars Row */}
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4.5 w-4.5 fill-current" />
                ))}
              </div>

              {/* Verified Text Quote */}
              <p className="text-base md:text-lg font-sans leading-relaxed tracking-wide italic text-slate-800 dark:text-slate-100">
                "{lang === "ar" ? testimonials[activeIndex].textAr : testimonials[activeIndex].textEn}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-900">
                <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-sm tracking-tight">
                  {testimonials[activeIndex].name.split(" ").map(w => w[0]).join("")}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {testimonials[activeIndex].name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === "ar" ? testimonials[activeIndex].roleAr : testimonials[activeIndex].roleEn}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Buttons Toolbar */}
          <div className="flex items-center justify-between mt-6">
            {/* Custom dots trackers indicator */}
            <div className="flex gap-2.5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    activeIndex === idx ? "w-7 bg-blue-600" : "w-2.5 bg-slate-800"
                  }`}
                ></button>
              ))}
            </div>

            {/* Direction Arrows */}
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-815 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-815 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
