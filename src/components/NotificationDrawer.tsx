import React from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertCircle,
  Truck,
  IndianRupee,
  Sparkles,
  Layers,
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        <div>
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#0F172A] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Kafka Event Stream</h3>
                <p className="text-[11px] text-slate-400">Push, SMS & Email dispatch simulator</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action bar */}
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              {notifications.filter((n) => !n.read).length} unread events
            </span>
            <button
              onClick={onMarkAllRead}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Mark all as read
            </button>
          </div>

          {/* Notifications List */}
          <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-140px)] text-xs">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  notif.read
                    ? 'bg-white border-slate-200'
                    : 'bg-blue-50/50 border-blue-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                    )}
                    <h4 className="font-bold text-slate-900">{notif.title}</h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono">Kafka Topic: events.{notif.type}</span>
                  <span className="text-blue-700 font-medium">Delivered via Push & SMS</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">Decoupled via Apache Kafka:</p>
          <p>
            Order Service emits <code>ORDER_CREATED</code> to Kafka, which broadcasts to Notification, Logistics, and Analytics asynchronously.
          </p>
        </div>
      </div>
    </div>
  );
};
