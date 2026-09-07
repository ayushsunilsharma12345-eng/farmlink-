import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Activity,
  AlertTriangle,
  Database,
  TrendingUp,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Layers,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { CommodityListing, Order, MandiPrice } from '../types';

interface AdminPortalProps {
  listings: CommodityListing[];
  orders: Order[];
  mandiPrices: MandiPrice[];
  onOpenAiAdvisor: (prompt?: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  listings,
  orders,
  mandiPrices,
  onOpenAiAdvisor,
}) => {
  const [telemetryLag, setTelemetryLag] = useState(0);
  const [hitRate, setHitRate] = useState(99.4);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshMetrics = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTelemetryLag(Math.floor(Math.random() * 3));
      setHitRate(Math.round((99.1 + Math.random() * 0.8) * 10) / 10);
      setIsRefreshing(false);
    }, 400);
  };

  const totalGMV = orders.reduce((sum, ord) => sum + ord.totalAmount, 0) + 1480000;
  const totalVolumeKg = listings.reduce((sum, l) => sum + l.quantityKg, 0) + orders.reduce((sum, ord) => sum + ord.quantityKg, 0);

  return (
    <div className="space-y-6">
      {/* Top Admin KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Gross Merchandise Value (GMV)</span>
          <span className="font-mono text-2xl font-extrabold text-slate-900 mt-1 block">
            ₹{(totalGMV / 100000).toFixed(2)} Lakh
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% MoM
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Total Volume Traded</span>
          <span className="font-mono text-2xl font-extrabold text-slate-900 mt-1 block">
            {(totalVolumeKg / 1000).toFixed(1)} Tonnes
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Onion, Tomato, Wheat, Soybean
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Active Marketplace Lots</span>
          <span className="font-mono text-2xl font-extrabold text-slate-900 mt-1 block">
            {listings.length} Lots
          </span>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">
            100% Quality Inspected
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Active Escrow Contracts</span>
          <span className="font-mono text-2xl font-extrabold text-slate-900 mt-1 block">
            {orders.length} Dispatches
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            Zero Payment Default Rate
          </span>
        </div>
      </div>

      {/* System Observability & Telemetry */}
      <div className="bg-[#0F172A] text-white rounded-xl p-6 border border-slate-800 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white">
                Stage 1 SRE & Architecture Observability Telemetry
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulated Prometheus, Grafana, OpenTelemetry, and Kafka Consumer Group health metrics.
            </p>
          </div>
          <button
            onClick={handleRefreshMetrics}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors self-start sm:self-center"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Poll Health</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-900/90 p-3.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px] block font-sans">API Gateway P99 Latency</span>
            <span className="text-xl font-bold text-emerald-400 mt-1 block">38 ms</span>
            <span className="text-[10px] text-slate-400 font-sans">Go / Express Monolith</span>
          </div>

          <div className="bg-slate-900/90 p-3.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px] block font-sans">Kafka Consumer Lag</span>
            <span className="text-xl font-bold text-emerald-400 mt-1 block">{telemetryLag} messages</span>
            <span className="text-[10px] text-slate-400 font-sans">ORDER_CREATED topic</span>
          </div>

          <div className="bg-slate-900/90 p-3.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px] block font-sans">Aerospike CE Cache Hit Rate</span>
            <span className="text-xl font-bold text-emerald-400 mt-1 block">{hitRate}%</span>
            <span className="text-[10px] text-slate-400 font-sans">Current Mandi Price Index</span>
          </div>

          <div className="bg-slate-900/90 p-3.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px] block font-sans">PostgreSQL Connections</span>
            <span className="text-xl font-bold text-blue-400 mt-1 block">18 / 100</span>
            <span className="text-[10px] text-slate-400 font-sans">ACID Pool Healthy</span>
          </div>
        </div>
      </div>

      {/* Fraud & Anomaly Detection Panel */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">
              Automated Anomaly & Fraud Monitoring Engine
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 font-mono">
            ALL SYSTEMS NORMAL
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
            <div>
              <span className="font-bold text-slate-900 block">Mandi Rate Spread Audit</span>
              <p className="text-slate-600 mt-0.5">
                FreshMart offer of ₹29/kg is within valid bounds for Lasalgaon Red Onion (Modal rate ₹32/kg, range ₹24-34/kg). No bid-rigging detected.
              </p>
            </div>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0 border border-emerald-200">
              Verified Legitimate
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
            <div>
              <span className="font-bold text-slate-900 block">KYC & Aadhaar Farmgate Geofence Check</span>
              <p className="text-slate-600 mt-0.5">
                Farmer Ayush Sharma land coordinates match Lasalgaon agricultural revenue circle. Zero landholding conflicts detected.
              </p>
            </div>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0 border border-emerald-200">
              Verified Land
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
