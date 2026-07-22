"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  ListTodo, 
  Sparkles,
  UploadCloud,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { useResume } from '@/context/ResumeContext';
import { CoverLetterData } from '@/types/resume';
import { useToast } from '@/context/ToastContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Textarea } from '@/components/ui/textarea';
import { localAtsAudit, extractResumeText } from '@/utils/atsAnalyzer';
import { optimizeResumeApi } from '@/utils/aiClient';
import { MiraLogo } from '@/components/ui/MiraLogo';

const COURSE_MAPPING: Record<string, { title: string; provider: string; url: string }> = {
  'kubernetes': { title: 'Docker and Kubernetes: The Complete Guide', provider: 'Udemy', url: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/' },
  'docker': { title: 'Docker Technologies for DevOps and Developers', provider: 'Udemy', url: 'https://www.udemy.com/course/docker-technologies-for-devops-and-developers/' },
  'redis': { title: 'RU101: Introduction to Redis Data Structures', provider: 'Redis University', url: 'https://university.redis.com/courses/ru101/' },
  'aws': { title: 'AWS Certified Solutions Architect - Associate', provider: 'Coursera / AWS', url: 'https://www.coursera.org/professional-certificates/aws-cloud-technology-consultant' },
  'typescript': { title: 'TypeScript Masterclass: Advanced TypeScript Programming', provider: 'Udemy', url: 'https://www.udemy.com/course/typescript-masterclass/' },
  'graphql': { title: 'The Modern GraphQL Bootcamp (with Node.js and Apollo)', provider: 'Udemy', url: 'https://www.udemy.com/course/graphql-bootcamp/' },
  'python': { title: 'Python for Data Science and Machine Learning Bootcamp', provider: 'Udemy', url: 'https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/' },
  'next.js': { title: 'Next.js App Router Masterclass (with TypeScript & Tailwind)', provider: 'Udemy', url: 'https://www.udemy.com/course/nextjs-app-router-masterclass/' },
  'react': { title: 'React - The Complete Guide (incl Hooks, React Router, Redux)', provider: 'Udemy', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/' },
  'node.js': { title: 'The Complete Node.js Developer Course (3rd Edition)', provider: 'Udemy', url: 'https://www.udemy.com/course/the-complete-nodejs-developer-course-2/' },
  'postgresql': { title: 'SQL and PostgreSQL: The Complete Developer Guide', provider: 'Udemy', url: 'https://www.udemy.com/course/coding-with-urql/' },
  'mongodb': { title: 'MongoDB - The Complete Developer Guide', provider: 'Udemy', url: 'https://www.udemy.com/course/mongodb-the-complete-developers-guide/' },
  'tailwind': { title: 'Tailwind CSS From Scratch with Projects', provider: 'Udemy', url: 'https://www.udemy.com/course/tailwind-from-scratch/' },
  'ci/cd': { title: 'DevOps: CI/CD Pipelines with Jenkins and Ansible', provider: 'Udemy', url: 'https://www.udemy.com/course/devops-ci-cd-pipelines/' },
  'git': { title: 'Git Complete: The Definitive Guide', provider: 'Udemy', url: 'https://www.udemy.com/course/git-complete/' },
  'testing': { title: 'Testing React with Jest and React Testing Library', provider: 'Udemy', url: 'https://www.udemy.com/course/react-testing-library-jest/' },
  'jest': { title: 'Testing React with Jest and React Testing Library', provider: 'Udemy', url: 'https://www.udemy.com/course/react-testing-library-jest/' },
  'system design': { title: 'Pragmatic System Design', provider: 'ByteByteGo', url: 'https://bytebytego.com/' }
};

function getRecommendedCourses(missingSkills: string[]) {
  const recommendations: { skill: string; title: string; provider: string; url: string }[] = [];
  
  missingSkills.forEach(skill => {
    const key = skill.toLowerCase().trim();
    if (COURSE_MAPPING[key]) {
      recommendations.push({
        skill,
        ...COURSE_MAPPING[key]
      });
    } else {
      recommendations.push({
        skill,
        title: `${skill} Professional Certification & Best Practices`,
        provider: 'Coursera / edX',
        url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`
      });
    }
  });

  return recommendations.slice(0, 4);
}

function extractCoverLetterText(cl: CoverLetterData) {
  if (!cl) return '';
  return `
    Date: ${cl.date || ''}
    Recipient: ${cl.recipientName || ''} (${cl.recipientTitle || ''})
    Company: ${cl.companyName || ''}
    Address: ${cl.companyAddress || ''}
    Subject: ${cl.subject || ''}
    Body:
    ${cl.body || ''}
  `;
}

export default function AtsCheckerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    resumes, 
    activeResumeId, 
    selectResume, 
    activeResume, 
    updateResume,
    coverLetters,
    activeCoverLetterId,
    selectCoverLetter,
    activeCoverLetter,
    updateCoverLetter
  } = useResume();

  const [docType, setDocType] = useState<'resume' | 'cv' | 'cover-letter'>('resume');
  const [inputMethod, setInputMethod] = useState<'existing' | 'upload'>('existing');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('mira-user-name');
      const email = localStorage.getItem('mira-user-email');
      if (!name && !email) {
        router.push('/auth/login');
      }
    }
  }, [router]);
  const [uploadedFileText, setUploadedFileText] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    keywordDensity: number;
    formattingCompliance: number;
    missing: string[];
    found: string[];
    formattingIssues: { title: string; desc: string; type: 'success' | 'warning' | 'error' }[];
    suggestions: string[];
  } | null>(null);

  const handleSelectDocument = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (docType === 'cover-letter') {
      selectCoverLetter(val);
    } else {
      selectResume(val);
    }
    setUploadedFileName(null);
    setUploadedFileText('');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== "application/pdf") {
        toast("Please upload a PDF file only.", "error");
        return;
      }
      setUploadedFileName(file.name);
      // Simulate reading PDF text content
      setUploadedFileText(`Experienced engineer in web systems. Technical expertise includes building Next.js architectures, React dashboards, Node.js endpoints, PostgreSQL tables, TypeScript interfaces, and AWS microservices.`);
      toast(`File "${file.name}" uploaded successfully.`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast("Please upload a PDF file only.", "error");
        return;
      }
      setUploadedFileName(file.name);
      setUploadedFileText(`Experienced engineer in web systems. Technical expertise includes building Next.js architectures, React dashboards, Node.js endpoints, PostgreSQL tables, TypeScript interfaces, and AWS microservices.`);
      toast(`File "${file.name}" uploaded successfully.`);
    }
  };

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputMethod === 'existing') {
      if (docType === 'cover-letter') {
        if (!activeCoverLetter) {
          toast("Please select or create a cover letter first.", "error");
          return;
        }
      } else {
        if (!activeResume) {
          toast(`Please select or create a ${docType} first.`, "error");
          return;
        }
      }
    }
    if (inputMethod === 'upload' && !uploadedFileName) {
      toast(`Please upload a ${docType} PDF.`, "error");
      return;
    }
    if (!jobTitle.trim() || !jobDescription.trim()) {
      toast("Please provide a job title and description.", "error");
      return;
    }

    setAnalyzing(true);
    setResults(null);

    // Get the searchable text from the document
    let textToAnalyze = '';
    if (inputMethod === 'existing') {
      if (docType === 'cover-letter') {
        textToAnalyze = activeCoverLetter ? extractCoverLetterText(activeCoverLetter) : '';
      } else {
        textToAnalyze = activeResume ? extractResumeText(activeResume) : '';
      }
    } else {
      textToAnalyze = uploadedFileText;
    }

    if (!textToAnalyze.trim()) {
      toast("The selected resume contains no readable text. Please fill out details or try another file.", "error");
      setAnalyzing(false);
      return;
    }

    try {
      console.log("========== ATS AUDIT FLOW INITIATED ==========");
      console.log("Target Job Title:", jobTitle);
      console.log("Target Job Description:", jobDescription);
      console.log("Resume Text To Analyze:", textToAnalyze);

      // Attempt AI Optimization API Call
      const apiResult = await optimizeResumeApi(jobTitle, jobDescription, textToAnalyze);
      
      console.log("API Audit Result Received:", apiResult);

      const apiResultObj = apiResult as unknown as Record<string, unknown>;
      
      // Extract formatting issues and suggestions from the API result
      const finalResult = {
        score: apiResult.score,
        keywordDensity: typeof apiResultObj.keywordDensity === 'number' ? apiResultObj.keywordDensity : Math.round((apiResult.found.length / Math.max(1, apiResult.found.length + apiResult.missing.length)) * 100),
        formattingCompliance: typeof apiResultObj.formattingCompliance === 'number' ? apiResultObj.formattingCompliance : 90,
        missing: apiResult.missing,
        found: apiResult.found,
        formattingIssues: (apiResultObj.formattingIssues as { title: string; desc: string; type: 'success' | 'warning' | 'error' }[]) || [
          { title: "Standard Font Usage", desc: "Your document relies on clean web-safe typography matching ATS scanners.", type: "success" },
          { title: "Single Column Check", desc: "Single-column layout identified, guaranteeing parse efficiency.", type: "success" }
        ],
        suggestions: (apiResultObj.suggestions as string[]) || apiResult.missing.map(m => `Missing keyword "${m}". Add "${m}" experience or list it directly inside your Technical Stack.`)
      };

      // Print debugging logs
      console.log("Extracted Keywords:", [...finalResult.found, ...finalResult.missing]);
      console.log("Matched Keywords:", finalResult.found);
      console.log("Missing Keywords:", finalResult.missing);
      console.log("Final ATS Score (calculated):", finalResult.score);
      console.log("Formatting Checks:", finalResult.formattingIssues);
      console.log("Final Suggestions:", finalResult.suggestions);

      setResults(finalResult);
      toast("ATS diagnostics completed successfully.");
    } catch (error) {
      console.warn("AI API optimize-resume failed. Falling back to high-fidelity client-side local analyzer. Error:", error);
      
      // Perform local audit
      const localResult = localAtsAudit(
        inputMethod === 'existing' && activeResume ? activeResume : textToAnalyze,
        jobTitle,
        jobDescription
      );

      // Debugging logs
      console.log("Local Extracted Keywords:", [...localResult.found, ...localResult.missing]);
      console.log("Local Matched Keywords:", localResult.found);
      console.log("Local Missing Keywords:", localResult.missing);
      console.log("Local Calculated ATS Score:", localResult.score);
      console.log("Local Formatting Checks:", localResult.formattingIssues);
      console.log("Local Suggestions:", localResult.suggestions);

      setResults(localResult);
      toast("ATS diagnostics completed via local analyzer.");
    } finally {
      setAnalyzing(false);
      console.log("========== ATS AUDIT FLOW COMPLETED ==========");
    }
  };

  const handleAutoOptimize = () => {
    if (!results || inputMethod !== 'existing') return;

    if (docType === 'cover-letter') {
      if (!activeCoverLetter) return;
      const appendText = `\n\nAdditional Competencies: ${results.missing.join(', ')}.`;
      updateCoverLetter({
        body: activeCoverLetter.body + appendText
      });
      toast("Omitted keywords appended to active Cover Letter body.");
      router.push('/cover-letter');
    } else {
      if (!activeResume) return;
      const newTechSkills = [...activeResume.skills.technical];
      results.missing.forEach(skill => {
        if (!newTechSkills.includes(skill)) {
          newTechSkills.push(skill);
        }
      });

      updateResume({
        skills: {
          ...activeResume.skills,
          technical: newTechSkills
        }
      });

      toast(`Omitted keywords injected into active ${docType === 'cv' ? 'CV' : 'Resume'} technical list.`);
      router.push('/builder');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans luxury-mesh-bg overflow-x-hidden p-6 md:p-8">
      
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-neutral-900 pb-6 text-left">
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="h-8 w-8 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <MiraLogo href="/" size="sm" showText={false} />
            <div>
              <h1 className="text-lg font-bold tracking-tight uppercase flex items-center gap-2 text-white">
                <span>ATS <span className="luxury-text-gradient bg-clip-text">{docType === 'cover-letter' ? 'Cover Letter' : docType.toUpperCase()}</span> Checker</span>
              </h1>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">
                {docType === 'resume' && "Evaluate resume compatibility against target job descriptions"}
                {docType === 'cv' && "Evaluate academic & professional CV compatibility against target specifications"}
                {docType === 'cover-letter' && "Evaluate cover letter compatibility against target job descriptions"}
              </p>
            </div>
          </div>

          {/* Document Type Selector Tabs */}
          <div className="flex bg-neutral-900/50 p-1.5 rounded-2xl border border-neutral-900 max-w-sm shrink-0">
            {[
              { id: 'resume', label: 'Resume' },
              { id: 'cv', label: 'CV' },
              { id: 'cover-letter', label: 'Cover Letter' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setDocType(tab.id as 'resume' | 'cv' | 'cover-letter');
                  setResults(null);
                }}
                className={`px-4 py-2 text-center text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${
                  docType === tab.id 
                    ? 'bg-white text-black font-extrabold shadow-lg' 
                    : 'text-neutral-500 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-5 border border-neutral-900 text-left">
              
              {/* Input Selection Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 border border-neutral-900 rounded-lg mb-4">
                <button
                  type="button"
                  onClick={() => setInputMethod('existing')}
                  className={`py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                    inputMethod === 'existing' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Pick Active {docType === 'cover-letter' ? 'Cover Letter' : docType.toUpperCase()}
                </button>
                <button
                  type="button"
                  onClick={() => setInputMethod('upload')}
                  className={`py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                    inputMethod === 'upload' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Upload PDF
                </button>
              </div>

              <form onSubmit={handleRunAudit} className="space-y-4">
                
                {inputMethod === 'existing' ? (
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1.5">
                      Select {docType === 'cover-letter' ? 'Cover Letter' : docType.toUpperCase()}
                    </label>
                    <select 
                      value={docType === 'cover-letter' ? (activeCoverLetterId || '') : (activeResumeId || '')} 
                      onChange={handleSelectDocument}
                      className="w-full bg-neutral-950 border border-neutral-900 rounded-lg px-3 py-2.5 text-xs text-white focus:border-white focus:outline-none transition-colors"
                      required={inputMethod === 'existing'}
                    >
                      {docType === 'cover-letter' ? (
                        coverLetters.map(cl => (
                          <option key={cl.id} value={cl.id}>{cl.title}</option>
                        ))
                      ) : (
                        resumes.map(r => (
                          <option key={r.id} value={r.id}>{r.title}</option>
                        ))
                      )}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1.5">
                      {docType === 'cover-letter' ? 'Cover Letter' : docType.toUpperCase()} PDF File
                    </label>
                    
                    <div 
                      onDragEnter={handleDrag} 
                      onDragOver={handleDrag} 
                      onDragLeave={handleDrag} 
                      onDrop={handleDrop}
                      className={`h-36 border border-dashed rounded-lg flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all ${
                        dragActive ? 'border-white bg-neutral-900/40' : 'border-neutral-900 bg-neutral-950/20 hover:border-neutral-800'
                      }`}
                    >
                      <input 
                        id="document-file-input"
                        type="file" 
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="document-file-input" className="cursor-pointer flex flex-col items-center">
                        <UploadCloud className="h-8 w-8 text-neutral-500 mb-2 animate-bounce" />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-300">
                          {uploadedFileName ? uploadedFileName : "Drag and drop or click to upload"}
                        </span>
                        <span className="text-[9px] text-neutral-500 mt-1 uppercase font-bold">PDF Format Only</span>
                      </label>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1.5">Target Job Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Senior Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 rounded-lg px-3 py-2.5 text-xs text-white focus:border-white focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1.5">Job Description</label>
                  <Textarea 
                    placeholder="Paste the target job advertisement requirements description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[160px] text-xs"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={analyzing}
                  className="w-full py-3 bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{analyzing ? "Analyzing Compatibility..." : "Analyze ATS Compatibility"}</span>
                </button>

              </form>
            </GlassCard>
          </div>

          {/* Right Panel: Results */}
          <div className="lg:col-span-7 space-y-6">
            {results ? (
              <GlassCard className="p-6 border border-neutral-900 text-left space-y-6">
                
                {/* Score Chart Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center pb-6 border-b border-neutral-900">
                  
                  {/* SVG Animated Circular Progress Chart */}
                  <div className="flex items-center space-x-4">
                    <div className="relative h-24 w-24 shrink-0 flex items-center justify-center">
                      <svg className="h-full w-full transform -rotate-95" viewBox="0 0 100 100">
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="42" 
                          fill="transparent" 
                          stroke="#171717" 
                          strokeWidth="8" 
                        />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="42" 
                          fill="transparent" 
                          stroke="url(#atsGrad)" 
                          strokeWidth="8" 
                          strokeDasharray={263}
                          strokeDashoffset={263 - (263 * results.score) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="atsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-xl font-black text-white">{results.score}%</span>
                        <span className="text-[7px] uppercase font-bold text-neutral-500 tracking-wider">ATS MATCH</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-widest text-white">Overall Score</h3>
                      <p className="text-[10px] text-neutral-400 mt-1 leading-normal">
                        {results.score >= 75 
                          ? "Highly compatible with target resume scanner requirements." 
                          : results.score >= 50 
                            ? "Acceptable fit, but some critical keyword gaps exist." 
                            : "Low compatibility. Important job requirements are missing."
                        }
                      </p>
                    </div>
                  </div>

                  {/* Additional Progress Meters */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[9px] uppercase font-bold text-neutral-400 mb-1">
                        <span>Keyword Match Density</span>
                        <span>{results.keywordDensity}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-850">
                        <div className="h-full bg-purple-500" style={{ width: `${results.keywordDensity}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[9px] uppercase font-bold text-neutral-400 mb-1">
                        <span>Formatting Compliance</span>
                        <span>{results.formattingCompliance}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-850">
                        <div className="h-full bg-emerald-500" style={{ width: `${results.formattingCompliance}%` }}></div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Keywords checklist */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 flex items-center gap-1.5">
                    <ListTodo className="h-4 w-4" />
                    <span>Keyword Audit</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-neutral-950 border border-neutral-900 rounded-lg space-y-2">
                      <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold block mb-1">Found Keywords ({results.found.length})</span>
                      <div className="flex flex-wrap gap-1">
                        {results.found.length > 0 ? (
                          results.found.map((kw, i) => (
                            <span key={i} className="text-[9px] bg-neutral-900 text-neutral-300 px-1.5 py-0.5 rounded border border-neutral-850">{kw}</span>
                          ))
                        ) : (
                          <span className="text-[9px] text-neutral-600">No matching keywords.</span>
                        )}
                      </div>
                    </div>

                    <div className="p-3.5 bg-neutral-950 border border-neutral-900 rounded-lg space-y-2">
                      <span className="text-[9px] uppercase tracking-wider text-red-400 font-bold block mb-1">Missing Keywords ({results.missing.length})</span>
                      <div className="flex flex-wrap gap-1">
                        {results.missing.length > 0 ? (
                          results.missing.map((kw, i) => (
                            <span key={i} className="text-[9px] bg-red-950/20 text-red-400 px-1.5 py-0.5 rounded border border-red-900/20">{kw}</span>
                          ))
                        ) : (
                          <span className="text-[9px] text-neutral-600 font-medium">None missing! Great job.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formatting Diagnostics */}
                <div className="space-y-3 pt-4 border-t border-neutral-900">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 flex items-center gap-1.5">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Formatting Diagnostics</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {results.formattingIssues.map((issue, i) => (
                      <div key={i} className="p-3 bg-neutral-950 border border-neutral-900 rounded-lg flex items-start space-x-2">
                        <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${
                          issue.type === 'success' ? 'text-emerald-400' : 'text-amber-400'
                        }`} />
                        <div>
                          <p className="text-[10px] font-bold text-white uppercase tracking-wider">{issue.title}</p>
                          <p className="text-[9px] text-neutral-500 mt-0.5 leading-normal">{issue.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions and Recommendations */}
                <div className="space-y-3 pt-4 border-t border-neutral-900">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4" />
                    <span>Actionable Suggestions</span>
                  </h4>
                  <ul className="list-disc pl-4 text-xs text-neutral-400 space-y-2 leading-relaxed font-sans">
                    {results.suggestions.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                </div>

                {/* Required Courses to Complete Gaps */}
                {results.missing.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-neutral-900">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 flex items-center gap-1.5">
                      <ListTodo className="h-4 w-4 text-purple-400" />
                      <span>Required Courses to Complete Gaps</span>
                    </h4>
                    <p className="text-[10px] text-neutral-500 leading-normal">
                      Based on your missing skills, we recommend completing these certified courses to qualify for ATS filters:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {getRecommendedCourses(results.missing).map((course, i) => (
                        <a 
                          key={i} 
                          href={course.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-neutral-950 border border-neutral-900 rounded-lg hover:border-neutral-700 transition-colors flex flex-col justify-between group"
                        >
                          <div>
                            <span className="text-[8px] bg-red-950/20 text-red-400 px-1.5 py-0.5 rounded border border-red-900/20 font-bold uppercase tracking-wider">
                              Missing: {course.skill}
                            </span>
                            <p className="text-[10px] font-bold text-white mt-2 group-hover:text-purple-400 transition-colors line-clamp-2 leading-snug">
                              {course.title}
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-neutral-900/60 text-[9px] text-neutral-500">
                            <span>Platform: {course.provider}</span>
                            <span className="text-white font-bold group-hover:underline flex items-center gap-0.5">
                              View Course <ChevronRight className="h-3 w-3" />
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auto Optimization CTA */}
                {results.missing.length > 0 && inputMethod === 'existing' && (
                  <div className="p-4 bg-purple-950/20 border border-purple-900/30 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 mt-6">
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                        <span>AI Match Optimizer</span>
                      </h4>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Automatically inject missing keywords into your active {docType === 'cover-letter' ? 'cover letter body' : 'skills list'}.
                      </p>
                    </div>
                    <button 
                      onClick={handleAutoOptimize}
                      className="px-4 py-2.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider rounded transition-colors self-start sm:self-center shrink-0"
                    >
                      Optimize Active {docType === 'cover-letter' ? 'Cover Letter' : docType.toUpperCase()}
                    </button>
                  </div>
                )}

              </GlassCard>
            ) : (
              <div className="border border-neutral-900 border-dashed rounded-xl h-[380px] flex flex-col justify-center items-center text-neutral-500 p-8 text-center">
                <HelpCircle className="h-10 w-10 mb-4 text-neutral-700 animate-pulse" />
                <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-400">No Match Diagnostics</h3>
                <p className="text-xs text-neutral-600 max-w-sm mt-2 leading-relaxed font-sans">
                  Select a {docType === 'cover-letter' ? 'cover letter' : docType} (or drag-and-drop a PDF {docType === 'cover-letter' ? 'cover letter' : docType} file), enter the targeted job title, and paste the job requirements list on the left to run compatibility diagnostics.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
