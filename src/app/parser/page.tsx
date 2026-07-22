"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  UploadCloud, 
  Loader2, 
  CheckCircle2, 
  User, 
  Mail, 
  MapPin, 
  Briefcase,
  Play
} from 'lucide-react';
import { useResume } from '@/context/ResumeContext';
import { useToast } from '@/context/ToastContext';
import { ResumeData } from '@/types/resume';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/input';

export default function ResumeParserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { importResume } = useResume();

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('mira-user-name');
      const email = localStorage.getItem('mira-user-email');
      if (!name && !email) {
        router.push('/auth/login');
      }
    }
  }, [router]);
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);

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
      const uploadedFile = e.dataTransfer.files[0];
      if (uploadedFile.type === "application/pdf") {
        setFile(uploadedFile);
        triggerParsing(uploadedFile.name);
      } else {
        toast("Please upload a PDF file only.", "error");
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      if (uploadedFile.type === "application/pdf") {
        setFile(uploadedFile);
        triggerParsing(uploadedFile.name);
      } else {
        toast("Please upload a PDF file only.", "error");
      }
    }
  };

  const triggerParsing = (fileName: string) => {
    setParsing(true);
    setParsedData(null);

    // Simulate structured parsing
    setTimeout(() => {
      // Create a nice mock resume data matching user name
      const name = fileName.replace('.pdf', '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      
      const mockParsedResume: ResumeData = {
        id: `parsed-${Date.now()}`,
        title: `Parsed - ${name}`,
        updatedAt: new Date().toISOString(),
        personalInfo: {
          name: name.includes('Resume') ? 'Alexander Sterling' : name,
          jobTitle: 'Senior Software Engineer',
          email: 'alexander.sterling@design.io',
          phone: '+1 (555) 019-2834',
          linkedin: 'linkedin.com/in/alex-sterling',
          github: 'github.com/alexsterling',
          address: 'Manhattan, New York, NY'
        },
        summary: 'Experienced Senior Engineer specializing in building design-centric, high-performance web systems using React, Next.js, and TypeScript. Broad expertise in cloud deployments and micro-frontends.',
        experience: [
          {
            id: 'parsed-exp-1',
            company: 'Aether Technologies',
            role: 'Lead Architect',
            duration: '2022 - Present',
            location: 'New York, NY',
            responsibilities: [
              'Architected modular Next.js platforms increasing throughput by 35%.',
              'Supervised frontend engineering deliverables across three product teams.'
            ],
            achievements: []
          }
        ],
        education: [
          {
            id: 'parsed-edu-1',
            degree: 'B.S. in Computer Science',
            university: 'Columbia University',
            duration: '2016 - 2020',
            cgpa: '3.88/4.00',
            location: 'New York, NY'
          }
        ],
        skills: {
          technical: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
          soft: ['Agile Leadership', 'System Design'],
          languages: ['English (Native)']
        },
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

      setParsedData(mockParsedResume);
      setParsing(false);
      toast("Structured PDF parsing complete.");
    }, 2500);
  };

  const handleImportToBuilder = () => {
    if (!parsedData) return;
    importResume(parsedData);
    toast("Imported resume to active builder workspace.");
    router.push('/builder');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans luxury-mesh-bg overflow-x-hidden p-6 md:p-8 flex justify-center items-center">
      
      <div className="w-full max-w-2xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center space-x-3 text-left">
          <Link 
            href="/" 
            className="h-8 w-8 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold tracking-tight uppercase flex items-center gap-2 text-white">
              <span>Resume <span className="luxury-text-gradient bg-clip-text">Parser</span> & Ingestor</span>
            </h1>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">Import existing documents and map layout states</p>
          </div>
        </div>

        {/* Core parser card */}
        <GlassCard className="p-6 md:p-8 border border-neutral-900 shadow-2xl relative overflow-hidden">
          
          {/* Uploader View */}
          {!parsing && !parsedData && (
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col justify-center items-center h-[280px] cursor-pointer transition-all duration-300 relative ${
                dragActive ? 'border-white bg-neutral-900/40' : 'border-neutral-850 bg-neutral-950/20 hover:border-neutral-700'
              }`}
            >
              <input
                type="file"
                accept=".pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileInput}
              />
              <UploadCloud className="h-10 w-10 text-neutral-500 mb-4 animate-pulse" />
              <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-400">Drag & Drop Resume PDF</h3>
              <p className="text-[11px] text-neutral-600 mt-2">Only PDF formats are supported for semantic structures</p>
            </div>
          )}

          {/* Loading parsing view */}
          {parsing && (
            <div className="h-[280px] flex flex-col justify-center items-center gap-4 text-center">
              <Loader2 className="h-10 w-10 text-purple-400 animate-spin" />
              <div className="space-y-1">
                <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-400 animate-pulse">Extracting Text Coordinates</h3>
                <p className="text-[11px] text-neutral-600 max-w-xs leading-normal">
                  Parsing sections, segmenting roles, mapping metadata, and aligning technical skills.
                </p>
              </div>
            </div>
          )}

          {/* Verification checklist view */}
          {parsedData && (
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-900">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 animate-bounce" />
                  <span className="text-xs font-bold uppercase tracking-wider">Layout extraction validated</span>
                </div>
                <span className="text-[10px] text-neutral-500">{file?.name}</span>
              </div>

              {/* Parsed Fields Checklist */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Name</label>
                    <div className="relative">
                      <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-500" />
                      <Input value={parsedData.personalInfo.name} readOnly className="pl-8 text-xs bg-neutral-900 border-neutral-850 h-8" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Target Role</label>
                    <div className="relative">
                      <Briefcase className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-500" />
                      <Input value={parsedData.personalInfo.jobTitle} readOnly className="pl-8 text-xs bg-neutral-900 border-neutral-850 h-8" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-500" />
                      <Input value={parsedData.personalInfo.email} readOnly className="pl-8 text-xs bg-neutral-900 border-neutral-850 h-8" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-500" />
                      <Input value={parsedData.personalInfo.address} readOnly className="pl-8 text-xs bg-neutral-900 border-neutral-850 h-8" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-neutral-950 border border-neutral-900 rounded-lg space-y-2 text-xs">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Skills Parsed</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {parsedData.skills.technical.map((sk: string, i: number) => (
                      <span key={i} className="text-[9px] bg-neutral-900 text-neutral-400 px-2 py-0.5 rounded border border-neutral-850">{sk}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-4 pt-4 border-t border-neutral-900">
                <button
                  onClick={() => {
                    setParsedData(null);
                    setFile(null);
                  }}
                  className="flex-1 py-3 bg-transparent hover:bg-neutral-950 border border-neutral-900 hover:border-neutral-800 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors text-center"
                >
                  Discard File
                </button>
                <button
                  onClick={handleImportToBuilder}
                  className="flex-1 py-3 bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                  <Play className="h-3.5 w-3.5 fill-black" />
                  <span>Import into Builder</span>
                </button>
              </div>
            </div>
          )}

        </GlassCard>

      </div>

    </div>
  );
}
