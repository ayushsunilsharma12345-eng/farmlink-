import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { ThreeGlobeVisualizer } from './components/ThreeGlobeVisualizer';
import { MultimodalComparison } from './components/MultimodalComparison';
import { AiTravelAdvisor } from './components/AiTravelAdvisor';
import { GrafanaObservability } from './components/GrafanaObservability';
import { SeleniumScraperView } from './components/SeleniumScraperView';
import { ZeroCostArchitecture } from './components/ZeroCostArchitecture';
import { AuthRbacModal } from './components/AuthRbacModal';
import { TicketBookingModal } from './components/TicketBookingModal';
import { GLOBAL_HUBS, MOCK_MICROSERVICES, KAFKA_TOPICS, REDIS_STATS, SELENIUM_TASKS } from './data/travelData';
import { CityHub, RouteOption, PreferenceFilter, UserRole, JWTSession, MicroserviceNode } from './types';
import { generateRoutes } from './utils/routeOptimizer';
import { ArrowLeftRight, Calendar, Users, Zap, Shield, Sparkles, Activity, CheckCircle2, Bot, DollarSign } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'optimizer' | 'advisor' | 'grafana' | 'scraper' | 'architecture'>('optimizer');

  // Route Planning State
  const [origin, setOrigin] = useState<CityHub>(GLOBAL_HUBS[0]); // London
  const [destination, setDestination] = useState<CityHub>(GLOBAL_HUBS[1]); // Paris
  const [preference, setPreference] = useState<PreferenceFilter>('all');
  const [departureDate, setDepartureDate] = useState<string>('2026-09-15');
  const [passengers, setPassengers] = useState<number>(1);

  // Compute Routes
  const routes = useMemo(() => {
    return generateRoutes(origin, destination);
  }, [origin, destination]);

  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);

  useEffect(() => {
    if (routes.length > 0) {
      setSelectedRoute(routes[0]);
    }
  }, [routes]);

  // Auth & RBAC State
  const [userRole, setUserRole] = useState<UserRole>('passenger');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [jwtSession, setJwtSession] = useState<JWTSession>({
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3Jfb21uaV83ODQ5MTIiLCJlbWFpbCI6ImF5dXNoc3VuaWxzaGFybWExMjM0NUBnbWFpbC5jb20iLCJuYW1lIjoiQXl1c2ggU2hhcm1hIiwicm9sZSI6InBhc3NlbmdlciIsInNjb3BlcyI6WyJyb3V0ZXM6c2VhcmNoIiwiaXRpbmVyYXJ5OmNyZWF0ZSIsImJvb2tpbmc6c2ltdWxhdGUiLCJhaTphZHZpc29yIl0sImlhdCI6MTcyNTY5NjE2MCwiZXhwIjoxNzI1NzgyNTYwLCJpc3MiOiJodHRwczovL2F1dGgub21uaXZveWFnZS5haSIsImNsdXN0ZXJUZW5hbnQiOiJhc2lhLXNvdXRoZWFzdDEtazhzLWZyZWUifQ.simulated_hmac_sha256_signature_secret_free_tier',
    decoded: {
      sub: 'usr_omni_784912',
      email: 'ayushsunilsharma12345@gmail.com',
      name: 'Ayush Sharma',
      role: 'passenger',
      scopes: ['routes:search', 'itinerary:create', 'booking:simulate', 'ai:advisor'],
      iat: 1725696160,
      exp: 1725782560,
      iss: 'https://auth.omnivoyage.ai',
      clusterTenant: 'asia-southeast1-k8s-free',
    },
    isValid: true,
  });

  // Booking Modal State
  const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
  const [routeToBook, setRouteToBook] = useState<RouteOption | null>(null);

  // Microservices & Telemetry State
  const [microservices, setMicroservices] = useState<MicroserviceNode[]>(MOCK_MICROSERVICES);
  const [isSimulatingLoad, setIsSimulatingLoad] = useState<boolean>(false);
  const [isScraping, setIsScraping] = useState<boolean>(false);

  // Quick Hub Switcher
  const handleSwapHubs = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  // Switch Role
  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    setJwtSession((prev) => ({
      ...prev,
      decoded: {
        ...prev.decoded,
        role: newRole,
        scopes:
          newRole === 'devops_admin'
            ? ['routes:*', 'cluster:k8s:manage', 'redis:flush', 'kafka:admin', 'grafana:apm', 'scraper:selenium:manage']
            : newRole === 'operator'
            ? ['routes:search', 'fleet:telemetry', 'fares:override', 'delays:publish', 'kafka:produce']
            : ['routes:search', 'itinerary:create', 'booking:simulate', 'ai:advisor'],
      },
    }));
  };

  // Simulate Traffic Spike for Grafana
  const handleSimulateSpike = async () => {
    setIsSimulatingLoad(true);
    try {
      await fetch('/api/routes/simulate-load', { method: 'POST' });
    } catch (e) {
      console.warn('Simulation fallback');
    }
    setTimeout(() => {
      setIsSimulatingLoad(false);
    }, 4500);
  };

  // Trigger Selenium Web Sweep
  const handleTriggerScrape = () => {
    setIsScraping(true);
    setTimeout(() => {
      setIsScraping(false);
    }, 3800);
  };

  const handleOpenBooking = (route: RouteOption) => {
    setRouteToBook(route);
    setShowTicketModal(true);
  };

  const popularPairs: [string, string][] = [
    ['LON', 'PAR'],
    ['NYC', 'BOS'],
    ['TYO', 'OSA'],
    ['FRA', 'ZUR'],
    ['DEL', 'BOM'],
    ['SFO', 'LAX'],
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        userRole={userRole}
        onOpenAuthModal={() => setShowAuthModal(true)}
        jwtSession={jwtSession}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner / Hub Selector Bar */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Multimodal Hub Corridor:
              </span>
            </div>

            {/* Quick Pairs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 text-[11px] mr-1 hidden sm:inline">Popular Corridors:</span>
              {popularPairs.map(([origCode, destCode]) => {
                const oHub = GLOBAL_HUBS.find((h) => h.code === origCode);
                const dHub = GLOBAL_HUBS.find((h) => h.code === destCode);
                if (!oHub || !dHub) return null;
                const isActive = origin.code === origCode && destination.code === destCode;

                return (
                  <button
                    key={`${origCode}-${destCode}`}
                    onClick={() => {
                      setOrigin(oHub);
                      setDestination(dHub);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                      isActive
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                    }`}
                  >
                    {origCode} ↔ {destCode}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hub Selection Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Origin Dropdown */}
            <div className="md:col-span-5 bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-center">
              <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Departure Hub (Origin)
              </label>
              <select
                id="select-origin-hub"
                value={origin.id}
                onChange={(e) => {
                  const selected = GLOBAL_HUBS.find((h) => h.id === e.target.value);
                  if (selected && selected.id !== destination.id) setOrigin(selected);
                }}
                className="bg-transparent text-sm font-bold text-slate-100 focus:outline-none cursor-pointer mt-1"
              >
                {GLOBAL_HUBS.map((hub) => (
                  <option key={hub.id} value={hub.id} disabled={hub.id === destination.id} className="bg-slate-900 text-slate-100">
                    {hub.name} ({hub.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-2 flex justify-center">
              <button
                id="btn-swap-hubs"
                onClick={handleSwapHubs}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-transform active:scale-90"
                title="Swap Departure & Arrival"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* Destination Dropdown */}
            <div className="md:col-span-5 bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-center">
              <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Arrival Hub (Destination)
              </label>
              <select
                id="select-destination-hub"
                value={destination.id}
                onChange={(e) => {
                  const selected = GLOBAL_HUBS.find((h) => h.id === e.target.value);
                  if (selected && selected.id !== origin.id) setDestination(selected);
                }}
                className="bg-transparent text-sm font-bold text-slate-100 focus:outline-none cursor-pointer mt-1"
              >
                {GLOBAL_HUBS.map((hub) => (
                  <option key={hub.id} value={hub.id} disabled={hub.id === origin.id} className="bg-slate-900 text-slate-100">
                    {hub.name} ({hub.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* TAB 1: Multimodal 3D Engine & Comparison */}
        {activeTab === 'optimizer' && (
          <div className="space-y-6">
            {/* 3D Three.js Globe Visualizer */}
            <ThreeGlobeVisualizer
              selectedRoute={selectedRoute}
              origin={origin}
              destination={destination}
              allHubs={GLOBAL_HUBS}
            />

            {/* Multimodal Comparison Matrix */}
            <MultimodalComparison
              routes={routes}
              selectedRoute={selectedRoute}
              onSelectRoute={setSelectedRoute}
              preference={preference}
              onSelectPreference={setPreference}
              onSimulateBooking={handleOpenBooking}
            />
          </div>
        )}

        {/* TAB 2: AI Travel Advisor (Gemini 3.8 Flash) */}
        {activeTab === 'advisor' && (
          <div className="space-y-6">
            <AiTravelAdvisor
              selectedRoute={selectedRoute}
              origin={origin}
              destination={destination}
            />

            {/* Complementary Multimodal Matrix preview */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Active Corridor Routes Evaluated by AI:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {routes.map((rt) => (
                  <div
                    key={rt.id}
                    onClick={() => setSelectedRoute(rt)}
                    className={`cursor-pointer p-3 rounded-xl border text-xs transition-all ${
                      selectedRoute?.id === rt.id
                        ? 'bg-slate-900 border-sky-500'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-200 capitalize">
                      <span>{rt.mode}</span>
                      <span className="text-sky-400 font-mono">${rt.priceUSD}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {rt.durationMinutes} min • {rt.co2Kg}kg CO₂
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Grafana APM & Distributed Microservices */}
        {activeTab === 'grafana' && (
          <GrafanaObservability
            microservices={microservices}
            kafkaTopics={KAFKA_TOPICS}
            redisStats={REDIS_STATS}
            onSimulateSpike={handleSimulateSpike}
            isSimulatingLoad={isSimulatingLoad}
          />
        )}

        {/* TAB 4: Selenium Scraper Farm */}
        {activeTab === 'scraper' && (
          <SeleniumScraperView
            tasks={SELENIUM_TASKS}
            onTriggerScrape={handleTriggerScrape}
            isScraping={isScraping}
          />
        )}

        {/* TAB 5: $0-Cost Distributed Architecture Blueprint */}
        {activeTab === 'architecture' && (
          <ZeroCostArchitecture />
        )}
      </main>

      {/* Footer Status Bar with Live Telemetry */}
      <footer className="w-full bg-slate-950 border-t border-slate-800/80 py-3 px-4 sm:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-mono">FastAPI :8000</span>
            </div>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-mono">Kafka KRaft :9092</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-mono">Redis L2 (0.8ms)</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-mono">K8s HPA: 4 Pods</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span className="text-emerald-400 font-medium">Enterprise Cloud Cost: $0.00 / mo</span>
            <span className="text-slate-600">•</span>
            <span>OmniVoyage Real-Time Travel Intelligence</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthRbacModal
        currentRole={userRole}
        onChangeRole={handleRoleChange}
        jwtSession={jwtSession}
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <TicketBookingModal
        route={routeToBook}
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        userRole={userRole}
      />
    </div>
  );
}
