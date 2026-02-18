export type ThemeMode = 'light' | 'dark';
export type FontFamily = 'sans' | 'serif' | 'mono';

export interface ResumeData {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills: string[];
  experience: string[];
  projects: string[];
  education: string[];
  certifications: string[];
  rawText: string;
}

export interface PortfolioRecord {
  subdomain: string;
  createdAt: string;
  themeMode: ThemeMode;
  fontFamily: FontFamily;
  data: ResumeData;
}
