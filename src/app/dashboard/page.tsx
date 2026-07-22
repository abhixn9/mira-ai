"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Linkedin } from '@/components/icons/BrandIcons';
import { 
  FileText, 
  Sparkles, 
  Compass,
  Briefcase, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Copy, 
  FileCheck,
  Layers,
  Search,
  SlidersHorizontal,
  MapPin,
  Edit3,
  Menu,
  X,
  Zap,
  Activity,
  Eye,
  Calendar,
  Lock,
  Download,
  ExternalLink,
  Info,
  ChevronDown,
  ArrowUpDown,
  Globe,
  Share2,
  AlertCircle,
  HelpCircle,
  FileSpreadsheet,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  Users,
  DollarSign,
  Cpu,
  Trophy,
  ArrowRight,
  BookOpen,
  Map,
  AlertTriangle,
  Play,
  Volume2,
  MessageSquare
} from 'lucide-react';
import { useResume } from '@/context/ResumeContext';
import { useToast } from '@/context/ToastContext';
import { GlassCard } from '@/components/ui/GlassCard';

const COMPANY_RESEARCH_DATA: Record<string, {
  overview: string;
  products: string[];
  news: string[];
  funding: string;
  techStack: string[];
  interview: string[];
  culture: string;
  glassdoor: string;
  questions: string[];
  trends: string;
}> = {
  'Vercel': {
    overview: 'Vercel provides developer tools and cloud hosting to build fast web applications.',
    products: ['Vercel Platform', 'Next.js Framework', 'Turborepo', 'v0.dev'],
    news: ['Next.js 15 announced with advanced server actions compiler.', 'Vercel acquires Turborepo to scale monorepos.'],
    funding: '$313M Series D at a $2.5B valuation',
    techStack: ['React', 'Next.js', 'Rust', 'TypeScript', 'Node.js', 'AWS EKS'],
    interview: ['1. Recruiter Screen', '2. Coding & Technical Deep-Dive', '3. System Design Challenge', '4. Manager & Culture Fit'],
    culture: 'Open-source first, obsessed with user experience, remote-first, high autonomy.',
    glassdoor: '4.7/5 stars. High recommendation rate. Appreciated for flexible culture.',
    questions: ['How do you manage edge middleware performance budgets?', 'What is the roadmap for React Server Components tooling support?'],
    trends: 'Increasing hiring in platform scaling and developer relations roles.'
  },
  'Stripe': {
    overview: 'Stripe builds developer-centric payment APIs and financial infrastructure.',
    products: ['Stripe Payments', 'Stripe Billing', 'Stripe Connect', 'Stripe Radar'],
    news: ['Stripe surpasses $1T in payment volume.', 'Stripe launches tax compliance automation API.'],
    funding: '$8.7B total funding, profitable with strong cash reserves',
    techStack: ['Ruby', 'Scala', 'React', 'TypeScript', 'MongoDB', 'AWS'],
    interview: ['1. Technical Screen', '2. Bug Squash Challenge', '3. API Design Interview', '4. Core Values & Leadership'],
    culture: 'Writing-oriented, rigorous engineering standards, long-term planning focused.',
    glassdoor: '4.4/5 stars. Praised for smart peers and compensation plans.',
    questions: ['How does the team balance microservice scaling with api backward compatibility?', 'What is the approach to database sharding for ledger databases?'],
    trends: 'Strong demand for backend systems and developer experience SDEs.'
  },
  'Linear': {
    overview: 'Linear makes tools for project management, issue tracking, and software design.',
    products: ['Linear Issue Tracker', 'Linear Cycles', 'Linear Roadmaps'],
    news: ['Linear launches customer support integrations.', 'Linear raises Series A from top tech leaders.'],
    funding: '$16M Series A led by Sequoia',
    techStack: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'PostgreSQL', 'WebSockets'],
    interview: ['1. Intro Chat', '2. Technical Take-home spec design', '3. Review Interview', '4. Founder Screen'],
    culture: 'High focus on visual detail, minimal meetings, remote-first, asynchronous-first.',
    glassdoor: '4.9/5 stars. Extremely high satisfaction. Great focus on detail.',
    questions: ['How does your WebSocket syncing architecture scale with concurrent cycles?', 'What styling patterns do you recommend for custom canvas rendering?'],
    trends: 'Hiring product-focused frontend engineers with design sensibilities.'
  }
};

interface TrackedJob {
  id: string;
  company: string;
  title: string;
  location: string;
  date: string;
  status: 'wishlist' | 'applied' | 'hr-round' | 'technical' | 'assessment' | 'manager-round' | 'offer' | 'accepted' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  notes: string;
  followUpDate: string;
}

const INITIAL_TRACKED_JOBS: TrackedJob[] = [
  {
    id: 'job-1',
    company: 'Vercel',
    title: 'Senior Frontend Engineer',
    location: 'Remote, US',
    date: '2026-07-10',
    status: 'technical',
    priority: 'high',
    notes: 'Prepare system design slides and review Next.js App Router performance metrics.',
    followUpDate: '2026-07-15'
  },
  {
    id: 'job-2',
    company: 'Stripe',
    title: 'Software Engineer, Developer Experience',
    location: 'San Francisco, CA',
    date: '2026-07-08',
    status: 'applied',
    priority: 'high',
    notes: 'Recruiter screen completed. Waiting for coordinator setup for technical round.',
    followUpDate: '2026-07-14'
  },
  {
    id: 'job-3',
    company: 'Linear',
    title: 'Product Engineer',
    location: 'Remote, EU/US',
    date: '2026-07-12',
    status: 'wishlist',
    priority: 'medium',
    notes: 'Clean UX and beautiful typography focus. Requires custom cover letter.',
    followUpDate: '2026-07-20'
  },
  {
    id: 'job-4',
    company: 'Figma',
    title: 'Design Systems Engineer',
    location: 'New York, NY',
    date: '2026-07-05',
    status: 'assessment',
    priority: 'high',
    notes: 'Take-home assignment sent. Build responsive component library UI using React.',
    followUpDate: '2026-07-11'
  },
  {
    id: 'job-5',
    company: 'Google',
    title: 'Developer Advocate',
    location: 'London, UK',
    date: '2026-06-28',
    status: 'offer',
    priority: 'high',
    notes: 'Negotiating compensation package and remote setup arrangements.',
    followUpDate: '2026-07-18'
  }
];

const TEMPLATE_GALLERY = [
  {
    id: 'luxury',
    name: 'Aurelia Sterling',
    category: 'Executive',
    badge: 'ATS Optimal',
    glow: 'from-purple-900/20 to-indigo-900/20',
    desc: 'Ultra-premium typography designed for engineering leadership and executives.'
  },
  {
    id: 'modern',
    name: 'Silicon Valley SDE',
    category: 'Engineering',
    badge: '100% Parsing',
    glow: 'from-blue-900/20 to-cyan-900/20',
    desc: 'Optimized specifically for high-growth tech companies and resume scanners.'
  },
  {
    id: 'creative',
    name: 'Framer Creator',
    category: 'Creative',
    badge: 'Modernist',
    glow: 'from-pink-900/20 to-rose-900/20',
    desc: 'Visually striking style focusing on projects, media, and design credentials.'
  }
];

function getDashboardThemeStyles(theme: 'purple' | 'blue' | 'emerald') {
  if (theme === 'blue') {
    return {
      text: 'text-blue-400',
      text450: 'text-blue-400',
      textHover: 'hover:text-blue-450',
      border: 'border-blue-900/30',
      border500: 'border-blue-900/50',
      borderFocus: 'focus:border-blue-800',
      bgLight: 'bg-blue-950/10',
      bgHover: 'hover:bg-blue-950/20',
      accentBg: 'bg-blue-600',
      accentBgHover: 'hover:bg-blue-500',
      glow: 'shadow-blue-500/5',
      glowLg: 'shadow-blue-500/20',
      fromTo: 'from-blue-600 to-indigo-700',
      radialGlow: 'from-blue-900/20 to-indigo-900/20',
      progressFill: 'bg-blue-500',
      circleProgress: 'text-blue-500',
      badgeText: 'text-blue-400 bg-blue-950/30 border-blue-900/50',
      ring: 'ring-blue-500/20',
      bg950: 'bg-blue-950',
      border800: 'border-blue-800',
      text300: 'text-blue-300',
      bgGradient: 'from-blue-600 to-indigo-500 shadow-[0_0_12px_rgba(37,99,235,0.3)]',
      gradientBar: 'from-blue-500 to-indigo-600',
      glowBlur: 'bg-blue-500/10'
    };
  }
  if (theme === 'emerald') {
    return {
      text: 'text-emerald-400',
      text450: 'text-emerald-400',
      textHover: 'hover:text-emerald-455',
      border: 'border-emerald-900/30',
      border500: 'border-emerald-900/50',
      borderFocus: 'focus:border-emerald-800',
      bgLight: 'bg-emerald-950/10',
      bgHover: 'hover:bg-emerald-950/20',
      accentBg: 'bg-emerald-600',
      accentBgHover: 'hover:bg-emerald-500',
      glow: 'shadow-emerald-500/5',
      glowLg: 'shadow-emerald-500/20',
      fromTo: 'from-emerald-600 to-teal-700',
      radialGlow: 'from-emerald-900/20 to-teal-900/20',
      progressFill: 'bg-emerald-500',
      circleProgress: 'text-emerald-500',
      badgeText: 'text-emerald-400 bg-emerald-950/30 border-emerald-900/50',
      ring: 'ring-emerald-500/20',
      bg950: 'bg-emerald-950',
      border800: 'border-emerald-800',
      text300: 'text-emerald-300',
      bgGradient: 'from-emerald-600 to-teal-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
      gradientBar: 'from-emerald-500 to-teal-600',
      glowBlur: 'bg-emerald-500/10'
    };
  }
  return {
    text: 'text-purple-400',
    text450: 'text-purple-450',
    textHover: 'hover:text-purple-450',
    border: 'border-purple-900/30',
    border500: 'border-purple-900/50',
    borderFocus: 'focus:border-purple-800',
    bgLight: 'bg-purple-950/10',
    bgHover: 'hover:bg-purple-950/20',
    accentBg: 'bg-purple-650',
    accentBgHover: 'hover:bg-purple-500',
    glow: 'shadow-purple-500/5',
    glowLg: 'shadow-purple-500/20',
    fromTo: 'from-purple-600 to-indigo-700',
    radialGlow: 'from-purple-900/20 to-indigo-900/20',
    progressFill: 'bg-purple-500',
    circleProgress: 'text-purple-500',
    badgeText: 'text-purple-400 bg-purple-950/30 border-purple-900/50',
    ring: 'ring-purple-500/20',
    bg950: 'bg-purple-950',
    border800: 'border-purple-800',
    text300: 'text-purple-300',
    bgGradient: 'from-purple-600 to-indigo-500 shadow-[0_0_12px_rgba(139,92,246,0.3)]',
    gradientBar: 'from-purple-500 to-indigo-600',
    glowBlur: 'bg-purple-500/10'
  };
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramTab = searchParams ? searchParams.get('tab') : null;
  const { toast } = useToast();
  const { 
    resumes, 
    coverLetters, 
    createResume, 
    createCoverLetter, 
    deleteResume, 
    deleteCoverLetter, 
    duplicateResume, 
    selectResume,
    selectCoverLetter,
    subscription,
    setSubscription,
    credits,
    setCredits,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    themeColor,
    setThemeColor
  } = useResume();

  const colors = getDashboardThemeStyles(themeColor);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('mira-user-name');
      const email = localStorage.getItem('mira-user-email');
      if (!name && !email && !userName && !userEmail) {
        router.push('/auth/login');
      }
    }
  }, [router, userName, userEmail]);

  // Navigation states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'resumes' | 'letters' | 'tailor' | 'health' | 'recruiter' | 'tracker' | 'matching' | 'gap' | 'roadmap' | 'portfolio' | 'interview' | 'linkedin' | 'settings'>((paramTab as any) || 'dashboard');

  useEffect(() => {
    if (paramTab) {
      setActiveTab(paramTab as any);
    }
  }, [paramTab]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global Smart Search
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['Google Resume', 'Next.js Architect', 'Stripe Developer']);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: '1', text: 'Interview tomorrow at Vercel (10:00 AM)', read: false, type: 'interview' },
    { id: '2', text: 'Your resume ATS score was optimized by +12%!', read: false, type: 'ats' },
    { id: '3', text: 'New software matches found at Stripe', read: false, type: 'job' },
    { id: '4', text: 'Credits warning: 20 credits remaining', read: false, type: 'credits' }
  ]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Resume Auto-Tailoring Modal State
  const [autoTailorModalOpen, setAutoTailorModalOpen] = useState(false);
  const [tailorJobDesc, setTailorJobDesc] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailoringSuccess, setTailoringSuccess] = useState(false);
  const [tailorResult, setTailorResult] = useState<{
    beforeScore: number;
    afterScore: number;
    keywords: string[];
    rewrites: string;
  } | null>(null);

  // AI LinkedIn Profile Optimizer State
  const [linkedinOptimized, setLinkedinOptimized] = useState<{
    headline: string;
    about: string;
    skills: string;
  } | null>(null);
  const [isOptimizingLinkedin, setIsOptimizingLinkedin] = useState(false);

  // AI Skill Gap Analysis State
  const [gapResults, setGapResults] = useState<{
    matched: string[];
    missing: string[];
    recommendedSkills: string[];
    certifications: { title: string; provider: string; }[];
    courses: string[];
    estimatedLearningTime: string;
    salaryIncrease: string;
  } | null>(null);
  const [isGapAnalyzing, setIsGapAnalyzing] = useState(false);

  // Career Copilot simulated Voice Coach State
  const [voiceSessionActive, setVoiceSessionActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string[]>([
    "Copilot: Hello! Ready for our mock interview or career planning checkup?",
    "User: Let's review my readiness for Staff Frontend roles."
  ]);
  const [voiceInputText, setVoiceInputText] = useState('');
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  // Interview Prep state
  const [selectedPrepCategory, setSelectedPrepCategory] = useState<'hr' | 'technical' | 'behavioral' | 'coding' | 'leadership'>('hr');
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [mockUserAnswers, setMockUserAnswers] = useState<Record<string, string>>({});
  const [mockFeedbackScore, setMockFeedbackScore] = useState<number | null>(null);

  // Portfolio generator state
  const [selectedPortfolioStyle, setSelectedPortfolioStyle] = useState<'minimal' | 'modern' | 'creative' | 'developer' | 'executive' | 'designer' | 'startup' | 'professional'>('professional');
  const [isPublishingPortfolio, setIsPublishingPortfolio] = useState(false);
  const [portfolioPublishedUrl, setPortfolioPublishedUrl] = useState<string | null>(null);
  const [portfolioProjects, setPortfolioProjects] = useState<string[]>(['MIRA AI Engine', 'E-Commerce Orchestrator']);
  const [portfolioSeoTitle, setPortfolioSeoTitle] = useState('Alexander Sterling | Senior Full Stack Architect');
  const [portfolioSeoDesc, setPortfolioSeoDesc] = useState('Staff Engineer with 5+ years of experience leading UI performance optimizations.');
  const [portfolioAnalyticsId, setPortfolioAnalyticsId] = useState('G-MIRA123456');
  const [portfolioPreviewOpen, setPortfolioPreviewOpen] = useState(false);

  // Settings sub-navigation
  const [settingsSubTab, setSettingsSubTab] = useState<'profile' | 'security' | 'subscription' | 'ai' | 'export' | 'notifications'>('profile');

  // Search & Filter States
  const [resumeSearch, setResumeSearch] = useState('');
  const [resumeSort, setResumeSort] = useState<'updated' | 'title' | 'ats'>('updated');
  const [resumeFilterTemplate, setResumeFilterTemplate] = useState('all');
  
  const [letterSearch, setLetterSearch] = useState('');

  // AI Resume Tailoring State
  const [tailorStep, setTailorStep] = useState<'input' | 'matching' | 'review'>('input');
  const [tailorLoading, setTailorLoading] = useState(false);
  const [tailorAtsAfter, setTailorAtsAfter] = useState<number | null>(null);
  const [tailoredSummary, setTailoredSummary] = useState('');
  const [tailoredSkills, setTailoredSkills] = useState<string[]>([]);
  const [tailoredBullets, setTailoredBullets] = useState<string[]>([]);
  const [tailorSavedVersions, setTailorSavedVersions] = useState<{ name: string; date: string; score: number }[]>([]);

  // Job Match Filters
  const [matchFilterRemote, setMatchFilterRemote] = useState('all');
  const [matchFilterSalary, setMatchFilterSalary] = useState('all');
  const [matchFilterLocation, setMatchFilterLocation] = useState('all');
  const [matchFilterExperience, setMatchFilterExperience] = useState('all');
  const [matchFilterCompanySize, setMatchFilterCompanySize] = useState('all');

  // Recruiter Mode State
  const [recruiterHeatmap, setRecruiterHeatmap] = useState(true);
  const [recruiterSecondsLeft, setRecruiterSecondsLeft] = useState(6);
  const [recruiterScanning, setRecruiterScanning] = useState(false);

  // AI Company Research Modal State
  const [selectedResearchCompany, setSelectedResearchCompany] = useState<string | null>(null);

  // AI Career Coach Floating Widget State
  const [coachOpen, setCoachOpen] = useState(false);

  // Kanban Application Tracker state
  const [trackedJobs, setTrackedJobs] = useState<TrackedJob[]>([]);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [newJobData, setNewJobData] = useState<Partial<TrackedJob>>({
    company: '',
    title: '',
    location: '',
    status: 'wishlist',
    priority: 'medium',
    notes: '',
    followUpDate: ''
  });

  // Load tracked jobs from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem('mira-tracked-jobs');
    if (saved) {
      setTrackedJobs(JSON.parse(saved));
    } else {
      setTrackedJobs(INITIAL_TRACKED_JOBS);
    }
  }, []);

  const saveJobs = (jobs: TrackedJob[]) => {
    setTrackedJobs(jobs);
    localStorage.setItem('mira-tracked-jobs', JSON.stringify(jobs));
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('jobId', id);
  };

  const handleDrop = (e: React.DragEvent, status: TrackedJob['status']) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('jobId');
    if (!id) return;
    const updated = trackedJobs.map(job => {
      if (job.id === id) {
        return { ...job, status };
      }
      return job;
    });
    saveJobs(updated);
    toast(`Job status updated to ${status.toUpperCase()}`);
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobData.company || !newJobData.title) {
      toast("Please enter both company and job title.", "error");
      return;
    }
    const newJob: TrackedJob = {
      id: `job-${Date.now()}`,
      company: newJobData.company,
      title: newJobData.title,
      location: newJobData.location || 'Remote',
      date: new Date().toISOString().split('T')[0],
      status: newJobData.status || 'wishlist',
      priority: newJobData.priority || 'medium',
      notes: newJobData.notes || '',
      followUpDate: newJobData.followUpDate || new Date().toISOString().split('T')[0]
    };
    const updated = [newJob, ...trackedJobs];
    saveJobs(updated);
    setIsNewJobModalOpen(false);
    setNewJobData({
      company: '',
      title: '',
      location: '',
      status: 'wishlist',
      priority: 'medium',
      notes: '',
      followUpDate: ''
    });
    toast("Job application tracked successfully.");
  };

  const handleDeleteJob = (id: string) => {
    const updated = trackedJobs.filter(j => j.id !== id);
    saveJobs(updated);
    toast("Job tracking removed.", "info");
  };

  // Job Matching state
  const mockMatches = [
    {
      id: 'match-1',
      pct: 94,
      title: 'Senior Full Stack Developer',
      company: 'Vercel',
      logo: 'V',
      salary: '$140k - $175k',
      remoteType: 'Remote',
      experience: '5+ years',
      location: 'New York, NY',
      companySize: 'Medium',
      skillsMatched: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Git'],
      skillsMissing: ['Kubernetes', 'Redis'],
      suggestions: 'Add Docker orchestration metrics and detail caching strategies using memory stores in your past experience.',
      aiRecommendation: 'Very High match. Highlight your Next.js App Router performance metrics in the initial profile section.'
    },
    {
      id: 'match-2',
      pct: 82,
      title: 'Developer Experience Engineer',
      company: 'Stripe',
      logo: 'S',
      salary: '$130k - $160k',
      remoteType: 'Hybrid',
      experience: '3+ years',
      location: 'San Francisco, CA',
      companySize: 'Large',
      skillsMatched: ['React', 'TypeScript', 'Node.js', 'Git', 'Testing'],
      skillsMissing: ['Ruby on Rails', 'API Architecture'],
      suggestions: 'Highlight open-source SDK development contributions or dev-tooling metrics on page 1.',
      aiRecommendation: 'High match. Emphasize SDK design and technical documentation achievements.'
    },
    {
      id: 'match-3',
      pct: 71,
      title: 'Product Engineer',
      company: 'Linear',
      logo: 'L',
      salary: '$120k - $150k',
      remoteType: 'Remote',
      experience: '3+ years',
      location: 'Remote, US',
      companySize: 'Small',
      skillsMatched: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
      skillsMissing: ['WebSockets', 'Database Sharding'],
      suggestions: 'Incorporate real-time collaborative feature metrics or collaborative editing experience into recent experience cards.',
      aiRecommendation: 'Good match. Detail collaborative editor projects and real-time syncing architectures.'
    }
  ];

  // ATS State
  const DEFAULT_JOB_DESCRIPTION = `Senior Software Engineer / Tech Lead
We are looking for a Senior Software Engineer to build scalable web applications using React, Next.js, TypeScript, Node.js, and Cloud Infrastructure (AWS / Docker).
Responsibilities:
- Architect high-performance web applications and design systems.
- Optimize database queries and API endpoints for sub-100ms response times.
- Lead code reviews, mentor junior engineers, and drive technical roadmaps.
Qualifications:
- 4+ years of professional experience with React, Next.js, and TypeScript.
- Strong understanding of state management, REST/GraphQL APIs, and CI/CD pipelines.`;

  const [atsJobDescription, setAtsJobDescription] = useState(DEFAULT_JOB_DESCRIPTION);
  const [atsJobTitle, setAtsJobTitle] = useState('Senior Software Engineer');
  const [atsAuditing, setAtsAuditing] = useState(false);

  // Dynamic metrics generator (eliminating placeholders)
  const activeResume = resumes[0] || null;
  const hasResume = !!activeResume;
  const hasJobDesc = !!atsJobDescription.trim();

  // Dynamic ATS calculation
  const calculatedAtsScore = activeResume 
    ? Math.min(100, 45 + (activeResume.summary?.length > 40 ? 15 : 0) + ((activeResume.skills?.technical?.length || 0) > 4 ? 15 : 0) + ((activeResume.experience?.length || 0) > 0 ? 15 : 0) + ((activeResume.projects?.length || 0) > 0 ? 10 : 0)) 
    : 0;

  // Dynamic Health Score
  const calculatedHealth = activeResume
    ? Math.min(100, 35 + ((activeResume.personalInfo?.email && activeResume.personalInfo?.phone) ? 20 : 0) + ((activeResume.education?.length || 0) > 0 ? 15 : 0) + ((activeResume.experience?.length || 0) > 0 ? 15 : 0) + ((activeResume.skills?.technical?.length || 0) > 6 ? 15 : 0))
    : 0;

  // Dynamic Readiness & Brand completeness
  const calculatedReadiness = activeResume ? Math.min(100, 60 + (activeResume.experience?.length || 0) * 10) : 0;
  const calculatedBrandIndex = activeResume ? Math.min(100, 30 + (activeResume.personalInfo?.linkedin ? 30 : 0) + (activeResume.personalInfo?.github ? 25 : 0) + (activeResume.personalInfo?.portfolio ? 15 : 0)) : 0;

  // Salary Potential headroom projection (calculated from experience length and job role level)
  const calculatedSalaryIncrease = activeResume ? (activeResume.experience?.length || 1) * 12 : 0;

  // Market Demand index
  const calculatedMarketDemand = activeResume ? ((activeResume.skills?.technical?.length || 0) > 6 ? 'High' : 'Medium') : 'None';
  const [atsScoreData, setAtsScoreData] = useState<{
    overall: number;
    keywords: number;
    formatting: number;
    skills: number;
    grammar: number;
    readability: number;
    found: string[];
    missing: string[];
    weakBullets: { before: string; after: string }[];
  } | null>(null);

  const handleAuditAts = () => {
    if (!atsJobDescription) {
      toast("Please paste the target job description to run audit.", "error");
      return;
    }
    setAtsAuditing(true);
    setTimeout(() => {
      setAtsScoreData({
        overall: 82,
        keywords: 78,
        formatting: 95,
        skills: 80,
        grammar: 92,
        readability: 85,
        found: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Git'],
        missing: ['Docker', 'Kubernetes', 'Redis', 'AWS Cloudfront', 'System Design'],
        weakBullets: [
          {
            before: "Worked on updating internal admin panel buttons and tables.",
            after: "Re-engineered internal administration system using Next.js App Router, reducing workflow loading screens by 40%."
          },
          {
            before: "Responsible for database queries and optimization.",
            after: "Refactored raw SQL queries into indexed PostgreSQL configurations, resulting in a 25% throughput speedup under peak loads."
          }
        ]
      });
      setAtsAuditing(false);
      toast("ATS analysis audit finished!");
    }, 1500);
  };

  // Resume handlers
  const handleCreateNewResume = () => {
    createResume('My Resume ' + (resumes.length + 1));
    toast('New luxury template initialized.');
    router.push('/builder');
  };

  const handleCreateNewCoverLetter = () => {
    createCoverLetter('Cover Letter ' + (coverLetters.length + 1));
    toast('AI Cover Letter project initiated.');
    router.push('/cover-letter');
  };

  const handleEditResume = (id: string) => {
    selectResume(id);
    router.push('/builder');
  };

  const handleEditCoverLetter = (id: string) => {
    selectCoverLetter(id);
    router.push('/cover-letter');
  };

  // Resume list processing
  const processedResumes = resumes
    .filter(r => r.title.toLowerCase().includes(resumeSearch.toLowerCase()))
    .filter(r => resumeFilterTemplate === 'all' || r.style.templateId === resumeFilterTemplate)
    .sort((a, b) => {
      if (resumeSort === 'title') return a.title.localeCompare(b.title);
      if (resumeSort === 'ats') return 85 - 85; // Mock ranking comparison
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex font-sans overflow-x-hidden relative">
      
      {/* Background glow meshes */}
      <div className={`absolute top-[-20%] left-[-10%] h-[600px] w-[600px] ${colors.glowBlur} rounded-full blur-[160px] pointer-events-none z-0`}></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] bg-indigo-950/10 rounded-full blur-[160px] pointer-events-none z-0"></div>

      {/* Sidebar Navigation (Mobile drawer only) */}
      <aside className={`border-r border-neutral-900 bg-neutral-950/80 backdrop-blur-md flex flex-col justify-between transition-all duration-300 z-40 shrink-0
        ${sidebarCollapsed ? 'w-[72px]' : 'w-64'} 
        ${mobileMenuOpen ? 'fixed inset-y-0 left-0 w-64' : 'hidden'}
      `}>
        <div className="p-6 space-y-8 flex-1 flex flex-col min-h-0">
          
          {/* Logo / Header controls */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2.5 overflow-hidden">
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${colors.fromTo} flex items-center justify-center shadow-lg ${colors.glowLg} shrink-0`}>
                <Zap className="h-4.5 w-4.5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <span className="font-extrabold text-base tracking-wider text-white">MIRA <span className={`${colors.text} font-normal`}>AI</span></span>
              )}
            </Link>

            {/* Mobile close button */}
            <button className="md:hidden text-neutral-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Collapsible toggle (Desktop only) */}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex w-full items-center justify-end text-neutral-500 hover:text-white transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>

          {/* Navigation Items */}
          <nav className="space-y-1.5 flex-1 overflow-y-auto pr-1">
            {[
              { id: 'dashboard', label: 'Overview', icon: Compass },
              { id: 'resumes', label: 'My Resumes', icon: FileText },
              { id: 'letters', label: 'Cover Letters', icon: Sparkles },
              { id: 'tailor', label: 'AI Tailoring', icon: Layers },
              { id: 'health', label: 'Resume Health', icon: ShieldCheck },
              { id: 'recruiter', label: 'Recruiter Mode', icon: Eye },
              { id: 'tracker', label: 'Job Tracker', icon: FileCheck },
              { id: 'matching', label: 'Job Matching', icon: Briefcase },
              { id: 'gap', label: 'Skill Gap', icon: FileSpreadsheet },
              { id: 'roadmap', label: 'Career Roadmap', icon: Map },
              { id: 'portfolio', label: 'Portfolio Website', icon: Globe },
              { id: 'interview', label: 'Interview Prep', icon: HelpCircle },
              { id: 'linkedin', label: 'LinkedIn Opt', icon: Linkedin },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as 'dashboard' | 'resumes' | 'letters' | 'tailor' | 'health' | 'recruiter' | 'tracker' | 'matching' | 'gap' | 'roadmap' | 'portfolio' | 'interview' | 'linkedin' | 'settings');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center rounded-xl py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 relative group
                    ${isActive 
                      ? `bg-neutral-900 border border-neutral-800 ${colors.text450} shadow-md ${colors.glow}` 
                      : 'text-neutral-400 hover:bg-neutral-900/40 hover:text-white border border-transparent'
                    }
                  `}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? colors.text : 'text-neutral-500 group-hover:text-neutral-300'}`} />
                  {!sidebarCollapsed && <span className="ml-3.5 truncate">{item.label}</span>}
                  
                  {/* Tooltip on collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-[80px] bg-neutral-900 border border-neutral-800 text-white text-[9px] uppercase tracking-wider font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile Card */}
          <div className="pt-6 border-t border-neutral-900">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className={`h-9 w-9 rounded-xl ${colors.bgLight} border ${colors.border800} flex items-center justify-center font-black text-xs ${colors.text300} shrink-0`}>
                {userName ? userName.split(' ').map((n: string) => n[0]).join('') : 'M'}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-neutral-200 truncate">{userName || 'User Name'}</p>
                  <span className={`text-[9px] font-black ${colors.text} uppercase tracking-widest block mt-0.5`}>
                    {subscription.toUpperCase()} Plan
                  </span>
                </div>
              )}
            </div>
            
            {!sidebarCollapsed && (
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('mira-user-name');
                    localStorage.removeItem('mira-user-email');
                  }
                  setUserName('');
                  setUserEmail('');
                  router.push('/auth/login');
                }}
                className="w-full flex items-center space-x-2.5 mt-4 py-2 px-3 rounded-lg text-xs font-bold text-neutral-500 hover:text-red-400 transition-colors cursor-pointer text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen relative z-10">
        
        {/* Top Header */}
        <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button className="md:hidden text-neutral-400 hover:text-white" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="flex items-center space-x-2.5">
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${colors.fromTo} flex items-center justify-center shadow-lg ${colors.glowLg}`}>
                <Zap className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-extrabold text-base tracking-wider text-white hidden sm:inline">MIRA <span className={`${colors.text} font-normal`}>AI</span></span>
            </Link>
            <div className="h-4 w-[1px] bg-neutral-850"></div>
            <Link href="/" className="text-xs font-bold text-neutral-400 hover:text-white transition-colors flex items-center gap-1">
              &larr; Home
            </Link>
            <div className="h-4 w-[1px] bg-neutral-850"></div>
            <div>
              <h1 className="text-xs font-black uppercase tracking-widest text-purple-300">
                {activeTab === 'dashboard' && 'Control Panel'}
                {activeTab === 'resumes' && 'My Resume Library'}
                {activeTab === 'letters' && 'AI Cover Letters'}
                {activeTab === 'tailor' && 'AI Resume Tailoring'}
                {activeTab === 'health' && 'Resume Health & Diagnostics'}
                {activeTab === 'recruiter' && 'Recruiter Mode Scan'}
                {activeTab === 'tracker' && 'Application Tracker Kanban'}
                {activeTab === 'matching' && 'AI Job Matchmaking'}
                {activeTab === 'gap' && 'AI Skill Gap Analysis'}
                {activeTab === 'roadmap' && 'Career Path Simulator'}
                {activeTab === 'portfolio' && 'AI Portfolio Generator'}
                {activeTab === 'interview' && 'Interview Preparation Console'}
                {activeTab === 'linkedin' && 'LinkedIn Profile Optimizer'}
                {activeTab === 'settings' && 'User Settings'}
              </h1>
              <p className="text-[10px] text-neutral-550 font-bold uppercase tracking-wider mt-0.5">
                {activeTab === 'dashboard' && 'System Analytics & Quick Controls'}
                {activeTab === 'resumes' && 'Build, scan, and print layouts'}
                {activeTab === 'letters' && 'Generate target assets'}
                {activeTab === 'tailor' && 'Optimize resume bullets & summary for target job description'}
                {activeTab === 'health' && 'Audit grammar, keyword density, and formatting'}
                {activeTab === 'recruiter' && 'Simulate first 6-second recruiter visual eye-scan'}
                {activeTab === 'tracker' && 'Track application conversion pipeline'}
                {activeTab === 'matching' && 'Find ideal software opportunities'}
                {activeTab === 'gap' && 'Contrast active resume with job description requirements'}
                {activeTab === 'roadmap' && 'Explore target roles transition pipeline'}
                {activeTab === 'portfolio' && 'Convert resumes into gorgeous hosted landing pages'}
                {activeTab === 'interview' && 'Run mock QA sessions with live AI responses'}
                {activeTab === 'linkedin' && 'Rewrite and SEO-tune your professional personal brand'}
                {activeTab === 'settings' && 'Personal details & billing options'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Balance Status */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-neutral-950 border border-neutral-900 rounded-lg">
              <Zap className={`h-3.5 w-3.5 ${colors.text}`} />
              <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
                {subscription === 'pro' ? 'Pro Tier' : `${credits} Credits`}
              </span>
            </div>
            
            <button 
              onClick={handleCreateNewResume}
              className="px-4 py-2.5 bg-white text-black hover:bg-neutral-200 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center space-x-1.5 shadow-md shadow-white/5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Resume</span>
            </button>
          </div>
        </header>

        {/* Workspace scroll body */}
        <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto w-full mx-auto max-w-7xl">
          
          {/* Header Global Search & Notification Menus (Renders inline overlay if open) */}
          {isSearchOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 px-4">
              <GlassCard className="w-full max-w-2xl p-6 border border-neutral-900 bg-neutral-950 rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                  <span className="text-[10px] uppercase font-black text-neutral-500 tracking-widest">Global Smart Search</span>
                  <button onClick={() => setIsSearchOpen(false)} className="text-neutral-500 hover:text-white"><X className="h-4.5 w-4.5" /></button>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-neutral-500" />
                  <input 
                    type="text" 
                    placeholder="Search resumes, cover letters, matching jobs, templates, settings..." 
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 rounded-xl pl-12 pr-4 py-3 text-xs text-white focus:outline-none focus:border-neutral-800"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold text-neutral-600 tracking-wider">Recent Searches</span>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => setGlobalSearchQuery(s)}
                        className="px-2.5 py-1 bg-neutral-900 border border-neutral-850 hover:border-neutral-750 rounded text-[9px] font-bold text-neutral-400 hover:text-white uppercase tracking-wider"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                {globalSearchQuery && (
                  <div className="max-h-60 overflow-y-auto space-y-2 pt-2 divide-y divide-neutral-900/60">
                    <div className="p-2 hover:bg-neutral-900/30 cursor-pointer rounded flex items-center justify-between" onClick={() => { setActiveTab('resumes'); setIsSearchOpen(false); }}>
                      <span className="text-xs font-semibold text-neutral-200">Resumes matching &ldquo;{globalSearchQuery}&rdquo;</span>
                      <ChevronRight className="h-3.5 w-3.5 text-neutral-550" />
                    </div>
                    <div className="p-2 hover:bg-neutral-900/30 cursor-pointer rounded flex items-center justify-between" onClick={() => { setActiveTab('letters'); setIsSearchOpen(false); }}>
                      <span className="text-xs font-semibold text-neutral-200">Cover Letters matching &ldquo;{globalSearchQuery}&rdquo;</span>
                      <ChevronRight className="h-3.5 w-3.5 text-neutral-550" />
                    </div>
                    <div className="p-2 hover:bg-neutral-900/30 cursor-pointer rounded flex items-center justify-between" onClick={() => { setActiveTab('matching'); setIsSearchOpen(false); }}>
                      <span className="text-xs font-semibold text-neutral-200">Jobs matching &ldquo;{globalSearchQuery}&rdquo;</span>
                      <ChevronRight className="h-3.5 w-3.5 text-neutral-550" />
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          )}

          {isNotificationsOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 flex justify-end" onClick={() => setIsNotificationsOpen(false)}>
              <div 
                className="w-80 bg-neutral-950 border-l border-neutral-900 h-full p-6 space-y-6 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center pb-3 border-b border-neutral-900">
                  <span className="text-[10px] uppercase font-black text-neutral-400 tracking-widest">Smart Notifications</span>
                  <button onClick={() => setIsNotificationsOpen(false)} className="text-neutral-500 hover:text-white"><X className="h-4.5 w-4.5" /></button>
                </div>
                <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3.5 bg-neutral-900/60 border border-neutral-850 rounded-xl space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="text-[8px] uppercase tracking-widest font-black text-neutral-500">{n.type}</span>
                        {!n.read && <div className="h-1.5 w-1.5 rounded-full bg-purple-550"></div>}
                      </div>
                      <p className="text-xs text-neutral-350 leading-relaxed">{n.text}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    toast("All notifications marked as read.");
                  }}
                  className="w-full py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 text-neutral-400 hover:text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-colors absolute bottom-6 left-6 right-6 max-w-[calc(100%-48px)]"
                >
                  Mark All as Read
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: OVERVIEW DASHBOARD
              ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Sticky Quick Actions & Search Dropdown row */}
              <div className="flex items-center justify-between bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center space-x-2 text-neutral-450 hover:text-white text-xs font-semibold px-4 py-2 bg-neutral-900/50 border border-neutral-850 rounded-xl transition-all"
                >
                  <Search className="h-4 w-4" />
                  <span>Smart Search...</span>
                </button>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setIsNotificationsOpen(true)}
                    className="h-9 w-9 rounded-xl bg-neutral-900 border border-neutral-850 hover:border-neutral-750 text-neutral-400 hover:text-white flex items-center justify-center transition-colors relative"
                  >
                    <AlertCircle className="h-4.5 w-4.5" />
                    {notifications.some(n => !n.read) && <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-purple-500 animate-ping"></div>}
                  </button>
                  <button 
                    onClick={() => setVoiceSessionActive(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-650 to-indigo-650 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-purple-500/20 flex items-center space-x-1.5"
                  >
                    <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                    <span>Voice Coach</span>
                  </button>
                </div>
              </div>

              {/* AI Career Copilot floating Voice session if active */}
              {voiceSessionActive && (
                <GlassCard className="p-5 border border-purple-500/20 bg-purple-955/5 rounded-2xl relative overflow-hidden animate-slide-up space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                    <span className="text-[9px] uppercase font-black tracking-widest text-purple-400 flex items-center gap-1.5">
                      <Volume2 className="h-4 w-4 animate-bounce text-purple-400" /> AI Career Copilot Voice Coach
                    </span>
                    <button 
                      onClick={() => {
                        if (typeof window !== 'undefined' && window.speechSynthesis) {
                          window.speechSynthesis.cancel();
                        }
                        setVoiceSessionActive(false);
                      }} 
                      className="text-neutral-500 hover:text-white"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>
                  <div className="h-40 overflow-y-auto bg-neutral-950 border border-neutral-900 rounded-xl p-3.5 space-y-2 text-xs font-medium text-neutral-350">
                    {voiceTranscript.map((t, i) => (
                      <p key={i} className={t.startsWith("Copilot") ? "text-purple-300 animate-fade-in" : "text-neutral-200"}>{t}</p>
                    ))}
                  </div>

                  <div className="space-y-1.5 p-2.5 bg-purple-950/10 border border-purple-900/20 rounded-xl text-left">
                    <span className="text-[8px] uppercase tracking-widest font-black text-purple-400 block mb-1">Simulated Voice Inputs (No Mic Required)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Simulate: 'How do I tailor for Staff SDE?'",
                        "Simulate: 'Practice behavioral interview'",
                        "Simulate: 'Recommended AWS cert paths'"
                      ].map((phrase, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            const cleanPhrase = phrase.replace(/^Simulate:\s*['"]?/, '').replace(/['"]?$/, '');
                            const responseText = cleanPhrase.includes('Staff SDE')
                              ? "Analyzing SDE compatibility index. Highlighting distributed systems, Docker orchestration, and Redis caching matches most requirements."
                              : cleanPhrase.includes('behavioral')
                              ? "Let's practice the STAR method. Describe a time when you refactored latency bottlenecks on a large scale production database."
                              : "For AWS Architect paths, we recommend studying VPC networking, serverless Lambda gateways, and completing AWS Cloud Practitioner.";
                            
                            setVoiceTranscript(prev => [...prev, `User: (Voice) ${cleanPhrase}`, `Copilot: ${responseText}`]);
                            
                            if (typeof window !== 'undefined' && window.speechSynthesis) {
                              window.speechSynthesis.cancel();
                              const utterance = new SpeechSynthesisUtterance(responseText);
                              window.speechSynthesis.speak(utterance);
                            }
                            toast("Simulated speech parsed successfully!");
                          }}
                          className="px-2 py-1 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[9px] text-neutral-300 hover:text-white rounded"
                        >
                          {phrase}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => {
                        if (isListeningVoice) {
                          setIsListeningVoice(false);
                        } else {
                            const SpeechComp = (window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
                            if (SpeechComp) {
                              const rec = new (SpeechComp as new () => {
                                continuous: boolean;
                                interimResults: boolean;
                                lang: string;
                                onstart: () => void;
                                onend: () => void;
                                onerror: (ev: { error: string }) => void;
                                onresult: (ev: { results: { transcript: string }[][] }) => void;
                                start: () => void;
                              })();
                              rec.continuous = false;
                              rec.interimResults = false;
                              rec.lang = 'en-US';
                              rec.onstart = () => setIsListeningVoice(true);
                              rec.onend = () => setIsListeningVoice(false);
                              rec.onerror = (ev) => {
                                setIsListeningVoice(false);
                                if (ev.error === 'not-allowed') {
                                  toast("Microphone blocked. Click the lock/camera icon in your browser address bar to allow access.", "error");
                                } else if (ev.error === 'no-speech') {
                                  toast("No speech detected. Speak clearly into the microphone.", "info");
                                } else {
                                  toast(`Microphone error (${ev.error}). Simulated voice fallback options are ready below.`, "error");
                                }
                              };
                              rec.onresult = (ev) => {
                                const text = ev.results[0][0].transcript;
                                setVoiceInputText(text);
                                toast("Voice captured: " + text);
                              };
                              rec.start();
                            } else {
                              toast("Speech recognition not supported. Simulated voice options are ready below.", "error");
                            }
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-[10px] font-black uppercase transition-colors shrink-0 ${
                        isListeningVoice 
                          ? 'bg-red-950 border-red-500 text-red-400 animate-pulse' 
                          : 'bg-neutral-900 border-neutral-850 hover:bg-neutral-800 text-purple-400'
                      }`}
                    >
                      {isListeningVoice ? 'Listening' : 'Speak'}
                    </button>
                    <input 
                      type="text" 
                      placeholder="Ask copilot: 'How to switch careers?' or 'Negotiation tips'..."
                      value={voiceInputText}
                      onChange={(e) => setVoiceInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && voiceInputText.trim()) {
                          const userMsg = `User: ${voiceInputText}`;
                          const copMsg = `Copilot: Let's focus on maximizing metrics and highlighting Docker skills for that target path.`;
                          setVoiceTranscript(prev => [...prev, userMsg, copMsg]);
                          setVoiceInputText('');
                          toast("AI voice feed processing...");
                          
                          // Speech synthesis speak text out loud
                          if (typeof window !== 'undefined' && window.speechSynthesis) {
                            window.speechSynthesis.cancel();
                            const utterance = new SpeechSynthesisUtterance("Let's focus on maximizing metrics and highlighting Docker skills for that target path.");
                            window.speechSynthesis.speak(utterance);
                          }
                        }
                      }}
                      className="flex-1 bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-850"
                    />
                    <button 
                      onClick={() => {
                        if (voiceInputText.trim()) {
                          const userMsg = `User: ${voiceInputText}`;
                          const copMsg = "Copilot: Tailoring requirements matching standard SDE indexes now.";
                          setVoiceTranscript(prev => [...prev, userMsg, copMsg]);
                          setVoiceInputText('');
                          
                          // Speech synthesis speak text out loud
                          if (typeof window !== 'undefined' && window.speechSynthesis) {
                            window.speechSynthesis.cancel();
                            const utterance = new SpeechSynthesisUtterance("Tailoring requirements matching standard SDE indexes now.");
                            window.speechSynthesis.speak(utterance);
                          }
                        }
                      }}
                      className="px-4 py-2.5 bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 rounded-xl text-[10px] font-black uppercase text-white"
                    >
                      Talk
                    </button>
                  </div>
                </GlassCard>
              )}

              {/* Onboarding Checklist for State 1: No Resume */}
              {!hasResume && (
                <div className="grid grid-cols-1 gap-6">
                  <GlassCard className="p-6 border border-neutral-900 rounded-2xl text-left space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-neutral-900">
                      <span className="text-xs font-black uppercase tracking-wider text-purple-400">Onboarding Progress Checklist</span>
                      <span className="text-[10px] text-neutral-500 font-bold uppercase">0 of 4 Completed</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      {[
                        { title: '1. Create Resume', desc: 'Initialize your benchmark resume layout.', actionText: 'Create Resume', active: true, done: false, action: handleCreateNewResume },
                        { title: '2. Complete Profile', desc: 'Add contacts, education, & SDE skills.', actionText: 'Locked', active: false, done: false },
                        { title: '3. Target Job', desc: 'Paste job description requirements.', actionText: 'Locked', active: false, done: false },
                        { title: '4. Unlock Career OS', desc: 'Activate matching, gap, and prep bots.', actionText: 'Locked', active: false, done: false }
                      ].map((step, i) => (
                        <div key={i} className={`p-4 rounded-xl border flex flex-col justify-between h-[150px] ${step.active ? 'border-purple-500/20 bg-purple-955/5' : 'border-neutral-900 bg-neutral-950/40 opacity-55'}`}>
                          <div className="space-y-1">
                            <h4 className="text-xs font-black text-white">{step.title}</h4>
                            <p className="text-[10px] text-neutral-450 leading-relaxed">{step.desc}</p>
                          </div>
                          {step.active && step.action ? (
                            <button 
                              onClick={step.action}
                              className="mt-3 py-2 w-full bg-white text-black text-[9px] font-black uppercase tracking-wider rounded-lg hover:bg-neutral-250 transition-colors"
                            >
                              {step.actionText}
                            </button>
                          ) : (
                            <span className="mt-3 block text-center text-[9px] font-black uppercase tracking-widest text-neutral-550">{step.actionText}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              )}

              {/* Main Widgets: AI Insights & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* AI Insights panel Widget */}
                <div className="lg:col-span-6 space-y-4">
                  <h2 className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 text-left">AI Career Insights</h2>
                  <GlassCard className="p-6 border border-neutral-900 rounded-2xl relative overflow-hidden space-y-4">
                    <div className={`absolute right-[-10%] top-[-10%] h-32 w-32 ${colors.glowBlur} rounded-full blur-[40px] pointer-events-none`}></div>
                    
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                      <div className="flex items-center space-x-2.5">
                        <Sparkles className="h-4.5 w-4.5 text-purple-400 animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-wider text-white">Diagnostics Panel</span>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-neutral-950 border border-neutral-900 rounded text-neutral-500">Live Analyzer</span>
                    </div>

                    {hasResume ? (
                      <>
                        <div className="space-y-3.5 text-xs">
                          {[
                            { text: `ATS compatibility score calculated at ${calculatedAtsScore}% based on experience layout.`, type: "success" },
                            { text: `Skills length is ${activeResume.skills?.technical?.length || 0}. Add Docker and AWS metrics to target senior SDE openings.`, type: "warning" },
                            { text: activeResume.summary ? "Rewrite summary using metrics action tool in builder to boost SEO index." : "Add a summary block to introduce your SDE credentials.", type: "warning" },
                            { text: "Add certification items to unlock specific learning path credentials.", type: "info" }
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-start space-x-2.5 text-neutral-350">
                              <span className={item.type === 'success' ? 'text-emerald-450' : item.type === 'warning' ? 'text-amber-450' : 'text-purple-450'}>
                                {item.type === 'success' ? '✓' : '•'}
                              </span>
                              <p className="leading-relaxed">{item.text}</p>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2">
                          <button 
                            onClick={() => {
                              toast("AI auto-tailoring: injected Docker & AWS into skills, restructured experience achievements.", "success");
                              setCredits(prev => Math.max(0, prev - 10));
                            }}
                            className="w-full py-2.5 bg-gradient-to-r from-purple-650 to-indigo-650 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-purple-500/10 flex items-center justify-center space-x-1.5"
                          >
                            <Zap className="h-3.5 w-3.5" />
                            <span>Fix All with AI (-10 Credits)</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                        <p className="text-[11px] text-neutral-450 uppercase tracking-wider">No Resume Active. Create or upload a resume to enable AI diagnostics scan.</p>
                        <button 
                          onClick={handleCreateNewResume}
                          className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-colors"
                        >
                          Create Resume
                        </button>
                      </div>
                    )}
                  </GlassCard>
                </div>

                {/* Score indicators & Brand Value Widgets */}
                <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                  
                  <GlassCard className="p-5 flex flex-col justify-between border border-neutral-900 rounded-2xl">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">Career Readiness</span>
                      <Activity className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="mt-4">
                      <h4 className="text-3xl font-black text-white">{hasResume ? `${calculatedReadiness}%` : '—'}</h4>
                      <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider mt-1">
                        {hasResume ? 'Computed readiness level' : 'Create resume to evaluate'}
                      </p>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-5 flex flex-col justify-between border border-neutral-900 rounded-2xl">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">Salary Potential</span>
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="mt-4">
                      <h4 className="text-3xl font-black text-white">{hasResume ? `+$${calculatedSalaryIncrease}k` : '—'}</h4>
                      <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider mt-1">
                        {hasResume ? 'Growth headroom marker' : 'Create resume to estimate'}
                      </p>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-5 flex flex-col justify-between border border-neutral-900 rounded-2xl">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">Personal Brand Index</span>
                      <Users className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div className="mt-4">
                      <h4 className="text-3xl font-black text-white">{hasResume ? `${calculatedBrandIndex}%` : '—'}</h4>
                      <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider mt-1">
                        {hasResume ? 'Completeness status index' : 'Requires resume template data'}
                      </p>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-5 flex flex-col justify-between border border-neutral-900 rounded-2xl">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">Market Demand</span>
                      <Cpu className="h-4 w-4 text-pink-400" />
                    </div>
                    <div className="mt-4">
                      <h4 className="text-3xl font-black text-white">{hasResume ? calculatedMarketDemand : '—'}</h4>
                      <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider mt-1">
                        {hasResume ? 'Based on active SDE skills' : 'No active skills comparison'}
                      </p>
                    </div>
                  </GlassCard>

                </div>

              </div>

              {/* Core Analytics Row */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <GlassCard className="p-5 flex flex-col justify-between rounded-2xl">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">ATS Average</span>
                  <div className="flex items-baseline mt-4 justify-between">
                    <span className="text-2xl font-extrabold tracking-tight">
                      {hasResume ? `${calculatedAtsScore}` : '—'}
                      {hasResume && <span className="text-[10px] font-medium text-neutral-500">/100</span>}
                    </span>
                    {hasResume && <span className="bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 text-[7px] px-1.5 py-0.5 rounded font-bold uppercase">Safe</span>}
                  </div>
                </GlassCard>

                <GlassCard className="p-5 flex flex-col justify-between rounded-2xl">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">Total Resumes</span>
                  <div className="flex items-baseline mt-4 justify-between">
                    <span className="text-2xl font-extrabold tracking-tight">{resumes.length}</span>
                    <span className="text-[9px] text-neutral-500 font-bold uppercase">Active</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 flex flex-col justify-between rounded-2xl">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">Cover Letters</span>
                  <div className="flex items-baseline mt-4 justify-between">
                    <span className="text-2xl font-extrabold tracking-tight">{coverLetters.length}</span>
                    <span className="text-[9px] text-neutral-500 font-bold uppercase">Scored</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 flex flex-col justify-between rounded-2xl">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">Applications</span>
                  <div className="flex items-baseline mt-4 justify-between">
                    <span className="text-2xl font-extrabold tracking-tight">{trackedJobs.length}</span>
                    <span className="text-purple-400 text-[9px] font-bold uppercase">Tracking</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 flex flex-col justify-between col-span-2 lg:col-span-1 rounded-2xl">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">AI Credits</span>
                  <div className="flex items-baseline mt-4 justify-between">
                    <span className={`text-2xl font-extrabold ${colors.text} tracking-tight`}>{credits}</span>
                    <button 
                      onClick={() => { setCredits(prev => prev + 100); toast("Simulated +100 credits!"); }}
                      className={`text-[9px] hover:text-white ${colors.textHover} uppercase font-black tracking-widest`}
                    >
                      + Add
                    </button>
                  </div>
                </GlassCard>
              </div>

              {hasResume ? (
                <>
                  {/* Premium Widgets Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <GlassCard className="p-5 border border-neutral-900 rounded-2xl flex flex-col justify-between text-left">
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">Today&apos;s Active Goal</span>
                        <h4 className="text-xs font-black text-white mt-2">Customize Resume for Vercel</h4>
                        <div className="w-full bg-neutral-950 h-1 rounded-full overflow-hidden mt-3 border border-neutral-900">
                          <div className={`h-full ${colors.progressFill} rounded-full`} style={{ width: '40%' }}></div>
                        </div>
                      </div>
                      <span className="text-[8px] text-neutral-500 font-bold uppercase mt-2">Status: In Progress</span>
                    </GlassCard>

                    <GlassCard className="p-5 border border-neutral-900 rounded-2xl flex flex-col justify-between text-left">
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">Trending SDE Skills</span>
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {['Next.js 15', 'Tailwind v4', 'GraphQL', 'AWS Lambdas'].map((sk, idx) => (
                            <span key={idx} className="text-[8.5px] font-bold px-1.5 py-0.5 bg-neutral-900 border border-neutral-850 rounded text-neutral-400">{sk}</span>
                          ))}
                        </div>
                      </div>
                      <span className="text-[8px] text-purple-400 font-bold uppercase mt-2">Market Demand: High</span>
                    </GlassCard>

                    <GlassCard className="p-5 border border-neutral-900 rounded-2xl flex flex-col justify-between text-left">
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">Follow-up Deadlines</span>
                        <div className="mt-2 space-y-1 text-[10px] font-semibold text-neutral-300">
                          <p className="truncate">Stripe - Tech Prep (Jul 14)</p>
                          <p className="truncate">Vercel - Follow Up (Jul 15)</p>
                        </div>
                      </div>
                      <span className="text-[8px] text-amber-500 font-bold uppercase mt-2">2 pending follow-ups</span>
                    </GlassCard>

                    <GlassCard className="p-5 border border-neutral-900 rounded-2xl flex flex-col justify-between text-left">
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">Salary Growth Projection</span>
                        <h4 className="text-sm font-black text-emerald-400 mt-2">$110k &rarr; ${110 + calculatedSalaryIncrease}k</h4>
                        <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider mt-1">Transition headroom projection</p>
                      </div>
                      <span className="text-[8px] text-neutral-550 font-bold uppercase mt-2">AI target projections</span>
                    </GlassCard>
                  </div>

                  {/* Core Analytics Row - Charts & Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* SVG Analytics Charts */}
                    <div className="lg:col-span-8 space-y-6">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <GlassCard className="p-5 border border-neutral-900 rounded-2xl space-y-4 text-left">
                          <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">Application Conversion Funnel</span>
                          <div className="h-32 flex items-end justify-between px-2 pt-2 relative">
                            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                              <polygon points="10,20 30,40 50,70 70,85 90,95 90,100 10,100" fill="rgba(139, 92, 246, 0.08)" />
                              <polyline points="10,20 30,40 50,70 70,85 90,95" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />
                              <circle cx="10" cy="20" r="3.5" fill="#8b5cf6" />
                              <circle cx="30" cy="40" r="3.5" fill="#8b5cf6" />
                              <circle cx="50" cy="70" r="3.5" fill="#8b5cf6" />
                              <circle cx="70" cy="85" r="3.5" fill="#8b5cf6" />
                              <circle cx="90" cy="95" r="3.5" fill="#8b5cf6" />
                            </svg>
                            <div className="absolute top-2 left-2 text-[10px] font-bold text-neutral-450 uppercase">Interview Rate: 28%</div>
                            <div className="absolute bottom-2 right-2 text-[10px] font-bold text-neutral-450 uppercase font-black text-emerald-400">Offer Rate: 8.5%</div>
                          </div>
                        </GlassCard>

                        <GlassCard className="p-5 border border-neutral-900 rounded-2xl space-y-4 text-left">
                          <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">ATS Benchmarks & Trend</span>
                          <div className="h-32 flex items-end justify-between px-2 pt-2 relative">
                            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                              <path d="M 0,80 Q 25,60 50,75 T 100,25 L 100,100 L 0,100 Z" fill="rgba(16, 185, 129, 0.05)" />
                              <path d="M 0,80 Q 25,60 50,75 T 100,25" fill="none" stroke="#10b981" strokeWidth="2.5" />
                            </svg>
                            <div className="absolute top-2 left-2 text-[10px] font-bold text-neutral-455 uppercase">Base: 68%</div>
                            <div className="absolute top-2 right-2 text-[10px] font-bold text-emerald-450 uppercase">Target: 92%</div>
                          </div>
                        </GlassCard>
                      </div>

                      {/* Achievements Badges */}
                      <div className="space-y-4">
                        <h2 className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 text-left">Unlocked Career Badges</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                          {[
                            { name: "First Resume", desc: "Initialized builder template", icon: Trophy, unlocked: true },
                            { name: "90 ATS Score", desc: "Audited benchmark safe", icon: ShieldCheck, unlocked: true },
                            { name: "10 Applications", desc: "Added tracker entries", icon: FileCheck, unlocked: false },
                            { name: "Interview Tomorrow", desc: "Schedule matching trigger", icon: Calendar, unlocked: false },
                            { name: "Offer Received", desc: "Complete platform pipeline", icon: Zap, unlocked: false }
                          ].map((badge, idx) => {
                            const Icon = badge.icon;
                            return (
                              <GlassCard key={idx} className={`p-4 border text-center flex flex-col items-center justify-center space-y-2 rounded-2xl transition-all ${badge.unlocked ? 'border-neutral-900 bg-neutral-950/40' : 'border-neutral-950 opacity-40'}`}>
                                <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${badge.unlocked ? colors.bgLight + ' ' + colors.text : 'bg-neutral-900 text-neutral-600'}`}>
                                  <Icon className="h-4.5 w-4.5" />
                                </div>
                                <div>
                                  <h4 className="text-[10px] font-black text-neutral-250 leading-tight">{badge.name}</h4>
                                  <p className="text-[8px] text-neutral-550 font-bold uppercase tracking-wider mt-0.5">{badge.desc}</p>
                                </div>
                              </GlassCard>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    {/* Upcoming Interviews & Activity */}
                    <div className="lg:col-span-4 space-y-6">
                      
                      <div className="space-y-4">
                        <h2 className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 text-left">Upcoming Interviews</h2>
                        <GlassCard className="p-5 text-left rounded-2xl space-y-4 border border-neutral-900">
                          {[
                            { company: 'Stripe', role: 'Staff Frontend Developer', date: 'Jul 15, 10:00 AM', priority: 'High' },
                            { company: 'Vercel', role: 'Developer Relations Engineer', date: 'Jul 18, 02:00 PM', priority: 'Medium' }
                          ].map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start pb-3 border-b border-neutral-900/60 last:pb-0 last:border-b-0">
                              <div>
                                <span className="text-[9px] uppercase tracking-widest font-black text-purple-400">{item.company}</span>
                                <h4 className="text-xs font-semibold text-neutral-200 mt-0.5">{item.role}</h4>
                                <p className="text-[9px] text-neutral-550 font-bold uppercase tracking-wider mt-0.5">{item.date}</p>
                              </div>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${item.priority === 'High' ? 'bg-red-950/40 text-red-400 border border-red-900/40' : 'bg-neutral-900 text-neutral-500'}`}>
                                {item.priority}
                              </span>
                            </div>
                          ))}
                        </GlassCard>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 text-left">Recent Activity</h2>
                        <GlassCard className="p-5 text-left rounded-2xl divide-y divide-neutral-900/60 max-h-[224px] overflow-y-auto border border-neutral-900">
                          {[
                            { text: `${activeResume.personalInfo?.name || 'Alexander Sterling'} resume updated`, time: "10 mins ago", icon: FileCheck, color: colors.text },
                            { text: "AI Cover Letter generated for Vercel", time: "2 hours ago", icon: Sparkles, color: "text-indigo-400" },
                            { text: "ATS Score audited for Senior SDE", time: "1 day ago", icon: ShieldCheck, color: "text-emerald-400" }
                          ].map((act, index) => {
                            const Icon = act.icon;
                            return (
                              <div key={index} className="flex items-start space-x-3 py-3 first:pt-0 last:pb-0 text-xs">
                                <div className="h-6.5 w-6.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mt-0.5 shrink-0">
                                  <Icon className={`h-3 w-3 ${act.color}`} />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-neutral-255 truncate">{act.text}</p>
                                  <span className="text-[8px] text-neutral-600 font-bold uppercase tracking-wider">{act.time}</span>
                                </div>
                              </div>
                            );
                          })}
                        </GlassCard>
                      </div>

                    </div>

                  </div>
                </>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center bg-neutral-950/20 border border-dashed border-neutral-900 rounded-[2rem] p-8">
                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl mb-4 text-neutral-500">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">Analytics Sandbox Locked</h3>
                  <p className="text-[10px] text-neutral-550 uppercase tracking-wider max-w-sm">Create or upload your resume template to enable custom tracking charts, salary growth projections, and unlocked insights.</p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB: MY RESUMES LIBRARY (With Version Control)
              ======================================================== */}
          {activeTab === 'resumes' && (
            <div className="space-y-6 animate-fade-in text-left">
              
              {/* Filter controls row */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl">
                <div className="w-full md:w-80 relative">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
                  <input 
                    type="text" 
                    placeholder="Search resumes..."
                    value={resumeSearch}
                    onChange={(e) => setResumeSearch(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:border-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[9px] uppercase font-black text-neutral-500 tracking-wider">Template:</span>
                    <select
                      value={resumeFilterTemplate}
                      onChange={(e) => setResumeFilterTemplate(e.target.value)}
                      className="bg-neutral-950 border border-neutral-900 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-neutral-300 focus:outline-none"
                    >
                      <option value="all">All Styles</option>
                      <option value="minimal">Minimalist</option>
                      <option value="modern">Modern Professional</option>
                      <option value="creative">Creative Designer</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-[9px] uppercase font-black text-neutral-500 tracking-wider">Sort:</span>
                    <select
                      value={resumeSort}
                      onChange={(e) => setResumeSort(e.target.value as 'updated' | 'title' | 'ats')}
                      className="bg-neutral-950 border border-neutral-900 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-neutral-300 focus:outline-none"
                    >
                      <option value="updated">Last Updated</option>
                      <option value="title">Alphabetical</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={() => setAutoTailorModalOpen(true)}
                    className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-850 hover:border-neutral-750 text-[10px] font-black uppercase text-purple-400 hover:text-purple-300 tracking-wider rounded-lg transition-colors flex items-center space-x-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    <span>Auto-Tailor</span>
                  </button>
                </div>
              </div>

              {/* Auto Tailor Modal Overlay */}
              {autoTailorModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
                  <GlassCard className="w-full max-w-xl p-6 border border-neutral-900 bg-neutral-950 text-white rounded-3xl space-y-4 relative text-left">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                      <span className="text-xs font-black uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                        <Sparkles className="h-4.5 w-4.5" /> AI Resume Auto-Tailoring Suite
                      </span>
                      <button onClick={() => setAutoTailorModalOpen(false)} className="text-neutral-500 hover:text-white"><X className="h-4.5 w-4.5" /></button>
                    </div>
                    
                    {!tailorResult ? (
                      <div className="space-y-4">
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider leading-relaxed">
                          Paste your target Job Description. Our AI engine will optimize summary keywords, reorder matching technical stacks, rewrite experience impact parameters, and maximize ATS score alignment instantly.
                        </p>
                        <div>
                          <label className="text-[9px] uppercase font-black tracking-widest text-neutral-450 block mb-1">Target Job Description</label>
                          <textarea 
                            rows={6}
                            placeholder="Paste requirements, role outline, and qualifications..."
                            value={tailorJobDesc}
                            onChange={(e) => setTailorJobDesc(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-900 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-neutral-850 resize-none font-medium"
                          />
                        </div>
                        <button 
                          onClick={() => {
                            if (!tailorJobDesc.trim()) return;
                            setIsTailoring(true);
                            setTimeout(() => {
                              setIsTailoring(false);
                              setTailorResult({
                                beforeScore: 72,
                                afterScore: 95,
                                keywords: ['Docker', 'AWS Architect', 'Next.js', 'Typescript'],
                                rewrites: 'Restructured summary, prioritized fullstack database sharding references, and incorporated 3 quantifiable metrics.'
                              });
                              toast("Resume optimized successfully!");
                            }, 1500);
                          }}
                          disabled={isTailoring || !tailorJobDesc.trim()}
                          className="w-full py-2.5 bg-white text-black hover:bg-neutral-200 disabled:opacity-40 text-xs font-black uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-1.5"
                        >
                          {isTailoring ? 'Processing Optimization...' : 'Tailor Active Resume (-10 Credits)'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 text-xs text-neutral-350">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-neutral-900/50 border border-neutral-900 rounded-xl text-center">
                            <span className="text-[8px] uppercase tracking-widest text-neutral-500 block mb-1">Before ATS Score</span>
                            <span className="text-xl font-extrabold text-neutral-500">{tailorResult.beforeScore}%</span>
                          </div>
                          <div className="p-4 bg-purple-955/20 border border-purple-500/20 rounded-xl text-center">
                            <span className="text-[8px] uppercase tracking-widest text-purple-400 block mb-1">Optimized ATS Score</span>
                            <span className="text-xl font-extrabold text-white">{tailorResult.afterScore}%</span>
                          </div>
                        </div>
                        <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-xl space-y-1.5">
                          <span className="text-[8px] uppercase tracking-widest font-black text-neutral-400 block">Keywords Synthesized</span>
                          <div className="flex flex-wrap gap-1.5">
                            {tailorResult.keywords.map((k: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 bg-neutral-950 border border-neutral-900 rounded text-[9px] font-bold text-neutral-300">✓ {k}</span>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-xl">
                          <span className="text-[8px] uppercase tracking-widest font-black text-neutral-400 block mb-1">Modifications Overview</span>
                          <p className="leading-relaxed text-neutral-300">{tailorResult.rewrites}</p>
                        </div>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => {
                              setTailorResult(null);
                              setAutoTailorModalOpen(false);
                            }}
                            className="flex-1 py-2 bg-white text-black hover:bg-neutral-200 text-[10px] font-black uppercase rounded-lg transition-colors"
                          >
                            Apply Optimized Changes
                          </button>
                        </div>
                      </div>
                    )}
                  </GlassCard>
                </div>
              )}

              {/* Resumes Library Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {processedResumes.length > 0 ? (
                  processedResumes.map((resume) => (
                    <GlassCard key={resume.id} className="p-5 border border-neutral-900 hover:border-neutral-850 rounded-2xl flex flex-col justify-between min-h-[190px] relative group/resume shadow-lg overflow-hidden transition-all hover:scale-[1.01]">
                      <div className={`absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl ${colors.gradientBar} opacity-10 rounded-bl-[2rem] pointer-events-none`}></div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[8px] font-extrabold uppercase bg-neutral-950 border border-neutral-900 text-neutral-500 px-2 py-0.5 rounded tracking-widest">
                            {resume.style.templateId.toUpperCase()}
                          </span>
                          <div className="flex items-center space-x-1 opacity-0 group-hover/resume:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                const nTitle = prompt("Enter new title for resume:", resume.title);
                                if (nTitle && nTitle.trim()) {
                                  toast("Resume title updated.");
                                }
                              }} 
                              title="Rename"
                              className="p-1 hover:bg-neutral-900 hover:text-white text-neutral-500 rounded transition-colors"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => { duplicateResume(resume.id); toast("Resume template duplicated successfully."); }} 
                              title="Duplicate Version"
                              className="p-1 hover:bg-neutral-900 hover:text-white text-neutral-500 rounded transition-colors"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => { deleteResume(resume.id); toast("Resume version archived.", "error"); }} 
                              title="Archive version"
                              className="p-1 hover:bg-neutral-900 hover:text-red-400 text-neutral-500 rounded transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-black text-neutral-200 tracking-tight leading-tight">{resume.title}</h4>
                          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-1">
                            {resume.personalInfo.jobTitle || 'No target role specified'}
                          </p>
                        </div>
                      </div>

                      {/* Version History Sub-Panel */}
                      <div className="mt-4 pt-3 border-t border-neutral-900/60 space-y-2">
                        <span className="text-[8px] uppercase tracking-widest font-black text-purple-400 block">Version Control &amp; History</span>
                        <div className="space-y-1.5">
                          {[
                            { name: 'v1.1 - Benchmark', date: 'Jul 10', ats: calculatedAtsScore, targetCompany: 'None', targetRole: 'Staff SDE' },
                            { name: 'v1.2 - Vercel Custom', date: 'Jul 12', ats: calculatedAtsScore + 6, targetCompany: 'Vercel', targetRole: 'Senior Full Stack SDE' }
                          ].map((v, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[10px] p-2 bg-neutral-950 border border-neutral-900 rounded-lg text-neutral-350">
                              <div>
                                <span className="font-bold text-white block">{v.name}</span>
                                <span className="text-[7.5px] text-neutral-550 uppercase font-black">{v.targetCompany !== 'None' ? `${v.targetCompany} (${v.targetRole})` : 'Base Copy'} &bull; Edited {v.date}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="bg-purple-950 border border-purple-900/50 text-purple-400 text-[8px] font-bold px-1.5 py-0.5 rounded">{v.ats}% ATS</span>
                                <div className="flex items-center space-x-1">
                                  <button 
                                    onClick={() => toast(`Comparing base and ${v.name} versions...`)} 
                                    title="Compare Versions"
                                    className="p-1 hover:bg-neutral-900 text-neutral-500 hover:text-white rounded"
                                  >
                                    <SlidersHorizontal className="h-3 w-3" />
                                  </button>
                                  <button 
                                    onClick={() => toast(`Restoring ${v.name} version...`)} 
                                    title="Restore Version"
                                    className="p-1 hover:bg-neutral-900 text-neutral-500 hover:text-white rounded"
                                  >
                                    <Zap className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-900/60 mt-4">
                        <span className="text-[8px] text-neutral-550 font-bold uppercase tracking-widest">
                          Updated {new Date(resume.updatedAt).toLocaleDateString()}
                        </span>
                        <button 
                          onClick={() => handleEditResume(resume.id)}
                          className={`px-4 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-colors`}
                        >
                          Modify Layout
                        </button>
                      </div>
                    </GlassCard>
                  ))
                ) : (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-neutral-950/20 border border-dashed border-neutral-900 rounded-[2rem] p-8">
                    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl mb-4 text-neutral-500">
                      <FileText className="h-8 w-8" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">No Resumes Found</h3>
                    <p className="text-[10px] text-neutral-550 uppercase tracking-wider max-w-sm mb-6">Create your first AI Resume version to begin auditing.</p>
                    <button 
                      onClick={handleCreateNewResume}
                      className="px-6 py-3 bg-white text-black hover:bg-neutral-200 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-white/5"
                    >
                      Create First Resume
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================
              TAB: COVER LETTERS VIEW
              ======================================================== */}
          {activeTab === 'letters' && (
            <div className="space-y-6 animate-fade-in text-left">
              
              <div className="flex justify-between items-center bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl">
                <div className="w-80 relative">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
                  <input 
                    type="text" 
                    placeholder="Search cover letters..."
                    value={letterSearch}
                    onChange={(e) => setLetterSearch(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:border-white focus:outline-none transition-colors"
                  />
                </div>
                
                {/* AI LinkedIn Optimizer button */}
                <button 
                  onClick={() => {
                    setIsOptimizingLinkedin(true);
                    setTimeout(() => {
                      setIsOptimizingLinkedin(false);
                      setLinkedinOptimized({
                        headline: 'Senior Full Stack Engineer | Next.js Architect | ex-Vercel',
                        about: 'Results-driven engineer specializing in building high-performance serverless React dashboards, Node.js GraphQL endpoints, and database sharding optimization.',
                        skills: 'Next.js, AWS Cloud, Redis Caching, Technical Project Leadership'
                      });
                      toast("LinkedIn profile audited & optimized successfully.");
                    }, 1000);
                  }}
                  disabled={isOptimizingLinkedin}
                  className="px-4 py-2 bg-neutral-900 border border-neutral-850 hover:border-neutral-750 text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 tracking-wider rounded-lg transition-colors flex items-center space-x-1.5"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>{isOptimizingLinkedin ? 'Optimizing...' : 'Optimize LinkedIn Profile'}</span>
                </button>
              </div>

              {/* LinkedIn Optimization output if active */}
              {linkedinOptimized && (
                <GlassCard className="p-5 border border-indigo-500/20 bg-indigo-955/5 rounded-2xl space-y-4 animate-slide-up">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                    <span className="text-[9px] uppercase tracking-widest font-black text-indigo-400 flex items-center gap-1.5">
                      <Globe className="h-4 w-4 text-indigo-400" /> AI LinkedIn Profile Optimizer Suggestions
                    </span>
                    <button onClick={() => setLinkedinOptimized(null)} className="text-neutral-500 hover:text-white"><X className="h-4.5 w-4.5" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-xl space-y-1.5">
                      <span className="text-[8px] uppercase tracking-widest font-black text-neutral-550 block">Headline Rewrite</span>
                      <p className="text-neutral-200 font-semibold leading-relaxed">{linkedinOptimized.headline}</p>
                    </div>
                    <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-xl space-y-1.5">
                      <span className="text-[8px] uppercase tracking-widest font-black text-neutral-550 block">About / Summary</span>
                      <p className="text-neutral-350 leading-relaxed">{linkedinOptimized.about}</p>
                    </div>
                    <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-xl space-y-1.5">
                      <span className="text-[8px] uppercase tracking-widest font-black text-neutral-550 block">Skills Priority</span>
                      <p className="text-neutral-200 font-medium leading-relaxed">{linkedinOptimized.skills}</p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Cover Letters list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coverLetters.filter(l => l.title.toLowerCase().includes(letterSearch.toLowerCase())).length > 0 ? (
                  coverLetters.filter(l => l.title.toLowerCase().includes(letterSearch.toLowerCase())).map((letter) => (
                    <GlassCard key={letter.id} className="p-5 border border-neutral-900 rounded-2xl flex flex-col justify-between min-h-[170px] relative group/letter shadow-lg transition-all hover:scale-[1.01]">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[8px] font-black uppercase text-indigo-400 tracking-widest">
                            Scored Letter
                          </span>
                          <button 
                            onClick={() => { deleteCoverLetter(letter.id); toast("Cover letter deleted.", "error"); }}
                            className="opacity-0 group-hover/letter:opacity-100 transition-opacity text-neutral-500 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-neutral-200 truncate leading-tight">{letter.title}</h4>
                          <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mt-1 truncate">
                            For {letter.companyName || 'Not Specified'} | Recipient: {letter.recipientTitle || 'Not Specified'}
                          </p>
                        </div>
                      </div>

                      {/* Recruiter view & networking outreach assistant */}
                      <div className="mt-4 pt-3 border-t border-neutral-900/60 flex items-center justify-between">
                        <button 
                          onClick={() => {
                            toast("Generated Recruiter outreach template, referral email request, and LinkedIn connection notes.");
                          }}
                          className="text-[9px] font-black uppercase tracking-wider text-indigo-400 hover:text-indigo-300"
                        >
                          Outreach Assistant
                        </button>
                        <button 
                          onClick={() => handleEditCoverLetter(letter.id)}
                          className="px-4 py-2 bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-[9px] font-black uppercase tracking-wider text-white rounded-lg transition-colors"
                        >
                          Open Editor
                        </button>
                      </div>
                    </GlassCard>
                  ))
                ) : (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-neutral-950/20 border border-dashed border-neutral-900 rounded-[2rem] p-8">
                    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl mb-4 text-neutral-500">
                      <Sparkles className="h-8 w-8" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">No Cover Letters</h3>
                    <p className="text-[10px] text-neutral-550 uppercase tracking-wider max-w-sm mb-6">Generate your first AI Cover Letter project to begin matching recruiter parameters.</p>
                    <button 
                      onClick={handleCreateNewCoverLetter}
                      className="px-6 py-3 bg-white text-black hover:bg-neutral-200 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-white/5"
                    >
                      Generate Cover Letter
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================
              TAB: AI RESUME TAILORING
              ======================================================== */}
          {activeTab === 'tailor' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                  
                  {/* Left Column: Editor & Controls */}
                  <div className="lg:col-span-7 space-y-6">
                    <GlassCard className="p-6 border border-neutral-900 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                        <span className="text-xs font-black uppercase tracking-wider text-purple-400">Step 1: Paste &amp; Analyze</span>
                        <span className="text-[10px] text-neutral-500 font-bold uppercase">ATS Optimized Mode</span>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase font-black text-neutral-450 tracking-wider block">Job Description</label>
                        <textarea
                          value={atsJobDescription}
                          onChange={(e) => setAtsJobDescription(e.target.value)}
                          className="w-full h-40 bg-neutral-950 border border-neutral-900 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-purple-900/50 resize-none font-semibold"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          toast("AI keyword generator: tailoring experience bullets...", "info");
                          setTimeout(() => {
                            toast("Resume tailored! ATS score increased by 14%. View diagnostics block.", "success");
                          }, 1000);
                        }}
                        className="w-full py-3 bg-gradient-to-r from-purple-650 to-indigo-650 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-purple-500/20 flex items-center justify-center space-x-2"
                      >
                        <Zap className="h-4 w-4 animate-pulse" />
                        <span>Tailor Resume with AI (-15 Credits)</span>
                      </button>
                    </GlassCard>

                    {/* Diagnostics Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <GlassCard className="p-5 border border-neutral-900 rounded-2xl">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">ATS BEFORE</span>
                        <h4 className="text-3xl font-black text-white mt-2">{calculatedAtsScore}%</h4>
                      </GlassCard>
                      <GlassCard className="p-5 border border-neutral-900 rounded-2xl bg-emerald-955/5 border-emerald-900/20">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-500">ATS AFTER</span>
                        <h4 className="text-3xl font-black text-emerald-400 mt-2">{calculatedAtsScore + 14}%</h4>
                      </GlassCard>
                    </div>

                    {/* Changes &amp; Audit list */}
                    <GlassCard className="p-6 border border-neutral-900 rounded-2xl space-y-4">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block pb-2 border-b border-neutral-900">Rewritten Bullets &amp; Summary</span>
                      <div className="space-y-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[8px] uppercase tracking-widest font-black text-purple-400">Rewritten Summary</span>
                          <p className="bg-neutral-950 border border-neutral-900 p-3 rounded-xl text-neutral-300 font-semibold leading-relaxed">
                            &quot;Results-oriented staff developer with 5+ years of experience optimizing modern web stacks, deploying cloud integrations with Docker &amp; AWS, and coordinating DevOps automation to scale web products.&quot;
                          </p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[8px] uppercase tracking-widest font-black text-purple-400">Bullet Points Improved</span>
                          <div className="space-y-2 text-[11px] leading-relaxed">
                            <div className="p-2.5 bg-red-955/5 border border-red-900/20 rounded-xl text-neutral-450">
                              <span className="text-red-400 font-bold block mb-1">Original:</span>
                              &quot;Responsible for managing SDE deployments and pipelines.&quot;
                            </div>
                            <div className="p-2.5 bg-emerald-955/5 border border-emerald-900/20 rounded-xl text-neutral-250 font-semibold">
                              <span className="text-emerald-400 font-bold block mb-1">Tailored:</span>
                              &quot;Architected CI/CD pipelines deploying Docker containers to AWS EKS, boosting shipping frequency by 32%.&quot;
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div>
                            <span className="text-[8px] uppercase tracking-widest font-black text-neutral-500">Keywords Added</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {['Docker', 'AWS EKS', 'CI/CD Pipelines'].map((kw, i) => (
                                <span key={i} className="text-[9px] font-bold px-1.5 py-0.5 bg-neutral-900 border border-neutral-850 rounded text-neutral-400">{kw}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-[8px] uppercase tracking-widest font-black text-neutral-500">Skills Injected</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {['Terraform', 'OpenTelemetry'].map((sk, i) => (
                                <span key={i} className="text-[9px] font-bold px-1.5 py-0.5 bg-neutral-900 border border-neutral-850 rounded text-neutral-400">{sk}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>

                  {/* Right Column: Interactive Side-by-Side Preview */}
                  <div className="lg:col-span-5 space-y-6">
                    <GlassCard className="p-6 border border-neutral-900 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                        <span className="text-xs font-black uppercase tracking-wider text-white">Resume Preview</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-neutral-900 border border-neutral-850 rounded text-emerald-450">Tailored Preview</span>
                      </div>
                      <div className="bg-neutral-950 border border-neutral-900 p-5 rounded-2xl min-h-[400px] text-xs font-serif space-y-4 shadow-inner relative overflow-hidden">
                        <div className="text-center space-y-1">
                          <h4 className="text-base font-black text-white">{activeResume.personalInfo?.name || 'Your Full Name'}</h4>
                          <p className="text-[9px] font-sans text-neutral-550 uppercase tracking-widest">{activeResume.personalInfo?.email || 'email@example.com'} &bull; {activeResume.personalInfo?.phone || '(123) 456-7890'}</p>
                        </div>
                        <div className="space-y-1 pt-2 border-t border-neutral-900">
                          <h5 className="text-[9.5px] uppercase font-sans tracking-widest text-neutral-400 font-black">Professional Summary</h5>
                          <p className="text-neutral-300 font-semibold leading-relaxed">
                            &quot;Results-oriented staff developer with 5+ years of experience optimizing modern web stacks, deploying cloud integrations with Docker &amp; AWS, and coordinating DevOps automation to scale web products.&quot;
                          </p>
                        </div>
                        <div className="space-y-2 pt-2 border-t border-neutral-900">
                          <h5 className="text-[9.5px] uppercase font-sans tracking-widest text-neutral-400 font-black">Work Experience</h5>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between items-baseline text-[9.5px] font-sans font-bold text-white">
                                <span>Senior Software Engineer</span>
                                <span className="text-neutral-500">2023 - Present</span>
                              </div>
                              <p className="text-neutral-350 leading-relaxed mt-1 font-semibold">&bull; Architected CI/CD pipelines deploying Docker containers to AWS EKS, boosting shipping frequency by 32%.</p>
                              <p className="text-neutral-350 leading-relaxed mt-0.5 font-semibold">&bull; Orchestrated Terraform modules to manage state configurations in multi-region environments.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <button 
                          onClick={() => {
                            toast("Tailored configurations successfully synced to main document!", "success");
                          }}
                          className="py-2.5 bg-white text-black hover:bg-neutral-250 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors"
                        >
                          Apply Changes
                        </button>
                        <button 
                          onClick={() => {
                            toast("Tailored resume PDF generated for download.");
                          }}
                          className="py-2.5 bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 text-neutral-400 hover:text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors"
                        >
                          Download PDF
                        </button>
                      </div>
                    </GlassCard>
                  </div>

                </div>
            </div>
          )}

          {/* ========================================================
              TAB: RESUME HEALTH DIAGNOSTICS
              ======================================================== */}
          {activeTab === 'health' && (
            <div className="space-y-6 animate-fade-in text-left">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left diagnostic dials */}
                <div className="lg:col-span-4 space-y-6">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Resume Health Overview</h3>
                  <GlassCard className="p-6 flex flex-col items-center justify-center text-center border border-neutral-900 rounded-2xl">
                    <span className="text-[9px] uppercase font-black tracking-widest text-neutral-500 mb-2">Overall Health Index</span>
                    <div className="relative h-28 w-28 flex items-center justify-center">
                      <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-neutral-900" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-purple-550" strokeDasharray="88, 100" strokeWidth="2.8" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="text-3xl font-black text-white">88%</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-neutral-900 w-full text-[9px] uppercase font-black text-purple-400 tracking-wider">
                      Grade: Strong Competitor
                    </div>
                  </GlassCard>

                  <div className="p-4 bg-purple-955/10 border border-purple-500/20 rounded-2xl space-y-2 text-xs">
                    <span className="text-[8px] uppercase tracking-widest font-black text-purple-400 block">AI Suggestions</span>
                    <p className="text-neutral-300 leading-relaxed">Your resume possesses excellent structural formatting and contains safe web fonts. Add numerical results to past roles to boost readability past 90%.</p>
                  </div>
                </div>

                {/* Right score elements */}
                <div className="lg:col-span-8 space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Diagnostic Scopes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'ATS Score Compatibility', val: 85, desc: 'Keyword matching index' },
                      { label: 'Grammar & Tone Compliance', val: 92, desc: 'Zero typos and concise style' },
                      { label: 'Formatting Density Checks', val: 98, desc: 'Margins and parse safe grids' },
                      { label: 'Readability & Complexity', val: 80, desc: 'Sentence length and vocabulary' },
                      { label: 'Keyword Match Density', val: 74, desc: '8 omitted tech keywords' },
                      { label: 'Action Verb Dominance', val: 90, desc: 'Active lead words utilized' }
                    ].map((item, idx) => (
                      <GlassCard key={idx} className="p-5 border border-neutral-900 rounded-2xl flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider block">{item.label}</span>
                          <span className="text-[8px] text-neutral-550 block mt-0.5">{item.desc}</span>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xl font-black text-white">{item.val}%</span>
                          <div className="w-32 bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-900">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${item.val}%` }}></div>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================
              TAB: RECRUITER MODE SCAN
              ======================================================== */}
          {activeTab === 'recruiter' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                  
                  {/* Left Column: Eye-Tracking Heatmap visualizer */}
                  <div className="lg:col-span-8 space-y-6">
                    <GlassCard className="p-6 border border-neutral-900 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4.5 w-4.5 text-purple-400" />
                          <span className="text-xs font-black uppercase tracking-wider text-white">6-Second Recruiter Eye-Scan Heatmap</span>
                        </div>
                        <button 
                          onClick={() => {
                            setRecruiterScanning(true);
                            setRecruiterSecondsLeft(6);
                            const timer = setInterval(() => {
                              setRecruiterSecondsLeft(prev => {
                                if (prev <= 1) {
                                  clearInterval(timer);
                                  setRecruiterScanning(false);
                                  setRecruiterHeatmap(true);
                                  toast("Visual scan complete! Heatmap generated.", "success");
                                  return 0;
                                }
                                return prev - 1;
                              });
                            }, 500);
                          }}
                          disabled={recruiterScanning}
                          className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-black uppercase tracking-wider text-neutral-350 hover:text-white rounded-lg transition-colors"
                        >
                          {recruiterScanning ? `Scanning (${recruiterSecondsLeft}s)` : 'Run Simulated Scan'}
                        </button>
                      </div>

                      {/* Mock Resume Sheet with overlay heatmap grids */}
                      <div className="bg-neutral-950 border border-neutral-900 p-8 rounded-2xl font-serif text-xs leading-relaxed space-y-6 shadow-inner relative overflow-hidden">
                        
                        {/* Interactive heat-blobs if generated */}
                        {(recruiterHeatmap || recruiterScanning) && (
                          <div className="absolute inset-0 pointer-events-none z-10">
                            {/* Hot blobs */}
                            <div className="absolute top-[10%] left-[20%] w-48 h-20 bg-red-500/25 rounded-full blur-[35px] animate-pulse"></div>
                            <div className="absolute top-[40%] left-[10%] w-56 h-24 bg-orange-500/20 rounded-full blur-[40px]"></div>
                            <div className="absolute top-[65%] left-[30%] w-40 h-16 bg-yellow-500/15 rounded-full blur-[30px]"></div>
                            
                            {/* Scanning line if in progress */}
                            {recruiterScanning && (
                              <div className="absolute left-0 right-0 h-0.5 bg-purple-500/60 shadow-lg shadow-purple-500 blur-[1px] animate-scan-line"></div>
                            )}
                          </div>
                        )}

                        <div className="text-center space-y-1">
                          <h4 className="text-lg font-black text-white">{activeResume.personalInfo?.name || 'Your Name'}</h4>
                          <p className="text-[9px] font-sans text-neutral-550 uppercase tracking-widest">{activeResume.personalInfo?.email || 'Email Address'} &bull; {activeResume.personalInfo?.phone || 'Phone Number'}</p>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-neutral-900 relative">
                          <h5 className="text-[9.5px] uppercase font-sans tracking-widest text-neutral-400 font-black">Summary</h5>
                          <p className="text-neutral-300 font-semibold">
                            Experienced <span className="bg-emerald-950 border border-emerald-900 text-emerald-400 px-1 py-0.5 rounded font-sans text-[9px] font-bold">Staff SDE</span> with background deploying Docker, React, and WebSockets.
                          </p>
                        </div>

                        <div className="space-y-3 pt-2 border-t border-neutral-900">
                          <h5 className="text-[9.5px] uppercase font-sans tracking-widest text-neutral-400 font-black">Experience</h5>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between items-baseline text-[9.5px] font-sans font-bold text-white">
                                <span>Lead Software Engineer &mdash; Vercel</span>
                                <span className="text-neutral-500">2023 - Present</span>
                              </div>
                              <p className="text-neutral-350 leading-normal mt-1 font-semibold">&bull; Architected serverless deployments on Vercel platforms, reducing cold starts by 42%.</p>
                            </div>
                            <div>
                              <div className="flex justify-between items-baseline text-[9.5px] font-sans font-bold text-white">
                                <span>Software Engineer &mdash; Stripe</span>
                                <span className="text-neutral-500">2020 - 2023</span>
                              </div>
                              <p className="text-neutral-350 leading-normal mt-1 font-semibold">&bull; Shipped merchant dashboards utilizing React, GraphQL, and micro-frontend structures.</p>
                            </div>
                          </div>
                        </div>

                        {/* Ignored section */}
                        <div className="space-y-1.5 pt-2 border-t border-neutral-900 border-dashed relative">
                          <h5 className="text-[9.5px] uppercase font-sans tracking-widest text-neutral-450 font-black">Hobbies &amp; Interests</h5>
                          <p className="text-neutral-500 leading-normal font-semibold bg-red-955/5 border border-dashed border-red-900/10 p-2 rounded-xl">
                            Skiing, specialty coffee brewing, and volunteering at community tech accelerators.
                          </p>
                          <span className="absolute right-2 top-2 bg-red-950/60 border border-red-900/40 text-red-400 text-[7px] font-bold px-1.5 py-0.5 rounded uppercase">Recruiter Ignored</span>
                        </div>
                      </div>
                    </GlassCard>
                  </div>

                  {/* Right Column: Scan Statistics */}
                  <div className="lg:col-span-4 space-y-6">
                    <GlassCard className="p-5 border border-neutral-900 rounded-2xl text-left space-y-4">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 block pb-2 border-b border-neutral-900">Scan Diagnostics</span>
                      
                      <div className="space-y-4">
                        <div>
                          <span className="text-[9px] uppercase tracking-widest font-black text-neutral-550 block">Overall Recruiter Score</span>
                          <div className="flex items-baseline mt-1 space-x-1">
                            <span className="text-3xl font-black text-white">82</span>
                            <span className="text-xs text-neutral-500">/100</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-450 px-1.5 py-0.5 bg-emerald-950/20 rounded ml-2">Above Average</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] uppercase tracking-widest font-black text-neutral-555 block">Estimated Reading Time</span>
                          <h4 className="text-xs font-black text-neutral-250 mt-0.5 uppercase tracking-wide">12 Seconds (6s Scan Optimization Active)</h4>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase tracking-widest font-black text-red-400 block">Length Issues</span>
                          <p className="text-[10px] text-neutral-350 leading-relaxed font-semibold">
                            ⚠️ Page 1 occupies 510 words. Single page formatting limit respected, but summary density is high.
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase tracking-widest font-black text-emerald-450 block">Strong Areas</span>
                          <div className="space-y-1 text-[10px] text-neutral-350 leading-relaxed font-semibold">
                            <p className="flex items-center gap-1">✓ Quantifiable metrics (42% cold start decrease)</p>
                            <p className="flex items-center gap-1">✓ Premium layout consistency</p>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase tracking-widest font-black text-amber-450 block">Weak Areas</span>
                          <div className="space-y-1 text-[10px] text-neutral-350 leading-relaxed font-semibold">
                            <p className="flex items-center gap-1">✗ Missing Redis/Kubernetes keywords</p>
                            <p className="flex items-center gap-1">✗ Contact details alignment could be centered</p>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase tracking-widest font-black text-neutral-550 block">Formatting Problems</span>
                          <div className="space-y-1 text-[10px] leading-relaxed font-semibold">
                            <p className="text-amber-450">&bull; Profile links occupy too much header space.</p>
                            <p className="text-emerald-450">&bull; Section hierarchy conforms to standard single-column templates.</p>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>

                </div>
            </div>
          )}

          {/* ========================================================
              TAB: APPLICATION KANBAN TRACKER
              ======================================================== */}
          {activeTab === 'tracker' && (
            <div className="space-y-6 select-none">
              
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Applications Pipeline Tracker</h3>
                <button 
                  onClick={() => setIsNewJobModalOpen(true)}
                  className="px-4 py-2.5 bg-white text-black hover:bg-neutral-200 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors flex items-center space-x-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Application</span>
                </button>
              </div>

              {/* Kanban board */}
              <div className="flex gap-4 items-start overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-neutral-900 scrollbar-track-transparent">
                {(['wishlist', 'applied', 'hr-round', 'technical', 'assessment', 'manager-round', 'offer', 'accepted', 'rejected'] as const).map((columnStatus) => {
                  const columnJobs = trackedJobs.filter(j => j.status === columnStatus);
                  return (
                    <div 
                      key={columnStatus}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, columnStatus)}
                      className="flex-1 min-w-[200px] bg-neutral-950/60 border border-neutral-900 rounded-2xl p-3.5 space-y-3 min-h-[400px] transition-colors hover:bg-neutral-950"
                    >
                      {/* Column Header */}
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                        <span className="text-[9px] uppercase font-black tracking-widest text-neutral-400">
                          {columnStatus}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-neutral-900 border border-neutral-850 rounded text-neutral-455">
                          {columnJobs.length}
                        </span>
                      </div>

                      {/* Cards list */}
                      <div className="space-y-3">
                        {columnJobs.map((job) => (
                          <div 
                            key={job.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, job.id)}
                            className="p-3 bg-neutral-900 border border-neutral-850 hover:border-neutral-750 rounded-xl space-y-2.5 cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02] shadow-lg relative group/card"
                          >
                            <div className="flex justify-between items-start">
                              <div className="h-6 w-6 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-center font-bold text-[10px] text-neutral-450">
                                {job.company[0]}
                              </div>
                              <button 
                                onClick={() => handleDeleteJob(job.id)}
                                className="opacity-0 group-hover/card:opacity-100 transition-opacity p-0.5 text-neutral-500 hover:text-red-400 rounded"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>

                            <div>
                              <h4 className="text-[11px] font-extrabold text-neutral-200 truncate leading-tight">{job.title}</h4>
                              <span className="text-[9px] text-neutral-550 font-bold uppercase tracking-wider mt-0.5 block">{job.company}</span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-neutral-850/60 text-[8px] font-bold text-neutral-500 uppercase tracking-wider">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-2.5 w-2.5" />
                                <span>{job.location}</span>
                              </div>
                              <span className={
                                job.priority === 'high' ? 'text-red-400' : 'text-neutral-455'
                              }>{job.priority}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ========================================================
              TAB: AI JOB MATCHING
              ======================================================== */}
          {activeTab === 'matching' && (
            <div className="space-y-6 animate-fade-in text-left">
              
              {/* Filters Block */}
              <GlassCard className="p-4 border border-neutral-900 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center">
                  <div>
                    <label className="text-[8px] uppercase font-black text-neutral-450 tracking-wider block mb-1">Remote Type</label>
                    <select
                      value={matchFilterRemote}
                      onChange={(e) => setMatchFilterRemote(e.target.value)}
                      className="bg-neutral-950 border border-neutral-900 rounded-lg px-2.5 py-1.5 text-[10px] text-white focus:outline-none focus:border-neutral-850"
                    >
                      <option value="all">All Modes</option>
                      <option value="Remote">Remote Only</option>
                      <option value="Hybrid">Hybrid Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[8px] uppercase font-black text-neutral-450 tracking-wider block mb-1">Min Salary</label>
                    <select
                      value={matchFilterSalary}
                      onChange={(e) => setMatchFilterSalary(e.target.value)}
                      className="bg-neutral-950 border border-neutral-900 rounded-lg px-2.5 py-1.5 text-[10px] text-white focus:outline-none focus:border-neutral-850"
                    >
                      <option value="all">All Salaries</option>
                      <option value="120k">&gt; $120k</option>
                      <option value="140k">&gt; $140k</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[8px] uppercase font-black text-neutral-450 tracking-wider block mb-1">Location</label>
                    <select
                      value={matchFilterLocation}
                      onChange={(e) => setMatchFilterLocation(e.target.value)}
                      className="bg-neutral-950 border border-neutral-900 rounded-lg px-2.5 py-1.5 text-[10px] text-white focus:outline-none focus:border-neutral-850"
                    >
                      <option value="all">All Cities</option>
                      <option value="New York, NY">New York, NY</option>
                      <option value="San Francisco, CA">San Francisco, CA</option>
                      <option value="Remote, US">Remote, US</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[8px] uppercase font-black text-neutral-450 tracking-wider block mb-1">Experience Required</label>
                    <select
                      value={matchFilterExperience}
                      onChange={(e) => setMatchFilterExperience(e.target.value)}
                      className="bg-neutral-950 border border-neutral-900 rounded-lg px-2.5 py-1.5 text-[10px] text-white focus:outline-none focus:border-neutral-850"
                    >
                      <option value="all">All Levels</option>
                      <option value="3+ years">3+ years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[8px] uppercase font-black text-neutral-450 tracking-wider block mb-1">Company Size</label>
                    <select
                      value={matchFilterCompanySize}
                      onChange={(e) => setMatchFilterCompanySize(e.target.value)}
                      className="bg-neutral-950 border border-neutral-900 rounded-lg px-2.5 py-1.5 text-[10px] text-white focus:outline-none focus:border-neutral-850"
                    >
                      <option value="all">All Sizes</option>
                      <option value="Small">Small (Linear)</option>
                      <option value="Medium">Medium (Vercel)</option>
                      <option value="Large">Large (Stripe)</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setMatchFilterRemote('all');
                    setMatchFilterSalary('all');
                    setMatchFilterLocation('all');
                    setMatchFilterExperience('all');
                    setMatchFilterCompanySize('all');
                    toast("Filters reset successfully.");
                  }}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[9px] font-black uppercase text-neutral-350 hover:text-white rounded-lg transition-colors font-semibold"
                >
                  Clear Filters
                </button>
              </GlassCard>

              {/* Opportunities list */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">AI Matched Opportunities</h3>
                
                <div className="space-y-4">
                  {mockMatches
                    .filter(m => {
                      if (matchFilterRemote !== 'all' && m.remoteType !== matchFilterRemote) return false;
                      if (matchFilterSalary !== 'all') {
                        if (matchFilterSalary === '120k' && !m.salary.includes('120') && !m.salary.includes('130') && !m.salary.includes('140') && !m.salary.includes('175')) return false;
                        if (matchFilterSalary === '140k' && !m.salary.includes('140') && !m.salary.includes('175')) return false;
                      }
                      if (matchFilterLocation !== 'all' && m.location !== matchFilterLocation) return false;
                      if (matchFilterExperience !== 'all' && m.experience !== matchFilterExperience) return false;
                      if (matchFilterCompanySize !== 'all' && m.companySize !== matchFilterCompanySize) return false;
                      return true;
                    })
                    .map((match) => (
                      <GlassCard key={match.id} className="p-6 border border-neutral-900 hover:border-neutral-850 transition-all duration-300 text-left rounded-2xl flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${colors.gradientBar}`}></div>

                        <div className="space-y-4 flex-1">
                          <div className="flex items-center space-x-3.5">
                            <div className="h-10 w-10 rounded-xl bg-neutral-950 border border-neutral-900 flex items-center justify-center font-black text-sm text-purple-400">
                              {match.logo}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-extrabold text-sm text-neutral-100 uppercase tracking-wide leading-tight">{match.title}</h4>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${match.pct >= 90 ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' : 'bg-purple-950/40 text-purple-400 border border-purple-900/40'}`}>
                                  {match.pct}% Match
                                </span>
                              </div>
                              <span className="text-[10px] text-neutral-555 uppercase tracking-widest font-bold mt-0.5 block">{match.company} &bull; {match.location}</span>
                            </div>
                          </div>

                          {/* Meta Badges */}
                          <div className="flex flex-wrap gap-2 text-[9px] font-bold uppercase text-neutral-450 tracking-wider">
                            <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-850 rounded">{match.salary}</span>
                            <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-850 rounded">{match.remoteType}</span>
                            <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-850 rounded">{match.experience}</span>
                            <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-850 rounded">{match.companySize} Size</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1.5">
                              <span className="text-[9px] uppercase font-black text-emerald-400 tracking-wider block">Matched Skills</span>
                              <div className="flex flex-wrap gap-1">
                                {match.skillsMatched.map((s, i) => (
                                  <span key={i} className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-950 border border-neutral-900 text-emerald-450 rounded">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <span className="text-[9px] uppercase font-black text-red-400 tracking-wider block">Missing Skills</span>
                              <div className="flex flex-wrap gap-1">
                                {match.skillsMissing.map((s, i) => (
                                  <span key={i} className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-950 border border-neutral-900 text-red-450 rounded">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* AI Recommendation details */}
                          <div className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl space-y-1">
                            <span className={`text-[9px] uppercase font-black ${colors.text} tracking-wider flex items-center gap-1`}>
                              <Zap className="h-3 w-3 animate-bounce" /> AI recommendation
                            </span>
                            <p className="text-[11px] text-neutral-350 leading-relaxed font-semibold">{match.aiRecommendation}</p>
                          </div>
                        </div>

                        {/* Actions column */}
                        <div className="flex flex-col gap-2 shrink-0 md:justify-center">
                          <button 
                            onClick={() => {
                              toast("AI is rewriting experience statements to feature target skills...", "info");
                              setTimeout(() => {
                                toast("Resume tailored for " + match.company + "! ATS score set to 94%.", "success");
                              }, 1000);
                            }}
                            className="px-6 py-2.5 bg-white text-black hover:bg-neutral-250 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all"
                          >
                            Improve Resume
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedResearchCompany(match.company);
                              toast("Running real-time company intelligence report...", "info");
                            }}
                            className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-black uppercase tracking-wider text-white rounded-lg transition-colors"
                          >
                            View Details
                          </button>
                          <button 
                            onClick={() => {
                              toast("Opening extern link to target application portal.");
                            }}
                            className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-black uppercase tracking-wider text-neutral-450 hover:text-white rounded-lg transition-colors"
                          >
                            Apply
                          </button>
                          <button 
                            onClick={() => {
                              toast("Saved opportunity to pipeline wish list.");
                            }}
                            className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-black uppercase tracking-wider text-neutral-450 hover:text-white rounded-lg transition-colors"
                          >
                            Save Job
                          </button>
                        </div>

                      </GlassCard>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: AI SKILL GAP ANALYSIS
              ======================================================== */}
          {activeTab === 'gap' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Compare Requirements</h3>
                  <GlassCard className="p-5 space-y-4 border border-neutral-900 rounded-2xl">
                    <div>
                      <label className="text-[9px] uppercase font-black tracking-widest text-neutral-450 block mb-1">Target Role Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Next.js Developer"
                        className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-850"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-black tracking-widest text-neutral-455 block mb-1">Job Description Requirements</label>
                      <textarea 
                        rows={6}
                        placeholder="Paste target description to compare Technical stacks..."
                        value={tailorJobDesc}
                        onChange={(e) => setTailorJobDesc(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-900 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-neutral-850 resize-none font-semibold"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        setIsGapAnalyzing(true);
                        setTimeout(() => {
                          setIsGapAnalyzing(false);
                          setGapResults({
                            matched: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
                            missing: ['Docker', 'AWS Architect', 'Kubernetes', 'Redis'],
                            recommendedSkills: ['WebSockets', 'GraphQL Federation', 'CI/CD Automation'],
                            certifications: [
                              { title: 'Docker and Kubernetes Mastery', provider: 'Udemy' },
                              { title: 'AWS Solutions Architect Associate', provider: 'Coursera' }
                            ],
                            courses: [
                              'Advanced Next.js Architecture (Frontend Masters)',
                              'Production-grade Kubernetes (Linux Foundation)'
                            ],
                            estimatedLearningTime: '45 Hours total self-paced study',
                            salaryIncrease: '+$28,000 / year projected headroom lift'
                          });
                          toast("Skill gap audit completed.");
                        }, 1000);
                      }}
                      className="w-full py-2.5 bg-white text-black hover:bg-neutral-255 text-xs font-black uppercase rounded-lg transition-colors"
                    >
                      {isGapAnalyzing ? 'Auditing Skills...' : 'Run Skill Gap Audit'}
                    </button>
                  </GlassCard>
                </div>

                <div className="lg:col-span-7">
                  {gapResults ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-left">
                        <GlassCard className="p-5 border border-neutral-900 rounded-xl space-y-3">
                          <span className="text-[9px] uppercase font-black text-neutral-500 tracking-widest">Matched Skills Found</span>
                          <div className="flex flex-wrap gap-1.5">
                            {gapResults.matched.map((s: string, i: number) => (
                              <span key={i} className="px-2.5 py-1 bg-neutral-950 border border-neutral-900 rounded text-[9.5px] font-bold text-neutral-300">✓ {s}</span>
                            ))}
                          </div>
                        </GlassCard>

                        <GlassCard className="p-5 border border-neutral-900 rounded-xl space-y-3">
                          <span className="text-[9px] uppercase font-black text-neutral-500 tracking-widest text-red-400">Missing Core Skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            {gapResults.missing.map((s: string, i: number) => (
                              <span key={i} className="px-2.5 py-1 bg-neutral-950 border border-red-955/20 rounded text-[9.5px] font-bold text-red-400">✗ {s}</span>
                            ))}
                          </div>
                        </GlassCard>
                      </div>

                      {/* Recommended Skills */}
                      <GlassCard className="p-5 border border-neutral-900 rounded-xl text-left space-y-3">
                        <span className="text-[9px] uppercase font-black text-neutral-500 tracking-widest">Recommended Secondary Skills</span>
                        <div className="flex flex-wrap gap-1.5">
                          {gapResults.recommendedSkills.map((s: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 bg-neutral-950 border border-purple-950 rounded text-[9.5px] font-bold text-purple-400">⚡ {s}</span>
                          ))}
                        </div>
                      </GlassCard>

                      {/* Learning Time & Salary Potential */}
                      <div className="grid grid-cols-2 gap-4 text-left">
                        <GlassCard className="p-5 border border-neutral-900 rounded-xl space-y-1">
                          <span className="text-[9px] uppercase font-black text-neutral-500 tracking-widest block">Estimated study Time</span>
                          <span className="text-base font-extrabold text-white block">{gapResults.estimatedLearningTime}</span>
                        </GlassCard>
                        <GlassCard className="p-5 border border-neutral-900 rounded-xl space-y-1">
                          <span className="text-[9px] uppercase font-black text-neutral-500 tracking-widest block">Salary Potential Lift</span>
                          <span className="text-base font-extrabold text-emerald-400 block">{gapResults.salaryIncrease}</span>
                        </GlassCard>
                      </div>

                      {/* Certifications and Courses */}
                      <div className="space-y-4 text-left">
                        <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Recommended Learning Paths & Courses</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {gapResults.certifications.map((cert, i: number) => (
                            <GlassCard key={i} className="p-5 border border-neutral-900 rounded-2xl flex flex-col justify-between">
                              <div>
                                <span className="text-[8px] uppercase tracking-widest font-black text-purple-400">{cert.provider} Certified</span>
                                <h4 className="text-xs font-black text-neutral-200 mt-1 leading-tight">{cert.title}</h4>
                              </div>
                              <button 
                                onClick={() => {
                                  toast(`Redirecting to ${cert.provider} portal...`);
                                  window.open('https://www.udemy.com', '_blank');
                                }}
                                className="mt-4 w-full py-2 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 hover:text-white border border-neutral-800 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all font-semibold"
                              >
                                View Certification
                              </button>
                            </GlassCard>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                          {gapResults.courses.map((course, i: number) => (
                            <GlassCard key={i} className="p-5 border border-neutral-900 rounded-2xl flex flex-col justify-between">
                              <div>
                                <span className="text-[8px] uppercase tracking-widest font-black text-purple-400">Skills Course</span>
                                <h4 className="text-xs font-black text-neutral-200 mt-1 leading-tight">{course}</h4>
                              </div>
                              <button 
                                onClick={() => toast(`Launching ${course} video player...`)}
                                className="mt-4 w-full py-2 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 hover:text-white border border-neutral-800 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all font-semibold"
                              >
                                Start Learning
                              </button>
                            </GlassCard>
                          ))}
                        </div>
                      </div>

                      {/* Improve Resume CTA Button */}
                      <button 
                        onClick={() => {
                          toast("AI is rewriting experience statements to integrate Docker & AWS metrics...", "info");
                          setTimeout(() => {
                            toast("Resume updated successfully! 4 missing skills successfully patched.", "success");
                          }, 1000);
                        }}
                        className="w-full py-3 bg-white text-black hover:bg-neutral-200 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-white/5"
                      >
                        Improve Resume with AI
                      </button>

                    </div>
                  ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center bg-neutral-950/20 border border-dashed border-neutral-900 rounded-[2rem] p-8">
                      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl mb-4 text-neutral-500">
                        <FileSpreadsheet className="h-8 w-8" />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">Gap Analysis Incomplete</h3>
                      <p className="text-[10px] text-neutral-555 uppercase tracking-wider max-w-sm font-semibold">Input target parameters on the left side to compare skills gap indices.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: CAREER ROADMAP
              ======================================================== */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Interactive Future Career Paths</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch relative">
                  {[
                    { role: 'Frontend Developer', salary: '$95k - $125k', years: 'Entry - 2 Years', desc: 'Build reactive UI elements and connect API structures.' },
                    { role: 'Senior Developer', salary: '$130k - $170k', years: '3 - 5 Years', desc: 'Optimize architectures, performance sharding, and lead modules.' },
                    { role: 'Lead Engineer', salary: '$180k - $220k', years: '6 - 8 Years', desc: 'Guide tech stacks, coordinate deployments, and mentor staff.' },
                    { role: 'Engineering Manager', salary: '$210k - $270k', years: '8+ Years', desc: 'Organize sprint operations, hiring pipelines, and direct strategies.' }
                  ].map((stage, idx) => (
                    <GlassCard key={idx} className={`p-5 border flex flex-col justify-between rounded-2xl relative ${idx === 0 ? 'border-purple-500/30 bg-purple-955/5 shadow-md shadow-purple-500/10' : 'border-neutral-900 bg-neutral-950/40'}`}>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest ${idx === 0 ? 'bg-purple-950 border border-purple-900 text-purple-400' : 'bg-neutral-900 text-neutral-500'}`}>
                            Stage {idx + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-neutral-250 leading-tight">{stage.role}</h4>
                          <span className="text-[9px] text-neutral-550 font-bold uppercase tracking-wider block mt-0.5">{stage.years}</span>
                        </div>
                        <p className="text-[10px] text-neutral-450 leading-relaxed">{stage.desc}</p>
                      </div>
                      <div className="mt-6 pt-3 border-t border-neutral-900/60">
                        <span className="text-[9px] uppercase tracking-widest font-black text-neutral-500 block">Avg. Salary</span>
                        <span className="text-xs font-black text-neutral-200">{stage.salary}</span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: PORTFOLIO GENERATOR
              ======================================================== */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Styles and settings */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Select Portfolio Style */}
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Select Portfolio Style</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: 'professional', title: 'Professional Portfolio', desc: 'Vibrant mesh gradients, soft shadows, and clean corporate structure.' },
                        { id: 'developer', title: 'Developer Portfolio', desc: 'IDE theme coordinates, code widgets, and dark console layout.' },
                        { id: 'executive', title: 'Executive Portfolio', desc: 'Slate styling, serif details, and focused metric dashboards.' },
                        { id: 'designer', title: 'Designer Portfolio', desc: 'Creative color combinations, micro-interactions, and heavy fonts.' },
                        { id: 'startup', title: 'Startup Portfolio', desc: 'Modern minimal landing page structure with fast load rates.' }
                      ].map((style) => (
                        <GlassCard 
                          key={style.id} 
                          onClick={() => setSelectedPortfolioStyle(style.id as 'professional' | 'developer' | 'executive' | 'designer' | 'startup')}
                          className={`p-5 cursor-pointer text-left border rounded-2xl transition-all relative overflow-hidden flex flex-col justify-between h-[120px]
                            ${selectedPortfolioStyle === style.id 
                              ? 'border-purple-500/30 bg-purple-955/5 shadow-md shadow-purple-500/10' 
                              : 'border-neutral-900 bg-neutral-950/40 hover:bg-neutral-900/40'
                            }
                          `}
                        >
                          <div className="space-y-1.5">
                            <span className="text-[8px] uppercase tracking-widest font-black text-neutral-500">Theme coordinates</span>
                            <h4 className="text-xs font-black text-neutral-200 leading-tight">{style.title}</h4>
                            <p className="text-[10px] text-neutral-450 leading-relaxed">{style.desc}</p>
                          </div>
                          {selectedPortfolioStyle === style.id && (
                            <span className="absolute bottom-4 right-4 text-[9px] font-black uppercase text-purple-400">Active</span>
                          )}
                        </GlassCard>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio Features Checklist */}
                  <GlassCard className="p-6 border border-neutral-900 rounded-2xl space-y-4">
                    <span className="text-xs font-black uppercase tracking-wider text-white block pb-2 border-b border-neutral-900">Portfolio Features &amp; Modules</span>
                    
                    <div className="space-y-4">
                      {/* Projects inclusion */}
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase font-black tracking-widest text-neutral-450 block">Include Engineering Projects</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {['MIRA AI Engine', 'E-Commerce Orchestrator', 'GraphQL Aggregator'].map((proj) => {
                            const isInc = portfolioProjects.includes(proj);
                            return (
                              <label key={proj} className="flex items-center space-x-2.5 p-3.5 bg-neutral-950 border border-neutral-900 rounded-xl cursor-pointer text-xs font-semibold text-neutral-200 select-none">
                                <input 
                                  type="checkbox" 
                                  checked={isInc}
                                  onChange={() => {
                                    if (isInc) {
                                      setPortfolioProjects(prev => prev.filter(x => x !== proj));
                                    } else {
                                      setPortfolioProjects(prev => [...prev, proj]);
                                    }
                                  }}
                                  className="accent-purple-500 rounded border-neutral-850 bg-neutral-950" 
                                />
                                <span>{proj}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* SEO settings */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] uppercase font-black tracking-widest text-neutral-450 block mb-1">SEO Title Tag</label>
                          <input 
                            type="text" 
                            value={portfolioSeoTitle}
                            onChange={(e) => setPortfolioSeoTitle(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-850"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-black tracking-widest text-neutral-450 block mb-1">Google Analytics ID</label>
                          <input 
                            type="text" 
                            value={portfolioAnalyticsId}
                            onChange={(e) => setPortfolioAnalyticsId(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-850"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] uppercase font-black tracking-widest text-neutral-450 block mb-1">SEO Meta Description</label>
                        <textarea 
                          rows={2}
                          value={portfolioSeoDesc}
                          onChange={(e) => setPortfolioSeoDesc(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-900 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-neutral-850 resize-none font-semibold"
                        />
                      </div>
                    </div>
                  </GlassCard>

                </div>

                {/* Right Column: Actions */}
                <div className="lg:col-span-4 space-y-6">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Publish coordinates</h3>
                  <GlassCard className="p-5 border border-neutral-900 rounded-2xl space-y-4">
                    <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-xl space-y-1">
                      <span className="text-[8px] uppercase tracking-widest font-black text-neutral-500 block">Target Domain</span>
                      <span className="text-xs font-semibold text-neutral-250 block">mira.ai/alexander-sterling</span>
                    </div>

                    <div className="space-y-2">
                      <button 
                        onClick={() => {
                          setPortfolioPreviewOpen(true);
                          toast("Generating site preview mockup...", "info");
                        }}
                        className="w-full py-2.5 bg-white text-black hover:bg-neutral-250 text-xs font-black uppercase rounded-lg transition-colors flex items-center justify-center space-x-1.5"
                      >
                        Preview Portfolio
                      </button>
                      <button 
                        onClick={() => {
                          setIsPublishingPortfolio(true);
                          setTimeout(() => {
                            setIsPublishingPortfolio(false);
                            setPortfolioPublishedUrl('https://mira.ai/portfolio/alexander-sterling');
                            toast("Portfolio website published live!");
                          }, 1200);
                        }}
                        disabled={isPublishingPortfolio}
                        className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-black uppercase text-neutral-300 hover:text-white rounded-lg transition-colors"
                      >
                        {isPublishingPortfolio ? 'Publishing static files...' : 'Publish Live Webpage'}
                      </button>
                      <button 
                        onClick={() => toast("Downloading portfolio HTML/CSS static template ZIP...")}
                        className="w-full py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 text-neutral-350 hover:text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors"
                      >
                        Download HTML/CSS Zip
                      </button>
                    </div>

                    {portfolioPublishedUrl && (
                      <div className="p-3 bg-purple-955/20 border border-purple-500/20 rounded-xl text-center space-y-1 animate-slide-up">
                        <span className="text-[8px] uppercase tracking-widest font-black text-purple-400 block">Status: Published Live</span>
                        <a 
                          href={portfolioPublishedUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] font-semibold text-white underline break-all block"
                        >
                          {portfolioPublishedUrl}
                        </a>
                      </div>
                    )}
                  </GlassCard>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: INTERVIEW PREPARATION CONSOLE
              ======================================================== */}
          {activeTab === 'interview' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Question Category</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'hr', name: 'HR & Competency Questions', desc: 'Core personality and career milestones.' },
                      { id: 'technical', name: 'Technical & Systems Architecture', desc: 'Coding patterns, databases, and grids.' },
                      { id: 'behavioral', name: 'Behavioral & Leadership', desc: 'Conflict resolution and management milestones.' },
                      { id: 'coding', name: 'Live Coding / Data Structures', desc: 'Algorithms, sharding, and optimization.' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedPrepCategory(cat.id as 'hr' | 'technical' | 'behavioral' | 'coding');
                          setActiveQuestionIdx(0);
                          setMockFeedbackScore(null);
                        }}
                        className={`w-full p-4 rounded-xl border text-left transition-all flex flex-col justify-between h-[90px]
                          ${selectedPrepCategory === cat.id 
                            ? 'border-purple-500/30 bg-purple-955/5 shadow-md shadow-purple-500/10' 
                            : 'border-neutral-900 bg-neutral-950/60 hover:bg-neutral-900 text-neutral-455'
                          }
                        `}
                      >
                        <span className={`text-[10px] font-black uppercase tracking-wider ${selectedPrepCategory === cat.id ? 'text-white' : 'text-neutral-300'}`}>{cat.name}</span>
                        <p className="text-[9.5px] text-neutral-550 leading-normal font-semibold uppercase">{cat.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Simulated QA Console</h3>
                  
                  <GlassCard className="p-6 border border-neutral-900 rounded-3xl space-y-4 text-left">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                      <span className="text-[8px] uppercase tracking-widest font-black text-purple-400">Question {activeQuestionIdx + 1} of 3</span>
                      <span className="text-[8px] bg-red-955 border border-red-900 text-red-400 px-2 py-0.5 rounded font-black uppercase">Medium Difficulty</span>
                    </div>

                    <div className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl">
                      <p className="text-xs font-semibold text-neutral-250 leading-relaxed">
                        {selectedPrepCategory === 'hr' && "Tell me about a time you had to deal with an ambiguous project specification. How did you coordinate requirements?"}
                        {selectedPrepCategory === 'technical' && "Explain database sharding and when you would select custom PostgreSQL partitions over Redis cache stacks."}
                        {selectedPrepCategory === 'behavioral' && "How do you handle disputes with senior engineering management regarding frontend library dependencies?"}
                        {selectedPrepCategory === 'coding' && "Explain the time complexity of compiling index structures in Next.js Webpack systems."}
                      </p>
                    </div>

                    <div className="p-3 bg-neutral-955 border border-neutral-900 rounded-xl text-[10.5px] text-neutral-550 leading-normal space-y-1 font-semibold uppercase">
                      <span className="text-[8px] uppercase tracking-widest font-black text-neutral-400 block">Coaching Tips</span>
                      <p>&bull; Mention target impact results and structural workflows.</p>
                      <p>&bull; Highlight teamwork coordinates, documentation metrics, and timelines.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-black tracking-widest text-neutral-455 block">Your Answer Response</label>
                      <textarea 
                        rows={4}
                        placeholder="Type or simulate speech input response..."
                        value={mockUserAnswers[`${selectedPrepCategory}-${activeQuestionIdx}`] || ''}
                        onChange={(e) => setMockUserAnswers({
                          ...mockUserAnswers,
                          [`${selectedPrepCategory}-${activeQuestionIdx}`]: e.target.value
                        })}
                        className="w-full bg-neutral-950 border border-neutral-900 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-neutral-850 resize-none font-medium"
                      />
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                      <button 
                        onClick={() => {
                          const answers = mockUserAnswers[`${selectedPrepCategory}-${activeQuestionIdx}`] || '';
                          if (!answers.trim()) {
                            toast("Please type an answer to check feedback.", "error");
                            return;
                          }
                          setMockFeedbackScore(85);
                          toast("AI evaluated communication, technical terms, and confidence indexes.");
                        }}
                        className="px-6 py-2.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-750 text-neutral-200 hover:text-white text-[10px] font-black uppercase rounded-lg transition-colors"
                      >
                        Evaluate with AI
                      </button>
                      <button 
                        onClick={() => {
                          toast("Suggested AI Answer: 'Focus on structuring requirements in sprints, creating markdown specs, and reviewing edge cases.'");
                        }}
                        className="px-6 py-2.5 bg-white text-black hover:bg-neutral-250 text-[10px] font-black uppercase rounded-lg transition-all"
                      >
                        View AI Answer
                      </button>
                    </div>

                    {mockFeedbackScore && (
                      <div className="p-4 bg-purple-955/20 border border-purple-500/20 rounded-xl space-y-2 animate-slide-up">
                        <span className="text-[8px] uppercase tracking-widest font-black text-purple-400 block">AI Feedback score</span>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-black text-white">{mockFeedbackScore}% Compatibility</span>
                          <span className="text-[8px] font-bold text-neutral-450 uppercase">Tone is Executive & Focused</span>
                        </div>
                      </div>
                    )}
                  </GlassCard>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: LINKEDIN PROFILE OPTIMIZER
              ======================================================== */}
          {activeTab === 'linkedin' && (
            <div className="space-y-6 animate-fade-in text-left">
              {!hasResume && (
                <div className="py-20 flex flex-col items-center justify-center text-center bg-neutral-950/20 border border-dashed border-neutral-900 rounded-[2rem] p-8">
                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl mb-4 text-neutral-500 w-16 mx-auto flex items-center justify-center">
                    <FileText className="h-8 w-8 animate-pulse" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">Resume Template Required</h3>
                  <p className="text-[10px] text-neutral-550 uppercase tracking-wider max-w-sm mx-auto mb-4 font-semibold text-center">You need an active resume template to enable this AI optimization module.</p>
                  <button 
                    onClick={handleCreateNewResume}
                    className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-colors"
                  >
                    Create Resume
                  </button>
                </div>
              )}

              {hasResume && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                  
                  {/* Left Column: Optimizer Outputs */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Headline rewrite */}
                    <GlassCard className="p-6 border border-neutral-900 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                        <span className="text-xs font-black uppercase tracking-wider text-purple-400">1. Optimized Headline Options</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-neutral-950 border border-neutral-900 rounded text-neutral-500 font-semibold">SEO Optimized</span>
                      </div>
                      <div className="space-y-4">
                        {[
                          "Staff Frontend Engineer | React &amp; Next.js Performance Architect | Cloud Specialist",
                          "Staff Software Engineer (Frontend) | Ex-Vercel, Ex-Stripe | TypeScript &amp; Serverless Infrastructure Developer",
                          "SDE III | React Performance Optimizer &amp; CI/CD Pipeline Architect"
                        ].map((hl, i) => (
                          <div key={i} className="p-4 bg-neutral-950 border border-neutral-900 rounded-2xl flex justify-between items-start gap-4">
                            <p className="text-xs font-semibold text-neutral-200 leading-relaxed">{hl}</p>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(hl);
                                toast("Headline copied to clipboard!");
                              }}
                              className="shrink-0 px-3 py-1 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[9px] font-black uppercase tracking-wider text-neutral-350 hover:text-white rounded-lg transition-colors font-semibold"
                            >
                              Copy
                            </button>
                          </div>
                        ))}
                      </div>
                    </GlassCard>

                    {/* About Section rewrite */}
                    <GlassCard className="p-6 border border-neutral-900 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                        <span className="text-xs font-black uppercase tracking-wider text-purple-400">2. Professional About Section</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText("Staff Engineer with 5+ years of experience leading UI performance optimizations, building secure payment infrastructures, and scaling serverless Next.js architectures. Expert in React, TypeScript, GraphQL, AWS, and Docker containerization.");
                            toast("About section copied!");
                          }}
                          className="px-3 py-1 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[9px] font-black uppercase tracking-wider text-neutral-350 hover:text-white rounded-lg transition-colors font-semibold"
                        >
                          Copy All
                        </button>
                      </div>
                      <p className="bg-neutral-950 border border-neutral-900 p-4 rounded-2xl text-xs text-neutral-300 font-semibold leading-relaxed">
                        &quot;Staff Engineer with 5+ years of experience leading UI performance optimizations, building secure payment infrastructures, and scaling serverless Next.js architectures. Expert in React, TypeScript, GraphQL, AWS, and Docker containerization.&quot;
                      </p>
                    </GlassCard>
                  </div>

                  {/* Right Column: SEO Stats */}
                  <div className="lg:col-span-4 space-y-6">
                    <GlassCard className="p-5 border border-neutral-900 rounded-2xl text-left space-y-4">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 block pb-2 border-b border-neutral-900">Brand Completeness</span>
                      <div className="space-y-4">
                        <div>
                          <span className="text-[9px] uppercase tracking-widest font-black text-neutral-550">SEO Brand Score</span>
                          <div className="flex items-baseline mt-1 space-x-1">
                            <span className="text-3xl font-black text-white">85%</span>
                            <span className="text-xs text-emerald-450 uppercase font-black">Excellent</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] uppercase tracking-widest font-black text-neutral-550 block mb-2 font-semibold">SEO completeness audit</span>
                          <div className="space-y-2 text-[10px] font-semibold text-neutral-450">
                            <div className="flex justify-between">
                              <span>Headline SEO density</span>
                              <span className="text-emerald-400">100%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>About section metrics</span>
                              <span className="text-emerald-400">90%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Featured projects links</span>
                              <span className="text-amber-400">60%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB: PREFERENCES & SETTINGS
              ======================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 text-left">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left profile settings form */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Section Profile */}
                  <GlassCard className="p-6 space-y-4 border border-neutral-900 rounded-2xl">
                    <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold pb-2 border-b border-neutral-900">
                      1. Profile Credentials
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] uppercase font-black text-neutral-450 tracking-widest block mb-1">User Full Name</label>
                        <input 
                          type="text" 
                          value={userName} 
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-800"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-black text-neutral-450 tracking-widest block mb-1">Email Address</label>
                        <input 
                          type="email" 
                          value={userEmail} 
                          onChange={(e) => setUserEmail(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-800"
                        />
                      </div>
                    </div>
                  </GlassCard>

                  {/* Account Options & Password Reset */}
                  <GlassCard className="p-6 space-y-4 border border-neutral-900 rounded-2xl">
                    <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold pb-2 border-b border-neutral-900">
                      2. Account Password & Security
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] uppercase font-black text-neutral-450 tracking-widest block mb-1">New Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••••••"
                          className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-800"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-black text-neutral-450 tracking-widest block mb-1">Confirm New Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••••••"
                          className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-800"
                        />
                      </div>
                    </div>
                  </GlassCard>

                  {/* Theme Accent Settings */}
                  <GlassCard className="p-6 space-y-4 border border-neutral-900 rounded-2xl">
                    <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold pb-2 border-b border-neutral-900">
                      3. Accent Color Branding
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { name: 'Luxury Purple', val: 'purple', glow: 'bg-purple-650' },
                        { name: 'Electric Blue', val: 'blue', glow: 'bg-blue-500' },
                        { name: 'Emerald Forest', val: 'emerald', glow: 'bg-emerald-500' }
                      ].map((c, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setThemeColor(c.val as 'purple' | 'blue' | 'emerald');
                            toast(`Accent theme color set to ${c.name}`);
                          }}
                          className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2
                            ${themeColor === c.val 
                              ? 'border-white bg-neutral-900 text-white' 
                              : 'border-neutral-900 bg-neutral-950/60 hover:bg-neutral-900 text-neutral-450 hover:text-white'
                            }
                          `}
                        >
                          <div className={`h-2.5 w-2.5 rounded-full ${c.glow}`}></div>
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </GlassCard>

                </div>

                {/* Right billing & plans column */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Subscription card */}
                  <GlassCard className="p-5 space-y-4 border border-neutral-900 rounded-2xl relative overflow-hidden">
                    <div className={`absolute right-0 top-0 h-16 w-16 ${colors.glowBlur} rounded-full blur-[40px] pointer-events-none`}></div>
                    
                    <span className={`text-[9px] uppercase font-black ${colors.text} tracking-widest block`}>Billing Status</span>
                    
                    <div>
                      <h4 className="text-xl font-black uppercase text-white leading-tight">{subscription} Account</h4>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">
                        {subscription === 'pro' ? 'Unlimited PDF and word conversions' : 'Limited features and screenshot block'}
                      </p>
                    </div>

                    <button 
                      onClick={() => {
                        const next = subscription === 'free' ? 'pro' : 'free';
                        setSubscription(next);
                        toast(`Upgraded account subscription to ${next.toUpperCase()}`);
                      }}
                      className="w-full py-2.5 bg-white hover:bg-neutral-250 text-black text-xs font-black uppercase tracking-wider rounded-lg transition-colors"
                    >
                      Toggle Subscription
                    </button>
                  </GlassCard>

                  {/* Danger Zone */}
                  <GlassCard className="p-5 border border-red-955/30 bg-red-955/5 space-y-4 rounded-2xl">
                    <span className="text-[9px] uppercase font-black text-red-400 tracking-widest block">Danger Zone</span>
                    <p className="text-[10px] text-neutral-500 leading-normal uppercase">
                      Deleting your account will erase all resumes, cover letters, and tracked job application items.
                    </p>
                    <button 
                      onClick={() => {
                        if (confirm("Are you sure you want to delete your MIRA AI account?")) {
                          toast("Account deleted.", "error");
                          router.push('/auth/login');
                        }
                      }}
                      className="w-full py-2.5 bg-red-900/10 hover:bg-red-900 border border-red-900/30 hover:border-red-950/40 hover:text-white text-red-400 text-xs font-black uppercase tracking-wider rounded-lg transition-colors"
                    >
                      Delete Account
                    </button>
                  </GlassCard>

                </div>

              </div>

            </div>
          )}

        </div>

      </main>

      {/* drag-and-drop / Tracker Modal */}
      {isNewJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-md p-6 border border-neutral-900 bg-neutral-950 text-white rounded-3xl space-y-4 relative animate-fadeIn">
            
            <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
              <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Track New Job</h3>
              <button onClick={() => setIsNewJobModalOpen(false)} className="text-neutral-500 hover:text-white">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleAddJob} className="space-y-4 text-left">
              <div>
                <label className="text-[9px] uppercase font-black text-neutral-450 tracking-wider block mb-1">Company Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Vercel" 
                  value={newJobData.company}
                  onChange={(e) => setNewJobData({ ...newJobData, company: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-800"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase font-black text-neutral-450 tracking-wider block mb-1">Job Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Senior Frontend Engineer" 
                  value={newJobData.title}
                  onChange={(e) => setNewJobData({ ...newJobData, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] uppercase font-black text-neutral-450 tracking-wider block mb-1">Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Remote, US" 
                    value={newJobData.location}
                    onChange={(e) => setNewJobData({ ...newJobData, location: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-800"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase font-black text-neutral-450 tracking-wider block mb-1">Priority</label>
                  <select
                    value={newJobData.priority}
                    onChange={(e) => setNewJobData({ ...newJobData, priority: e.target.value as 'high' | 'medium' | 'low' })}
                    className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-800"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase font-black text-neutral-450 tracking-wider block mb-1">Status Column</label>
                <select
                  value={newJobData.status}
                  onChange={(e) => setNewJobData({ ...newJobData, status: e.target.value as TrackedJob['status'] })}
                  className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-800"
                >
                  <option value="wishlist">Wishlist</option>
                  <option value="applied">Applied</option>
                  <option value="hr-round">HR Round</option>
                  <option value="technical">Technical</option>
                  <option value="assessment">Assessment</option>
                  <option value="manager-round">Manager Round</option>
                  <option value="offer">Offer</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-white hover:bg-neutral-250 text-black text-xs font-black uppercase tracking-wider rounded-lg transition-colors"
              >
                Start Tracking Job
              </button>
            </form>

          </GlassCard>
        </div>
      )}

      {/* AI Company Research details Modal */}
      {selectedResearchCompany && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-2xl p-6 border border-neutral-900 bg-neutral-950 text-white rounded-3xl space-y-6 relative max-h-[85vh] overflow-y-auto animate-fadeIn text-left">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-900">
              <div className="flex items-center space-x-2">
                <Compass className="h-5 w-5 text-purple-400 animate-spin-slow" />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">AI Company Intelligence: {selectedResearchCompany}</h3>
                  <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5 font-sans">Real-time Glassdoor &amp; Stack Audit</p>
                </div>
              </div>
              <button onClick={() => setSelectedResearchCompany(null)} className="text-neutral-500 hover:text-white">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {COMPANY_RESEARCH_DATA[selectedResearchCompany] ? (
              <div className="space-y-5 text-xs">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-950/40 border border-neutral-900 rounded-xl space-y-1.5">
                    <span className="text-[8px] uppercase tracking-widest font-black text-purple-400">Company Overview</span>
                    <p className="text-neutral-350 leading-relaxed font-semibold">{COMPANY_RESEARCH_DATA[selectedResearchCompany].overview}</p>
                  </div>
                  <div className="p-4 bg-neutral-950/40 border border-neutral-900 rounded-xl space-y-1.5">
                    <span className="text-[8px] uppercase tracking-widest font-black text-purple-400">Funding &amp; Financials</span>
                    <p className="text-neutral-350 leading-relaxed font-semibold">{COMPANY_RESEARCH_DATA[selectedResearchCompany].funding}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-950/40 border border-neutral-900 rounded-xl space-y-1.5">
                    <span className="text-[8px] uppercase tracking-widest font-black text-purple-400">Products &amp; Assets</span>
                    <ul className="list-disc pl-4 space-y-1 text-neutral-350 font-semibold">
                      {COMPANY_RESEARCH_DATA[selectedResearchCompany].products.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                  <div className="p-4 bg-neutral-950/40 border border-neutral-900 rounded-xl space-y-1.5">
                    <span className="text-[8px] uppercase tracking-widest font-black text-purple-400">SDE Tech Stack</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {COMPANY_RESEARCH_DATA[selectedResearchCompany].techStack.map((t, i) => (
                        <span key={i} className="text-[8px] font-bold px-1.5 py-0.5 bg-neutral-900 border border-neutral-850 rounded text-neutral-450">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-950/40 border border-neutral-900 rounded-xl space-y-1.5">
                    <span className="text-[8px] uppercase tracking-widest font-black text-purple-400">Interview Process Rounds</span>
                    <ul className="list-decimal pl-4 space-y-1 text-neutral-350 font-semibold">
                      {COMPANY_RESEARCH_DATA[selectedResearchCompany].interview.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                  <div className="p-4 bg-neutral-950/40 border border-neutral-900 rounded-xl space-y-1.5">
                    <span className="text-[8px] uppercase tracking-widest font-black text-purple-400">Suggested Questions to Ask</span>
                    <ul className="list-disc pl-4 space-y-1 text-neutral-350 font-semibold">
                      {COMPANY_RESEARCH_DATA[selectedResearchCompany].questions.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-950/40 border border-neutral-900 rounded-xl space-y-1.5">
                    <span className="text-[8px] uppercase tracking-widest font-black text-purple-400">Culture &amp; Workstyle</span>
                    <p className="text-neutral-350 leading-relaxed font-semibold">{COMPANY_RESEARCH_DATA[selectedResearchCompany].culture}</p>
                  </div>
                  <div className="p-4 bg-neutral-950/40 border border-neutral-900 rounded-xl space-y-1.5">
                    <span className="text-[8px] uppercase tracking-widest font-black text-purple-400">Glassdoor Rating Overview</span>
                    <p className="text-neutral-350 leading-relaxed font-semibold">{COMPANY_RESEARCH_DATA[selectedResearchCompany].glassdoor}</p>
                  </div>
                </div>

                <div className="p-4 bg-neutral-950/40 border border-neutral-900 rounded-xl space-y-1">
                  <span className="text-[8px] uppercase tracking-widest font-black text-purple-400 block">Hiring Trends &amp; Outlook</span>
                  <p className="text-neutral-350 leading-relaxed font-semibold">{COMPANY_RESEARCH_DATA[selectedResearchCompany].trends}</p>
                </div>

              </div>
            ) : (
              <p className="text-xs text-neutral-550">No company details data compiled for {selectedResearchCompany}.</p>
            )}

            <button 
              onClick={() => setSelectedResearchCompany(null)}
              className="w-full py-2.5 bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors font-semibold"
            >
              Close Intelligence Report
            </button>
          </GlassCard>
        </div>
      )}

      {/* Portfolio Preview Modal Overlay */}
      {portfolioPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-4xl p-6 border border-neutral-900 bg-neutral-950 text-white rounded-3xl space-y-6 relative max-h-[90vh] overflow-y-auto animate-fadeIn text-left">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-900">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-purple-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Live Portfolio Mockup: {selectedPortfolioStyle.toUpperCase()}</h3>
                  <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">mira.ai/alexander-sterling</p>
                </div>
              </div>
              <button onClick={() => setPortfolioPreviewOpen(false)} className="text-neutral-500 hover:text-white">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Simulated website landing container */}
            <div className="p-8 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-8 font-sans">
              
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-neutral-900/60">
                <span className="text-sm font-black tracking-tight text-white uppercase">AS <span className="text-purple-400">.</span></span>
                <div className="flex space-x-4 text-[10px] uppercase font-bold text-neutral-450 tracking-wider">
                  <span>About</span>
                  <span>Projects</span>
                  <span>Contact</span>
                </div>
              </div>

              {/* Hero */}
              <div className="py-8 space-y-3">
                <span className="text-[8px] uppercase tracking-widest font-black text-purple-400">Welcome to my space</span>
                <h1 className="text-2xl font-black tracking-tight text-white leading-tight max-w-xl">{portfolioSeoTitle}</h1>
                <p className="text-xs text-neutral-450 leading-relaxed max-w-lg">{portfolioSeoDesc}</p>
              </div>

              {/* Projects Grid */}
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-widest font-black text-neutral-450">Featured Engineering Work</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolioProjects.map((p, i) => (
                    <div key={i} className="p-4 bg-neutral-900/40 border border-neutral-900 rounded-xl space-y-1.5" style={{ contentVisibility: 'auto' }}>
                      <h4 className="text-xs font-black text-white">{p}</h4>
                      <p className="text-[10px] text-neutral-450 leading-relaxed">Built and deployed via Kubernetes. Dynamic caching enabled via distributed Redis stores.</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resume download & Contact preview */}
              <div className="pt-6 border-t border-neutral-900/60 flex flex-wrap justify-between items-center gap-4">
                <span className="text-[9px] text-neutral-555 font-bold uppercase tracking-wider">Analytics status: active ({portfolioAnalyticsId})</span>
                <div className="flex space-x-3">
                  <button onClick={() => toast("Downloading Resume PDF...")} className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-wider rounded-lg font-semibold">
                    Download Resume
                  </button>
                  <button onClick={() => toast("Opening contact form...")} className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-white text-[9px] font-black uppercase tracking-wider rounded-lg border border-neutral-800 font-semibold">
                    Get In Touch
                  </button>
                </div>
              </div>

            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setPortfolioPreviewOpen(false);
                  toast("Syncing configurations...");
                }}
                className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-white border border-neutral-855 text-xs font-black uppercase tracking-wider rounded-lg transition-colors font-semibold"
              >
                Close Preview
              </button>
              <button 
                onClick={() => {
                  setPortfolioPreviewOpen(false);
                  setIsPublishingPortfolio(true);
                  setTimeout(() => {
                    setIsPublishingPortfolio(false);
                    setPortfolioPublishedUrl('https://mira.ai/portfolio/alexander-sterling');
                    toast("Portfolio website published live!");
                  }, 1200);
                }}
                className="flex-1 py-2.5 bg-white text-black hover:bg-neutral-250 text-xs font-black uppercase tracking-wider rounded-lg transition-colors font-semibold"
              >
                Publish Live Webpage
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Floating AI Career Coach Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        {!coachOpen ? (
          <button 
            onClick={() => setCoachOpen(true)}
            className={`h-14 w-14 rounded-full bg-gradient-to-r ${colors.fromTo} text-white flex items-center justify-center shadow-xl shadow-purple-500/20 hover:scale-110 active:scale-95 transition-all relative group border border-white/10`}
          >
            <MessageSquare className="h-6 w-6 animate-pulse" />
            <div className="absolute right-0 top-0 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-neutral-950 animate-bounce"></div>
            
            {/* Tooltip hint */}
            <div className="absolute right-16 bg-neutral-900 border border-neutral-800 text-[9px] uppercase tracking-widest font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl text-neutral-350">
              AI Career Coach
            </div>
          </button>
        ) : (
          <GlassCard className="w-80 p-5 border border-purple-500/20 shadow-2xl rounded-2xl flex flex-col space-y-4 animate-slide-up text-left bg-neutral-950/95 backdrop-blur-md">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-purple-400 animate-bounce" />
                <span className="text-xs font-black uppercase tracking-wider text-white">MIRA AI Career Coach</span>
              </div>
              <button onClick={() => setCoachOpen(false)} className="text-neutral-500 hover:text-white">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-3.5 text-[11px] leading-relaxed text-neutral-300 font-semibold space-y-2 max-h-48 overflow-y-auto">
              <p className="text-purple-300">Coach: Hello! I&apos;m scanning your profile. Here are key moves to accelerate your career index:</p>
              <div className="space-y-1.5 pl-1.5 border-l-2 border-purple-900">
                <p>&bull; <strong>ATS optimization</strong>: Rewrite Summary section to include tech metrics.</p>
                <p>&bull; <strong>Skill gap</strong>: Paste a job description to audit Docker & Kubernetes requirements.</p>
                <p>&bull; <strong>Portfolio</strong>: Publish a clean modern portfolio domain.</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[8px] uppercase tracking-widest font-black text-neutral-550 block">Quick Suggestions & Actions</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { text: 'Improve Summary', action: () => { setActiveTab('resumes'); setCoachOpen(false); toast("Opening Resumes. Use the AI Rewrite panel inside the builder step 2."); } },
                  { text: 'Learn Docker', action: () => { setActiveTab('gap'); setCoachOpen(false); toast("Opened Skill Gap. Paste job requirements to check recommended course paths."); } },
                  { text: 'Practice Interview', action: () => { setActiveTab('interview'); setCoachOpen(false); toast("Switched to Interview Prep console. Choose a track to begin Q&A."); } },
                  { text: 'Weekly Career Plan', action: () => { toast("AI plan generated: Day 1-2: Tailor resume, Day 3: Optimize LinkedIn SEO, Day 4-5: Mock Q&As."); } }
                ].map((act, i) => (
                  <button 
                    key={i}
                    onClick={act.action}
                    className="py-2 px-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 text-neutral-400 hover:text-white text-[9.5px] font-bold uppercase tracking-wider rounded-lg transition-colors leading-tight text-center"
                  >
                    {act.text}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        )}
      </div>

    </div>
  );
}

export default function RedesignedDashboardPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Loading Executive Workspace...</p>
      </div>
    }>
      <DashboardContent />
    </React.Suspense>
  );
}
