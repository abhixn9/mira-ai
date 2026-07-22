export interface PersonalInfo {
  name: string;
  photo?: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  address?: string;
  jobTitle: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  duration: string;
  location?: string;
  responsibilities: string[];
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  university: string;
  duration: string;
  cgpa?: string;
  location?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  year: string;
}

export interface ResumeStyle {
  templateId: 'modern' | 'executive' | 'corporate' | 'minimal' | 'creative' | 'elegant' | 'ats-friendly' | 'dark' | 'professional' | 'luxury' | 'academic' | 'two-column' | 'btech-fresher';
  primaryColor: string;
  fontFamily: 'sans' | 'serif' | 'mono' | 'inter' | 'roboto' | 'open-sans' | 'lato' | 'montserrat' | 'playfair' | 'merriweather' | 'lora' | 'pt-serif' | 'source-serif' | 'fira-code' | 'source-code' | 'jetbrains' | 'outfit' | 'arvo' | 'oswald' | 'raleway' | 'nunito' | 'garamond' | 'cinzel' | 'cardo' | 'cabin' | 'inconsolata';
  fontSize: 'sm' | 'md' | 'lg';
  lineSpacing: 'sm' | 'md' | 'lg';
  pageMargin: 'sm' | 'md' | 'lg';
}

export interface ResumeData {
  id: string;
  title: string;
  updatedAt: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  certifications: Certification[];
  projects: Project[];
  awards: Award[];
  style: ResumeStyle;
}

export interface CoverLetterData {
  id: string;
  title: string;
  updatedAt?: string;
  date: string;
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  subject: string;
  body: string;
  style: {
    fontFamily: 'sans' | 'serif' | 'mono';
    fontSize: 'sm' | 'md' | 'lg';
  };
}
