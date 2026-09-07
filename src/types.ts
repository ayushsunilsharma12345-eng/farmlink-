export type TravelMode = 'flight' | 'train' | 'bus' | 'taxi' | 'metro' | 'multimodal';

export type UserRole = 'passenger' | 'operator' | 'devops_admin';

export type PreferenceFilter = 'all' | 'fastest' | 'cheapest' | 'eco' | 'reliable';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CityHub {
  id: string;
  name: string;
  city: string;
  code: string;
  country: string;
  coordinates: Coordinates;
  airport: string;
  railStation: string;
  busTerminal: string;
}

export interface RouteStep {
  id: string;
  mode: TravelMode;
  provider: string;
  vehicleNumber?: string;
  fromName: string;
  toName: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  distanceKm: number;
  costUSD: number;
  co2Kg: number;
  fromCoords: Coordinates;
  toCoords: Coordinates;
  transferBufferMinutes?: number;
  notes?: string;
}

export interface RouteOption {
  id: string;
  title: string;
  mode: TravelMode;
  origin: CityHub;
  destination: CityHub;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  priceUSD: number;
  co2Kg: number;
  transferCount: number;
  reliabilityScore: number; // 0 - 100%
  delayRiskPercent: number; // 0 - 100%
  tags: ('Recommended' | 'Fastest' | 'Cheapest' | 'Eco-Choice' | 'Direct')[];
  steps: RouteStep[];
  providerSummary: string;
  carbonSavingsPercentVsFlight?: number;
  cachedInRedis: boolean;
  computedBy: 'FastAPI A* Optimizer' | 'Redis L2 Cache' | 'Kafka Event Aggregator';
  computeLatencyMs: number;
}

export interface MicroserviceNode {
  id: string;
  name: string;
  role: string;
  stack: string;
  status: 'healthy' | 'warning' | 'restarting';
  latencyMs: number;
  rps: number;
  cpuUsage: number;
  memoryUsageMb: number;
  replicas: number;
  port: number;
  costPerMonth: string;
  freeTierAlloc: string;
}

export interface KafkaTopicMetric {
  topic: string;
  partitions: number;
  replicationFactor: number;
  messagesPerSec: number;
  lag: number;
  bytesInSec: number;
  consumerGroup: string;
}

export interface RedisCacheStats {
  status: 'connected';
  totalKeys: number;
  hitRatePercent: number;
  memoryUsedMb: number;
  maxMemoryMb: number;
  opsPerSec: number;
  avgReadLatencyMs: number;
  evictionPolicy: string;
}

export interface GrafanaLogEntry {
  id: string;
  timestamp: string;
  service: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  traceId: string;
}

export interface SeleniumScraperTask {
  id: string;
  targetProvider: string;
  sourceType: 'flight' | 'rail' | 'bus' | 'ridehail';
  status: 'running' | 'idle' | 'success' | 'rate-limited';
  headlessWorkers: number;
  recordsScrapedPerMin: number;
  lastScrapedAt: string;
  antiBotBypass: string;
  avgDurationSec: number;
}

export interface JWTSession {
  token: string;
  decoded: {
    sub: string;
    email: string;
    name: string;
    role: UserRole;
    scopes: string[];
    iat: number;
    exp: number;
    iss: string;
    clusterTenant: string;
  };
  isValid: boolean;
}

export interface ZeroCostComponent {
  component: string;
  role: string;
  productionTech: string;
  zeroCostAlternative: string;
  freeTierLimits: string;
  scalingThreshold: string;
  operationalStrategy: string;
}
