"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ResumeData, CoverLetterData } from '@/types/resume';

interface ResumeContextType {
  resumes: ResumeData[];
  activeResumeId: string | null;
  activeResume: ResumeData | null;
  coverLetters: CoverLetterData[];
  activeCoverLetterId: string | null;
  activeCoverLetter: CoverLetterData | null;
  subscription: 'free' | 'pro';
  setSubscription: (tier: 'free' | 'pro') => void;
  credits: number;
  deductCredit: () => boolean;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  themeColor: 'purple' | 'blue' | 'emerald';
  setThemeColor: (color: 'purple' | 'blue' | 'emerald') => void;
  createResume: (title?: string) => string;
  updateResume: (updates: Partial<ResumeData>) => void;
  deleteResume: (id: string) => void;
  duplicateResume: (id: string) => void;
  selectResume: (id: string) => void;
  importResume: (data: ResumeData) => void;
  createCoverLetter: (title?: string) => string;
  updateCoverLetter: (updates: Partial<CoverLetterData>) => void;
  deleteCoverLetter: (id: string) => void;
  selectCoverLetter: (id: string) => void;
  builderStep: number;
  setBuilderStep: React.Dispatch<React.SetStateAction<number>>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const DEFAULT_RESUME: ResumeData = {
  id: 'sample-resume-id',
  title: 'Senior Software Engineer Resume',
  updatedAt: new Date().toISOString(),
  personalInfo: {
    name: 'Alexander Sterling',
    jobTitle: 'Senior Software Engineer / Tech Lead',
    email: 'alexander@vercel.com',
    phone: '(555) 019-2834',
    linkedin: 'linkedin.com/in/alexandersterling',
    github: 'github.com/alexandersterling',
    portfolio: 'alexandersterling.dev',
    address: 'San Francisco, CA'
  },
  summary: 'Results-oriented Senior Software Engineer with 6+ years of experience architecting web applications, designing developer tools, and optimizing cloud serverless infrastructure at Vercel & Stripe.',
  experience: [
    {
      id: 'exp-1',
      title: 'Lead Software Engineer',
      company: 'Vercel',
      location: 'San Francisco, CA',
      startDate: '2023-01',
      endDate: 'Present',
      current: true,
      description: '• Architected serverless deployments on Vercel platforms, reducing cold starts by 42%.\n• Spearheaded micro-frontend migration across 14 core enterprise client apps.'
    },
    {
      id: 'exp-2',
      title: 'Senior Frontend Engineer',
      company: 'Stripe',
      location: 'San Francisco, CA',
      startDate: '2020-06',
      endDate: '2022-12',
      current: false,
      description: '• Shipped merchant dashboards utilizing React, GraphQL, and micro-frontend structures.\n• Improved Core Web Vitals performance scores from 72 to 98 across core payment flows.'
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science & Engineering',
      institution: 'UC Berkeley',
      location: 'Berkeley, CA',
      startDate: '2016-08',
      endDate: '2020-05',
      gpa: '3.9'
    }
  ],
  skills: {
    technical: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'GraphQL', 'AWS', 'System Design'],
    soft: ['Technical Leadership', 'Cross-functional Collaboration', 'System Architecture', 'Code Review'],
    languages: ['English (Native)', 'Spanish (Professional)']
  },
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2024-03'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Aether Engine',
      link: 'github.com/alexandersterling/aether-engine',
      description: 'High-performance WebGL & Canvas rendering library for real-time data visualizers.'
    }
  ],
  awards: [],
  style: {
    templateId: 'modern',
    primaryColor: '#3b82f6',
    fontFamily: 'sans',
    fontSize: 'md',
    lineSpacing: 'md',
    pageMargin: 'md'
  }
};

const DEFAULT_COVER_LETTER: CoverLetterData = {
  id: 'sample-cl-id',
  title: 'Cover Letter - Aether Technologies',
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  recipientName: 'Hiring Committee',
  recipientTitle: 'Principal Recruiting Coordinator',
  companyName: 'Apex Creative Solutions',
  companyAddress: '500 Fifth Avenue, Suite 1200\nNew York, NY 10110',
  subject: 'Application for Senior Full Stack Architect Position',
  body: `Dear Hiring Committee,\n\nI am writing to express my enthusiastic interest in the Senior Full Stack Architect position at Apex Creative Solutions. With over eight years of experience engineering high-performance web applications and leading technical teams, I am confident in my ability to make an immediate, positive impact on your product line and engineering culture.\n\nThroughout my career, I have focused on bridging the gap between sophisticated aesthetics and rock-solid software architecture. In my current role as Principal Engineer at Aether Technologies, I spearheaded the deployment of our micro-frontend architecture which improved Core Web Vitals across the platform by 35% and supported 2 million active weekly users. This success was achieved by leveraging modern Next.js patterns, robust state systems, and clean animations that greatly improved the visual response times.\n\nI am particularly drawn to Apex Creative Solutions because of your commitment to visually stunning, design-driven user experiences. I believe my specialization in React, Framer Motion, Node.js, and serverless architectures aligns perfectly with your goals to launch the new luxury design editor this year.\n\nThank you for your time and consideration. I welcome the opportunity to discuss how my technical skills, system design experience, and leadership style can help Apex Creative Solutions achieve its upcoming milestones.\n\nSincerely,\n\nAlexander Sterling`,
  style: {
    fontFamily: 'sans',
    fontSize: 'md'
  }
};

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [resumes, setResumes] = useState<ResumeData[]>([DEFAULT_RESUME]);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(DEFAULT_RESUME.id);
  const [coverLetters, setCoverLetters] = useState<CoverLetterData[]>([DEFAULT_COVER_LETTER]);
  const [activeCoverLetterId, setActiveCoverLetterId] = useState<string | null>(DEFAULT_COVER_LETTER.id);
  const [subscription, setSubscription] = useState<'free' | 'pro'>('free');
  const [credits, setCredits] = useState<number>(20);
  const [userName, setUserNameState] = useState('');
  const [userEmail, setUserEmailState] = useState('');
  const [themeColor, setThemeColor] = useState<'purple' | 'blue' | 'emerald'>('purple');
  const [isLoaded, setIsLoaded] = useState(false);
  const [builderStep, setBuilderStep] = useState<number>(1);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedResumes = localStorage.getItem('luxury-resumes');
      const storedActiveResumeId = localStorage.getItem('luxury-active-resume-id');
      const storedCoverLetters = localStorage.getItem('luxury-cover-letters');
      const storedActiveCoverLetterId = localStorage.getItem('luxury-active-cl-id');
      const storedSubscription = localStorage.getItem('luxury-subscription');
      const storedName = localStorage.getItem('mira-user-name');
      const storedEmail = localStorage.getItem('mira-user-email');
      const storedTheme = localStorage.getItem('mira-theme-color');
      const storedCredits = localStorage.getItem('mira-download-credits');

      if (storedCredits !== null) {
        setCredits(parseInt(storedCredits, 10));
      } else {
        setCredits(20);
      }

      if (storedResumes) {
        try {
          const parsed = JSON.parse(storedResumes);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setResumes(parsed);
          } else {
            setResumes([DEFAULT_RESUME]);
          }
        } catch (err) {
          console.error(err);
          setResumes([DEFAULT_RESUME]);
        }
      } else {
        setResumes([DEFAULT_RESUME]);
      }

      if (storedActiveResumeId) {
        setActiveResumeId(storedActiveResumeId);
      } else {
        setActiveResumeId(DEFAULT_RESUME.id);
      }

      if (storedCoverLetters) {
        setCoverLetters(JSON.parse(storedCoverLetters));
      } else {
        setCoverLetters([DEFAULT_COVER_LETTER]);
      }

      if (storedActiveCoverLetterId) {
        setActiveCoverLetterId(storedActiveCoverLetterId);
      } else {
        setActiveCoverLetterId(DEFAULT_COVER_LETTER.id);
      }

      if (storedSubscription) {
        setSubscription(storedSubscription as 'free' | 'pro');
      }

      if (storedName) setUserNameState(storedName);
      if (storedEmail) setUserEmailState(storedEmail);
      if (storedTheme) setThemeColor(storedTheme as 'purple' | 'blue' | 'emerald');
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
      setResumes([DEFAULT_RESUME]);
      setActiveResumeId(DEFAULT_RESUME.id);
      setCoverLetters([DEFAULT_COVER_LETTER]);
      setActiveCoverLetterId(DEFAULT_COVER_LETTER.id);
    }
    setIsLoaded(true);
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('luxury-resumes', JSON.stringify(resumes));
  }, [resumes, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (activeResumeId) {
      localStorage.setItem('luxury-active-resume-id', activeResumeId);
    } else {
      localStorage.removeItem('luxury-active-resume-id');
    }
  }, [activeResumeId, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('luxury-cover-letters', JSON.stringify(coverLetters));
  }, [coverLetters, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (activeCoverLetterId) {
      localStorage.setItem('luxury-active-cl-id', activeCoverLetterId);
    } else {
      localStorage.removeItem('luxury-active-cl-id');
    }
  }, [activeCoverLetterId, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('luxury-subscription', subscription);
  }, [subscription, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('mira-download-credits', credits.toString());
  }, [credits, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('mira-user-name', userName);
  }, [userName, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('mira-user-email', userEmail);
  }, [userEmail, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('mira-theme-color', themeColor);
  }, [themeColor, isLoaded]);

  const setUserName = (name: string) => {
    setUserNameState(name);
    if (activeResumeId) {
      setResumes(prev =>
        prev.map(r =>
          r.id === activeResumeId
            ? {
                ...r,
                personalInfo: { ...r.personalInfo, name },
                updatedAt: new Date().toISOString()
              }
            : r
        )
      );
    }
  };

  const setUserEmail = (email: string) => {
    setUserEmailState(email);
    if (activeResumeId) {
      setResumes(prev =>
        prev.map(r =>
          r.id === activeResumeId
            ? {
                ...r,
                personalInfo: { ...r.personalInfo, email },
                updatedAt: new Date().toISOString()
              }
            : r
        )
      );
    }
  };

  const activeResume = resumes.find(r => r.id === activeResumeId) || null;
  const activeCoverLetter = coverLetters.find(cl => cl.id === activeCoverLetterId) || null;

  // Actions
  const createResume = (title = 'Untitled Resume') => {
    const newId = `resume-${Date.now()}`;
    const newResume: ResumeData = {
      ...DEFAULT_RESUME,
      id: newId,
      title,
      updatedAt: new Date().toISOString(),
      personalInfo: {
        name: '',
        jobTitle: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        portfolio: '',
        address: ''
      },
      summary: '',
      experience: [],
      education: [],
      skills: { technical: [], soft: [], languages: [] },
      certifications: [],
      projects: [],
      awards: [],
      style: {
        templateId: 'minimal',
        primaryColor: '#000000',
        fontFamily: 'sans',
        fontSize: 'md',
        lineSpacing: 'md',
        pageMargin: 'md'
      }
    };
    setResumes(prev => [newResume, ...prev]);
    setActiveResumeId(newId);
    return newId;
  };

  const updateResume = (updates: Partial<ResumeData>) => {
    if (!activeResumeId) return;
    setResumes(prev =>
      prev.map(r =>
        r.id === activeResumeId
          ? { ...r, ...updates, updatedAt: new Date().toISOString() }
          : r
      )
    );
  };

  const deleteResume = (id: string) => {
    setResumes(prev => {
      const filtered = prev.filter(r => r.id !== id);
      if (activeResumeId === id) {
        setActiveResumeId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const duplicateResume = (id: string) => {
    const toDuplicate = resumes.find(r => r.id === id);
    if (!toDuplicate) return;
    const newId = `resume-${Date.now()}`;
    const duplicated: ResumeData = {
      ...toDuplicate,
      id: newId,
      title: `${toDuplicate.title} (Copy)`,
      updatedAt: new Date().toISOString()
    };
    setResumes(prev => [duplicated, ...prev]);
    setActiveResumeId(newId);
  };

  const selectResume = (id: string) => {
    if (resumes.some(r => r.id === id)) {
      setActiveResumeId(id);
    }
  };

  const importResume = (data: ResumeData) => {
    // Generate new unique ID
    const newId = `resume-${Date.now()}`;
    const imported: ResumeData = {
      ...data,
      id: newId,
      updatedAt: new Date().toISOString()
    };
    setResumes(prev => [imported, ...prev]);
    setActiveResumeId(newId);
  };

  const createCoverLetter = (title = 'Untitled Cover Letter') => {
    const newId = `cl-${Date.now()}`;
    const newLetter: CoverLetterData = {
      id: newId,
      title,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      recipientName: '',
      recipientTitle: '',
      companyName: '',
      companyAddress: '',
      subject: '',
      body: '',
      style: {
        fontFamily: 'sans',
        fontSize: 'md'
      }
    };
    setCoverLetters(prev => [newLetter, ...prev]);
    setActiveCoverLetterId(newId);
    return newId;
  };

  const updateCoverLetter = (updates: Partial<CoverLetterData>) => {
    if (!activeCoverLetterId) return;
    setCoverLetters(prev =>
      prev.map(cl =>
        cl.id === activeCoverLetterId
          ? { ...cl, ...updates }
          : cl
      )
    );
  };

  const deleteCoverLetter = (id: string) => {
    setCoverLetters(prev => {
      const filtered = prev.filter(cl => cl.id !== id);
      if (activeCoverLetterId === id) {
        setActiveCoverLetterId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const selectCoverLetter = (id: string) => {
    if (coverLetters.some(cl => cl.id === id)) {
      setActiveCoverLetterId(id);
    }
  };

  const deductCredit = () => {
    if (subscription === 'pro') return true;
    if (credits <= 0) return false;
    setCredits(prev => {
      const next = prev - 1;
      localStorage.setItem('mira-download-credits', next.toString());
      return next;
    });
    return true;
  };

  return (
    <ResumeContext.Provider value={{
      resumes,
      activeResumeId,
      activeResume,
      coverLetters,
      activeCoverLetterId,
      activeCoverLetter,
      subscription,
      setSubscription,
      credits,
      deductCredit,
      setCredits,
      userName,
      setUserName,
      userEmail,
      setUserEmail,
      themeColor,
      setThemeColor,
      createResume,
      updateResume,
      deleteResume,
      duplicateResume,
      selectResume,
      importResume,
      createCoverLetter,
      updateCoverLetter,
      deleteCoverLetter,
      selectCoverLetter,
      builderStep,
      setBuilderStep
    }}>
      {isLoaded && children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
