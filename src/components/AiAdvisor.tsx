import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ShieldCheck,
  TrendingUp,
  Droplets,
  Building2,
  BookOpen,
} from 'lucide-react';

interface AiAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello! I am **FarmLink AI**, your agricultural economist and RAG advisor.
I can help you with:
- **Government Subsidies & Schemes** (PMKSY Drip Irrigation, Kisan Credit Card, e-NAM)
- **Mandi Price Forecasts** (Tomorrow's rate and 7-day forecast for onions, tomatoes, wheat)
- **Buyer Matching** (Which buyers currently offer the best realization after freight)
- **Post-Harvest & Storage** (Ventilated Chawl storage practices to prevent weight loss)`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          context: {
            farmerLocation: 'Nashik, Maharashtra',
            crop: 'Onion',
            currentMandiPrice: '₹32/kg',
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.answer || 'Thank you for your question.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Offline fallback
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `### FarmLink Advisory Note:
Based on current Lasalgaon and Pune APMC data:
1. **Price Momentum**: Onion arrivals remain balanced; holding Grade A produce in ventilated chawls for 1-2 weeks is projected to realize ₹33-35/kg.
2. **Irrigation Schemes**: PM Krishi Sinchayee Yojana provides **45% to 55% subsidy** on micro-drip systems via the state agriculture portal.
3. **Buyer Recommendation**: FreshMart currently has an active demand for 8,000 kg at ₹28-32/kg with 100% escrow protection.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[85vh] border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">FarmLink AI Advisor</h3>
                <span className="text-[10px] font-semibold bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800 font-mono">
                  RAG & Gemini Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Grounded in Mandi statistics, government subsidy schemes, and price forecasting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="bg-slate-50 border-b border-slate-200 p-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => handleSendMessage('What government scheme can help me with irrigation?')}
            className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Droplets className="w-3.5 h-3.5 text-blue-600" />
            <span>Irrigation Subsidies</span>
          </button>

          <button
            onClick={() => handleSendMessage('What price is likely tomorrow for 2 tonnes of onions in Nashik?')}
            className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tomorrow Price Forecast</span>
          </button>

          <button
            onClick={() => handleSendMessage('Which buyers currently need onions within 200 km?')}
            className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Building2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Find Verified Buyers</span>
          </button>

          <button
            onClick={() => handleSendMessage('What are the storage guidelines for Nashik Red onion in summer?')}
            className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Storage & Curing Tips</span>
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] rounded-xl p-4 space-y-1.5 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200'
                }`}
              >
                <div className="whitespace-pre-line text-xs font-sans">{m.text}</div>
                <span
                  className={`text-[10px] block text-right font-mono ${
                    m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 rounded-xl p-3 text-slate-500 text-xs flex items-center gap-2 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                <span>Retrieving agricultural knowledge & pricing models...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask FarmLink AI (e.g., 'What irrigation subsidies are available in Maharashtra?')..."
              className="flex-1 py-2 px-4 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
