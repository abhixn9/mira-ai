"use client"

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  Copy, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  FileCheck
} from 'lucide-react';
import { useResume } from '@/context/ResumeContext';
import { useToast } from '@/context/ToastContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { simulateCoverLetter } from '@/utils/aiSimulator';
import { cn } from '@/lib/utils';

export default function CoverLetterPage() {
  const { toast } = useToast();
  const { 
    activeResume, 
    activeCoverLetter, 
    updateCoverLetter
  } = useResume();

  const [step, setStep] = useState<number>(1);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [targetJob, setTargetJob] = useState('');
  const letterRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('mira-user-name');
      const email = localStorage.getItem('mira-user-email');
      if (!name && !email) {
        window.location.href = '/auth/login';
      }
    }
  }, []);

  // Fallback redirection
  if (!activeCoverLetter) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const { recipientName, recipientTitle, companyName, companyAddress, subject, body, style, date } = activeCoverLetter;

  const handleFieldChange = (field: keyof typeof activeCoverLetter, value: string) => {
    updateCoverLetter({ [field]: value });
  };

  const handleGenerateLetter = (tone: 'professional' | 'executive' | 'creative') => {
    if (!activeResume) {
      toast("Please configure a resume profile in the builder first.", "error");
      return;
    }
    if (!targetJob || !companyName) {
      toast("Please specify the target Job Title and Company Name.", "error");
      return;
    }

    setAiGenerating(true);
    toast("Generating tailored Cover Letter with AI...", "info");

    setTimeout(() => {
      const generated = simulateCoverLetter({
        jobTitle: targetJob,
        tone,
        companyName
      }, activeResume.personalInfo);

      updateCoverLetter({
        subject: `Application for ${targetJob} Position`,
        body: generated.split('\n\n').slice(3).join('\n\n') // remove headers since they are rendered dynamically in templates
      });

      setAiGenerating(false);
      toast(`Cover letter generated in ${tone} tone.`);
    }, 1000);
  };

  const handleCopyText = () => {
    const fullText = `
${date}

${recipientName}
${recipientTitle}
${companyName}
${companyAddress}

Subject: ${subject}

${body}
    `.trim();

    navigator.clipboard.writeText(fullText);
    toast("Cover Letter copied to clipboard.");
  };

  const handlePrintLetter = () => {
    toast("Preparing Cover Letter for PDF download...", "info");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      
      {/* Top Navbar */}
      <nav className="no-print sticky top-0 left-0 right-0 z-40 glass-panel border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-left">
          <Link 
            href="/" 
            className="h-8 w-8 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold tracking-wider uppercase truncate max-w-[200px]">
              {activeCoverLetter.title}
            </h1>
            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">Cover Letter Workspace</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={handleCopyText}
            className="px-3.5 py-2 bg-neutral-900 border border-neutral-800 hover:border-white text-xs font-bold uppercase tracking-wider rounded flex items-center space-x-1.5 transition-colors"
          >
            <Copy className="h-4 w-4" />
            <span className="hidden sm:inline">Copy Text</span>
          </button>
          <button 
            onClick={handlePrintLetter}
            className="px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider rounded flex items-center space-x-1.5 transition-all active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </nav>

      {/* Workspace Grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Pane: Form Editor */}
        <div className="no-print w-full lg:w-[480px] border-r border-neutral-900 bg-neutral-950/20 flex flex-col justify-between shrink-0 h-full overflow-y-auto">
          
          <div className="p-6 space-y-8 pb-20">
            
            {/* Step Stepper */}
            <div className="flex justify-between items-center bg-neutral-950/80 border border-neutral-900 p-3 rounded-lg">
              <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">Section {step} of 3</span>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                {step === 1 && "Recipient Details"}
                {step === 2 && "AI Generator"}
                {step === 3 && "Custom Letterhead"}
              </span>
            </div>

            {/* STEP 1: Recipient details */}
            {step === 1 && (
              <div className="space-y-4 text-left">
                <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold mb-2">Recipient Coordinates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Contact Date</label>
                    <Input value={date} onChange={(e) => handleFieldChange('date', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Company Name</label>
                    <Input value={companyName} onChange={(e) => handleFieldChange('companyName', e.target.value)} placeholder="Apex Creative Solutions" />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Recipient Name</label>
                    <Input value={recipientName} onChange={(e) => handleFieldChange('recipientName', e.target.value)} placeholder="Hiring Committee" />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Recipient Title</label>
                    <Input value={recipientTitle} onChange={(e) => handleFieldChange('recipientTitle', e.target.value)} placeholder="Talent Director" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Company Address</label>
                    <Textarea 
                      value={companyAddress} 
                      onChange={(e) => handleFieldChange('companyAddress', e.target.value)} 
                      placeholder="500 Fifth Avenue&#10;New York, NY 10110"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: AI generator */}
            {step === 2 && (
              <div className="space-y-6 text-left">
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Target Job Title</label>
                    <Input 
                      value={targetJob} 
                      onChange={(e) => setTargetJob(e.target.value)} 
                      placeholder="e.g. Senior Software Architect" 
                    />
                  </div>

                  {/* AI trigger buttons */}
                  <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-xl space-y-4">
                    <div className="flex items-center space-x-2 text-xs font-bold text-purple-400">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <span>Write Cover Letter with AI</span>
                    </div>
                    <p className="text-[10px] text-neutral-500 font-medium leading-relaxed">
                      We will pull experiences and metrics from your active resume profile to generate a contextually-aligned cover letter.
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => handleGenerateLetter('professional')}
                        disabled={aiGenerating}
                        className="py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-bold uppercase tracking-wider rounded transition-colors"
                      >
                        Professional
                      </button>
                      <button 
                        onClick={() => handleGenerateLetter('executive')}
                        disabled={aiGenerating}
                        className="py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-bold uppercase tracking-wider rounded transition-colors"
                      >
                        Executive
                      </button>
                      <button 
                        onClick={() => handleGenerateLetter('creative')}
                        disabled={aiGenerating}
                        className="py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-bold uppercase tracking-wider rounded transition-colors"
                      >
                        Creative
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-900 space-y-4">
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Subject Line</label>
                    <Input value={subject} onChange={(e) => handleFieldChange('subject', e.target.value)} placeholder="Application for Senior Full Stack Architect" />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Letter Body</label>
                    <Textarea 
                      value={body} 
                      onChange={(e) => handleFieldChange('body', e.target.value)} 
                      placeholder="Dear Hiring Committee,..."
                      className="min-h-[220px] text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Styling letters */}
            {step === 3 && (
              <div className="space-y-6 text-left">
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold mb-2">Typography & Sizing</h3>
                  
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-2">Letter Font</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['sans', 'serif', 'mono'] as const).map((font) => (
                        <button
                          key={font}
                          onClick={() => updateCoverLetter({
                            style: {
                              ...style,
                              fontFamily: font
                            }
                          })}
                          className={`py-2 rounded border text-center text-xs font-bold uppercase tracking-wider ${
                            style.fontFamily === font ? 'bg-white text-black border-white' : 'bg-neutral-950 border-neutral-900 text-neutral-400'
                          }`}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-2">Font Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['sm', 'md', 'lg'] as const).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => updateCoverLetter({
                            style: {
                              ...style,
                              fontSize: sz
                            }
                          })}
                          className={`py-2 rounded border text-center text-xs font-bold uppercase tracking-wider ${
                            style.fontSize === sz ? 'bg-white text-black border-white' : 'bg-neutral-950 border-neutral-900 text-neutral-400'
                          }`}
                        >
                          {sz === 'sm' && 'Compact'}
                          {sz === 'md' && 'Regular'}
                          {sz === 'lg' && 'Large'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Navigation */}
          <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-neutral-900 bg-neutral-950/80 backdrop-blur flex justify-between">
            <button
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              disabled={step === 1}
              className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-850 disabled:opacity-35 border border-neutral-800 rounded text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(prev => Math.min(3, prev + 1))}
                className="px-4 py-2.5 bg-white text-black hover:bg-neutral-200 rounded text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handlePrintLetter}
                className="px-5 py-2.5 bg-white text-black hover:bg-neutral-200 rounded text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                <FileCheck className="h-4 w-4" />
                <span>Save & Export</span>
              </button>
            )}
          </div>

        </div>

        {/* Right Pane: Live sheet preview */}
        <div className="flex-1 bg-neutral-950 overflow-y-auto p-8 relative flex justify-center items-start min-w-[360px]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"></div>

          {/* Letterhead Frame */}
          <div 
            ref={letterRef}
            className={cn(
              "relative z-10 w-full max-w-[800px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-white text-black p-12 text-left min-h-[1020px] select-text font-sans",
              style.fontFamily === 'serif' && 'font-serif',
              style.fontFamily === 'mono' && 'font-mono',
              style.fontSize === 'sm' && 'text-xs',
              style.fontSize === 'md' && 'text-sm',
              style.fontSize === 'lg' && 'text-base'
            )}
          >
            {/* Design accents */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-black"></div>

            <div className="space-y-8">
              
              {/* Header sender (pulls from active resume personalInfo if exists) */}
              <div className="border-b pb-4 flex justify-between items-end">
                <div>
                  <h2 className="text-xl font-bold tracking-tight uppercase">
                    {activeResume?.personalInfo.name || 'Alexander Sterling'}
                  </h2>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mt-0.5">
                    {activeResume?.personalInfo.jobTitle || 'Senior Architect'}
                  </p>
                </div>
                <div className="text-right text-[10px] text-neutral-500 font-semibold space-y-0.5">
                  <p>{activeResume?.personalInfo.email || 'alexander.sterling@design.io'}</p>
                  <p>{activeResume?.personalInfo.phone || '+1 (555) 019-2834'}</p>
                </div>
              </div>

              {/* Date */}
              <p className="text-neutral-700 print:hidden">{date}</p>

              {/* Recipient Details */}
              <div className="text-neutral-800 text-xs sm:text-sm space-y-0.5">
                <p className="font-bold">{recipientName || 'Hiring Manager'}</p>
                <p className="font-medium italic text-neutral-500">{recipientTitle || 'Recruiting Coordinator'}</p>
                <p className="font-bold">{companyName || 'Target Corporation'}</p>
                <p className="whitespace-pre-line leading-relaxed">{companyAddress || '100 Main St\nNew York, NY 10001'}</p>
              </div>

              {/* Subject */}
              <p className="font-bold border-b pb-2 uppercase tracking-wide text-xs sm:text-sm">
                Subject: {subject || 'Application for Senior Role'}
              </p>

              {/* Body */}
              <p className="whitespace-pre-line leading-relaxed text-neutral-700 text-justify">
                {body || 'Write cover letter details...'}
              </p>

              {/* Sign-off */}
              <div className="pt-8 space-y-4">
                <p className="text-neutral-700">Sincerely,</p>
                <div className="pt-4 font-bold text-neutral-900">
                  {activeResume?.personalInfo.name || 'Alexander Sterling'}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
