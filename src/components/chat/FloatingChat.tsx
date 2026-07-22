"use client"
 
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResume } from '@/context/ResumeContext';
import { simulateChatResponse } from '@/utils/aiSimulator';
import { usePathname } from 'next/navigation';
 
interface Message {
  sender: 'user' | 'ai';
  text: string;
}
 
const getStepDescription = (stepNum: number): string => {
  switch (stepNum) {
    case 1: return "Step 1: Contact Information";
    case 2: return "Step 2: Professional Summary";
    case 3: return "Step 3: Work Experience";
    case 4: return "Step 4: Education";
    case 5: return "Step 5: Skills (Technical & Soft)";
    case 6: return "Step 6: Projects";
    case 7: return "Step 7: Certifications & Licenses";
    case 8: return "Step 8: Languages";
    case 9: return "Step 9: Style & Formatting Settings";
    case 10: return "Step 10: Review & Export";
    default: return `Step ${stepNum}`;
  }
};
 
export function FloatingChat() {
  const { themeColor, activeResume, builderStep } = useResume();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Welcome to Mira AI Chat. I am your strategic career companion. Ask me for resume suggestions, interview preparation techniques, or keyword optimization methods!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setMessages(prev => [
        ...prev,
        { sender: 'user', text: `📎 Attached File: ${file.name}` },
        { sender: 'ai', text: `I have parsed your document "${file.name}". Key details, skills, and experience items have been extracted into your active resume draft workspace.` }
      ]);
    };

    if (file.type.includes('image')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };
 
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Hide floating chat assistant on authentication pages (sign in / register)
  if (pathname?.startsWith('/auth')) {
    return null;
  }
 
  const getUserBubbleClass = () => {
    if (themeColor === 'blue') return 'bg-blue-600 text-white shadow-sm';
    if (themeColor === 'emerald') return 'bg-emerald-600 text-white shadow-sm';
    return 'bg-purple-600 text-white shadow-sm';
  };
 
  const getChatToggleClass = () => {
    if (themeColor === 'blue') return 'bg-blue-600 text-white hover:bg-blue-700 shadow-[0_10px_30px_rgba(37,99,235,0.25)]';
    if (themeColor === 'emerald') return 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_10px_30px_rgba(5,150,105,0.25)]';
    return 'bg-purple-600 text-white hover:bg-purple-700 shadow-[0_10px_30px_rgba(147,51,234,0.25)]';
  };
 
  const getSendButtonClass = () => {
    if (themeColor === 'blue') return 'bg-blue-600 text-white hover:bg-blue-700';
    if (themeColor === 'emerald') return 'bg-emerald-600 text-white hover:bg-emerald-700';
    return 'bg-purple-600 text-white hover:bg-purple-700';
  };
 
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
 
    const userText = inputValue.trim();
    const currentMessages = [...messages, { sender: 'user', text: userText } as Message];
    setMessages(currentMessages);
    setInputValue('');
    setIsTyping(true);
 
    // 1. Direct Mutation Command Execution in Active Resume Workspace
    const execResult = parseAndExecuteResumeChange(
      userText,
      activeResume,
      updateResume,
      setThemeColor,
      setBuilderStep
    );

    if (execResult.applied) {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'ai', text: execResult.feedbackMessage }]);
        setIsTyping(false);
      }, 500);
      return;
    }

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'career-advice',
          payload: {
            query: userText,
            history: currentMessages.map(m => ({
              sender: m.sender === 'user' ? 'user' : 'assistant',
              text: m.text
            })),
            context: {
              appName: "Mira AI",
              currentPage: pathname || '/',
              currentStep: pathname?.includes('/builder') ? getStepDescription(builderStep) : 'Not in Builder',
              jobTitle: activeResume?.personalInfo?.jobTitle || '',
              skills: activeResume ? {
                technical: activeResume.skills?.technical || [],
                soft: activeResume.skills?.soft || [],
                languages: activeResume.skills?.languages || []
              } : null,
              templateId: activeResume?.style?.templateId || '',
              availableFeatures: [
                "10 Premium Resume Templates (Minimal, Executive, Modern, Creative, Elegant, ATS Friendly, Dark, Luxury, Corporate, Professional)",
                "Live PDF preview with print stylesheet layouts",
                "ATS Keyword Optimization Auditor with recommended certifications/courses",
                "Dynamic Course Mapping Recommendation Links (Udemy, Coursera, Redis University, ByteByteGo, edX)",
                "AI Resume summary generator",
                "AI Experience bullets improver / metrics quantifiably enhancer",
                "Interactive AI Career Strategist Chatbot (Mira AI)",
                "Download as PDF & Microsoft Word DOCX formats"
              ],
              unavailableFeatures: [
                "Direct GitHub import (Not implemented yet)",
                "Direct LinkedIn import (Not implemented yet)",
                "Live peer review (Not implemented yet)",
                "Job search board / direct job application system (Not implemented yet)"
              ]
            }
          }
        }),
      });
 
      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { sender: 'ai', text: data.result }]);
      } else {
        const errData = await response.json().catch(() => ({}));
        const userFacingMessage = errData.error || 'Server error during completion request';
        setMessages(prev => [...prev, { sender: 'ai', text: `Error: ${userFacingMessage}` }]);
      }
    } catch (err) {
      console.log("[Chat AI Client] Calling local fallback response simulator. Details:", err);
      const aiResponse = simulateChatResponse(userText);
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    } finally {
      setIsTyping(false);
    }
  };
 
  return (
    <div className="no-print fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 hover:rotate-6 focus:outline-none ${getChatToggleClass()}`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
 
      {/* Chat Window Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="absolute bottom-18 right-0 w-[320px] sm:w-[360px] h-[480px] glass-card rounded-2xl border border-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between"
          >
            {/* Header Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 accent-purple-gradient"></div>
 
            {/* Header */}
            <div className="px-5 py-4 border-b border-neutral-900 flex justify-between items-center bg-neutral-950/40">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-white">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span>AI Career Strategist</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            </div>
 
            {/* Messages Scroll Area */}
            <div 
              ref={scrollRef}
              className="flex-1 p-5 overflow-y-auto space-y-4 text-xs scrollbar-thin text-left"
            >
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-[18px] py-2.5 px-4 leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? `${getUserBubbleClass()} rounded-br-[4px]`
                      : 'bg-neutral-900 text-neutral-300 border border-neutral-850 rounded-bl-[4px]'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
 
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-neutral-900 text-neutral-500 rounded-xl rounded-bl-none p-3.5 border border-neutral-850 flex items-center space-x-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400" />
                    <span className="font-semibold uppercase tracking-wider text-[10px]">Analyzing query...</span>
                  </div>
                </div>
              )}
            </div>
 
            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-900 bg-neutral-950/40 flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach PDF, Document or Image"
                className="h-9 w-9 bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 text-neutral-400 hover:text-white rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                type="text"
                placeholder="Ask or attach PDF / Document..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-900 rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:border-white focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${getSendButtonClass()}`}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
 
          </motion.div>
        )}
      </AnimatePresence>
 
    </div>
  );
}
