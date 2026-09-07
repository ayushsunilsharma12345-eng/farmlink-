export type UserRole = 'farmer' | 'buyer' | 'admin' | 'architect';

export type QualityGrade = 'Grade A' | 'Grade B' | 'Grade C' | 'Organic Certified';

export type OrderStatus =
  | 'OFFER_SUBMITTED'
  | 'OFFER_ACCEPTED'
  | 'ORDER_CREATED'
  | 'ESCROW_LOCKED'
  | 'LOGISTICS_ASSIGNED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'PAYMENT_RELEASED';

export interface CommodityListing {
  id: string;
  farmerId: string;
  farmerName: string;
  crop: string;
  variety: string;
  quantityKg: number;
  minPricePerKg: number;
  expectedPricePerKg: number;
  location: string;
  state: string;
  harvestDate: string;
  storageType: string;
  grade: QualityGrade;
  verified: boolean;
  status: 'ACTIVE' | 'PENDING_OFFER' | 'SOLD';
  notes?: string;
}

export interface BuyerDemand {
  id: string;
  buyerId: string;
  buyerName: string;
  companyType: string;
  crop: string;
  requiredQuantityKg: number;
  targetPriceRange: { min: number; max: number };
  location: string;
  deliveryDeadline: string;
  qualityRequirement: QualityGrade;
  status: 'OPEN' | 'FULFILLED';
}

export interface Offer {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  crop: string;
  offeredPricePerKg: number;
  requestedQuantityKg: number;
  totalAmount: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED';
  createdAt: string;
  message?: string;
}

export interface Order {
  id: string;
  offerId: string;
  listingId: string;
  crop: string;
  quantityKg: number;
  pricePerKg: number;
  totalAmount: number;
  farmerName: string;
  farmerLocation: string;
  buyerName: string;
  buyerLocation: string;
  status: OrderStatus;
  escrowStatus: 'PENDING' | 'SECURED_IN_ESCROW' | 'DISBURSED_TO_FARMER';
  logistics: {
    transporterName: string;
    vehicleNumber: string;
    driverName: string;
    driverPhone: string;
    distanceKm: number;
    currentCheckpoint: string;
    etaHours: number;
    trackingId: string;
  };
  timeline: {
    step: OrderStatus;
    timestamp: string;
    description: string;
    completed: boolean;
  }[];
}

export interface MandiPrice {
  id: string;
  commodity: string;
  mandi: string;
  state: string;
  currentPrice: number;
  yesterdayPrice: number;
  changePercent: number;
  minPrice: number;
  maxPrice: number;
  arrivalsTonnes: number;
  updateTime: string;
  historical7Days: { day: string; price: number }[];
}

export interface AIRecommendation {
  id: string;
  buyerId: string;
  buyerName: string;
  matchScore: number;
  crop: string;
  demandQuantityKg: number;
  targetPrice: number;
  location: string;
  distanceKm: number;
  reasons: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'offer' | 'order' | 'price_alert' | 'system' | 'ai';
  read: boolean;
}

export interface ArchitectureStage {
  stageNumber: number;
  name: string;
  costLabel: string;
  timeEstimate: string;
  description: string;
  targetUsers: string;
  stack: {
    category: string;
    technology: string;
    costInRupees: string;
    purpose: string;
  }[];
  pros: string[];
  caveats: string[];
}
