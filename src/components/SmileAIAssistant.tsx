import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Plane,
  Building2,
  Train,
  Bus,
  Car,
  Palmtree,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  ChevronDown,
  Info,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { BookingCategory, CityOption } from '../data/travelData';

export interface SmileSuggestedSearch {
  category: BookingCategory | 'international-planner';
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  departureDate?: string;
  travellers?: number;
  actionLabel?: string;
}

export interface SmileMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  followUpQuestions?: string[];
  suggestedSearch?: SmileSuggestedSearch | null;
  isLiveAI?: boolean;
}

interface SmileAIAssistantProps {
  activeCategory: BookingCategory;
  fromCity: CityOption;
  toCity: CityOption;
  departureDate: string;
  travellers: number;
  currency: string;
  onHandoffSearch: (searchData: SmileSuggestedSearch) => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
}

const INITIAL_SUGGESTIONS = [
  'Flights from Delhi to Tokyo',
  'Find hotels in Dubai',
  'Plan a 5-day trip to Bali',
  'Find trains from Delhi to Mumbai',
  'Create my international travel itinerary',
  'Check visa rules for Japan',
];

export const SmileAIAssistant: React.FC<SmileAIAssistantProps> = ({
  activeCategory,
  fromCity,
  toCity,
  departureDate,
  travellers,
  currency,
  onHandoffSearch,
  onNotify,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const initialGreeting: SmileMessage = {
    id: 'msg-initial-greeting',
    sender: 'assistant',
    text: "Hi there! 👋 I'm **SMILE**, your personal travel assistant. Let's plan your next trip together.\n\nAsk me about flights, hotels, trains, buses, cabs, tour packages, custom international itineraries, visa rules, or travel budgets. Where would you like to explore?",
    timestamp: 'Just now',
    followUpQuestions: [
      'Flights from Delhi to Tokyo',
      'Find hotels in Dubai',
      'Plan a 5-day trip to Bali',
      'Find trains from Delhi to Mumbai',
    ],
  };

  const [messages, setMessages] = useState<SmileMessage[]>([initialGreeting]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasOpenedOnce(true);
      setShowTooltip(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages]);

  // Hide the floating tooltip after 8 seconds if untouched
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isTyping) return;

    const userMsg: SmileMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const response = await fetch('/api/smile/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          conversationHistory,
          context: {
            activeCategory,
            fromCity: `${fromCity.city} (${fromCity.code})`,
            toCity: `${toCity.city} (${toCity.code})`,
            departureDate,
            travellers,
            currency,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: SmileMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I'm ready to help you plan your journey. Tell me your destination and dates!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUpQuestions: data.followUpQuestions || [],
        suggestedSearch: data.suggestedSearch || null,
        isLiveAI: data.isLiveAI,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.warn('SMILE Assistant communication note:', err);
      // Fallback message
      const fallbackMsg: SmileMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: `### ✈️ Planning your trip to ${toCity.city || 'your dream destination'}\n\nI can help you search for the best flights, stays, or train connections. Click below to view live options directly on TripYehh.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedSearch: {
          category: activeCategory || 'flights',
          fromCity: fromCity.city,
          fromCode: fromCity.code,
          toCity: toCity.city,
          toCode: toCity.code,
          departureDate,
          travellers,
          actionLabel: `Search ${toCity.city} on TripYehh`,
        },
        followUpQuestions: [
          'Flights from Delhi to Tokyo',
          'Find hotels in Dubai',
          'Plan a 5-day trip to Bali',
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        ...initialGreeting,
        id: `msg-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setShowMenu(false);
    onNotify('New Chat Started', 'SMILE conversation reset successfully.', 'info');
  };

  const handlePerformHandoff = (suggested: SmileSuggestedSearch) => {
    onHandoffSearch(suggested);
    // On mobile, close to allow browsing search results
    if (window.innerWidth < 640) {
      setIsOpen(false);
    }
  };

  // Helper to render markdown-like text smoothly (headers, bullets, bold, italics)
  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          // Headers
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-slate-900 text-sm mt-2 mb-1 flex items-center gap-1.5">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-extrabold text-slate-900 text-sm sm:text-base mt-2 mb-1">
                {trimmed.replace('## ', '')}
              </h3>
            );
          }

          // Bullet point
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const bulletContent = trimmed.slice(2);
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1">
                <span className="text-[#08A9F7] font-bold text-sm leading-none mt-0.5">•</span>
                <span className="flex-1 text-slate-700">
                  {formatInline(bulletContent)}
                </span>
              </div>
            );
          }

          // Regular paragraph
          return (
            <p key={idx} className="text-slate-700">
              {formatInline(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  const formatInline = (text: string) => {
    // Replace **bold**
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="text-slate-600 italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  const getCategoryIcon = (cat?: string) => {
    switch (cat) {
      case 'hotels':
        return <Building2 className="w-4 h-4 text-emerald-500" />;
      case 'trains':
        return <Train className="w-4 h-4 text-amber-500" />;
      case 'buses':
        return <Bus className="w-4 h-4 text-indigo-500" />;
      case 'cabs':
        return <Car className="w-4 h-4 text-orange-500" />;
      case 'holidays':
        return <Palmtree className="w-4 h-4 text-teal-500" />;
      case 'experiences':
        return <Compass className="w-4 h-4 text-purple-500" />;
      case 'international-planner':
        return <Sparkles className="w-4 h-4 text-[#08A9F7]" />;
      default:
        return <Plane className="w-4 h-4 text-[#08A9F7]" />;
    }
  };

  return (
    <>
      {/* ===================================================================
          1. FLOATING AI ASSISTANT BUTTON (Bottom-Right, Brand Palette)
      =================================================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end flex-col gap-2 pointer-events-none select-none">
        {/* Optional Contextual Tooltip Pill */}
        {showTooltip && !isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto bg-[#082B59] text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xl border border-cyan-400/30 flex items-center gap-2 mb-1 animate-bounce cursor-pointer hover:bg-[#0B3A75] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#08A9F7] animate-pulse" />
            <span>Need travel help? Ask <strong>SMILE</strong></span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-slate-400 hover:text-white ml-1 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Circular Floating Chatbot Button */}
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open SMILE AI Travel Assistant"
            className="pointer-events-auto group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#082B59] via-[#0A3D7C] to-[#08A9F7] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(8,169,247,0.35)] hover:shadow-[0_15px_35px_rgba(8,169,247,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/40 cursor-pointer"
          >
            {/* Pulsing ring aura */}
            <span className="absolute -inset-1 rounded-full bg-[#08A9F7]/30 blur-sm animate-pulse group-hover:bg-[#08A9F7]/50" />

            {/* AI Assistant Icon with Brand Smile Indicator */}
            <div className="relative flex flex-col items-center justify-center">
              <div className="relative">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-200 group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#082B59] rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#082B59] rounded-full" />
              </div>
              <span className="text-[9px] font-black tracking-wider uppercase text-cyan-200 mt-0.5 font-display">
                SMILE
              </span>
            </div>
          </button>
        )}
      </div>

      {/* ===================================================================
          2. SMILE CHAT WINDOW PANEL
      =================================================================== */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-3 top-16 sm:inset-auto sm:right-6 sm:bottom-6 sm:top-auto z-50 sm:w-[410px] sm:h-[620px] max-h-[92vh] bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,43,89,0.25)] border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#082B59] via-[#0A3D7C] to-[#082B59] text-white px-4 py-3.5 flex items-center justify-between border-b border-cyan-500/20 shadow-sm relative">
            <div className="flex items-center gap-3">
              {/* Bot Avatar */}
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#08A9F7] to-[#0578B3] flex items-center justify-center shadow-md border border-white/20">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#082B59] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-base font-display text-white tracking-wide">
                    SMILE AI
                  </h3>
                  <span className="bg-[#08A9F7]/25 text-cyan-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-cyan-400/30">
                    TripYehh
                  </span>
                </div>
                <p className="text-[11px] text-cyan-100 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  AI Travel Assistant · Online
                </p>
              </div>
            </div>

            {/* Header Menu / Actions */}
            <div className="flex items-center gap-1">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMenu(!showMenu)}
                  aria-label="Chat options"
                  title="Chat Options"
                  className="p-2 rounded-xl text-cyan-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-10 w-44 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-1.5 z-20 text-xs">
                    <button
                      type="button"
                      onClick={handleClearChat}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-semibold cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      Start New Chat
                    </button>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close SMILE Chat Window"
                className="p-2 rounded-xl text-cyan-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="bg-sky-50/80 border-b border-sky-100 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-sky-900">
            <span className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-[#08A9F7] shrink-0" />
              <span>Smart travel planning powered by TripYehh</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Session Active</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                {/* Bubble Container */}
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#082B59] to-[#0A3D7C] text-white rounded-br-xs border border-blue-900'
                      : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                  }`}
                >
                  {msg.sender === 'assistant' ? (
                    renderFormattedText(msg.text)
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}

                  {/* Embedded "Search on TripYehh" Action Handoff Card */}
                  {msg.suggestedSearch && (
                    <div className="mt-3 pt-3 border-t border-slate-100 bg-sky-50/70 -mx-1.5 -mb-1.5 p-2.5 rounded-xl border border-sky-200/60">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                          {getCategoryIcon(msg.suggestedSearch.category)}
                          <span>TripYehh Quick Handoff</span>
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100/70 px-1.5 py-0.5 rounded-md">
                          Verified Route
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2">
                        <span>{msg.suggestedSearch.fromCity} ({msg.suggestedSearch.fromCode})</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#08A9F7]" />
                        <span>{msg.suggestedSearch.toCity} ({msg.suggestedSearch.toCode})</span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {msg.suggestedSearch.departureDate || departureDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          {msg.suggestedSearch.travellers || travellers} {((msg.suggestedSearch.travellers || travellers) === 1 ? 'Guest' : 'Guests')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePerformHandoff(msg.suggestedSearch!)}
                        className="w-full bg-[#082B59] hover:bg-[#0A3D7C] text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer group"
                      >
                        <span>{msg.suggestedSearch.actionLabel || 'Search on TripYehh'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#08A9F7] group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  )}

                  {/* Timestamp and live AI badge */}
                  <div
                    className={`mt-1.5 flex items-center justify-between text-[10px] ${
                      msg.sender === 'user' ? 'text-cyan-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'assistant' && (
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-[#08A9F7]" />
                        <span>SMILE Concierge</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Follow-up Suggestion Chips */}
                {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[88%]">
                    {msg.followUpQuestions.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        type="button"
                        onClick={() => handleSendMessage(q)}
                        className="bg-white hover:bg-sky-50 text-slate-700 hover:text-[#082B59] text-[11px] font-medium py-1 px-2.5 rounded-full border border-slate-200 hover:border-cyan-300 shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>{q}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="bg-white border border-slate-200/80 rounded-2xl rounded-bl-xs p-3 shadow-xs flex items-center gap-1.5 text-slate-500 text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#08A9F7] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-[#08A9F7] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-[#08A9F7] animate-bounce" />
                  <span className="text-[11px] text-slate-500 font-medium ml-1.5">
                    SMILE is preparing travel options...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Shelf (Always available for one-tap travel discovery) */}
          {messages.length <= 2 && (
            <div className="px-3.5 py-2 bg-slate-100/70 border-t border-slate-200/60 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                Try:
              </span>
              {INITIAL_SUGGESTIONS.map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => handleSendMessage(suggestion)}
                  className="bg-white text-slate-700 hover:text-[#082B59] text-[11px] font-medium py-1 px-2.5 rounded-full border border-slate-200 hover:border-cyan-400 shadow-2xs transition-all cursor-pointer shrink-0"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Bottom Chat Input Form */}
          <div className="p-3 bg-white border-t border-slate-200/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask SMILE anything about travel..."
                  className="w-full bg-slate-100/90 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm py-2.5 pl-3.5 pr-8 rounded-2xl border border-transparent focus:border-[#08A9F7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#08A9F7]/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                aria-label="Send message to SMILE"
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                  inputMessage.trim() && !isTyping
                    ? 'bg-gradient-to-tr from-[#082B59] to-[#08A9F7] text-white shadow-md hover:scale-105 active:scale-95'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>SMILE AI · TripYehh Personal Travel Companion</span>
              <span className="text-[9px]">Prices confirmed on search</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
