import React, { useState } from 'react';
import { RouteOption, RouteStep, TravelMode, CityHub, PreferenceFilter } from '../types';
import {
  Plane,
  Train,
  Bus,
  Car,
  Compass,
  Clock,
  DollarSign,
  Leaf,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Share2,
  QrCode,
  Ticket,
} from 'lucide-react';

interface MultimodalComparisonProps {
  routes: RouteOption[];
  selectedRoute: RouteOption | null;
  onSelectRoute: (route: RouteOption) => void;
  preference: PreferenceFilter;
  onSelectPreference: (pref: PreferenceFilter) => void;
  onSimulateBooking: (route: RouteOption) => void;
}

export const MultimodalComparison: React.FC<MultimodalComparisonProps> = ({
  routes,
  selectedRoute,
  onSelectRoute,
  preference,
  onSelectPreference,
  onSimulateBooking,
}) => {
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);

  // Filter routes based on preference
  const filteredRoutes = [...routes].sort((a, b) => {
    if (preference === 'cheapest') return a.priceUSD - b.priceUSD;
    if (preference === 'fastest') return a.durationMinutes - b.durationMinutes;
    if (preference === 'eco') return a.co2Kg - b.co2Kg;
    if (preference === 'reliable') return b.reliabilityScore - a.reliabilityScore;
    return 0;
  });

  const getModeIcon = (mode: TravelMode, className = 'w-5 h-5') => {
    switch (mode) {
      case 'flight':
        return <Plane className={className} />;
      case 'train':
        return <Train className={className} />;
      case 'bus':
        return <Bus className={className} />;
      case 'taxi':
        return <Car className={className} />;
      case 'metro':
        return <Compass className={className} />;
      case 'multimodal':
        return <Zap className={className} />;
    }
  };

  const getModeBadgeColor = (mode: TravelMode) => {
    switch (mode) {
      case 'flight':
        return 'bg-sky-950/70 text-sky-400 border-sky-800/60';
      case 'train':
        return 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60';
      case 'bus':
        return 'bg-amber-950/70 text-amber-400 border-amber-800/60';
      case 'taxi':
        return 'bg-cyan-950/70 text-cyan-400 border-cyan-800/60';
      case 'multimodal':
        return 'bg-purple-950/70 text-purple-400 border-purple-800/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const formatHoursMins = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins}m`;
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${mins}m`;
  };

  return (
    <div id="multimodal-comparison-section" className="space-y-4">
      {/* Preference Filter Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Optimization Goal:
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: 'all', label: 'All Modes' },
              { id: 'fastest', label: '⚡ Fastest ETA' },
              { id: 'cheapest', label: '💰 Lowest Cost' },
              { id: 'eco', label: '🌱 Eco-Greenest' },
              { id: 'reliable', label: '🛡️ Highest Reliability' },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              id={`filter-pref-${filter.id}`}
              onClick={() => onSelectPreference(filter.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                preference === filter.id
                  ? 'bg-sky-500 text-slate-950 font-semibold shadow-md shadow-sky-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Routes Matrix List */}
      <div className="space-y-3.5">
        {filteredRoutes.map((route) => {
          const isSelected = selectedRoute?.id === route.id;
          const isExpanded = expandedRouteId === route.id;

          return (
            <div
              key={route.id}
              id={`route-card-${route.id}`}
              onClick={() => onSelectRoute(route)}
              className={`cursor-pointer rounded-2xl border transition-all p-5 ${
                isSelected
                  ? 'bg-slate-900 border-sky-500/80 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/40'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              {/* Header row with tags and compute metadata */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getModeBadgeColor(
                      route.mode
                    )}`}
                  >
                    {getModeIcon(route.mode, 'w-3.5 h-3.5')}
                    <span className="capitalize">{route.mode}</span>
                  </span>

                  {route.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                        tag === 'Fastest'
                          ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/60'
                          : tag === 'Cheapest'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                          : tag === 'Eco-Choice'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                          : 'bg-sky-950 text-sky-300 border border-sky-800/60'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <span className="font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                    {route.cachedInRedis ? '⚡ Redis L2 Hit' : '⚙️ FastAPI A*'} ({route.computeLatencyMs}ms)
                  </span>
                </div>
              </div>

              {/* Core Route Specs: Times, Duration, Price, Emissions */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Time & Hubs */}
                <div className="md:col-span-2 flex items-center space-x-4">
                  <div>
                    <div className="text-xl font-bold text-slate-100">{route.departureTime}</div>
                    <div className="text-xs text-slate-400 font-medium">
                      {route.origin.code} ({route.origin.city})
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center px-2">
                    <span className="text-xs text-slate-400 font-mono mb-1">
                      {formatHoursMins(route.durationMinutes)}
                    </span>
                    <div className="relative w-full flex items-center">
                      <div className="w-2 h-2 rounded-full bg-slate-600" />
                      <div className="flex-1 h-0.5 bg-slate-700 mx-1" />
                      {route.transferCount > 0 && (
                        <div className="w-2 h-2 rounded-full bg-amber-400" title={`${route.transferCount} transfers`} />
                      )}
                      <div className="flex-1 h-0.5 bg-slate-700 mx-1" />
                      <div className="w-2 h-2 rounded-full bg-sky-400" />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">
                      {route.transferCount === 0 ? 'Direct • No transfers' : `${route.transferCount} intermodal transfer${route.transferCount > 1 ? 's' : ''}`}
                    </span>
                  </div>

                  <div>
                    <div className="text-xl font-bold text-slate-100">{route.arrivalTime}</div>
                    <div className="text-xs text-slate-400 font-medium">
                      {route.destination.code} ({route.destination.city})
                    </div>
                  </div>
                </div>

                {/* Reliability & Green Footprint */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Reliability</span>
                    </span>
                    <span className="font-semibold text-emerald-400">{route.reliabilityScore}%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Leaf className="w-3.5 h-3.5 text-teal-400" />
                      <span>Carbon (CO₂)</span>
                    </span>
                    <span className="font-mono text-slate-200">{route.co2Kg} kg</span>
                  </div>

                  {route.carbonSavingsPercentVsFlight && (
                    <div className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                      🌱 Saves {route.carbonSavingsPercentVsFlight}% CO₂ vs air travel
                    </div>
                  )}
                </div>

                {/* Price & Action Button */}
                <div className="flex md:flex-col items-center md:items-end justify-between gap-2">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-sky-400 font-mono">
                      ${route.priceUSD}
                    </div>
                    <div className="text-[11px] text-slate-400">Total All-Inclusive</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      id={`btn-expand-steps-${route.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedRouteId(isExpanded ? null : route.id);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs flex items-center space-x-1 border border-slate-700"
                    >
                      <span>Steps</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      id={`btn-book-ticket-${route.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSimulateBooking(route);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-sky-500/20 transition-transform active:scale-95"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Simulate Ticket</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Provider Summary */}
              <div className="mt-3 pt-3 border-t border-slate-800/70 flex flex-wrap items-center justify-between text-xs text-slate-400">
                <div>
                  <span className="text-slate-400">Operator: </span>
                  <span className="text-slate-300 font-medium">{route.providerSummary}</span>
                </div>
                {route.delayRiskPercent > 10 && (
                  <div className="flex items-center space-x-1 text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{route.delayRiskPercent}% weather / slot delay probability</span>
                  </div>
                )}
              </div>

              {/* Step-by-Step Multimodal Breakdown (Accordion) */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-2">
                    <span>Multimodal Journey Legs & Transfer Checkpoints</span>
                  </div>

                  {route.steps.map((step, idx) => (
                    <div key={step.id} className="relative pl-6 pb-4 last:pb-0 border-l-2 border-slate-700 last:border-transparent">
                      {/* Circle indicator */}
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-sky-400 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      </div>

                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold text-slate-200">
                              Leg {idx + 1}: {step.provider}
                            </span>
                            {step.vehicleNumber && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 font-mono">
                                #{step.vehicleNumber}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {step.fromName} → {step.toName}
                          </div>
                          {step.notes && (
                            <div className="text-[11px] text-slate-400 mt-1 italic">
                              💡 {step.notes}
                            </div>
                          )}
                        </div>

                        <div className="text-right text-xs">
                          <div className="font-medium text-slate-200">
                            {step.departureTime} - {step.arrivalTime}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {step.durationMinutes}m • {step.distanceKm} km • ${step.costUSD}
                          </div>
                        </div>
                      </div>

                      {step.transferBufferMinutes && (
                        <div className="mt-2 inline-flex items-center space-x-1.5 text-[10px] px-2.5 py-1 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40">
                          <Clock className="w-3 h-3" />
                          <span>{step.transferBufferMinutes} min transfer buffer for luggage & security screening</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
