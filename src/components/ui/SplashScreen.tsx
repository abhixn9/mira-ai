"use client"

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Show every page load — auto-dismiss after 2.2s
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setDone(true), 600);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  if (done) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden select-none"
        >
          {/* Deep radial glow */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 3, opacity: 0.18 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="absolute w-96 h-96 rounded-full bg-purple-600 blur-[120px] pointer-events-none"
          />

          {/* Outer ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
            animate={{ opacity: 0.22, scale: 1, rotate: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute w-72 h-72 rounded-full border border-purple-500/40 pointer-events-none"
          />
          {/* Inner ring pulse */}
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 0.1, scale: 1.5 }}
            transition={{ duration: 1.6, ease: 'easeOut', delay: 0.2 }}
            className="absolute w-96 h-96 rounded-full border border-indigo-400/20 pointer-events-none"
          />

          {/* Logo icon box */}
          <motion.div
            initial={{ scale: 0, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
            className="relative z-10 mb-7"
          >
            {/* Glow halo behind box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0.4] }}
              transition={{ duration: 1.2, delay: 0.4, times: [0, 0.5, 1] }}
              className="absolute inset-0 rounded-2xl bg-purple-500 blur-2xl scale-150 pointer-events-none"
            />
            <div className="relative h-24 w-24 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-800 flex items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.7)]">
              <Zap className="h-12 w-12 text-white" strokeWidth={2.5} />
            </div>
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5, ease: 'easeOut' }}
            className="relative z-10 text-center"
          >
            <h1 className="text-5xl font-black tracking-[0.28em] text-white uppercase">
              MIRA <span className="text-purple-400 font-light tracking-[0.2em]">AI</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              className="text-[9px] uppercase tracking-[0.5em] text-neutral-500 font-bold mt-2"
            >
              Career Intelligence Platform
            </motion.p>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="relative z-10 mt-10 w-36 h-px bg-neutral-900 rounded-full overflow-hidden"
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.1, delay: 1.0, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-purple-600 via-indigo-400 to-purple-300"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
