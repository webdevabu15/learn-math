import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, X, Send, Loader2, Trash2, AlertCircle } from 'lucide-react';
import type { MathProblem, MentorMessage, PedagogyTab, TopicMeta } from '../types/math';
import { MathText } from './MathText';
import { postJsonWithWakeupRetry } from '../utils/apiClient';

interface MentorDrawerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  topic: TopicMeta;
  activeTab: PedagogyTab;
  activeProblem: MathProblem | null;
}

const TAB_LABELS: Record<PedagogyTab, string> = {
  muammo: '1. Muammo',
  chegara: '2. Chegara',
  intuisiya: '3. Virtual Intuisiya',
  formula: '4. Formula va Belgilar',
  amaliyot: '5. Amaliyot',
};

export const MentorDrawer: React.FC<MentorDrawerProps> = ({
  isOpen,
  onOpen,
  onClose,
  topic,
  activeTab,
  activeProblem,
}) => {
  const [messages, setMessages] = useState<MentorMessage[]>([
    {
      id: 'welcome',
      role: 'mentor',
      content:
        "Assalomu alaykum! Men sizning First-Principles matematika mentoringizman. Hozirgi mavzu yoki misol bo‘yicha nimani tushunmayotgan bo‘lsangiz, bemalol so‘rang.",
      timestamp: '',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wakeupStatus, setWakeupStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: MentorMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const data = await postJsonWithWakeupRetry<{ reply?: string }>(
        '/api/gemini/mentor',
        {
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          topicTitle: `${topic.id}. ${topic.title}`,
          activeTab: TAB_LABELS[activeTab],
          activeProblem: activeProblem ? activeProblem.statement : null,
        },
        {
          onStatusChange: (status) => setWakeupStatus(status),
        }
      );
      if (!data.reply) {
        throw new Error('Mentor javob bera olmadi.');
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: 'mentor',
          content: data.reply as string,
          timestamp: new Date().toLocaleTimeString('uz-UZ', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi.');
    } finally {
      setWakeupStatus(null);
      setIsLoading(false);
    }
  };

  const quickPrompts = activeProblem
    ? [
        "Shu misolda birinchi qadamni qanday boshlayman?",
        "Nega bu yerda umumiy qoida ishlaydi?",
        "Keng tarqalgan xatolardan qanday saqlanay?",
      ]
    : [
        "Bu mavzuni hayotiy misol bilan oddiyroq tushuntiring",
        "Eng ko‘p uchraydigan xato nima?",
        "Menga kichik sinov savoli bering",
      ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={onOpen}
          aria-label="Mentordan so'rash oynasini ochish"
          className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 inline-flex items-center gap-2 sm:gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-900/20 transition-transform active:scale-95 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" aria-hidden="true" />
          <span className="whitespace-nowrap">Mentordan so‘rash</span>
        </button>
      )}

      {/* Slide-over Mentor Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Mentordan so'rash suhbat oynasi"
        >
          <div
            className="fixed inset-0 bg-slate-950/35 backdrop-blur-[1px]"
            onClick={onClose}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-[420px] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Mentordan so‘rash
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {topic.id}. {topic.title} · {TAB_LABELS[activeTab]}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setMessages([
                      {
                        id: `reset-${Date.now()}`,
                        role: 'mentor',
                        content:
                          "Suhbat yangilandi. Joriy mavzu bo‘yicha savolingizni yozishingiz mumkin.",
                        timestamp: '',
                      },
                    ])
                  }
                  aria-label="Suhbatni tozalash"
                  title="Suhbatni tozalash"
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Mentor oynasini yopish"
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Active Problem Context Bar (if in Amaliyot with selected problem) */}
            {activeProblem && (
              <div className="px-5 py-3 bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50">
                <p className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
                  Faol misol konteksti
                </p>
                <div className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2">
                  <MathText text={activeProblem.statement} />
                </div>
              </div>
            )}

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    <MathText text={msg.content} />
                  </div>
                  {msg.timestamp && (
                    <span className="mt-1 text-[11px] text-slate-400 font-mono tabular-nums">
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              ))}

              {isLoading && (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
                  <span>{wakeupStatus || 'Mentor fikrlamoqda...'}</span>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="p-3 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}
              <div ref={scrollEndRef} />
            </div>

            {/* Quick Contextual Starters */}
            <div className="px-5 py-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={isLoading}
                  className="text-left text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
            >
              <label htmlFor="mentor-chat-input" className="sr-only">
                Mentorga savol yozing
              </label>
              <input
                id="mentor-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Savolingizni o'zbek tilida yozing..."
                className="flex-1 px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Xabarni yuborish"
                className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
