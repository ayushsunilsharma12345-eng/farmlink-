import React, { useState, useEffect } from 'react';
import { MicroserviceNode, KafkaTopicMetric, RedisCacheStats, GrafanaLogEntry } from '../types';
import { Activity, Server, Database, Layers, Radio, Cpu, HardDrive, RefreshCw, Play, ShieldAlert, CheckCircle } from 'lucide-react';

interface GrafanaObservabilityProps {
  microservices: MicroserviceNode[];
  kafkaTopics: KafkaTopicMetric[];
  redisStats: RedisCacheStats;
  onSimulateSpike: () => void;
  isSimulatingLoad: boolean;
}

export const GrafanaObservability: React.FC<GrafanaObservabilityProps> = ({
  microservices,
  kafkaTopics,
  redisStats,
  onSimulateSpike,
  isSimulatingLoad,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'kafka' | 'logs'>('overview');
  const [logs, setLogs] = useState<GrafanaLogEntry[]>([
    {
      id: 'log-1',
      timestamp: '10:42:15.102',
      service: 'svc-fastapi-optimizer',
      level: 'INFO',
      message: 'Pareto frontier calculated in 14.2ms [A* heuristic nodes: 84, pruned: 312]',
      traceId: 'tr-8a9f2c',
    },
    {
      id: 'log-2',
      timestamp: '10:42:15.104',
      service: 'svc-redis-cache',
      level: 'INFO',
      message: 'SET route:LON:PAR:fastest EX 900 (TTL 15m) [L1 Memory + L2 Shard]',
      traceId: 'tr-8a9f2c',
    },
    {
      id: 'log-3',
      timestamp: '10:42:15.110',
      service: 'svc-kafka-eventbus',
      level: 'INFO',
      message: 'PRODUCE topic:travel.telemetry.events partition:4 offset:189420',
      traceId: 'tr-b411da',
    },
    {
      id: 'log-4',
      timestamp: '10:42:15.220',
      service: 'svc-selenium-scraper',
      level: 'DEBUG',
      message: 'Headless Chromium worker #2 aggregated 24 flight tariffs from Amadeus',
      traceId: 'tr-710c3e',
    },
  ]);

  // Live log generator
  useEffect(() => {
    const interval = setInterval(() => {
      const services = ['svc-node-gateway', 'svc-fastapi-optimizer', 'svc-redis-cache', 'svc-kafka-eventbus', 'svc-selenium-scraper'];
      const randomSvc = services[Math.floor(Math.random() * services.length)];
      const traceId = `tr-${Math.random().toString(36).substring(2, 8)}`;

      let message = '';
      if (randomSvc === 'svc-redis-cache') {
        message = `GET route:matrix:cache hit ratio ${(96.2 + Math.random() * 1.5).toFixed(1)}% [latency: 0.8ms]`;
      } else if (randomSvc === 'svc-fastapi-optimizer') {
        message = `Pydantic v2 validation completed in 1.1ms; Multimodal cost graph dispatched`;
      } else if (randomSvc === 'svc-kafka-eventbus') {
        message = `ACK topic:travel.route.requests consumer-group:fastapi-workers lag:0`;
      } else if (randomSvc === 'svc-selenium-scraper') {
        message = `DOM selector parsed; Rail seat waitlist updated for Eurostar & Shinkansen`;
      } else {
        message = `JWT bearer validated with HMAC-SHA256 in 0.4ms; scope=[routes:read]`;
      }

      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;

      setLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          service: randomSvc,
          level: 'INFO',
          message,
          traceId,
        },
        ...prev.slice(0, 18),
      ]);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="grafana-observability-panel" className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-5">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-md">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <span>Grafana APM & Distributed Microservices Telemetry</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
                100% Operational
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live monitoring of FastAPI, Node Gateway, Kafka KRaft, Redis L2, Selenium & Kubernetes Pods
            </p>
          </div>
        </div>

        {/* Load Test Trigger */}
        <div className="flex items-center space-x-2">
          <button
            id="btn-simulate-traffic-spike"
            onClick={onSimulateSpike}
            disabled={isSimulatingLoad}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              isSimulatingLoad
                ? 'bg-amber-500 text-slate-950 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isSimulatingLoad ? 'animate-spin' : ''}`} />
            <span>{isSimulatingLoad ? 'Simulating 500 RPS Spike...' : 'Simulate 500 RPS Spike'}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards (Grafana Stat Panels) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>P95 API Latency</span>
            <span className="text-emerald-400 font-mono">sub-50ms SLA</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {isSimulatingLoad ? '38.4 ms' : '14.2 ms'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>FastAPI async worker pool</span>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>System Throughput</span>
            <span className="text-sky-400 font-mono">RPS</span>
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400 mt-1">
            {isSimulatingLoad ? '2,850 rps' : '1,250 rps'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>Node.js Edge + Ingress-Nginx</span>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Redis Cache Hit Rate</span>
            <span className="text-purple-400 font-mono">L1/L2</span>
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
            {redisStats.hitRatePercent}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>{redisStats.totalKeys.toLocaleString()} cached routes</span>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Kafka Consumer Lag</span>
            <span className="text-teal-400 font-mono">4 Topics</span>
          </div>
          <div className="text-2xl font-bold font-mono text-teal-400 mt-1">
            {isSimulatingLoad ? '8 msgs' : '1 msg'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span>Near-zero message backlog</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="flex space-x-1 border-b border-slate-800">
        {(
          [
            { id: 'overview', label: 'Topology & Pods' },
            { id: 'services', label: 'Microservices Matrix' },
            { id: 'kafka', label: 'Kafka Topics & Queues' },
            { id: 'logs', label: 'Live Telemetry Logs' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-sky-500 text-sky-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Topology & Kubernetes Pods */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {microservices.map((svc) => (
              <div key={svc.id} className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">{svc.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Port {svc.port}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  {svc.stack}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-400">Latency</div>
                    <div className="font-mono text-emerald-400 font-medium">{svc.latencyMs}ms</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Throughput</div>
                    <div className="font-mono text-sky-400 font-medium">{svc.rps} rps</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Replicas</div>
                    <div className="font-mono text-slate-200 font-medium">{svc.replicas} Pods</div>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Free Tier: {svc.freeTierAlloc}</span>
                  <span className="text-emerald-400 font-bold">{svc.costPerMonth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Microservices Detailed Matrix */}
      {activeTab === 'services' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Microservice</th>
                <th className="p-3">Tech Stack</th>
                <th className="p-3">Role & Responsibility</th>
                <th className="p-3">P95 Latency</th>
                <th className="p-3">CPU / Memory</th>
                <th className="p-3">Zero-Cost Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950/60 font-mono">
              {microservices.map((svc) => (
                <tr key={svc.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-sans font-semibold text-slate-200 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{svc.name}</span>
                  </td>
                  <td className="p-3 text-sky-400 text-[11px]">{svc.stack}</td>
                  <td className="p-3 font-sans text-slate-400 text-xs">{svc.role}</td>
                  <td className="p-3 text-emerald-400">{svc.latencyMs}ms</td>
                  <td className="p-3 text-slate-300">{svc.cpuUsage}% / {svc.memoryUsageMb}MB</td>
                  <td className="p-3 text-teal-400 text-[11px] font-sans font-medium">$0.00 / mo</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Kafka Topics */}
      {activeTab === 'kafka' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {kafkaTopics.map((topic) => (
              <div key={topic.topic} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-sky-300">{topic.topic}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono">
                    Lag: {topic.lag} msgs
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-mono text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Partitions</span>
                    <span>{topic.partitions} (RF: {topic.replicationFactor})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Msgs/Sec</span>
                    <span className="text-emerald-400">{topic.messagesPerSec}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Ingress Rate</span>
                    <span>{(topic.bytesInSec / 1024).toFixed(1)} KB/s</span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-slate-400 font-mono">
                  Consumer Group: <span className="text-slate-300">{topic.consumerGroup}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Live Telemetry Logs */}
      {activeTab === 'logs' && (
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs space-y-1.5 max-h-[300px] overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start space-x-2 text-[11px] leading-relaxed">
              <span className="text-slate-500 flex-shrink-0">{log.timestamp}</span>
              <span
                className={`px-1.5 rounded text-[10px] font-bold ${
                  log.level === 'INFO'
                    ? 'text-sky-400 bg-sky-950'
                    : log.level === 'WARN'
                    ? 'text-amber-400 bg-amber-950'
                    : 'text-emerald-400 bg-emerald-950'
                }`}
              >
                {log.level}
              </span>
              <span className="text-indigo-400 font-semibold">{log.service}:</span>
              <span className="text-slate-300 flex-1">{log.message}</span>
              <span className="text-slate-600 text-[10px]">{log.traceId}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
