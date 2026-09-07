import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { FarmerPortal } from './components/FarmerPortal';
import { BuyerPortal } from './components/BuyerPortal';
import { OrdersLogistics } from './components/OrdersLogistics';
import { RealTimePrices } from './components/RealTimePrices';
import { CostArchitectureEvaluator } from './components/CostArchitectureEvaluator';
import { AdminPortal } from './components/AdminPortal';
import { AiAdvisor } from './components/AiAdvisor';
import { NotificationDrawer } from './components/NotificationDrawer';
import {
  initialListings,
  initialDemands,
  initialOffers,
  initialOrders,
  initialMandiPrices,
  initialRecommendations,
  initialNotifications,
} from './data/mockData';
import {
  UserRole,
  CommodityListing,
  BuyerDemand,
  Offer,
  Order,
  MandiPrice,
  AppNotification,
  OrderStatus,
} from './types';
import {
  Sprout,
  Building2,
  TrendingUp,
  Truck,
  Layers,
  ShieldCheck,
  Calculator,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const [activeRole, setActiveRole] = useState<UserRole>('farmer');
  const [activeSubTab, setActiveSubTab] = useState<'portal' | 'prices' | 'orders'>('portal');

  // Core platform states
  const [listings, setListings] = useState<CommodityListing[]>(initialListings);
  const [demands, setDemands] = useState<BuyerDemand[]>(initialDemands);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [mandiPrices, setMandiPrices] = useState<MandiPrice[]>(initialMandiPrices);
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  // Modals / Drawers
  const [showAiAdvisor, setShowAiAdvisor] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Add new listing (Farmer)
  const handleAddListing = (newListingData: Omit<CommodityListing, 'id' | 'status' | 'farmerId' | 'farmerName' | 'verified'>) => {
    const newListing: CommodityListing = {
      ...newListingData,
      id: `list-${Date.now()}`,
      farmerId: 'farmer-ayush',
      farmerName: 'Ayush Sharma',
      status: 'ACTIVE',
      verified: true,
    };
    setListings((prev) => [newListing, ...prev]);

    // Push Kafka event notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Crop Listing Published',
      message: `Your ${newListing.crop} (${newListing.variety}) lot of ${newListing.quantityKg} kg is now live on the marketplace.`,
      timestamp: 'Just now',
      type: 'system',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Published ${newListing.quantityKg} kg ${newListing.crop} to the marketplace!`);
  };

  // Make direct offer (Buyer)
  const handleMakeOffer = (
    listingId: string,
    offeredPricePerKg: number,
    requestedQuantityKg: number,
    message: string
  ) => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;

    const newOffer: Offer = {
      id: `off-${Date.now()}`,
      listingId,
      buyerId: 'buyer-freshmart',
      buyerName: 'FreshMart Supermarkets Ltd',
      farmerId: listing.farmerId,
      farmerName: listing.farmerName,
      crop: listing.crop,
      offeredPricePerKg,
      requestedQuantityKg,
      totalAmount: offeredPricePerKg * requestedQuantityKg,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      message,
    };

    setOffers((prev) => [newOffer, ...prev]);

    // Mark listing as pending offer
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, status: 'PENDING_OFFER' } : l))
    );

    // Kafka event simulation
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Offer Sent via Kafka',
      message: `Offered ₹${offeredPricePerKg}/kg to ${listing.farmerName} for ${requestedQuantityKg} kg ${listing.crop}.`,
      timestamp: 'Just now',
      type: 'offer',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Offer of ₹${offeredPricePerKg}/kg transmitted to ${listing.farmerName}!`);
  };

  // Accept offer (Farmer -> triggers PostgreSQL ACID Order Creation)
  const handleAcceptOffer = (offerId: string) => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return;

    // 1. Update offer status
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'ACCEPTED' } : o))
    );

    // 2. Create Order in PostgreSQL transactional simulation
    const newOrderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: newOrderId,
      offerId: offer.id,
      listingId: offer.listingId,
      crop: offer.crop,
      quantityKg: offer.requestedQuantityKg,
      pricePerKg: offer.offeredPricePerKg,
      totalAmount: offer.totalAmount,
      farmerName: offer.farmerName,
      farmerLocation: 'Nashik (Lasalgaon)',
      buyerName: offer.buyerName,
      buyerLocation: 'Pune (Hadapsar Hub)',
      status: 'ESCROW_LOCKED',
      escrowStatus: 'SECURED_IN_ESCROW',
      logistics: {
        transporterName: 'MahaKisan Dedicated Cold-Chain',
        vehicleNumber: 'MH-15-BD-8102',
        driverName: 'Kailash Sonawane',
        driverPhone: '+91 94222 19830',
        distanceKm: 185,
        currentCheckpoint: 'Lasalgaon Farmgate Loading Dock',
        etaHours: 4.0,
        trackingId: `TRK-${Math.floor(10000 + Math.random() * 90000)}`,
      },
      timeline: [
        {
          step: 'OFFER_SUBMITTED',
          timestamp: 'Earlier today',
          description: `Buyer offered ₹${offer.offeredPricePerKg}/kg for ${offer.requestedQuantityKg} kg`,
          completed: true,
        },
        {
          step: 'OFFER_ACCEPTED',
          timestamp: 'Just now',
          description: 'Farmer accepted price contract',
          completed: true,
        },
        {
          step: 'ORDER_CREATED',
          timestamp: 'Just now',
          description: 'PostgreSQL ACID transaction committed',
          completed: true,
        },
        {
          step: 'ESCROW_LOCKED',
          timestamp: 'Just now',
          description: `₹${offer.totalAmount.toLocaleString()} safely secured in FarmLink Escrow`,
          completed: true,
        },
        {
          step: 'LOGISTICS_ASSIGNED',
          timestamp: 'Pending loading',
          description: 'Refrigerated transport dispatched to farmgate',
          completed: false,
        },
        {
          step: 'IN_TRANSIT',
          timestamp: 'Pending departure',
          description: 'En route to buyer distribution center',
          completed: false,
        },
        {
          step: 'DELIVERED',
          timestamp: 'Expected today',
          description: 'Weighbridge check & quality verification',
          completed: false,
        },
        {
          step: 'PAYMENT_RELEASED',
          timestamp: 'Post delivery',
          description: 'Instant settlement to farmer bank account',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update listing status to SOLD
    setListings((prev) =>
      prev.map((l) => (l.id === offer.listingId ? { ...l, status: 'SOLD' } : l))
    );

    // Kafka event
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Offer Accepted! Escrow Secured',
      message: `Order ${newOrderId} created for ₹${offer.totalAmount.toLocaleString()}. Funds are now safely locked in escrow!`,
      timestamp: 'Just now',
      type: 'order',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(`Order ${newOrderId} created! ₹${offer.totalAmount.toLocaleString()} secured in Escrow.`);
    setActiveSubTab('orders');
  };

  const handleRejectOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'REJECTED' } : o))
    );
    showToast('Offer declined.');
  };

  // Post new buyer demand
  const handlePostDemand = (newDemandData: Omit<BuyerDemand, 'id' | 'status' | 'buyerId' | 'buyerName'>) => {
    const newDemand: BuyerDemand = {
      ...newDemandData,
      id: `dem-${Date.now()}`,
      buyerId: 'buyer-freshmart',
      buyerName: 'FreshMart Supermarkets Ltd',
      status: 'OPEN',
    };
    setDemands((prev) => [newDemand, ...prev]);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Bulk Demand Posted',
      message: `Posted demand for ${newDemand.requiredQuantityKg.toLocaleString()} kg ${newDemand.crop} in ${newDemand.location}.`,
      timestamp: 'Just now',
      type: 'system',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Demand for ${newDemand.requiredQuantityKg} kg ${newDemand.crop} posted to the Mandi network!`);
  };

  // Advance Order Status simulator
  const handleAdvanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        const nextStatusMap: Record<OrderStatus, OrderStatus> = {
          OFFER_SUBMITTED: 'OFFER_ACCEPTED',
          OFFER_ACCEPTED: 'ORDER_CREATED',
          ORDER_CREATED: 'ESCROW_LOCKED',
          ESCROW_LOCKED: 'LOGISTICS_ASSIGNED',
          LOGISTICS_ASSIGNED: 'IN_TRANSIT',
          IN_TRANSIT: 'DELIVERED',
          DELIVERED: 'PAYMENT_RELEASED',
          PAYMENT_RELEASED: 'PAYMENT_RELEASED',
        };

        const nextStatus = nextStatusMap[ord.status];
        const updatedTimeline = ord.timeline.map((step) => {
          if (step.step === nextStatus) {
            return { ...step, completed: true, timestamp: 'Just now' };
          }
          return step;
        });

        const updatedEscrow =
          nextStatus === 'PAYMENT_RELEASED' ? 'DISBURSED_TO_FARMER' : ord.escrowStatus;

        return {
          ...ord,
          status: nextStatus,
          escrowStatus: updatedEscrow,
          timeline: updatedTimeline,
        };
      })
    );

    showToast('Advanced order execution step in PostgreSQL pipeline.');
  };

  const handleOpenAiAdvisor = (initialPrompt?: string) => {
    setAiInitialPrompt(initialPrompt);
    setShowAiAdvisor(true);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#1E293B] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar with role switcher & Mandi ticker */}
      <Navbar
        activeRole={activeRole}
        onSelectRole={setActiveRole}
        mandiPrices={mandiPrices}
        unreadNotifsCount={unreadCount}
        onOpenNotifications={() => setShowNotificationDrawer(true)}
        onOpenAiAdvisor={() => handleOpenAiAdvisor()}
      />

      {/* Professional Polish Instance & Deployment Sub-Header */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-slate-800">Instance: ayush-prod-01</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 border border-emerald-200">
                  Active
                </span>
                <span className="text-xs text-slate-400 font-mono hidden md:inline">
                  (ayushsunilsharma12345-eng)
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200 text-xs text-slate-600">
                <span className="text-slate-400 font-medium">Context:</span>
                <span className="font-bold flex items-center gap-1">
                  {activeRole === 'farmer' && <Sprout className="w-3.5 h-3.5 text-emerald-600" />}
                  {activeRole === 'buyer' && <Building2 className="w-3.5 h-3.5 text-blue-600" />}
                  {activeRole === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />}
                  {activeRole === 'architect' && <Calculator className="w-3.5 h-3.5 text-emerald-600" />}

                  {activeRole === 'farmer' && 'Farmer Workspace (Ayush Sharma · Nashik)'}
                  {activeRole === 'buyer' && 'Buyer Workspace (FreshMart Supermarkets · Pune)'}
                  {activeRole === 'admin' && 'Market Authority & SRE Admin'}
                  {activeRole === 'architect' && 'Stage 1 Architecture & ₹0 Cost Evaluator'}
                </span>
              </div>
            </div>

            {/* Sub Tabs and Push Version Trigger */}
            <div className="flex items-center gap-3">
              {(activeRole === 'farmer' || activeRole === 'buyer') && (
                <div className="flex items-center gap-1.5 text-xs bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    id="subtab-portal"
                    onClick={() => setActiveSubTab('portal')}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                      activeSubTab === 'portal'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {activeRole === 'farmer' ? 'My Listings & Bids' : 'Commodity Marketplace'}
                  </button>

                  <button
                    id="subtab-prices"
                    onClick={() => setActiveSubTab('prices')}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                      activeSubTab === 'prices'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Live Prices & AI
                  </button>

                  <button
                    id="subtab-orders"
                    onClick={() => setActiveSubTab('orders')}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1 ${
                      activeSubTab === 'orders'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Orders ({orders.length})</span>
                  </button>
                </div>
              )}

              <button
                id="btn-push-version"
                onClick={() => showToast('Syncing with branch ayushsunilsharma12345-eng: 0 cost commit confirmed.')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-md text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                <span>🚀</span>
                <span>Push Verified</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Architect / ₹0 Cost Evaluator View */}
        {activeRole === 'architect' && <CostArchitectureEvaluator />}

        {/* Market Admin View */}
        {activeRole === 'admin' && (
          <AdminPortal
            listings={listings}
            orders={orders}
            mandiPrices={mandiPrices}
            onOpenAiAdvisor={handleOpenAiAdvisor}
          />
        )}

        {/* Farmer Portal View */}
        {activeRole === 'farmer' && (
          <>
            {activeSubTab === 'portal' && (
              <FarmerPortal
                listings={listings}
                offers={offers}
                demands={demands}
                recommendations={recommendations}
                onAddListing={handleAddListing}
                onAcceptOffer={handleAcceptOffer}
                onRejectOffer={handleRejectOffer}
                onOpenAiAdvisor={handleOpenAiAdvisor}
                onViewOrders={() => setActiveSubTab('orders')}
              />
            )}
            {activeSubTab === 'prices' && (
              <RealTimePrices
                mandiPrices={mandiPrices}
                onOpenAiAdvisor={handleOpenAiAdvisor}
              />
            )}
            {activeSubTab === 'orders' && (
              <OrdersLogistics
                orders={orders}
                onAdvanceOrderStatus={handleAdvanceOrderStatus}
                onOpenAiAdvisor={handleOpenAiAdvisor}
              />
            )}
          </>
        )}

        {/* Buyer Portal View */}
        {activeRole === 'buyer' && (
          <>
            {activeSubTab === 'portal' && (
              <BuyerPortal
                listings={listings}
                demands={demands}
                offers={offers}
                onPostDemand={handlePostDemand}
                onMakeOffer={handleMakeOffer}
                onOpenAiAdvisor={handleOpenAiAdvisor}
              />
            )}
            {activeSubTab === 'prices' && (
              <RealTimePrices
                mandiPrices={mandiPrices}
                onOpenAiAdvisor={handleOpenAiAdvisor}
              />
            )}
            {activeSubTab === 'orders' && (
              <OrdersLogistics
                orders={orders}
                onAdvanceOrderStatus={handleAdvanceOrderStatus}
                onOpenAiAdvisor={handleOpenAiAdvisor}
              />
            )}
          </>
        )}

        {/* Professional Polish Terminal Console Telemetry Bar (from Design HTML) */}
        <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 shadow-sm border border-slate-800">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="ml-2 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
              Console Telemetry · ayushsunilsharma12345-eng
            </span>
            <span className="ml-auto text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
              0 Cost Confirmed
            </span>
          </div>
          <div className="space-y-1 text-[11px]">
            <p className="text-emerald-400">[SYSTEM] push-agent verified for user branch: ayushsunilsharma12345-eng</p>
            <p className="text-slate-300">[INFO] Stage 1 Architecture: Docker + Local PostgreSQL ACID + Aerospike CE ($0) + Kafka Event Bus</p>
            <p className="text-slate-400">[INFO] Syncing repository state: ayushsunilsharma12345-eng/app-core · 0 cost detected</p>
            <p className="text-slate-500">[DEBUG] No breaking changes detected in v1.0.0-stable build manifest...</p>
          </div>
        </div>
      </main>

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FarmLink AI RAG Advisor Modal */}
      <AiAdvisor
        isOpen={showAiAdvisor}
        onClose={() => setShowAiAdvisor(false)}
        initialPrompt={aiInitialPrompt}
      />

      {/* Kafka Event Notifications Drawer */}
      <NotificationDrawer
        isOpen={showNotificationDrawer}
        onClose={() => setShowNotificationDrawer(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />

      {/* Clean, grounded footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto text-xs text-slate-500 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">FarmLink</span>
            <span>·</span>
            <span>Agricultural Marketplace Platform</span>
            <span>·</span>
            <span className="text-emerald-600 font-semibold font-mono">Stage 1 · $0.00 / ₹0 Cloud Cost Verified</span>
          </div>
          <p className="text-center sm:text-right text-[11px] text-slate-400 font-mono">
            Repository: ayushsunilsharma12345-eng · Clean Architecture
          </p>
        </div>
      </footer>
    </div>
  );
}
