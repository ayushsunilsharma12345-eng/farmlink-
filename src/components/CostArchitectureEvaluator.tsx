import React, { useState } from 'react';
import {
  Calculator,
  Server,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Users,
  Calendar,
  Cpu,
  Database,
  ArrowRight,
  TrendingDown,
  DollarSign,
  Sparkles,
  Zap,
  ShieldAlert,
  ChevronRight,
  Download,
} from 'lucide-react';
import { architectureStages, teamCostBreakdown } from '../data/mockData';

export const CostArchitectureEvaluator: React.FC = () => {
  const [selectedStageNumber, setSelectedStageNumber] = useState(1);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Interactive Custom Cost Simulator state
  const [simScale, setSimScale] = useState<'prototype' | 'mvp' | 'growth' | 'enterprise'>('prototype');
  const [useManagedKafka, setUseManagedKafka] = useState(false);
  const [useAerospikeCloud, setUseAerospikeCloud] = useState(false);
  const [useManagedPostgres, setUseManagedPostgres] = useState(false);
  const [useEks, setUseEks] = useState(false);
  const [useGpuAi, setUseGpuAi] = useState(false);
  const [useClickhouse, setUseClickhouse] = useState(false);

  // Calculate live simulated infrastructure cost
  const calculateSimCost = () => {
    let monthlyUsd = 0;
    if (simScale === 'prototype') {
      // Stage 1: ₹0 Local
      return { usd: 0, inr: 0, label: '₹0 (100% Free / Open Source)' };
    }

    if (simScale === 'mvp') {
      monthlyUsd += 25; // compute base
      monthlyUsd += useManagedPostgres ? 35 : 10;
      monthlyUsd += useManagedKafka ? 607 : 20; // MSK vs EC2
      monthlyUsd += useAerospikeCloud ? 450 : 15;
      monthlyUsd += useGpuAi ? 150 : 0;
      monthlyUsd += useClickhouse ? 120 : 0;
      monthlyUsd += useEks ? 180 : 0;
    } else if (simScale === 'growth') {
      monthlyUsd += 180;
      monthlyUsd += useManagedPostgres ? 180 : 40;
      monthlyUsd += useManagedKafka ? 607 : 80;
      monthlyUsd += useAerospikeCloud ? 800 : 50;
      monthlyUsd += useGpuAi ? 450 : 30;
      monthlyUsd += useClickhouse ? 280 : 0;
      monthlyUsd += useEks ? 350 : 40;
    } else {
      // Enterprise scale
      monthlyUsd += 650;
      monthlyUsd += useManagedPostgres ? 450 : 120;
      monthlyUsd += useManagedKafka ? 1200 : 250;
      monthlyUsd += useAerospikeCloud ? 2160 : 200;
      monthlyUsd += useGpuAi ? 1200 : 150;
      monthlyUsd += useClickhouse ? 600 : 100;
      monthlyUsd += useEks ? 850 : 200;
    }

    const inr = Math.round(monthlyUsd * 87);
    return {
      usd: monthlyUsd,
      inr,
      label: `₹${inr.toLocaleString()} / month ($${monthlyUsd.toLocaleString()}/mo)`,
    };
  };

  const simResult = calculateSimCost();
  const currentStage = architectureStages.find((s) => s.stageNumber === selectedStageNumber) || architectureStages[0];

  const totalTeamMonthlyInr = teamCostBreakdown.reduce((sum, item) => sum + item.avgMonthlyCostInr * item.count, 0);

  return (
    <div className="space-y-6">
      {/* Hero: The Stage 1 ₹0 Architecture Thesis with Professional Polish dark slate styling */}
      <div className="bg-[#0F172A] text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Ayush Sharma's Architectural Blueprint (Part 2)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              FarmLink Evaluation at ₹0 Cost
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              "If we treat FarmLink as a real product that starts from zero and eventually becomes a production-grade platform, the biggest mistake would be trying to build the entire architecture at once. In <strong>Stage 1</strong>, we build the entire application locally using <strong>Docker, Local PostgreSQL, Local Kafka, Aerospike Community Edition ($0), and Local ML</strong>. Total software cost: <strong>₹0</strong>."
            </p>
          </div>

          {/* Project Health & $0.00 Metric Card (Direct Professional Polish Pattern) */}
          <div className="bg-slate-800/90 rounded-xl shadow-md p-5 text-white min-w-[250px] border border-slate-700 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase text-slate-400">Project Health</h3>
              <span className="text-[10px] bg-blue-900/60 text-blue-200 border border-blue-700/60 px-2 py-0.5 rounded font-mono font-bold">
                OPTIMIZED
              </span>
            </div>
            <p className="text-2xl font-bold font-mono">99.98%</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Uptime during current billing cycle</p>
            <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
              <span className="text-xs text-slate-400">Current Cost</span>
              <span className="text-xl font-mono text-emerald-400 font-bold">$0.00 / ₹0</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Stage Phased Roadmap Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>The 6 Phased Architecture Stages</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any stage to inspect stack choices, monthly expense profile, pros, and operational trade-offs.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-center">
            {architectureStages.length} Stages Evaluated
          </span>
        </div>

        {/* Stage Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {architectureStages.map((stage) => {
            const isSelected = stage.stageNumber === selectedStageNumber;
            const isStage1 = stage.stageNumber === 1;
            return (
              <button
                key={stage.stageNumber}
                onClick={() => setSelectedStageNumber(stage.stageNumber)}
                className={`p-3 rounded-lg text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0F172A] text-white border-slate-800 shadow-sm ring-2 ring-blue-500/30'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                    isSelected ? 'text-blue-400' : 'text-slate-400'
                  }`}>
                    Stage {stage.stageNumber}
                  </span>
                  <p className="font-bold text-xs mt-0.5 line-clamp-1">
                    {stage.name.split('—')[1] || stage.name}
                  </p>
                </div>
                <span className={`text-[11px] font-mono font-semibold mt-2 ${
                  isSelected ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  {stage.costLabel.split('(')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Panel */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{currentStage.name}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                  {currentStage.timeEstimate}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">{currentStage.description}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Scale: <strong className="text-slate-700">{currentStage.targetUsers}</strong>
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-right shrink-0">
              <span className="text-[11px] text-slate-400 block font-medium">Estimated Monthly Cloud Bill</span>
              <span className="font-mono text-base font-bold text-emerald-600">{currentStage.costLabel}</span>
            </div>
          </div>

          {/* Component Stack Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Core Tech Stack & Cost Attribution
              </h4>
              <span className="text-xs text-blue-600 font-medium">Stage {currentStage.stageNumber} Blueprint</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/50 text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Architecture Layer</th>
                    <th className="px-4 py-2.5 font-semibold">Selected Technology</th>
                    <th className="px-4 py-2.5 font-semibold">Purpose & Rationale</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Cost Component</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentStage.stack.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 font-semibold text-slate-800">{item.category}</td>
                      <td className="px-4 py-3 font-mono text-slate-900 font-medium">{item.technology}</td>
                      <td className="px-4 py-3 text-slate-600">{item.purpose}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">
                        {item.costInRupees}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pros & Caveats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 text-xs space-y-2">
              <h5 className="font-bold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Advantages of this Stage</span>
              </h5>
              <ul className="space-y-1 text-emerald-900/90 list-disc pl-4">
                {currentStage.pros.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs space-y-2">
              <h5 className="font-bold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Operational Caveats & Watchouts</span>
              </h5>
              <ul className="space-y-1 text-amber-900/90 list-disc pl-4">
                {currentStage.caveats.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Deep-Dive: Why Specific Technologies Were Chosen */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            <span>Why Each Component Matters (Architecture Deep-Dive)</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Doc Sections 8-12</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-900 text-sm">1. PostgreSQL</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-mono font-bold">₹0 Docker</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Why ACID matters:</strong> Orders involve transactions and escrow. You can never risk an orphaned state where payment succeeds but order creation failed, or quantities mismatch across records.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-900 text-sm">2. Apache Kafka</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-mono font-bold">₹0 Docker</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Why Event-Driven:</strong> Decouples order service from notifications, analytics, ML ingestion, and fraud scoring. Avoid AWS MSK ($607/mo) in Stage 1; use Docker Kafka locally!
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-900 text-sm">3. Aerospike (CE)</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-mono font-bold">₹0 Free Tier</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Sub-ms Mandi Price Cache:</strong> When 100,000 farmers check current prices at 9:00 AM, requests hit Aerospike in memory, protecting PostgreSQL from collapsing.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-900 text-sm">4. ScyllaDB</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-mono font-bold">₹0 Docker</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Massive Time-Series:</strong> Historical price ticks grow into billions of rows. ScyllaDB partitions cleanly across market, commodity, and timestamp without slow relational table scans.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-900 text-sm">5. PostGIS + OpenSearch</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-mono font-bold">₹0 OpenSource</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Geospatial Querying:</strong> Answers: <em>"Show me all onion sellers within 100 km who have more than 1,000 kg"</em> with high-speed spatial indexing.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-900 text-sm">6. XGBoost / Python ML</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-mono font-bold">₹0 CPU Engine</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Pragmatic AI:</strong> As the document emphasizes: <em>"Start with XGBoost rather than immediately using a huge neural network."</em> Don't train complex models before having clean data.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Infrastructure Cost Simulator */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <span>Interactive Deployment Cost Calculator</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Toggle deployment scale and managed cloud services to evaluate exact monthly infrastructure budgets.
            </p>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold border border-slate-200">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-2.5 py-1 rounded-md transition-all ${currency === 'INR' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-md transition-all ${currency === 'USD' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              $ USD
            </button>
          </div>
        </div>

        {/* Scale Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Target Deployment Scale
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <button
              onClick={() => setSimScale('prototype')}
              className={`p-3 rounded-lg border text-left transition-all ${
                simScale === 'prototype'
                  ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <strong className="block font-bold">Stage 1 (Local Dev)</strong>
              <span className="text-[11px] text-slate-500">1–50 Users · $0.00 / ₹0</span>
            </button>

            <button
              onClick={() => setSimScale('mvp')}
              className={`p-3 rounded-lg border text-left transition-all ${
                simScale === 'mvp'
                  ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <strong className="block font-bold">Stage 2 (Cheap Cloud)</strong>
              <span className="text-[11px] text-slate-500">1k–10k Users · 1 Region</span>
            </button>

            <button
              onClick={() => setSimScale('growth')}
              className={`p-3 rounded-lg border text-left transition-all ${
                simScale === 'growth'
                  ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <strong className="block font-bold">Stage 3-4 (Realtime/OLAP)</strong>
              <span className="text-[11px] text-slate-500">50k Users · Multi-broker</span>
            </button>

            <button
              onClick={() => setSimScale('enterprise')}
              className={`p-3 rounded-lg border text-left transition-all ${
                simScale === 'enterprise'
                  ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <strong className="block font-bold">Stage 6 (Full Production)</strong>
              <span className="text-[11px] text-slate-500">100k–1M+ Users · EKS HA</span>
            </button>
          </div>
        </div>

        {/* Managed Component Toggles */}
        {simScale !== 'prototype' && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Managed Services vs Self-Hosted Configuration
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <label className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={useManagedKafka}
                  onChange={(e) => setUseManagedKafka(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">Amazon MSK (Kafka)</span>
                  <span className="text-[11px] text-slate-500">+$607/mo (vs self-managed EC2)</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={useAerospikeCloud}
                  onChange={(e) => setUseAerospikeCloud(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">Aerospike Cloud / Enterprise</span>
                  <span className="text-[11px] text-slate-500">+$450-$800/mo (vs Community Ed.)</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={useManagedPostgres}
                  onChange={(e) => setUseManagedPostgres(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">AWS RDS Multi-AZ Postgres</span>
                  <span className="text-[11px] text-slate-500">+$35-$180/mo (vs EC2/Docker)</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={useEks}
                  onChange={(e) => setUseEks(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">Kubernetes (AWS EKS)</span>
                  <span className="text-[11px] text-slate-500">$73/mo control plane + workers</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={useGpuAi}
                  onChange={(e) => setUseGpuAi(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">Dedicated GPU for AI/ML</span>
                  <span className="text-[11px] text-slate-500">+$150-$450/mo (vs CPU inference)</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={useClickhouse}
                  onChange={(e) => setUseClickhouse(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">ClickHouse Cloud Analytics</span>
                  <span className="text-[11px] text-slate-500">+$120-$280/mo</span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Live Calculation Output Card (Professional Polish Dark Slate) */}
        <div className="bg-[#0F172A] text-white p-5 sm:p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 shadow-md">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">
              Calculated Monthly Accrual
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono text-3xl font-extrabold text-emerald-400">
                {currency === 'INR' ? `₹${simResult.inr.toLocaleString()}` : `$${simResult.usd.toLocaleString()}`}
              </span>
              <span className="text-xs text-slate-400">
                {currency === 'INR' ? `(~$${simResult.usd.toLocaleString()} USD)` : `(~₹${simResult.inr.toLocaleString()} INR)`} / month
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {simScale === 'prototype'
                ? 'Stage 1 — Zero Cloud Infrastructure cost. Everything runs in local Docker containers.'
                : 'AWS/Cloud bill estimated based on current service pricing models.'}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/30 font-mono">
              {simScale === 'prototype' ? 'STAGE 1: 0 COST' : 'CLOUD ESTIMATE'}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION: Team Cost vs Infrastructure Cost */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              The Real Cost Driver: Engineering Team vs Cloud (Section 47)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            "This is actually much larger than cloud cost. Even a relatively inexpensive Indian engineering team of 8 people costs substantially more than the infrastructure. <strong>People are the largest cost, not AWS.</strong>"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team Roles Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Professional 8-Person Engineering Team
            </h3>
            <div className="space-y-2 text-xs">
              {teamCostBreakdown.map((member, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <div>
                    <span className="font-bold text-slate-900">
                      {member.count}× {member.role}
                    </span>
                    <p className="text-[11px] text-slate-500">{member.description}</p>
                  </div>
                  <span className="font-mono font-bold text-slate-800 text-sm shrink-0 ml-2">
                    ₹{(member.avgMonthlyCostInr * member.count).toLocaleString()}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Card */}
          <div className="flex flex-col justify-between bg-slate-50 p-6 rounded-xl border border-slate-200 text-xs space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded">
                Monthly Burn Breakdown
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-2">
                Engineering Team vs Cloud Infrastructure
              </h4>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Stark economic comparison from Section 47:
              </p>

              <div className="mt-4 space-y-2.5 font-mono">
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center shadow-2xs">
                  <span className="text-slate-600 font-sans text-xs">8-Person Engineering Team:</span>
                  <span className="text-sm font-extrabold text-slate-900">
                    ₹{totalTeamMonthlyInr.toLocaleString()}/mo (~$13.5k)
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center shadow-2xs">
                  <span className="text-slate-600 font-sans text-xs">Stage 1 Infrastructure:</span>
                  <span className="text-sm font-extrabold text-emerald-600">
                    $0.00 / ₹0 / month
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center shadow-2xs">
                  <span className="text-slate-600 font-sans text-xs">Stage 2 MVP Cloud:</span>
                  <span className="text-sm font-extrabold text-blue-600">
                    ₹9,000–₹36,000/mo (~$100-$400)
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-500 italic">
              Key Takeaway from Ayush Sharma's Document: Keep infrastructure at ₹0 locally in Stage 1 and lean in Stage 2. Focus engineering hours on marketplace matching and transactional reliability, not rented servers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
