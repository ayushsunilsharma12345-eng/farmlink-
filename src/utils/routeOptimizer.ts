import { CityHub, RouteOption, RouteStep, TravelMode } from '../types';

// Calculate great circle distance in km between two lat/lng points
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function generateRoutes(origin: CityHub, destination: CityHub): RouteOption[] {
  const distanceKm = calculateDistanceKm(
    origin.coordinates.lat,
    origin.coordinates.lng,
    destination.coordinates.lat,
    destination.coordinates.lng
  );

  const routes: RouteOption[] = [];

  // 1. Direct Flight / Commercial Aviation
  const flightCruiseSpeedKmh = 800;
  const flightAirDurationMins = Math.round((distanceKm / flightCruiseSpeedKmh) * 60) + 30; // 30m climb/descent
  const flightTotalDurationMins = flightAirDurationMins + 95; // 60m airport buffer + 35m security/transfer
  const flightBasePrice = Math.max(75, Math.round(50 + distanceKm * 0.12));
  const flightCo2 = Math.round(distanceKm * 0.18); // ~180g CO2/km

  const flightOption: RouteOption = {
    id: `rt-flight-${origin.code}-${destination.code}`,
    title: `Direct Flight via ${origin.airport.split(' ')[0]} to ${destination.airport.split(' ')[0]}`,
    mode: 'flight',
    origin,
    destination,
    departureTime: '08:30 AM',
    arrivalTime: formatArrivalTime('08:30', flightTotalDurationMins),
    durationMinutes: flightTotalDurationMins,
    priceUSD: flightBasePrice,
    co2Kg: flightCo2,
    transferCount: 1,
    reliabilityScore: 92,
    delayRiskPercent: 12,
    tags: distanceKm > 700 ? ['Fastest', 'Recommended'] : ['Direct'],
    providerSummary: 'SkyJet Global / StarAlliance Partner',
    cachedInRedis: true,
    computedBy: 'FastAPI A* Optimizer',
    computeLatencyMs: 14,
    steps: [
      {
        id: 'step-1',
        mode: 'taxi',
        provider: 'Uber Airport Express',
        fromName: `${origin.city} Downtown`,
        toName: origin.airport,
        departureTime: '08:30 AM',
        arrivalTime: '09:05 AM',
        durationMinutes: 35,
        distanceKm: 28,
        costUSD: 32,
        co2Kg: 5,
        fromCoords: origin.coordinates,
        toCoords: origin.coordinates,
        transferBufferMinutes: 60,
        notes: 'Priority curbside drop-off & automated check-in',
      },
      {
        id: 'step-2',
        mode: 'flight',
        provider: 'AirExpress A321neo',
        vehicleNumber: `AE-${Math.floor(100 + Math.random() * 899)}`,
        fromName: origin.airport,
        toName: destination.airport,
        departureTime: '10:05 AM',
        arrivalTime: formatArrivalTime('10:05', flightAirDurationMins),
        durationMinutes: flightAirDurationMins,
        distanceKm,
        costUSD: flightBasePrice - 50,
        co2Kg: flightCo2 - 8,
        fromCoords: origin.coordinates,
        toCoords: destination.coordinates,
        transferBufferMinutes: 35,
        notes: 'Cruising at 34,000 ft; real-time satellite telemetry active',
      },
      {
        id: 'step-3',
        mode: 'metro',
        provider: 'Airport Rail Rapid Link',
        fromName: destination.airport,
        toName: `${destination.city} City Center`,
        departureTime: formatArrivalTime('10:05', flightAirDurationMins + 35),
        arrivalTime: formatArrivalTime('08:30', flightTotalDurationMins),
        durationMinutes: 25,
        distanceKm: 25,
        costUSD: 18,
        co2Kg: 3,
        fromCoords: destination.coordinates,
        toCoords: destination.coordinates,
        notes: 'Dedicated express rail directly into central district',
      },
    ],
  };
  routes.push(flightOption);

  // 2. High-Speed Rail (if distance < 2500 km)
  if (distanceKm < 2600) {
    const railSpeedKmh = distanceKm < 600 ? 250 : 280;
    const railDurationMins = Math.round((distanceKm / railSpeedKmh) * 60) + 20; // 20 min station boarding
    const railPrice = Math.max(45, Math.round(35 + distanceKm * 0.08));
    const railCo2 = Math.round(distanceKm * 0.024); // 85-90% lower CO2 than flights
    const savingsPercent = Math.round(((flightCo2 - railCo2) / flightCo2) * 100);

    const railOption: RouteOption = {
      id: `rt-rail-${origin.code}-${destination.code}`,
      title: `High-Speed Express Rail (${origin.railStation.split('/')[0]} → ${destination.railStation.split('/')[0]})`,
      mode: 'train',
      origin,
      destination,
      departureTime: '07:45 AM',
      arrivalTime: formatArrivalTime('07:45', railDurationMins),
      durationMinutes: railDurationMins,
      priceUSD: railPrice,
      co2Kg: railCo2,
      transferCount: 0,
      reliabilityScore: 97,
      delayRiskPercent: 4,
      tags: distanceKm <= 700 ? ['Fastest', 'Eco-Choice', 'Recommended'] : ['Eco-Choice'],
      providerSummary: 'Eurostar / Shinkansen / High-Speed Rail Operator',
      carbonSavingsPercentVsFlight: savingsPercent,
      cachedInRedis: true,
      computedBy: 'Redis L2 Cache',
      computeLatencyMs: 0.8,
      steps: [
        {
          id: 'step-rail-1',
          mode: 'train',
          provider: 'High-Speed Maglev/Electric Train',
          vehicleNumber: `HST-${Math.floor(400 + Math.random() * 599)}`,
          fromName: origin.railStation,
          toName: destination.railStation,
          departureTime: '07:45 AM',
          arrivalTime: formatArrivalTime('07:45', railDurationMins),
          durationMinutes: railDurationMins,
          distanceKm,
          costUSD: railPrice,
          co2Kg: railCo2,
          fromCoords: origin.coordinates,
          toCoords: destination.coordinates,
          notes: 'City-center to city-center direct with zero baggage drop waiting and high-speed Wi-Fi',
        },
      ],
    };
    routes.push(railOption);
  }

  // 3. Multimodal Hybrid (Smart AI Combination)
  // e.g., High-Speed Rail segment + regional transfer or Taxi + Express Shuttle
  const hybridDurationMins = Math.round(flightTotalDurationMins * 0.85);
  const hybridPrice = Math.round(flightBasePrice * 0.72);
  const hybridCo2 = Math.round(flightCo2 * 0.45);

  const multimodalOption: RouteOption = {
    id: `rt-multi-${origin.code}-${destination.code}`,
    title: `AI Multimodal Composite Route (Intermodal Rail + Flight + Green Cab)`,
    mode: 'multimodal',
    origin,
    destination,
    departureTime: '09:15 AM',
    arrivalTime: formatArrivalTime('09:15', hybridDurationMins),
    durationMinutes: hybridDurationMins,
    priceUSD: hybridPrice,
    co2Kg: hybridCo2,
    transferCount: 2,
    reliabilityScore: 94,
    delayRiskPercent: 8,
    tags: ['Recommended', 'Eco-Choice'],
    providerSummary: 'Kafka-Orchestrated Intermodal Connection',
    carbonSavingsPercentVsFlight: 55,
    cachedInRedis: false,
    computedBy: 'FastAPI A* Optimizer',
    computeLatencyMs: 18.4,
    steps: [
      {
        id: 'step-m1',
        mode: 'metro',
        provider: 'Autonomous Rapid Transit Metro',
        fromName: `${origin.city} Central Hub`,
        toName: `${origin.airport.split(' ')[0]} Intermodal Concourse`,
        departureTime: '09:15 AM',
        arrivalTime: '09:40 AM',
        durationMinutes: 25,
        distanceKm: 22,
        costUSD: 9,
        co2Kg: 2,
        fromCoords: origin.coordinates,
        toCoords: origin.coordinates,
        transferBufferMinutes: 40,
        notes: 'Synchronized automated gate transfer with baggage thru-check',
      },
      {
        id: 'step-m2',
        mode: 'flight',
        provider: 'EcoAero Regional Hybrid Electric',
        vehicleNumber: `EA-${Math.floor(200 + Math.random() * 799)}`,
        fromName: origin.airport,
        toName: destination.airport,
        departureTime: '10:20 AM',
        arrivalTime: formatArrivalTime('10:20', flightAirDurationMins - 10),
        durationMinutes: flightAirDurationMins - 10,
        distanceKm,
        costUSD: hybridPrice - 35,
        co2Kg: hybridCo2 - 5,
        fromCoords: origin.coordinates,
        toCoords: destination.coordinates,
        transferBufferMinutes: 20,
        notes: 'Low-emission continuous descent routing computed by FastAPI AI',
      },
      {
        id: 'step-m3',
        mode: 'taxi',
        provider: 'GreenCab EV Rideshare',
        fromName: destination.airport,
        toName: `${destination.city} Downtown`,
        departureTime: formatArrivalTime('10:20', flightAirDurationMins + 10),
        arrivalTime: formatArrivalTime('09:15', hybridDurationMins),
        durationMinutes: 30,
        distanceKm: 24,
        costUSD: 26,
        co2Kg: 1,
        fromCoords: destination.coordinates,
        toCoords: destination.coordinates,
        notes: 'Pre-dispatched electric taxi waiting at terminal pick-up zone',
      },
    ],
  };
  routes.push(multimodalOption);

  // 4. Intercity Express Coach / Bus (if distance < 1800 km)
  if (distanceKm < 1800) {
    const busSpeedKmh = 85;
    const busDurationMins = Math.round((distanceKm / busSpeedKmh) * 60) + 40; // 40m rest stops
    const busPrice = Math.max(22, Math.round(18 + distanceKm * 0.04));
    const busCo2 = Math.round(distanceKm * 0.038);

    const busOption: RouteOption = {
      id: `rt-bus-${origin.code}-${destination.code}`,
      title: `Intercity Sleeper / Express Bus (${origin.busTerminal.split(' ')[0]} → ${destination.busTerminal.split(' ')[0]})`,
      mode: 'bus',
      origin,
      destination,
      departureTime: '10:00 PM',
      arrivalTime: formatArrivalTime('22:00', busDurationMins),
      durationMinutes: busDurationMins,
      priceUSD: busPrice,
      co2Kg: busCo2,
      transferCount: 0,
      reliabilityScore: 89,
      delayRiskPercent: 15,
      tags: ['Cheapest', 'Eco-Choice'],
      providerSummary: 'FlixBus / MegaCoach Long Distance',
      carbonSavingsPercentVsFlight: 79,
      cachedInRedis: true,
      computedBy: 'Redis L2 Cache',
      computeLatencyMs: 1.1,
      steps: [
        {
          id: 'step-bus-1',
          mode: 'bus',
          provider: 'FlixBus Platinum Express',
          vehicleNumber: `FX-${Math.floor(700 + Math.random() * 299)}`,
          fromName: origin.busTerminal,
          toName: destination.busTerminal,
          departureTime: '10:00 PM',
          arrivalTime: formatArrivalTime('22:00', busDurationMins),
          durationMinutes: busDurationMins,
          distanceKm,
          costUSD: busPrice,
          co2Kg: busCo2,
          fromCoords: origin.coordinates,
          toCoords: destination.coordinates,
          notes: 'Overnight journey with reclining leather berths, power outlets, and free Wi-Fi',
        },
      ],
    };
    routes.push(busOption);
  }

  // 5. Private / On-Demand Taxi / Intercity Chauffeur (if distance < 500 km)
  if (distanceKm < 500) {
    const taxiDurationMins = Math.round((distanceKm / 90) * 60);
    const taxiPrice = Math.round(80 + distanceKm * 0.85);
    const taxiCo2 = Math.round(distanceKm * 0.14);

    const taxiOption: RouteOption = {
      id: `rt-taxi-${origin.code}-${destination.code}`,
      title: `Door-to-Door Private Express Cab (${origin.city} → ${destination.city})`,
      mode: 'taxi',
      origin,
      destination,
      departureTime: 'On Demand (Flexible)',
      arrivalTime: formatArrivalTime('09:00', taxiDurationMins),
      durationMinutes: taxiDurationMins,
      priceUSD: taxiPrice,
      co2Kg: taxiCo2,
      transferCount: 0,
      reliabilityScore: 95,
      delayRiskPercent: 9,
      tags: ['Direct'],
      providerSummary: 'Uber Intercity / Blacklane Private Ride',
      cachedInRedis: true,
      computedBy: 'FastAPI A* Optimizer',
      computeLatencyMs: 11.2,
      steps: [
        {
          id: 'step-taxi-1',
          mode: 'taxi',
          provider: 'Premium Chauffeur Sedan',
          fromName: `${origin.city} (Any Address)`,
          toName: `${destination.city} (Any Address)`,
          departureTime: 'Immediate',
          arrivalTime: formatArrivalTime('09:00', taxiDurationMins),
          durationMinutes: taxiDurationMins,
          distanceKm,
          costUSD: taxiPrice,
          co2Kg: taxiCo2,
          fromCoords: origin.coordinates,
          toCoords: destination.coordinates,
          notes: 'Door-to-door comfort with private driver, bottled refreshments, and pet-friendly cabin',
        },
      ],
    };
    routes.push(taxiOption);
  }

  return routes;
}

function formatArrivalTime(depTime: string, addedMinutes: number): string {
  const [hourStr, minStr] = depTime.replace(/ AM| PM/i, '').split(':');
  let hours = parseInt(hourStr, 10);
  const minutes = parseInt(minStr, 10);

  let totalMinutes = hours * 60 + minutes + addedMinutes;
  const daysAdded = Math.floor(totalMinutes / (24 * 60));
  totalMinutes = totalMinutes % (24 * 60);

  const finalHours = Math.floor(totalMinutes / 60);
  const finalMins = totalMinutes % 60;
  const period = finalHours >= 12 ? 'PM' : 'AM';
  const displayHours = finalHours % 12 === 0 ? 12 : finalHours % 12;
  const displayMins = finalMins < 10 ? `0${finalMins}` : finalMins;

  const daySuffix = daysAdded > 0 ? ` (+${daysAdded}d)` : '';
  return `${displayHours}:${displayMins} ${period}${daySuffix}`;
}
