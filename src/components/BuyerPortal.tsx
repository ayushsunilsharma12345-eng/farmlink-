import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  MapPin,
  ShieldCheck,
  Tag,
  Truck,
  Plus,
  Send,
  Sparkles,
  Layers,
  Clock,
  ArrowRight,
  CheckCircle2,
  X,
} from 'lucide-react';
import { CommodityListing, BuyerDemand, QualityGrade, Offer } from '../types';

interface BuyerPortalProps {
  listings: CommodityListing[];
  demands: BuyerDemand[];
  offers: Offer[];
  onPostDemand: (newDemand: Omit<BuyerDemand, 'id' | 'status' | 'buyerId' | 'buyerName'>) => void;
  onMakeOffer: (listingId: string, offeredPricePerKg: number, requestedQuantityKg: number, message: string) => void;
  onOpenAiAdvisor: (initialPrompt?: string) => void;
}

export const BuyerPortal: React.FC<BuyerPortalProps> = ({
  listings,
  demands,
  offers,
  onPostDemand,
  onMakeOffer,
  onOpenAiAdvisor,
}) => {
  // Search & filter states
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [maxDistanceKm, setMaxDistanceKm] = useState(250);
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [minLotKg, setMinLotKg] = useState(1000);

  // Modals
  const [showDemandModal, setShowDemandModal] = useState(false);
  const [selectedListingForOffer, setSelectedListingForOffer] = useState<CommodityListing | null>(null);
  const [offerPrice, setOfferPrice] = useState('29');
  const [offerQuantity, setOfferQuantity] = useState('2000');
  const [offerMessage, setOfferMessage] = useState('Ready for prompt dispatch from Nashik to Pune hub. Full digital escrow commitment.');

  // New demand form state
  const [demandCrop, setDemandCrop] = useState('Onion');
  const [demandQuantity, setDemandQuantity] = useState('8000');
  const [demandMinPrice, setDemandMinPrice] = useState('28');
  const [demandMaxPrice, setDemandMaxPrice] = useState('32');
  const [demandLocation, setDemandLocation] = useState('Pune (Hadapsar Hub)');
  const [demandGrade, setDemandGrade] = useState<QualityGrade>('Grade A');

  // Filter listings
  const filteredListings = listings.filter((l) => {
    if (selectedCrop !== 'ALL' && l.crop.toLowerCase() !== selectedCrop.toLowerCase()) return false;
    if (selectedGrade !== 'ALL' && l.grade !== selectedGrade) return false;
    if (l.quantityKg < minLotKg) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        l.crop.toLowerCase().includes(q) ||
        l.farmerName.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenOfferModal = (listing: CommodityListing) => {
    setSelectedListingForOffer(listing);
    setOfferPrice(String(listing.expectedPricePerKg || listing.minPricePerKg + 2));
    setOfferQuantity(String(listing.quantityKg));
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingForOffer) return;
    onMakeOffer(
      selectedListingForOffer.id,
      Number(offerPrice) || 25,
      Number(offerQuantity) || 1000,
      offerMessage
    );
    setSelectedListingForOffer(null);
  };

  const handleSubmitDemand = (e: React.FormEvent) => {
    e.preventDefault();
    onPostDemand({
      companyType: 'Organized Retail Chain',
      crop: demandCrop,
      requiredQuantityKg: Number(demandQuantity) || 5000,
      targetPriceRange: {
        min: Number(demandMinPrice) || 20,
        max: Number(demandMaxPrice) || 25,
      },
      location: demandLocation,
      deliveryDeadline: '2026-09-25',
      qualityRequirement: demandGrade,
    });
    setShowDemandModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Buyer Company Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xl border border-slate-700 shadow-xs">
              FM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">FreshMart Supermarkets Ltd</h1>
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  APMC Licensed Buyer
                </span>
              </div>
              <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Hadapsar Regional Hub, Pune, Maharashtra · 45 Metro Stores
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                <span>Escrow Limit: <strong className="text-emerald-700">₹25,00,000 Allocated</strong></span>
                <span>•</span>
                <span>Delivery SLA: <strong className="text-slate-700">48-Hour Cold Chain</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="btn-post-bulk-demand"
              onClick={() => setShowDemandModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-xs shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Bulk Requirement</span>
            </button>
            <button
              id="btn-buyer-ask-ai"
              onClick={() => onOpenAiAdvisor('Which nearby Maharashtra market has the best expected price realization for 8,000 kg onions after logistics?')}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Logistics & Price Optimization</span>
            </button>
          </div>
        </div>

        {/* Active Demands ticker */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Procurement Demands:
          </span>
          {demands.map((d) => (
            <div
              key={d.id}
              className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs"
            >
              <span className="font-bold text-slate-800">{d.crop}:</span>
              <span className="font-mono text-slate-600">{d.requiredQuantityKg.toLocaleString()} kg</span>
              <span className="text-emerald-700 font-semibold font-mono">₹{d.targetPriceRange.min}-{d.targetPriceRange.max}/kg</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                {d.location.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Geospatial & Search Filter Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search by crop, farmer, or region (e.g., "Onion sellers in Nashik")'
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Commodity Filter */}
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white focus:outline-none"
            >
              <option value="ALL">All Commodities</option>
              <option value="Onion">Onion (कांदा)</option>
              <option value="Tomato">Tomato (टोमॅटो)</option>
              <option value="Wheat">Wheat (गहू)</option>
              <option value="Potato">Potato (बटाटा)</option>
              <option value="Soybean">Soybean (सोयाबीन)</option>
            </select>

            {/* Quality Grade */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white focus:outline-none"
            >
              <option value="ALL">All Quality Grades</option>
              <option value="Grade A">Grade A Only</option>
              <option value="Grade B">Grade B</option>
              <option value="Organic Certified">Organic Certified</option>
            </select>

            {/* Min Lot Quantity */}
            <select
              value={minLotKg}
              onChange={(e) => setMinLotKg(Number(e.target.value))}
              className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white focus:outline-none"
            >
              <option value={500}>Min. 500 kg</option>
              <option value={1000}>Min. 1,000 kg</option>
              <option value={2000}>Min. 2,000 kg</option>
              <option value={5000}>Min. 5,000 kg</option>
            </select>
          </div>
        </div>

        {/* Geospatial Radial Search Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              PostgreSQL + PostGIS Query Engine
            </span>
            <span>Radial Search from Pune Hub: <strong>≤ {maxDistanceKm} km</strong></span>
          </div>
          <span>Showing <strong>{filteredListings.length}</strong> qualified farmer lots</span>
        </div>
      </div>

      {/* Commodity Listings Marketplace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => {
          const isAyushOnion = listing.id === 'list-001';
          return (
            <div
              key={listing.id}
              className={`bg-white rounded-xl p-5 border shadow-xs transition-all flex flex-col justify-between ${
                isAyushOnion
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {listing.crop.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{listing.crop}</h3>
                      <p className="text-xs text-slate-500">{listing.variety}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                    {listing.grade}
                  </span>
                </div>

                {isAyushOnion && (
                  <div className="mt-3 bg-blue-50 text-blue-900 p-2 rounded-lg text-[11px] font-medium border border-blue-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Exact Match for FreshMart 8,000 kg Demand Specification</span>
                  </div>
                )}

                <div className="py-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Farmer:</span>
                    <span className="font-semibold text-slate-800">{listing.farmerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="text-slate-700 font-medium">{listing.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Available Lot:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {listing.quantityKg.toLocaleString()} kg
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Asking Min Price:</span>
                    <span className="font-mono font-bold text-blue-700 text-sm">
                      ₹{listing.minPricePerKg}/kg
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Storage / Quality:</span>
                    <span className="text-slate-600">{listing.storageType}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  id={`btn-make-offer-${listing.id}`}
                  onClick={() => handleOpenOfferModal(listing)}
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Make Direct Escrow Offer</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAKE OFFER MODAL (Direct execution of Page 7 & 8 offer flow) */}
      {selectedListingForOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  <span>Submit Direct Purchase Offer</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  To {selectedListingForOffer.farmerName} · {selectedListingForOffer.crop} ({selectedListingForOffer.variety})
                </p>
              </div>
              <button
                onClick={() => setSelectedListingForOffer(null)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitOffer} className="space-y-4 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Farmer's Minimum Asking Price:</span>
                  <span className="font-mono font-bold text-stone-800">₹{selectedListingForOffer.minPricePerKg}/kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Total Available Lot:</span>
                  <span className="font-mono font-bold text-stone-800">{selectedListingForOffer.quantityKg.toLocaleString()} kg</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Your Offered Price (₹/kg)
                  </label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-bold text-sm text-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    min="1"
                    step="0.5"
                    required
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    e.g. ₹29/kg (from design spec)
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Requested Quantity (kg)
                  </label>
                  <input
                    type="number"
                    value={offerQuantity}
                    onChange={(e) => setOfferQuantity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-bold text-sm text-stone-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    max={selectedListingForOffer.quantityKg}
                    min="100"
                    step="50"
                    required
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    Max: {selectedListingForOffer.quantityKg.toLocaleString()} kg
                  </span>
                </div>
              </div>

              {/* Total Escrow Calculation */}
              <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-900">Total Contract Value:</span>
                  <span className="font-mono font-bold text-lg text-blue-950">
                    ₹{((Number(offerPrice) || 0) * (Number(offerQuantity) || 0)).toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-blue-700 mt-1">
                  100% secured via FarmLink PostgreSQL ACID Escrow upon farmer acceptance.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Message / Logistics Terms</label>
                <textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setSelectedListingForOffer(null)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow-sm"
                >
                  Transmit Offer to Farmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST REQUIREMENT MODAL */}
      {showDemandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>Post Institutional Commodity Demand</span>
              </h3>
              <button
                onClick={() => setShowDemandModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDemand} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Crop</label>
                  <select
                    value={demandCrop}
                    onChange={(e) => setDemandCrop(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Onion">Onion</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Potato">Potato</option>
                    <option value="Soybean">Soybean</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Required Quantity (kg)</label>
                  <input
                    type="number"
                    value={demandQuantity}
                    onChange={(e) => setDemandQuantity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-medium text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Min Target Price (₹/kg)</label>
                  <input
                    type="number"
                    value={demandMinPrice}
                    onChange={(e) => setDemandMinPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-medium text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Max Target Price (₹/kg)</label>
                  <input
                    type="number"
                    value={demandMaxPrice}
                    onChange={(e) => setDemandMaxPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-medium text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Delivery Destination Hub</label>
                <input
                  type="text"
                  value={demandLocation}
                  onChange={(e) => setDemandLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Quality Standard Required</label>
                <select
                  value={demandGrade}
                  onChange={(e) => setDemandGrade(e.target.value as QualityGrade)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Grade A">Grade A (Super Clean / Uniform)</option>
                  <option value="Grade B">Grade B (Commercial Quality)</option>
                  <option value="Organic Certified">Organic Certified</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowDemandModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow-sm"
                >
                  Publish Demand to Mandi Network
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
