"use client"

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';import { useRouter } from 'next/navigation';

// ─── Full-screen logo animation (page intro) ───────────────────────────
export function LogoAnimation({ onFinish }: { onFinish?: () => void }) {
  const [show, setShow] = useState(true);
  const [exiting, setExiting] = useState(false);

  const particles = useMemo(() => {
    const result: { x: number; y: number; size: number; delay: number }[] = [];
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.3;
      const radius = 140 + Math.random() * 60;
      result.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: 2 + Math.random() * 2.5,
        delay: Math.random() * 0.25,
      });
    }
    return result;
  }, []);

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), 900);
    const removeTimer = setTimeout(() => {
      setShow(false);
      onFinish?.();
    }, 1200);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [onFinish]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="logo-anim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
        >
          {/* Background ambient glow */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)' }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          {/* Gathering particles */}
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: p.size,
                height: p.size,
                background: 'radial-gradient(circle, #A855F7, #7C3AED)',
                filter: 'blur(0.5px)',
              }}
              initial={{ x: p.x, y: p.y, opacity: 0, scale: 1 }}
              animate={{ x: 0, y: 0, opacity: [0, 0.9, 0], scale: [1, 0.5, 0] }}
              transition={{ delay: 0.3 + p.delay, duration: 0.8, ease: 'easeIn' }}
            />
          ))}

          {/* Main logo container */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Glow halo */}
            <motion.div
              className="absolute rounded-3xl pointer-events-none"
              style={{
                width: 160, height: 160, top: -16,
                background: 'radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)',
                filter: 'blur(30px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.5] }}
              transition={{ delay: 0.8, duration: 1.2, times: [0, 0.5, 1] }}
            />

            {/* Rounded square icon */}
            <motion.div
              className="relative overflow-hidden flex items-center justify-center"
              style={{
                width: 128, height: 128, borderRadius: 32,
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 30%, #4F46E5 60%, #7C3AED 100%)',
                boxShadow: '0 0 60px rgba(124,58,237,0.5), 0 0 120px rgba(124,58,237,0.2), inset 0 1px 1px rgba(255,255,255,0.1)',
                border: '1px solid rgba(168,85,247,0.3)',
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: 32, background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)' }} />

              {/* Neon border pulse */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ borderRadius: 32, border: '2px solid rgba(192,132,252,0.6)' }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: [0, 0.8, 0], scale: [0.92, 1.02, 1.06] }}
                transition={{ delay: 1.1, duration: 0.7, ease: 'easeOut' }}
              />

              {/* Lightning bolt */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.35, type: 'spring', stiffness: 300 }}
              >
                <Zap className="text-white relative z-10" style={{ width: 56, height: 56 }} strokeWidth={2} />
              </motion.div>

              {/* Flash bloom */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ borderRadius: 32, backgroundColor: 'white' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.35, 0] }}
                transition={{ delay: 1.3, duration: 0.25, ease: 'easeOut' }}
              />

              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ borderRadius: 32, background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)' }}
                initial={{ x: -200 }}
                animate={{ x: 200 }}
                transition={{ delay: 1.5, duration: 0.6, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Energy ripple */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{ width: 128, height: 128, border: '2px solid rgba(168,85,247,0.4)', top: 0 }}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2.8, opacity: 0 }}
              transition={{ delay: 1.4, duration: 0.8, ease: 'easeOut' }}
            />

            {/* "MIRA AI" text */}
            <div className="flex items-baseline gap-3 mt-7">
              <motion.span
                className="font-black text-white uppercase"
                style={{ fontSize: 44, letterSpacing: '0.18em', fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}
                initial={{ opacity: 0, x: -20, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.65, duration: 0.4, ease: 'easeOut' }}
              >
                MIRA
              </motion.span>
              <motion.span
                className="font-light uppercase"
                style={{
                  fontSize: 44, letterSpacing: '0.15em', color: '#C084FC',
                  fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
                  textShadow: '0 0 20px rgba(192,132,252,0.6), 0 0 40px rgba(192,132,252,0.3)',
                }}
                initial={{ opacity: 0, x: 20, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.8, duration: 0.4, ease: 'easeOut' }}
              >
                AI
              </motion.span>
            </div>

            {/* Tagline */}
            <motion.p
              className="uppercase font-bold text-neutral-600"
              style={{ fontSize: 9, letterSpacing: '0.5em', marginTop: 6 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0, duration: 0.4 }}
            >
              Career Intelligence Platform
            </motion.p>
          </motion.div>

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}


// ─── Short transition overlay (for button clicks & navigation) ──────────
// Duration: ~650ms. Fast snappy transition with glowing logo.
export function LogoTransition({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 650);
    return () => clearTimeout(timer);
  }, [onFinish]);

  const particles = useMemo(() => {
    const result: { x: number; y: number; size: number; delay: number }[] = [];
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16;
      const radius = 90 + Math.random() * 40;
      result.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: 2 + Math.random() * 2,
        delay: Math.random() * 0.1,
      });
    }
    return result;
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
    >
      {/* Background ambient glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Gathering particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, #A855F7, #7C3AED)',
          }}
          initial={{ x: p.x, y: p.y, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: [0, 1, 0] }}
          transition={{ delay: p.delay, duration: 0.35, ease: 'easeIn' }}
        />
      ))}

      {/* Main logo container */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Glow halo */}
        <div
          className="absolute rounded-3xl pointer-events-none"
          style={{
            width: 140, height: 140, top: -10,
            background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />

        {/* Rounded square icon */}
        <motion.div
          className="relative overflow-hidden flex items-center justify-center"
          style={{
            width: 100, height: 100, borderRadius: 24,
            background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #4F46E5 100%)',
            boxShadow: '0 0 50px rgba(124,58,237,0.6), inset 0 1px 1px rgba(255,255,255,0.2)',
            border: '1px solid rgba(168,85,247,0.4)',
          }}
        >
          {/* Lightning bolt */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            <Zap className="text-white relative z-10" style={{ width: 48, height: 48 }} strokeWidth={2.5} />
          </motion.div>

          {/* Flash bloom */}
          <motion.div
            className="absolute inset-0 pointer-events-none bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ delay: 0.2, duration: 0.2 }}
          />
        </motion.div>

        {/* "MIRA AI" text */}
        <div className="flex items-baseline gap-2 mt-4">
          <motion.span
            className="font-black text-white uppercase text-2xl tracking-widest"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.2 }}
          >
            MIRA
          </motion.span>
          <motion.span
            className="font-light uppercase text-2xl tracking-widest text-purple-400"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.2 }}
          >
            AI
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}


// ─── Hook to trigger LogoTransition before navigation ───────────────────
export function useLogoTransition() {
  const [transitioning, setTransitioning] = useState(false);
  const [callback, setCallback] = useState<(() => void) | null>(null);

  const startTransition = useCallback((cb: () => void) => {
    setCallback(() => cb);
    setTransitioning(true);
  }, []);

  const overlay = transitioning ? (
    <LogoTransition
      onFinish={() => {
        // Do NOT set transitioning to false! We let it stay visible
        // on the current page to prevent flashes while route loads.
        callback?.();
      }}
    />
  ) : null;

  return { startTransition, overlay };
}

export function TransitionLink({ 
  href, 
  children, 
  className, 
  onClick, 
  ...props 
}: { 
  href: string; 
  children: React.ReactNode; 
  className?: string; 
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: any;
}) {
  const router = useRouter();
  const { startTransition, overlay } = useLogoTransition();

  return (
    <>
      {overlay}
      <a
        href={href}
        className={className}
        onClick={(e) => {
          e.preventDefault();
          onClick?.(e);
          startTransition(() => {
            router.push(href);
          });
        }}
        {...props}
      >
        {children}
      </a>
    </>
  );
}
