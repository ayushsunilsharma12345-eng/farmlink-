import React, { useState } from 'react';
import { ZERO_COST_BLUEPRINT } from '../data/travelData';
import { CheckCircle2, DollarSign, Layers, Cpu, Server, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export const ZeroCostArchitecture: React.FC = () => {
  const [selectedComponentIndex, setSelectedComponentIndex] = useState(0);
  const activeComp = ZERO_COST_BLUEPRINT[selectedComponentIndex];

  return (
    <div id="zero-cost-architecture-panel" className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <span>$0-Cost Distributed Architecture Blueprint</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold font-mono">
                100% Free Tiers / $0.00 Cost
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Complete engineering design matching AWS/GCP enterprise microservices to zero-cost production alternatives
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-emerald-400 font-mono">
          <span>Enterprise Budget: $0.00 / mo</span>
        </div>
      </div>

      {/* Grid of Components */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-2 md:col-span-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Architectural Modules
          </div>
          {ZERO_COST_BLUEPRINT.map((comp, idx) => (
            <button
              key={comp.component}
              onClick={() => setSelectedComponentIndex(idx)}
              className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                selectedComponentIndex === idx
                  ? 'bg-slate-950 border-sky-500 text-slate-100 ring-1 ring-sky-500/40'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-950/80'
              }`}
            >
              <div className="font-semibold">{comp.component}</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">$0.00 Alternative</div>
            </button>
          ))}
        </div>

        {/* Deep Dive Panel */}
        <div className="md:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60 uppercase font-mono">
                Component Breakdown
              </span>
              <h4 className="text-base font-bold text-slate-100 mt-1">{activeComp.component}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{activeComp.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-rose-400 font-bold block uppercase tracking-wider mb-1">
                Typical Paid Enterprise Stack
              </span>
              <div className="text-slate-200 font-semibold">{activeComp.productionTech}</div>
              <div className="text-[11px] text-slate-500 mt-1">High monthly recurring cloud invoices</div>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-xl border border-emerald-900/40">
              <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider mb-1">
                Zero-Cost Implementation
              </span>
              <div className="text-emerald-300 font-semibold">{activeComp.zeroCostAlternative}</div>
              <div className="text-[11px] text-emerald-400/80 mt-1">$0.00 / month forever within tier</div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block mb-1">Free-Tier Allocation & Hard Limits:</span>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px]">
                {activeComp.freeTierLimits}
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block mb-1">Scaling Threshold (Before Any Cost):</span>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-sky-300 font-mono text-[11px]">
                {activeComp.scalingThreshold}
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block mb-1">Engineering Optimization Strategy:</span>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed text-[11px]">
                {activeComp.operationalStrategy}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* End-to-End Zero-Cost Flow Chart */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
        <div className="font-semibold text-slate-300 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Zero-Cost Request Execution Pipeline</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-[11px] pt-1">
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">1. Client Ingress</span>
            <span className="font-semibold text-sky-400">React + Three.js</span>
            <span className="text-[9px] text-emerald-400 block">$0 Static CDN</span>
          </div>
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">2. Distributed Cache</span>
            <span className="font-semibold text-purple-400">Redis L2 Cache</span>
            <span className="text-[9px] text-emerald-400 block">Sub-1ms Resolution</span>
          </div>
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">3. Async Routing</span>
            <span className="font-semibold text-amber-400">FastAPI Optimizer</span>
            <span className="text-[9px] text-emerald-400 block">Python A* Engine</span>
          </div>
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">4. Event Stream</span>
            <span className="font-semibold text-teal-400">Apache Kafka</span>
            <span className="text-[9px] text-emerald-400 block">Pub/Sub Telemetry</span>
          </div>
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">5. Data Persistence</span>
            <span className="font-semibold text-indigo-400">PostgreSQL + Mongo</span>
            <span className="text-[9px] text-emerald-400 block">Free Cloud Sandboxes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
