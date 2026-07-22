"use client"

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap } from 'lucide-react';

interface MiraLogoProps {
  href?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { box: 'h-7 w-7', icon: 'h-3.5 w-3.5', text: 'text-base' },
  md: { box: 'h-9 w-9', icon: 'h-4.5 w-4.5', text: 'text-xl' },
  lg: { box: 'h-12 w-12', icon: 'h-6 w-6',   text: 'text-3xl' },
  xl: { box: 'h-16 w-16', icon: 'h-8 w-8',   text: 'text-4xl' },
};

export function MiraLogo({ href = '/', size = 'md', showText = true, className = '' }: MiraLogoProps) {
  const s = sizes[size];

  const logo = (
    <motion.span
      className={`flex items-center gap-2.5 cursor-pointer group select-none ${className}`}
      initial={false}
      whileHover="hover"
      whileTap="tap"
    >
      {/* Animated icon box */}
      <motion.div
        variants={{
          hover: { scale: 1.14, rotate: 10, boxShadow: '0 0 28px rgba(139,92,246,0.7)' },
          tap:   { scale: 0.88, rotate: -12 },
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 14 }}
        className={`${s.box} rounded-xl bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/30 shrink-0 relative overflow-hidden`}
      >
        {/* Inner shimmer sweep on hover */}
        <motion.div
          variants={{
            hover: { x: '200%', opacity: 0.6 },
          }}
          initial={{ x: '-100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
        />
        <Zap className={`${s.icon} text-white relative z-10`} />
      </motion.div>

      {/* Brand text */}
      {showText && (
        <motion.span
          variants={{ hover: { letterSpacing: '0.12em' } }}
          transition={{ duration: 0.25 }}
          className={`font-extrabold ${s.text} tracking-wider text-white leading-none whitespace-nowrap shrink-0 flex items-center gap-1.5`}
        >
          MIRA{' '}
          <span className="text-purple-400 font-normal">AI</span>
        </motion.span>
      )}
    </motion.span>
  );

  return href ? <Link href={href}>{logo}</Link> : logo;
}
