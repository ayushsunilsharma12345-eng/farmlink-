import React, { useState } from 'react';
import { RouteOption, UserRole } from '../types';
import { Ticket, QrCode, X, CheckCircle2, Share2, Download, ShieldCheck, Leaf, Clock, ArrowRight } from 'lucide-react';

interface TicketBookingModalProps {
  route: RouteOption | null;
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
}

export const TicketBookingModal: React.FC<TicketBookingModalProps> = ({
  route,
  isOpen,
  onClose,
  userRole,
}) => {
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRef] = useState(`OMNI-${Math.floor(100000 + Math.random() * 900000)}`);

  if (!isOpen || !route) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <Ticket className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              OmniVoyage Electronic Boarding Pass
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Boarding Pass Body */}
        <div className="p-6 space-y-5 text-xs">
          {isBooked ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Simulated Booking Confirmed!</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Kafka event broadcast to topic <code className="text-sky-400 font-mono">travel.route.requests</code>. Seat hold locked in PostgreSQL with 0 latency.
              </p>
              <div className="text-xs font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800 inline-block text-slate-300">
                Booking Reference: <span className="text-emerald-400 font-bold">{bookingRef}</span>
              </div>
            </div>
          ) : (
            <>
              {/* Departure & Arrival Big Codes */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-slate-100 font-mono">{route.origin.code}</div>
                  <div className="text-xs text-slate-400 font-medium">{route.origin.city}</div>
                  <div className="text-xs text-sky-400 font-bold mt-1">{route.departureTime}</div>
                </div>

                <div className="flex flex-col items-center px-4">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                    {route.mode.toUpperCase()}
                  </span>
                  <div className="w-20 h-0.5 bg-slate-700 my-1 relative">
                    <div className="w-2 h-2 rounded-full bg-sky-400 absolute -top-[3px] left-1/2 -translate-x-1/2" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{route.durationMinutes} min</span>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-slate-100 font-mono">{route.destination.code}</div>
                  <div className="text-xs text-slate-400 font-medium">{route.destination.city}</div>
                  <div className="text-xs text-emerald-400 font-bold mt-1">{route.arrivalTime}</div>
                </div>
              </div>

              {/* Fare & Carbon Specs */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Fare</span>
                  <span className="text-base font-bold text-sky-400 font-mono">${route.priceUSD}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Footprint</span>
                  <span className="text-base font-bold text-teal-400 font-mono">{route.co2Kg} kg</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Reliability</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">{route.reliabilityScore}%</span>
                </div>
              </div>

              {/* Simulated QR Code */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-200">PASSENGER: AYUSH SHARMA</div>
                  <div className="text-[10px] text-slate-400 font-mono">SEAT: 14A • TERMINAL 2 • GATE B12</div>
                  <div className="text-[10px] text-slate-500 font-mono">REF: {bookingRef}</div>
                </div>
                <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center">
                  <QrCode className="w-14 h-14 text-slate-950" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs transition-colors"
          >
            Close
          </button>

          {!isBooked ? (
            <button
              onClick={() => setIsBooked(true)}
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition-transform active:scale-95"
            >
              Confirm Simulated Ticket
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
