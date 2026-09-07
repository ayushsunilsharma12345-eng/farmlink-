import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Truck,
  Check,
  X,
  IndianRupee,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { CommodityListing, Offer, AIRecommendation, QualityGrade, BuyerDemand } from '../types';

interface FarmerPortalProps {
  listings: CommodityListing[];
  offers: Offer[];
  demands: BuyerDemand[];
  recommendations: AIRecommendation[];
  onAddListing: (newListing: Omit<CommodityListing, 'id' | 'status' | 'farmerId' | 'farmerName' | 'verified'>) => void;
  onAcceptOffer: (offerId: string) => void;
  onRejectOffer: (offerId: string) => void;
  onOpenAiAdvisor: (initialPrompt?: string) => void;
  onViewOrders: () => void;
}

export const FarmerPortal: React.FC<FarmerPortalProps> = ({
  listings,
  offers,
  demands,
  recommendations,
  onAddListing,
  onAcceptOffer,
  onRejectOffer,
  onOpenAiAdvisor,
  onViewOrders,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [crop, setCrop] = useState('Onion');
  const [variety, setVariety] = useState('Nashik Red (Garwa)');
  const [quantityKg, setQuantityKg] = useState('2000');
  const [minPricePerKg, setMinPricePerKg] = useState('25');
  const [expectedPricePerKg, setExpectedPricePerKg] = useState('27');
  const [grade, setGrade] = useState<QualityGrade>('Grade A');
  const [storageType, setStorageType] = useState('Ventilated Traditional Chawl');
  const [location, setLocation] = useState('Nashik (Lasalgaon Belt)');
  const [notes, setNotes] = useState('Cured, sorted bulb with 50mm+ diameter.');

  const farmerListings = listings.filter((l) => l.farmerId === 'farmer-ayush');
  const farmerOffers = offers.filter((o) => o.farmerId === 'farmer-ayush');
  const pendingOffers = farmerOffers.filter((o) => o.status === 'PENDING');

  const handleSubmitListing = (e: React.FormEvent) => {
    e.preventDefault();
    onAddListing({
      crop,
      variety,
      quantityKg: Number(quantityKg) || 1000,
      minPricePerKg: Number(minPricePerKg) || 20,
      expectedPricePerKg: Number(expectedPricePerKg) || 22,
      location,
      state: 'Maharashtra',
      harvestDate: new Date().toISOString().split('T')[0],
      storageType,
      grade,
      notes,
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Farmer Profile Card & Key Metrics */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xl border border-slate-700 shadow-xs">
              AS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Ayush Sharma</h1>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  KYC & Mandi Verified
                </span>
              </div>
              <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Lasalgaon, Nashik District, Maharashtra · 12 Acres Farm
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                <span>Primary Crops: <strong className="text-slate-700">Onion, Tomato, Wheat</strong></span>
                <span>•</span>
                <span>Fulfillment Score: <strong className="text-emerald-700">4.9 / 5.0 (18 Orders)</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              id="btn-create-crop-listing"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-xs shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Crop Listing</span>
            </button>
            <button
              id="btn-farmer-ask-ai"
              onClick={() => onOpenAiAdvisor('Where can this farmer get the best price for 2 tonnes of onions?')}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Price Advisory</span>
            </button>
          </div>
        </div>

        {/* Metric Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Active Listings</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{farmerListings.length} Lots</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {farmerListings.reduce((acc, curr) => acc + curr.quantityKg, 0).toLocaleString()} kg available
            </p>
          </div>

          <div className="bg-amber-50/70 rounded-lg p-3.5 border border-amber-200">
            <p className="text-xs text-amber-800 font-medium">Pending Offers</p>
            <p className="text-xl font-bold text-amber-900 mt-1">{pendingOffers.length} Received</p>
            <p className="text-[11px] text-amber-700 mt-0.5">Direct buyer bids</p>
          </div>

          <div className="bg-emerald-50/70 rounded-lg p-3.5 border border-emerald-200">
            <p className="text-xs text-emerald-800 font-medium">Escrow Security</p>
            <p className="text-xl font-bold text-emerald-900 mt-1">100% Protected</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">Funds locked before dispatch</p>
          </div>

          <div className="bg-blue-50/70 rounded-lg p-3.5 border border-blue-200">
            <p className="text-xs text-blue-800 font-medium">Logistics Support</p>
            <p className="text-xl font-bold text-blue-900 mt-1">Farmgate Pickup</p>
            <p className="text-[11px] text-blue-700 mt-0.5">Weighbridge & truck tracking</p>
          </div>
        </div>
      </div>

      {/* SECTION: Incoming Buyer Offers (Core flow from Pages 7-8 of Document!) */}
      {pendingOffers.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></span>
              <h2 className="text-lg font-bold text-amber-950">
                Incoming Buyer Offers on Your Crop
              </h2>
            </div>
            <span className="text-xs font-semibold bg-amber-200 text-amber-900 px-2.5 py-1 rounded-full">
              PostgreSQL ACID Transaction Ready
            </span>
          </div>

          <div className="space-y-4">
            {pendingOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-xl p-5 border border-amber-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Direct Offer
                    </span>
                    <h3 className="font-bold text-stone-900 text-base">{offer.buyerName}</h3>
                  </div>
                  <p className="text-sm text-stone-600">
                    Offers <strong className="text-emerald-700 font-mono text-base">₹{offer.offeredPricePerKg}/kg</strong> for your{' '}
                    <strong>{offer.requestedQuantityKg.toLocaleString()} kg {offer.crop}</strong> lot.
                  </p>
                  <p className="text-xs text-stone-500 italic">"{offer.message}"</p>
                  <div className="flex items-center gap-3 text-xs text-stone-500 pt-1">
                    <span>Total Deal Value: <strong className="text-stone-900 text-sm font-mono">₹{offer.totalAmount.toLocaleString()}</strong></span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">
                      +₹{offer.offeredPricePerKg - 25}/kg above your minimum price of ₹25/kg
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    id={`btn-accept-offer-${offer.id}`}
                    onClick={() => onAcceptOffer(offer.id)}
                    className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept & Create Order</span>
                  </button>
                  <button
                    id={`btn-reject-offer-${offer.id}`}
                    onClick={() => onRejectOffer(offer.id)}
                    className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Active Listings & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Farmer's Current Listings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>My Active Commodity Listings</span>
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              + Add New Crop
            </button>
          </div>

          <div className="space-y-3">
            {farmerListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {listing.crop.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900">{listing.crop} - {listing.variety}</h3>
                      <p className="text-xs text-slate-500">{listing.location} · Harvested {listing.harvestDate}</p>
                    </div>
                  </div>
                  <span className="self-start sm:self-center text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {listing.grade}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 py-3 text-xs">
                  <div>
                    <span className="text-slate-500">Available Lot</span>
                    <p className="font-bold text-slate-900 text-sm font-mono mt-0.5">
                      {listing.quantityKg.toLocaleString()} kg
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Min. Target Price</span>
                    <p className="font-bold text-slate-900 text-sm font-mono mt-0.5">
                      ₹{listing.minPricePerKg}/kg
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Expected Value</span>
                    <p className="font-bold text-emerald-600 text-sm font-mono mt-0.5">
                      ₹{(listing.quantityKg * listing.expectedPricePerKg).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Storage: {listing.storageType}
                  </span>
                  <button
                    onClick={() => onOpenAiAdvisor(`Evaluate fair market value and predicted 7-day price for ${listing.crop} in ${listing.location}`)}
                    className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    Predict Price Trend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Matchmaker & Buyer Recommendations */}
        <div className="space-y-4">
          <div className="bg-[#0F172A] text-white rounded-xl p-5 shadow-xs border border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold">AI Buyer Matchmaker</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Aerospike-cached recommendation engine calculates distance, volume fit, and price realization.
            </p>

            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-slate-800/90 rounded-lg p-3.5 border border-slate-700 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{rec.buyerName}</span>
                    <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full text-[10px]">
                      {rec.matchScore}% Match
                    </span>
                  </div>
                  <div className="text-emerald-200/90 flex items-center justify-between">
                    <span>Demand: {rec.demandQuantityKg.toLocaleString()} kg {rec.crop}</span>
                    <span className="font-mono font-bold text-emerald-300">Target: ₹{rec.targetPrice}/kg</span>
                  </div>
                  <p className="text-[11px] text-emerald-300/70">{rec.location}</p>
                  <ul className="text-[10px] text-emerald-100/70 space-y-0.5 list-disc pl-3">
                    {rec.reasons.slice(0, 2).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button
              onClick={() => onOpenAiAdvisor('Show me all onion buyers within 200 km who have verified escrow funding.')}
              className="w-full mt-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Ask AI for Custom Buyer Match</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Direct Government Scheme Quick Links (RAG Prompts) */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Government Schemes & Advisory</span>
            </h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => onOpenAiAdvisor('What government scheme can help me with irrigation and drip subsidies?')}
                className="w-full text-left p-2.5 rounded-lg bg-stone-50 hover:bg-emerald-50 border border-stone-200 text-stone-700 hover:text-emerald-900 transition-colors"
              >
                💧 PMKSY Drip Irrigation Subsidies (45-55%)
              </button>
              <button
                onClick={() => onOpenAiAdvisor('How can I apply for Kisan Credit Card (KCC) 4% crop loans?')}
                className="w-full text-left p-2.5 rounded-lg bg-stone-50 hover:bg-emerald-50 border border-stone-200 text-stone-700 hover:text-emerald-900 transition-colors"
              >
                💳 Kisan Credit Card (KCC) 4% Loan
              </button>
              <button
                onClick={() => onOpenAiAdvisor('How does e-NAM integrate with FarmLink for nationwide bidding?')}
                className="w-full text-left p-2.5 rounded-lg bg-stone-50 hover:bg-emerald-50 border border-stone-200 text-stone-700 hover:text-emerald-900 transition-colors"
              >
                🏛️ e-NAM Mandi Integration & Quality Testing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE LISTING MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <span>Create FarmGate Crop Listing</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitListing} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Crop Commodity</label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Onion">Onion (कांदा)</option>
                    <option value="Tomato">Tomato (टोमॅटो)</option>
                    <option value="Wheat">Wheat (गहू)</option>
                    <option value="Potato">Potato (बटाटा)</option>
                    <option value="Soybean">Soybean (सोयाबीन)</option>
                    <option value="Cotton">Cotton (कापूस)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Crop Variety</label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="e.g. Nashik Red / Garwa"
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    min="100"
                    step="50"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Min. Price (₹/kg)</label>
                  <input
                    type="number"
                    value={minPricePerKg}
                    onChange={(e) => setMinPricePerKg(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    min="1"
                    step="0.5"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Target Price (₹/kg)</label>
                  <input
                    type="number"
                    value={expectedPricePerKg}
                    onChange={(e) => setExpectedPricePerKg(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    min="1"
                    step="0.5"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Quality Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as QualityGrade)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Grade A">Grade A (Super Clean / Uniform)</option>
                    <option value="Grade B">Grade B (Commercial Quality)</option>
                    <option value="Grade C">Grade C (Industrial Processing)</option>
                    <option value="Organic Certified">Organic Certified (NPOP)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Storage Condition</label>
                  <input
                    type="text"
                    value={storageType}
                    onChange={(e) => setStorageType(e.target.value)}
                    placeholder="e.g. Traditional Chawl / Cold Store"
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Location & Farmgate</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Lasalgaon, Nashik District"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Lot Notes & Moisture Details</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-sm"
                >
                  Publish Listing to Marketplace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
