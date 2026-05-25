export interface Profile {
  name: string;
  phone: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  educationEn: string;
  educationAr: string;
  bioEn: string;
  bioAr: string;
  titleEn: string;
  titleAr: string;
  yearsOfExperience: number;
  completedProjects: number;
  happyClients: number;
  cvUrl?: string;
  cvName?: string;
  avatar?: string;
  websiteNameEn?: string;
  websiteNameAr?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  category: "frontend" | "backend" | "database" | "tools" | "ai";
}

export interface Service {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  iconName: string;
}

export interface Project {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  image: string; // Base64 or local upload URL
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  category: "SaaS" | "AI Platforms" | "Dashboards" | "LMS" | "E-commerce" | "Booking Systems" | "Company Websites";
  featured: boolean;
}

export interface Certificate {
  id: string;
  titleEn: string;
  titleAr: string;
  issuerEn: string;
  issuerAr: string;
  year: string;
  tags: string[];
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  roleEn: string;
  roleAr: string;
  company: string;
  textEn: string;
  textAr: string;
  rating: number;
  avatar: string;
}

export interface BlogPost {
  id: string;
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
  date: string;
  readTime: string;
  published: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}
