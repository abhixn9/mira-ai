"use client"

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  DollarSign, 
  Cpu, 
  ArrowLeft,
  Zap
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function AdminPage() {
  const stats = [
    { label: "Total Registered Users", value: "14,821", change: "+12% this month", icon: Users, color: "text-blue-400" },
    { label: "Monthly Recurring Revenue (MRR)", value: "₹1,73,901", change: "+18% growth", icon: DollarSign, color: "text-emerald-400" },
    { label: "Active Subscriptions (Pro)", value: "3,549", change: "24.1% conv. rate", icon: Zap, color: "text-purple-400" },
    { label: "AI API Tokens Utilized", value: "84,203,110", change: "99.8% uptime", icon: Cpu, color: "text-emerald-400" }
  ];

  const recentUsers = [
    { name: "Julian Vance", email: "j.vance@tech.co", plan: "PRO", price: "₹49", resumes: 3, date: "15 mins ago" },
    { name: "Sophia Martinez", email: "sophia.m@design.io", plan: "FREE", price: "₹0", resumes: 1, date: "1 hour ago" },
    { name: "Marcus Brody", email: "brody@capital.com", plan: "PRO", price: "₹49", resumes: 5, date: "3 hours ago" },
    { name: "Elwood Hayes", email: "hayes.e@media.net", plan: "FREE", price: "₹0", resumes: 1, date: "5 hours ago" },
    { name: "Lydia Chen", email: "lydia.chen@eng.edu", plan: "PRO", price: "₹49", resumes: 2, date: "12 hours ago" }
  ];

  const templatePopularity = [
    { name: "Minimal layout", count: "8,432 uses", percent: 56, color: "bg-white" },
    { name: "Executive layout", count: "3,211 uses", percent: 21, color: "bg-neutral-500" },
    { name: "Creative layout", count: "1,980 uses", percent: 13, color: "bg-purple-500" },
    { name: "ATS-Friendly layout", count: "1,200 uses", percent: 10, color: "bg-blue-500" }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans luxury-mesh-bg overflow-x-hidden p-6 md:p-8">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link 
              href="/builder" 
              className="h-8 w-8 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-lg font-bold tracking-tight uppercase flex items-center gap-2">
                <span>Admin Dashboard</span>
                <span className="bg-neutral-800 border border-neutral-700 text-neutral-400 text-[8px] px-2 py-0.5 rounded font-extrabold tracking-widest uppercase">Console</span>
              </h1>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">Platform Analytics & SaaS Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>All systems operational</span>
          </div>
        </div>

        {/* Core Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((st, index) => {
            const Icon = st.icon;
            return (
              <GlassCard key={index} className="p-5 flex flex-col justify-between h-[130px]">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">{st.label}</span>
                  <Icon className={`h-4 w-4 ${st.color}`} />
                </div>
                <div className="flex items-baseline justify-between mt-4">
                  <span className="text-2xl font-extrabold tracking-tight">{st.value}</span>
                  <span className="text-[9px] font-bold text-neutral-400 uppercase">{st.change}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* User registry list */}
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-bold text-left">Recent Account Registrations</h2>
            <GlassCard className="p-0 overflow-hidden border border-neutral-900">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-900 bg-neutral-950/40">
                      <th className="p-4 font-bold text-neutral-400 uppercase tracking-wider text-[10px]">User</th>
                      <th className="p-4 font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Tier</th>
                      <th className="p-4 font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Billing</th>
                      <th className="p-4 font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Resumes</th>
                      <th className="p-4 font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((usr, i) => (
                      <tr key={i} className="border-b border-neutral-900/50 hover:bg-neutral-950/30 transition-colors">
                        <td className="p-4 flex flex-col">
                          <span className="font-semibold text-white">{usr.name}</span>
                          <span className="text-[10px] text-neutral-500 mt-0.5">{usr.email}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            usr.plan === 'PRO' 
                              ? 'bg-purple-950/40 border border-purple-900/50 text-purple-400' 
                              : 'bg-neutral-900 border border-neutral-850 text-neutral-400'
                          }`}>
                            {usr.plan}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-neutral-300">{usr.price}</td>
                        <td className="p-4 font-semibold text-neutral-300">{usr.resumes}</td>
                        <td className="p-4 text-neutral-500 font-medium">{usr.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Template usage & AI Token usage charts */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Template usage shares */}
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-bold text-left">Popular Templates</h2>
              <GlassCard className="p-5 text-left space-y-4">
                {templatePopularity.map((temp, index) => (
                  <div key={index} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold text-neutral-300">
                      <span>{temp.name}</span>
                      <span>{temp.count} ({temp.percent}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-900 rounded overflow-hidden">
                      <div 
                        className={`h-full ${temp.color} rounded`} 
                        style={{ width: `${temp.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </GlassCard>
            </div>

            {/* Platform Health audit */}
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-bold text-left">Platform Health</h2>
              <GlassCard className="p-5 text-left space-y-3 text-xs leading-normal">
                <div className="flex justify-between items-center py-1">
                  <span className="text-neutral-400 font-medium">OpenAI Gateway</span>
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Connected</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-neutral-900">
                  <span className="text-neutral-400 font-medium">Stripe Webhooks</span>
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Listening</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-neutral-900">
                  <span className="text-neutral-400 font-medium">Database Connections</span>
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Active (8ms)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-neutral-900">
                  <span className="text-neutral-400 font-medium">PDF Parser Microservice</span>
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Online</span>
                </div>
              </GlassCard>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
