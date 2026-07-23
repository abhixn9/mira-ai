"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, Mail, Lock } from 'lucide-react';
import { MiraLogo } from '@/components/ui/MiraLogo';
import { useLogoTransition, LogoAnimation } from '@/components/ui/LogoAnimation';
import { useResume } from '@/context/ResumeContext';

export default function LoginPage() {
  const router = useRouter();
  const { setUserName, setUserEmail } = useResume();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const { startTransition, overlay } = useLogoTransition();

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [savedAccounts, setSavedAccounts] = useState<Array<{ name: string; email: string; initial: string }>>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const openGoogleModal = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mira_registered_users');
      const activeEmail = localStorage.getItem('mira-user-email');
      const activeName = localStorage.getItem('mira-user-name');
      const accList: Array<{ name: string; email: string; initial: string }> = [];

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            parsed.forEach((u: any) => {
              if (u.email && typeof u.email === 'string') {
                const userName = u.name || u.email.split('@')[0];
                accList.push({
                  name: userName,
                  email: u.email,
                  initial: userName.charAt(0).toUpperCase()
                });
              }
            });
          }
        } catch (e) {}
      }

      if (activeEmail && !accList.some(a => a.email.toLowerCase() === activeEmail.toLowerCase())) {
        const userName = activeName || activeEmail.split('@')[0];
        accList.push({
          name: userName,
          email: activeEmail,
          initial: userName.charAt(0).toUpperCase()
        });
      }

      setSavedAccounts(accList);
      setShowCustomInput(accList.length === 0);
    } else {
      setShowCustomInput(true);
    }
    setIsGoogleModalOpen(true);
  };

  const handleGoogleLogin = (inputName: string, inputEmail: string) => {
    const finalEmail = (inputEmail || '').trim();
    if (!finalEmail) {
      setError('Please enter a valid Google email address.');
      return;
    }
    const derivedName = (inputName || '').trim() || finalEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    setIsGoogleModalOpen(false);
    setIsLoading(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('mira-user-name', derivedName);
        localStorage.setItem('mira-user-email', finalEmail);
        setUserName(derivedName);
        setUserEmail(finalEmail);

        const storedUsers = localStorage.getItem('mira_registered_users');
        let users: Array<{ name: string; email: string; phone?: string; password?: string }> = storedUsers ? JSON.parse(storedUsers) : [];
        if (!users.some(u => u.email.toLowerCase() === finalEmail.toLowerCase())) {
          users.push({ name: derivedName, email: finalEmail });
          localStorage.setItem('mira_registered_users', JSON.stringify(users));
        }

        const demoResume = {
          id: 'demo-resume-id',
          title: 'My Resume',
          updatedAt: new Date().toISOString(),
          personalInfo: {
            name: '',
            jobTitle: '',
            email: '',
            phone: '',
            linkedin: '',
            github: '',
            portfolio: '',
            address: '',
            photo: ''
          },
          summary: '',
          experience: [],
          education: [],
          skills: {
            technical: [],
            soft: [],
            languages: []
          },
          certifications: [],
          projects: [],
          awards: [],
          style: {
            templateId: 'creative',
            primaryColor: '#8b5cf6',
            fontFamily: 'outfit',
            fontSize: 'md',
            lineSpacing: 'md',
            pageMargin: 'md'
          }
        };
        localStorage.setItem('luxury-resumes', JSON.stringify([demoResume]));
        localStorage.setItem('luxury-active-resume-id', 'demo-resume-id');
        sessionStorage.setItem('mira_just_logged_in', 'true');
      }
      startTransition(() => {
        router.push('/');
      });
    }, 1000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const inputClean = email.trim().toLowerCase();
    const phoneClean = inputClean.replace(/[^0-9+]/g, '');

    setTimeout(() => {
      if (email && password) {
        if (typeof window !== 'undefined') {
          const storedUsers = localStorage.getItem('mira_registered_users');
          const users: Array<{ name: string; email: string; phone?: string; password?: string }> = storedUsers 
            ? JSON.parse(storedUsers) 
            : [
                { name: 'Alexander Sterling', email: 'alexander.sterling@design.io', phone: '+15550192834', password: 'password' }
              ];

          // Match by either Email Address or Phone Number
          const user = users.find(u => {
            const matchesEmail = u.email && u.email.trim().toLowerCase() === inputClean;
            const matchesPhone = u.phone && phoneClean.length >= 7 && u.phone.trim().replace(/[^0-9+]/g, '') === phoneClean;
            return matchesEmail || matchesPhone;
          });

          if (!user) {
            setError('No account found with this email or phone number. Please register first.');
            setIsLoading(false);
            return;
          }

          if (user.password !== password) {
            setError('Incorrect password. Please try again.');
            setIsLoading(false);
            return;
          }

          localStorage.setItem('mira-user-name', user.name);
          localStorage.setItem('mira-user-email', user.email);
          if (user.phone) localStorage.setItem('mira-user-phone', user.phone);
          sessionStorage.setItem('mira_just_logged_in', 'true');
          setUserName(user.name);
          setUserEmail(user.email);
        }

        startTransition(() => {
          router.push('/');
        });
      } else {
        setError('Please fill in all credentials.');
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleDemoAccess = () => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mira-user-name', 'Guest Demo');
      localStorage.setItem('mira-user-email', 'guest@mira-ai.com');
      sessionStorage.setItem('mira_just_logged_in', 'true');
      setUserName('Guest Demo');
      setUserEmail('guest@mira-ai.com');
      
      const demoResume = {
        id: 'demo-resume-id',
        title: 'My Resume',
        updatedAt: new Date().toISOString(),
        personalInfo: {
          name: '',
          jobTitle: '',
          email: '',
          phone: '',
          linkedin: '',
          github: '',
          portfolio: '',
          address: '',
          photo: ''
        },
        summary: '',
        experience: [],
        education: [],
        skills: {
          technical: [],
          soft: [],
          languages: []
        },
        certifications: [],
        projects: [],
        awards: [],
        style: {
          templateId: 'creative',
          primaryColor: '#8b5cf6',
          fontFamily: 'outfit',
          fontSize: 'md',
          lineSpacing: 'md',
          pageMargin: 'md'
        }
      };
      
      localStorage.setItem('luxury-resumes', JSON.stringify([demoResume]));
      localStorage.setItem('luxury-active-resume-id', 'demo-resume-id');
    }
    
    startTransition(() => {
      router.push('/');
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-6 relative luxury-mesh-bg font-sans">
      {overlay}
      
      <motion.div 
        className="w-full max-w-md glass-card p-8 sm:p-10 rounded-2xl border border-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 accent-purple-gradient"></div>

        <div className="mb-8 flex flex-col items-center justify-center">
          <MiraLogo href="/" size="lg" />
          <p className="text-xs text-neutral-400 mt-3">Access your ATS-optimized resumes</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/20 border border-red-900/30 text-red-400 text-xs rounded-lg text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1.5">Email Address or Phone Number</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                placeholder="name@company.com or +15550192834"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-900 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-white focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-900 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-white focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex justify-end text-xs text-neutral-500">
            <span className="hover:text-white transition-colors cursor-pointer">Forgot your password?</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            {isLoading ? "Validating..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-900"></div>
          </div>
          <span className="relative bg-black/60 px-3 text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Or login with</span>
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={openGoogleModal}
            className="py-2.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 rounded-lg text-xs font-bold tracking-wide transition-colors"
          >
            Google
          </button>
          <button 
            onClick={() => { window.location.href = 'https://github.com/login'; }}
            className="py-2.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 rounded-lg text-xs font-bold tracking-wide transition-colors"
          >
            GitHub
          </button>
        </div>

        {/* Guest Mode Quick Link */}
        <div className="mt-6 pt-6 border-t border-neutral-900">
          <button 
            onClick={handleDemoAccess}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center space-x-2"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>Enter as Guest (Demo)</span>
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-neutral-500">
          <span>Don&rsquo;t have an account? </span>
          <Link href="/auth/register" className="text-white hover:underline">
            Register for Free
          </Link>
        </div>

      </motion.div>

      {/* Security info */}
      <div className="mt-8 flex items-center space-x-2 text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
        <ShieldCheck className="h-4 w-4" />
        <span>SSL Secured Checkout & Account Verification</span>
      </div>

      {/* Google Sign-in Selector Modal */}
      <AnimatePresence>
        {isGoogleModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGoogleModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-neutral-950 border border-neutral-900 rounded-2xl p-6 shadow-2xl z-10 text-left"
            >
              {/* Header */}
              <div className="flex flex-col items-center text-center space-y-3 mb-6">
                {/* Google colored G logo */}
                <div className="h-8 w-8 flex items-center justify-center">
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {savedAccounts.length > 0 && !showCustomInput ? "Choose an account" : "Sign in with Google"}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">to continue to MIRA AI</p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                {savedAccounts.length > 0 && !showCustomInput && (
                  <>
                    <div className="space-y-2">
                      {savedAccounts.map((account, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleGoogleLogin(account.name, account.email)}
                          className="w-full p-3 bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-850 rounded-xl flex items-center gap-3 transition-all cursor-pointer text-left"
                        >
                          <div className="h-8 w-8 rounded-full bg-purple-950/40 text-purple-400 flex items-center justify-center border border-purple-900/40 text-xs font-black">
                            {account.initial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{account.name}</p>
                            <p className="text-[10px] text-neutral-500 truncate">{account.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(true)}
                      className="w-full p-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 rounded-xl flex items-center justify-center text-xs font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Use another Google account
                    </button>
                  </>
                )}

                {(savedAccounts.length === 0 || showCustomInput) && (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleGoogleLogin(customGoogleName, customGoogleEmail);
                    }} 
                    className="space-y-3"
                  >
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Google Email Address</label>
                      <input
                        type="email"
                        placeholder="you@gmail.com"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500 text-white font-medium transition-colors"
                        required
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Full Name (Optional)</label>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={customGoogleName}
                        onChange={(e) => setCustomGoogleName(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500 text-white font-medium transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-2 mt-2"
                    >
                      <span>Continue with Google</span>
                    </button>

                    {savedAccounts.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowCustomInput(false)}
                        className="w-full text-center text-xs text-neutral-500 hover:text-neutral-300 pt-1 cursor-pointer block"
                      >
                        ← Back to saved accounts
                      </button>
                    )}
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
