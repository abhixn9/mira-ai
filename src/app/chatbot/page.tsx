"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  ArrowLeft, 
  Sparkles, 
  Zap,
  Layers,
  FileText,
  CheckCircle,
  Loader2,
  RefreshCw,
  Eye,
  X,
  Paperclip,
  Upload,
  Image,
  FileUp,
  Plus
} from 'lucide-react';
import { useResume } from '@/context/ResumeContext';
import { useToast } from '@/context/ToastContext';
import { useLogoTransition } from '@/components/ui/LogoAnimation';
import { parseAndExecuteResumeChange } from '@/utils/aiChangeExecutor';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

function cleanNameAndRole(text: string): { name: string; role: string } {
  const clean = text.trim();
  let name = '';
  let role = '';

  // Standardize common name & job title phrasing into explicit markers
  const standardized = clean
    .replace(/(?:and\s+)?(?:the\s+)?(?:title\s+of\s+(?:the\s+)?job|job\s+title|my\s+role|target\s+role|my\s+job|role|job|position)\s+(?:is|=|:)?\s*/gi, ' ROLE_IS ')
    .replace(/(?:and\s+)?(?:my\s+)?name\s+(?:is|=|:)?\s*/gi, ' NAME_IS ');

  if (standardized.includes('ROLE_IS')) {
    const parts = standardized.split('ROLE_IS');
    name = parts[0].replace('NAME_IS', '').trim();
    role = parts[1].trim();
  } else if (standardized.includes('NAME_IS')) {
    name = standardized.replace('NAME_IS', '').trim();
  } else if (clean.includes(',')) {
    const parts = clean.split(',');
    name = parts[0].trim();
    role = parts.slice(1).join(',').trim();
  } else if (clean.includes('-')) {
    const parts = clean.split('-');
    name = parts[0].trim();
    role = parts.slice(1).join('-').trim();
  } else {
    name = clean;
  }

  // Strip prefixes using strict word boundaries \b so we never cut off letter 'A' in names like Abhiram
  name = name
    .replace(/^\b(my name is|my name's|i am|this is|i'm|name is|call me|name)\b\s*/gi, '')
    .replace(/[.,;!]+$/, '')
    .trim();

  role = role
    .replace(/^\b(my role is|my job is|my position is|my title is|target role is|role is|job is|working as a|working as|i am a|i'm a|the|is)\b\s*/gi, '')
    .replace(/[.,;!]+$/, '')
    .trim();

  // Capitalize each word
  const capitalize = (str: string) => {
    if (!str) return '';
    return str
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  name = capitalize(name);
  role = capitalize(role);

  // Smart role mapping for shorthand titles
  const roleLower = role.toLowerCase();
  if (roleLower === 'full stack' || roleLower === 'fullstack' || roleLower === 'full stack dev' || roleLower === 'full stack developer') {
    role = 'Full Stack Developer';
  } else if (roleLower === 'frontend' || roleLower === 'front end') {
    role = 'Frontend Developer';
  } else if (roleLower === 'backend' || roleLower === 'back end') {
    role = 'Backend Developer';
  } else if (roleLower === 'devops') {
    role = 'DevOps Engineer';
  } else if (roleLower === 'sde') {
    role = 'Software Development Engineer';
  }

  return {
    name: name || 'Abhiram',
    role: role || 'Full Stack Developer'
  };
}

function cleanExperienceText(text: string, jobTitle: string = 'Software Engineer'): string {
  const clean = text.trim();
  if (!clean) return '';

  // Check if text mentions number of years (e.g. "8 years", "5 yrs", "my experience is 8 years")
  const yearsMatch = clean.match(/(\d+)\s*(?:years?|yrs?)/i);
  if (yearsMatch) {
    const years = yearsMatch[1];
    return `• Over ${years}+ years of professional experience architecting, developing, and deploying enterprise-grade ${jobTitle || 'software'} solutions.
• Spearheaded end-to-end feature development, improving application performance, scaling throughput, and reducing response latency.
• Collaborated closely with product managers and engineers to execute critical roadmap releases.`;
  }

  // Otherwise clean sentence prefixes like "my experience is", "i have worked on"
  const stripped = clean
    .replace(/^(my experience is|i have|i worked on|my background is|experience:|background:)\s*/i, '')
    .trim();

  // If user provided multiple bullet points or lines
  const lines = stripped.split(/\n|,|;/).map(l => l.trim()).filter(Boolean);
  if (lines.length > 0) {
    return lines
      .map(l => {
        let line = l.replace(/^•|\*|-|\d+\.\s*/, '').trim();
        if (!line) return '';
        line = line.charAt(0).toUpperCase() + line.slice(1);
        if (!line.endsWith('.')) line += '.';
        return `• ${line}`;
      })
      .filter(Boolean)
      .join('\n');
  }

  return `• ${stripped.charAt(0).toUpperCase() + stripped.slice(1)}.`;
}

function cleanSkillsText(text: string): string {
  const clean = text.trim();
  if (!clean) return '';

  const fillerWords = new Set([
    'my', 'technical', 'skills', 'skill', 'are', 'is', 'include', 'includes', 
    'and', 'in', 'i', 'know', 'have', 'proficient', 'experience', 'with', 
    'using', 'top', 'tech', 'stack', 'frameworks', 'tools', 'languages', 'also', 'good'
  ]);

  const rawTokens = clean
    .split(/[,;\/\n\s]+/)
    .map(s => s.trim().replace(/^[^a-zA-Z0-9#+.]+|[^a-zA-Z0-9#+.]+$|&/g, ''))
    .filter(Boolean);

  const validSkills = rawTokens.filter(s => s.length >= 1 && !fillerWords.has(s.toLowerCase()));

  const unique = Array.from(new Set(validSkills));

  const formatSkillName = (s: string) => {
    const lower = s.toLowerCase();
    if (lower === 'react' || lower === 'reactjs') return 'React';
    if (lower === 'next' || lower === 'nextjs') return 'Next.js';
    if (lower === 'node' || lower === 'nodejs') return 'Node.js';
    if (lower === 'typescript' || lower === 'ts') return 'TypeScript';
    if (lower === 'javascript' || lower === 'js') return 'JavaScript';
    if (lower === 'python') return 'Python';
    if (lower === 'java') return 'Java';
    if (lower === 'sql') return 'SQL';
    if (lower === 'aws') return 'AWS';
    if (lower === 'docker') return 'Docker';
    if (lower === 'tailwind' || lower === 'tailwindcss') return 'Tailwind CSS';
    if (lower === 'html') return 'HTML5';
    if (lower === 'css') return 'CSS3';
    if (lower === 'c++' || lower === 'cpp') return 'C++';
    if (lower === 'c#') return 'C#';
    if (lower === 'git') return 'Git';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return unique.map(formatSkillName).join(', ');
}

function ChatbotContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { resumes, activeResumeId, updateResume, updateCoverLetter } = useResume();
  const { startTransition, overlay } = useLogoTransition();

  const docType = searchParams.get('type') || 'resume'; // 'resume' | 'cv' | 'cover-letter'
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState('');

  // Template Choice & Custom Template States
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);

  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customColor, setCustomColor] = useState('#8b5cf6');
  const [customLayout, setCustomLayout] = useState<'single' | 'double'>('single');
  const [customHeader, setCustomHeader] = useState<'left' | 'center' | 'banner'>('left');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mira_custom_templates');
      if (saved) {
        try {
          setCustomTemplates(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse custom templates:', e);
        }
      }
    }
  }, []);

  const handleCreateCustomTemplateInChat = () => {
    if (!customName.trim()) {
      alert('Please enter a name for your custom template');
      return;
    }

    const newTpl = {
      id: `custom-tpl-${Date.now()}`,
      name: customName.trim(),
      accentColor: customColor,
      layout: customLayout,
      headerStyle: customHeader,
      isCustom: true
    };

    const updated = [newTpl, ...customTemplates];
    setCustomTemplates(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mira_custom_templates', JSON.stringify(updated));
    }

    setSelectedTemplate(newTpl.id);
    setShowCustomBuilder(false);
    setIsTemplateModalOpen(false);
    toast(`Custom template "${customName}" created and applied!`, 'success');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('mira-user-name');
      const email = localStorage.getItem('mira-user-email');
      if (!name && !email) {
        router.push('/auth/login');
      }
    }
  }, [router]);

  // Extracted details from conversation
  const [details, setDetails] = useState({
    name: '',
    jobTitle: '',
    experience: '',
    skills: '',
    company: '', // Cover letter specific
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: string; content: string } | null>(null);

  const extractDetailsFromText = (text: string) => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

    const emailMatch = text.match(emailRegex);
    const phoneMatch = text.match(phoneRegex);

    let detectedName = '';
    let detectedRole = '';

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      if (lines[0].length < 35 && !lines[0].includes('@')) {
        detectedName = lines[0];
      }
      if (lines.length > 1 && lines[1].length < 40 && !lines[1].includes('@')) {
        detectedRole = lines[1];
      }
    }

    const knownSkills = ['React', 'Next.js', 'Node.js', 'TypeScript', 'Python', 'Java', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'Tailwind', 'GraphQL', 'Machine Learning', 'Figma', 'Git'];
    const foundSkills = knownSkills.filter(s => text.toLowerCase().includes(s.toLowerCase()));

    return {
      name: detectedName,
      jobTitle: detectedRole,
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      skills: foundSkills,
      experience: text.length > 50 ? text.substring(0, 300) : ''
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const textContent = (event.target?.result as string) || '';
      const fileData = {
        name: file.name,
        type: file.type || file.name.split('.').pop() || 'document',
        content: textContent
      };
      setAttachedFile(fileData);

      const extracted = extractDetailsFromText(textContent || file.name);
      if (extracted.name || extracted.jobTitle || extracted.email || extracted.skills.length > 0) {
        setDetails(prev => ({
          ...prev,
          name: extracted.name || prev.name,
          jobTitle: extracted.jobTitle || prev.jobTitle,
          experience: extracted.experience || prev.experience,
          skills: extracted.skills.join(', ') || prev.skills,
        }));
      }

      toast(`Attached & parsed "${file.name}"`, 'success');
    };

    if (file.type.includes('image')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleApplyDetailsToActiveResume = () => {
    const activeResume = resumes.find(r => r.id === activeResumeId) || resumes[0];
    if (!activeResume) return;

    const nameToApply = details.name || activeResume.personalInfo.name;
    const roleToApply = details.jobTitle || activeResume.personalInfo.jobTitle;
    const skillList = details.skills ? details.skills.split(',').map(s => s.trim()).filter(Boolean) : activeResume.skills.technical;

    const updated = {
      ...activeResume,
      personalInfo: {
        ...activeResume.personalInfo,
        name: nameToApply,
        jobTitle: roleToApply,
      },
      skills: {
        ...activeResume.skills,
        technical: Array.from(new Set([...activeResume.skills.technical, ...skillList]))
      }
    };

    updateResume(updated);
    toast(`Extracted details applied to active resume "${nameToApply}"!`, 'success');
  };

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initial greeting
  useEffect(() => {
    const greetingText = docType === 'cover-letter' 
      ? "Hi there! I am Mira, your AI Cover Letter writer. I will help you craft a tailored, persuasive cover letter. To start, what is your full name and the name of the company and job title you are targeting?"
      : `Hello! I am Mira, your AI Career Architect. I am ready to design a stunning, ATS-optimized ${docType.toUpperCase()} for you. To begin, what is your full name and your targeted job title?`;

    setIsTyping(true);
    const timer = setTimeout(() => {
      setMessages([
        {
          id: 'msg-1',
          sender: 'bot',
          text: greetingText,
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [docType]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const responseText = inputText;
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      processBotResponse(responseText);
    }, 1500);
  };

  const processBotResponse = (userText: string) => {
    setIsTyping(false);

    // Direct change command execution
    const activeRes = resumes.find(r => r.id === activeResumeId) || resumes[0];
    const changeExec = parseAndExecuteResumeChange(
      userText,
      activeRes,
      updateResume,
      setThemeColor
    );

    if (changeExec.applied) {
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: changeExec.feedbackMessage,
        timestamp: new Date()
      }]);
      toast(changeExec.feedbackMessage, 'success');
      return;
    }

    const nextStep = chatStep + 1;
    setChatStep(nextStep);

    if (docType === 'cover-letter') {
      if (chatStep === 0) {
        const parsed = cleanNameAndRole(userText);
        setDetails(prev => ({ 
          ...prev, 
          name: parsed.name,
          jobTitle: parsed.role
        }));
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Nice to meet you, ${parsed.name}! I've set your target role as "${parsed.role}". Next, please share a few bullet points of your background, experience, or major projects that you'd like to highlight in this letter.`,
          timestamp: new Date()
        }]);
      } else if (chatStep === 1) {
        const cleanedExp = cleanExperienceText(userText, details.jobTitle);
        setDetails(prev => ({ ...prev, experience: cleanedExp }));
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: "Awesome! I've formatted your experience highlights into high-impact letter paragraphs. Click the 'Build Asset' button below to generate your cover letter!",
          timestamp: new Date()
        }]);
      }
    } else {
      // Resume / CV
      if (chatStep === 0) {
        const parsed = cleanNameAndRole(userText);
        setDetails(prev => ({ 
          ...prev, 
          name: parsed.name,
          jobTitle: parsed.role
        }));
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Nice to meet you, ${parsed.name}! I've set your target role as "${parsed.role}". Now, please describe your work experience (e.g., "8 years of experience" or list your key projects).`,
          timestamp: new Date()
        }]);
      } else if (chatStep === 1) {
        const cleanedExp = cleanExperienceText(userText, details.jobTitle);
        setDetails(prev => ({ ...prev, experience: cleanedExp }));
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: "Understood! I've structured your experience into professional bullet points. Finally, what are your top technical skills, frameworks, tools, or education?",
          timestamp: new Date()
        }]);
      } else if (chatStep === 2) {
        const cleanedSkills = cleanSkillsText(userText);
        setDetails(prev => ({ ...prev, skills: cleanedSkills }));
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Great work! I have extracted and formatted all your skills into your Live Document Draft. Click the 'Build Asset' button below and I will generate and format your professional ${docType.toUpperCase()} automatically!`,
          timestamp: new Date()
        }]);
      }
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    const steps = [
      'Parsing conversation logs...',
      'Structuring layout coordinates...',
      'Optimizing keywords for ATS guidelines...',
      'Formatting professional typography systems...',
      'Injecting into editor workspace...'
    ];

    let currentStepIdx = 0;
    setGenerationStep(steps[0]);

    const interval = setInterval(() => {
      currentStepIdx++;
      if (currentStepIdx < steps.length) {
        setGenerationStep(steps[currentStepIdx]);
        setGenerationProgress(currentStepIdx * 20);
      } else {
        clearInterval(interval);
        setGenerationProgress(100);
        setTimeout(() => {
          finalizeDocument();
        }, 800);
      }
    }, 900);
  };

  const finalizeDocument = () => {
    const nameInput = details.name || 'Abhiram';
    const roleInput = details.jobTitle || 'Full Stack Developer';
    const rawSkills = details.skills.split(',').map(s => s.trim()).filter(Boolean);

    if (docType === 'cover-letter') {
      const generatedLetter = {
        title: `AI Cover Letter - ${details.company || 'Target Company'}`,
        recipientName: 'Hiring Manager',
        recipientTitle: 'Director of Talent Acquisition',
        companyName: details.company || 'Target Company',
        companyAddress: 'Corporate Headquarters',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        subject: `Application for ${roleInput} position`,
        body: `Dear Hiring Committee,\n\nI am writing to express my enthusiastic interest in the ${roleInput} position at ${details.company || 'Target Company'}. With my background in technology and my history of executing high-quality projects, I am confident in my capacity to add immediate value to your organization.\n\nThroughout my career as ${nameInput}, I have always prioritized combining technical correctness with strategic goals. My experience in this domain includes:\n\n- ${details.experience || 'Solving critical business issues with robust architecture.'}\n- Aligning cross-functional priorities to deliver product milestones.\n- Engineering high-fidelity UI and robust backend logic.\n\nI am eager to bring my capabilities to your organization and look forward to discussing how my experience fits your current initiatives.\n\nSincerely,\n\n${nameInput}`
      };

      updateCoverLetter(generatedLetter);
      toast('AI Cover Letter Generated!', 'success');
      startTransition(() => {
        router.push('/cover-letter');
      });
    } else {
      // Resume / CV
      const generatedResume = {
        id: `ai-resume-${Date.now()}`,
        title: `${nameInput} - AI Generated`,
        personalInfo: {
          name: nameInput,
          jobTitle: roleInput,
          email: 'hello@mira-ai.io',
          phone: '+1 (555) 019-2834',
          linkedin: 'linkedin.com/in/mira-user',
          github: 'github.com/mira-user',
          portfolio: 'portfolio.mira-ai.io',
          address: 'San Francisco, CA',
          photo: ''
        },
        summary: `Highly motivated ${roleInput} targeting complex challenges. Proven history of optimizing performance, writing high-impact software, and collaborating across teams. Strong foundation in ${rawSkills.slice(0, 4).join(', ') || 'modern engineering patterns'}.`,
        experience: [
          {
            id: 'exp-ai-1',
            company: 'Tech Innovations Corp',
            role: roleInput,
            duration: '2023 - Present',
            location: 'San Francisco, CA',
            responsibilities: [
              details.experience || 'Designed and implemented secure application features, improving user engagement by 25%.',
              'Collaborated with product designers to launch dynamic, responsive web interfaces.',
              'Refactored legacy databases to reduce API response latency by 30%.'
            ],
            achievements: ['Completed major features ahead of schedule, saving 40 engineering hours per sprint.']
          }
        ],
        education: [
          {
            id: 'edu-ai-1',
            degree: 'B.S. in Computer Science',
            university: 'Stanford University',
            duration: '2019 - 2023',
            location: 'Stanford, CA'
          }
        ],
        skills: {
          technical: rawSkills.length > 0 ? rawSkills : ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'TypeScript'],
          soft: ['Problem Solving', 'System Design', 'Agile Delivery', 'Communication'],
          languages: ['English (Native)']
        },
        certifications: [
          {
            id: 'cert-ai-1',
            name: 'AWS Certified Cloud Practitioner',
            issuer: 'Amazon Web Services',
            year: '2024'
          }
        ],
        projects: [
          {
            id: 'proj-ai-1',
            title: 'Mira AI Integration',
            description: 'A lightweight chat widget incorporating natural language processing models to automate developer onboarding workflows.',
            technologies: ['React', 'Next.js', 'OpenAI'],
            link: 'github.com/mira-ai'
          }
        ],
        awards: [],
        style: {
          templateId: selectedTemplate || (docType === 'cv' ? 'academic' : 'modern'),
          primaryColor: '#8b5cf6',
          fontFamily: 'outfit',
          fontSize: 'md',
          lineSpacing: 'md',
          pageMargin: 'md'
        }
      };

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('luxury-resumes');
        const list = stored ? JSON.parse(stored) : [];
        const updatedList = [generatedResume, ...list.filter((r: any) => r.id !== 'demo-resume-id')];
        localStorage.setItem('luxury-resumes', JSON.stringify(updatedList));
        localStorage.setItem('luxury-active-resume-id', generatedResume.id);
      }

      toast(`AI ${docType.toUpperCase()} Generated!`, 'success');
      startTransition(() => {
        router.push('/builder');
      });
    }
  };

  const isStepComplete = docType === 'cover-letter' ? chatStep >= 2 : chatStep >= 3;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-bar {
          background: linear-gradient(90deg, #141417 25%, #232329 50%, #141417 75%);
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite linear;
        }
      `}</style>
      {overlay}

      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass-panel border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link 
            href="/" 
            className="h-8 w-8 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white flex items-center justify-center transition-colors animate-pulse"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Bot className="h-4 w-4 text-purple-400" />
              <span>Mira AI Assistant</span>
            </h1>
            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">Interactive Chat Workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-neutral-900/60 border border-neutral-850 px-3 py-1.5 rounded-full">
          <Sparkles className="h-3 w-3 text-purple-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Targeting {docType.toUpperCase()}
          </span>
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100vh-68px)]">
        
        {/* Left Side: Chat Interface */}
        <div className="lg:col-span-7 flex flex-col border-r border-neutral-900 bg-neutral-950/20 relative">
          
          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      msg.sender === 'user' 
                        ? 'bg-neutral-900 border-neutral-800 text-white' 
                        : 'bg-purple-950/20 border-purple-900/40 text-purple-400'
                    }`}>
                      {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    <div className={`p-4 rounded-2xl text-sm leading-relaxed border text-left ${
                      msg.sender === 'user'
                        ? 'bg-white text-black border-white/10 rounded-tr-none'
                        : 'bg-neutral-900/40 text-neutral-200 border-neutral-850 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-950/20 border border-purple-900/40 text-purple-400 flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-neutral-900/30 border border-neutral-850 p-3 rounded-2xl rounded-tl-none flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Chat Controls / Inputs */}
          <div className="p-4 border-t border-neutral-900 bg-neutral-950/60 space-y-3">
            {/* Quick Action: Apply Extracted Details button */}
            {(details.name || details.jobTitle || details.skills || details.experience) && (
              <motion.button
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                type="button"
                onClick={handleApplyDetailsToActiveResume}
                className="w-full py-2 bg-gradient-to-r from-purple-950 to-indigo-950 hover:from-purple-900 hover:to-indigo-900 border border-purple-800/60 rounded-xl text-[11px] font-extrabold text-purple-200 uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
                <span>✨ Apply Extracted Details to Active Resume</span>
              </motion.button>
            )}

            {/* Attached file indicator */}
            {attachedFile && (
              <div className="flex items-center justify-between px-3 py-1.5 bg-purple-950/40 border border-purple-900/50 rounded-lg text-xs text-purple-300 font-medium">
                <div className="flex items-center space-x-2 truncate">
                  <Paperclip className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">Attached: <strong>{attachedFile.name}</strong></span>
                </div>
                <button 
                  onClick={() => setAttachedFile(null)}
                  className="p-1 hover:bg-purple-900/60 rounded text-purple-400 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
              className="hidden"
            />

            {isStepComplete ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-purple-950/10 border border-purple-900/40 rounded-2xl text-center space-y-3"
              >
                <p className="text-xs text-purple-300 font-bold uppercase tracking-wider">All details captured successfully!</p>
                <button
                  onClick={handleGenerate}
                  className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2 shadow-[0_4px_30px_rgba(255,255,255,0.15)] cursor-pointer"
                >
                  <Zap className="h-4 w-4 fill-black" />
                  <span>Build Asset</span>
                </button>
              </motion.div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload Document, PDF or Image"
                  className="h-11 w-11 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={attachedFile ? `Add notes for ${attachedFile.name}...` : "Type your message or attach PDF / Document / Image..."}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 text-white placeholder-neutral-600 font-medium"
                />
                <button
                  onClick={handleSend}
                  className="h-11 w-11 bg-white hover:bg-neutral-200 text-black rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Document Draft Preview */}
        <div className="lg:col-span-5 bg-neutral-950 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  Live Document Draft
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Template Selector Button */}
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(true)}
                className="px-3 py-1 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/60 rounded-lg text-[10px] font-extrabold text-purple-200 uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Sparkles className="h-3 w-3 text-purple-400" />
                <span>Template: <strong className="text-white capitalize">{selectedTemplate}</strong></span>
              </button>
            </div>

            {/* Simulated Live Sheet Draft */}
            <div className="border border-neutral-850/60 bg-[#0c0c0f] rounded-2xl p-6 space-y-6 text-left relative overflow-hidden min-h-[420px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {/* Top ambient color dot */}
              <div className="absolute top-0 right-0 h-[120px] w-[120px] bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
              
              {/* Document Header Area */}
              <div className="flex justify-between items-start">
                <div className="space-y-2.5 flex-1">
                  {!details.name ? (
                    <>
                      <div className="h-6 w-2/3 rounded shimmer-bar" />
                      <div className="h-4 w-1/3 rounded shimmer-bar" />
                    </>
                  ) : (
                    <>
                      <motion.h2 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl font-bold tracking-tight text-white uppercase"
                      >
                        {details.name}
                      </motion.h2>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="inline-block px-2.5 py-1 bg-purple-950/40 text-purple-300 border border-purple-900/50 rounded-md text-[10px] font-black uppercase tracking-wider"
                      >
                        {details.jobTitle || 'Target Role'}
                      </motion.div>
                    </>
                  )}
                </div>
                
                {/* Simulated profile photo or initials circle */}
                <div className="h-14 w-14 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 overflow-hidden shadow-inner ml-4">
                  {details.name ? (
                    <span className="text-sm font-black text-purple-400 uppercase tracking-widest">
                      {details.name.charAt(0)}
                    </span>
                  ) : (
                    <User className="h-5 w-5 text-neutral-600" />
                  )}
                </div>
              </div>

              {/* Simulated contact badges */}
              <div className="grid grid-cols-2 gap-2 pt-2 pb-1 text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-neutral-850 shrink-0" />
                  <span className="truncate">hello@mira-ai.io</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-neutral-850 shrink-0" />
                  <span className="truncate">+1 (555) 019-2834</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-neutral-850 shrink-0" />
                  <span className="truncate">San Francisco, CA</span>
                </div>
              </div>

              {/* Summary / Philosophy Section */}
              <div className="space-y-3 pt-4 border-t border-neutral-900">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-purple-400 shrink-0" />
                  {docType === 'cover-letter' ? 'Subject & Introduction' : 'Professional Summary'}
                </h4>
                {!details.name ? (
                  <div className="space-y-2">
                    <div className="h-3.5 w-full rounded shimmer-bar" />
                    <div className="h-3.5 w-5/6 rounded shimmer-bar" />
                  </div>
                ) : (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-neutral-300 leading-relaxed font-medium"
                  >
                    {docType === 'cover-letter' 
                      ? `Application for the position of ${details.jobTitle || 'Target Role'}`
                      : `Highly motivated professional targeting a role as ${details.jobTitle || 'Target Role'}. Committed to excellence, speed, and collaborative product delivery.`
                    }
                  </motion.p>
                )}
              </div>

              {/* Experience Highlights Section */}
              <div className="space-y-3 pt-4 border-t border-neutral-900">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  {docType === 'cover-letter' ? 'Letter Content' : 'Experience Highlights'}
                </h4>
                {!details.experience ? (
                  <div className="space-y-2">
                    <div className="h-3.5 w-full rounded shimmer-bar" />
                    <div className="h-3.5 w-11/12 rounded shimmer-bar" />
                    <div className="h-3.5 w-4/5 rounded shimmer-bar" />
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 text-xs text-neutral-300 leading-relaxed font-medium"
                  >
                    {details.experience.split('\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Tech Stack & Competencies (only for Resume/CV) */}
              {docType !== 'cover-letter' && (
                <div className="space-y-3 pt-4 border-t border-neutral-900">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Tech Stack & Competencies</h4>
                  {!details.skills ? (
                    <div className="flex gap-2">
                      <div className="h-6 w-16 rounded shimmer-bar" />
                      <div className="h-6 w-20 rounded shimmer-bar" />
                      <div className="h-6 w-14 rounded shimmer-bar" />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {details.skills.split(',').map((skill, idx) => (
                        <motion.span 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          key={idx} 
                          className="px-2.5 py-1 bg-neutral-900/60 border border-neutral-800 rounded-md text-[10px] text-neutral-300 font-bold uppercase tracking-wider"
                        >
                          {skill.trim()}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="text-center text-[10px] text-neutral-600 font-bold uppercase tracking-widest pt-4">
            Powered by Mira AI Engine
          </div>
        </div>
      </div>

      {/* Generation Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full p-8 text-center space-y-6"
            >
              <div className="relative h-16 w-16 mx-auto flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-purple-500 animate-spin absolute" />
                <Bot className="h-6 w-6 text-white relative z-10 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-serif font-bold uppercase tracking-wider text-white">Generating Career Asset</h3>
                <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider animate-pulse">{generationStep}</p>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-850">
                <motion.div 
                  className="h-full bg-white" 
                  style={{ width: `${generationProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Template Choice & Custom Template Creator Modal */}
      <AnimatePresence>
        {isTemplateModalOpen && (
          <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-3xl bg-neutral-950 text-white rounded-3xl p-6 sm:p-8 relative border border-purple-900/50 shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-950 border border-purple-800/60 flex items-center justify-center text-purple-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Choose Your Document Template</h3>
                    <p className="text-xs text-neutral-400">Select a built-in template or build your own custom requirement layout</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsTemplateModalOpen(false);
                    setShowCustomBuilder(false);
                  }}
                  className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Action Banner: Build Custom Template */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-purple-950/20 border border-dashed border-purple-800/70 rounded-2xl gap-3">
                <div className="text-left">
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-purple-900/80 text-purple-200 rounded">
                    CUSTOM REQUIREMENT
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1">Want a custom requirement layout?</h4>
                  <p className="text-[11px] text-neutral-400">Define your own columns, colors, header styles, and requirement notes.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCustomBuilder(!showCustomBuilder)}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-colors shadow-md cursor-pointer"
                >
                  {showCustomBuilder ? 'Close Form' : '+ Build Custom Template'}
                </button>
              </div>

              {/* Custom Template Form Drawer */}
              {showCustomBuilder && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-5 bg-neutral-900/80 border border-purple-800/40 rounded-2xl space-y-4 text-xs"
                >
                  <h4 className="text-xs font-black uppercase tracking-wider text-purple-300">Custom Template Configuration</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                        Template Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. My Custom Stanford Resume"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                        Accent Color
                      </label>
                      <div className="flex items-center space-x-2">
                        {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'].map((clr) => (
                          <button
                            key={clr}
                            type="button"
                            onClick={() => setCustomColor(clr)}
                            style={{ backgroundColor: clr }}
                            className={`h-7 w-7 rounded-full transition-transform cursor-pointer ${customColor === clr ? 'scale-125 ring-2 ring-white' : 'opacity-80'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleCreateCustomTemplateInChat}
                      className="px-5 py-2 bg-white text-black hover:bg-neutral-200 font-bold uppercase text-xs tracking-wider rounded-xl transition-colors cursor-pointer"
                    >
                      Save &amp; Apply Custom Template
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Template Gallery Grid */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Available Templates</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {[
                    { id: 'modern', name: 'Modern', tag: 'Popular', color: 'border-purple-600' },
                    { id: 'executive', name: 'Executive', tag: 'Corporate', color: 'border-blue-600' },
                    { id: 'corporate', name: 'Corporate', tag: 'Standard', color: 'border-slate-600' },
                    { id: 'minimal', name: 'Minimal', tag: 'Clean', color: 'border-neutral-600' },
                    { id: 'creative', name: 'Creative', tag: 'Designers', color: 'border-pink-600' },
                    { id: 'luxury', name: 'Luxury Gold', tag: 'Premium', color: 'border-amber-500' },
                    { id: 'academic', name: 'Academic CV', tag: 'Research', color: 'border-emerald-600' },
                    { id: 'btech-fresher', name: 'BTech Fresher', tag: 'Campus', color: 'border-indigo-600' },
                    { id: 'ats-friendly', name: 'ATS Optimized', tag: 'High Pass Rate', color: 'border-green-600' },
                    { id: 'dark', name: 'Dark Mode', tag: 'Developers', color: 'border-purple-800' },
                    ...customTemplates.map(ct => ({ id: ct.id, name: ct.name, tag: 'Custom', color: 'border-purple-500' }))
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => {
                        setSelectedTemplate(tpl.id);
                        setIsTemplateModalOpen(false);
                        toast(`Template changed to "${tpl.name}"!`, 'info');
                      }}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all cursor-pointer ${
                        selectedTemplate === tpl.id
                          ? `${tpl.color} bg-purple-950/30 ring-2 ring-purple-500`
                          : 'border-neutral-850 bg-neutral-900/60 hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 bg-neutral-800 rounded text-neutral-300 w-fit">
                        {tpl.tag}
                      </span>
                      <div>
                        <h5 className="text-xs font-extrabold text-white">{tpl.name}</h5>
                        <p className="text-[9px] text-neutral-400 mt-0.5">Click to select</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ChatbotPage() {
  return (
    <React.Suspense fallback={
      <div className="h-screen w-screen bg-neutral-950 flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
        <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Loading AI Chatbot Workspace...</p>
      </div>
    }>
      <ChatbotContent />
    </React.Suspense>
  );
}
