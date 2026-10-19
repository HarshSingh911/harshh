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
  Calendar,
  Users,
  Info,
} from 'lucide-react';
import { BookingCategory, CityOption } from '../data/travelData';
import { SmileAnimeCompanion, SmileCharacterState } from './SmileAnimeCompanion';

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

const OFFICIAL_SUGGESTED_PROMPTS = [
  'Find flights',
  'Discover hotels',
  'Plan an international trip',
  'Create my itinerary',
  'Find holiday packages',
  'Help me estimate my travel budget',
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
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [manualCharacterState, setManualCharacterState] = useState<SmileCharacterState | undefined>(
    undefined
  );
  const [apiNotice, setApiNotice] = useState<string | null>(null);

  const initialGreeting: SmileMessage = {
    id: 'msg-initial-greeting',
    sender: 'assistant',
    text: "Hi there! I'm SMILE, your personal travel assistant. Where would you like to go next?",
    timestamp: 'Just now',
    followUpQuestions: OFFICIAL_SUGGESTED_PROMPTS,
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
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages]);

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
    setIsSpeaking(false);
    setManualCharacterState(undefined);

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

      if (data.notice) {
        setApiNotice(data.notice);
      }

      const assistantMsg: SmileMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text:
          data.reply ||
          "I'm ready to help you plan your journey. Where would you like to go next?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUpQuestions: data.followUpQuestions || OFFICIAL_SUGGESTED_PROMPTS.slice(0, 3),
        suggestedSearch: data.suggestedSearch || null,
        isLiveAI: data.isLiveAI,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      // Trigger speaking animation for character
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 3800);
    } catch (err: any) {
      console.warn('SMILE Assistant communication note:', err);
      // Fallback message connecting to TripYehh search
      const fallbackMsg: SmileMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: `### ✈️ Planning your trip to ${toCity.city || 'your dream destination'}\n\nI can help you search for the best flights, stays, holiday packages, or custom itineraries. Click below to view live options directly on TripYehh.`,
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
        followUpQuestions: OFFICIAL_SUGGESTED_PROMPTS.slice(0, 3),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 3800);
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
    setIsSpeaking(false);
    setManualCharacterState('happy');
    setTimeout(() => setManualCharacterState(undefined), 2000);
    onNotify('New Chat Started', 'SMILE conversation reset successfully.', 'info');
  };

  const handlePerformHandoff = (suggested: SmileSuggestedSearch) => {
    onHandoffSearch(suggested);
    // On small screens, close the chat to allow user to view results
    if (window.innerWidth < 640) {
      setIsOpen(false);
    }
  };

  // Helper to render markdown-like text smoothly
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
              <h4
                key={idx}
                className="font-bold text-[#082B59] text-sm mt-2 mb-1 flex items-center gap-1.5"
              >
                {trimmed.replace('### ', '')}
              </h4>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3
                key={idx}
                className="font-extrabold text-[#082B59] text-sm sm:text-base mt-2 mb-1"
              >
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
                <span className="flex-1 text-slate-700">{formatInline(bulletContent)}</span>
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
          1. FLOATING ASSISTANT (Bottom-Left)
      =================================================================== */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex items-start flex-col gap-1 pointer-events-none select-none">
        {!isOpen && (
          <div className="pointer-events-auto relative flex flex-col items-center">
            {/* SMILE Avatar Launcher Button */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open SMILE AI Travel Assistant"
              className="relative p-1 bg-transparent cursor-pointer group focus:outline-none drop-shadow-md"
            >
              <SmileAnimeCompanion
                size="launcher"
                isChatOpen={false}
                showSpeechBubble={true}
              />
            </button>
          </div>
        )}
      </div>

      {/* ===================================================================
          2. SMILE CHAT WINDOW PANEL (Left Side, Rounded & Spacious)
      =================================================================== */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-3 top-16 sm:inset-auto sm:left-6 sm:bottom-6 sm:top-auto z-50 sm:w-[420px] sm:h-[610px] max-h-[92vh] bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,43,89,0.18)] border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header: Clean White / Light Background with Navy Blue Typography */}
          <div className="bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-100 shadow-2xs relative">
            <div className="flex items-center gap-3">
              {/* Anime Avatar in Header */}
              <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                <SmileAnimeCompanion
                  size="chat-header"
                  isThinking={isTyping}
                  isSpeaking={isSpeaking}
                  manualState={manualCharacterState}
                  isChatOpen={true}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-[15px] text-[#082B59] tracking-tight">
                    SMILE AI
                  </h3>
                  <span className="bg-cyan-50 text-cyan-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-200">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {isTyping
                    ? 'Thinking & planning...'
                    : isSpeaking
                    ? 'Explaining details...'
                    : 'Your Personal Travel Assistant'}
                </p>
              </div>
            </div>

            {/* Header Actions: New Chat & Close Button */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                aria-label="Start New Chat"
                title="Start New Chat"
                className="p-2 rounded-xl text-slate-500 hover:text-[#082B59] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Chat"
                title="Close"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Optional API Notice Banner */}
          {apiNotice && (
            <div className="bg-cyan-50/70 border-b border-cyan-100/80 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-cyan-900">
              <span className="flex items-center gap-1.5 truncate">
                <Info className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span className="truncate">{apiNotice}</span>
              </span>
              <button
                type="button"
                onClick={() => setApiNotice(null)}
                className="text-[10px] text-cyan-700 hover:text-cyan-900 ml-2 font-semibold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {/* Welcome Character Greeting Card (Shown at top) */}
            {messages.length <= 1 && (
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center gap-3.5">
                <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                  <SmileAnimeCompanion size="chat-header" isChatOpen={true} />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-[#082B59] text-sm">
                    TripYehh Travel Concierge
                  </h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Ask me to find flights, recommend hotels, plan holidays, or estimate your budget!
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                {/* Bubble Container */}
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#082B59] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 rounded-bl-xs border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]'
                  }`}
                >
                  {msg.sender === 'assistant' ? (
                    renderFormattedText(msg.text)
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}

                  {/* Embedded "Search on TripYehh" Action Handoff Card */}
                  {msg.suggestedSearch && (
                    <div className="mt-3 pt-3 border-t border-slate-100 bg-sky-50/60 -mx-1 -mb-1 p-2.5 rounded-xl border border-sky-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                          {getCategoryIcon(msg.suggestedSearch.category)}
                          <span>TripYehh Route</span>
                        </span>
                        <span className="text-[10px] font-semibold text-cyan-700 bg-cyan-100/60 px-1.5 py-0.5 rounded-md">
                          Direct Booking
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold text-[#082B59] mb-2">
                        <span>
                          {msg.suggestedSearch.fromCity} ({msg.suggestedSearch.fromCode})
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#08A9F7]" />
                        <span>
                          {msg.suggestedSearch.toCity} ({msg.suggestedSearch.toCode})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {msg.suggestedSearch.departureDate || departureDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          {msg.suggestedSearch.travellers || travellers}{' '}
                          {(msg.suggestedSearch.travellers || travellers) === 1
                            ? 'Guest'
                            : 'Guests'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePerformHandoff(msg.suggestedSearch!)}
                        className="w-full bg-[#08A9F7] hover:bg-cyan-600 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer group"
                      >
                        <span>{msg.suggestedSearch.actionLabel || 'Search on TripYehh'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  )}

                  {/* Timestamp & Brand tag */}
                  <div
                    className={`mt-1.5 flex items-center justify-between text-[10px] ${
                      msg.sender === 'user' ? 'text-cyan-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'assistant' && (
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-[#08A9F7]" />
                        <span>SMILE Assistant</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Follow-up Prompts */}
                {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                    {msg.followUpQuestions.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        type="button"
                        onClick={() => handleSendMessage(q)}
                        className="bg-white hover:bg-cyan-50 text-slate-700 hover:text-[#082B59] text-[11px] font-medium py-1 px-2.5 rounded-full border border-slate-200 hover:border-cyan-300 shadow-2xs transition-all cursor-pointer flex items-center gap-1"
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
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs p-3 shadow-2xs flex items-center gap-1.5 text-slate-500 text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#08A9F7] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-[#08A9F7] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-[#08A9F7] animate-bounce" />
                  <span className="text-[11px] text-slate-500 font-medium ml-1.5">
                    SMILE is planning your options...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Carousel Shelf */}
          {messages.length <= 2 && (
            <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                Suggested:
              </span>
              {OFFICIAL_SUGGESTED_PROMPTS.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="bg-white text-slate-700 hover:text-[#082B59] text-[11px] font-medium py-1 px-2.5 rounded-full border border-slate-200 hover:border-cyan-400 shadow-2xs transition-all cursor-pointer shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Bottom Chat Input Form */}
          <div className="p-3 bg-white border-t border-slate-100">
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
                  placeholder="Ask SMILE anything about travel…"
                  className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm py-2.5 pl-3.5 pr-4 rounded-xl border border-slate-200 focus:border-[#08A9F7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#08A9F7]/20 transition-all"
                />
              </div>

              {/* Cyan Send Button */}
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                aria-label="Send message to SMILE"
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  inputMessage.trim() && !isTyping
                    ? 'bg-[#08A9F7] hover:bg-cyan-600 text-white shadow-xs hover:scale-105 active:scale-95'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>SMILE AI · Personal Travel Assistant</span>
              <span className="text-[9px]">Verified TripYehh bookings</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
