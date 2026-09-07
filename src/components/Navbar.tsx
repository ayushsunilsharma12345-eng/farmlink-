import React from 'react';
import {
  Sprout,
  Building2,
  ShieldCheck,
  Calculator,
  Bell,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  GitBranch,
} from 'lucide-react';
import { UserRole, MandiPrice } from '../types';

interface NavbarProps {
  activeRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  mandiPrices: MandiPrice[];
  unreadNotifsCount: number;
  onOpenNotifications: () => void;
  onOpenAiAdvisor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onSelectRole,
  mandiPrices,
  unreadNotifsCount,
  onOpenNotifications,
  onOpenAiAdvisor,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] text-white border-b border-slate-800 shadow-md">
      {/* Live Mandi Ticker Bar in dark slate */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 overflow-hidden border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium shrink-0 text-emerald-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-[11px] tracking-wider uppercase">Mandi Ticker:</span>
          </div>
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5 whitespace-nowrap text-xs">
            {mandiPrices.map((m) => (
              <div key={m.id} className="inline-flex items-center gap-1.5 text-slate-300">
                <span className="font-semibold text-white">{m.commodity}</span>
                <span className="text-slate-400">({m.mandi.split(' ')[0]}):</span>
                <span className="font-mono text-emerald-400 font-bold">₹{m.currentPrice}/kg</span>
                <span
                  className={`text-[10px] font-semibold px-1 rounded ${
                    m.changePercent >= 0 ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-800' : 'bg-rose-900/60 text-rose-300 border border-rose-800'
                  }`}
                >
                  {m.changePercent >= 0 ? `+${m.changePercent}%` : `${m.changePercent}%`}
                </span>
              </div>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-3 text-slate-400 text-[11px] shrink-0 font-mono">
            <span className="flex items-center gap-1 text-slate-400">
              <GitBranch className="w-3.5 h-3.5 text-blue-400" />
              ayushsunilsharma12345-eng
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Free Tier ($0.00)</span>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">FarmLink</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  0 Cost Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-mono">
                ayushsunilsharma12345-eng
              </p>
            </div>
          </div>

          {/* Persona / Portal Tabs with Professional Polish Slate & Blue */}
          <nav className="flex items-center p-1 bg-slate-800/90 rounded-xl border border-slate-700/80">
            <button
              id="tab-farmer"
              onClick={() => onSelectRole('farmer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRole === 'farmer'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Farmer Portal</span>
            </button>

            <button
              id="tab-buyer"
              onClick={() => onSelectRole('buyer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRole === 'buyer'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Buyer Portal</span>
            </button>

            <button
              id="tab-admin"
              onClick={() => onSelectRole('admin')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRole === 'admin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Market Admin</span>
            </button>

            <button
              id="tab-architect"
              onClick={() => onSelectRole('architect')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRole === 'architect'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-700/60'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span className="font-bold">₹0 Cost Evaluation</span>
            </button>
          </nav>

          {/* Action Utilities & User Avatar */}
          <div className="flex items-center gap-3">
            {/* Monthly Accrual Callout */}
            <div className="hidden md:block text-right">
              <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Monthly Accrual</p>
              <p className="text-xs font-mono font-bold text-emerald-400">$0.00 USD</p>
            </div>

            {/* AI Advisor Button */}
            <button
              id="btn-ai-advisor-nav"
              onClick={onOpenAiAdvisor}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              title="Open FarmLink AI RAG Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">AI Advisor</span>
            </button>

            {/* Notifications Button */}
            <button
              id="btn-notifications-nav"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* User Badge AS (ayushsunilsharma12345-eng) */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700/80">
              <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                AS
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 truncate w-28">ayushsunilsharma</span>
                <span className="text-[10px] text-emerald-400 font-medium">Free Tier</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

