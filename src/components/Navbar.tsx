import React from 'react';
import { UserRole, JWTSession } from '../types';
import { Compass, Shield, Activity, Bot, DollarSign, Globe, Zap, Key } from 'lucide-react';

interface NavbarProps {
  activeTab: 'optimizer' | 'advisor' | 'grafana' | 'scraper' | 'architecture';
  onSelectTab: (tab: 'optimizer' | 'advisor' | 'grafana' | 'scraper' | 'architecture') => void;
  userRole: UserRole;
  onOpenAuthModal: () => void;
  jwtSession: JWTSession;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  onOpenAuthModal,
  jwtSession,
}) => {
  const roleBadges: Record<UserRole, { label: string; color: string }> = {
    passenger: { label: 'Traveler (RBAC)', color: 'bg-sky-950 text-sky-400 border-sky-800' },
    operator: { label: 'Operator (RBAC)', color: 'bg-amber-950 text-amber-400 border-amber-800' },
    devops_admin: { label: 'DevOps Admin', color: 'bg-purple-950 text-purple-400 border-purple-800' },
  };

  return (
    <header id="omnivoyage-navbar" className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold tracking-tight text-slate-100">
                  OmniVoyage<span className="text-sky-400">.AI</span>
                </span>
                <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono font-medium">
                  $0-Cost Distributed
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Real-Time Multimodal Travel Intelligence Platform
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
            <button
              id="nav-tab-optimizer"
              onClick={() => onSelectTab('optimizer')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === 'optimizer'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Multimodal 3D Engine</span>
            </button>

            <button
              id="nav-tab-advisor"
              onClick={() => onSelectTab('advisor')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === 'advisor'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>AI Intelligence</span>
            </button>

            <button
              id="nav-tab-grafana"
              onClick={() => onSelectTab('grafana')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === 'grafana'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Grafana APM</span>
            </button>

            <button
              id="nav-tab-scraper"
              onClick={() => onSelectTab('scraper')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === 'scraper'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Selenium Farm</span>
            </button>

            <button
              id="nav-tab-architecture"
              onClick={() => onSelectTab('architecture')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === 'architecture'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>$0-Cost Stack</span>
            </button>
          </nav>

          {/* Right Action: Auth / JWT Token & RBAC */}
          <div className="flex items-center space-x-2.5">
            <button
              id="btn-auth-jwt-modal"
              onClick={onOpenAuthModal}
              className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-850 p-1.5 px-3 rounded-xl border border-slate-800 transition-all text-xs"
            >
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${roleBadges[userRole].color}`}>
                {roleBadges[userRole].label}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-800/70 scrollbar-none">
          <button
            onClick={() => onSelectTab('optimizer')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'optimizer' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Multimodal 3D
          </button>
          <button
            onClick={() => onSelectTab('advisor')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'advisor' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            AI Intelligence
          </button>
          <button
            onClick={() => onSelectTab('grafana')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'grafana' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Grafana APM
          </button>
          <button
            onClick={() => onSelectTab('scraper')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'scraper' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Selenium
          </button>
          <button
            onClick={() => onSelectTab('architecture')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'architecture' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            $0-Cost Blueprint
          </button>
        </div>
      </div>
    </header>
  );
};
