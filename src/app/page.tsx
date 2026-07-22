"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Cpu, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  Upload, 
  Sliders, 
  ShieldCheck, 
  Layers, 
  MessageSquareShare, 
  Briefcase,
  Zap,
  FileSpreadsheet,
  Eye,
  BookOpen,
  X,
  History,
  User,
  LogOut,
  Mail,
  Bot,
  GraduationCap,
  Map,
  Globe,
  Volume2,
  FileCheck,
  MoreHorizontal,
  Menu,
  Plus
} from 'lucide-react';
import { Linkedin } from '@/components/icons/BrandIcons';
import { cn } from '@/lib/utils';
import { useResume } from '@/context/ResumeContext';
import { useLogoTransition, TransitionLink, LogoAnimation } from '@/components/ui/LogoAnimation';
import { HistoryDrawer } from '@/components/ui/HistoryDrawer';
import { MiraLogo } from '@/components/ui/MiraLogo';
import { useRouter } from 'next/navigation';

function getThemeAccent(theme: 'purple' | 'blue' | 'emerald') {
  if (theme === 'blue') {
    return {
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
      gradient: 'accent-blue',
      border: 'border-blue-900/50'
    };
  }
  if (theme === 'emerald') {
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      gradient: 'accent-emerald',
      border: 'border-emerald-900/50'
    };
  }
  return {
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    gradient: 'accent-purple-gradient',
    border: 'border-purple-900/50'
  };
}

export default function LandingPage() {
  const router = useRouter();
  const { themeColor, userName, userEmail, setUserName, setUserEmail } = useResume();
  const accent = getThemeAccent(themeColor);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<'features' | 'builder' | 'more' | null>(null);
  const [isBuildModalOpen, setIsBuildModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { startTransition, overlay } = useLogoTransition();
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'executive' | 'corporate' | 'minimal' | 'creative' | 'elegant' | 'ats-friendly' | 'dark' | 'professional' | 'luxury' | 'academic' | 'two-column' | 'btech-fresher'>('btech-fresher');
  const [infoModal, setInfoModal] = useState<{ title: string; desc: string } | null>(null);

  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const [playLogoAnimation, setPlayLogoAnimation] = useState(false);

  // Custom Feature Creator States
  const [customFeatures, setCustomFeatures] = useState<Array<{ id: string; title: string; desc: string; link: string; icon: string }>>([]);
  const [isAddFeatureModalOpen, setIsAddFeatureModalOpen] = useState(false);
  const [featureTitle, setFeatureTitle] = useState('');
  const [featureDesc, setFeatureDesc] = useState('');
  const [featureLink, setFeatureLink] = useState('/builder');
  const [featureIcon, setFeatureIcon] = useState('sparkles');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFeatures = localStorage.getItem('mira_custom_features');
      if (savedFeatures) {
        try {
          setCustomFeatures(JSON.parse(savedFeatures));
        } catch (e) {
          console.error('Failed to parse custom features:', e);
        }
      }

      const storedName = userName || localStorage.getItem('mira-user-name');
      const storedEmail = userEmail || localStorage.getItem('mira-user-email');
      if (!storedName && !storedEmail && !userName && !userEmail) {
        router.push('/auth/login');
        return;
      }
      setUserProfile({
        name: storedName || 'User',
        email: storedEmail || ''
      });

      const justLoggedIn = sessionStorage.getItem('mira_just_logged_in');
      if (justLoggedIn) {
        setPlayLogoAnimation(true);
        sessionStorage.removeItem('mira_just_logged_in');
      }
    }
  }, [userName, userEmail, router]);

  const handleAddCustomFeature = () => {
    if (!featureTitle.trim()) {
      alert('Please enter a feature title');
      return;
    }

    const newFeature = {
      id: `feature-${Date.now()}`,
      title: featureTitle.trim(),
      desc: featureDesc.trim() || 'Custom AI career tool designed to your requirements.',
      link: featureLink.trim() || '/builder',
      icon: featureIcon
    };

    const updated = [newFeature, ...customFeatures];
    setCustomFeatures(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mira_custom_features', JSON.stringify(updated));
    }

    setIsAddFeatureModalOpen(false);
    setFeatureTitle('');
    setFeatureDesc('');
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mira-user-name');
      localStorage.removeItem('mira-user-email');
    }
    setUserName('');
    setUserEmail('');
    setUserProfile(null);
    setIsProfileMenuOpen(false);
    router.push('/auth/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
    }
  };



  const faqData = [
    {
      q: "What makes your resume builder ATS-optimized?",
      a: "Our templates are structurally designed according to global ATS scanning standards. We bypass visual elements like progress bars, complex graphs, and text boxes that scramble parsing engines. We also run an automated keyword density scan against your target job descriptions to ensure matching compliance."
    },
    {
      q: "Can I try the application for free?",
      a: "Absolutely. Our Essential plan is 100% free and includes one full resume, basic template customizations, and 5 complimentary AI expansions. You can upgrade to Executive for unlimited resumes and advanced AI services."
    },
    {
      q: "How does the PDF parsing feature work?",
      a: "Simply upload your existing PDF resume. Our parsing engine uses advanced text structure analysis to extract contact information, roles, responsibilities, and qualifications, immediately auto-populating our builder steps so you don't have to start from scratch."
    },
    {
      q: "What AI models are powering the summaries and rewrites?",
      a: "We utilize custom-tailored OpenAI GPT-4 models fine-tuned on hundreds of thousands of high-performing resumes across fields like technology, finance, medicine, and engineering to ensure industry-specific vocabulary."
    }
  ];



  const templatePreviews: Record<string, { title: string; role: string; summary: string; exp: string }> = {
    minimal: {
      title: "Alexander Sterling",
      role: "Senior Software Engineer",
      summary: "Distinguished engineer specializing in design-centric user platforms...",
      exp: "Aether Technologies (2022 - Present) | Developed core rendering systems..."
    },
    executive: {
      title: "ALEXANDER STERLING",
      role: "SENIOR FULL STACK ARCHITECT",
      summary: "Over eight years of spearheading engineering systems with high-throughput...",
      exp: "Principal Architect | Aether Technologies (2022 - Present)\n• Led the cloud migration strategy saving $120k annually."
    },
    creative: {
      title: "alexander sterling",
      role: "lead frontend artisan",
      summary: "Crafting digital spaces with code, Framer Motion, and absolute precision...",
      exp: "Creative Lead // Vortex Labs (2019 - 2022)\n• Built the responsive UI components system."
    },
    'ats-friendly': {
      title: "Alexander Sterling",
      role: "Senior Full Stack Architect",
      summary: "8+ years professional experience in React, Next.js, Postgres, and Node.js infrastructure...",
      exp: "Aether Technologies | Senior Full Stack Architect | 2022 - Present\n- Managed a team of 12 full-stack engineers in designing responsive user interfaces."
    },
    modern: {
      title: "Alexander Sterling",
      role: "Lead Systems Architect",
      summary: "Architecting high-scale Next.js interfaces with modern React paradigms...",
      exp: "Senior Lead | Nebula Systems (2021 - Present)\n- Orchestrated architectural changes improving load speed by 35%."
    },
    corporate: {
      title: "Alexander Sterling",
      role: "VP of Engineering",
      summary: "Strategic engineering leader specializing in corporate product delivery...",
      exp: "VP Engineering | Nexus Enterprise Solutions (2020 - Present)\n- Headed cross-functional teams delivering 14 secure applications."
    },
    elegant: {
      title: "Alexander Sterling",
      role: "Senior Full Stack Engineer",
      summary: "Passionate about typography, clean code, and fine-tuned product design...",
      exp: "Staff Engineer | Aether Studios (2022 - Present)\n- Refactored user flows, increasing engagement by 22%."
    },
    dark: {
      title: "Alexander Sterling",
      role: "Dark Mode Systems Specialist",
      summary: "Building low-latency database queries and high-contrast user interfaces...",
      exp: "Lead Developer | Shadow Networks (2021 - Present)\n- Reduced query overhead by 48% on transactional sheets."
    },
    professional: {
      title: "Alexander Sterling",
      role: "Senior Enterprise Developer",
      summary: "Dedicated enterprise software architect delivering structured web systems...",
      exp: "Senior Staff Architect | Globex Systems (2023 - Present)\n- Deployed secure SSO solutions using OAuth standards."
    },
    luxury: {
      title: "ALEXANDER STERLING",
      role: "CHIEF EXPERIENCE OFFICER",
      summary: "Curating high-end editorial experiences with exceptional visual aesthetics...",
      exp: "Chief Artisan | Sterling Design House (2022 - Present)\n- Crafted bespoke consumer portals with gold-standard design layouts."
    },
    'btech-fresher': {
      title: "AARAV SHARMA",
      role: "B.TECH COMPUTER SCIENCE FRESHER",
      summary: "Passionate developer skilled in React, Next.js, and Java. Hackathon winner with high-quality projects...",
      exp: "Google Summer of Code (2025) | Contributed to core open-source frameworks..."
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-neutral-800 selection:text-white overflow-x-hidden luxury-mesh-bg font-sans">
      {overlay}
      {playLogoAnimation && <LogoAnimation onFinish={() => setPlayLogoAnimation(false)} />}
      
      {/* History Drawer */}
      <HistoryDrawer open={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-neutral-900 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="shrink-0 flex items-center">
            <MiraLogo href="/" size="md" />
          </div>

          <div className="hidden md:flex items-center space-x-12 lg:space-x-16 text-sm font-medium text-neutral-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            
            {/* Features dropdown menu trigger */}
            <div 
              className="relative py-2 cursor-pointer group"
              onMouseEnter={() => setActiveDropdown('features')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <span className="hover:text-white text-purple-300 font-semibold transition-colors flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
                Features <ChevronDown className="h-3.5 w-3.5" />
              </span>
              
              <AnimatePresence>
                {activeDropdown === 'features' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-10 left-1/2 -translate-x-1/2 w-[720px] bg-neutral-950/95 backdrop-blur-2xl border border-purple-900/40 rounded-3xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-50 text-left grid grid-cols-2 gap-2.5"
                  >
                    {[
                      { title: "Recruiter 6-Sec Heatmap", desc: "Eye-tracking heatmaps & recruiter focal point analysis.", path: "/dashboard?tab=recruiter", icon: Eye, color: "text-purple-400" },
                      { title: "Resume Health & Diagnostics", desc: "Full audit of grammar, density, readability & ATS index.", path: "/dashboard?tab=health", icon: ShieldCheck, color: "text-emerald-400" },
                      { title: "AI Resume Tailoring", desc: "Instant bullet point & summary tailoring for job descriptions.", path: "/dashboard?tab=tailor", icon: Layers, color: "text-blue-400" },
                      { title: "Kanban Application Tracker", desc: "Drag-and-drop job hunt pipeline with stage tracking.", path: "/dashboard?tab=tracker", icon: FileCheck, color: "text-amber-400" },
                      { title: "Job Match Compatibility", desc: "Role compatibility scores & missing certificate detection.", path: "/dashboard?tab=matching", icon: Briefcase, color: "text-indigo-400" },
                      { title: "Skill Gap Analysis", desc: "Identify missing skills & get curated learning recommendations.", path: "/dashboard?tab=gap", icon: FileSpreadsheet, color: "text-pink-400" },
                      { title: "Career Roadmap Builder", desc: "Step-by-step career progression simulator with milestones.", path: "/dashboard?tab=roadmap", icon: Map, color: "text-cyan-400" },
                      { title: "Portfolio Website Builder", desc: "Convert resume data into a hosted personal portfolio site.", path: "/dashboard?tab=portfolio", icon: Globe, color: "text-teal-400" },
                      { title: "AI Mock Interview Coach", desc: "Practice role-specific QA with real-time AI feedback.", path: "/dashboard?tab=interview", icon: Volume2, color: "text-rose-400" },
                      { title: "LinkedIn Profile Optimizer", desc: "Rewrite & SEO-tune your professional personal brand.", path: "/dashboard?tab=linkedin", icon: Linkedin, color: "text-sky-400" }
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <Link 
                          key={idx} 
                          href={item.path} 
                          className="flex items-start gap-3 p-2.5 bg-neutral-900/40 hover:bg-purple-950/30 border border-neutral-900 hover:border-purple-800/50 rounded-2xl transition-all group"
                        >
                          <div className={`h-8 w-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform shrink-0 mt-0.5`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-[11px] font-black uppercase tracking-wider text-white group-hover:text-purple-300 transition-colors flex items-center gap-1">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-neutral-400 mt-0.5 leading-normal font-medium">{item.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Builder dropdown menu trigger */}
            <div 
              className="relative py-2 cursor-pointer group"
              onMouseEnter={() => setActiveDropdown('builder')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <span className="hover:text-white transition-colors flex items-center gap-1">
                Builder <ChevronDown className="h-3.5 w-3.5" />
              </span>
              
              <AnimatePresence>
                {activeDropdown === 'builder' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-10 left-1/2 -translate-x-1/2 w-[420px] bg-neutral-950/95 backdrop-blur-md border border-neutral-900 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 text-left space-y-4"
                  >
                    <div className="space-y-3.5">
                      {[
                        { title: "AI Resume Builder", desc: "Millions have trusted our resume maker.", path: "/builder" },
                        { title: "AI Cover Letter Generator", desc: "Create a cover letter to land your dream job.", path: "/cover-letter" },
                        { title: "CV Maker", desc: "Easily build a CV that paves the way to your dream job.", path: "/builder" }
                      ].map((item, idx) => (
                        <Link 
                          key={idx} 
                          href={item.path}
                          className="flex items-start gap-4 p-3 bg-neutral-900/20 border border-neutral-900 hover:border-neutral-800 hover:bg-neutral-900/60 rounded-2xl transition-all group"
                        >
                          <div className="h-9 w-9 rounded-xl bg-purple-950/40 border border-purple-900/40 flex items-center justify-center text-purple-400 group-hover:text-white group-hover:bg-purple-900 transition-colors shrink-0">
                            <Zap className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-white">{item.title}</h4>
                            <p className="text-[10px] text-neutral-400 mt-1 leading-normal font-medium">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* More (...) dropdown menu trigger */}
            <div 
              className="relative py-2 cursor-pointer group"
              onMouseEnter={() => setActiveDropdown('more')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <span className="hover:text-white transition-colors flex items-center justify-center p-1.5 rounded-lg bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 text-neutral-300">
                <MoreHorizontal className="h-4 w-4" />
              </span>
              
              <AnimatePresence>
                {activeDropdown === 'more' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-10 right-0 w-[280px] bg-neutral-950/95 backdrop-blur-2xl border border-neutral-850 rounded-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 text-left space-y-1"
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 px-3 py-1 block">More Resources</span>
                    {[
                      { title: "Resume Templates", desc: "Customizable layouts & ATS styles", path: "/builder", icon: Layers },
                      { title: "ATS Resume Checker", desc: "Audit keywords & ATS score", path: "/ats-checker", icon: ShieldCheck },
                      { title: "CV Maker & Examples", desc: "Build professional academic CVs", path: "/builder", icon: Zap },
                      { title: "AI Cover Letter Generator", desc: "Tailored cover letters in minutes", path: "/cover-letter", icon: FileText },
                      { title: "Career Advice & FAQ", desc: "Expert tips & answering questions", path: "#faq", icon: BookOpen },
                      { title: "Resources & Tools", desc: "Explore tools & documentation", path: "#features", icon: Cpu }
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <Link 
                          key={idx} 
                          href={item.path} 
                          className="flex items-start gap-3 p-2.5 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 rounded-xl transition-all group block"
                        >
                          <div className="h-7 w-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-purple-400 shrink-0 mt-0.5">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">{item.title}</h4>
                            <p className="text-[10px] text-neutral-400 leading-tight font-medium">{item.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Desktop Navigation Controls (Hidden on Mobile) */}
            <div className="hidden md:flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setIsHistoryOpen(true)}
                className="h-9 w-9 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-600 flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer"
                title="View History"
              >
                <History className="h-4 w-4" />
              </motion.button>

              {userProfile ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 px-3 py-1.5 rounded-full transition-all cursor-pointer"
                  >
                    <div className="h-6 w-6 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60 flex items-center justify-center text-xs font-black uppercase">
                      {userProfile.name ? userProfile.name.charAt(0) : 'U'}
                    </div>
                    <span className="text-xs font-bold text-white max-w-[120px] truncate">{userProfile.name}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
                  </button>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-neutral-950 border border-neutral-850 rounded-2xl p-3 shadow-2xl z-50 text-left"
                      >
                        <div className="p-2.5 border-b border-neutral-900 mb-2">
                          <p className="text-xs font-bold text-white truncate">{userProfile.name}</p>
                          {userProfile.email && <p className="text-[10px] text-neutral-400 truncate mt-0.5">{userProfile.email}</p>}
                          <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase rounded-md">
                            Verified Member
                          </span>
                        </div>

                        <div className="space-y-1">
                          <Link
                            href="/dashboard"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center space-x-2 px-2.5 py-2 text-xs font-bold text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition-all"
                          >
                            <User className="h-3.5 w-3.5 text-purple-400" />
                            <span>Dashboard & Portfolio</span>
                          </Link>

                          <Link
                            href="/builder?type=resume"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center space-x-2 px-2.5 py-2 text-xs font-bold text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition-all"
                          >
                            <FileText className="h-3.5 w-3.5 text-purple-400" />
                            <span>My Resume Editor</span>
                          </Link>

                          <Link
                            href="/builder?type=cv"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center space-x-2 px-2.5 py-2 text-xs font-bold text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition-all"
                          >
                            <GraduationCap className="h-3.5 w-3.5 text-purple-400" />
                            <span>My CV Editor</span>
                          </Link>

                          <Link
                            href="/cover-letter"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center space-x-2 px-2.5 py-2 text-xs font-bold text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition-all"
                          >
                            <Mail className="h-3.5 w-3.5 text-purple-400" />
                            <span>Cover Letter Writer</span>
                          </Link>

                          <Link
                            href="/chatbot"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center space-x-2 px-2.5 py-2 text-xs font-bold text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition-all"
                          >
                            <Bot className="h-3.5 w-3.5 text-purple-400" />
                            <span>AI Assistant Chatbot</span>
                          </Link>

                          <div className="pt-1 border-t border-neutral-900">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center space-x-2 px-2.5 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-xl transition-all text-left cursor-pointer"
                            >
                              <LogOut className="h-3.5 w-3.5 text-red-400" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/auth/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                  Sign In
                </Link>
              )}

              <motion.button 
                whileHover={{ scale: 1.04, boxShadow: '0 0 25px rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setIsBuildModalOpen(true)} 
                className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-md transition-colors duration-200 cursor-pointer"
              >
                Build
              </motion.button>
            </div>

            {/* Mobile 3-Line Hamburger Bar Button (Visible ONLY on Mobile) */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 text-neutral-300 hover:text-white rounded-xl bg-neutral-900 border border-neutral-800 hover:border-purple-600 transition-colors flex items-center justify-center cursor-pointer shadow-lg"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-purple-400" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-neutral-950/98 border-t border-neutral-900 px-6 py-6 space-y-5 text-left overflow-hidden z-50 mt-4 shadow-2xl backdrop-blur-2xl"
            >
              {/* Mobile User Profile Section */}
              {userProfile && (
                <div className="flex items-center justify-between p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-purple-950 text-purple-300 border border-purple-800 flex items-center justify-center font-black uppercase text-xs">
                      {userProfile.name ? userProfile.name.charAt(0) : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-white truncate">{userProfile.name}</p>
                      {userProfile.email && <p className="text-[10px] text-neutral-400 truncate">{userProfile.email}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="p-2 text-red-400 hover:bg-red-950/30 rounded-xl cursor-pointer shrink-0"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Main Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsBuildModalOpen(true);
                  }}
                  className="py-3 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <Zap className="h-4 w-4 fill-black" />
                  <span>Build Resume</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsUploadModalOpen(true);
                  }}
                  className="py-3 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Upload className="h-4 w-4 text-purple-400" />
                  <span>Upload PDF</span>
                </button>
              </div>

              {/* Navigation Items List */}
              <div className="space-y-1 pt-2 border-t border-neutral-900">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block px-2 mb-1">Navigation Menu</span>
                {[
                  { title: "Home Workspace", path: "/", icon: Sparkles, color: "text-purple-400" },
                  { title: "AI Resume Builder", path: "/builder?type=resume", icon: Zap, color: "text-purple-400" },
                  { title: "Academic CV Maker", path: "/builder?type=cv", icon: GraduationCap, color: "text-indigo-400" },
                  { title: "ATS Resume Checker & Score", path: "/ats-checker", icon: ShieldCheck, color: "text-emerald-400" },
                  { title: "AI Cover Letter Architect", path: "/cover-letter", icon: Mail, color: "text-blue-400" },
                  { title: "AI Career Assistant Chat", path: "/chatbot", icon: Bot, color: "text-pink-400" },
                  { title: "Features & Diagnostics", path: "/dashboard?tab=recruiter", icon: Layers, color: "text-cyan-400" }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={idx}
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 p-3 bg-neutral-900/30 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 rounded-xl transition-all"
                    >
                      <div className={`h-8 w-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center ${item.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-white">{item.title}</span>
                    </Link>
                  );
                })}

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsHistoryOpen(true);
                  }}
                  className="w-full flex items-center space-x-3 p-3 bg-neutral-900/30 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 rounded-xl transition-all text-left cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
                    <History className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-white">Document History &amp; Saved Drafts</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Copy */}
          <motion.div 
            className="lg:col-span-7 space-y-8 text-left z-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold tracking-wide text-neutral-400">
              <Sparkles className="h-3 w-3 text-purple-400 animate-pulse" />
              <span>Tailored ATS Resume Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-white">
              Build an <span className="luxury-text-gradient bg-clip-text">ATS-Optimized</span> Resume in <span className="luxury-text-gradient bg-clip-text">Minutes</span> with AI
            </h1>

            <p className="text-neutral-400 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Create, optimize, and tailor your resume for every job using advanced AI. Land 3x more interviews with industry-designed luxury layouts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={() => setIsBuildModalOpen(true)} 
                className="group px-8 py-4 bg-white text-black hover:bg-neutral-200 font-bold uppercase text-xs tracking-wider rounded-md transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_4px_30px_rgba(255,255,255,0.15)] cursor-pointer"
              >
                <span>Build</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="px-8 py-4 bg-transparent border border-neutral-800 hover:border-white text-white font-bold uppercase text-xs tracking-wider rounded-md transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </button>
              <button 
                onClick={() => setIsAiModalOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-950/20 to-pink-950/20 border border-purple-900/50 hover:border-purple-400 text-purple-200 font-bold uppercase text-xs tracking-wider rounded-md transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                <span>AI Builder</span>
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-900">
              <div>
                <h4 className="text-3xl font-extrabold">98%</h4>
                <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold mt-1">ATS Pass Rate</p>
              </div>
              <div>
                <h4 className="text-3xl font-extrabold">3.2x</h4>
                <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold mt-1">Interview Rate</p>
              </div>
              <div>
                <h4 className="text-3xl font-extrabold">12m+</h4>
                <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold mt-1">AI Words Written</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Floating Visuals */}
          <motion.div 
            className="lg:col-span-5 relative flex justify-center items-center h-[450px] w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Background glowing gradients */}
            <div className="absolute w-72 h-72 rounded-full bg-blue-500/10 blur-[80px] -top-10 -right-10 z-0"></div>
            <div className="absolute w-72 h-72 rounded-full bg-purple-500/10 blur-[80px] -bottom-10 -left-10 z-0"></div>

            {/* AI Resume Maker Mock UI Panel */}
            <motion.div 
              className="w-full max-w-sm glass-card p-6 rounded-2xl border border-neutral-850 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-md text-left z-10 mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-900 mb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-300">AI Resume Maker</span>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>

              {/* Step 1: Prompt Input */}
              <div className="space-y-2 mb-4">
                <div className="text-[9px] uppercase font-bold tracking-wider text-neutral-500">Generation Prompt</div>
                <div className="p-3 bg-neutral-950/80 border border-neutral-900 rounded-lg flex items-start space-x-2">
                  <span className="text-purple-400 text-xs mt-0.5">&gt;</span>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                    &ldquo;Write a professional summary for a Lead Frontend Engineer emphasizing Next.js, performance optimization, and scale.&rdquo;
                  </p>
                </div>
              </div>

              {/* Step 2: Generation Progress */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-wider">
                  <span className="text-neutral-500 font-semibold">Drafting achievements...</span>
                  <span className="text-purple-400 font-extrabold animate-pulse">Running AI</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-850">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    animate={{ width: ["10%", "90%", "10%"] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  />
                </div>
              </div>

              {/* Step 3: Streamed Output */}
              <div className="space-y-2">
                <div className="text-[9px] uppercase font-bold tracking-wider text-neutral-500">Live AI Output Draft</div>
                <div className="p-3.5 bg-neutral-950/40 border border-neutral-900 rounded-lg space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      <span>✓ MATCH SCORE OPTIMIZED</span>
                      <span className="bg-emerald-950/80 text-emerald-400 text-[8px] px-1.5 py-0.5 rounded border border-emerald-900 font-black uppercase">98%</span>
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-relaxed font-sans mt-1.5">
                      &ldquo;Engineered Next.js micro-frontends with React, reducing page load latency by 35%.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Back Accent Circle */}
            <div className="absolute w-[360px] h-[360px] rounded-full border border-neutral-900 border-dashed z-0 animate-[spin_100s_linear_infinite]"></div>
          </motion.div>

        </div>
      </section>

      {/* Trusted Companies */}
      <section className="py-12 border-y border-neutral-900 bg-neutral-950/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-6">Our Users work at leading firms worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-30 grayscale contrast-200">
            <span className="text-lg font-black tracking-tighter">GOOGLE</span>
            <span className="text-lg font-black tracking-tighter">APPLE</span>
            <span className="text-lg font-black tracking-tighter">STRIPE</span>
            <span className="text-lg font-black tracking-tighter">VERCEL</span>
            <span className="text-lg font-black tracking-tighter">BLOOMBERG</span>
            <span className="text-lg font-black tracking-tighter">NETFLIX</span>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-4 mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold tracking-wide text-neutral-400">
              <Cpu className="h-3 w-3 text-blue-400" />
              <span>Full Suite AI Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Engineered to <span className="luxury-text-gradient bg-clip-text">Land Interviews</span>
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto text-sm sm:text-base font-normal">
              A suite of tools engineered for modern job markets, helping you write achievements, scan for keyword compliance, and format professionally.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {/* Build Custom Feature Card */}
            <div 
              onClick={() => setIsAddFeatureModalOpen(true)} 
              className="block group h-full cursor-pointer"
            >
              <motion.div 
                className="glass-card p-8 rounded-xl border border-dashed border-purple-500/80 hover:border-purple-400 bg-purple-950/20 hover:bg-purple-950/40 text-left h-full group-hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between shadow-lg shadow-purple-950/30" 
                variants={itemVariants}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-10 w-10 rounded-lg bg-purple-900/60 border border-purple-700/50 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-purple-300" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 bg-purple-900/80 text-purple-200 rounded">
                      + BUILD YOUR OWN
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold mb-2 text-white">+ Add Custom Feature</h3>
                  <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-medium">
                    Add your own custom AI tool, generator, or external resource to your personal feature suite.
                  </p>
                </div>
                <div className="w-full py-2.5 mt-6 border border-dashed border-purple-800/80 rounded-lg bg-neutral-950/80 flex items-center justify-center space-x-2 group-hover:border-purple-500 transition-colors">
                  <Plus className="h-4 w-4 text-purple-400" />
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">+ Create Custom Tool</span>
                </div>
              </motion.div>
            </div>

            {/* Custom Features Added by User */}
            {customFeatures.map((feat) => (
              <div 
                key={feat.id} 
                onClick={() => router.push(feat.link)} 
                className="block group h-full cursor-pointer"
              >
                <motion.div className="glass-card p-8 rounded-xl border border-purple-900/50 bg-purple-950/10 text-left h-full group-hover:border-purple-500 group-hover:scale-[1.02] transition-all duration-300" variants={itemVariants}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-10 w-10 rounded-lg bg-purple-950 border border-purple-800 flex items-center justify-center">
                      {feat.icon === 'zap' ? <Zap className="h-5 w-5 text-purple-400" /> :
                       feat.icon === 'cpu' ? <Cpu className="h-5 w-5 text-purple-400" /> :
                       feat.icon === 'briefcase' ? <Briefcase className="h-5 w-5 text-purple-400" /> :
                       feat.icon === 'shield' ? <ShieldCheck className="h-5 w-5 text-purple-400" /> :
                       feat.icon === 'globe' ? <Globe className="h-5 w-5 text-purple-400" /> :
                       <Sparkles className="h-5 w-5 text-purple-400" />}
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 bg-purple-900/80 text-purple-200 rounded">
                      CUSTOM TOOL
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold mb-2 text-white">{feat.title}</h3>
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </motion.div>
              </div>
            ))}
            {/* Feature 1 */}
            <div onClick={() => router.push('/builder?type=resume')} className="block group h-full cursor-pointer">
              <motion.div className="glass-card p-8 rounded-xl border border-neutral-800 text-left h-full group-hover:border-neutral-500 group-hover:scale-[1.02] transition-all duration-300" variants={itemVariants}>
                <div className="h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                  <Sparkles className={`h-5 w-5 ${accent.text}`} />
                </div>
                <h3 className="text-lg font-extrabold mb-2">Resume Writer &amp; Rewriter</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Generate highly relevant, industry-specific professional summaries and experience descriptions instantly. Choose from friendly, corporate, or executive tones.
                </p>
              </motion.div>
            </div>

            {/* Feature 2 */}
            <div onClick={() => router.push('/ats-checker')} className="block group h-full cursor-pointer">
              <motion.div className="glass-card p-8 rounded-xl border border-neutral-800 text-left h-full group-hover:border-neutral-500 group-hover:scale-[1.02] transition-all duration-300" variants={itemVariants}>
                <div className="h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                  <Sliders className={`h-5 w-5 ${accent.text}`} />
                </div>
                <h3 className="text-lg font-extrabold mb-2">ATS Score &amp; Checker</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Paste job descriptions to check keyword gaps. Get direct scores out of 100 on how your resume performs against automated filters.
                </p>
              </motion.div>
            </div>

            {/* Feature 3 */}
            <div onClick={() => router.push('/parser')} className="block group h-full cursor-pointer">
              <motion.div className="glass-card p-8 rounded-xl border border-neutral-800 text-left h-full group-hover:border-neutral-500 group-hover:scale-[1.02] transition-all duration-300" variants={itemVariants}>
                <div className="h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                  <Upload className={`h-5 w-5 ${accent.text}`} />
                </div>
                <h3 className="text-lg font-extrabold mb-2">PDF Parser &amp; Ingestion</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Drag-and-drop a PDF. Our parser splits the text, auto-populates experiences, education, and skills inside the builder within seconds.
                </p>
              </motion.div>
            </div>

            {/* Feature 4 */}
            <div onClick={() => router.push('/cover-letter')} className="block group h-full cursor-pointer">
              <motion.div className="glass-card p-8 rounded-xl border border-neutral-800 text-left h-full group-hover:border-neutral-500 group-hover:scale-[1.02] transition-all duration-300" variants={itemVariants}>
                <div className="h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                  <FileText className={`h-5 w-5 ${accent.text}`} />
                </div>
                <h3 className="text-lg font-extrabold mb-2">Cover Letter Generator</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Create highly tailored, contextual cover letters that reference specific experience items from your resume to match the targeted role.
                </p>
              </motion.div>
            </div>

            {/* Feature 5 */}
            <div onClick={() => router.push('/dashboard?tab=health')} className="block group h-full cursor-pointer">
              <motion.div className="glass-card p-8 rounded-xl border border-neutral-800 text-left h-full group-hover:border-neutral-500 group-hover:scale-[1.02] transition-all duration-300" variants={itemVariants}>
                <div className="h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                  <ShieldCheck className={`h-5 w-5 ${accent.text}`} />
                </div>
                <h3 className="text-lg font-extrabold mb-2">Resume Health &amp; Diagnostics</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Comprehensive audit of overall health index, formatting density, grammar, readability, keyword density, and action verb dominance.
                </p>
              </motion.div>
            </div>

            {/* Feature 6 */}
            <div onClick={() => router.push('/dashboard?tab=tailor')} className="block group h-full cursor-pointer">
              <motion.div className="glass-card p-8 rounded-xl border border-neutral-800 text-left h-full group-hover:border-neutral-500 group-hover:scale-[1.02] transition-all duration-300" variants={itemVariants}>
                <div className="h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                  <Layers className={`h-5 w-5 ${accent.text}`} />
                </div>
                <h3 className="text-lg font-extrabold mb-2">AI Resume Tailoring</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Tailor your bullet points and skills instantly to target specific company job descriptions to maximize ATS match probability.
                </p>
              </motion.div>
            </div>

            {/* Feature 7 */}
            <div onClick={() => router.push('/dashboard?tab=recruiter')} className="block group h-full cursor-pointer">
              <motion.div className="glass-card p-8 rounded-xl border border-neutral-800 text-left h-full group-hover:border-neutral-500 group-hover:scale-[1.02] transition-all duration-300" variants={itemVariants}>
                <div className="h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                  <Eye className={`h-5 w-5 ${accent.text}`} />
                </div>
                <h3 className="text-lg font-extrabold mb-2">Recruiter 6-Sec Scan Heatmap</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Simulate how recruiters glance at your resume in 6 seconds. Identify focal points, visual hierarchy, and eye-tracking hotspots.
                </p>
              </motion.div>
            </div>

            {/* Feature 8 */}
            <div onClick={() => router.push('/dashboard?tab=tracker')} className="block group h-full cursor-pointer">
              <motion.div className="glass-card p-8 rounded-xl border border-neutral-800 text-left h-full group-hover:border-neutral-500 group-hover:scale-[1.02] transition-all duration-300" variants={itemVariants}>
                <div className="h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                  <FileCheck className={`h-5 w-5 ${accent.text}`} />
                </div>
                <h3 className="text-lg font-extrabold mb-2">Kanban Application Tracker</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Organize your job hunt across Wishlist, Applied, Interviewing, and Offer stages with drag-and-drop Kanban tracking.
                </p>
              </motion.div>
            </div>

            {/* Feature 9 */}
            <div onClick={() => router.push('/dashboard?tab=matching')} className="block group h-full cursor-pointer">
              <motion.div className="glass-card p-8 rounded-xl border border-neutral-800 text-left h-full group-hover:border-neutral-500 group-hover:scale-[1.02] transition-all duration-300" variants={itemVariants}>
                <div className="h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                  <Briefcase className={`h-5 w-5 ${accent.text}`} />
                </div>
                <h3 className="text-lg font-extrabold mb-2">Job Match Compatibility</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Compare your active resume with arbitrary role parameters. Discover missing certificates or technical skill definitions required by employers.
                </p>
              </motion.div>
            </div>

            {/* Feature 10 */}
            <div onClick={() => router.push('/dashboard?tab=gap')} className="block group h-full cursor-pointer">
              <motion.div className="glass-card p-8 rounded-xl border border-neutral-800 text-left h-full group-hover:border-neutral-500 group-hover:scale-[1.02] transition-all duration-300" variants={itemVariants}>
                <div className="h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                  <FileSpreadsheet className={`h-5 w-5 ${accent.text}`} />
                </div>
                <h3 className="text-lg font-extrabold mb-2">Skill Gap Analysis</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Identify missing skills compared to market requirements and get curated course and certification recommendations to boost hiring potential.
                </p>
              </motion.div>
            </div>

            {/* Feature 11 */}
            <div onClick={() => router.push('/dashboard?tab=roadmap')} className="block group h-full cursor-pointer">
              <motion.div className="glass-card p-8 rounded-xl border border-neutral-800 text-left h-full group-hover:border-neutral-500 group-hover:scale-[1.02] transition-all duration-300" variants={itemVariants}>
                <div className="h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                  <Map className={`h-5 w-5 ${accent.text}`} />
                </div>
                <h3 className="text-lg font-extrabold mb-2">Career Roadmap Builder</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Visualize your step-by-step career progression from Junior SDE to Staff Engineer / Tech Lead with milestone tracking.
                </p>
              </motion.div>
            </div>

            {/* Feature 12 */}
            <div onClick={() => router.push('/dashboard?tab=portfolio')} className="block group h-full cursor-pointer">
              <motion.div className="glass-card p-8 rounded-xl border border-neutral-800 text-left h-full group-hover:border-neutral-500 group-hover:scale-[1.02] transition-all duration-300" variants={itemVariants}>
                <div className="h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                  <Globe className={`h-5 w-5 ${accent.text}`} />
                </div>
                <h3 className="text-lg font-extrabold mb-2">Portfolio Website Builder</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Turn your resume data into a published, responsive personal portfolio website with custom domains and analytics.
                </p>
              </motion.div>
            </div>

            {/* Feature 13 */}
            <div onClick={() => router.push('/dashboard?tab=interview')} className="block group h-full cursor-pointer">
              <motion.div className="glass-card p-8 rounded-xl border border-neutral-800 text-left h-full group-hover:border-neutral-500 group-hover:scale-[1.02] transition-all duration-300" variants={itemVariants}>
                <div className="h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                  <Volume2 className={`h-5 w-5 ${accent.text}`} />
                </div>
                <h3 className="text-lg font-extrabold mb-2">AI Mock Interview Coach</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Practice HR, Technical, and Behavioral interview questions tailored to your targeted role with automated AI scoring.
                </p>
              </motion.div>
            </div>

            {/* Feature 14 */}
            <div onClick={() => router.push('/dashboard?tab=linkedin')} className="block group h-full cursor-pointer">
              <motion.div className="glass-card p-8 rounded-xl border border-neutral-800 text-left h-full group-hover:border-neutral-500 group-hover:scale-[1.02] transition-all duration-300" variants={itemVariants}>
                <div className="h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                  <Linkedin className={`h-5 w-5 ${accent.text}`} />
                </div>
                <h3 className="text-lg font-extrabold mb-2">LinkedIn Profile Optimizer</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Optimize your LinkedIn headline, About section, and featured skills to dramatically increase recruiter outreach messages.
                </p>
              </motion.div>
            </div>

            {/* Feature 15 */}
            <div onClick={() => router.push('/chatbot')} className="block group h-full cursor-pointer">
              <motion.div className="glass-card p-8 rounded-xl border border-neutral-800 text-left h-full group-hover:border-neutral-500 group-hover:scale-[1.02] transition-all duration-300" variants={itemVariants}>
                <div className="h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                  <MessageSquareShare className={`h-5 w-5 ${accent.text}`} />
                </div>
                <h3 className="text-lg font-extrabold mb-2">Interactive Chat Assistant</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Get real-time feedback and structured suggestions on your styling, formatting, or section details from our floating AI chat companion.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-24 px-6 bg-neutral-950/20 border-t border-neutral-900 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Template Selector & Info */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold tracking-wide text-neutral-400">
                <Layers className="h-3 w-3 text-purple-400" />
                <span>Modern Templates Showcase</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none text-white">
                Exquisite <span className="luxury-text-gradient bg-clip-text">Design Patterns</span>
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-normal">
                Toggle between our luxury black-and-white templates. Crafted to balance elegant aesthetics with parsing readability.
              </p>

              {/* Selector Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-4">
                {(['minimal', 'executive', 'creative', 'ats-friendly', 'modern', 'corporate', 'elegant', 'dark', 'professional', 'luxury', 'btech-fresher'] as const).map((temp) => (
                  <button
                    key={temp}
                    onClick={() => setSelectedTemplate(temp)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg border transition-all duration-300 flex items-center justify-between",
                      selectedTemplate === temp
                        ? "bg-white text-black border-white font-extrabold"
                        : "bg-transparent border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
                    )}
                  >
                    <span className="capitalize text-[10px] font-bold uppercase tracking-wider">{temp.replace('-', ' ')}</span>
                    {selectedTemplate === temp && <CheckCircle2 className="h-3.5 w-3.5 text-black shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Preview Display */}
            <div className="lg:col-span-7 bg-neutral-950 border border-neutral-900 rounded-xl p-8 shadow-[0_10px_50px_rgba(0,0,0,0.8)] min-h-[420px] flex flex-col justify-between relative overflow-hidden">
              {/* Luxury Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 accent-purple-gradient"></div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={cn(
                      "font-bold tracking-tight text-white",
                      (selectedTemplate === 'executive' || selectedTemplate === 'luxury' || selectedTemplate === 'elegant') && "font-serif text-2xl uppercase tracking-widest",
                      selectedTemplate === 'luxury' && "text-[#D4AF37]",
                      selectedTemplate === 'creative' && "font-mono text-xl tracking-tighter lowercase",
                      selectedTemplate === 'modern' && "font-sans text-xl font-black uppercase tracking-tight",
                      selectedTemplate === 'corporate' && "font-serif text-xl border-l-4 border-neutral-600 pl-3",
                      selectedTemplate === 'minimal' && "text-xl",
                      selectedTemplate === 'ats-friendly' && "text-lg font-sans",
                      selectedTemplate === 'dark' && "text-xl text-emerald-400",
                      selectedTemplate === 'professional' && "text-xl border-b border-neutral-800 pb-1",
                      selectedTemplate === 'btech-fresher' && "font-sans text-xl font-extrabold uppercase tracking-tight text-purple-400"
                    )}>
                      {templatePreviews[selectedTemplate].title}
                    </h3>
                    <p className={cn(
                      "text-xs text-neutral-400 mt-1",
                      (selectedTemplate === 'executive' || selectedTemplate === 'luxury') && "uppercase tracking-widest text-[10px]",
                      selectedTemplate === 'creative' && "font-mono lowercase text-purple-400",
                      selectedTemplate === 'btech-fresher' && "uppercase tracking-widest text-[10px] text-purple-300 font-bold"
                    )}>
                      {templatePreviews[selectedTemplate].role}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-neutral-900 rounded-full border border-neutral-800 text-[10px] uppercase font-bold text-neutral-500">
                    {selectedTemplate} layout
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-900 space-y-4">
                  <h4 className="text-xs uppercase tracking-wider text-neutral-500 font-bold">Professional Summary</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-normal italic">
                    {templatePreviews[selectedTemplate].summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-900 space-y-4">
                  <h4 className="text-xs uppercase tracking-wider text-neutral-500 font-bold">Experience</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-normal whitespace-pre-line">
                    {templatePreviews[selectedTemplate].exp}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-900 flex justify-between items-center">
                <span className="text-[10px] text-neutral-600 uppercase font-bold tracking-widest">Designed for standard A4 & Letter printing</span>
                <Link href="/builder" className="text-xs font-bold uppercase tracking-wider text-white hover:text-neutral-400 flex items-center space-x-1">
                  <span>Edit in Builder</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ATS Scan Section */}
      <section id="ats" className="py-24 px-6 border-t border-neutral-900 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual simulation of scan */}
            <div className="lg:col-span-6 space-y-6 bg-neutral-950 border border-neutral-900 rounded-xl p-8 order-2 lg:order-1 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span className="text-xs font-bold tracking-wider uppercase">ATS Parser Validation</span>
                </div>
                <span className="text-[10px] text-neutral-500">Live Analyzer v2.4</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Job Target: Senior Web Developer</span>
                    <span className="text-white font-bold">78% Match</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-900 rounded overflow-hidden">
                    <div className="h-full bg-blue-500 w-[78%]"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-900">
                  <div className="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800/50">
                    <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Detected Skills</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-[9px] bg-neutral-900 border border-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">React</span>
                      <span className="text-[9px] bg-neutral-900 border border-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">Next.js</span>
                      <span className="text-[9px] bg-neutral-900 border border-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">Postgres</span>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800/50">
                    <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Missing Keywords</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-[9px] bg-red-950/20 border border-red-900/30 text-red-400 px-1.5 py-0.5 rounded">Kubernetes</span>
                      <span className="text-[9px] bg-red-950/20 border border-red-900/30 text-red-400 px-1.5 py-0.5 rounded">CI/CD</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-neutral-900/30 rounded-lg border border-neutral-900 text-[11px] leading-relaxed text-neutral-400">
                  <span className="text-[10px] text-white font-extrabold uppercase tracking-wide block mb-1">Suggestions</span>
                  Add &ldquo;Kubernetes orchestration&rdquo; and &ldquo;configured Github Actions CI/CD pipeline&rdquo; to your experiences at Vortex Labs to match role compliance.
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="lg:col-span-6 space-y-6 text-left order-1 lg:order-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold tracking-wide text-neutral-400">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span>ATS Document Audit</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none text-white">
                Bypass the <span className="luxury-text-gradient bg-clip-text">ATS Filter</span> Safeguards
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-normal">
                Over 75% of job applications are discarded by Applicant Tracking Systems before a recruiter reads them. Our analyzer identifies missing tags, parses layout syntax, and optimizes your match score for resumes, CVs, and cover letters.
              </p>
              <div className="pt-2">
                <Link href="/ats-checker" className="px-6 py-3 bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider rounded transition-all duration-300 inline-flex items-center space-x-2">
                  <span>Run Free ATS Audit</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 border-t border-neutral-900 relative">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Frequently Asked <span className="luxury-text-gradient bg-clip-text">Questions</span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Got questions? We have responses.
            </p>
          </div>

          <div className="space-y-4 text-left">
            {faqData.map((item, index) => (
              <div 
                key={index} 
                className="border border-neutral-900 rounded-lg overflow-hidden bg-neutral-950/20"
              >
                <button
                  onClick={() => setActiveFaq(prev => prev === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm tracking-wide text-white hover:bg-neutral-950 transition-colors focus:outline-none"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={cn("h-4 w-4 text-neutral-500 transition-transform duration-150", activeFaq === index && "transform rotate-180 text-white")} />
                </button>
                
                <AnimatePresence initial={false}>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                    >
                      <p className="p-5 pt-0 text-neutral-400 text-xs sm:text-sm font-normal leading-relaxed border-t border-neutral-950">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-16 px-6 relative z-10 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-extrabold text-base tracking-wider text-white">MIRA <span className="text-purple-400 font-normal">AI</span></span>
            </div>
            <p className="text-neutral-500 max-w-xs font-normal leading-relaxed">
              Premium ATS-optimized resume builder software, crafted to elevate professional careers using advanced AI.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Product</h4>
            <div className="flex flex-col space-y-2 text-neutral-400">
              <Link href="/builder" className="hover:text-white transition-colors">Resume Builder</Link>
              <Link href="/ats-checker" className="hover:text-white transition-colors">ATS Auditor</Link>
              <Link href="/parser" className="hover:text-white transition-colors">PDF Parser</Link>
              <Link href="/cover-letter" className="hover:text-white transition-colors">Cover Letter Gen</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Aesthetics</h4>
            <div className="flex flex-col space-y-2 text-neutral-400">
              <button onClick={() => setInfoModal({ title: 'Minimal Layout', desc: 'A clean, single-column design with generous whitespace. Perfect for tech and corporate roles where recruiters prioritize clarity and scanability. Uses a simple typographic hierarchy with no distracting visual elements — ideal for ATS systems.' })} className="text-left hover:text-white transition-colors">Minimal Layout</button>
              <button onClick={() => setInfoModal({ title: 'Executive Serif', desc: 'A premium serif-font layout with classic elegance. Designed for senior professionals, C-suite executives, and leadership roles. Features refined typography, a dignified structure, and subtle accent lines that convey authority and experience.' })} className="text-left hover:text-white transition-colors">Executive Serif</button>
              <button onClick={() => setInfoModal({ title: 'Creative Mono', desc: 'A bold monospace-inspired design built for designers, developers, and creatives. Features distinctive heading styles, code-aesthetic typography, and a layout that highlights portfolio-style achievements and projects.' })} className="text-left hover:text-white transition-colors">Creative Mono</button>
              <button onClick={() => setInfoModal({ title: 'ATS Structural', desc: 'The most ATS-optimized template in our collection. Uses machine-readable plain text formatting with no tables, columns, or graphics. Every element is structured to pass even the strictest applicant tracking system parsers.' })} className="text-left hover:text-white transition-colors">ATS Structural</button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Company</h4>
            <div className="flex flex-col space-y-2 text-neutral-400">
              <button onClick={() => setInfoModal({ title: 'Privacy Policy', desc: 'Mira AI is committed to protecting your data. We never sell or share your personal information or resume content with third parties. All data is encrypted at rest and in transit using industry-standard AES-256 encryption. You can delete your account and all associated data at any time.' })} className="text-left hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => setInfoModal({ title: 'Terms of Service', desc: 'By using Mira AI, you agree to use the platform for legitimate professional career development purposes only. AI-generated content remains yours to use freely. We reserve the right to suspend accounts that misuse the platform. The free tier is provided as-is without warranty.' })} className="text-left hover:text-white transition-colors">Terms of Service</button>
              <a href="mailto:support@mira.ai" className="hover:text-white transition-colors">Support Desk</a>
              <button onClick={() => setInfoModal({ title: 'API Keys', desc: 'Mira AI provides a developer API for integrating resume parsing, ATS scoring, and AI content generation into your own applications. API keys can be generated from your account settings. Rate limits apply per tier. Contact us for enterprise access.' })} className="text-left hover:text-white transition-colors">API Keys</button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-neutral-600 font-medium gap-4">
          <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} Mira AI. All rights reserved.</p>
          
          <p className="text-xs sm:text-sm tracking-wide text-center">
            <span className="text-white font-extrabold uppercase">KARAMALA ABHIRAM VIKASH</span>
            <span className="text-neutral-850 mx-2">|</span>
            <span className="text-purple-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest">Founder & CEO of </span>
            <span className="text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">MIRA </span>
            <span className="text-purple-400 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">AI</span>
          </p>

          <div className="flex space-x-6 justify-center sm:justify-end">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors">Twitter</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>

      {/* Info Modal */}
      <AnimatePresence>
        {infoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInfoModal(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-10 text-left"
            >
              <div className="absolute top-0 left-1/4 w-72 h-40 bg-purple-500/8 rounded-full blur-[80px] pointer-events-none" />
              <button
                onClick={() => setInfoModal(null)}
                className="absolute top-5 right-5 h-8 w-8 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-600 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
              >
                <X className="h-4 w-4" />
              </button>
              <h3 className="text-lg font-extrabold uppercase tracking-wider text-white mb-3">{infoModal.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-normal">{infoModal.desc}</p>
              <button
                onClick={() => setInfoModal(null)}
                className="mt-6 px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Selection Modal */}
      <AnimatePresence>
        {isBuildModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBuildModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-neutral-950 border border-neutral-900 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden z-10 text-left"
            >
              {/* Purple radial glow */}
              <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

              {/* Close Button */}
              <button 
                onClick={() => setIsBuildModalOpen(false)}
                className="absolute top-6 right-6 h-8 w-8 rounded-full bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 hover:border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-wider text-white">Create New Document</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-semibold uppercase tracking-wider">Select the type of career asset you want to design with MIRA AI</p>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-2">
                  {[
                    {
                      title: "AI Resume Builder",
                      desc: "ATS-optimized corporate design to clear recruiters systems.",
                      path: "/builder",
                      color: "text-purple-400 bg-purple-950/20 border-purple-900/40",
                      hoverColor: "hover:border-purple-400 hover:bg-purple-900/10",
                      icon: Zap
                    },
                    {
                      title: "CV Maker",
                      desc: "Comprehensive multi-page format detailing detailed careers.",
                      path: "/builder",
                      color: "text-blue-400 bg-blue-950/20 border-blue-900/40",
                      hoverColor: "hover:border-blue-400 hover:bg-blue-900/10",
                      icon: Layers
                    },
                    {
                      title: "AI Cover Letter",
                      desc: "Custom-tailored letter addressing specific job target specifications.",
                      path: "/cover-letter",
                      color: "text-emerald-400 bg-emerald-950/20 border-emerald-900/40",
                      hoverColor: "hover:border-emerald-400 hover:bg-emerald-900/10",
                      icon: Sparkles
                    }
                  ].map((doc, idx) => {
                    const Icon = doc.icon;
                    return (
                      <button 
                        key={idx}
                        onClick={() => {
                          setIsBuildModalOpen(false);
                          startTransition(() => {
                            router.push(doc.path);
                          });
                        }}
                        className={`flex items-start gap-4 p-4 border rounded-2xl transition-all duration-300 group ${doc.hoverColor} border-neutral-900 bg-neutral-900/20 cursor-pointer w-full text-left`}
                      >
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center border transition-colors shrink-0 ${doc.color} group-hover:bg-neutral-900`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                            {doc.title}
                            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-neutral-400" />
                          </h4>
                          <p className="text-[10px] sm:text-xs text-neutral-400 mt-1 leading-normal font-medium">{doc.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Custom Feature / Tool Modal */}
      <AnimatePresence>
        {isAddFeatureModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-neutral-950 text-white rounded-3xl p-6 sm:p-8 relative border border-purple-900/50 shadow-2xl space-y-5 text-left"
            >
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-purple-950 border border-purple-800/40 flex items-center justify-center text-purple-400">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Add Custom Tool / Feature</h3>
                    <p className="text-[10px] text-neutral-400">Add a custom feature card to your tool suite</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddFeatureModalOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Controls */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                    Feature Title <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Custom LaTeX Generator / Salary Advisor"
                    value={featureTitle}
                    onChange={(e) => setFeatureTitle(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                    Feature Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe what your tool does (e.g. Generate customized README sections or calculate salary benchmarks)..."
                    value={featureDesc}
                    onChange={(e) => setFeatureDesc(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder:text-neutral-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                    Tool Destination / Action
                  </label>
                  <select
                    value={featureLink}
                    onChange={(e) => setFeatureLink(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="/builder">Launch AI Builder Workspace (/builder)</option>
                    <option value="/ats-checker">Launch ATS Score &amp; Checker (/ats-checker)</option>
                    <option value="/cover-letter">Launch Cover Letter Generator (/cover-letter)</option>
                    <option value="/parser">Launch PDF Parser (/parser)</option>
                    <option value="/dashboard">Launch Dashboard Analytics (/dashboard)</option>
                    <option value="/chatbot">Launch AI Chat Assistant (/chatbot)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                    Icon Theme
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { id: 'sparkles', label: '✨' },
                      { id: 'cpu', label: '💻' },
                      { id: 'zap', label: '⚡' },
                      { id: 'briefcase', label: '💼' },
                      { id: 'shield', label: '🛡️' },
                      { id: 'globe', label: '🌐' }
                    ].map((iconItem) => (
                      <button
                        key={iconItem.id}
                        type="button"
                        onClick={() => setFeatureIcon(iconItem.id)}
                        className={`p-2 rounded-xl border text-center text-sm transition-all ${
                          featureIcon === iconItem.id
                            ? 'border-purple-500 bg-purple-950/40'
                            : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                        }`}
                      >
                        {iconItem.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-2 pt-2 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={() => setIsAddFeatureModalOpen(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCustomFeature}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_4px_12px_rgba(168,85,247,0.4)]"
                >
                  Add Tool
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Selection Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-neutral-950 border border-neutral-900 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden z-10 text-left"
            >
              <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

              {/* Close Button */}
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="absolute top-6 right-6 h-8 w-8 rounded-full bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 hover:border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-wider text-white">Upload Document</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-semibold uppercase tracking-wider">Select the type of career asset you want to upload and analyze</p>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-2">
                  {[
                    {
                      title: "Upload Resume",
                      desc: "Extract text and details from your existing resume in seconds.",
                      path: "/parser?type=resume",
                      color: "text-purple-400 bg-purple-950/20 border-purple-900/40",
                      hoverColor: "hover:border-purple-400 hover:bg-purple-900/10",
                      icon: Zap
                    },
                    {
                      title: "Upload CV",
                      desc: "Parse details from academic and multi-page professional curriculum vitae.",
                      path: "/parser?type=cv",
                      color: "text-blue-400 bg-blue-950/20 border-blue-900/40",
                      hoverColor: "hover:border-blue-400 hover:bg-blue-900/10",
                      icon: Layers
                    },
                    {
                      title: "Upload Cover Letter",
                      desc: "Paste and audit your existing cover letter to match a job specification.",
                      path: "/ats-checker?docType=cover-letter",
                      color: "text-emerald-400 bg-emerald-950/20 border-emerald-900/40",
                      hoverColor: "hover:border-emerald-400 hover:bg-emerald-900/10",
                      icon: Sparkles
                    }
                  ].map((doc, idx) => {
                    const Icon = doc.icon;
                    return (
                      <button 
                        key={idx}
                        onClick={() => {
                          setIsUploadModalOpen(false);
                          startTransition(() => {
                            router.push(doc.path);
                          });
                        }}
                        className={`flex items-start gap-4 p-4 border rounded-2xl transition-all duration-300 group ${doc.hoverColor} border-neutral-900 bg-neutral-900/20 cursor-pointer w-full text-left`}
                      >
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center border transition-colors shrink-0 ${doc.color} group-hover:bg-neutral-900`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                            {doc.title}
                            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-neutral-400" />
                          </h4>
                          <p className="text-[10px] sm:text-xs text-neutral-400 mt-1 leading-normal font-medium">{doc.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Builder Selection Modal */}
      <AnimatePresence>
        {isAiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAiModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-neutral-950 border border-neutral-900 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden z-10 text-left"
            >
              <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

              {/* Close Button */}
              <button 
                onClick={() => setIsAiModalOpen(false)}
                className="absolute top-6 right-6 h-8 w-8 rounded-full bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 hover:border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-wider text-white">AI Assistant Chat</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-semibold uppercase tracking-wider">Talk with Mira to generate and customize your career assets in real time</p>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-2">
                  {[
                    {
                      title: "AI Resume Chatbot",
                      desc: "Generate your full professional resume interactively by chatting with Mira.",
                      path: "/chatbot?type=resume",
                      color: "text-purple-400 bg-purple-950/20 border-purple-900/40",
                      hoverColor: "hover:border-purple-400 hover:bg-purple-900/10",
                      icon: Zap
                    },
                    {
                      title: "AI CV Chatbot",
                      desc: "Build a comprehensive curriculum vitae through standard chat prompts.",
                      path: "/chatbot?type=cv",
                      color: "text-blue-400 bg-blue-950/20 border-blue-900/40",
                      hoverColor: "hover:border-blue-400 hover:bg-blue-900/10",
                      icon: Layers
                    },
                    {
                      title: "AI Cover Letter Chatbot",
                      desc: "Draft a personalized cover letter for any job role directly through chat.",
                      path: "/chatbot?type=cover-letter",
                      color: "text-emerald-400 bg-emerald-950/20 border-emerald-900/40",
                      hoverColor: "hover:border-emerald-400 hover:bg-emerald-900/10",
                      icon: Sparkles
                    }
                  ].map((doc, idx) => {
                    const Icon = doc.icon;
                    return (
                      <button 
                        key={idx}
                        onClick={() => {
                          setIsAiModalOpen(false);
                          startTransition(() => {
                            router.push(doc.path);
                          });
                        }}
                        className={`flex items-start gap-4 p-4 border rounded-2xl transition-all duration-300 group ${doc.hoverColor} border-neutral-900 bg-neutral-900/20 cursor-pointer w-full text-left`}
                      >
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center border transition-colors shrink-0 ${doc.color} group-hover:bg-neutral-900`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                            {doc.title}
                            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-neutral-400" />
                          </h4>
                          <p className="text-[10px] sm:text-xs text-neutral-400 mt-1 leading-normal font-medium">{doc.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
