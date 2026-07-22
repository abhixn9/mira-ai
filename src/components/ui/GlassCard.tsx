import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
}

export function GlassCard({ children, className, glow = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 border border-neutral-900 shadow-md",
        glow && "relative before:absolute before:-inset-px before:rounded-xl before:bg-gradient-to-r before:from-purple-500/30 before:to-blue-500/30 before:opacity-0 hover:before:opacity-15 before:transition-opacity before:pointer-events-none before:z-0",
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
