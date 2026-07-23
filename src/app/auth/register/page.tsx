"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, User, Phone } from 'lucide-react';
import { MiraLogo } from '@/components/ui/MiraLogo';
import { useLogoTransition, LogoAnimation } from '@/components/ui/LogoAnimation';
import { useResume } from '@/context/ResumeContext';

export default function RegisterPage() {
  const router = useRouter();
  const { setUserName, setUserEmail } = useResume();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const { startTransition, overlay } = useLogoTransition();

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const decodeJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const handleGoogleLogin = (inputName: string, inputEmail: string) => {
    const finalEmail = (inputEmail || '').trim();
    if (!finalEmail) {
      setError('Please select a valid Google account.');
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

  const openGoogleModal = () => {
    setIsGoogleModalOpen(true);
  };

  React.useEffect(() => {
    if (isGoogleModalOpen && typeof window !== 'undefined') {
      const initGsi = () => {
        if (window.google?.accounts?.id) {
          try {
            window.google.accounts.id.initialize({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1048590895825-default.apps.googleusercontent.com',
              callback: (response: any) => {
                if (response?.credential) {
                  const payload = decodeJwt(response.credential);
                  if (payload?.email) {
                    const name = payload.name || payload.given_name || payload.email.split('@')[0];
                    handleGoogleLogin(name, payload.email);
                  }
                }
              },
              auto_select: false,
              cancel_on_tap_outside: true,
            });

            const btnDiv = document.getElementById('register-google-btn-container');
            if (btnDiv) {
              btnDiv.innerHTML = '';
              window.google.accounts.id.renderButton(btnDiv, {
                theme: 'filled_black',
                size: 'large',
                type: 'standard',
                shape: 'pill',
                text: 'continue_with',
                logo_alignment: 'left',
                width: 300
              });
            }

            window.google.accounts.id.prompt();
          } catch (e) {
            console.error('Google auth initialization:', e);
          }
        }
      };

      const timer = setTimeout(initGsi, 150);
      return () => clearTimeout(timer);
    }
  }, [isGoogleModalOpen]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhoneStr = phone.trim().replace(/[^0-9+]/g, '');

    setTimeout(() => {
      if (name && email && phone && password) {
        if (typeof window !== 'undefined') {
          const storedUsers = localStorage.getItem('mira_registered_users');
          const users: Array<{ name: string; email: string; phone?: string; password?: string }> = storedUsers 
            ? JSON.parse(storedUsers) 
            : [
                { name: 'Alexander Sterling', email: 'alexander.sterling@design.io', phone: '+15550192834', password: 'password' }
              ];

          // 1. Check if Email already exists
          const emailExists = users.some(u => u.email && u.email.trim().toLowerCase() === cleanEmail);
          if (emailExists) {
            setError('This email address is already registered to another account. Please use a different email or sign in.');
            setIsLoading(false);
            return;
          }

          // 2. Check if Phone Number already exists
          const phoneExists = users.some(u => {
            if (!u.phone) return false;
            const existingPhoneClean = u.phone.trim().replace(/[^0-9+]/g, '');
            return existingPhoneClean === cleanPhoneStr;
          });

          if (phoneExists) {
            setError('This phone number is already registered to another account. Please use a different phone number.');
            setIsLoading(false);
            return;
          }

          // Add new unique user
          users.push({ name: name.trim(), email: cleanEmail, phone: phone.trim(), password });
          localStorage.setItem('mira_registered_users', JSON.stringify(users));

          // Set active session details
          localStorage.setItem('mira-user-name', name.trim());
          localStorage.setItem('mira-user-email', cleanEmail);
          localStorage.setItem('mira-user-phone', phone.trim());
          setUserName(name.trim());
          setUserEmail(cleanEmail);
        }

        startTransition(() => {
          router.push('/');
        });
      } else {
        setError('Please fill in all required fields including email and phone number.');
        setIsLoading(false);
      }
    }, 1000);
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
          <p className="text-xs text-neutral-400 mt-3">Get started with professional resume tools</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/20 border border-red-900/30 text-red-400 text-xs rounded-lg text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-left">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Alex Sterling"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-900 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-white focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-900 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-white focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
              <input
                type="tel"
                placeholder="+1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

          <div className="text-[10px] text-neutral-500 leading-normal">
            By registering, you agree to our <span className="text-white hover:underline cursor-pointer">Terms of Service</span> and <span className="text-white hover:underline cursor-pointer">Privacy Policy</span>.
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            {isLoading ? "Creating..." : "Register"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-900"></div>
          </div>
          <span className="relative bg-black/60 px-3 text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Or register with</span>
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

        <div className="mt-6 text-center text-xs text-neutral-500">
          <span>Already have an account? </span>
          <Link href="/auth/login" className="text-white hover:underline">
            Sign In
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
              className="relative w-full max-w-sm bg-neutral-950 border border-neutral-900 rounded-2xl p-6 shadow-2xl z-10 text-center"
            >
              {/* Header */}
              <div className="flex flex-col items-center text-center space-y-3 mb-6">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 shadow-inner">
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Select Google Account</h3>
                  <p className="text-xs text-neutral-400 mt-1">Choose your Google account on this device</p>
                </div>
              </div>

              {/* Native Google Sign-In Button Container */}
              <div className="flex justify-center items-center my-4 min-h-[44px]">
                <div id="register-google-btn-container" className="flex justify-center"></div>
              </div>

              {/* Native Device Account Trigger */}
              <div className="mt-4 pt-4 border-t border-neutral-900 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    if (window.google?.accounts?.id) {
                      window.google.accounts.id.prompt();
                    } else {
                      window.open('https://accounts.google.com/o/oauth2/v2/auth', '_blank', 'width=500,height=600');
                    }
                  }}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-2"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Tap to Select Account on Device</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="w-full text-center text-xs text-neutral-500 hover:text-neutral-300 pt-1 cursor-pointer block"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
