import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Trash2,
  CalendarCheck,
  PhoneCall,
  Activity,
  HeartPulse,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { Doctor } from '../types/hospital';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface AiChatbotProps {
  language: Language;
  onOpenBookingModal: (doctorId?: string) => void;
  doctors: Doctor[];
}

export const AiChatbot: React.FC<AiChatbotProps> = ({
  language,
  onOpenBookingModal,
  doctors,
}) => {
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'bot',
      text: t.chatWelcomeGreeting,
      timestamp: new Date(),
    },
  ]);

  // Synchronize initial greeting when language changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome-1') {
        return [
          {
            id: 'welcome-1',
            sender: 'bot',
            text: t.chatWelcomeGreeting,
            timestamp: new Date(),
          },
        ];
      }
      return prev;
    });
  }, [language, t.chatWelcomeGreeting]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          history: messages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.reply || (language === 'bn' ? 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি।' : 'Sorry, no answer available.');

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botReply,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      // Heuristic fallback response
      let fallback = '';
      const lower = text.toLowerCase();
      if (lower.includes('doctor') || lower.includes('ডাক্তার') || lower.includes('appointment') || lower.includes('সিরিয়াল')) {
        fallback = language === 'bn'
          ? 'আমাদের হাসপাতালে মেডিসিন, হৃদরোগ, নিউরোলজি, গাইনি ও অর্থোপেডিক্স বিভাগের শীর্ষ বিশেষজ্ঞ চিকিৎসকরা সেবা দিচ্ছেন। আপনি উপরে থাকা "অ্যাপয়েন্টমেন্ট নিন" বোতামটি চেপে সিরিয়াল বুক করতে পারেন।'
          : 'Our hospital has expert physicians across Cardiology, Medicine, Neurology, and Surgery. You can book an appointment using the "Book Appointment" button above.';
      } else if (lower.includes('emergency') || lower.includes('জরুরি') || lower.includes('ambulance') || lower.includes('অ্যাম্বুলেন্স')) {
        fallback = language === 'bn'
          ? 'আমাদের ২৪/৭ জরুরি বিভাগ ও আইসিইউ খোলা রয়েছে। তাৎক্ষণিক অ্যাম্বুলেন্স পেতে হটলাইনে সরাসরি কল করুন।'
          : 'Our 24/7 Emergency and ICU care is available. Call our dedicated emergency hotline directly for immediate assistance.';
      } else if (lower.includes('bill') || lower.includes('বিল') || lower.includes('টাকা') || lower.includes('cost')) {
        fallback = language === 'bn'
          ? 'আমাদের নতুন ডিজিটাল বিলিং সিস্টেমের মাধ্যমে যেকোনো রোগী বা অ্যাডমিন ওপিডি কনসালটেশন, বেড চার্জ ও ল্যাব টেস্টের বিল দেখতে এবং বিকাশ/কার্ড দিয়ে পরিশোধ করতে পারেন।'
          : 'Our Central Billing System allows patients and staff to view itemized invoices and pay online securely via mobile banking or cards.';
      } else {
        fallback = language === 'bn'
          ? `ধন্যবাদ আপনার বার্তার জন্য। আমি হাসপাতাল স্বাস্থ্য সহকারী। ডাক্তার শিডিউল, জরুরি সেবা, রক্তদান বা বিলিং সংক্রান্ত যেকোনো প্রশ্নে আমি সহায়তা করতে পারি।`
          : `Thank you for reaching out. I am your Hospital Healthcare Assistant. I can help you with specialist appointments, emergency ambulance, and hospital billing inquiries.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: fallback,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: t.chatWelcomeGreeting,
        timestamp: new Date(),
      },
    ]);
  };

  const sampleSuggestions = language === 'bn'
    ? ['কার্ডিওলজি বিশেষজ্ঞ ডাক্তার কারা আছেন?', 'জরুরি অ্যাম্বুলেন্স পেতে কী করব?', 'বিলিং সিস্টেমে কীভাবে পেমেন্ট করব?', 'আইসিইউ বেড খালি আছে কি?']
    : ['Who are the Cardiology specialists?', 'How do I call an ambulance?', 'How to pay invoices online?', 'Are ICU beds available?'];

  return (
    <div className="fixed bottom-4 right-4 z-50 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-xl shadow-teal-600/30 transition-all transform hover:scale-105 active:scale-95"
          aria-label="Open AI Assistant"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>

          <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm tracking-tight">
            <Bot className="w-4 h-4" />
            <span>{language === 'bn' ? 'কেয়ারপাল্স AI সহকারী' : 'CarePulse AI Assistant'}</span>
          </div>

          <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-teal-700 text-white px-4 py-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                  <span>{t.chatBotTitle}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </h3>
                <p className="text-[10px] text-teal-100">
                  {t.chatBotSubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title="Clear Conversation"
                className="p-1 rounded text-teal-200 hover:text-white hover:bg-white/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-teal-200 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action bar inside chat */}
          <div className="bg-slate-50 px-4 py-1.5 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-teal-600" />
              <span>{language === 'bn' ? 'সরাসরি সিরিয়াল বুকিং:' : 'Direct Booking:'}</span>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenBookingModal();
              }}
              className="text-teal-700 hover:underline font-bold"
            >
              {t.bookAppointmentBtn} →
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-teal-700 border border-slate-200'
                    }`}
                  >
                    {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-teal-600 text-white rounded-tr-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-teal-700">
                  <Bot className="w-3 h-3" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2 text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {sampleSuggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sug)}
                className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-800 border border-slate-200 whitespace-nowrap transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={language === 'bn' ? 'ডাক্তার, সেবা বা সমস্যা সম্পর্কে লিখুন...' : 'Ask about doctors, treatments, billing...'}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-40 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
