import React, { useState } from "react";
import { Sliders, Star, HardDrive, Layout, Server, Settings, Brain, ChevronDown, ChevronUp } from "lucide-react";
import { translations } from "../translations";
import { Skill } from "../types";
import { motion, AnimatePresence } from "motion/react";

function renderSkillIcon(name: string, category: string) {
  const normalized = name.toLowerCase().trim();

  // 1. Tailwind CSS (Palette)
  if (normalized.includes("tailwind")) {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_10px_rgba(236,180,180,0.35)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C26.21 44 28 42.21 28 40C28 38.95 27.58 38 26.9 37.3C26.22 36.6 25.8 35.65 25.8 34.6C25.8 32.39 27.59 30.6 29.8 30.6H34C39.52 30.6 44 26.12 44 20.6C44 11.43 35.05 4 24 4Z" fill="url(#paletteGrad)" />
        <circle cx="15" cy="18" r="3.5" fill="#f43f5e" />
        <circle cx="23" cy="13" r="3.5" fill="#fb923c" />
        <circle cx="31" cy="18" r="3.5" fill="#10b981" />
        <circle cx="34" cy="25" r="3.5" fill="#3b82f6" />
        <defs>
          <linearGradient id="paletteGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fca5a5" />
            <stop offset="0.5" stopColor="#fed7aa" />
            <stop offset="1" stopColor="#bfdbfe" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 2. TypeScript (Blue Diamond Crystal)
  if (normalized.includes("typescript") || normalized === "ts") {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_12px_rgba(56,189,248,0.4)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4L42 22L24 40L6 22L24 4Z" fill="url(#tsGrad)" />
        <path d="M24 4L24 40" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <path d="M6 22L42 22" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <defs>
          <linearGradient id="tsGrad" x1="6" y1="4" x2="42" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 3. React (Atom orbits rotating)
  if (normalized.includes("react")) {
    return (
      <div className="relative animate-spin" style={{ animationDuration: "14s" }}>
        <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_12px_rgba(129,140,248,0.45)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="24" cy="24" rx="6" ry="20" transform="rotate(30 24 24)" stroke="#818cf8" strokeWidth="2.2" />
          <ellipse cx="24" cy="24" rx="6" ry="20" transform="rotate(90 24 24)" stroke="#6366f1" strokeWidth="2.2" />
          <ellipse cx="24" cy="24" rx="6" ry="20" transform="rotate(150 24 24)" stroke="#4f46e5" strokeWidth="2.2" />
          <circle cx="24" cy="24" r="5" fill="#a5b4fc" />
        </svg>
      </div>
    );
  }

  // 4. REST APIs / APIs (Chain connection links)
  if (normalized.includes("rest api") || normalized === "api") {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_10px_rgba(167,139,250,0.35)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 28C11.58 28 8 24.42 8 20C8 15.58 11.58 12 16 12H24V17H16C14.34 17 13 18.34 13 20C13 21.66 14.34 23 16 23H24V28H16Z" fill="#a78bfa" />
        <path d="M32 20C32 24.42 28.42 28 24 28H16V23H24C25.66 23 27 21.66 27 20C27 18.34 25.66 17 24 17H16V12H24C28.42 12 32 15.58 32 20Z" fill="#c084fc" />
        <rect x="18" y="18" width="12" height="4" rx="2" fill="#e0e7ff" />
      </svg>
    );
  }

  // 5. Django (Vibrant green mint python snake)
  if (normalized.includes("django")) {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_10px_rgba(16,185,129,0.35)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 32C12 30 14 26 18 26H28C32 26 36 22 36 18C36 14 32 10 26 10H14C11 10 9 12 9 15C9 18 11 20 14 20H26C28 20 29 21 29 22C29 23 28 24 26 24H18C12 24 7 28 7 34C7 40 12 43 18 43H30C33 43 35 41 35 38C35 35 33 33 30 33H18C14 33 12 34 12 32Z" fill="url(#djangoSnake)" />
        <circle cx="15" cy="15" r="2.5" fill="#ffffff" />
        <defs>
          <linearGradient id="djangoSnake" x1="7" y1="10" x2="36" y2="43" gradientUnits="userSpaceOnUse">
            <stop stopColor="#047857" />
            <stop offset="0.5" stopColor="#10b981" />
            <stop offset="1" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 6. Express.js / Rocket Spacecraft
  if (normalized.includes("express")) {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_5px_12px_rgba(244,63,94,0.4)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M38 10C38 10 32 12 28 17C24 22 23 27 23 27C23 27 18 28 13 32C9 35.2 6.5 40 6.5 40C6.5 40 11.3 37.5 14.5 33.5C18.5 28.5 19.5 23.5 19.5 23.5C19.5 23.5 24.5 22.5 29.5 18.5C34.5 14.5 38 10 38 10Z" fill="url(#expressRocket)" />
        <path d="M12 37L7 41L11 41L12 37Z" fill="#f43f5e" />
        <circle cx="29" cy="18" r="3.2" fill="#ffffff" />
        <defs>
          <linearGradient id="expressRocket" x1="6.5" y1="40" x2="38" y2="10" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f43f5e" />
            <stop offset="0.6" stopColor="#fb7185" />
            <stop offset="1" stopColor="#fca5a5" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 7. Node.js (Glowing 3D Green Sphere)
  if (normalized.includes("node")) {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_12px_rgba(34,197,94,0.45)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" fill="url(#nodeSphere)" />
        <circle cx="17" cy="17" r="5" fill="#ffffff" opacity="0.32" />
        <defs>
          <radialGradient id="nodeSphere" cx="30%" cy="30%" r="70%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="65%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </radialGradient>
        </defs>
      </svg>
    );
  }

  // 8. Custom merged Git & GitHub Visual
  if (normalized.includes("git & github") || normalized.includes("git and github")) {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_10px_rgba(236,72,153,0.35)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" fill="url(#gitHubMerged)" />
        <circle cx="16" cy="30" r="2.5" fill="#f43f5e" />
        <circle cx="28" cy="18" r="2.5" fill="#f1f5f9" />
        <line x1="16" y1="30" x2="28" y2="18" stroke="#ffffff" strokeWidth="2" />
        <path d="M26 15C22.1 15 19 18.1 19 22C19 25.1 21 27.7 23.8 28.6C24.1 28.7 24.3 28.5 24.3 28.3V27C21.3 27.4 20.9 26 20.9 26C20.6 25.2 20.1 25 20.1 25C19.5 24.6 20.2 24.6 20.2 24.6C20.9 24.6 21.3 25.3 21.3 25.3C21.9 26.4 22.9 26.1 23.3 25.9C23.4 25.4 23.6 25.1 23.8 24.9C22.2 24.7 20.6 24.1 20.6 21.4C20.6 20.6 20.9 20 21.3 19.5C21.3 19.3 21 18.6 21.4 17.6C21.4 17.6 22 17.4 23.3 18.3C23.9 18.1 24.5 18 25 18C25.5 18 26.1 18.1 26.7 18.3C28 17.4 28.6 17.6 28.6 17.6C29 18.6 28.7 19.3 28.7 19.5C29.1 20 29.4 20.6 29.4 21.4C29.4 24.1 27.8 24.7 26.2 24.9C26.5 25.1 26.7 25.6 26.7 26.2V28.3C26.3 28.5 26.5 28.7 26.8 28.6C29.6 27.7 31.6 25.1 31.6 22C31.6 18.1 28.9 15 25 15Z" fill="#ffffff" />
        <defs>
          <linearGradient id="gitHubMerged" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f43f5e" />
            <stop offset="0.6" stopColor="#ec4899" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 9. GitHub (Octocat Mascot)
  if (normalized === "github" || normalized.includes("github")) {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_10px_rgba(244,114,182,0.35)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="32" height="32" rx="16" fill="url(#githubCatGrad)" />
        <path d="M24 13C18.48 13 14 17.48 14 23C14 27.42 16.87 31.16 20.84 32.48C21.34 32.57 21.52 32.26 21.52 32V30.1C18.74 30.7 18.15 28.76 18.15 28.76C17.7 27.6 17.04 27.29 17.04 27.29C16.13 26.67 17.11 26.68 17.11 26.68C18.12 26.75 18.65 27.72 18.65 27.72C19.54 29.26 21 28.81 21.58 28.53C21.67 27.89 21.93 27.45 22.21 27.2C19.99 26.95 17.65 26.09 17.65 22.25C17.65 21.15 18.04 20.26 18.68 19.56C18.58 19.3 18.23 18.28 18.78 16.9C18.78 16.9 19.62 16.63 21.53 17.92C22.33 17.7 23.17 17.59 24.01 17.59C24.85 17.59 25.69 17.7 26.49 17.92C28.4 16.63 29.24 16.9 29.24 16.9C29.79 18.28 29.44 19.3 29.34 19.56C29.98 20.26 30.37 21.15 30.37 22.25C30.37 26.1 28.02 26.95 25.79 27.2C26.15 27.51 26.47 28.13 26.47 29.08V32C26.47 32.27 26.65 32.58 27.16 32.48C31.13 31.16 34 27.42 34 23C34 17.48 29.52 13 24 13Z" fill="#ffffff" />
        <defs>
          <linearGradient id="githubCatGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fb7185" />
            <stop offset="1" stopColor="#e11d48" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 10. Git (Dual Orange Package Storage Box)
  if (normalized === "git" || normalized.includes("git &") || normalized.trim() === "git") {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_10px_rgba(249,115,22,0.4)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 5L41 14.5V33.5L24 43L7 33.5V14.5L24 5Z" fill="url(#gitBoxGrad)" />
        <path d="M24 5L24 43" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
        <path d="M7 14.5L24 24L41 14.5" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="gitBoxGrad" x1="7" y1="5" x2="41" y2="43" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffedd5" />
            <stop offset="0.4" stopColor="#f97316" />
            <stop offset="1" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 11. PostgreSQL (Geometric Royal Blue Elephant Mascot) — 100% Unique
  if (normalized.includes("postgres")) {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_12px_rgba(51,103,145,0.4)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="14" fill="url(#pgGrad)" opacity="0.12" />
        <path d="M14 20C14 16.69 16.69 14 20 14H28C31.31 14 34 16.69 34 20V26C34 29.31 31.31 32 28 32H20C16.69 32 14 29.31 14 26V20Z" fill="url(#pgGrad)" />
        <path d="M11 22C11 19 13.5 17 15 17V27C13.5 27 11 25 11 22Z" fill="#93c5fd" />
        <path d="M37 22C37 19 34.5 17 33 17V27C34.5 27 37 25 37 22Z" fill="#93c5fd" />
        <path d="M24 30C24 33 26 35 28 35C29 35 30 34 30 33" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="19" cy="21" r="1.5" fill="#ffffff" />
        <circle cx="29" cy="21" r="1.5" fill="#ffffff" />
        <defs>
          <linearGradient id="pgGrad" x1="14" y1="14" x2="34" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 12. MySQL (Neon Blue Relational Storage Stack) — 100% Unique
  if (normalized.includes("mysql") || normalized === "sql" || normalized.includes("sql")) {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_12px_rgba(30,144,255,0.4)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="12" rx="16" ry="6" fill="#00758f" />
        <path d="M8 12V20C8 23.3 15.2 26 24 26C32.8 26 40 23.3 40 20V12" fill="url(#mysqlLower1)" />
        <path d="M8 20V28C8 31.3 15.2 34 24 34C32.8 34 40 31.3 40 28V20" fill="url(#mysqlLower2)" />
        <ellipse cx="24" cy="12" rx="12" ry="4.5" fill="#00a3cc" />
        <line x1="24" y1="15" x2="24" y2="31" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="3 3" />
        <defs>
          <linearGradient id="mysqlLower1" x1="8" y1="12" x2="40" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#005f73" />
            <stop offset="1" stopColor="#0a9396" />
          </linearGradient>
          <linearGradient id="mysqlLower2" x1="8" y1="20" x2="40" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#005f73" />
            <stop offset="1" stopColor="#94d2bd" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 13. MongoDB (Leaves logo)
  if (normalized.includes("mongo")) {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_10px_rgba(16,185,129,0.38)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 5C24 5 13 17 13 27.5C13 35 18 39.5 24 41.5C30 39.5 35 35 35 27.5C35 17 24 5 24 5Z" fill="url(#mongoGradLeaf)" />
        <path d="M24 5V41.5" stroke="#10b981" strokeWidth="2.2" strokeDasharray="3 3" />
        <defs>
          <linearGradient id="mongoGradLeaf" x1="13" y1="5" x2="35" y2="41.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a7f3d0" />
            <stop offset="0.5" stopColor="#10b981" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 14. Python Developer Badge
  if (normalized.includes("python")) {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_10px_rgba(59,130,246,0.35)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4C17.37 4 15 6 15 11H20V13H11C6.03 13 4 15.37 4 22C4 28.63 6.03 31 11 31H13V26C13 19.37 15.37 17 22 17H29V15C29 10.03 26.63 4 24 4Z" fill="#3b82f6" />
        <path d="M24 44C30.63 44 33 42 33 37H28V35H37C41.97 35 44 32.63 44 26C44 19.37 41.97 17 37 17H35V22C35 28.63 32.63 31 26 31H19V33C19 37.97 21.37 44 24 44Z" fill="#facc15" />
        <circle cx="19" cy="8.5" r="1.5" fill="#ffffff" />
        <circle cx="29" cy="39.5" r="1.5" fill="#000000" />
      </svg>
    );
  }

  // 15. Postman (Astronaut Space Helmet) — 100% Unique
  if (normalized.includes("postman")) {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_12px_rgba(249,115,22,0.4)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" fill="url(#postmanGrad)" />
        <path d="M14 23C14 17.5 18.5 14 24 14C29.5 14 34 17.5 34 23V27H14V23Z" fill="#1e293b" />
        <path d="M17 21C17 18.5 20.1 16.5 24 16.5C27.9 16.5 31 18.5 31 21V24H17V21Z" fill="#38bdf8" />
        <path d="M25 17.5C28.5 17.5 30 19 30 20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" strokeDasharray="none" />
        <rect x="21" y="29" width="6" height="4" rx="1" fill="#ef4444" />
        <defs>
          <linearGradient id="postmanGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffedd5" />
            <stop offset="0.5" stopColor="#f97316" />
            <stop offset="1" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 16. Figma (Layered drops brand layout) — 100% Unique
  if (normalized.includes("figma")) {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_10px_rgba(162,89,255,0.35)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(10, 4)">
          <path d="M0 7C0 3.13 3.13 0 7 0C10.87 0 14 3.13 14 7V14H7C3.13 14 0 10.87 0 7Z" fill="#f24e1e" />
          <path d="M14 7C14 3.13 17.13 0 21 0C24.87 0 28 3.13 28 7C28 10.87 24.87 14 21 14H14V7Z" fill="#ff7262" />
          <path d="M0 21C0 17.13 3.13 14 7 14H14V28H7C3.13 28 0 24.87 0 21Z" fill="#a259ff" />
          <circle cx="21" cy="21" r="7" fill="#1abc9c" />
          <path d="M0 35C0 31.13 3.13 28 7 28H14V35C14 38.87 10.87 42 7 42C3.13 42 0 38.87 0 35Z" fill="#0acf83" />
        </g>
      </svg>
    );
  }

  // 17. Deep Learning (Advanced Layer Node Mesh) — 100% Unique
  if (normalized.includes("deep learning")) {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_12px_rgba(99,102,241,0.4)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="14" fill="url(#dlGrad)" opacity="0.1" />
        <circle cx="12" cy="14" r="3" fill="#818cf8" />
        <circle cx="12" cy="24" r="3" fill="#818cf8" />
        <circle cx="12" cy="34" r="3" fill="#818cf8" />
        <circle cx="24" cy="9" r="3" fill="#a5b4fc" />
        <circle cx="24" cy="19" r="3" fill="#a5b4fc" />
        <circle cx="24" cy="29" r="3" fill="#a5b4fc" />
        <circle cx="24" cy="39" r="3" fill="#a5b4fc" />
        <circle cx="36" cy="19" r="3" fill="#e0e7ff" />
        <circle cx="36" cy="29" r="3" fill="#e0e7ff" />
        <path d="M12 14L24 9M12 14L24 19M12 14L24 29" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <path d="M12 24L24 9M12 24L24 19M12 24L24 29M12 24L24 39" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <path d="M12 34L24 19M12 34L24 29M12 34L24 39" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <path d="M24 9L36 19M24 9L36 29" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <path d="M24 19L36 19M24 19L36 29" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <path d="M24 29L36 19M24 29L36 29" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <path d="M24 39L36 19M24 39L36 29" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <defs>
          <linearGradient id="dlGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 18. AI Integrations & LLMs (Magical sparking Gemini star cluster) — 100% Unique
  if (normalized.includes("llm") || normalized.includes("integrations") || normalized.includes("generative")) {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_12px_rgba(168,85,247,0.45)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" fill="url(#aiLLMBackground)" />
        <path d="M24 11C24 16.5 21.5 19 16 19C21.5 19 24 21.5 24 27C24 21.5 26.5 19 32 19C26.5 19 24 16.5 24 11Z" fill="#ffffff" className="animate-pulse" />
        <path d="M34 25C34 27.8 32.8 29 30 29C32.8 29 34 30.2 34 33C34 30.2 35.2 29 38 29C35.2 29 34 27.8 34 25Z" fill="#fed7aa" />
        <path d="M15 26C15 28.1 14.1 29 12 29C14.1 29 15 29.9 15 32C15 29.9 15.9 29 18 29C15.9 29 15 28.1 15 26Z" fill="#e0e7ff" />
        <defs>
          <linearGradient id="aiLLMBackground" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c084fc" />
            <stop offset="0.5" stopColor="#818cf8" />
            <stop offset="1" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 19. Machine learning (Digital Brain Mesh)
  if (category === "ai" || normalized.includes("machine learning") || normalized.includes("learning") || normalized.includes("intelligence")) {
    return (
      <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_12px_rgba(168,85,247,0.45)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="7" y="7" width="34" height="34" rx="17" fill="url(#aiBrainSacc)" opacity="0.12" />
        <circle cx="16" cy="18" r="3.2" fill="#a855f7" className="animate-ping animate-pulse" />
        <circle cx="16" cy="18" r="3.2" fill="#a855f7" />
        <circle cx="32" cy="18" r="3.2" fill="#3b82f6" />
        <circle cx="24" cy="25" r="4.5" fill="#6366f1" />
        <circle cx="16" cy="31" r="3.2" fill="#06b6d4" />
        <circle cx="32" cy="31" r="3.2" fill="#10b981" />
        <line x1="16" y1="18" x2="24" y2="25" stroke="#6366f1" strokeWidth="1.8" />
        <line x1="32" y1="18" x2="24" y2="25" stroke="#6366f1" strokeWidth="1.8" />
        <line x1="16" y1="31" x2="24" y2="25" stroke="#6366f1" strokeWidth="1.8" />
        <line x1="32" y1="31" x2="24" y2="25" stroke="#6366f1" strokeWidth="1.8" />
        <defs>
          <linearGradient id="aiBrainSacc" x1="7" y1="7" x2="41" y2="41" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c084fc" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 20. Fallback Default Skill graphic (Category smart logo)
  return (
    <svg className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_4px_10px_rgba(148,163,184,0.3)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="14" stroke="url(#fallbackGrad)" strokeWidth="3" strokeDasharray="6 4" />
      <circle cx="24" cy="24" r="6" fill="#64748b" />
      <defs>
        <linearGradient id="fallbackGrad" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#94a3b8" />
          <stop offset="1" stopColor="#475569" />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface SkillsProps {
  lang: "en" | "ar";
  skills: Skill[];
}

export default function Skills({ lang, skills }: SkillsProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "frontend" | "backend" | "database" | "tools" | "ai">("all");
  const [isExpanded, setIsExpanded] = useState(false);
  
  const t = translations[lang];

  // Map category identifiers
  const categories = [
    { id: "all", label: t.tabAll, icon: Sliders },
    { id: "frontend", label: t.tabFrontend, icon: Layout },
    { id: "backend", label: t.tabBackend, icon: Server },
    { id: "database", label: t.tabDatabase, icon: HardDrive },
    { id: "tools", label: t.tabTools, icon: Settings },
    { id: "ai", label: t.tabAi, icon: Brain }
  ];

  const filteredSkills = activeCategory === "all"
    ? skills
    : skills.filter(s => s.category.toLowerCase() === activeCategory.toLowerCase());

  // Compact visual density bounds for mobile: initially show 6 skills
  const initialLimit = 6;
  const displayedSkills = isExpanded ? filteredSkills : filteredSkills.slice(0, initialLimit);
  const hasMore = filteredSkills.length > initialLimit;

  // Reset expansion when changing tabs to prevent state mismatch
  const handleCategoryChange = (catId: any) => {
    setActiveCategory(catId);
    setIsExpanded(false);
  };

  // Technology marquee data logs
  const logoTicker = [
    "React.js", "TypeScript", "Node.js", "Express.js", 
    "Python", "Django", "MongoDB", "MySQL", "PostgreSQL", "Postman", "Figma", "Git", "GitHub"
  ];

  return (
    <section 
      id="skills" 
      className="py-12 md:py-20 section-shading-secondary text-slate-900 dark:text-white"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-14 space-y-2 md:space-y-3">
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 uppercase">
            {t.skillsBadge}
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold font-sans tracking-tight text-slate-900 dark:text-white">
            {t.skillsTitle}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-sans">
            {t.skillsSubtitle}
          </p>
        </div>

        {/* Tab Buttons Picker */}
        <div id="skills-category-tabs" className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 mb-8 md:mb-12 max-w-4xl mx-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id as any)}
                className={`flex items-center gap-1.5 text-[11px] md:text-xs font-bold font-sans px-3 py-2 md:px-4 rounded-xl transition-all border cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500/30 scale-[1.03] shadow-lg shadow-blue-500/10"
                    : "bg-white border-slate-200 dark:bg-slate-900 dark:border-white/5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Cards ratings Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12">
          <AnimatePresence mode="popLayout">
            {displayedSkills.map((skill, index) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.15) }}
                key={skill.id}
                className="p-5 md:p-7 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-sm relative overflow-hidden flex flex-col items-center justify-center text-center gap-4 group"
              >
                {/* 1. Centered custom stylized skill icon illustration */}
                <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  {renderSkillIcon(skill.name, skill.category)}
                </div>

                {/* 2. Centered Skill Name with subtitle category */}
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs md:text-sm tracking-tight text-slate-900 dark:text-white truncate">
                    {skill.name}
                  </h4>
                  <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-slate-400 dark:text-slate-500 mt-0.5 block">
                    {skill.category}
                  </span>
                </div>

                {/* 3 & 4. Centered progress bar track & level percentage indicator */}
                <div className="w-full px-2">
                  <div className="w-full h-1.5 md:h-2 bg-slate-100 dark:bg-slate-950/80 rounded-full overflow-hidden relative">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full origin-left"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </div>
                  
                  <span className="text-[10px] md:text-xs font-mono font-bold text-indigo-500 dark:text-indigo-400 mt-1.5 block">
                    {skill.level}%
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show More Actions Button */}
        {hasMore && (
          <div className="flex justify-center mb-10 md:mb-20">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group flex items-center gap-2 text-xs font-bold font-sans px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-white hover:border-blue-500/30 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <span>{isExpanded ? (t.btnShowLess || "Show Less") : (t.btnShowMore || "Show More")}</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              ) : (
                <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              )}
            </button>
          </div>
        )}

        {/* Technical Logotypes Running Marquee */}
        <div className="relative w-full overflow-hidden bg-slate-100/30 dark:bg-slate-900/25 border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-6 shadow-inner select-none">
          <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-slate-50/80 dark:from-slate-950/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-slate-50/80 dark:from-slate-950/80 to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex gap-8 items-center whitespace-nowrap animate-marquee">
            {/* First sequence iterations */}
            {logoTicker.concat(logoTicker).map((logo, idx) => (
              <span 
                key={idx}
                className="font-mono text-xs md:text-sm tracking-widest font-black text-slate-400 dark:text-slate-500 hover:text-slate-850 dark:hover:text-white transition-colors uppercase mx-4 inline-block"
              >
                &lt;{logo} /&gt;
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Infinite scrolling ticker styles injected */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        [dir="rtl"] .animate-marquee {
          animation: marquee 25s linear infinite reverse;
        }
      `}</style>
    </section>
  );
}
