import React, { useState } from 'react';
import { UserRole, JWTSession } from '../types';
import { Shield, Key, Lock, User, Check, Copy, ExternalLink, X } from 'lucide-react';

interface AuthRbacModalProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  jwtSession: JWTSession;
  isOpen: boolean;
  onClose: () => void;
}

export const AuthRbacModal: React.FC<AuthRbacModalProps> = ({
  currentRole,
  onChangeRole,
  jwtSession,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'token' | 'roles' | 'oauth'>('token');

  if (!isOpen) return null;

  const handleCopyToken = () => {
    navigator.clipboard.writeText(jwtSession.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const roleDescriptions: Record<UserRole, { title: string; badge: string; scopes: string[]; desc: string }> = {
    passenger: {
      title: 'Traveler / Passenger',
      badge: 'bg-sky-950 text-sky-400 border-sky-800',
      scopes: ['routes:search', 'itinerary:create', 'booking:simulate', 'ai:advisor'],
      desc: 'Consumer role: access real-time multimodal search, 3D trajectory visualizer, Gemini travel advisor, and digital ticketing.',
    },
    operator: {
      title: 'Carrier & Fleet Operator',
      badge: 'bg-amber-950 text-amber-400 border-amber-800',
      scopes: ['routes:search', 'fleet:telemetry', 'fares:override', 'delays:publish', 'kafka:produce'],
      desc: 'Transport operator role: broadcast vehicle telemetry, adjust route capacity, review weather delays, and emit Kafka travel events.',
    },
    devops_admin: {
      title: 'Cloud Architect & DevOps Admin',
      badge: 'bg-purple-950 text-purple-400 border-purple-800',
      scopes: ['routes:*', 'cluster:k8s:manage', 'redis:flush', 'kafka:admin', 'grafana:apm', 'scraper:selenium:manage'],
      desc: 'Full administrative access: inspect Grafana APM metrics, manage Kubernetes pods, purge Redis L2 cache, and trigger Selenium scraper farms.',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <span>Security Workflows: JWT & OAuth2 RBAC</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
                  HMAC-SHA256
                </span>
              </h3>
              <p className="text-xs text-slate-400">Role-Based Access Control and Token Inspection</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-5 pt-2 bg-slate-950/30">
          {(
            [
              { id: 'token', label: 'Decoded JWT Token' },
              { id: 'roles', label: 'Role Switcher (RBAC)' },
              { id: 'oauth', label: 'OAuth2 Identity Providers' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: Decoded JWT Token */}
          {activeTab === 'token' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Bearer Authorization Token:</span>
                <button
                  onClick={handleCopyToken}
                  className="flex items-center space-x-1 text-sky-400 hover:text-sky-300 transition-colors text-[11px]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Token!' : 'Copy Raw JWT'}</span>
                </button>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400 break-all select-all">
                <span className="text-rose-400">{jwtSession.token.split('.')[0]}</span>.
                <span className="text-purple-400">{jwtSession.token.split('.')[1]}</span>.
                <span className="text-sky-400">{jwtSession.token.split('.')[2]}</span>
              </div>

              {/* Decoded Claims */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                <div className="text-slate-400 font-sans text-[11px] font-semibold uppercase tracking-wider mb-1">
                  Decoded Token Payload Claims
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">sub:</span>{' '}
                    <span className="text-slate-200">{jwtSession.decoded.sub}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">role:</span>{' '}
                    <span className="text-emerald-400 font-bold uppercase">{jwtSession.decoded.role}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">tenant:</span>{' '}
                    <span className="text-slate-300">{jwtSession.decoded.clusterTenant}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">iss:</span>{' '}
                    <span className="text-slate-300">{jwtSession.decoded.iss}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-slate-500 text-[11px]">Granted Scopes:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {jwtSession.decoded.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-400 font-mono"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Roles */}
          {activeTab === 'roles' && (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs">
                Select an active role to switch permission scopes across the platform:
              </p>

              {(['passenger', 'operator', 'devops_admin'] as UserRole[]).map((roleKey) => {
                const info = roleDescriptions[roleKey];
                const isActive = currentRole === roleKey;

                return (
                  <div
                    key={roleKey}
                    onClick={() => onChangeRole(roleKey)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-slate-950 border-sky-500 ring-1 ring-sky-500/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isActive ? 'bg-sky-400 animate-ping' : 'bg-slate-600'
                          }`}
                        />
                        <span className="text-xs font-bold text-slate-100">{info.title}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${info.badge}`}>
                        {isActive ? 'CURRENT ACTIVE ROLE' : 'SWITCH'}
                      </span>
                    </div>

                    <p className="text-slate-400 text-xs mt-2">{info.desc}</p>

                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {info.scopes.map((sc) => (
                        <span key={sc} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                          {sc}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: OAuth2 */}
          {activeTab === 'oauth' && (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs">
                Federated enterprise single sign-on (SSO) integrations:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 font-bold">
                    G
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">Google Workspace</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5 font-mono">Connected</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 font-bold">
                    GH
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">GitHub Enterprise</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5 font-mono">Active (DevOps)</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 font-bold">
                    SSO
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">OIDC / SAML 2.0</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Ready</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                💡 All OAuth2 token exchanges are performed client-side using standard PKCE (Proof Key for Code Exchange) flow with zero server credential leakage.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Current Identity: <span className="text-slate-200 font-mono">{jwtSession.decoded.email}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
