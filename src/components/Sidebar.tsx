import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Search,
  X,
  BookOpen,
  PanelLeftClose,
  ChevronDown,
  ChevronRight,
  Layers,
} from 'lucide-react';
import type { TopicMeta } from '../types/math';
import { CURRICULUM_SECTIONS, TOPICS_META } from '../data/curriculum';

interface SidebarProps {
  topics: TopicMeta[];
  allTopicsCount: number;
  selectedTopicId: number;
  completedTopicIds: number[];
  solvedProblemIds: Record<number, string[]>;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectTopic: (topicId: number) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onCollapseDesktop: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  topics,
  allTopicsCount,
  selectedTopicId,
  completedTopicIds,
  solvedProblemIds,
  searchQuery,
  onSearchChange,
  onSelectTopic,
  isOpen,
  onCloseMobile,
  onCollapseDesktop,
}) => {
  const completedSet = useMemo(() => new Set(completedTopicIds), [completedTopicIds]);
  const completedCount = completedTopicIds.length;
  const progressPercent = Math.round((completedCount / Math.max(1, allTopicsCount)) * 100);

  const selectedTopicMeta = useMemo(
    () => TOPICS_META.find((t) => t.id === selectedTopicId) ?? TOPICS_META[0],
    [selectedTopicId]
  );

  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobileViewport(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({
    1: true,
  });
  const [expandedVariantGroups, setExpandedVariantGroups] = useState<Record<string, boolean>>({});

  // Auto-expand the section (and variant group) of the active topic
  useEffect(() => {
    setExpandedSections((prev) =>
      prev[selectedTopicMeta.sectionId]
        ? prev
        : { ...prev, [selectedTopicMeta.sectionId]: true }
    );
    if (selectedTopicMeta.variantGroup) {
      setExpandedVariantGroups((prev) =>
        prev[selectedTopicMeta.variantGroup!]
          ? prev
          : { ...prev, [selectedTopicMeta.variantGroup!]: true }
      );
    }
  }, [selectedTopicMeta.sectionId, selectedTopicMeta.variantGroup]);

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const toggleVariantGroup = (groupKey: string) => {
    setExpandedVariantGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const isSearching = searchQuery.trim().length > 0;

  const groupedBySection = useMemo(() => {
    const map = new Map<number, { regular: TopicMeta[]; variants: TopicMeta[] }>();
    for (const sec of CURRICULUM_SECTIONS) {
      map.set(sec.id, { regular: [], variants: [] });
    }
    for (const topic of topics) {
      const bucket = map.get(topic.sectionId);
      if (!bucket) continue;
      if (topic.isVariant) bucket.variants.push(topic);
      else bucket.regular.push(topic);
    }
    return map;
  }, [topics]);

  const totalPerSection = useMemo(() => {
    const counts = new Map<number, { total: number; done: number }>();
    for (const sec of CURRICULUM_SECTIONS) {
      counts.set(sec.id, { total: 0, done: 0 });
    }
    for (const t of TOPICS_META) {
      const entry = counts.get(t.sectionId);
      if (!entry) continue;
      entry.total += 1;
      if (completedSet.has(t.id)) entry.done += 1;
    }
    return counts;
  }, [completedSet]);

  const renderTopicButton = (topic: TopicMeta) => {
    const isActive = topic.id === selectedTopicId;
    const isDone = completedSet.has(topic.id);
    const solvedCount = solvedProblemIds[topic.id]?.length ?? 0;
    const badgeLabel = topic.displayCode ?? String(topic.id);
    const accessibleTitle = topic.isVariant ? topic.title : `${topic.id}. ${topic.title}`;

    return (
      <button
        key={topic.id}
        type="button"
        onClick={() => {
          onSelectTopic(topic.id);
          if (isMobileViewport) {
            onCloseMobile();
          }
        }}
        aria-label={accessibleTitle}
        aria-current={isActive ? 'page' : undefined}
        className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors flex items-start gap-2.5 group cursor-pointer ${
          isActive
            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100'
            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
        }`}
      >
        <span
          aria-hidden="true"
          className={`mt-0.5 min-w-[28px] h-6 px-1 rounded-md text-[11px] font-mono font-semibold tabular-nums flex items-center justify-center shrink-0 transition-colors ${
            isDone
              ? 'bg-emerald-600 text-white'
              : isActive
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
          }`}
        >
          {isDone ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : badgeLabel}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={`block text-[13px] leading-snug ${
              isActive ? 'font-semibold' : 'font-medium'
            }`}
          >
            {topic.title}
          </span>
          {solvedCount > 0 && (
            <span className="block mt-0.5 text-[11px] font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
              {solvedCount} ta misol yechildi
            </span>
          )}
        </span>
      </button>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Sidebar Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
              To‘liq dars rejasi
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              1–8-bo‘limlar · 3–107 + Variantlar
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCollapseDesktop}
          aria-label="Yon panelni yashirish"
          title="Yon panelni yashirish"
          className="hidden lg:inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
        >
          <PanelLeftClose className="w-4 h-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Menyuni yopish"
          className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Overall Progress */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-mono tabular-nums">
          <span>
            {completedCount} / {allTopicsCount} mavzu
          </span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {progressPercent}%
          </span>
        </div>
        <div
          className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Umumiy o'zlashtirish darajasi"
        >
          <div
            className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-transform duration-300 origin-left"
            style={{ transform: `scaleX(${progressPercent / 100})` }}
          />
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <label htmlFor="topic-search" className="sr-only">
          Mavzu yoki variant qidirish
        </label>
        <div className="relative">
          <Search
            className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="topic-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Mavzu, raqam yoki V35 qidiring..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* 8 Collapsible Sections + Variant Sub-groups */}
      <nav aria-label="Barcha bo'limlar va mavzular" className="flex-1 overflow-y-auto px-2 py-2.5 space-y-1.5">
        {topics.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              «{searchQuery}» bo‘yicha mavzu topilmadi.
            </p>
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Qidiruvni tozalash
            </button>
          </div>
        ) : (
          CURRICULUM_SECTIONS.map((section) => {
            const bucket = groupedBySection.get(section.id);
            const matchedCount = (bucket?.regular.length ?? 0) + (bucket?.variants.length ?? 0);
            if (isSearching && matchedCount === 0) return null;

            const isExpanded = isSearching || Boolean(expandedSections[section.id]);
            const stats = totalPerSection.get(section.id) ?? { total: 0, done: 0 };
            const variantGroupKey = bucket?.variants[0]?.variantGroup;
            const isVariantExpanded =
              isSearching || (variantGroupKey ? Boolean(expandedVariantGroups[variantGroupKey]) : false);

            return (
              <div
                key={section.id}
                className="rounded-lg border border-slate-200/70 dark:border-slate-800/80 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isExpanded}
                  className="w-full text-left px-2.5 py-2.5 bg-slate-50/70 dark:bg-slate-950/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors flex items-start gap-2 cursor-pointer"
                >
                  <span className="mt-0.5 text-slate-400 dark:text-slate-500 shrink-0">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                      {section.title}
                    </span>
                    <span className="mt-0.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                      <span>{section.rangeLabel}</span>
                      <span>
                        {stats.done}/{stats.total}
                      </span>
                    </span>
                  </span>
                </button>

                {isExpanded && bucket && (
                  <div className="px-1.5 py-1.5 space-y-0.5 bg-white dark:bg-slate-900">
                    {bucket.regular.map((topic) => renderTopicButton(topic))}

                    {bucket.variants.length > 0 && variantGroupKey && (
                      <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => toggleVariantGroup(variantGroupKey)}
                          aria-expanded={isVariantExpanded}
                          className="w-full px-2.5 py-1.5 rounded-md text-left text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                            Variant {variantGroupKey} ({bucket.variants.length} ta)
                          </span>
                          {isVariantExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                        </button>

                        {isVariantExpanded && (
                          <div className="mt-1 space-y-0.5 pl-1">
                            {bucket.variants.map((variant) => renderTopicButton(variant))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </nav>
    </div>
  );

  if (isMobileViewport) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex">
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-[1px]"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
        <aside className="relative z-10 w-[86vw] max-w-[328px] h-full shadow-2xl">
          {sidebarContent}
        </aside>
      </div>
    );
  }

  return (
    <aside
      className={`shrink-0 transition-all duration-200 ${
        isOpen ? 'w-[308px]' : 'w-0 overflow-hidden'
      }`}
    >
      <div className="w-[308px] h-[calc(100vh-57px)] sticky top-[57px]">
        {sidebarContent}
      </div>
    </aside>
  );
};
