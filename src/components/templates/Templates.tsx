import React, { forwardRef } from 'react';
import { ResumeData } from '@/types/resume';
import { cn } from '@/lib/utils';
import { Mail, Phone, Compass, MapPin } from 'lucide-react';
import { Linkedin, Github } from '@/components/icons/BrandIcons';

interface TemplateProps {
  data: ResumeData;
}

const SAMPLE_FALLBACK = {
  name: 'Alexander Sterling',
  jobTitle: 'Senior Full Stack Architect',
  email: 'alexander.sterling@design.io',
  phone: '+1 (555) 019-2834',
  address: 'Manhattan, New York, NY',
  linkedin: 'linkedin.com/in/alex-sterling',
  github: 'github.com/alexsterling',
  portfolio: 'portfolio.alexander.design',
  summary: 'Innovative and results-driven Senior Full Stack Architect with over 8 years of experience building high-performance web applications. Expert in React, Next.js, Node.js, and cloud systems. Proven track record of leading distributed teams, optimizing core web vitals by 35%, and managing cloud scaling for over 2 million active weekly users.',
  experience: [
    {
      id: 'sample-exp-1',
      company: 'Aether Technologies',
      role: 'Principal Engineer / Architect',
      duration: '2022 - Present',
      location: 'New York, NY',
      responsibilities: [
        'Spearheaded the migration of legacy monolith to Next.js micro-frontends, improving page speed by 40%.',
        'Designed secure Serverless API endpoints on AWS Lambda handling 5,000 requests per second.',
        'Mentored 12 mid-level and senior engineers on state management and luxury animation design patterns.'
      ],
      achievements: []
    }
  ],
  education: [
    {
      id: 'sample-edu-1',
      university: 'Massachusetts Institute of Technology',
      degree: 'M.S. in Computer Science',
      year: '2017 - 2019',
      duration: '2017 - 2019',
      cgpa: '3.9'
    },
    {
      id: 'sample-edu-2',
      university: 'Boston University',
      degree: 'B.S. in Software Engineering',
      year: '2013 - 2017',
      duration: '2013 - 2017',
      cgpa: '3.8'
    }
  ],
  skills: {
    technical: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'AWS', 'Docker', 'Kubernetes'],
    soft: ['Technical Leadership', 'System Architecture', 'Agile Product Delivery', 'Cross-functional Collaboration'],
    languages: ['English (Native)', 'Spanish (Professional)']
  },
  projects: [
    {
      id: 'sample-proj-1',
      title: 'MIRA AI CORE EDITOR',
      description: 'An AI-powered document editor built with Next.js, featuring real-time ATS optimization, keyword analysis, and dynamic layout reflows.',
      link: 'mira-resume.io',
      techStack: ['Next.js', 'TailwindCSS', 'OpenAI API']
    },
    {
      id: 'sample-proj-2',
      title: 'AETHER STATE LIBRARY',
      description: 'A lightweight, zero-dependency state management library for React applications with built-in persistence and time-travel debugging.',
      link: 'github.com/aether-state',
      techStack: ['TypeScript', 'React', 'Jest']
    }
  ],
  certifications: [
    {
      id: 'sample-cert-1',
      name: 'AWS Certified Solutions Architect - Professional',
      issuer: 'Amazon Web Services',
      year: '2023'
    }
  ]
};

export const ResumeTemplate = forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  const { style } = data;

  const personalInfo = {
    name: data.personalInfo?.name || '',
    jobTitle: data.personalInfo?.jobTitle || '',
    email: data.personalInfo?.email || '',
    phone: data.personalInfo?.phone || '',
    address: data.personalInfo?.address || '',
    linkedin: data.personalInfo?.linkedin || '',
    github: data.personalInfo?.github || '',
    portfolio: data.personalInfo?.portfolio || '',
    photo: data.personalInfo?.photo || ''
  };

  const summary = data.summary || '';

  const rawExp = (data.experience || []).map(exp => ({
    ...exp,
    responsibilities: (exp.responsibilities || []).filter(r => r && r.trim() !== ""),
    achievements: (exp.achievements || []).filter(a => a && a.trim() !== "")
  })).filter(exp => exp.company?.trim() !== "" || exp.role?.trim() !== "");
  const experience = rawExp;

  const rawEdu = (data.education || []).filter(edu => edu.university?.trim() !== "" || edu.degree?.trim() !== "");
  const education = rawEdu;

  const rawSkills = {
    technical: (data.skills?.technical || []).filter(s => s && s.trim() !== ""),
    soft: (data.skills?.soft || []).filter(s => s && s.trim() !== ""),
    languages: (data.skills?.languages || []).filter(s => s && s.trim() !== "")
  };
  const skills = rawSkills;

  const rawCert = (data.certifications || []).filter(c => c.name?.trim() !== "");
  const certifications = rawCert;

  const rawProj = (data.projects || []).filter(p => p.title?.trim() !== "");
  const projects = rawProj;

  // Font families mapping
  const fontClass = cn(
    style.fontFamily === 'sans' && 'font-sans',
    style.fontFamily === 'serif' && 'font-serif',
    style.fontFamily === 'mono' && 'font-mono',
    style.fontFamily === 'inter' && 'font-inter',
    style.fontFamily === 'roboto' && 'font-roboto',
    style.fontFamily === 'open-sans' && 'font-open-sans',
    style.fontFamily === 'lato' && 'font-lato',
    style.fontFamily === 'montserrat' && 'font-montserrat',
    style.fontFamily === 'playfair' && 'font-playfair',
    style.fontFamily === 'merriweather' && 'font-merriweather',
    style.fontFamily === 'lora' && 'font-lora',
    style.fontFamily === 'pt-serif' && 'font-pt-serif',
    style.fontFamily === 'source-serif' && 'font-source-serif',
    style.fontFamily === 'fira-code' && 'font-fira-code',
    style.fontFamily === 'source-code' && 'font-source-code',
    style.fontFamily === 'jetbrains' && 'font-jetbrains',
    style.fontFamily === 'outfit' && 'font-outfit',
    style.fontFamily === 'arvo' && 'font-arvo',
    style.fontFamily === 'oswald' && 'font-oswald',
    style.fontFamily === 'raleway' && 'font-raleway',
    style.fontFamily === 'nunito' && 'font-nunito',
    style.fontFamily === 'garamond' && 'font-garamond',
    style.fontFamily === 'cinzel' && 'font-cinzel',
    style.fontFamily === 'cardo' && 'font-cardo',
    style.fontFamily === 'cabin' && 'font-cabin',
    style.fontFamily === 'inconsolata' && 'font-inconsolata'
  );

  // Font sizes mapping
  const sizeClasses = {
    title: cn(
      style.fontSize === 'sm' && 'text-xl sm:text-2xl',
      style.fontSize === 'md' && 'text-2xl sm:text-3xl',
      style.fontSize === 'lg' && 'text-3xl sm:text-4xl'
    ),
    subtitle: cn(
      style.fontSize === 'sm' && 'text-xs sm:text-sm',
      style.fontSize === 'md' && 'text-sm sm:text-base',
      style.fontSize === 'lg' && 'text-base sm:text-lg'
    ),
    sectionHeader: cn(
      style.fontSize === 'sm' && 'text-xs tracking-wider',
      style.fontSize === 'md' && 'text-sm tracking-widest',
      style.fontSize === 'lg' && 'text-base tracking-widest'
    ),
    body: cn(
      style.fontSize === 'sm' && 'text-[11px]',
      style.fontSize === 'md' && 'text-xs',
      style.fontSize === 'lg' && 'text-sm'
    ),
    meta: cn(
      style.fontSize === 'sm' && 'text-[10px]',
      style.fontSize === 'md' && 'text-[11px]',
      style.fontSize === 'lg' && 'text-xs'
    )
  };

  // Margins mapping
  const marginClass = cn(
    style.pageMargin === 'sm' && 'p-6 sm:p-8',
    style.pageMargin === 'md' && 'p-10 sm:p-12',
    style.pageMargin === 'lg' && 'p-14 sm:p-16'
  );

  const sectionDividerColor = style.primaryColor || '#000000';

  // Helper: Render contact block items
  const renderContactInfo = (layoutType: 'inline' | 'stacked' | 'creative') => {
    const items = [
      personalInfo.email && { icon: Mail, text: personalInfo.email },
      personalInfo.phone && { icon: Phone, text: personalInfo.phone },
      personalInfo.address && { icon: MapPin, text: personalInfo.address },
      personalInfo.linkedin && { icon: Linkedin, text: personalInfo.linkedin },
      personalInfo.github && { icon: Github, text: personalInfo.github },
      personalInfo.portfolio && { icon: Compass, text: personalInfo.portfolio },
    ].filter(Boolean) as { icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>; text: string }[];

    if (layoutType === 'inline') {
      return (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-neutral-600 justify-start text-[10px] sm:text-xs">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <span key={idx} className="flex items-center space-x-1">
                <Icon className="h-3 w-3 shrink-0" style={{ color: sectionDividerColor }} />
                <span>{item.text}</span>
              </span>
            );
          })}
        </div>
      );
    }

    if (layoutType === 'creative') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-purple-600/80">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center space-x-2 bg-neutral-50 border border-neutral-100 p-2 rounded">
                <Icon className="h-3.5 w-3.5 text-purple-500" />
                <span className="truncate">{item.text}</span>
              </div>
            );
          })}
        </div>
      );
    }

    // Default: stacked (ideal for sidebar layouts)
    return (
      <div className="space-y-2 text-[10px] sm:text-xs">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center space-x-2">
              <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: sectionDividerColor }} />
              <span className="truncate">{item.text}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // 1. MINIMAL TEMPLATE
  if (style.templateId === 'minimal') {
    return (
      <div 
        ref={ref} 
        className={cn("bg-white text-black w-full min-h-[1050px] shadow-sm text-left select-text", fontClass, marginClass)}
      >
        <div className="space-y-6">
          <div className="border-b border-neutral-100 pb-6">
            <h1 className={cn("font-bold text-neutral-900 tracking-tight", sizeClasses.title)}>
              {personalInfo.name || 'Your Name'}
            </h1>
            <p className={cn("text-neutral-500 font-medium uppercase tracking-wide mt-1", sizeClasses.subtitle)}>
              {personalInfo.jobTitle || 'Target Job Title'}
            </p>
            <div className="mt-4">
              {renderContactInfo('inline')}
            </div>
          </div>

          {summary && (
            <div className="space-y-2">
              <h2 className={cn("font-bold text-neutral-900 uppercase tracking-widest border-b pb-1 border-neutral-200", sizeClasses.sectionHeader)}>
                Professional Summary
              </h2>
              <p className={cn("text-neutral-600 leading-relaxed font-sans", sizeClasses.body)}>
                {summary}
              </p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="space-y-4">
              <h2 className={cn("font-bold text-neutral-900 uppercase tracking-widest border-b pb-1 border-neutral-200", sizeClasses.sectionHeader)}>
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h4 className={cn("font-bold text-neutral-800", sizeClasses.body)}>{exp.role} at {exp.company}</h4>
                      <span className="text-[10px] text-neutral-400 font-medium">{exp.duration}</span>
                    </div>
                    <p className={cn("text-neutral-400 font-medium italic", sizeClasses.meta)}>{exp.location}</p>
                    <ul className={cn("list-disc list-outside text-neutral-600 pl-4 space-y-1", sizeClasses.body)}>
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="leading-relaxed font-sans">{resp}</li>
                      ))}
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="leading-relaxed font-bold text-neutral-800">{ach}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.length > 0 && (
              <div className="space-y-3">
                <h2 className={cn("font-bold text-neutral-900 uppercase tracking-widest border-b pb-1 border-neutral-200", sizeClasses.sectionHeader)}>
                  Education
                </h2>
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <p className={cn("font-bold text-neutral-800", sizeClasses.body)}>{edu.degree}</p>
                    <p className={cn("text-neutral-500 font-medium", sizeClasses.meta)}>{edu.university}</p>
                    <p className="text-[10px] text-neutral-400">{edu.duration} {edu.cgpa && `| CGPA: ${edu.cgpa}`}</p>
                  </div>
                ))}
              </div>
            )}

            {(skills.technical.length > 0 || skills.soft.length > 0) && (
              <div className="space-y-3">
                <h2 className={cn("font-bold text-neutral-900 uppercase tracking-widest border-b pb-1 border-neutral-200", sizeClasses.sectionHeader)}>
                  Skills
                </h2>
                <div className={cn("text-neutral-600 space-y-1 font-sans", sizeClasses.body)}>
                  {skills.technical.length > 0 && (
                    <p><strong>Technical:</strong> {skills.technical.join(', ')}</p>
                  )}
                  {skills.soft.length > 0 && (
                    <p><strong>Soft:</strong> {skills.soft.join(', ')}</p>
                  )}
                  {skills.languages.length > 0 && (
                    <p><strong>Languages:</strong> {skills.languages.join(', ')}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. EXECUTIVE TEMPLATE
  if (style.templateId === 'executive') {
    return (
      <div 
        ref={ref} 
        className={cn("bg-white text-neutral-900 w-full min-h-[1050px] shadow-sm text-left select-text", fontClass, marginClass)}
      >
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 border-b-2 pb-6" style={{ borderColor: sectionDividerColor }}>
            <h1 className={cn("font-serif font-black tracking-tight text-neutral-900", sizeClasses.title)}>
              {personalInfo.name || 'Your Name'}
            </h1>
            <p className={cn("text-neutral-500 font-serif font-bold uppercase tracking-wider mt-1", sizeClasses.subtitle)} style={{ color: sectionDividerColor }}>
              {personalInfo.jobTitle || 'Target Job Title'}
            </p>
            <div className="mt-4">
              {renderContactInfo('inline')}
            </div>
          </div>

          <div className="col-span-8 space-y-6">
            {summary && (
              <div className="space-y-2">
                <h2 className={cn("font-serif font-bold border-b pb-1 text-neutral-900 uppercase tracking-wider", sizeClasses.sectionHeader)} style={{ borderColor: sectionDividerColor }}>
                  Overview
                </h2>
                <p className={cn("text-neutral-700 leading-relaxed", sizeClasses.body)}>
                  {summary}
                </p>
              </div>
            )}

            {experience.length > 0 && (
              <div className="space-y-4">
                <h2 className={cn("font-serif font-bold border-b pb-1 text-neutral-900 uppercase tracking-wider", sizeClasses.sectionHeader)} style={{ borderColor: sectionDividerColor }}>
                  Professional History
                </h2>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between font-bold text-neutral-800">
                        <span className={sizeClasses.body}>{exp.role} | {exp.company}</span>
                        <span className="text-[10px] text-neutral-400">{exp.duration}</span>
                      </div>
                      <ul className={cn("list-disc list-outside text-neutral-600 pl-4 space-y-1", sizeClasses.body)}>
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx} className="leading-relaxed font-sans">{resp}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="col-span-4 space-y-6">
            {(skills.technical.length > 0 || skills.soft.length > 0) && (
              <div className="space-y-3">
                <h2 className={cn("font-serif font-bold border-b pb-1 text-neutral-900 uppercase tracking-wider", sizeClasses.sectionHeader)} style={{ borderColor: sectionDividerColor }}>
                  Skills Core
                </h2>
                <div className="space-y-3">
                  {skills.technical.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase font-bold text-neutral-400">Technical</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {skills.technical.map((sk, i) => (
                          <span key={i} className="bg-neutral-50 text-neutral-700 border border-neutral-100 text-[10px] px-1.5 py-0.5 rounded font-mono">{sk}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {skills.languages.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase font-bold text-neutral-400">Languages</p>
                      <p className={cn("text-neutral-600 font-mono", sizeClasses.meta)}>{skills.languages.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div className="space-y-3">
                <h2 className={cn("font-serif font-bold border-b pb-1 text-neutral-900 uppercase tracking-wider", sizeClasses.sectionHeader)} style={{ borderColor: sectionDividerColor }}>
                  Education
                </h2>
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <p className={cn("font-bold text-neutral-800", sizeClasses.body)}>{edu.degree}</p>
                    <p className={cn("text-neutral-500 font-medium", sizeClasses.meta)}>{edu.university}</p>
                    <p className="text-[9px] text-neutral-400">{edu.duration}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. CORPORATE TEMPLATE (Left bar colored grid)
  if (style.templateId === 'corporate') {
    return (
      <div 
        ref={ref} 
        className={cn("bg-white text-black w-full min-h-[1050px] shadow-sm text-left select-text flex font-sans", fontClass)}
      >
        {/* Left Column: Sidebar details */}
        <div className="w-1/3 bg-neutral-950 text-neutral-300 p-8 flex flex-col justify-between border-r border-neutral-900">
          <div className="space-y-6">
            {personalInfo.photo && (
              <div className="mb-4">
                <img 
                  src={personalInfo.photo} 
                  alt={personalInfo.name} 
                  className="h-24 w-24 rounded-2xl object-cover border border-neutral-850 shadow-sm"
                />
              </div>
            )}
            <div>
              <h1 className="font-extrabold text-white text-lg tracking-wide uppercase">{personalInfo.name || 'Your Name'}</h1>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-1">{personalInfo.jobTitle || 'Job Title'}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-neutral-900">
              <h4 className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Contact Coordinates</h4>
              {renderContactInfo('stacked')}
            </div>

            {skills.technical.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Technical Core</h4>
                <div className="flex flex-wrap gap-1">
                  {skills.technical.map((sk, i) => (
                    <span key={i} className="bg-neutral-900 text-neutral-300 border border-neutral-800 text-[9px] px-1.5 py-0.5 rounded font-mono">{sk}</span>
                  ))}
                </div>
              </div>
            )}

            {skills.languages.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Languages</h4>
                <p className="text-[10px] text-neutral-400">{skills.languages.join(', ')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Main Content */}
        <div className="w-2/3 p-10 space-y-6">
          {summary && (
            <div className="space-y-2">
              <h2 className="font-extrabold uppercase text-xs tracking-widest border-b pb-1 border-neutral-100 text-neutral-900">Summary Statement</h2>
              <p className={cn("text-neutral-600 leading-normal", sizeClasses.body)}>{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-extrabold uppercase text-xs tracking-widest border-b pb-1 border-neutral-100 text-neutral-900">Professional Experience</h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between font-bold text-neutral-800 text-xs">
                      <span>{exp.role} @ {exp.company}</span>
                      <span className="text-neutral-400 font-medium text-[10px]">{exp.duration}</span>
                    </div>
                    <ul className={cn("list-disc list-outside pl-4 text-neutral-600 space-y-1", sizeClasses.body)}>
                      {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-extrabold uppercase text-xs tracking-widest border-b pb-1 border-neutral-100 text-neutral-900">Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between text-xs text-neutral-700">
                  <span>{edu.degree} - {edu.university}</span>
                  <span className="text-neutral-400 text-[10px]">{edu.duration}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. CREATIVE TEMPLATE (Mono details, border trims)
  if (style.templateId === 'creative') {
    return (
      <div 
        ref={ref} 
        className={cn("bg-white text-black w-full min-h-[1050px] shadow-sm text-left select-text border-t-8 border-purple-500", fontClass, marginClass)}
      >
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-6 border-b border-purple-100">
            <div className="flex items-center gap-4">
              {personalInfo.photo && (
                <img 
                  src={personalInfo.photo} 
                  alt={personalInfo.name} 
                  className="h-16 w-16 rounded-full object-cover border-2 border-purple-200 shadow-sm shrink-0"
                />
              )}
              <div>
                <h1 className={cn("font-mono font-black text-neutral-900 tracking-tight", sizeClasses.title)}>
                  {personalInfo.name || 'Your Name'}
                </h1>
                <p className={cn("font-mono text-purple-600 font-bold uppercase tracking-wider mt-1.5", sizeClasses.subtitle)}>
                  {personalInfo.jobTitle || 'Target Job Title'}
                </p>
              </div>
            </div>
            <div className="w-full md:w-auto">
              {renderContactInfo('creative')}
            </div>
          </div>

          {summary && (
            <div className="space-y-2">
              <h2 className={cn("font-mono font-bold uppercase text-purple-600 border-b pb-2", sizeClasses.sectionHeader)}>
                {"// Summary"}
              </h2>
              <p className={cn("text-neutral-700 leading-relaxed font-mono", sizeClasses.body)}>
                {summary}
              </p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="space-y-6">
              <h2 className={cn("font-mono font-bold uppercase text-purple-600 border-b pb-2", sizeClasses.sectionHeader)}>
                {"// Work History"}
              </h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-2 border-l border-neutral-100 pl-4 relative">
                    <div className="absolute left-[-4.5px] top-1.5 h-2.5 w-2.5 rounded-full bg-purple-500"></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-baseline gap-1">
                      <h4 className={cn("font-bold text-neutral-900 font-sans", sizeClasses.body)}>
                        {exp.role} <span className="text-purple-500 font-mono text-xs font-semibold">@ {exp.company}</span>
                      </h4>
                      <span className="text-[10px] font-mono text-neutral-400 font-semibold">{exp.duration}</span>
                    </div>
                    <ul className={cn("list-none text-neutral-600 space-y-1.5 pl-1", sizeClasses.body)}>
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-relaxed font-sans">
                          <span className="text-purple-400 font-mono mt-0.5 text-xs shrink-0">&bull;</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 5. ELEGANT TEMPLATE (Center-aligned layout, serif headings)
  if (style.templateId === 'elegant') {
    return (
      <div 
        ref={ref} 
        className={cn("bg-white text-neutral-900 w-full min-h-[1050px] shadow-sm text-center select-text font-serif", marginClass)}
      >
        <div className="space-y-6">
          <div className="pb-4 border-b border-neutral-200">
            <h1 className={cn("font-light tracking-widest text-neutral-950 uppercase", sizeClasses.title)}>
              {personalInfo.name || 'Your Name'}
            </h1>
            <p className="text-neutral-500 italic text-xs tracking-wider mt-1">
              {personalInfo.jobTitle || 'Target Job Title'}
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-[10px] text-neutral-500 font-sans">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>| {personalInfo.phone}</span>}
              {personalInfo.address && <span>| {personalInfo.address}</span>}
              {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
            </div>
          </div>

          {summary && (
            <div className="space-y-2">
              <h2 className="text-xs uppercase tracking-widest font-bold border-b pb-0.5 border-neutral-100 text-neutral-900">Career Summary</h2>
              <p className={cn("text-neutral-600 leading-relaxed max-w-2xl mx-auto italic font-sans", sizeClasses.body)}>
                {summary}
              </p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="space-y-4 text-left">
              <h2 className="text-xs uppercase tracking-widest font-bold border-b pb-0.5 border-neutral-100 text-neutral-900 text-center">Professional Experience</h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between font-bold text-xs">
                      <span>{exp.role} &mdash; {exp.company}</span>
                      <span className="font-normal text-neutral-400">{exp.duration}</span>
                    </div>
                    <ul className={cn("list-disc pl-4 text-neutral-600 space-y-1 font-sans", sizeClasses.body)}>
                      {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 6. MODERN TEMPLATE (Colored trim borders, accent items)
  if (style.templateId === 'modern') {
    return (
      <div 
        ref={ref} 
        className={cn("bg-white text-neutral-900 w-full min-h-[1050px] shadow-sm text-left select-text", fontClass, marginClass)}
      >
        <div className="space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className={cn("font-black tracking-tight text-neutral-950 uppercase", sizeClasses.title)}>
                {personalInfo.name || 'Your Name'}
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: sectionDividerColor }}>
                {personalInfo.jobTitle || 'Target Job Title'}
              </p>
            </div>
            <div className="text-right">
              {renderContactInfo('stacked')}
            </div>
          </div>

          {summary && (
            <div className="space-y-2 border-l-4 pl-4" style={{ borderColor: sectionDividerColor }}>
              <h2 className={cn("font-bold text-neutral-900 uppercase tracking-widest", sizeClasses.sectionHeader)}>Summary</h2>
              <p className={cn("text-neutral-600 leading-normal", sizeClasses.body)}>{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="space-y-4">
              <h2 className={cn("font-bold text-neutral-900 uppercase tracking-widest border-b-2 pb-1 border-neutral-100", sizeClasses.sectionHeader)}>Work Experience</h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between font-bold text-xs text-neutral-800">
                      <span>{exp.role} @ {exp.company}</span>
                      <span className="text-[10px] text-neutral-400 font-medium">{exp.duration}</span>
                    </div>
                    <ul className={cn("list-disc pl-4 text-neutral-600 space-y-1", sizeClasses.body)}>
                      {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 7. DARK THEME TEMPLATE (Charcoal sheet, high contrast white text)
  if (style.templateId === 'dark') {
    return (
      <div 
        ref={ref} 
        className={cn("bg-[#121212] text-white w-full min-h-[1050px] shadow-sm text-left select-text print:bg-white print:text-black", fontClass, marginClass)}
      >
        <div className="space-y-6">
          <div className="border-b border-neutral-800 pb-6 print:border-neutral-200">
            <h1 className={cn("font-black tracking-tight text-white print:text-neutral-900", sizeClasses.title)}>
              {personalInfo.name || 'Your Name'}
            </h1>
            <p className={cn("text-purple-400 font-bold uppercase tracking-wider mt-1 print:text-purple-700", sizeClasses.subtitle)}>
              {personalInfo.jobTitle || 'Target Job Title'}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-neutral-400 text-xs print:text-neutral-600">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>• {personalInfo.phone}</span>}
              {personalInfo.address && <span>• {personalInfo.address}</span>}
            </div>
          </div>

          {summary && (
            <div className="space-y-2">
              <h2 className="text-xs uppercase tracking-widest text-purple-400 font-bold print:text-purple-700">Profile summary</h2>
              <p className={cn("text-neutral-300 leading-relaxed print:text-neutral-600", sizeClasses.body)}>{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-purple-400 font-bold print:text-purple-700">Experience log</h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between font-bold text-xs text-white print:text-neutral-900">
                      <span>{exp.role} @ {exp.company}</span>
                      <span className="text-neutral-500 text-[10px]">{exp.duration}</span>
                    </div>
                    <ul className={cn("list-disc pl-4 text-neutral-400 space-y-1 print:text-neutral-600", sizeClasses.body)}>
                      {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 8. PROFESSIONAL TEMPLATE (Standard business columns)
  if (style.templateId === 'professional') {
    return (
      <div 
        ref={ref} 
        className={cn("bg-white text-neutral-900 w-full min-h-[1050px] shadow-sm text-left select-text", fontClass, marginClass)}
      >
        <div className="space-y-6">
          <div className="border-b-4 border-neutral-900 pb-4">
            <h1 className={cn("font-bold text-neutral-950 tracking-wide text-2xl uppercase", sizeClasses.title)}>
              {personalInfo.name || 'Your Name'}
            </h1>
            <div className="flex justify-between items-baseline mt-2">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{personalInfo.jobTitle || 'Target Job Title'}</p>
              <div className="text-[10px] text-neutral-400 font-mono flex gap-3">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
              </div>
            </div>
          </div>

          {summary && (
            <div className="space-y-2">
              <h2 className="text-xs uppercase font-extrabold tracking-wider border-b pb-0.5 border-neutral-100">Professional Profile</h2>
              <p className={cn("text-neutral-600 leading-normal", sizeClasses.body)}>{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs uppercase font-extrabold tracking-wider border-b pb-0.5 border-neutral-100">Work Experience</h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between font-bold text-xs">
                      <span>{exp.role} &mdash; {exp.company}</span>
                      <span className="text-[10px] text-neutral-400 font-normal">{exp.duration}</span>
                    </div>
                    <ul className={cn("list-disc pl-4 text-neutral-600 space-y-1", sizeClasses.body)}>
                      {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 9. LUXURY TEMPLATE (Gold margins, serif display typography)
  if (style.templateId === 'luxury') {
    return (
      <div 
        ref={ref} 
        className={cn("bg-white text-neutral-900 w-full min-h-[1050px] shadow-sm text-center select-text font-serif border-t-8 border-yellow-600", marginClass)}
      >
        <div className="space-y-6">
          <div className="pb-4">
            <h1 className="text-2xl font-light uppercase tracking-widest text-neutral-900">{personalInfo.name || 'Your Name'}</h1>
            <p className="text-[9px] uppercase tracking-widest font-bold text-yellow-600 mt-2">{personalInfo.jobTitle || 'Target Position'}</p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[9px] tracking-widest text-neutral-400 font-sans mt-3">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>| {personalInfo.phone}</span>}
              {personalInfo.address && <span>| {personalInfo.address}</span>}
            </div>
          </div>

          {summary && (
            <div className="space-y-2 max-w-xl mx-auto border-t border-b border-neutral-150 py-4">
              <p className={cn("text-neutral-700 leading-relaxed italic text-xs", sizeClasses.body)}>{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="space-y-4 text-left">
              <h2 className="text-[10px] uppercase tracking-widest font-bold text-yellow-600 text-center">Select Career Milestones</h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between font-bold text-xs uppercase tracking-wider text-neutral-800">
                      <span>{exp.role} / {exp.company}</span>
                      <span className="font-light text-neutral-400">{exp.duration}</span>
                    </div>
                    <ul className={cn("list-disc pl-4 text-neutral-600 space-y-1 font-sans", sizeClasses.body)}>
                      {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  // 11. ACADEMIC TEMPLATE (Center header, traditional dividers, CV spacing style)
  if (style.templateId === 'academic') {
    return (
      <div 
        ref={ref} 
        className={cn("bg-white text-neutral-900 w-full min-h-[1050px] shadow-sm text-left select-text font-serif", fontClass, marginClass)}
      >
        <div className="space-y-6">
          <div className="text-center pb-4 border-b-2 border-neutral-800">
            <h1 className={cn("font-bold tracking-tight text-neutral-950", sizeClasses.title)}>
              {personalInfo.name || 'Your Name'}
            </h1>
            <p className="text-neutral-600 font-medium tracking-wide mt-1 italic text-xs">
              {personalInfo.jobTitle || 'Target Position'}
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-[10px] text-neutral-500 font-sans uppercase tracking-wider">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>| {personalInfo.phone}</span>}
              {personalInfo.address && <span>| {personalInfo.address}</span>}
              {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
              {personalInfo.github && <span>| {personalInfo.github}</span>}
            </div>
          </div>
 
          {summary && (
            <div className="space-y-2">
              <h3 className="font-bold text-neutral-950 uppercase tracking-widest text-[11px] border-b border-neutral-300 pb-0.5">Professional Overview</h3>
              <p className={cn("text-neutral-700 leading-relaxed font-serif", sizeClasses.body)}>
                {summary}
              </p>
            </div>
          )}
 
          {experience.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-neutral-950 uppercase tracking-widest text-[11px] border-b border-neutral-300 pb-0.5">Appointments & Experience</h3>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline font-bold text-xs">
                      <span className="text-neutral-900">{exp.role} &mdash; {exp.company}</span>
                      <span className="font-normal text-neutral-500 text-[10px]">{exp.duration}</span>
                    </div>
                    {exp.location && <p className="text-[10px] text-neutral-400 italic">{exp.location}</p>}
                    <ul className={cn("list-disc list-outside text-neutral-700 pl-4 space-y-1", sizeClasses.body)}>
                      {exp.responsibilities.map((r, i) => <li key={i} className="leading-relaxed">{r}</li>)}
                      {exp.achievements.map((a, i) => <li key={i} className="leading-relaxed font-semibold">{a}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
 
          {education.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-neutral-950 uppercase tracking-widest text-[11px] border-b border-neutral-300 pb-0.5">Education</h3>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline text-xs font-semibold text-neutral-800">
                    <span>{edu.degree} &mdash; {edu.university} {edu.cgpa && `(CGPA: ${edu.cgpa})`}</span>
                    <span className="font-normal text-neutral-500 text-[10px]">{edu.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
 
          {skills.technical.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-neutral-950 uppercase tracking-widest text-[11px] border-b border-neutral-300 pb-0.5">Skills & Expertise</h3>
              <p className={cn("text-neutral-700 leading-relaxed font-sans", sizeClasses.body)}>
                <strong>Technical:</strong> {skills.technical.join(', ')}
                {skills.soft.length > 0 && <span> | <strong>Soft Skills:</strong> {skills.soft.join(', ')}</span>}
                {skills.languages.length > 0 && <span> | <strong>Languages:</strong> {skills.languages.join(', ')}</span>}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
 
  // 12. TWO-COLUMN TEMPLATE (Left sidebar color accent, right main content)
  if (style.templateId === 'two-column') {
    return (
      <div 
        ref={ref} 
        className={cn("bg-white text-neutral-900 w-full min-h-[1050px] shadow-sm text-left select-text font-sans flex", fontClass)}
      >
        {/* Left Column (Sidebar) */}
        <div className="w-[30%] bg-neutral-50 border-r border-neutral-100 p-8 space-y-6 text-left shrink-0">
          {personalInfo.photo && (
            <div className="mb-4">
              <img 
                src={personalInfo.photo} 
                alt={personalInfo.name} 
                className="h-20 w-20 rounded-full object-cover border border-neutral-200 shadow-sm"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <h1 className="font-black text-lg tracking-tight uppercase text-neutral-900 leading-tight">
              {personalInfo.name || 'Your Name'}
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: sectionDividerColor }}>
              {personalInfo.jobTitle || 'Target Position'}
            </p>
          </div>
 
          <div className="space-y-4">
            <h4 className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-200 pb-1">Contact</h4>
            <div className="space-y-2 text-[10px] text-neutral-600">
              {personalInfo.email && <div className="truncate"><strong>Email:</strong> {personalInfo.email}</div>}
              {personalInfo.phone && <div className="truncate"><strong>Phone:</strong> {personalInfo.phone}</div>}
              {personalInfo.address && <div className="truncate"><strong>Address:</strong> {personalInfo.address}</div>}
              {personalInfo.linkedin && <div className="truncate"><strong>LinkedIn:</strong> {personalInfo.linkedin}</div>}
              {personalInfo.github && <div className="truncate"><strong>GitHub:</strong> {personalInfo.github}</div>}
            </div>
          </div>
 
          {(skills.technical.length > 0 || skills.soft.length > 0) && (
            <div className="space-y-4">
              <h4 className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-200 pb-1">Expertise</h4>
              {skills.technical.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-500">Technical</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {skills.technical.map((s, idx) => (
                      <span key={idx} className="bg-neutral-100 border border-neutral-200 text-neutral-700 text-[9px] px-1.5 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.soft.length > 0 && (
                <div className="space-y-1 pt-2">
                  <span className="text-[9px] font-bold uppercase text-neutral-500">Soft Skills</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {skills.soft.map((s, idx) => (
                      <span key={idx} className="bg-neutral-100 border border-neutral-200 text-neutral-700 text-[9px] px-1.5 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
 
          {certifications.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-200 pb-1">Certificates</h4>
              <div className="space-y-2 text-[9px] text-neutral-600 leading-normal">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <strong className="text-neutral-800">{c.name}</strong>
                    <div>{c.issuer} ({c.year})</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
 
        {/* Right Column (Main Content) */}
        <div className="w-[70%] p-8 space-y-6 text-left">
          {summary && (
            <div className="space-y-2">
              <h2 className="text-xs uppercase tracking-widest font-extrabold border-b pb-1 border-neutral-100" style={{ color: sectionDividerColor }}>
                Professional Profile
              </h2>
              <p className={cn("text-neutral-600 leading-relaxed font-sans", sizeClasses.body)}>
                {summary}
              </p>
            </div>
          )}
 
          {experience.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest font-extrabold border-b pb-1 border-neutral-100" style={{ color: sectionDividerColor }}>
                Work History
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline font-bold text-xs">
                      <span className="text-neutral-800">{exp.role} &mdash; {exp.company}</span>
                      <span className="font-normal text-neutral-400 text-[10px]">{exp.duration}</span>
                    </div>
                    {exp.location && <p className="text-[10px] text-neutral-400 italic mt-0.5">{exp.location}</p>}
                    <ul className={cn("list-disc list-outside text-neutral-600 pl-4 space-y-1 font-sans mt-1", sizeClasses.body)}>
                      {exp.responsibilities.map((r, i) => <li key={i} className="leading-relaxed">{r}</li>)}
                      {exp.achievements.map((a, i) => <li key={i} className="leading-relaxed font-semibold text-neutral-800">{a}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
 
          {education.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-widest font-extrabold border-b pb-1 border-neutral-100" style={{ color: sectionDividerColor }}>
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline text-xs font-semibold text-neutral-700">
                    <span>{edu.degree} &mdash; {edu.university} {edu.cgpa && `(CGPA: ${edu.cgpa})`}</span>
                    <span className="font-normal text-neutral-400 text-[10px]">{edu.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 12. BTECH FRESHER / TECH CREATIVE TEMPLATE
  if (style.templateId === 'btech-fresher') {
    return (
      <div 
        ref={ref} 
        className={cn("bg-white text-neutral-900 w-full min-h-[1050px] shadow-sm text-left select-text flex font-sans", fontClass)}
      >
        {/* Sidebar Column (Left 33%) */}
        <div className="w-[33%] bg-neutral-950 text-white p-8 space-y-6 text-left shrink-0 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header info in sidebar */}
            <div className="space-y-2 pb-4 border-b border-neutral-800">
              {personalInfo.photo && (
                <div className="mb-4">
                  <img 
                    src={personalInfo.photo} 
                    alt={personalInfo.name} 
                    className="h-20 w-20 rounded-full object-cover border border-neutral-850 shadow-sm"
                  />
                </div>
              )}
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white leading-tight uppercase">
                {personalInfo.name || 'Your Name'}
              </h1>
              <p className="text-[9px] font-black uppercase tracking-wider text-purple-400">
                {personalInfo.jobTitle || 'Target Position'}
              </p>
            </div>

            {/* Contact details */}
            <div className="space-y-3">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-neutral-500 border-b border-neutral-800 pb-1">Contact Details</h4>
              <div className="space-y-2 text-[10px] text-neutral-400">
                {personalInfo.email && <div className="truncate"><strong>Email:</strong> {personalInfo.email}</div>}
                {personalInfo.phone && <div className="truncate"><strong>Phone:</strong> {personalInfo.phone}</div>}
                {personalInfo.address && <div className="truncate text-wrap"><strong>Address:</strong> {personalInfo.address}</div>}
                {personalInfo.linkedin && <div className="truncate"><strong>LinkedIn:</strong> {personalInfo.linkedin}</div>}
                {personalInfo.github && <div className="truncate"><strong>GitHub:</strong> {personalInfo.github}</div>}
              </div>
            </div>

            {/* Education details (vital for freshers) */}
            {education.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-neutral-500 border-b border-neutral-800 pb-1">Education</h4>
                <div className="space-y-3 text-[10px] text-neutral-300">
                  {education.map((edu) => (
                    <div key={edu.id} className="space-y-0.5">
                      <div className="font-bold text-white leading-tight">{edu.degree}</div>
                      <div className="text-neutral-400">{edu.university}</div>
                      <div className="flex justify-between text-[9px] text-neutral-500 font-semibold mt-0.5">
                        <span>{edu.duration}</span>
                        {edu.cgpa && <span className="text-emerald-400 font-bold">CGPA: {edu.cgpa}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Skills - rendered as visual pill tags! */}
            {skills.technical.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-neutral-500 border-b border-neutral-800 pb-1">Technical Stack</h4>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {skills.technical.map((s, idx) => (
                    <span key={idx} className="bg-neutral-900 border border-neutral-800 text-neutral-200 text-[9px] px-2 py-0.5 rounded-full font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer of sidebar */}
          <div className="text-[8px] text-neutral-600 font-semibold uppercase tracking-wider">
            Mira AI • B.Tech Portfolio
          </div>
        </div>

        {/* Main Column (Right 67%) */}
        <div className="w-[67%] p-8 space-y-6 text-left flex flex-col justify-between">
          <div className="space-y-6">
            {/* Professional Summary */}
            {summary && (
              <div className="space-y-2">
                <h2 className="text-xs uppercase tracking-widest font-black border-b pb-1 border-neutral-100 text-purple-600">
                  About Me
                </h2>
                <p className={cn("text-neutral-600 leading-relaxed font-sans", sizeClasses.body)}>
                  {summary}
                </p>
              </div>
            )}

            {/* Key Technical Projects (Vital for BTech freshers!) */}
            {projects.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs uppercase tracking-widest font-black border-b pb-1 border-neutral-100 text-purple-600">
                  Technical Project Portfolio
                </h2>
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-1 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                      <div className="flex justify-between items-baseline font-bold text-xs">
                        <span className="text-neutral-800 uppercase tracking-wide">{proj.title}</span>
                        {proj.link && <span className="font-mono text-purple-500 text-[9px] font-semibold">{proj.link}</span>}
                      </div>
                      <p className={cn("text-neutral-600 leading-relaxed font-sans mt-1", sizeClasses.body)}>
                        {proj.description}
                      </p>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1.5">
                          {proj.technologies.map((t, i) => (
                            <span key={i} className="text-[8px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-mono font-bold">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience / Internships */}
            {experience.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs uppercase tracking-widest font-black border-b pb-1 border-neutral-100 text-purple-600">
                  Internships & Training
                </h2>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline font-bold text-xs">
                        <span className="text-neutral-800">{exp.role} &mdash; <span className="text-neutral-500 font-medium">{exp.company}</span></span>
                        <span className="font-normal text-neutral-400 text-[10px]">{exp.duration}</span>
                      </div>
                      {exp.location && <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{exp.location}</p>}
                      <ul className={cn("list-disc list-outside text-neutral-600 pl-4 space-y-1 font-sans mt-1", sizeClasses.body)}>
                        {exp.responsibilities.map((r, i) => <li key={i} className="leading-relaxed">{r}</li>)}
                        {exp.achievements.map((a, i) => <li key={i} className="leading-relaxed font-semibold text-neutral-800">{a}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-neutral-100 text-[9px] text-neutral-400 font-semibold uppercase tracking-wider">
            {/* Certifications and Soft skills brief inline */}
            {certifications.length > 0 ? (
              <div className="truncate max-w-[60%]">
                <strong>Certificates:</strong> {certifications.slice(0, 2).map(c => c.name).join(', ')}
              </div>
            ) : <div />}
            {skills.soft.length > 0 && (
              <div className="truncate">
                <strong>Traits:</strong> {skills.soft.slice(0, 3).join(' • ')}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback to default
  return (
    <div 
      ref={ref} 
      className={cn("bg-white text-black w-full min-h-[1050px] shadow-sm text-left select-text", fontClass, marginClass)}
    >
      <div className="space-y-6">
        
        {/* Header center alignment */}
        <div className="text-center space-y-1.5 mb-6">
          <h1 className="font-bold text-2xl tracking-tight text-neutral-900 uppercase">
            {personalInfo.name || 'Your Name'}
          </h1>
          <p className="font-bold text-xs uppercase text-neutral-600">
            {personalInfo.jobTitle || 'Target Job Title'}
          </p>
          <div className="flex flex-wrap justify-center gap-x-3 text-neutral-600 text-xs">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.address && <span>• {personalInfo.address}</span>}
            {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
            {personalInfo.github && <span>• {personalInfo.github}</span>}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="space-y-2">
            <h2 className="font-bold uppercase text-xs tracking-wider border-b border-black pb-0.5">{"Professional Summary"}</h2>
            <p className={cn("text-neutral-800 leading-normal", sizeClasses.body)}>
              {summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-bold uppercase text-xs tracking-wider border-b border-black pb-0.5">{"Professional Experience"}</h2>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between font-bold text-xs">
                    <span>{exp.company} | {exp.role}</span>
                    <span>{exp.duration} | {exp.location}</span>
                  </div>
                  <ul className={cn("list-disc list-outside text-neutral-800 pl-4 space-y-1", sizeClasses.body)}>
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx} className="leading-relaxed">{resp}</li>
                    ))}
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx} className="leading-relaxed font-semibold">{ach}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-bold uppercase text-xs tracking-wider border-b border-black pb-0.5">{"Education"}</h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between text-xs">
                  <span>{edu.university} | {edu.degree} {edu.cgpa && `(CGPA: ${edu.cgpa})`}</span>
                  <span>{edu.duration} | {edu.location}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {(skills.technical.length > 0 || skills.soft.length > 0) && (
          <div className="space-y-3">
            <h2 className="font-bold uppercase text-xs tracking-wider border-b border-black pb-0.5">{"Skills & Qualifications"}</h2>
            <div className={cn("text-neutral-800 leading-relaxed", sizeClasses.body)}>
              {skills.technical.length > 0 && (
                <p>
                  <strong className="text-neutral-900">Technical Skills:</strong> {skills.technical.join(', ')}
                </p>
              )}
              {skills.soft.length > 0 && (
                <p className="mt-1">
                  <strong className="text-neutral-900">Soft Skills:</strong> {skills.soft.join(', ')}
                </p>
              )}
              {skills.languages.length > 0 && (
                <p className="mt-1">
                  <strong className="text-neutral-900">Languages:</strong> {skills.languages.join(', ')}
                </p>
              )}
            </div>
          </div>
        )}

        {(certifications.length > 0 || projects.length > 0) && (
          <div className="space-y-3">
            <h2 className="font-bold uppercase text-xs tracking-wider border-b border-black pb-0.5">{"Additional Qualifications"}</h2>
            <div className={cn("text-neutral-800 leading-relaxed", sizeClasses.body)}>
              {certifications.length > 0 && (
                <p>
                  <strong className="text-neutral-900">Certifications:</strong>{' '}
                  {certifications.map((c) => `${c.name} (${c.issuer}, ${c.year})`).join('; ')}
                </p>
              )}
              {projects.length > 0 && (
                <p className="mt-1">
                  <strong className="text-neutral-900">Key Projects:</strong>{' '}
                  {projects.map((p) => `${p.title} - ${p.description}`).join('; ')}
                </p>
              )}
            </div>
          </div>
        )}
 
      </div>
    </div>
  );
});
 
ResumeTemplate.displayName = "ResumeTemplate";
