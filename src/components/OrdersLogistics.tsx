import React, { useState } from 'react';
import {
  PackageCheck,
  Truck,
  ShieldCheck,
  Clock,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  ArrowRight,
  Database,
  FileText,
  Navigation,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrdersLogisticsProps {
  orders: Order[];
  onAdvanceOrderStatus: (orderId: string) => void;
  onOpenAiAdvisor: (prompt?: string) => void;
}

export const OrdersLogistics: React.FC<OrdersLogisticsProps> = ({
  orders,
  onAdvanceOrderStatus,
  onOpenAiAdvisor,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order>(orders[0] || null);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'OFFER_ACCEPTED':
      case 'ORDER_CREATED':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-semibold">Order Created</span>;
      case 'ESCROW_LOCKED':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-semibold">Escrow Secured</span>;
      case 'LOGISTICS_ASSIGNED':
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-xs font-semibold">Truck Assigned</span>;
      case 'IN_TRANSIT':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse">In Transit</span>;
      case 'DELIVERED':
        return <span className="bg-teal-100 text-teal-800 px-2.5 py-1 rounded-full text-xs font-semibold">Delivered at Hub</span>;
      case 'PAYMENT_RELEASED':
        return <span className="bg-emerald-700 text-white px-2.5 py-1 rounded-full text-xs font-semibold">Settled & Completed</span>;
      default:
        return <span className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* PostgreSQL Transactional Architecture Info Banner */}
      <div className="bg-[#0F172A] text-slate-100 rounded-xl p-5 border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>PostgreSQL ACID Transactional Workflow</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30 font-mono">
                BEGIN; COMMIT;
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Eliminates orphaned states: payments cannot succeed without an order, and contract volume is immutably locked across farmer, buyer, and weighbridge logs.
            </p>
          </div>
        </div>
        <button
          onClick={() => onOpenAiAdvisor('Why is PostgreSQL essential for order escrow transactions compared to NoSQL?')}
          className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors shrink-0"
        >
          View ACID Rationale
        </button>
      </div>

      {/* Main Order View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Orders List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Contracts & Dispatches ({orders.length})
          </h3>
          {orders.map((ord) => (
            <div
              key={ord.id}
              onClick={() => setSelectedOrder(ord)}
              className={`cursor-pointer bg-white rounded-xl p-4 border transition-all shadow-xs ${
                selectedOrder?.id === ord.id
                  ? 'border-blue-600 ring-2 ring-blue-600/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-mono font-bold text-xs text-slate-900">{ord.id}</span>
                {getStatusBadge(ord.status)}
              </div>
              <div className="pt-2 space-y-1 text-xs">
                <p className="font-bold text-slate-900 text-sm">
                  {ord.quantityKg.toLocaleString()} kg {ord.crop}
                </p>
                <p className="text-slate-500 flex justify-between">
                  <span>Seller: {ord.farmerName}</span>
                  <span className="font-mono font-semibold text-emerald-700">₹{ord.pricePerKg}/kg</span>
                </p>
                <p className="text-slate-500 flex justify-between">
                  <span>Buyer: {ord.buyerName}</span>
                  <span className="font-mono font-bold text-slate-900">₹{ord.totalAmount.toLocaleString()}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Selected Order Detail & Live Logistics Tracking */}
        {selectedOrder ? (
          <div className="lg:col-span-2 space-y-5">
            {/* Order Overview Card */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-slate-900">{selectedOrder.id}</span>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Commodity Contract: {selectedOrder.crop} · Created via FarmLink Smart Deal Engine
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Total Escrow Value</span>
                  <span className="text-xl font-bold font-mono text-emerald-700">
                    ₹{selectedOrder.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress Stepper (PostgreSQL state transitions) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Contract Execution Pipeline
                </h4>
                <div className="relative border-l-2 border-blue-500 ml-3 pl-4 space-y-4 text-xs">
                  {selectedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full border-2 ${
                          step.completed
                            ? 'bg-blue-600 border-white'
                            : 'bg-slate-200 border-white'
                        }`}
                      ></div>
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.step.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{step.timestamp}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Logistics & Driver Tracker */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Live GPS & Logistics Telemetry (MahaKisan Network)</span>
                  </div>
                  <span className="font-mono text-[11px] bg-slate-200 px-2 py-0.5 rounded font-semibold text-slate-800">
                    {selectedOrder.logistics.trackingId}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Vehicle:</span>
                    <p className="font-mono font-bold text-slate-800">{selectedOrder.logistics.vehicleNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Driver:</span>
                    <p className="font-semibold text-slate-800">{selectedOrder.logistics.driverName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Route Checkpoint:</span>
                    <p className="font-semibold text-blue-700">{selectedOrder.logistics.currentCheckpoint}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Estimated ETA:</span>
                    <p className="font-mono font-bold text-slate-900">{selectedOrder.logistics.etaHours} Hours</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    Distance: {selectedOrder.logistics.distanceKm} km (Nashik ➔ Pune Highway)
                  </span>
                  <span className="flex items-center gap-1 font-mono text-slate-700">
                    <Phone className="w-3.5 h-3.5" />
                    {selectedOrder.logistics.driverPhone}
                  </span>
                </div>
              </div>

              {/* Simulation Advancement Button */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Escrow status: <strong>{selectedOrder.escrowStatus.replace(/_/g, ' ')}</strong></span>
                </div>

                {selectedOrder.status !== 'PAYMENT_RELEASED' && (
                  <button
                    id="btn-advance-order-pipeline"
                    onClick={() => onAdvanceOrderStatus(selectedOrder.id)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all"
                  >
                    <span>Simulate Next Pipeline Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white rounded-xl p-8 border border-slate-200 text-center text-slate-500 text-sm">
            Select an order to view contract parameters and live dispatch telemetry.
          </div>
        )}
      </div>
    </div>
  );
};
