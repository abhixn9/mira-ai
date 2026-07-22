"use client"

import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Mail, Clock, ArrowRight, Plus, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useResume } from '@/context/ResumeContext';

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Unknown date';
  }
}

export function HistoryDrawer({ open, onClose }: HistoryDrawerProps) {
  const { resumes, coverLetters, selectResume, selectCoverLetter, activeResumeId, activeCoverLetterId } = useResume();

  // Build unified activity list sorted by updatedAt desc
  const allItems = [
    ...resumes.map(r => ({ ...r, kind: 'resume' as const })),
    ...coverLetters.map(cl => ({ ...cl, kind: 'cover-letter' as const }))
  ].sort((a, b) => {
    const aDate = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bDate = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bDate - aDate;
  });

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="history-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            key="history-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-neutral-950 border-l border-neutral-900 z-50 flex flex-col shadow-[−20px_0_60px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-900">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-400" />
                  Document History
                </h2>
                <p className="text-[10px] text-neutral-500 mt-0.5 font-bold uppercase tracking-wider">
                  All your resumes, CVs & cover letters
                </p>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-600 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick action bar */}
            <div className="grid grid-cols-2 gap-2 px-6 py-4 border-b border-neutral-900/60">
              <Link
                href="/builder"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-purple-950/30 border border-purple-900/30 hover:border-purple-500/40 hover:bg-purple-900/20 transition-all group"
              >
                <Plus className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-[10px] font-black uppercase tracking-wider text-white">New Resume</span>
                <ArrowRight className="h-3 w-3 text-neutral-600 group-hover:text-purple-400 ml-auto transition-colors" />
              </Link>
              <Link
                href="/cover-letter"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30 hover:border-emerald-500/40 hover:bg-emerald-900/10 transition-all group"
              >
                <Plus className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-wider text-white">New Letter</span>
                <ArrowRight className="h-3 w-3 text-neutral-600 group-hover:text-emerald-400 ml-auto transition-colors" />
              </Link>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {allItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <Clock className="h-8 w-8 text-neutral-700 mb-3" />
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">No history yet</p>
                  <p className="text-[10px] text-neutral-700 mt-1">Create a resume or cover letter to see it here</p>
                </div>
              ) : (
                allItems.map((item) => {
                  const isResume = item.kind === 'resume';
                  const isActive = isResume
                    ? item.id === activeResumeId
                    : item.id === activeCoverLetterId;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group relative flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? 'border-white/20 bg-white/5'
                          : 'border-neutral-900 bg-neutral-900/20 hover:border-neutral-800 hover:bg-neutral-900/40'
                      }`}
                      onClick={() => {
                        if (isResume) selectResume(item.id);
                        else selectCoverLetter(item.id);
                        onClose();
                      }}
                    >
                      {/* Icon */}
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isResume
                          ? 'bg-purple-950/30 border-purple-900/40 text-purple-400'
                          : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400'
                      }`}>
                        {isResume ? <FileText className="h-4.5 w-4.5" /> : <Mail className="h-4.5 w-4.5" />}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                            isResume
                              ? 'text-purple-400 bg-purple-950/30 border-purple-900/30'
                              : 'text-emerald-400 bg-emerald-950/20 border-emerald-900/20'
                          }`}>
                            {isResume ? 'Resume' : 'Cover Letter'}
                          </span>
                          {isActive && (
                            <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border text-white bg-white/10 border-white/20">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-white truncate">{item.title}</p>
                        <p className="text-[10px] text-neutral-500 mt-0.5 font-medium">
                          {item.updatedAt ? formatDate(item.updatedAt) : 'No date'}
                        </p>
                      </div>

                      <ChevronRight className="h-4 w-4 text-neutral-700 group-hover:text-white shrink-0 self-center transition-colors" />
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-900">
              <Link
                href="/ats-checker"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-[10px] font-black uppercase tracking-wider text-neutral-400 hover:text-white transition-all"
              >
                Run ATS Audit on Active Document
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
