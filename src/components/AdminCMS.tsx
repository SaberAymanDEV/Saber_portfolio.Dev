import React, { useState, useEffect } from "react";
import { 
  Lock, Settings, UserCheck, Briefcase, Award, Sliders, Layers, 
  Trash2, Plus, Edit3, Mail, Check, Eye, Download, AlertCircle, 
  LogOut, RefreshCcw, FileText, CheckCheck, Globe, Phone, FileUp, ToggleLeft, ToggleRight,
  Sparkles, Calendar, Clock
} from "lucide-react";
import { translations } from "../translations";
import { Profile, Skill, Service, Project, Certificate, Testimonial, ContactMessage, BlogPost } from "../types";

interface AdminCMSProps {
  lang: "en" | "ar";
  onClose: () => void;
  portfolioData: {
    profile: Profile;
    skills: Skill[];
    services: Service[];
    projects: Project[];
    certificates: Certificate[];
    testimonials: Testimonial[];
    blogs?: BlogPost[];
  };
  refreshData: () => void;
}

export default function AdminCMS({ lang, onClose, portfolioData, refreshData }: AdminCMSProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "projects" | "certificates" | "skills" | "services" | "inquiries" | "blogs" | "bookings" | "credentials">("profile");
  
  // Credentials management states
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminPassConfirm, setAdminPassConfirm] = useState("");
  const [credStatus, setCredStatus] = useState({ success: false, message: "", isError: false });
  
  // CMS State variables
  const [profile, setProfile] = useState<Profile>(portfolioData.profile);
  const [projects, setProjects] = useState<Project[]>(portfolioData.projects);
  const [certificates, setCertificates] = useState<Certificate[]>(portfolioData.certificates);
  const [skills, setSkills] = useState<Skill[]>(portfolioData.skills);
  const [services, setServices] = useState<Service[]>(portfolioData.services);
  const [blogs, setBlogs] = useState<BlogPost[]>(portfolioData.blogs || []);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [token, setToken] = useState("");

  // CRM Bookings
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoadingCRM, setIsLoadingCRM] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ success: false, message: "" });
  const [deleteConf, setDeleteConf] = useState<{
    titleEn: string;
    titleAr: string;
    messageEn: string;
    messageAr: string;
    onConfirm: () => void | Promise<void>;
  } | null>(null);

  const t = translations[lang];

  // Load token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("saber_cms_token");
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  // Update states when portfolioData changes
  useEffect(() => {
    setProfile(portfolioData.profile);
    setProjects(portfolioData.projects);
    setCertificates(portfolioData.certificates);
    setSkills(portfolioData.skills);
    setServices(portfolioData.services);
    setBlogs(portfolioData.blogs || []);
  }, [portfolioData]);

  // Load recruiter messages and CRM data when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchMessages();
      fetchCRM();
      fetchCredentialsInfo(token || localStorage.getItem("saber_cms_token") || "");
    }
  }, [isLoggedIn, token]);

  const fetchCredentialsInfo = async (activeToken: string) => {
    try {
      const res = await fetch("/api/portfolio/credentials", {
        headers: { "Authorization": `Bearer ${activeToken || token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUser(data.username);
      }
    } catch (err) {
      console.error("Error fetching credentials info:", err);
    }
  };

  const saveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredStatus({ success: false, message: "", isError: false });

    if (!adminUser.trim()) {
      setCredStatus({ 
        success: false, 
        message: lang === "ar" ? "اسم المستخدم لا يمكن أن يكون فارغاً." : "Username cannot be empty.", 
        isError: true 
      });
      return;
    }

    if (adminPass || adminPassConfirm) {
      if (adminPass !== adminPassConfirm) {
        setCredStatus({ 
          success: false, 
          message: lang === "ar" ? "كلمتا المرور غير متطابقتين!" : "Passwords do not match!", 
          isError: true 
        });
        return;
      }
      if (adminPass.length < 5) {
        setCredStatus({ 
          success: false, 
          message: lang === "ar" ? "كلمة المرور يجب أن تكون بحد أدنى 5 رموز." : "Password must be at least 5 characters.", 
          isError: true 
        });
        return;
      }
    }

    setSaving(true);
    try {
      const response = await fetch("/api/portfolio/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: adminUser.trim(),
          password: adminPass || undefined
        })
      });

      if (response.ok) {
        setCredStatus({ 
          success: true, 
          message: lang === "ar" ? "تم تحديث بيانات الدخول وحساب المسؤول بنجاح!" : "Admin login credentials updated successfully!", 
          isError: false 
        });
        setAdminPass("");
        setAdminPassConfirm("");
        fetchCredentialsInfo(token);
      } else {
        const errData = await response.json();
        setCredStatus({ success: false, message: errData.error || "Failed to update credentials", isError: true });
      }
    } catch (err) {
      setCredStatus({ success: false, message: "Server connection error", isError: true });
    } finally {
      setSaving(false);
    }
  };

  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const response = await fetch("/api/messages", {
        headers: { "Authorization": `Bearer ${token || localStorage.getItem("saber_cms_token")}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const fetchCRM = async () => {
    setIsLoadingCRM(true);
    try {
      const activeTok = token || localStorage.getItem("saber_cms_token");
      const bookingsRes = await fetch("/api/bookings", {
        headers: { "Authorization": `Bearer ${activeTok}` }
      });
      if (bookingsRes.ok) {
        setBookings(await bookingsRes.json());
      }
    } catch (error) {
      console.error("Error fetching CRM info:", error);
    } finally {
      setIsLoadingCRM(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        setLoginError("Access denied. Invalid credentials.");
        return;
      }
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("saber_cms_token", data.token);
        setToken(data.token);
        setIsLoggedIn(true);
      } else {
        setLoginError(data.error || "Access denied. Invalid credentials.");
      }
    } catch (error) {
      setLoginError("Access denied. Invalid credentials.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("saber_cms_token");
    setToken("");
    setIsLoggedIn(false);
  };

  // Generic File Uploader Helper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string, name?: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        callback(reader.result, file.name);
      }
    };
  };

  const saveProfile = async () => {
    setSaving(true);
    setSaveStatus({ success: false, message: "" });
    try {
      const response = await fetch("/api/portfolio/profile", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      if (response.ok) {
        setSaveStatus({ success: true, message: "Profile stats updated successfully!" });
        refreshData();
      } else {
        const isAuthError = response.status === 401 || response.status === 404;
        const msg = isAuthError 
          ? (lang === "ar" ? "فشلت المصادقة المباشرة! الجلسة منتهية الصلاحية. من فضلك قم بتسجيل الخروج والولوج مجدداً." : "Session expired or unauthorized. Please log out and log in again.")
          : (lang === "ar" ? "تعذر حفظ تعديلات الملف الشخصي." : "Authorization failure updating profile.");
        setSaveStatus({ success: false, message: msg });
      }
    } catch (error) {
      setSaveStatus({ success: false, message: "Network error saving profile." });
    } finally {
      setSaving(false);
    }
  };

  const uploadCV = async (base64: string, name?: string) => {
    setSaving(true);
    try {
      const response = await fetch("/api/portfolio/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ fileName: name || "Saber_CV.pdf", fileContent: base64 })
      });
      if (response.ok) {
        setProfile(prev => ({ ...prev, cvName: name, cvUrl: base64 }));
        setSaveStatus({ success: true, message: "CV uploaded successfully!" });
        refreshData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Standard item save helper
  const saveItem = async (endpoint: string, payload: any) => {
    setSaving(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setSaveStatus({ success: true, message: "Saved successfully!" });
        refreshData();
      } else {
        const isAuthError = response.status === 401 || response.status === 404;
        const msg = isAuthError 
          ? (lang === "ar" ? "انتهت صلاحية الجلسة المفتوحة! يرجى تسجيل الخروج والولوج مرة أخرى." : "Session expired. Please log out and log in again.")
          : (lang === "ar" ? "فشلت المصادقة والتحقق من حسابك." : "Failed to authenticate.");
        setSaveStatus({ success: false, message: msg });
      }
    } catch (err) {
      setSaveStatus({ success: false, message: "Network connection issue." });
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = (endpoint: string, id: string) => {
    setDeleteConf({
      titleEn: "Delete Resource",
      titleAr: "حذف العنصر",
      messageEn: "Are you sure you want to permanently delete this resource?",
      messageAr: "هل أنت متأكد من رغبتك في حذف هذا العنصر نهائياً؟",
      onConfirm: async () => {
        setSaving(true);
        try {
          const response = await fetch(`${endpoint}/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (response.ok) {
            setSaveStatus({ success: true, message: lang === "ar" ? "تم الحذف بنجاح." : "Deleted successfully." });
            refreshData();
          }
        } catch (err) {
          console.error(err);
        } finally {
          setSaving(false);
          setDeleteConf(null);
        }
      }
    });
  };

  const toggleMessageRead = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}/read`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: !m.isRead } : m));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = (id: string) => {
    setDeleteConf({
      titleEn: "Delete Recruiter Submission",
      titleAr: "حذف رسالة التوظيف",
      messageEn: "Are you sure you want to delete this recruiter submission?",
      messageAr: "هل أنت متأكد من رغبتك في حذف رسالة التوظيف هذه؟",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/messages/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (response.ok) {
            setMessages(prev => prev.filter(m => m.id !== id));
          }
        } catch (err) {
          console.error(err);
        } finally {
          setDeleteConf(null);
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 overflow-y-auto text-white flex flex-col p-4 md:p-8" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
            <Settings className="h-5 w-5 animate-spin" style={{ animationDuration: "10s" }} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-sans tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {t.adminTitle}
            </h1>
            <p className="text-xs text-slate-400">{isLoggedIn ? t.adminDashboardTitle : t.adminLoginCard}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-900 hover:bg-red-950 hover:text-red-300 text-xs text-slate-300 px-3.5 py-2 rounded-xl transition-all cursor-pointer border border-slate-800"
            >
              <LogOut className="h-3.5 w-3.5" />
              {t.adminLogout}
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer text-slate-200"
          >
            {lang === "ar" ? "العودة للموقع " : "Back to Portfolio"}
          </button>
        </div>
      </div>

      {/* Login Screen */}
      {!isLoggedIn ? (
        <div className="flex-1 flex items-center justify-center max-w-md mx-auto w-full">
          <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <Lock className="h-10 w-10 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-center font-bold text-lg mb-6">{t.adminLoginCard}</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t.adminUserLabel}</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Secure Username"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t.adminPassLabel}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              {loginError && (
                <div className="flex items-center gap-2 bg-red-950/50 border border-red-900/50 p-2.5 rounded-xl text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 py-2.5 font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/10 hover:scale-[1.02] cursor-pointer"
              >
                {t.adminLoginButton}
              </button>
            </form>
            <div className="mt-4 bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-400">🛡️ Connection Notice:</p>
              <p>This panel is reserved for authorized updates by Saber Ayman Saber. Unauthorized access is strictly forbidden. Secure IP tracing and brute-force lockouts are active.</p>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated Manager Board */
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Side Tabs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 h-fit space-y-1.5 shadow-xl">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all font-medium cursor-pointer ${
                activeTab === "profile" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              {lang === "ar" ? "الملف الشخصي والسيرة" : "Profile & CV"}
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all font-medium cursor-pointer ${
                activeTab === "projects" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              {lang === "ar" ? "المشاريع" : "Portfolio Projects"}
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all font-medium cursor-pointer ${
                activeTab === "certificates" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Award className="h-4 w-4" />
              {lang === "ar" ? "الشهادات والاعتمادات" : "Certifications"}
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all font-medium cursor-pointer ${
                activeTab === "skills" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Sliders className="h-4 w-4" />
              {lang === "ar" ? "تقييم المهارات" : "Core Skill Ratings"}
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all font-medium cursor-pointer ${
                activeTab === "services" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Layers className="h-4 w-4" />
              {lang === "ar" ? "الخدمات" : "Services List"}
            </button>
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl transition-all font-medium cursor-pointer ${
                activeTab === "inquiries" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <span>{lang === "ar" ? "رسائل العملاء" : "Client Messages"}</span>
              </div>
              {messages.filter(m => !m.isRead).length > 0 && (
                <span className="bg-red-500 font-bold px-1.5 py-0.5 rounded-full text-[10px] text-white">
                  {messages.filter(m => !m.isRead).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl transition-all font-medium cursor-pointer ${
                activeTab === "bookings" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4" />
                <span>{lang === "ar" ? "حجوزات المكالمات المقررة" : "Consultation Bookings"}</span>
              </div>
              {bookings.filter(b => b.status === "pending").length > 0 && (
                <span className="bg-rose-500 font-bold px-1.5 py-0.5 rounded-full text-[10px] text-white">
                  {bookings.filter(b => b.status === "pending").length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("credentials")}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl transition-all font-medium cursor-pointer ${
                activeTab === "credentials" ? "bg-cyan-700 text-white font-semibold" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-cyan-500" />
                <span>{lang === "ar" ? "حساب المسؤول والأمان" : "Admin Credentials & Security"}</span>
              </div>
            </button>
          </div>

          {/* Main Working Board */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            {/* Success notifications */}
            {saveStatus.message && (
              <div className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${
                saveStatus.success 
                  ? "bg-slate-950 border-emerald-900 text-emerald-300"
                  : "bg-red-950 border-red-900 text-red-300"
              }`}>
                <Check className="h-4 w-4" />
                <span>{saveStatus.message}</span>
              </div>
            )}

            {/* TAB: PROFILE & CV */}
            {activeTab === "profile" && (
              <div className="space-y-4">
                <h3 className="font-sans font-bold text-lg border-b border-slate-800 pb-2 flex gap-2 items-center">
                  <UserCheck className="h-5 w-5 text-blue-400" />
                  {t.adminEditProfile}
                </h3>
                
                {/* CV Action */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3">
                  <h4 className="text-xs text-slate-400 font-semibold uppercase tracking-wider">📄 Curriculum Vitae Doc</h4>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{profile.cvName || "No file uploaded yet"}</p>
                      <p className="text-xs text-slate-500">Formats accepted: PDF, DOC, DOCX. Persisted directly as Base64.</p>
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, (base64, file_name) => uploadCV(base64, file_name))}
                        className="hidden"
                        id="cv-file-picker"
                      />
                      <label
                        htmlFor="cv-file-picker"
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-xs px-4 py-2.5 rounded-xl text-white font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all"
                      >
                        <FileUp className="h-4 w-4" />
                        {profile.cvUrl ? "Change CV Document" : "Upload CV File"}
                      </label>
                    </div>
                  </div>
                  {profile.cvUrl && (
                    <div className="flex items-center gap-3 bg-slate-900 rounded-xl p-2.5 text-xs text-slate-300 border border-slate-800">
                      <FileText className="h-4.5 w-4.5 text-blue-400 animate-pulse" />
                      <span>{profile.cvName} successfully mounted. Live preview is fully functional.</span>
                      <a href="/api/portfolio/cv/download" target="_blank" className="text-blue-400 hover:underline inline-flex items-center gap-1 font-semibold ml-auto">
                        Test Download <Download className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Visual Avatar Manager */}
                <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 space-y-4">
                  <h4 className="font-sans font-bold text-sm text-slate-200 flex items-center gap-1.5">
                    <UserCheck className="h-4.5 w-4.5 text-blue-400" />
                    Profile Image / Avatar (صورة الواجهة الرئيسية)
                  </h4>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Image Preview Thumbnail */}
                    <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-blue-500/30 flex-shrink-0 bg-slate-950 flex items-center justify-center shadow-lg relative group">
                      {profile.avatar ? (
                        <img 
                          src={profile.avatar} 
                          className="h-full w-full object-cover" 
                          alt="Avatar preview" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <UserCheck className="h-8 w-8 text-slate-600 animate-pulse" />
                      )}
                    </div>
                    {/* Controls */}
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, (base64) => setProfile({ ...profile, avatar: base64 }))}
                          className="hidden"
                          id="avatar-file-picker"
                        />
                        <label
                          htmlFor="avatar-file-picker"
                          className="flex items-center gap-2 bg-blue-605/20 text-blue-400 hover:bg-blue-600 hover:text-white text-xs px-4 py-2 rounded-xl font-bold cursor-pointer transition-all border border-blue-500/20 shadow-sm"
                        >
                          <FileUp className="h-4 w-4" />
                          Upload Picture (تحميل صورة)
                        </label>
                        {profile.avatar && (
                          <button
                            type="button"
                            onClick={() => setProfile({ ...profile, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" })}
                            className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer"
                          >
                            Reset Default (إعادة الافتراضية)
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">Supports PNG, JPG, GIF. Or paste a direct image URL below:</p>
                      
                      <input
                        type="text"
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-xs focus:outline-none text-slate-300 font-mono placeholder:text-slate-750"
                        placeholder="Or paste any image link directly... (https://...)"
                        value={profile.avatar || ""}
                        onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm focus:outline-none"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{lang === "ar" ? "اسم الموقع الإلكتروني (بالإنجليزي)" : "Website Brand Name (English)"}</label>
                    <input
                      type="text"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm focus:outline-none"
                      placeholder="SABER.S"
                      value={profile.websiteNameEn || ""}
                      onChange={(e) => setProfile({ ...profile, websiteNameEn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{lang === "ar" ? "اسم الموقع الإلكتروني (بالعربي)" : "Website Brand Name (Arabic)"}</label>
                    <input
                      type="text"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm focus:outline-none"
                      placeholder="صابر أيمن"
                      value={profile.websiteNameAr || ""}
                      onChange={(e) => setProfile({ ...profile, websiteNameAr: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Title (EN)</label>
                    <input
                      type="text"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm"
                      value={profile.titleEn}
                      onChange={(e) => setProfile({ ...profile, titleEn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Title (AR)</label>
                    <input
                      type="text"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm"
                      value={profile.titleAr}
                      onChange={(e) => setProfile({ ...profile, titleAr: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">WhatsApp Phone URL Name</label>
                    <input
                      type="text"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm"
                      value={profile.whatsapp}
                      onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Email</label>
                    <input
                      type="text"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm"
                      value={profile.linkedin}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Years of Experience</label>
                    <input
                      type="number"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm"
                      value={profile.yearsOfExperience}
                      onChange={(e) => setProfile({ ...profile, yearsOfExperience: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Completed Projects Count</label>
                    <input
                      type="number"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm"
                      value={profile.completedProjects}
                      onChange={(e) => setProfile({ ...profile, completedProjects: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Bio (EN)</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm"
                    value={profile.bioEn}
                    onChange={(e) => setProfile({ ...profile, bioEn: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Bio (AR)</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm"
                    value={profile.bioAr}
                    onChange={(e) => setProfile({ ...profile, bioAr: e.target.value })}
                  />
                </div>

                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-500 font-sans font-bold px-6 py-2.5 rounded-xl hover:scale-105 active:scale-95 cursor-pointer text-sm w-full transition-all"
                >
                  {saving ? "Processing..." : t.adminSave}
                </button>
              </div>
            )}

            {/* TAB: PROJECTS */}
            {activeTab === "projects" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h3 className="font-sans font-bold text-lg flex gap-2 items-center">
                    <Briefcase className="h-5 w-5 text-blue-400" />
                    {t.adminManageProjects}
                  </h3>
                  <button
                    onClick={() => {
                      const newP: Project = {
                        id: String(Date.now()),
                        titleEn: "New Project Title",
                        titleAr: "عنوان مشروع جديد",
                        descEn: "Clean, elegant description.",
                        descAr: "شرح تفصيلي تقني باللغة العربية هنا.",
                        image: "/images/project1.jpg",
                        technologies: ["React", "Express", "MongoDB"],
                        liveUrl: "https://",
                        githubUrl: "https://",
                        category: "SaaS",
                        featured: false
                      };
                      setProjects([newP, ...projects]);
                    }}
                    className="flex items-center gap-1 text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    {t.adminAddNew}
                  </button>
                </div>

                <div className="space-y-6">
                  {projects.map((proj, idx) => (
                    <div key={proj.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 shadow-sm relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-400 font-bold uppercase tracking-widest bg-blue-900/20 px-2.5 py-1 rounded-full border border-blue-900/30">
                          ID: {proj.id}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const updatedFeatured = !proj.featured;
                              const updatedList = projects.map(p => p.id === proj.id ? { ...p, featured: updatedFeatured } : p);
                              setProjects(updatedList);
                              saveItem("/api/projects", { ...proj, featured: updatedFeatured });
                            }}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg border ${
                              proj.featured 
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                                : "bg-slate-900 text-slate-400 border-slate-800"
                            }`}
                          >
                            ⭐ Featured: {proj.featured ? "Yes" : "No"}
                          </button>
                          <button
                            onClick={() => deleteItem("/api/projects", proj.id)}
                            className="bg-red-900/20 text-red-400 hover:bg-red-600 hover:text-white p-1.5 rounded-lg border border-red-900/30 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Title (EN)</label>
                          <input
                            type="text"
                            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-sm text-white"
                            value={proj.titleEn}
                            onChange={(e) => {
                              const updated = projects.map(p => p.id === proj.id ? { ...p, titleEn: e.target.value } : p);
                              setProjects(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Title (AR)</label>
                          <input
                            type="text"
                            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-sm tracking-tight"
                            value={proj.titleAr}
                            onChange={(e) => {
                              const updated = projects.map(p => p.id === proj.id ? { ...p, titleAr: e.target.value } : p);
                              setProjects(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Live URL</label>
                          <input
                            type="text"
                            className="w-full rounded-md bg-slate-900 border border-slate-800 p-2 text-sm font-mono text-slate-300"
                            value={proj.liveUrl}
                            onChange={(e) => {
                              const updated = projects.map(p => p.id === proj.id ? { ...p, liveUrl: e.target.value } : p);
                              setProjects(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">GitHub Code Link</label>
                          <input
                            type="text"
                            className="w-full rounded-md bg-slate-900 border border-slate-800 p-2 text-sm font-mono text-slate-300"
                            value={proj.githubUrl}
                            onChange={(e) => {
                              const updated = projects.map(p => p.id === proj.id ? { ...p, githubUrl: e.target.value } : p);
                              setProjects(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Category Category</label>
                          <select
                            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-sm"
                            value={proj.category}
                            onChange={(e) => {
                              const updated = projects.map(p => p.id === proj.id ? { ...p, category: e.target.value as any } : p);
                              setProjects(updated);
                            }}
                          >
                            <option value="SaaS">SaaS Platform</option>
                            <option value="AI Platforms">AI Platform</option>
                            <option value="Dashboards">Analytics Dashboard</option>
                            <option value="LMS">LMS Portal</option>
                            <option value="E-commerce">E-Commerce</option>
                            <option value="Booking Systems">Booking Engine</option>
                            <option value="Company Websites">SME / Corporate Web</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Visual Mockup Thumbnail (Image File Pick)</label>
                          <div className="flex items-center gap-3">
                            {proj.image && (
                              <img src={proj.image} className="h-10 w-10 object-cover rounded-lg scale-100 border border-white/10" alt="Preview" />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id={`image-upload-proj-${proj.id}`}
                              onChange={(e) => handleFileChange(e, (base64) => {
                                const updated = projects.map(p => p.id === proj.id ? { ...p, image: base64 } : p);
                                setProjects(updated);
                              })}
                            />
                            <label
                              htmlFor={`image-upload-proj-${proj.id}`}
                              className="bg-slate-900 hover:bg-slate-800 text-xs px-3.5 py-2 rounded-xl text-slate-300 border border-slate-800 cursor-pointer text-center flex-1"
                            >
                              Pick Project Image Mockup
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Tech Stack tags (comma-separated)</label>
                          <input
                            type="text"
                            placeholder="React, Django, TypeScript"
                            className="w-full rounded-md bg-slate-900 border border-slate-800 p-2 text-sm text-slate-300"
                            value={proj.technologies.join(", ")}
                            onChange={(e) => {
                              const tags = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                              const updated = projects.map(p => p.id === proj.id ? { ...p, technologies: tags } : p);
                              setProjects(updated);
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Description (EN)</label>
                          <textarea
                            rows={3}
                            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-sm"
                            value={proj.descEn}
                            onChange={(e) => {
                              const updated = projects.map(p => p.id === proj.id ? { ...p, descEn: e.target.value } : p);
                              setProjects(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Description (AR)</label>
                          <textarea
                            rows={3}
                            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-sm tracking-tight"
                            value={proj.descAr}
                            onChange={(e) => {
                              const updated = projects.map(p => p.id === proj.id ? { ...p, descAr: e.target.value } : p);
                              setProjects(updated);
                            }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => saveItem("/api/projects", proj)}
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-500 w-full rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="h-4 w-4" /> Save this Project
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CERTIFICATES */}
            {activeTab === "certificates" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h3 className="font-sans font-bold text-lg flex gap-2 items-center">
                    <Award className="h-5 w-5 text-blue-400" />
                    {t.adminManageCertificates}
                  </h3>
                  <button
                    onClick={() => {
                      const newC: Certificate = {
                        id: String(Date.now()),
                        titleEn: "Certified ML & Deep Learning Engineer",
                        titleAr: "مهندس تعلم آلة وتعلم عميق معتمد",
                        issuerEn: "Huawei ICT Academy",
                        issuerAr: "أكاديمية هواوي للتقنية",
                        year: "2024",
                        tags: ["Deep Learning", "TensorFlow"],
                        image: "/images/cert1.jpg"
                      };
                      setCertificates([newC, ...certificates]);
                    }}
                    className="flex items-center gap-1 text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white transition-all animate-pulse"
                  >
                    <Plus className="h-4 w-4" />
                    {t.adminAddNew}
                  </button>
                </div>

                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-amber-400 font-bold bg-amber-950/20 border border-amber-900/30 px-2.5 py-1 rounded-full">{cert.year}</span>
                        <button
                          onClick={() => deleteItem("/api/certificates", cert.id)}
                          className="bg-red-900/20 text-red-400 hover:bg-red-600 hover:text-white p-1.5 border border-red-900/30 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Certificate Title (EN)</label>
                          <input
                            type="text"
                            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-sm"
                            value={cert.titleEn}
                            onChange={(e) => {
                              const updated = certificates.map(c => c.id === cert.id ? { ...c, titleEn: e.target.value } : c);
                              setCertificates(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Certificate Title (AR)</label>
                          <input
                            type="text"
                            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-sm tracking-tight"
                            value={cert.titleAr}
                            onChange={(e) => {
                              const updated = certificates.map(c => c.id === cert.id ? { ...c, titleAr: e.target.value } : c);
                              setCertificates(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Issuer (EN)</label>
                          <input
                            type="text"
                            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-sm"
                            value={cert.issuerEn}
                            onChange={(e) => {
                              const updated = certificates.map(c => c.id === cert.id ? { ...c, issuerEn: e.target.value } : c);
                              setCertificates(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Issuer (AR)</label>
                          <input
                            type="text"
                            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-sm tracking-tight"
                            value={cert.issuerAr}
                            onChange={(e) => {
                              const updated = certificates.map(c => c.id === cert.id ? { ...c, issuerAr: e.target.value } : c);
                              setCertificates(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Issuing Year</label>
                          <input
                            type="text"
                            placeholder="e.g. 2024"
                            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-sm font-mono text-slate-300"
                            value={cert.year}
                            onChange={(e) => {
                              const updated = certificates.map(c => c.id === cert.id ? { ...c, year: e.target.value } : c);
                              setCertificates(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Badge Image Upload (File Pick)</label>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`image-upload-cert-${cert.id}`}
                            onChange={(e) => handleFileChange(e, (base64) => {
                              const updated = certificates.map(c => c.id === cert.id ? { ...c, image: base64 } : c);
                              setCertificates(updated);
                            })}
                          />
                          <div className="flex items-center gap-3">
                            {cert.image && (
                              <img src={cert.image} className="h-10 w-10 object-cover rounded-lg border border-white/10" alt="Prev" />
                            )}
                            <label
                              htmlFor={`image-upload-cert-${cert.id}`}
                              className="bg-slate-900 hover:bg-slate-800 text-xs px-3 py-2 rounded-xl text-slate-300 border border-slate-800 cursor-pointer flex-1 text-center"
                            >
                              Pick Certificate Image
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Tags (comma separated)</label>
                        <input
                          type="text"
                          placeholder="Machine Learning, Deep Learning"
                          className="w-full rounded-md bg-slate-900 border border-slate-800 p-2 text-sm text-slate-300"
                          value={cert.tags.join(", ")}
                          onChange={(e) => {
                            const tags = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                            const updated = certificates.map(c => c.id === cert.id ? { ...c, tags: tags } : c);
                            setCertificates(updated);
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => saveItem("/api/certificates", cert)}
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-500 w-full rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="h-4 w-4" /> Save Certificate
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SKILLS */}
            {activeTab === "skills" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h3 className="font-sans font-bold text-lg flex gap-2 items-center">
                    <Sliders className="h-5 w-5 text-blue-400" />
                    {t.adminManageSkills}
                  </h3>
                  <button
                    onClick={() => {
                      const newS: Skill = {
                        id: String(Date.now()),
                        name: "Python",
                        level: 80,
                        category: "backend"
                      };
                      setSkills([newS, ...skills]);
                    }}
                    className="flex items-center gap-1 text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    {t.adminAddNew}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((skill) => (
                    <div key={skill.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            className="bg-transparent text-sm font-bold border-b border-transparent hover:border-slate-800 focus:border-blue-500 focus:outline-none w-2/3"
                            value={skill.name}
                            onChange={(e) => {
                              const updated = skills.map(s => s.id === skill.id ? { ...s, name: e.target.value } : s);
                              setSkills(updated);
                            }}
                          />
                          <button
                            onClick={() => deleteItem("/api/skills", skill.id)}
                            className="text-red-400 hover:text-white bg-red-900/10 border border-red-900/20 p-1 rounded-md cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            value={skill.level}
                            onChange={(e) => {
                              const updated = skills.map(s => s.id === skill.id ? { ...s, level: Number(e.target.value) } : s);
                              setSkills(updated);
                            }}
                          />
                          <span className="text-xs text-indigo-400 font-mono font-bold">{skill.level}%</span>
                        </div>

                        <select
                          className="bg-slate-900 text-xs text-slate-400 p-1 rounded border border-slate-800 w-full"
                          value={skill.category}
                          onChange={(e) => {
                            const updated = skills.map(s => s.id === skill.id ? { ...s, category: e.target.value as any } : s);
                            setSkills(updated);
                          }}
                        >
                          <option value="frontend">Frontend</option>
                          <option value="backend">Backend</option>
                          <option value="database">Database</option>
                          <option value="tools">Tools & DevOps</option>
                          <option value="ai">AI & ML Research</option>
                        </select>
                      </div>

                      <button
                        onClick={() => saveItem("/api/skills", skill)}
                        className="bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600 hover:text-white rounded-xl p-2 cursor-pointer h-fit transition-all"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SERVICES */}
            {activeTab === "services" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h3 className="font-sans font-bold text-lg flex gap-2 items-center">
                    <Layers className="h-5 w-5 text-blue-400" />
                    {t.adminManageServices}
                  </h3>
                  <button
                    onClick={() => {
                      const newS: Service = {
                        id: String(Date.now()),
                        titleEn: "Quantum Web Platform Development",
                        titleAr: "تطوير تطبيقات الويب الكمية الحديثة",
                        descEn: "Next level interactive web interfaces designed on hyper scalability.",
                        descAr: "واجهات وتطبيقات تفاعلية متطورة للغاية تعتمد على معايير الجيل القادم.",
                        iconName: "Cpu"
                      };
                      setServices([newS, ...services]);
                    }}
                    className="flex items-center gap-1 text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    {t.adminAddNew}
                  </button>
                </div>

                <div className="space-y-4">
                  {services.map((serv) => (
                    <div key={serv.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-400 font-bold font-mono">Service ID: {serv.id}</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="bg-slate-900 border border-slate-800 text-xs px-2.5 py-1 text-slate-300 rounded font-mono"
                            placeholder="Icon name: Cpu, Globe, Rocket"
                            value={serv.iconName}
                            onChange={(e) => {
                              const updated = services.map(s => s.id === serv.id ? { ...s, iconName: e.target.value } : s);
                              setServices(updated);
                            }}
                          />
                          <button
                            onClick={() => deleteItem("/api/services", serv.id)}
                            className="bg-red-950/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-900/30 p-1.5 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Title (EN)</label>
                          <input
                            type="text"
                            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-sm"
                            value={serv.titleEn}
                            onChange={(e) => {
                              const updated = services.map(s => s.id === serv.id ? { ...s, titleEn: e.target.value } : s);
                              setServices(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Title (AR)</label>
                          <input
                            type="text"
                            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-sm tracking-tight"
                            value={serv.titleAr}
                            onChange={(e) => {
                              const updated = services.map(s => s.id === serv.id ? { ...s, titleAr: e.target.value } : s);
                              setServices(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Description (EN)</label>
                          <textarea
                            rows={2}
                            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-sm"
                            value={serv.descEn}
                            onChange={(e) => {
                              const updated = services.map(s => s.id === serv.id ? { ...s, descEn: e.target.value } : s);
                              setServices(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Description (AR)</label>
                          <textarea
                            rows={2}
                            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-sm tracking-tight"
                            value={serv.descAr}
                            onChange={(e) => {
                              const updated = services.map(s => s.id === serv.id ? { ...s, descAr: e.target.value } : s);
                              setServices(updated);
                            }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => saveItem("/api/services", serv)}
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-500 w-full rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="h-4 w-4" /> Save this Service
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SUBMISSIONS / RECRUITER INQUIRIES */}
            {activeTab === "inquiries" && (
              <div className="space-y-4">
                <div className="flex border-b border-slate-800 pb-2 justify-between items-center">
                  <h3 className="font-sans font-bold text-lg flex gap-2 items-center">
                    <Mail className="h-5 w-5 text-blue-400" />
                    {t.adminInquiries}
                  </h3>
                  <button
                    onClick={fetchMessages}
                    className="p-1 px-3 text-xs flex items-center gap-1.5 hover:bg-slate-800 border border-slate-800 rounded bg-slate-950 font-semibold cursor-pointer"
                  >
                    <RefreshCcw className="h-3 w-3" /> reload
                  </button>
                </div>

                {isLoadingMessages ? (
                  <p className="text-sm text-slate-400 animate-pulse">Inquiries database loading...</p>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Eye className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-xs">No contact inquiries received yet from the public form.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          msg.isRead 
                            ? "bg-slate-950/40 border-slate-900/60 opacity-80" 
                            : "bg-gradient-to-r from-slate-900 to-slate-950 border-blue-900/50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-bold text-sm text-slate-100">{msg.name}</span>
                            <span className="text-xs text-slate-500 mx-2">|</span>
                            <a href={`mailto:${msg.email}`} className="text-xs text-blue-400 font-mono hover:underline">{msg.email}</a>
                            <p className="text-[10px] text-slate-500 mt-0.5">{new Date(msg.date).toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleMessageRead(msg.id)}
                              className={`p-1.5 rounded-lg border cursor-pointer ${
                                msg.isRead 
                                  ? "bg-slate-905 border-slate-700 text-slate-400 hover:text-slate-200" 
                                  : "bg-emerald-950/20 border-emerald-900/40 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                              }`}
                              title={msg.isRead ? "Mark as Unread" : "Mark as Read"}
                            >
                              {msg.isRead ? <Check className="h-4.5 w-4.5" /> : <CheckCheck className="h-4.5 w-4.5" />}
                            </button>
                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-900/30 p-1.5 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </div>
                        <div className="bg-slate-950/60 border border-slate-900/40 rounded-xl p-3 mt-2">
                          <p className="text-xs font-bold text-indigo-300">Subject: {msg.subject}</p>
                          <p className="text-sm text-slate-200 leading-relaxed mt-1.5 whitespace-pre-wrap font-sans">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: CALENDAR CONSULTATION MEETING BOOKINGS */}
            {activeTab === "bookings" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex border-b border-slate-800 pb-2 justify-between items-center">
                  <h3 className="font-sans font-bold text-lg flex gap-2 items-center">
                    <Calendar className="h-5 w-5 text-indigo-400" />
                    <span>{lang === "ar" ? "حجوزات المقابلات والاستشارات" : "Consultation Bookings Ledger"}</span>
                  </h3>
                  <button
                    onClick={fetchCRM}
                    className="p-1 px-3 text-xs flex items-center gap-1.5 hover:bg-slate-800 border border-slate-800 rounded bg-slate-950 font-semibold cursor-pointer"
                  >
                    <RefreshCcw className="h-3 w-3" /> reload
                  </button>
                </div>

                {isLoadingCRM ? (
                  <p className="text-sm text-slate-400 animate-pulse">Booking slot details loading...</p>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-xs">No active consultant appointments recorded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((b) => (
                      <div
                        key={b.id}
                        className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                          b.status === "confirmed" 
                            ? "bg-slate-950/40 border-slate-900/60 opacity-80" 
                            : "bg-slate-900 border-indigo-900/30"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-100">{b.name}</span>
                            <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              b.status === "confirmed" 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                                : "bg-amber-500/10 text-amber-500 border border-amber-500/30 animate-pulse"
                            }`}>
                              {b.status === "confirmed" ? "CONFIRMED" : "PENDING APPR."}
                            </span>
                          </div>
                          
                          <p className="text-xs font-mono text-blue-400 font-mono">Invite: <a href={`mailto:${b.email}`} className="hover:underline">{b.email}</a></p>
                          
                          <div className="flex items-center gap-3.5 text-slate-400 text-xs font-sans mt-2 pt-1.5 border-t border-slate-850">
                            <span className="flex items-center gap-1 text-slate-350">
                              <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                              {b.date}
                            </span>
                            <span className="flex items-center gap-1 text-slate-350 font-mono">
                              <Clock className="h-3.5 w-3.5 text-indigo-400" />
                              {b.time}
                            </span>
                          </div>

                          {b.notes && (
                            <p className="text-slate-500 text-[11px] italic mt-1.5 bg-slate-950/30 px-2 py-1 rounded">Focus: {b.notes}</p>
                          )}
                        </div>

                        <div className="flex gap-2 self-end sm:self-center">
                          {/* Toggle Confirmation */}
                          <button
                            onClick={async () => {
                              try {
                                const activeTok = token || localStorage.getItem("saber_cms_token");
                                const res = await fetch(`/api/bookings/${b.id}/confirm`, {
                                  method: "POST",
                                  headers: { "Authorization": `Bearer ${activeTok}` }
                                });
                                if (res.ok) {
                                  setBookings(prev => prev.map(item => 
                                    item.id === b.id ? { ...item, status: item.status === "confirmed" ? "pending" : "confirmed" } : item
                                  ));
                                }
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border cursor-pointer transition-all ${
                              b.status === "confirmed" 
                                ? "bg-amber-950/20 text-amber-400 border-amber-950/50 hover:bg-amber-900 hover:text-white"
                                : "bg-emerald-600 hover:bg-emerald-500 text-white border-transparent"
                            }`}
                          >
                            {b.status === "confirmed" ? "De-confirm" : "Confirm Slot"}
                          </button>

                          {/* Delete Booking */}
                          <button
                            onClick={() => {
                              setDeleteConf({
                                titleEn: "Cancel & Delete Booking",
                                titleAr: "إلغاء وحذف الحجز",
                                messageEn: "Are you sure you want to cancel and delete this booking?",
                                messageAr: "هل أنت متأكد من إلغاء وحذف حجز المكالمة هذا نهائياً؟",
                                onConfirm: async () => {
                                  try {
                                    const activeTok = token || localStorage.getItem("saber_cms_token");
                                    const res = await fetch(`/api/bookings/${b.id}`, {
                                      method: "DELETE",
                                      headers: { "Authorization": `Bearer ${activeTok}` }
                                    });
                                    if (res.ok) {
                                      setBookings(prev => prev.filter(item => String(item.id) !== String(b.id)));
                                    }
                                  } catch (e) {
                                    console.error(e);
                                  } finally {
                                    setDeleteConf(null);
                                  }
                                }
                              });
                            }}
                            className="bg-red-950/20 hover:bg-red-650 hover:text-white text-red-400 p-2 border border-red-950/50 rounded-xl cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: SECURE CREDENTIALS AND SECURITY */}
            {activeTab === "credentials" && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-sans font-bold text-lg border-b border-slate-800 pb-2 flex gap-2 items-center">
                  <Lock className="h-5 w-5 text-cyan-500 animate-pulse" />
                  <span>{lang === "ar" ? "أمان وحساب المسؤول" : "Security & Admin Credentials"}</span>
                </h3>

                <form onSubmit={saveCredentials} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200 mb-1">
                      {lang === "ar" ? "تعديل اسم المستخدم ورمز الدخول الإلكتروني" : "Modify Credentials"}
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">
                      {lang === "ar" ? "يمكنك تغيير اسم مستخدم لوحة الأدمن وكلمة المرور من هنا بأمان. تذكر كتابة بيانات الدخول الجديدة بدقة." : "Change your secure administrative dashboard login credentials. Make sure to keep the new credentials written down safely."}
                    </p>
                  </div>

                  {credStatus.message && (
                    <div className={`p-3.5 rounded-xl border text-sm flex items-center gap-2 ${
                      credStatus.isError 
                        ? "bg-red-950/30 border-red-900/40 text-red-400" 
                        : "bg-emerald-950/20 border-emerald-900/30 text-emerald-400"
                    }`}>
                      <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                      <span>{credStatus.message}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-medium">
                        {lang === "ar" ? "اسم المستخدم الجديد" : "Admin Username"}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-cyan-500 hover:border-slate-700 transition"
                        value={adminUser}
                        onChange={(e) => setAdminUser(e.target.value)}
                        placeholder="e.g. saber"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-800/60 my-4 pt-4">
                    <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-semibold">
                      {lang === "ar" ? "تحديث رمز الدخول (كلمة المرور)" : "Change Password"}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1 font-medium">
                          {lang === "ar" ? "رمز الدخول الجديد" : "New Password"}
                        </label>
                        <input
                          type="password"
                          className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-cyan-500 hover:border-slate-700 transition"
                          value={adminPass}
                          onChange={(e) => setAdminPass(e.target.value)}
                          placeholder={lang === "ar" ? "اكتب كلمة مرور قوية (أو اتركها فارغة لعدم التغيير)" : "Leave blank to keep current password"}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1 font-medium">
                          {lang === "ar" ? "تأكيد رمز الدخول الجديد" : "Confirm New Password"}
                        </label>
                        <input
                          type="password"
                          className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-cyan-500 hover:border-slate-700 transition"
                          value={adminPassConfirm}
                          onChange={(e) => setAdminPassConfirm(e.target.value)}
                          placeholder={lang === "ar" ? "تأكيد كلمة المرور" : "Retype new password"}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs px-6 py-3 rounded-xl text-white font-bold cursor-pointer hover:scale-[1.03] active:scale-95 transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Lock className="h-4 w-4" />
                      {saving ? (lang === "ar" ? "جاري معالجة الكود..." : "Updating...") : (lang === "ar" ? "حفظ وتعديل بيانات الدخول 🔐" : "Save Credentials 🔐")}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Interactive Delete Confirmation Modal */}
      {deleteConf && (
        <div id="custom-delete-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-950/30 flex items-center justify-center text-red-500 mb-2">
              <Trash2 className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === "ar" ? deleteConf.titleAr : deleteConf.titleEn}
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {lang === "ar" ? deleteConf.messageAr : deleteConf.messageEn}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConf(null)}
                className="px-4 py-2 border border-slate-700 hover:border-slate-600 rounded-xl text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                {lang === "ar" ? "إلغاء الأمر" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteConf.onConfirm();
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-bold text-white shadow-lg transition cursor-pointer"
              >
                {lang === "ar" ? "نعم، متأكد من الحذف" : "Yes, Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
