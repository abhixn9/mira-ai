"use client"

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  Plus, 
  Trash2, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Link as LinkIcon,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  User,
  Check
} from 'lucide-react';
import { useResume } from '@/context/ResumeContext';
import { useToast } from '@/context/ToastContext';
import { ResumeStyle } from '@/types/resume';
import { ResumeTemplate } from '@/components/templates/Templates';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  generateSummaryApi, 
  improveExperienceApi 
} from '@/utils/aiClient';
import { simulateSummary, simulateBulletPoints } from '@/utils/aiSimulator';

interface ValidationErrors {
  name?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  summary?: string;
  experience?: string;
  education?: string;
  skills?: string;
  projects?: string;
  certifications?: string;
  languages?: string;
}

function getStepLabels(industry: string | undefined | null) {
  const defaultSteps = {
    s1: "Contact",
    s1_full: "Personal Info",
    s2: "Summary",
    s2_full: "Summary",
    s3: "Experience",
    s3_full: "Work History",
    s3_sub: "Positions",
    s4: "Education",
    s4_full: "Education",
    s4_sub: "Education History",
    s5: "Skills",
    s5_full: "Core Skills",
    s5_tech: "Technical Skills",
    s5_soft: "Soft Skills",
    s6: "Projects",
    s6_full: "Projects",
    s6_sub: "Projects",
    s7: "Certifications",
    s7_full: "Certifications",
    s7_sub: "Certifications",
    s8: "Languages",
    s8_full: "Languages",
    s9: "Templates",
    s9_full: "Design Template",
    s10: "Export",
    s10_full: "Preview & Export"
  };

  if (!industry) return defaultSteps;

  switch (industry) {
    case 'Engineering & Technology':
      return {
        ...defaultSteps,
        s5: "Tech Stack",
        s5_full: "Technical Stack",
        s5_tech: "Languages & Frameworks",
        s5_soft: "Engineering Methodologies",
        s6: "GitHub & Projects",
        s6_full: "GitHub & Projects",
        s6_sub: "Technical Projects"
      };
    case 'Design & Media':
      return {
        ...defaultSteps,
        s5: "Design Tools",
        s5_full: "Design Tools & Skills",
        s5_tech: "Creative & Design Tools",
        s5_soft: "Artistic Specializations",
        s6: "Creative Portfolio",
        s6_full: "Creative Portfolio",
        s6_sub: "Portfolio & Exhibitions",
        s7: "Exhibitions & Awards",
        s7_full: "Exhibitions & Awards",
        s7_sub: "Exhibitions, Awards & Certifications"
      };
    case 'Business & Finance':
      return {
        ...defaultSteps,
        s2: "Exec Summary",
        s2_full: "Executive Summary",
        s3: "Corp Experience",
        s3_full: "Professional Experience",
        s3_sub: "Career Chronology",
        s4: "Credentials",
        s4_full: "Academic Credentials",
        s4_sub: "Academic Background",
        s5: "Competencies",
        s5_full: "Core Competencies",
        s5_tech: "Analytical & Finance Tools",
        s5_soft: "Leadership Competencies",
        s6: "Case Studies",
        s6_full: "Key Case Studies",
        s6_sub: "Business Case Studies",
        s7: "Licensing & Certs",
        s7_full: "Licensing & Certifications",
        s7_sub: "Professional Licenses & Certifications"
      };
    case 'Education & Learning':
      return {
        ...defaultSteps,
        s2: "Philosophy",
        s2_full: "Teaching Philosophy",
        s3: "Teaching Exp",
        s3_full: "Teaching Experience",
        s3_sub: "Teaching & Instruction History",
        s4: "Degrees",
        s4_full: "Education & Degrees",
        s4_sub: "Academic Degrees & Certifications",
        s5: "Pedagogical",
        s5_full: "Pedagogical Skills",
        s5_tech: "Instructional Technologies",
        s5_soft: "Pedagogical Skills",
        s6: "Academic Research",
        s6_full: "Academic Research",
        s6_sub: "Research, Publications & Presentations",
        s7: "Credentials & Lic",
        s7_full: "Credentials & Licenses",
        s7_sub: "State Credentials & Educator Licenses"
      };
    case 'Care Services':
    case 'Community & Social':
      return {
        ...defaultSteps,
        s2: "Prof Profile",
        s2_full: "Professional Profile",
        s3: "Field Work",
        s3_full: "Clinical & Field Work",
        s3_sub: "Clinical Practice & Case Management",
        s4: "Education & Tr",
        s4_full: "Education & Training",
        s4_sub: "Academic & Clinical Training",
        s5: "Caretaking",
        s5_full: "Caretaking Skills",
        s5_tech: "Medical & Caretaking Tools",
        s5_soft: "Crisis Intervention & Soft Skills",
        s6: "Outreach",
        s6_full: "Community Outreach",
        s6_sub: "Outreach Programs & Volunteer Leadership",
        s7: "Licenses & Certs",
        s7_full: "Licenses & Certifications",
        s7_sub: "Care Licenses & Clinical Certifications"
      };
    case 'Hospitality & Tourism':
      return {
        ...defaultSteps,
        s2: "Summary",
        s2_full: "Professional Summary",
        s3: "Service History",
        s3_full: "Service History",
        s3_sub: "Hospitality & Gastronomy Log",
        s5: "Culinary Skills",
        s5_full: "Culinary & Hospitality Skills",
        s5_tech: "Hospitality Software & Culinary Tools",
        s5_soft: "Customer Relations & Soft Skills",
        s6: "Event Mgmt",
        s6_full: "Event Management",
        s6_sub: "Event Planning & Hospitality Projects",
        s7: "Certs & Training",
        s7_full: "Certifications & Training",
        s7_sub: "Food Safety & Hospitality Certifications"
      };
    case 'Sales & Marketing':
      return {
        ...defaultSteps,
        s2: "Prof Profile",
        s2_full: "Professional Profile",
        s3: "Sales Experience",
        s3_full: "Sales & Marketing Experience",
        s3_sub: "Campaign & Sales History",
        s5: "Marketing Tools",
        s5_full: "Marketing & Analytical Tools",
        s5_tech: "Marketing Tools & CRM Stack",
        s5_soft: "Negotiation & Analytical Skills",
        s6: "Campaigns",
        s6_full: "Campaigns & Case Studies",
        s6_sub: "Marketing Campaigns & Projects"
      };
    default:
      return defaultSteps;
  }
}

export default function BuilderPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { activeResume, updateResume, builderStep: step, setBuilderStep: setStep } = useResume();
  const resumeRef = useRef<HTMLDivElement>(null);

  // Local Personal Info state buffer for 100% fluid mobile typing
  const [localPersonalInfo, setLocalPersonalInfo] = useState({
    name: activeResume?.personalInfo?.name || '',
    jobTitle: activeResume?.personalInfo?.jobTitle || '',
    email: activeResume?.personalInfo?.email || '',
    phone: activeResume?.personalInfo?.phone || '',
    address: activeResume?.personalInfo?.address || '',
    photo: activeResume?.personalInfo?.photo || '',
    linkedin: activeResume?.personalInfo?.linkedin || '',
    github: activeResume?.personalInfo?.github || '',
    portfolio: activeResume?.personalInfo?.portfolio || ''
  });

  // Local Summary and Array buffer states for 100% fluid mobile touch typing
  const [localSummary, setLocalSummary] = useState(activeResume?.summary || '');
  const [localExperience, setLocalExperience] = useState(activeResume?.experience || []);
  const [localEducation, setLocalEducation] = useState(activeResume?.education || []);
  const [localSkills, setLocalSkills] = useState(activeResume?.skills || { technical: [], soft: [], languages: [] });
  const [localProjects, setLocalProjects] = useState(activeResume?.projects || []);
  const [localCertifications, setLocalCertifications] = useState(activeResume?.certifications || []);

  useEffect(() => {
    if (activeResume?.personalInfo) {
      setLocalPersonalInfo({
        name: activeResume.personalInfo.name || '',
        jobTitle: activeResume.personalInfo.jobTitle || '',
        email: activeResume.personalInfo.email || '',
        phone: activeResume.personalInfo.phone || '',
        address: activeResume.personalInfo.address || '',
        photo: activeResume.personalInfo.photo || '',
        linkedin: activeResume.personalInfo.linkedin || '',
        github: activeResume.personalInfo.github || '',
        portfolio: activeResume.personalInfo.portfolio || ''
      });
    }
    if (activeResume) {
      setLocalSummary(activeResume.summary || '');
      setLocalExperience(activeResume.experience || []);
      setLocalEducation(activeResume.education || []);
      setLocalSkills(activeResume.skills || { technical: [], soft: [], languages: [] });
      setLocalProjects(activeResume.projects || []);
      setLocalCertifications(activeResume.certifications || []);
    }
  }, [activeResume?.id]);

  const livePreviewData = useMemo(() => {
    const active = activeResume || DEFAULT_RESUME;
    return {
      ...active,
      style: active.style || DEFAULT_RESUME.style,
      personalInfo: {
        ...(DEFAULT_RESUME.personalInfo || {}),
        ...(active.personalInfo || {}),
        ...(localPersonalInfo || {})
      },
      summary: localSummary ?? '',
      experience: localExperience || [],
      education: localEducation || [],
      skills: localSkills || { technical: [], soft: [], languages: [] },
      projects: localProjects || [],
      certifications: localCertifications || []
    };
  }, [activeResume, localPersonalInfo, localSummary, localExperience, localEducation, localSkills, localProjects, localCertifications]);

  const [aiGenerating, setAiGenerating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [langInput, setLangInput] = useState('');
  const [techSkillInput, setTechSkillInput] = useState('');
  const [softSkillInput, setSoftSkillInput] = useState('');

  // Style Wizard States
  const [showStyleWizardModal, setShowStyleWizardModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardPhoto, setWizardPhoto] = useState<'no' | 'yes'>('no');
  const [wizardColor, setWizardColor] = useState('#3b82f6');
  const [wizardLayout, setWizardLayout] = useState<'one-column' | 'two-column'>('one-column');
  const [wizardIndustries, setWizardIndustries] = useState<string[]>([]);
  const [wizardTemplate, setWizardTemplate] = useState<typeof style.templateId>('modern');
  const [wizardFontFamily, setWizardFontFamily] = useState<typeof style.fontFamily>('sans');
  const [wizardFontSize, setWizardFontSize] = useState<typeof style.fontSize>('md');

  // Custom Template Creator States
  const [mobileViewTab, setMobileViewTab] = useState<'editor' | 'preview'>('editor');
  const [customTemplates, setCustomTemplates] = useState<Array<{ id: string; name: string; badge: string; desc: string; columns: string; photo: boolean }>>([]);
  const [showCustomTemplateModal, setShowCustomTemplateModal] = useState(false);
  const [customTemplateName, setCustomTemplateName] = useState('');
  const [customTemplateColumns, setCustomTemplateColumns] = useState<'1-column' | '2-column'>('1-column');
  const [customTemplateHeader, setCustomTemplateHeader] = useState<'centered' | 'left' | 'banner'>('left');
  const [customTemplateColor, setCustomTemplateColor] = useState('#8b5cf6');
  const [customTemplateNotes, setCustomTemplateNotes] = useState('');

  // Filter States for Template Selection
  const [filterPhoto, setFilterPhoto] = useState<'all' | 'with-photo' | 'without-photo'>('all');
  const [filterLayout, setFilterLayout] = useState<'all' | '1-column' | '2-column'>('all');
  const [filterIndustry, setFilterIndustry] = useState<string | null>(null);

  const selectedIndustry = filterIndustry || (wizardIndustries.length > 0 ? wizardIndustries[0] : null);
  const stepLabels = getStepLabels(selectedIndustry);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCustom = localStorage.getItem('mira_custom_templates');
      if (savedCustom) {
        try {
          setCustomTemplates(JSON.parse(savedCustom));
        } catch (e) {
          console.error('Failed to parse custom templates:', e);
        }
      }

      const name = localStorage.getItem('mira-user-name');
      const email = localStorage.getItem('mira-user-email');
      if (!name && !email) {
        router.push('/auth/login');
        return;
      }
    }
    // Automatically trigger Style Wizard every time the builder page is loaded
    setWizardStep(1);
    setShowStyleWizardModal(true);
  }, [router]);

  const handleCreateCustomTemplate = () => {
    if (!customTemplateName.trim()) {
      toast('Please enter a template name', 'error');
      return;
    }

    const newTemplate = {
      id: `custom-${Date.now()}`,
      name: customTemplateName.trim(),
      badge: 'CUSTOM',
      desc: customTemplateNotes.trim() || `${customTemplateColumns === '1-column' ? 'Single Column' : 'Two Column'} custom requirement design`,
      columns: customTemplateColumns,
      photo: wizardPhoto === 'yes'
    };

    const updated = [newTemplate, ...customTemplates];
    setCustomTemplates(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mira_custom_templates', JSON.stringify(updated));
    }

    setWizardTemplate(newTemplate.id as any);
    setWizardColor(customTemplateColor);
    setWizardLayout(customTemplateColumns === '1-column' ? 'one-column' : 'two-column');
    setShowCustomTemplateModal(false);
    setCustomTemplateName('');
    setCustomTemplateNotes('');
    toast(`Custom template "${newTemplate.name}" created and selected!`, 'success');
  };


  if (!activeResume) {
    return null;
  }

  const { personalInfo, summary, experience, education, skills, certifications, projects, style } = activeResume;

  // Real-time Validation Engine
  const validateStep = (currentStep: number): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      const name = (localPersonalInfo.name || '').trim();
      const jobTitle = (localPersonalInfo.jobTitle || '').trim();
      const email = (localPersonalInfo.email || '').trim();
      const phone = (localPersonalInfo.phone || '').trim();

      if (!name) {
        newErrors.name = "Full name is required.";
        isValid = false;
      }
      if (!jobTitle) {
        newErrors.jobTitle = "Job title target is required.";
        isValid = false;
      }
      if (!email) {
        newErrors.email = "Email address is required.";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Please specify a valid email address.";
        isValid = false;
      }
      if (!phone) {
        newErrors.phone = "Phone number is required.";
        isValid = false;
      }

      updateResume({
        personalInfo: localPersonalInfo
      });
    }

    if (currentStep === 2) {
      const activeSummary = (localSummary || summary || '').trim();
      if (!activeSummary) {
        newErrors.summary = "Professional summary is required.";
        isValid = false;
      }
      updateResume({
        summary: localSummary
      });
    }

    if (currentStep === 3 && localExperience.length > 0) {
      const hasEmptyExp = localExperience.some(exp => !(exp.company || '').trim() || !(exp.role || '').trim());
      if (hasEmptyExp) {
        newErrors.experience = "All experiences must have a Company name and Role title.";
        isValid = false;
      }
    }

    if (currentStep === 4 && localEducation.length > 0) {
      const hasEmptyEdu = localEducation.some(edu => !(edu.degree || '').trim() || !(edu.university || '').trim());
      if (hasEmptyEdu) {
        newErrors.education = "All education items must specify a Degree program and University.";
        isValid = false;
      }
    }

    if (currentStep === 5) {
      const techSkills = localSkills.technical || [];
      if (techSkills.length === 0 && !techSkillInput.trim()) {
        newErrors.skills = "Please add at least one technical skill.";
        isValid = false;
      }
    }

    if (currentStep === 6 && localProjects.length > 0) {
      const hasEmptyProj = localProjects.some(p => !(p.title || '').trim() || !(p.description || '').trim());
      if (hasEmptyProj) {
        newErrors.projects = "All projects must have a Title and Description.";
        isValid = false;
      }
    }

    if (currentStep === 7 && localCertifications.length > 0) {
      const hasEmptyCert = localCertifications.some(c => !(c.name || '').trim() || !(c.issuer || '').trim());
      if (hasEmptyCert) {
        newErrors.certifications = "All certifications must specify Name and Issuer.";
        isValid = false;
      }
    }

    if (currentStep === 8) {
      const langs = localSkills.languages || [];
      if (langs.length === 0 && !langInput.trim()) {
        newErrors.languages = "Please specify at least one Language.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    const currentStep = step;

    // Auto-commit any typed text in skill/language fields before validating
    if (currentStep === 5) {
      const updatedSkills = { ...localSkills };
      let hasUpdates = false;

      if (techSkillInput.trim()) {
        const newItems = techSkillInput.split(',')
          .map(item => item.trim())
          .filter(item => item !== '' && !(localSkills.technical || []).includes(item));
        if (newItems.length > 0) {
          updatedSkills.technical = [...(localSkills.technical || []), ...newItems];
          hasUpdates = true;
        }
        setTechSkillInput('');
      }

      if (softSkillInput.trim()) {
        const newItems = softSkillInput.split(',')
          .map(item => item.trim())
          .filter(item => item !== '' && !(localSkills.soft || []).includes(item));
        if (newItems.length > 0) {
          updatedSkills.soft = [...(localSkills.soft || []), ...newItems];
          hasUpdates = true;
        }
        setSoftSkillInput('');
      }

      if (hasUpdates) {
        setLocalSkills(updatedSkills);
        updateResume({ skills: updatedSkills });
      }
    }

    if (currentStep === 8) {
      if (langInput.trim()) {
        const newItems = langInput.split(',')
          .map(item => item.trim())
          .filter(item => item !== '' && !(localSkills.languages || []).includes(item));
        if (newItems.length > 0) {
          const updatedSkills = {
            ...localSkills,
            languages: [...(localSkills.languages || []), ...newItems]
          };
          setLocalSkills(updatedSkills);
          updateResume({ skills: updatedSkills });
        }
        setLangInput('');
      }
    }

    if (validateStep(step)) {
      setStep(prev => Math.min(10, prev + 1));
    } else {
      toast("Please resolve the validation errors before proceeding.", "error");
    }
  };

  const handleBackStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleClearAllData = () => {
    const emptyInfo = {
      name: '',
      jobTitle: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      portfolio: '',
      address: '',
      photo: ''
    };
    setLocalPersonalInfo(emptyInfo);
    setLocalSummary('');
    setLocalExperience([]);
    setLocalEducation([]);
    setLocalSkills({ technical: [], soft: [], languages: [] });
    setLocalProjects([]);
    setLocalCertifications([]);
    setErrors({});
    updateResume({
      personalInfo: emptyInfo,
      summary: '',
      experience: [],
      education: [],
      skills: { technical: [], soft: [], languages: [] },
      certifications: [],
      projects: [],
      awards: []
    });
    toast("Form cleared! Start entering your details.", "success");
  };

  const handleLoadSampleData = () => {
    const sampleInfo = {
      name: 'Alexander Sterling',
      jobTitle: 'Senior Software Engineer',
      email: 'alexander@example.com',
      phone: '(555) 019-2834',
      linkedin: 'linkedin.com/in/alexander',
      github: 'github.com/alexander',
      portfolio: 'alexander.dev',
      address: 'San Francisco, CA',
      photo: ''
    };
    setLocalPersonalInfo(sampleInfo);
    updateResume({
      personalInfo: sampleInfo,
      summary: 'Results-oriented Senior Software Engineer with 6+ years of experience architecting web applications, designing developer tools, and optimizing cloud serverless infrastructure.',
      experience: [
        {
          id: 'exp-1',
          title: 'Lead Software Engineer',
          company: 'Vercel',
          location: 'San Francisco, CA',
          startDate: '2023-01',
          endDate: 'Present',
          current: true,
          description: '• Architected serverless deployments on Vercel platforms, reducing cold starts by 42%.\n• Spearheaded micro-frontend migration across core enterprise client apps.'
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
        technical: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
        soft: ['Technical Leadership', 'System Architecture'],
        languages: ['English (Native)']
      },
      certifications: [],
      projects: [],
      awards: []
    });
    toast("Sample data loaded into workspace.", "success");
  };

  // Form Field change handlers
  const handlePersonalInfoChange = (field: keyof typeof localPersonalInfo, value: string) => {
    const updated = {
      ...localPersonalInfo,
      [field]: value
    };
    setLocalPersonalInfo(updated);
    
    // Dynamically clear validation error for this field as soon as user types
    setErrors(prev => {
      if (!prev[field as keyof ValidationErrors]) return prev;
      const copy = { ...prev };
      delete copy[field as keyof ValidationErrors];
      return copy;
    });

    updateResume({
      personalInfo: updated
    });
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalSummary(val);
    setErrors(prev => {
      if (!prev.summary) return prev;
      const copy = { ...prev };
      delete copy.summary;
      return copy;
    });
    updateResume({ summary: val });
  };

  const handleGenerateSummary = async (tone: 'professional' | 'executive' | 'creative') => {
    const targetJobTitle = (localPersonalInfo.jobTitle || personalInfo.jobTitle || 'Software Engineer').trim();
    setAiGenerating(true);
    try {
      const generated = await generateSummaryApi(targetJobTitle, tone);
      setLocalSummary(generated);
      setErrors(prev => {
        if (!prev.summary) return prev;
        const copy = { ...prev };
        delete copy.summary;
        return copy;
      });
      updateResume({ summary: generated, personalInfo: localPersonalInfo });
      toast(`AI Summary generated successfully in ${tone} tone.`);
    } catch (err) {
      console.warn("[AI Summary Generator] Error:", err);
      toast("Using AI simulator to generate summary...", "info");
      const generated = simulateSummary({
        jobTitle: targetJobTitle,
        tone
      });
      setLocalSummary(generated);
      setErrors(prev => {
        if (!prev.summary) return prev;
        const copy = { ...prev };
        delete copy.summary;
        return copy;
      });
      updateResume({ summary: generated, personalInfo: localPersonalInfo });
    } finally {
      setAiGenerating(false);
    }
  };

  // Experience handlers with local buffer state
  const handleAddExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      duration: '',
      location: '',
      responsibilities: [''],
      achievements: []
    };
    const updated = [...localExperience, newExp];
    setLocalExperience(updated);
    setErrors(prev => {
      if (!prev.experience) return prev;
      const copy = { ...prev };
      delete copy.experience;
      return copy;
    });
    updateResume({ experience: updated });
  };

  const handleUpdateExperience = (id: string, field: string, value: string | string[]) => {
    const updated = localExperience.map(exp => {
      if (exp.id === id) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    setLocalExperience(updated);
    updateResume({ experience: updated });
  };

  const handleDeleteExperience = (id: string) => {
    const updated = localExperience.filter(exp => exp.id !== id);
    setLocalExperience(updated);
    updateResume({ experience: updated });
    toast("Experience entry deleted.", "info");
  };

  const handleAddResp = (expId: string) => {
    const exp = localExperience.find(e => e.id === expId);
    if (!exp) return;
    const current = exp.responsibilities || [];
    handleUpdateExperience(expId, 'responsibilities', [...current, '']);
  };

  const handleUpdateResp = (expId: string, idx: number, val: string) => {
    const exp = localExperience.find(e => e.id === expId);
    if (!exp) return;
    const current = exp.responsibilities || [];
    const newResps = [...current];
    newResps[idx] = val;
    handleUpdateExperience(expId, 'responsibilities', newResps);
  };

  const handleDeleteResp = (expId: string, idx: number) => {
    const exp = localExperience.find(e => e.id === expId);
    if (!exp) return;
    const current = exp.responsibilities || [];
    handleUpdateExperience(expId, 'responsibilities', current.filter((_, i) => i !== idx));
  };

  const handleEnhanceExperienceBullets = async (expId: string) => {
    const exp = localExperience.find(e => e.id === expId);
    if (!exp) return;
    const targetTitle = (localPersonalInfo.jobTitle || personalInfo.jobTitle || 'Software Engineer').trim();
    toast("AI is transforming responsibilities...", "info");
    try {
      const current = exp.responsibilities || [];
      const enhanced = await improveExperienceApi(targetTitle, current);
      handleUpdateExperience(expId, 'achievements', enhanced);
      toast("Bullet points optimized into achievements.");
    } catch (err) {
      console.warn("[AI Experience Enhancer] Error:", err);
      toast("Failed to query OpenAI. Using fallback simulator.", "info");
      const current = exp.responsibilities || [];
      const enhanced = simulateExperience(targetTitle, current);
      handleUpdateExperience(expId, 'achievements', enhanced);
    }
  };

  // Education handlers
  const handleAddEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree: '',
      university: '',
      duration: '',
      cgpa: '',
      location: ''
    };
    const updated = [...localEducation, newEdu];
    setLocalEducation(updated);
    updateResume({ education: updated });
  };

  const handleUpdateEducation = (id: string, field: string, value: string) => {
    const updated = localEducation.map(edu => {
      if (edu.id === id) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    setLocalEducation(updated);
    updateResume({ education: updated });
  };

  const handleDeleteEducation = (id: string) => {
    const updated = localEducation.filter(edu => edu.id !== id);
    setLocalEducation(updated);
    updateResume({ education: updated });
    toast("Education item deleted.", "info");
  };

  // Skills
  const handleSkillAdd = (type: 'technical' | 'soft' | 'languages', value: string) => {
    if (!value.trim()) return;
    
    const newItems = value.split(',')
      .map(item => item.trim())
      .filter(item => item !== '' && !(localSkills[type] || []).includes(item));
      
    if (newItems.length === 0) return;

    const updated = {
      ...localSkills,
      [type]: [...(localSkills[type] || []), ...newItems]
    };
    setLocalSkills(updated);
    updateResume({ skills: updated });
  };

  const handleSkillDelete = (type: 'technical' | 'soft' | 'languages', idx: number) => {
    const updated = {
      ...localSkills,
      [type]: (localSkills[type] || []).filter((_, i) => i !== idx)
    };
    setLocalSkills(updated);
    updateResume({ skills: updated });
  };

  // Projects
  const handleAddProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: '',
      description: '',
      technologies: [],
      link: ''
    };
    const updated = [...localProjects, newProj];
    setLocalProjects(updated);
    updateResume({ projects: updated });
  };

  const handleUpdateProject = (id: string, field: string, value: string | string[]) => {
    const updated = localProjects.map(p => p.id === id ? { ...p, [field]: value } : p);
    setLocalProjects(updated);
    updateResume({ projects: updated });
  };

  const handleDeleteProject = (id: string) => {
    const updated = localProjects.filter(p => p.id !== id);
    setLocalProjects(updated);
    updateResume({ projects: updated });
    toast("Project item deleted.", "info");
  };

  // Certs
  const handleAddCert = () => {
    const newCert = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      year: ''
    };
    const updated = [...localCertifications, newCert];
    setLocalCertifications(updated);
    updateResume({ certifications: updated });
  };

  const handleUpdateCert = (id: string, field: string, value: string) => {
    const updated = localCertifications.map(c => c.id === id ? { ...c, [field]: value } : c);
    setLocalCertifications(updated);
    updateResume({ certifications: updated });
  };

  const handleDeleteCert = (id: string) => {
    const updated = localCertifications.filter(c => c.id !== id);
    setLocalCertifications(updated);
    updateResume({ certifications: updated });
    toast("Certification item deleted.", "info");
  };

  // Theme layout
  const handleStyleChange = (field: keyof typeof style, value: string) => {
    updateResume({
      style: {
        ...style,
        [field]: value
      }
    });
  };

  const handleApplyWizardStyle = () => {
    const finalTemplate = wizardTemplate || 'modern';
    const finalFontFamily = wizardFontFamily || 'sans';
    const finalFontSize = wizardFontSize || 'md';

    updateResume({
      personalInfo: {
        ...personalInfo,
        photo: wizardPhoto === 'yes' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop' : ''
      },
      style: {
        ...style,
        templateId: finalTemplate,
        primaryColor: wizardColor,
        fontFamily: finalFontFamily,
        fontSize: finalFontSize
      }
    });

    // Sync the filters state with wizard configurations
    setFilterPhoto(wizardPhoto === 'yes' ? 'with-photo' : 'without-photo');
    setFilterLayout(wizardLayout === 'one-column' ? '1-column' : '2-column');
    if (wizardIndustries.length > 0) {
      setFilterIndustry(wizardIndustries[0]);
    } else {
      setFilterIndustry(null);
    }

    setShowStyleWizardModal(false);
    toast(`Applied Style Settings: template is now ${finalTemplate.replace('-', ' ')} with ${finalFontFamily} font!`, "success");
  };

  const handleDownloadPdf = () => {
    toast("Preparing PDF document...", "info");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://mira-resume.io/share/${activeResume.id}`);
    toast("Shareable link copied.");
  };

  const handleExportTxt = () => {
    const text = `
${personalInfo.name} - ${personalInfo.jobTitle}
Email: ${personalInfo.email} | Phone: ${personalInfo.phone}
Address: ${personalInfo.address}
LinkedIn: ${personalInfo.linkedin} | GitHub: ${personalInfo.github}

SUMMARY
${summary}

EXPERIENCE
${experience.map(exp => `
${exp.role} at ${exp.company} (${exp.duration})
${exp.responsibilities.map(r => `- ${r}`).join('\n')}
${exp.achievements.map(a => `- Achievement: ${a}`).join('\n')}
`).join('\n')}

EDUCATION
${education.map(edu => `
${edu.degree} - ${edu.university} (${edu.duration}) ${edu.cgpa ? `CGPA: ${edu.cgpa}` : ''}
`).join('\n')}

TECHNICAL SKILLS: ${skills.technical.join(', ')}
SOFT SKILLS: ${skills.soft.join(', ')}
LANGUAGES: ${skills.languages.join(', ')}
    `.trim();

    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${personalInfo.name.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast("Plain Text export finished.");
  };

  const handleDownloadDocx = () => {
    toast("Generating MS Word document...", "info");
    const htmlHeader = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <title>${localPersonalInfo.name || 'Resume'}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Arial', sans-serif; font-size: 11pt; line-height: 1.25; color: #1a1a1a; margin: 1in; }
          h1 { font-size: 22pt; font-weight: bold; text-transform: uppercase; margin-bottom: 2pt; color: #000; text-align: center; }
          .job-title { font-size: 12pt; text-transform: uppercase; color: #666; font-weight: bold; margin-bottom: 12pt; text-align: center; }
          .contacts { text-align: center; font-size: 10pt; color: #555; margin-bottom: 20pt; border-bottom: 2px solid #000; padding-bottom: 8pt; }
          h2 { font-size: 13pt; font-weight: bold; text-transform: uppercase; margin-top: 18pt; border-bottom: 1px solid #ccc; padding-bottom: 2pt; margin-bottom: 8pt; color: ${style.primaryColor || '#000'}; }
          .section { margin-bottom: 12pt; }
          .entry { margin-bottom: 8.5pt; }
          .entry-header { font-weight: bold; font-size: 11pt; }
          ul { margin-top: 3pt; margin-bottom: 6pt; padding-left: 20pt; }
          li { font-size: 10.5pt; color: #333; margin-bottom: 2pt; }
        </style>
      </head>
      <body>
        <h1>${localPersonalInfo.name || 'Your Name'}</h1>
        <div class="job-title">${localPersonalInfo.jobTitle || ''}</div>
        <div class="contacts">
          ${[localPersonalInfo.email, localPersonalInfo.phone, localPersonalInfo.address, localPersonalInfo.linkedin, localPersonalInfo.github].filter(Boolean).join('  |  ')}
        </div>
        ${localSummary ? `<div class="section"><h2>Professional Summary</h2><p>${localSummary}</p></div>` : ''}
        ${localExperience.length > 0 ? `
        <div class="section">
          <h2>Work Experience</h2>
          ${localExperience.map(exp => `
            <div class="entry">
              <div class="entry-header"><strong>${exp.role || ''} &mdash; ${exp.company || ''}</strong><span style="float: right; font-weight: normal; font-size: 10pt;">${exp.duration || ''}</span></div>
              <div style="font-size: 10pt; color: #666; margin-bottom: 4pt;">${exp.location || ''}</div>
              <ul>${(exp.responsibilities || []).map(r => `<li>${r}</li>`).join('')}${(exp.achievements || []).map(a => `<li><strong>${a}</strong></li>`).join('')}</ul>
            </div>
          `).join('')}
        </div>
        ` : ''}
        ${localEducation.length > 0 ? `
        <div class="section">
          <h2>Education</h2>
          ${localEducation.map(edu => `
            <div class="entry">
              <div class="entry-header"><strong>${edu.degree || ''} &mdash; ${edu.university || ''}</strong><span style="float: right; font-weight: normal; font-size: 10pt;">${edu.duration || ''}</span></div>
              ${edu.cgpa ? `<div style="font-size: 10pt; color: #666;">CGPA: ${edu.cgpa}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
        ${((localSkills.technical && localSkills.technical.length > 0) || (localSkills.soft && localSkills.soft.length > 0) || (localSkills.languages && localSkills.languages.length > 0)) ? `
        <div class="section">
          <h2>Skills</h2>
          ${(localSkills.technical || []).length > 0 ? `<p><strong>Technical Skills:</strong> ${localSkills.technical.join(', ')}</p>` : ''}
          ${(localSkills.soft || []).length > 0 ? `<p><strong>Soft Skills:</strong> ${localSkills.soft.join(', ')}</p>` : ''}
          ${(localSkills.languages || []).length > 0 ? `<p><strong>Languages:</strong> ${localSkills.languages.join(', ')}</p>` : ''}
        </div>
        ` : ''}
        ${localProjects.length > 0 ? `
        <div class="section">
          <h2>Projects</h2>
          ${localProjects.map(proj => `
            <div class="entry">
              <div class="entry-header"><strong>${proj.title}</strong></div>
              <p style="font-size: 10.5pt; color: #333;">${proj.description}</p>
            </div>
          `).join('')}
        </div>
        ` : ''}
        ${localCertifications.length > 0 ? `
        <div class="section">
          <h2>Certifications</h2>
          ${localCertifications.map(cert => `
            <div class="entry">
              <div class="entry-header"><strong>${cert.name}</strong> &mdash; ${cert.issuer} ${cert.year ? `(${cert.year})` : ''}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + htmlHeader], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const element = document.createElement("a");
    element.href = url;
    element.download = `${(localPersonalInfo.name || 'My').replace(/\s+/g, '_')}_Resume.doc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast("DOCX file downloaded successfully.", "success");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      
      {/* Stepper Header */}
      <nav className="no-print sticky top-0 left-0 right-0 z-40 glass-panel border-b border-neutral-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3 text-left">
            <Link 
              href="/" 
              className="h-8 w-8 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-sm font-bold tracking-wider uppercase truncate max-w-[200px]">
                {activeResume.title}
              </h1>
              <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">10-Step Builder Workspace</p>
            </div>
          </div>

          {/* Sizing progress percent */}
          <div className="flex items-center space-x-3 text-left sm:text-right">
            <div className="hidden sm:block">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Resume Progress</span>
              <p className="text-xs font-bold text-white mt-0.5">{step * 10}% Complete</p>
            </div>
            <div className="h-1.5 w-32 bg-neutral-900 rounded-full overflow-hidden border border-neutral-850">
              <div className="h-full bg-white transition-all duration-500" style={{ width: `${step * 10}%` }}></div>
            </div>
          </div>
        </div>

        {/* Stepper Steps Row */}
        <div className="hidden lg:flex justify-between max-w-7xl mx-auto mt-4 pt-4 border-t border-neutral-900/50 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          {[
            stepLabels.s1, stepLabels.s2, stepLabels.s3, stepLabels.s4, stepLabels.s5, 
            stepLabels.s6, stepLabels.s7, stepLabels.s8, stepLabels.s9, stepLabels.s10
          ].map((name, i) => {
            const stepNum = i + 1;
            return (
              <button 
                key={i}
                onClick={() => {
                  if (validateStep(step)) {
                    setStep(stepNum);
                  }
                }}
                className={cn(
                  "pb-2 border-b-2 transition-all flex items-center space-x-1.5",
                  step === stepNum 
                    ? "text-white border-white font-extrabold" 
                    : stepNum < step 
                      ? "text-emerald-400 border-emerald-500"
                      : "border-transparent hover:text-neutral-300"
                )}
              >
                <span>{stepNum}</span>
                <span>{name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile View Switcher Bar (Visible on mobile/tablet screens < 1024px) */}
      <div className="no-print print:hidden lg:hidden flex items-center justify-center p-2.5 bg-neutral-950 border-b border-neutral-900 sticky top-[73px] z-20">
        <div className="flex items-center p-1 bg-neutral-900 rounded-xl border border-neutral-800 text-xs font-bold w-full max-w-xs justify-between">
          <button
            type="button"
            onClick={() => setMobileViewTab('editor')}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
              mobileViewTab === 'editor'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            📝 Edit Form
          </button>
          <button
            type="button"
            onClick={() => setMobileViewTab('preview')}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
              mobileViewTab === 'preview'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            👁 Live Preview
          </button>
        </div>
      </div>

      {/* Builder Workspace Pane */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Form Editor */}
        <div className={cn(
          "no-print w-full lg:w-[480px] xl:w-[520px] border-r border-neutral-900 bg-neutral-950/20 flex-col justify-between shrink-0 h-full overflow-y-auto",
          mobileViewTab === 'preview' ? 'hidden lg:flex' : 'flex'
        )}>
          
          <div className="p-6 space-y-6 pb-20">
            
            {/* Step Banner */}
            <div className="flex justify-between items-center bg-neutral-950/80 border border-neutral-900 p-3 rounded-lg text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Step {step} of 10</span>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                {step === 1 && stepLabels.s1_full}
                {step === 2 && stepLabels.s2_full}
                {step === 3 && stepLabels.s3_full}
                {step === 4 && stepLabels.s4_full}
                {step === 5 && stepLabels.s5_full}
                {step === 6 && stepLabels.s6_full}
                {step === 7 && stepLabels.s7_full}
                {step === 8 && stepLabels.s8_full}
                {step === 9 && stepLabels.s9_full}
                {step === 10 && stepLabels.s10_full}
              </span>
            </div>

            {/* STEP 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6 text-left">
                {/* Form Control Toolbar */}
                <div className="flex items-center justify-between p-3 bg-neutral-900/60 border border-neutral-850 rounded-xl mb-4 text-xs">
                  <span className="text-neutral-400 font-bold uppercase text-[9px] tracking-wider">Form Controls</span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleClearAllData}
                      className="px-2.5 py-1.5 bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/40 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Clear Form
                    </button>
                    <button
                      type="button"
                      onClick={handleLoadSampleData}
                      className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Load Demo Sample
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Full Name</label>
                    <Input 
                      value={localPersonalInfo.name || ''} 
                      onChange={(e) => handlePersonalInfoChange('name', e.target.value)} 
                      placeholder="Enter your full name" 
                    />
                    {errors.name && <p className="text-[10px] text-red-400 mt-1 flex items-center"><AlertCircle className="h-3.5 w-3.5 mr-1" />{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Job Title Target</label>
                    <Input 
                      value={localPersonalInfo.jobTitle || ''} 
                      onChange={(e) => handlePersonalInfoChange('jobTitle', e.target.value)} 
                      placeholder="Enter job title target" 
                    />
                    {errors.jobTitle && <p className="text-[10px] text-red-400 mt-1 flex items-center"><AlertCircle className="h-3.5 w-3.5 mr-1" />{errors.jobTitle}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Email</label>
                      <Input 
                        type="email" 
                        value={localPersonalInfo.email || ''} 
                        onChange={(e) => handlePersonalInfoChange('email', e.target.value)} 
                        placeholder="Enter email address" 
                      />
                      {errors.email && <p className="text-[10px] text-red-400 mt-1 flex items-center"><AlertCircle className="h-3.5 w-3.5 mr-1" />{errors.email}</p>}
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Phone</label>
                      <Input 
                        value={localPersonalInfo.phone || ''} 
                        onChange={(e) => handlePersonalInfoChange('phone', e.target.value)} 
                        placeholder="Enter phone number" 
                      />
                      {errors.phone && <p className="text-[10px] text-red-400 mt-1 flex items-center"><AlertCircle className="h-3.5 w-3.5 mr-1" />{errors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Address Location</label>
                    <Input 
                      value={localPersonalInfo.address || ''} 
                      onChange={(e) => handlePersonalInfoChange('address', e.target.value)} 
                      placeholder="Enter location (City, Country)" 
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1.5">Profile Photo</label>
                    <div className="flex gap-3 items-center">
                      {localPersonalInfo.photo ? (
                        <div className="relative h-12 w-12 rounded-full overflow-hidden border border-neutral-800 shrink-0">
                          <img src={localPersonalInfo.photo} alt="Profile preview" className="h-full w-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => handlePersonalInfoChange('photo', '')}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-[9px] uppercase font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 shrink-0">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <Input 
                          value={localPersonalInfo.photo || ''} 
                          onChange={(e) => handlePersonalInfoChange('photo', e.target.value)} 
                          placeholder="Paste photo URL or upload file..." 
                          className="text-xs"
                        />
                        <div className="flex items-center gap-2">
                          <label className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded text-[9px] uppercase font-bold tracking-wider text-neutral-300 cursor-pointer transition-colors">
                            Upload File
                            <input 
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    if (event.target?.result) {
                                      handlePersonalInfoChange('photo', event.target.result as string);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          <span className="text-[9px] text-neutral-500 uppercase font-bold">Max 2MB (JPEG, PNG)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-900 space-y-4">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-neutral-400 block">Social Links</label>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">LinkedIn URL</label>
                    <Input 
                      value={localPersonalInfo.linkedin || ''} 
                      onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)} 
                      placeholder="linkedin.com/in/yourname" 
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">GitHub URL</label>
                    <Input 
                      value={localPersonalInfo.github || ''} 
                      onChange={(e) => handlePersonalInfoChange('github', e.target.value)} 
                      placeholder="github.com/yourusername" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Summary */}
            {step === 2 && (
              <div className="space-y-6 text-left">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400">Professional Summary</label>
                    <span className="text-[8px] bg-neutral-900 border border-neutral-800 text-neutral-500 px-1.5 py-0.5 rounded font-bold">LEN: {localSummary.length}</span>
                  </div>
                  <Textarea 
                    value={localSummary} 
                    onChange={handleSummaryChange} 
                    placeholder="Briefly state your core expertise and target role parameters..."
                    className="min-h-[160px]"
                  />
                  {errors.summary && <p className="text-[10px] text-red-400 mt-1 flex items-center"><AlertCircle className="h-3.5 w-3.5 mr-1" />{errors.summary}</p>}
                </div>

                <div className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-bold text-purple-400">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span>Generate summary with AI</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => handleGenerateSummary('professional')} disabled={aiGenerating} className="py-2 bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-[9px] font-bold uppercase tracking-wider rounded transition-colors">Professional</button>
                    <button onClick={() => handleGenerateSummary('executive')} disabled={aiGenerating} className="py-2 bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-[9px] font-bold uppercase tracking-wider rounded transition-colors">Executive</button>
                    <button onClick={() => handleGenerateSummary('creative')} disabled={aiGenerating} className="py-2 bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-[9px] font-bold uppercase tracking-wider rounded transition-colors">Creative</button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Experience */}
            {step === 3 && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">{stepLabels.s3_sub}</h3>
                  <button 
                    onClick={handleAddExperience}
                    className="px-3 py-1.5 bg-neutral-900 border border-neutral-850 text-[9px] font-bold uppercase tracking-wider rounded flex items-center space-x-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Position</span>
                  </button>
                </div>
                {errors.experience && <p className="text-[10px] text-red-400 mt-1 flex items-center"><AlertCircle className="h-3.5 w-3.5 mr-1" />{errors.experience}</p>}

                <div className="space-y-6">
                  {localExperience.map((exp) => (
                    <GlassCard key={exp.id} className="p-5 border border-neutral-900 space-y-4 relative">
                      <button 
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="absolute top-4 right-4 text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Company</label>
                          <Input value={exp.company} onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)} />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Role Title</label>
                          <Input value={exp.role} onChange={(e) => handleUpdateExperience(exp.id, 'role', e.target.value)} />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Duration</label>
                          <Input value={exp.duration} onChange={(e) => handleUpdateExperience(exp.id, 'duration', e.target.value)} placeholder="2022 - Present" />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Location</label>
                          <Input value={exp.location} onChange={(e) => handleUpdateExperience(exp.id, 'location', e.target.value)} />
                        </div>
                      </div>

                      {/* Responsibilities list */}
                      <div className="space-y-2 pt-2 border-t border-neutral-900">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400">Responsibilities</label>
                          <button onClick={() => handleAddResp(exp.id)} className="text-[9px] font-bold text-neutral-400 hover:text-white uppercase">+ Add Bullet</button>
                        </div>
                        <div className="space-y-2">
                          {(exp.responsibilities || []).map((resp, rIdx) => (
                            <div key={rIdx} className="flex items-center space-x-2">
                              <Input value={resp || ''} onChange={(e) => handleUpdateResp(exp.id, rIdx, e.target.value)} />
                              <button onClick={() => handleDeleteResp(exp.id, rIdx)} className="text-neutral-500 hover:text-red-400"><X className="h-3.5 w-3.5" /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={() => handleEnhanceExperienceBullets(exp.id)}
                        className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 text-[9px] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 border border-neutral-800 rounded flex items-center justify-center space-x-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Enhance Bullet Points with AI</span>
                      </button>

                      {(exp.achievements || []).length > 0 && (
                        <div className="p-3 bg-neutral-900/50 rounded border border-neutral-800/50 text-xs text-neutral-300 space-y-1">
                          <span className="text-[8px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Optimized Output</span>
                          {(exp.achievements || []).map((ach, aIdx) => (
                            <p key={aIdx} className="italic">&bull; {ach}</p>
                          ))}
                        </div>
                      )}
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Education */}
            {step === 4 && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">{stepLabels.s4_sub}</h3>
                  <button 
                    onClick={handleAddEducation}
                    className="px-3 py-1.5 bg-neutral-900 border border-neutral-850 text-[9px] font-bold uppercase tracking-wider rounded flex items-center space-x-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Edu</span>
                  </button>
                </div>
                {errors.education && <p className="text-[10px] text-red-400 mt-1 flex items-center"><AlertCircle className="h-3.5 w-3.5 mr-1" />{errors.education}</p>}

                <div className="space-y-6">
                  {localEducation.map((edu) => (
                    <GlassCard key={edu.id} className="p-5 border border-neutral-900 space-y-4 relative">
                      <button 
                        onClick={() => handleDeleteEducation(edu.id)}
                        className="absolute top-4 right-4 text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Degree Program</label>
                          <Input value={edu.degree} onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)} />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">University</label>
                          <Input value={edu.university} onChange={(e) => handleUpdateEducation(edu.id, 'university', e.target.value)} />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Duration</label>
                          <Input value={edu.duration} onChange={(e) => handleUpdateEducation(edu.id, 'duration', e.target.value)} placeholder="2016 - 2020" />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">CGPA</label>
                          <Input value={edu.cgpa} onChange={(e) => handleUpdateEducation(edu.id, 'cgpa', e.target.value)} />
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: Skills */}
            {step === 5 && (
              <div className="space-y-6 text-left">
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">{stepLabels.s5_tech}</h3>
                  <Input 
                    placeholder="Type skill and press Enter or comma (e.g. Next.js)" 
                    value={techSkillInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.endsWith(',')) {
                        handleSkillAdd('technical', val);
                        setTechSkillInput('');
                      } else {
                        setTechSkillInput(val);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSkillAdd('technical', techSkillInput);
                        setTechSkillInput('');
                      }
                    }}
                  />
                  {errors.skills && <p className="text-[10px] text-red-400 mt-1 flex items-center"><AlertCircle className="h-3.5 w-3.5 mr-1" />{errors.skills}</p>}
                  
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(localSkills.technical || []).map((sk, idx) => (
                      <span key={idx} className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1.5">
                        <span>{sk}</span>
                        <button onClick={() => handleSkillDelete('technical', idx)} className="text-neutral-500 hover:text-white">&times;</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-neutral-900">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">{stepLabels.s5_soft}</h3>
                  <Input 
                    placeholder="Type skill and press Enter or comma (e.g. Leadership)" 
                    value={softSkillInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.endsWith(',')) {
                        handleSkillAdd('soft', val);
                        setSoftSkillInput('');
                      } else {
                        setSoftSkillInput(val);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSkillAdd('soft', softSkillInput);
                        setSoftSkillInput('');
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(localSkills.soft || []).map((sk, idx) => (
                      <span key={idx} className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1.5">
                        <span>{sk}</span>
                        <button onClick={() => handleSkillDelete('soft', idx)} className="text-neutral-500 hover:text-white">&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Projects */}
            {step === 6 && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">{stepLabels.s6_sub}</h3>
                  <button 
                    onClick={handleAddProject}
                    className="px-3 py-1.5 bg-neutral-900 border border-neutral-850 text-[9px] font-bold uppercase tracking-wider rounded flex items-center space-x-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>
                {errors.projects && <p className="text-[10px] text-red-400 mt-1 flex items-center"><AlertCircle className="h-3.5 w-3.5 mr-1" />{errors.projects}</p>}

                <div className="space-y-6">
                  {localProjects.map((proj) => (
                    <GlassCard key={proj.id} className="p-4 bg-neutral-950 border border-neutral-900 space-y-3 relative text-left">
                      <button 
                        onClick={() => handleDeleteProject(proj.id)}
                        className="absolute top-4 right-4 text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <div>
                        <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Project Title</label>
                        <Input value={proj.title} onChange={(e) => handleUpdateProject(proj.id, 'title', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Description</label>
                        <Textarea value={proj.description} onChange={(e) => handleUpdateProject(proj.id, 'description', e.target.value)} className="min-h-[60px]" />
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 7: Certifications */}
            {step === 7 && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">{stepLabels.s7_sub}</h3>
                  <button 
                    onClick={handleAddCert}
                    className="px-3 py-1.5 bg-neutral-900 border border-neutral-850 text-[9px] font-bold uppercase tracking-wider rounded flex items-center space-x-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Cert</span>
                  </button>
                </div>
                {errors.certifications && <p className="text-[10px] text-red-400 mt-1 flex items-center"><AlertCircle className="h-3.5 w-3.5 mr-1" />{errors.certifications}</p>}

                <div className="space-y-4">
                  {localCertifications.map((cert) => (
                    <div key={cert.id} className="grid grid-cols-3 gap-2 items-center relative pr-8">
                      <Input value={cert.name} onChange={(e) => handleUpdateCert(cert.id, 'name', e.target.value)} placeholder="Name" />
                      <Input value={cert.issuer} onChange={(e) => handleUpdateCert(cert.id, 'issuer', e.target.value)} placeholder="Issuer" />
                      <Input value={cert.year} onChange={(e) => handleUpdateCert(cert.id, 'year', e.target.value)} placeholder="Year" />
                      <button 
                        onClick={() => handleDeleteCert(cert.id)}
                        className="absolute right-0 top-3 text-neutral-500 hover:text-red-400 animate-pulse"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 8: Languages */}
            {step === 8 && (
              <div className="space-y-6 text-left">
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Languages spoken</h3>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. Spanish (Fluent)" 
                      value={langInput}
                      onChange={(e) => setLangInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSkillAdd('languages', langInput);
                          setLangInput('');
                        }
                      }}
                    />
                    <button 
                      onClick={() => {
                        handleSkillAdd('languages', langInput);
                        setLangInput('');
                      }}
                      className="px-4 bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase rounded"
                    >
                      Add
                    </button>
                  </div>
                  {errors.languages && <p className="text-[10px] text-red-400 mt-1 flex items-center"><AlertCircle className="h-3.5 w-3.5 mr-1" />{errors.languages}</p>}

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(localSkills.languages || []).map((sk, idx) => (
                      <span key={idx} className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1.5">
                        <span>{sk}</span>
                        <button onClick={() => handleSkillDelete('languages', idx)} className="text-neutral-500 hover:text-white">&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 9: Choose Template */}
            {step === 9 && (
              <div className="space-y-6 text-left">
                {/* Style Wizard Banner */}
                <div className="p-4 bg-gradient-to-br from-indigo-950/50 via-purple-950/40 to-blue-950/40 border border-neutral-850 rounded-xl space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                      <Sparkles className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Style Onboarding Wizard</h4>
                      <p className="text-[10px] text-neutral-400">Step-by-step layout, photo, and color configurator</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setWizardStep(1);
                      setShowStyleWizardModal(true);
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <span>🪄 Run Selection Wizard</span>
                  </button>
                </div>

                {/* FILTER CONTROLS BAR (Matches Screenshot 5) */}
                <div className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl space-y-3.5">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Photo dropdown */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">Filter Photo</label>
                      <select 
                        value={filterPhoto} 
                        onChange={(e) => setFilterPhoto(e.target.value as 'all' | 'with-photo' | 'without-photo')}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300 focus:outline-none focus:border-neutral-750 cursor-pointer"
                      >
                        <option value="all">All Profiles</option>
                        <option value="with-photo">With Photo</option>
                        <option value="without-photo">Without Photo</option>
                      </select>
                    </div>

                    {/* Columns dropdown */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">Layout Columns</label>
                      <select 
                        value={filterLayout} 
                        onChange={(e) => setFilterLayout(e.target.value as 'all' | '1-column' | '2-column')}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300 focus:outline-none focus:border-neutral-750 cursor-pointer"
                      >
                        <option value="all">All Columns</option>
                        <option value="1-column">1 Column</option>
                        <option value="2-column">2 Columns</option>
                      </select>
                    </div>
                  </div>

                  {/* Accent Colors row picker */}
                  <div className="space-y-1 pt-1.5 border-t border-neutral-900/60">
                    <label className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">Color Palette</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { hex: '#333333', name: 'Charcoal' },
                        { hex: '#b5a69a', name: 'Beige' },
                        { hex: '#1e3a8a', name: 'Navy' },
                        { hex: '#3b82f6', name: 'Blue' },
                        { hex: '#06b6d4', name: 'Cyan' },
                        { hex: '#10b981', name: 'Teal' },
                        { hex: '#f59e0b', name: 'Orange' },
                        { hex: '#ef4444', name: 'Red' },
                        { hex: '#8b5cf6', name: 'Purple' }
                      ].map((colorObj) => (
                        <button 
                          key={colorObj.hex}
                          onClick={() => handleStyleChange('primaryColor', colorObj.hex)}
                          className={`h-5 w-5 rounded-full relative transition-all ${
                            style.primaryColor === colorObj.hex 
                              ? 'ring-2 ring-indigo-500 scale-110 shadow-lg' 
                              : 'border border-neutral-800 hover:scale-105'
                          }`}
                          style={{ backgroundColor: colorObj.hex }}
                          title={colorObj.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filter active badges list */}
                {(filterPhoto !== 'all' || filterLayout !== 'all' || filterIndustry) && (
                  <div className="flex flex-wrap items-center gap-1.5 py-0.5">
                    <span className="text-[10px] text-neutral-500 font-bold mr-1">Active filters:</span>
                    {filterPhoto !== 'all' && (
                      <span className="bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 px-2 py-0.5 rounded flex items-center space-x-1.5">
                        <span>{filterPhoto === 'with-photo' ? 'With Photo' : 'Without Photo'}</span>
                        <button onClick={() => setFilterPhoto('all')} className="text-neutral-500 hover:text-white">&times;</button>
                      </span>
                    )}
                    {filterLayout !== 'all' && (
                      <span className="bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 px-2 py-0.5 rounded flex items-center space-x-1.5">
                        <span>{filterLayout === '1-column' ? '1 Column' : '2 Columns'}</span>
                        <button onClick={() => setFilterLayout('all')} className="text-neutral-500 hover:text-white">&times;</button>
                      </span>
                    )}
                    {filterIndustry && (
                      <span className="bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 px-2 py-0.5 rounded flex items-center space-x-1.5">
                        <span>{filterIndustry}</span>
                        <button onClick={() => setFilterIndustry(null)} className="text-neutral-500 hover:text-white">&times;</button>
                      </span>
                    )}
                    <button 
                      onClick={() => {
                        setFilterPhoto('all');
                        setFilterLayout('all');
                        setFilterIndustry(null);
                      }}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold ml-1 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                )}

                {/* TEMPLATE CARDS PREVIEW GRID (Matches Screenshot 5 Layout) */}
                <div className="space-y-4 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">
                      Showing {
                        [
                          { id: 'modern', name: 'Modern Layout', columns: '1-column', photo: false },
                          { id: 'executive', name: 'Executive Serif', columns: '1-column', photo: false },
                          { id: 'corporate', name: 'Corporate Grid', columns: '1-column', photo: true },
                          { id: 'minimal', name: 'Minimal Clean', columns: '1-column', photo: false },
                          { id: 'creative', name: 'Creative Profile', columns: '2-column', photo: true },
                          { id: 'elegant', name: 'Elegant Wave', columns: '1-column', photo: false },
                          { id: 'ats-friendly', name: 'ATS Structural', columns: '1-column', photo: false },
                          { id: 'dark', name: 'Dark Contrast', columns: '1-column', photo: false },
                          { id: 'professional', name: 'Professional Clean', columns: '1-column', photo: false },
                          { id: 'luxury', name: 'Luxury Border', columns: '2-column', photo: false },
                          { id: 'academic', name: 'Academic Mono', columns: '1-column', photo: false },
                          { id: 'two-column', name: 'Two-Column Split', columns: '2-column', photo: true },
                          { id: 'btech-fresher', name: 'B.Tech Fresher Dev', columns: '2-column', photo: true }
                        ].filter(t => {
                          if (filterPhoto === 'with-photo' && !t.photo) return false;
                          if (filterPhoto === 'without-photo' && t.photo) return false;
                          if (filterLayout === '1-column' && t.columns !== '1-column') return false;
                          if (filterLayout === '2-column' && t.columns !== '2-column') return false;
                          return true;
                        }).length
                      } templates
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1 pb-4">
                    {[
                      { id: 'modern', name: 'Modern Layout', columns: '1-column', photo: false },
                      { id: 'executive', name: 'Executive Serif', columns: '1-column', photo: false },
                      { id: 'corporate', name: 'Corporate Grid', columns: '1-column', photo: true },
                      { id: 'minimal', name: 'Minimal Clean', columns: '1-column', photo: false },
                      { id: 'creative', name: 'Creative Profile', columns: '2-column', photo: true },
                      { id: 'elegant', name: 'Elegant Wave', columns: '1-column', photo: false },
                      { id: 'ats-friendly', name: 'ATS Structural', columns: '1-column', photo: false },
                      { id: 'dark', name: 'Dark Contrast', columns: '1-column', photo: false },
                      { id: 'professional', name: 'Professional Clean', columns: '1-column', photo: false },
                      { id: 'luxury', name: 'Luxury Border', columns: '2-column', photo: false },
                      { id: 'academic', name: 'Academic Mono', columns: '1-column', photo: false },
                      { id: 'two-column', name: 'Two-Column Split', columns: '2-column', photo: true },
                      { id: 'btech-fresher', name: 'B.Tech Fresher Dev', columns: '2-column', photo: true }
                    ].filter(t => {
                      if (filterPhoto === 'with-photo' && !t.photo) return false;
                      if (filterPhoto === 'without-photo' && t.photo) return false;
                      if (filterLayout === '1-column' && t.columns !== '1-column') return false;
                      if (filterLayout === '2-column' && t.columns !== '2-column') return false;
                      return true;
                    }).map((temp) => (
                      <div 
                        key={temp.id}
                        onClick={() => handleStyleChange('templateId', temp.id as typeof style.templateId)}
                        className={`group relative cursor-pointer border rounded-2xl p-3 bg-neutral-950 transition-all flex flex-col justify-between ${
                          style.templateId === temp.id 
                            ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                            : 'border-neutral-900 hover:border-neutral-800'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase font-black tracking-wider block">
                            {temp.columns.replace('-', ' ')}
                          </span>
                          <span className="font-bold text-xs text-white block">
                            {temp.name}
                          </span>
                        </div>

                        {/* Interactive miniature preview block representing card wireframe */}
                        <div className="w-full aspect-[4/5] border border-neutral-900 rounded-lg p-2.5 bg-neutral-900/60 flex flex-col space-y-1 my-3 relative overflow-hidden group-hover:bg-neutral-900 transition-colors">
                          <div className="h-2 bg-neutral-800 w-2/3 rounded"></div>
                          <div className="h-1 bg-neutral-850 w-full rounded"></div>
                          <div className="h-1 bg-neutral-850 w-full rounded"></div>
                          <div className="h-1 bg-neutral-850 w-3/4 rounded"></div>
                          {temp.photo && (
                            <div className="absolute top-2.5 right-2.5 h-6 w-6 rounded-full bg-neutral-750 border border-neutral-800 flex items-center justify-center text-[8px]">
                              👤
                            </div>
                          )}
                          <div className="flex-1"></div>
                          <div className="h-1 bg-neutral-850 w-full rounded"></div>
                          <div className="h-1 bg-neutral-850 w-5/6 rounded"></div>

                          {/* Hover Overlay Zoom Icon */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="p-2 bg-neutral-950/80 rounded-full border border-neutral-800 text-white text-[10px]">
                              🔍 Select
                            </div>
                          </div>
                        </div>

                        {/* Primary choice button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStyleChange('templateId', temp.id as typeof style.templateId);
                          }}
                          className={`w-full py-1.5 text-[9px] uppercase tracking-widest font-black rounded-lg transition-all ${
                            style.templateId === temp.id 
                              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md' 
                              : 'bg-neutral-900 hover:bg-neutral-850 text-neutral-400'
                          }`}
                        >
                          Choose template
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Font Customization Column */}
                <div className="space-y-4 pt-4 border-t border-neutral-900">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Font Family</label>
                  <select
                    value={style.fontFamily}
                    onChange={(e) => handleStyleChange('fontFamily', e.target.value as ResumeStyle['fontFamily'])}
                    className="w-full bg-neutral-950 border border-neutral-900 rounded-lg py-2.5 px-3 text-xs font-medium text-neutral-300 focus:outline-none focus:border-neutral-800 transition-all cursor-pointer"
                  >
                    <option value="sans">Geist Sans (Default)</option>
                    <option value="serif">Georgia Serif</option>
                    <option value="mono">Fira Code</option>
                    <option value="inter">Inter (Modern Sans)</option>
                    <option value="roboto">Roboto (Clean Sans)</option>
                    <option value="open-sans">Open Sans</option>
                    <option value="lato">Lato</option>
                    <option value="montserrat">Montserrat (Elegant Sans)</option>
                    <option value="playfair">Playfair Display (Luxury Serif)</option>
                    <option value="merriweather">Merriweather</option>
                    <option value="lora">Lora</option>
                    <option value="pt-serif">PT Serif</option>
                    <option value="source-serif">Source Serif</option>
                    <option value="source-code">Source Code Pro</option>
                    <option value="jetbrains">JetBrains Mono</option>
                    <option value="outfit">Outfit (Geometric Sans)</option>
                    <option value="arvo">Arvo (Bold Serif)</option>
                    <option value="oswald">Oswald (Display)</option>
                    <option value="raleway">Raleway</option>
                    <option value="nunito">Nunito</option>
                    <option value="garamond">EB Garamond (Classic Serif)</option>
                    <option value="cinzel">Cinzel</option>
                    <option value="cardo">Cardo</option>
                    <option value="cabin">Cabin</option>
                    <option value="inconsolata">Inconsolata</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 10: Preview & Export */}
            {step === 10 && (
              <div className="space-y-6 text-left">
                <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold mb-2">Final Review</h3>
                <p className="text-[11px] text-neutral-500 leading-normal">
                  Your resume has been saved automatically. Verify styling coordinates on the right sheet. Choose an export format.
                </p>

                <div className="space-y-3">
                  {/* Download PDF */}
                  <button 
                    onClick={handleDownloadPdf}
                    className="w-full py-3 bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </button>

                  {/* Download DOCX */}
                  <button 
                    onClick={handleDownloadDocx}
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4 text-purple-400" />
                    <span>Download Document (DOCX)</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Stepper Buttons Footer */}
          <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-neutral-900 bg-neutral-950/80 backdrop-blur flex justify-between">
            <button
              onClick={handleBackStep}
              disabled={step === 1}
              className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30 border border-neutral-800 rounded text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            {step < 10 ? (
              <button
                onClick={handleNextStep}
                className="px-4 py-2.5 bg-white text-black hover:bg-neutral-200 rounded text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleDownloadPdf}
                className="px-5 py-2.5 bg-white text-black hover:bg-neutral-200 rounded text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Finish & Print</span>
              </button>
            )}
          </div>

        </div>

        {/* Right Column: Live Sheet Preview */}
        <div className={cn(
          "flex-1 bg-neutral-950 overflow-y-auto p-4 sm:p-8 relative justify-center items-start min-w-0 sm:min-w-[360px] print:flex print:w-full print:bg-white print:p-0 print:static",
          mobileViewTab === 'editor' ? 'hidden lg:flex' : 'flex'
        )}>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0 print:hidden"></div>

          <div className="relative z-10 w-full max-w-[820px] shadow-[0_20px_60px_rgba(0,0,0,0.7)] print:shadow-none print:w-full print:max-w-none origin-top transition-transform duration-300">
              <ResumeTemplate ref={resumeRef} data={livePreviewData} />
          </div>
        </div>

      </div>
      {/* Interactive Style & Color Wizard Modal */}
      {showStyleWizardModal && (
        <div className="no-print fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-neutral-950 text-white rounded-[2rem] p-8 relative shadow-2xl overflow-hidden border border-purple-900/30">
            {/* Background glowing ambient light */}
            <div className="absolute top-0 right-0 h-40 w-40 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none z-0"></div>

            {/* Header controls */}
            <div className="relative z-10 flex justify-between items-center mb-2">
              {wizardStep > 1 ? (
                <button 
                  onClick={() => setWizardStep(prev => prev - 1)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              ) : (
                <div className="w-8"></div>
              )}

              {/* Progress paginator dots */}
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5, 6].map((stepNum) => (
                  <div 
                    key={stepNum} 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      wizardStep === stepNum ? 'bg-purple-500 w-4' : 'bg-neutral-800 w-2'
                    }`}
                  />
                ))}
              </div>

              <button 
                onClick={() => setShowStyleWizardModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* STEP 1: Include Photo */}
            {wizardStep === 1 && (
              <div className="relative z-10 space-y-6 text-center py-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold tracking-tight text-white">Do you want to include your photo?</h3>
                  <p className="text-xs text-neutral-400">This is standard practice in some regions and industries.</p>
                </div>

                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto pt-2">
                  <button 
                    onClick={() => setWizardPhoto('no')}
                    className={`border rounded-2xl p-5 bg-neutral-900 text-left transition-all ${
                      wizardPhoto === 'no' 
                        ? 'border-purple-600 ring-2 ring-purple-900/40 scale-[1.02]' 
                        : 'border-neutral-800 hover:border-neutral-750'
                    }`}
                  >
                    <div className="font-bold text-xs uppercase tracking-wider text-neutral-350 text-center mb-4">No photo</div>
                    <div className="w-full aspect-[4/5] border border-neutral-800 rounded-xl p-3 bg-neutral-950 flex flex-col space-y-1.5 relative overflow-hidden">
                      <div className="h-3 bg-neutral-800 w-1/2 rounded"></div>
                      <div className="h-1.5 bg-neutral-900 w-full rounded"></div>
                      <div className="h-1.5 bg-neutral-900 w-full rounded"></div>
                      <div className="h-1.5 bg-neutral-900 w-5/6 rounded"></div>
                      <div className="flex-1"></div>
                      <div className="h-1.5 bg-neutral-900 w-full rounded"></div>
                      <div className="h-1.5 bg-neutral-900 w-full rounded"></div>
                    </div>
                  </button>

                  <button 
                    onClick={() => setWizardPhoto('yes')}
                    className={`border rounded-2xl p-5 bg-neutral-900 text-left transition-all ${
                      wizardPhoto === 'yes' 
                        ? 'border-purple-600 ring-2 ring-purple-900/40 scale-[1.02]' 
                        : 'border-neutral-800 hover:border-neutral-750'
                    }`}
                  >
                    <div className="font-bold text-xs uppercase tracking-wider text-neutral-350 text-center mb-4">Photo</div>
                    <div className="w-full aspect-[4/5] border border-neutral-800 rounded-xl p-3 bg-neutral-950 flex flex-col space-y-1.5 relative overflow-hidden">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 font-bold text-[10px]">
                          👤
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="h-2.5 bg-neutral-800 w-3/4 rounded"></div>
                          <div className="h-1.5 bg-neutral-900 w-1/2 rounded"></div>
                        </div>
                      </div>
                      <div className="h-1.5 bg-neutral-900 w-full rounded"></div>
                      <div className="h-1.5 bg-neutral-900 w-full rounded"></div>
                      <div className="h-1.5 bg-neutral-900 w-5/6 rounded"></div>
                      <div className="flex-1"></div>
                      <div className="h-1.5 bg-neutral-900 w-full rounded"></div>
                      <div className="h-1.5 bg-neutral-900 w-full rounded"></div>
                    </div>
                  </button>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => setWizardStep(2)}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_12px_rgba(168,85,247,0.3)] flex items-center space-x-1"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Pick Accent Color */}
            {wizardStep === 2 && (
              <div className="relative z-10 space-y-6 text-center py-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold tracking-tight text-white">Pick a color</h3>
                  <p className="text-xs text-neutral-400">We&apos;ll use this to accent your resume—change colors anytime.</p>
                </div>

                <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto pt-6 pb-2">
                  {[
                    { hex: '#333333', name: 'Charcoal' },
                    { hex: '#b5a69a', name: 'Beige' },
                    { hex: '#1e3a8a', name: 'Dark Navy' },
                    { hex: '#3b82f6', name: 'Soft Blue' },
                    { hex: '#06b6d4', name: 'Cyan' },
                    { hex: '#10b981', name: 'Emerald' },
                    { hex: '#f59e0b', name: 'Orange' },
                    { hex: '#ef4444', name: 'Red' },
                    { hex: '#8b5cf6', name: 'Purple' }
                  ].map((colorObj) => (
                    <button 
                      key={colorObj.hex}
                      onClick={() => setWizardColor(colorObj.hex)}
                      className={`h-14 w-14 rounded-full mx-auto relative transition-all ${
                        wizardColor === colorObj.hex 
                          ? 'ring-4 ring-purple-900/60 scale-110 shadow-lg' 
                          : 'hover:scale-105 border border-neutral-800'
                      }`}
                      style={{ backgroundColor: colorObj.hex }}
                      title={colorObj.name}
                    >
                      {wizardColor === colorObj.hex && (
                        <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-4 flex justify-between">
                  <button 
                    onClick={() => setWizardStep(1)}
                    className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setWizardStep(3)}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_12px_rgba(168,85,247,0.3)] flex items-center space-x-1"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Page Layout Style */}
            {wizardStep === 3 && (
              <div className="relative z-10 space-y-6 text-center py-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold tracking-tight text-white">Which layout do you prefer?</h3>
                  <p className="text-xs text-neutral-400">One column saves space; two columns look modern and organized.</p>
                </div>

                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto pt-2">
                  <button 
                    onClick={() => setWizardLayout('one-column')}
                    className={`border rounded-2xl p-5 bg-neutral-900 text-left transition-all ${
                      wizardLayout === 'one-column' 
                        ? 'border-purple-600 ring-2 ring-purple-900/40 scale-[1.02]' 
                        : 'border-neutral-800 hover:border-neutral-750'
                    }`}
                  >
                    <div className="font-bold text-xs uppercase tracking-wider text-neutral-350 text-center mb-4">One column</div>
                    <div className="w-full aspect-[4/5] border border-neutral-800 rounded-xl p-3 bg-neutral-950 flex flex-col space-y-1.5 relative overflow-hidden">
                      <div className="h-3 bg-neutral-800 w-2/3 rounded mb-2"></div>
                      <div className="h-1.5 bg-neutral-900 w-full rounded"></div>
                      <div className="h-1.5 bg-neutral-900 w-full rounded"></div>
                      <div className="h-1.5 bg-neutral-900 w-5/6 rounded"></div>
                      <div className="h-3 bg-neutral-800 w-1/2 rounded mt-3 mb-2"></div>
                      <div className="h-1.5 bg-neutral-900 w-full rounded"></div>
                      <div className="h-1.5 bg-neutral-900 w-full rounded"></div>
                    </div>
                  </button>

                  <button 
                    onClick={() => setWizardLayout('two-column')}
                    className={`border rounded-2xl p-5 bg-neutral-900 text-left transition-all ${
                      wizardLayout === 'two-column' 
                        ? 'border-purple-600 ring-2 ring-purple-900/40 scale-[1.02]' 
                        : 'border-neutral-800 hover:border-neutral-750'
                    }`}
                  >
                    <div className="font-bold text-xs uppercase tracking-wider text-neutral-350 text-center mb-4">Two columns</div>
                    <div className="w-full aspect-[4/5] border border-neutral-800 rounded-xl bg-neutral-950 flex overflow-hidden relative">
                      {/* Sidebar */}
                      <div className="w-1/3 bg-neutral-900 p-2 flex flex-col space-y-2 border-r border-neutral-800">
                        <div className="w-6 h-6 rounded-full bg-neutral-850 self-center"></div>
                        <div className="h-2 bg-neutral-800 w-full rounded"></div>
                        <div className="h-1 bg-neutral-850 w-full rounded"></div>
                        <div className="h-1 bg-neutral-850 w-5/6 rounded"></div>
                      </div>
                      {/* Main body */}
                      <div className="flex-1 p-2 flex flex-col space-y-2">
                        <div className="h-2.5 bg-neutral-800 w-2/3 rounded"></div>
                        <div className="h-1 bg-neutral-900 w-full rounded"></div>
                        <div className="h-1 bg-neutral-900 w-full rounded"></div>
                        <div className="h-2.5 bg-neutral-800 w-1/2 rounded mt-2"></div>
                        <div className="h-1 bg-neutral-900 w-full rounded"></div>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="pt-4 flex justify-between">
                  <button 
                    onClick={() => setWizardStep(2)}
                    className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setWizardStep(4)}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_12px_rgba(168,85,247,0.3)] flex items-center space-x-1"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Resume Field / Industry */}
            {wizardStep === 4 && (
              <div className="relative z-10 space-y-6 text-center py-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold tracking-tight text-white">What field is this resume for?</h3>
                  <p className="text-xs text-neutral-400">Check all that apply or skip.</p>
                </div>

                <div className="max-h-52 overflow-y-auto max-w-md mx-auto border border-neutral-800 rounded-2xl bg-neutral-950 p-4 space-y-2.5 text-left">
                  {[
                    'Business & Finance',
                    'Care Services',
                    'Community & Social',
                    'Design & Media',
                    'Education & Learning',
                    'Engineering & Technology',
                    'Hospitality & Tourism',
                    'Sales & Marketing'
                  ].map((fieldStr) => {
                    const isChecked = wizardIndustries.includes(fieldStr);
                    return (
                      <label 
                        key={fieldStr} 
                        className={`flex items-center space-x-3 p-2.5 rounded-xl cursor-pointer transition-colors border ${
                          isChecked 
                            ? 'bg-purple-950/20 text-purple-300 border-purple-800/40 font-bold' 
                            : 'bg-transparent border-transparent hover:bg-neutral-900 text-neutral-400'
                        }`}
                      >
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setWizardIndustries(prev => [...prev, fieldStr]);
                            } else {
                              setWizardIndustries(prev => prev.filter(item => item !== fieldStr));
                            }
                          }}
                          className="h-4 w-4 text-purple-600 bg-neutral-900 border-neutral-800 rounded focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-xs">{fieldStr}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button 
                    onClick={() => setWizardStep(3)}
                    className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setWizardStep(5)}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_12px_rgba(168,85,247,0.3)] flex items-center space-x-1"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Choose a Template */}
            {wizardStep === 5 && (
              <div className="relative z-10 space-y-4 text-center py-2">
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold tracking-tight text-white">Choose your resume template</h3>
                  <p className="text-xs text-neutral-400">Select from our ATS-optimized layouts or build your own custom design.</p>
                </div>

                {/* Prominent Create Custom Template Banner */}
                <div className="flex items-center justify-between bg-gradient-to-r from-purple-950/80 via-indigo-950/50 to-neutral-950 border border-purple-800/60 rounded-2xl p-3 text-left shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-xl bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-purple-300 shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">Need A Custom Template?</h4>
                      <p className="text-[10px] text-purple-300 font-medium mt-0.5">Build a custom layout for your specific job requirements</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCustomTemplateModal(true)}
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_12px_rgba(168,85,247,0.4)] shrink-0 flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>+ Custom Template</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[250px] overflow-y-auto pr-1 text-left">
                  {/* Build Custom Template Card */}
                  <div 
                    onClick={() => setShowCustomTemplateModal(true)}
                    className="cursor-pointer border border-dashed border-purple-500/80 hover:border-purple-400 rounded-2xl p-3 bg-purple-950/20 hover:bg-purple-950/40 transition-all flex flex-col justify-between relative group text-left shadow-lg shadow-purple-950/30"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-purple-900/80 text-purple-200 rounded">
                          + BUILD YOUR OWN
                        </span>
                        <Sparkles className="h-3.5 w-3.5 text-purple-400 group-hover:rotate-12 transition-transform" />
                      </div>
                      <h4 className="text-xs font-black text-white mt-1">Create Custom Template</h4>
                      <p className="text-[9px] text-neutral-300 mt-0.5 font-medium">Design layout to your exact requirements</p>
                    </div>
                    <div className="w-full h-12 border border-dashed border-purple-800/80 rounded-lg mt-2 bg-neutral-950/80 p-2 flex flex-col items-center justify-center space-y-1 group-hover:border-purple-500 transition-colors">
                      <Plus className="h-4 w-4 text-purple-400" />
                      <span className="text-[8px] font-bold text-purple-300 uppercase tracking-widest">+ Custom Layout</span>
                    </div>
                  </div>

                  {[
                    ...customTemplates,
                    { id: 'modern', name: 'Modern Clean', badge: 'Popular', desc: 'Single-column clean design' },
                    { id: 'btech-fresher', name: 'Silicon Valley SDE', badge: 'ATS 100%', desc: 'Engineering & Code focus' },
                    { id: 'executive', name: 'Executive Serif', badge: 'Leadership', desc: 'Dignified typography' },
                    { id: 'minimal', name: 'Minimal Plain', badge: 'Simple', desc: 'Generous white space' },
                    { id: 'creative', name: 'Creative Profile', badge: 'Portfolio', desc: 'Design & Product' },
                    { id: 'ats-friendly', name: 'ATS Structural', badge: 'Optimal', desc: 'Machine readable' },
                    { id: 'corporate', name: 'Corporate Grid', badge: 'Business', desc: 'Structured sections' },
                    { id: 'luxury', name: 'Luxury Border', badge: 'Executive', desc: 'Refined accenting' },
                    { id: 'academic', name: 'Academic Mono', badge: 'Research', desc: 'Monospace aesthetic' }
                  ].map((temp) => {
                    const isSelected = wizardTemplate === temp.id;
                    return (
                      <div 
                        key={temp.id}
                        onClick={() => setWizardTemplate(temp.id as typeof style.templateId)}
                        className={`cursor-pointer border rounded-2xl p-3 bg-neutral-900/90 transition-all flex flex-col justify-between relative ${
                          isSelected 
                            ? 'border-purple-500 ring-2 ring-purple-900/40 bg-purple-950/20 scale-[1.02]' 
                            : 'border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-neutral-800 text-purple-300 rounded">
                              {temp.badge}
                            </span>
                            {isSelected && <Check className="h-3.5 w-3.5 text-purple-400" />}
                          </div>
                          <h4 className="text-xs font-bold text-white">{temp.name}</h4>
                          <p className="text-[9px] text-neutral-400 mt-0.5 font-medium">{temp.desc}</p>
                        </div>
                        <div className="w-full h-12 border border-neutral-800/80 rounded-lg mt-2 bg-neutral-950/80 p-1.5 flex flex-col space-y-1">
                          <div className="h-1.5 bg-neutral-800 w-1/2 rounded"></div>
                          <div className="h-1 bg-neutral-900 w-full rounded"></div>
                          <div className="h-1 bg-neutral-900 w-3/4 rounded"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button 
                    onClick={() => setWizardStep(4)}
                    className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setWizardStep(6)}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_12px_rgba(168,85,247,0.3)] flex items-center space-x-1"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: Choose Font & Typography */}
            {wizardStep === 6 && (
              <div className="relative z-10 space-y-6 text-center py-2">
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold tracking-tight text-white">Choose Font &amp; Typography</h3>
                  <p className="text-xs text-neutral-400">Select your font style and text size for your resume.</p>
                </div>

                {/* Font Family Section */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] uppercase font-black tracking-widest text-neutral-400 block">Font Family</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'sans', name: 'Inter (Sans)', sample: 'Aa • Modern Clean', styleClass: 'font-sans' },
                      { id: 'serif', name: 'Playfair (Serif)', sample: 'Aa • Executive Serif', styleClass: 'font-serif' },
                      { id: 'mono', name: 'Fira (Mono)', sample: 'Aa • Dev Monospace', styleClass: 'font-mono' },
                      { id: 'roboto', name: 'Roboto', sample: 'Aa • Sharp Balanced', styleClass: 'font-sans font-medium' },
                      { id: 'outfit', name: 'Outfit', sample: 'Aa • Contemporary', styleClass: 'font-sans font-bold' },
                      { id: 'montserrat', name: 'Montserrat', sample: 'Aa • Bold Geometric', styleClass: 'font-sans tracking-wide' }
                    ].map((fontItem) => {
                      const isSelected = wizardFontFamily === fontItem.id;
                      return (
                        <button
                          key={fontItem.id}
                          type="button"
                          onClick={() => setWizardFontFamily(fontItem.id as typeof style.fontFamily)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            isSelected 
                              ? 'border-purple-500 bg-purple-950/30 ring-2 ring-purple-900/40 text-purple-200' 
                              : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 text-neutral-400'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-white">{fontItem.name}</span>
                            {isSelected && <Check className="h-3.5 w-3.5 text-purple-400" />}
                          </div>
                          <span className={`text-[10px] mt-1 block opacity-80 ${fontItem.styleClass}`}>
                            {fontItem.sample}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Font Size Section */}
                <div className="space-y-2 text-left pt-1">
                  <label className="text-[10px] uppercase font-black tracking-widest text-neutral-400 block">Font Size</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'sm', label: 'Small', desc: 'Fits maximum content' },
                      { id: 'md', label: 'Medium', desc: 'Standard balance' },
                      { id: 'lg', label: 'Large', desc: 'High readability' }
                    ].map((sizeItem) => {
                      const isSelected = wizardFontSize === sizeItem.id;
                      return (
                        <button
                          key={sizeItem.id}
                          type="button"
                          onClick={() => setWizardFontSize(sizeItem.id as typeof style.fontSize)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            isSelected 
                              ? 'border-purple-500 bg-purple-950/30 text-white font-bold' 
                              : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          <span className="text-xs block">{sizeItem.label}</span>
                          <span className="text-[9px] text-neutral-500 block mt-0.5">{sizeItem.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button 
                    onClick={() => setWizardStep(5)}
                    className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleApplyWizardStyle}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_15px_rgba(168,85,247,0.4)]"
                  >
                    SEE MY RESULTS
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Build Custom Requirement Template Modal */}
      <AnimatePresence>
        {showCustomTemplateModal && (
          <div className="no-print fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-neutral-950 text-white rounded-3xl p-6 relative border border-purple-900/50 shadow-2xl space-y-4 text-left overflow-hidden">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="h-8 w-8 rounded-xl bg-purple-950 border border-purple-800/40 flex items-center justify-center text-purple-400">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Create Custom Template</h3>
                    <p className="text-[10px] text-neutral-400">Design layout for your exact position requirements</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCustomTemplateModal(false)}
                  className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Controls */}
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                    Template Name <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Stanford SDE II / Custom Latex Layout"
                    value={customTemplateName}
                    onChange={(e) => setCustomTemplateName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                    Column Structure
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: '1-column', name: 'Single Column', desc: '100% ATS Parsing Focus' },
                      { id: '2-column', name: 'Two-Column Split', desc: 'Modern Sidebar & Body' }
                    ].map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setCustomTemplateColumns(col.id as any)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          customTemplateColumns === col.id
                            ? 'border-purple-500 bg-purple-950/30 text-white font-bold'
                            : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                        }`}
                      >
                        <div className="text-xs">{col.name}</div>
                        <div className="text-[9px] text-neutral-500 mt-0.5">{col.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                    Header Layout Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'left', label: 'Left Aligned' },
                      { id: 'centered', label: 'Centered' },
                      { id: 'banner', label: 'Dark Banner' }
                    ].map((hdr) => (
                      <button
                        key={hdr.id}
                        type="button"
                        onClick={() => setCustomTemplateHeader(hdr.id as any)}
                        className={`p-2 rounded-lg border text-center transition-all text-xs ${
                          customTemplateHeader === hdr.id
                            ? 'border-purple-500 bg-purple-950/40 text-purple-200 font-bold'
                            : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                        }`}
                      >
                        {hdr.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                    Primary Accent Color
                  </label>
                  <div className="flex items-center space-x-2">
                    {['#8b5cf6', '#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#06b6d4', '#1e293b'].map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setCustomTemplateColor(hex)}
                        className={`h-7 w-7 rounded-full border transition-transform ${
                          customTemplateColor === hex ? 'ring-2 ring-white scale-110 border-purple-500' : 'border-neutral-800 hover:scale-105'
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                    Requirement Notes / Custom Instructions
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Specify special requirements (e.g. bold section dividers, compact ATS font, highlighted skills section)..."
                    value={customTemplateNotes}
                    onChange={(e) => setCustomTemplateNotes(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-xs text-white placeholder:text-neutral-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-2 pt-2 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={() => setShowCustomTemplateModal(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateCustomTemplate}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_4px_12px_rgba(168,85,247,0.4)]"
                >
                  Create & Select
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
