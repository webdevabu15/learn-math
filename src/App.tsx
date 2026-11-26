import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Sun,
  Moon,
  PanelLeftOpen,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  AlertCircle,
  FileText,
  X,
} from 'lucide-react';
import type {
  DifficultyLevel,
  MathProblem,
  PedagogyTab,
  PersistedLabState,
  TopicLesson,
} from './types/math';
import {
  TOPICS_META,
  filterTopicsByQuery,
  getNextTopicMeta,
  getSectionMeta,
  getSeedLesson,
  getTopicMeta,
} from './data/curriculum';
import {
  cacheExtractedBookProblems,
  cacheGeneratedProblems,
  cacheTopicLesson,
  clampPdfOffset,
  getTotalSolvedCount,
  loadLabState,
  recordSolvedProblem,
  saveLabState,
  toggleTopicCompletion,
} from './utils/storage';
import { loadPdfFromFile, type LoadedPdfDocument } from './utils/pdfBook';
import { postJsonWithWakeupRetry } from './utils/apiClient';
import { Sidebar } from './components/Sidebar';
import {
  ChegaraView,
  FormulaView,
  IntuisiyaView,
  MuammoView,
} from './components/LessonStageViews';
import { PracticeWorkspace } from './components/PracticeWorkspace';
import { MentorDrawer } from './components/MentorDrawer';

const TABS: Array<{ id: PedagogyTab; step: number; label: string }> = [
  { id: 'muammo', step: 1, label: 'Muammo' },
  { id: 'chegara', step: 2, label: 'Chegara' },
  { id: 'intuisiya', step: 3, label: 'Virtual Intuisiya' },
  { id: 'formula', step: 4, label: 'Formula va Belgilar' },
  { id: 'amaliyot', step: 5, label: 'Amaliyot' },
];

export default function App() {
  const [labState, setLabState] = useState<PersistedLabState>(() => loadLabState());
  const [selectedTopicId, setSelectedTopicId] = useState<number>(3);
  const [activeTab, setActiveTab] = useState<PedagogyTab>('muammo');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('orta');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [mentorOpen, setMentorOpen] = useState(false);
  const [activeProblem, setActiveProblem] = useState<MathProblem | null>(null);
  const [isEnhancingLesson, setIsEnhancingLesson] = useState(false);
  const [lessonWakeupStatus, setLessonWakeupStatus] = useState<string | null>(null);
  const [lessonError, setLessonError] = useState<string | null>(null);

  // Client-side Usmonov PDF state (100% in-browser memory — NEVER uploaded to server)
  const pdfFileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfDisposeRef = useRef<(() => Promise<void>) | null>(null);
  const [pdfDoc, setPdfDoc] = useState<LoadedPdfDocument | null>(null);
  const [pdfNumPages, setPdfNumPages] = useState<number>(0);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [offsetDraft, setOffsetDraft] = useState<string>(() => String(labState.pdfOffset));

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (labState.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [labState.theme]);

  // Persist to localStorage on every state update
  useEffect(() => {
    saveLabState(labState);
  }, [labState]);

  // Clean up PDF document memory on unmount
  useEffect(() => {
    return () => {
      pdfDisposeRef.current?.().catch(() => {});
      pdfDisposeRef.current = null;
    };
  }, []);

  const currentTopic = useMemo(() => getTopicMeta(selectedTopicId), [selectedTopicId]);
  const currentSection = useMemo(
    () => getSectionMeta(currentTopic.sectionId),
    [currentTopic.sectionId]
  );
  const currentTopicHeading = currentTopic.isVariant
    ? currentTopic.title
    : `${currentTopic.id}. ${currentTopic.title}`;

  const currentLesson: TopicLesson = useMemo(() => {
    const seed = getSeedLesson(selectedTopicId);
    const cached = labState.cachedLessons[selectedTopicId];
    return cached ? { ...seed, ...cached, problems: seed.problems } : seed;
  }, [selectedTopicId, labState.cachedLessons]);

  const activeProblems: MathProblem[] = useMemo(() => {
    const generated = labState.customProblems[selectedTopicId]?.[difficulty];
    if (generated && generated.length > 0) {
      return generated;
    }
    return currentLesson.problems[difficulty];
  }, [selectedTopicId, difficulty, labState.customProblems, currentLesson]);

  const filteredTopics = useMemo(
    () => filterTopicsByQuery(searchQuery),
    [searchQuery]
  );

  const totalSolved = useMemo(() => getTotalSolvedCount(labState), [labState]);
  const isCurrentCompleted = labState.completedTopicIds.includes(selectedTopicId);
  const currentTabIndex = TABS.findIndex((t) => t.id === activeTab);

  const handleSelectTopic = (topicId: number) => {
    setSelectedTopicId(topicId);
    setActiveTab('muammo');
    setActiveProblem(null);
    setLessonError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTheme = () => {
    setLabState((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const handlePdfOffsetChange = (raw: string) => {
    setOffsetDraft(raw);
    if (raw === '' || raw === '-') return;
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed)) return;
    const clamped = clampPdfOffset(parsed);
    setLabState((prev) => ({
      ...prev,
      pdfOffset: clamped,
    }));
  };

  const handlePdfOffsetBlur = () => {
    const parsed = Number.parseInt(offsetDraft, 10);
    if (Number.isFinite(parsed)) {
      const clamped = clampPdfOffset(parsed);
      setLabState((prev) => ({ ...prev, pdfOffset: clamped }));
      setOffsetDraft(String(clamped));
    } else {
      setOffsetDraft(String(labState.pdfOffset));
    }
  };

  const handlePdfFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset input value so selecting the same file again still triggers onChange
    e.target.value = '';
    if (!file) return;

    setIsLoadingPdf(true);
    setPdfError(null);
    try {
      const loaded = await loadPdfFromFile(file);
      const prevDispose = pdfDisposeRef.current;
      pdfDisposeRef.current = loaded.dispose;
      setPdfDoc(loaded.doc);
      setPdfNumPages(loaded.numPages);
      setPdfFileName(loaded.fileName);
      prevDispose?.().catch(() => {});
    } catch (err) {
      setPdfError(
        err instanceof Error
          ? err.message
          : "PDF faylni o'qishda xatolik yuz berdi. Boshqa fayl tanlab ko'ring."
      );
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const handleUnloadPdf = () => {
    const prevDispose = pdfDisposeRef.current;
    pdfDisposeRef.current = null;
    setPdfDoc(null);
    setPdfNumPages(0);
    setPdfFileName(null);
    setPdfError(null);
    prevDispose?.().catch(() => {});
  };

  const handleRequestAttachPdf = () => {
    pdfFileInputRef.current?.click();
  };

  const handleMarkSolved = (problem: MathProblem, xpReward: number) => {
    setLabState((prev) => recordSolvedProblem(prev, selectedTopicId, problem.id, xpReward));
  };

  const handleProblemsGenerated = (
    diff: DifficultyLevel,
    newProblems: MathProblem[]
  ) => {
    setLabState((prev) => cacheGeneratedProblems(prev, selectedTopicId, diff, newProblems));
    setActiveProblem(newProblems[0] ?? null);
  };

  const handleBookProblemsExtracted = (result: {
    orta: MathProblem[];
    murakkab: MathProblem[];
    bookPages: number[];
  }) => {
    setLabState((prev) =>
      cacheExtractedBookProblems(prev, selectedTopicId, result.orta, result.murakkab)
    );
    // Switch to whichever difficulty bucket received extracted problems if current bucket is empty
    if (difficulty === 'orta' && result.orta.length > 0) {
      setActiveProblem(result.orta[0]);
    } else if (difficulty === 'murakkab' && result.murakkab.length > 0) {
      setActiveProblem(result.murakkab[0]);
    } else if (result.orta.length > 0) {
      setDifficulty('orta');
      setActiveProblem(result.orta[0]);
    } else if (result.murakkab.length > 0) {
      setDifficulty('murakkab');
      setActiveProblem(result.murakkab[0]);
    }
  };

  const handleEnhanceLessonWithAI = async () => {
    setIsEnhancingLesson(true);
    setLessonError(null);
    try {
      const data = await postJsonWithWakeupRetry<{
        lessonPatch?: Partial<TopicLesson>;
      }>(
        '/api/gemini/generate-lesson',
        {
          topicId: currentTopic.id,
          topicTitle: currentTopic.title,
        },
        {
          onStatusChange: (status) => setLessonWakeupStatus(status),
        }
      );
      const patch = data.lessonPatch;
      if (patch) {
        const merged: TopicLesson = {
          ...currentLesson,
          muammo: patch.muammo ?? currentLesson.muammo,
          chegara: patch.chegara ?? currentLesson.chegara,
          intuisiya: {
            ...currentLesson.intuisiya,
            ...(patch.intuisiya ?? {}),
          },
          formula: patch.formula ?? currentLesson.formula,
          isAiEnhanced: true,
          updatedAt: new Date().toISOString(),
        };
        setLabState((prev) => cacheTopicLesson(prev, merged));
      }
    } catch (err) {
      setLessonError(err instanceof Error ? err.message : 'Xatolik yuz berdi.');
    } finally {
      setLessonWakeupStatus(null);
      setIsEnhancingLesson(false);
    }
  };

  const handleAskMentorAboutProblem = (problem: MathProblem) => {
    setActiveProblem(problem);
    setMentorOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hidden local-only PDF file picker */}
      <input
        ref={pdfFileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handlePdfFileSelected}
        className="hidden"
        aria-label="Usmonov kitob PDF faylini tanlash"
      />

      {/* Clean Single-Row Top Bar */}
      <header className="sticky top-0 z-30 h-[57px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Sidebar Toggle + Brand Wordmark */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          {!sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Yon panelni ochish"
              className="hidden lg:inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <PanelLeftOpen className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Mavzular menyusini ochish"
            className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            <PanelLeftOpen className="w-4 h-4" aria-hidden="true" />
          </button>

          <span className="text-[14px] sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 truncate">
            Usmonov Math Lab
          </span>
        </div>

        {/* Center: Clean unboxed metadata summary */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate">
          <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[260px]">
            {currentTopicHeading}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums whitespace-nowrap">
            {totalSolved} yechilgan
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
            {labState.xp} XP
          </span>
        </div>

        {/* Right: PDF Book Controls + Offset + Theme Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Kitob PDF'ini ulash button (with active page-count badge) */}
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={handleRequestAttachPdf}
              disabled={isLoadingPdf}
              title={
                pdfFileName
                  ? `${pdfFileName} (${pdfNumPages} bet) — boshqa PDF tanlash uchun bosing`
                  : "Usmonov kitobi PDF faylini brauzer xotirasiga ulash (serverga yuklanmaydi)"
              }
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60 ${
                pdfDoc
                  ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/80 dark:hover:bg-indigo-950'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {isLoadingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {isLoadingPdf
                  ? 'Yuklanmoqda...'
                  : pdfDoc
                    ? "Kitob PDF'i"
                    : "Kitob PDF'ini ulash"}
              </span>
              {pdfDoc && (
                <span
                  data-testid="pdf-page-count-badge"
                  className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono tabular-nums text-[11px] leading-none"
                >
                  {pdfNumPages} bet
                </span>
              )}
            </button>

            {pdfDoc && (
              <button
                type="button"
                onClick={handleUnloadPdf}
                aria-label="PDF kitobni uzish"
                title="PDF kitobni xotiradan uzish"
                className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 hover:border-rose-300 dark:hover:text-rose-400 dark:hover:border-rose-800 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Compact Offset Input (default: -2) */}
          <div
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
            title="Kitob bet raqami va PDF sahifa raqami orasidagi farq (masalan: 15-bet = PDF 13 → -2)"
          >
            <label
              htmlFor="pdf-offset-input"
              className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap select-none"
            >
              Offset
            </label>
            <input
              id="pdf-offset-input"
              type="number"
              min={-100}
              max={100}
              step={1}
              value={offsetDraft}
              onChange={(e) => handlePdfOffsetChange(e.target.value)}
              onBlur={handlePdfOffsetBlur}
              aria-label="PDF sahifa offset qiymati"
              className="w-11 px-1 py-0.5 text-xs font-mono tabular-nums text-center rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <span className="xl:hidden hidden sm:inline text-xs font-mono tabular-nums font-semibold text-indigo-600 dark:text-indigo-400">
            {labState.xp} XP
          </span>

          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label={
              labState.theme === 'dark'
                ? "Yorug' rejimga o'tish"
                : "Qorong'i rejimga o'tish"
            }
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {labState.theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <span className="hidden md:inline">Yorug‘</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
                <span className="hidden md:inline">Qorong‘i</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Layout: Collapsible Left Sidebar + Workspace */}
      <div className="flex-1 flex min-w-0">
        <Sidebar
          topics={filteredTopics}
          allTopicsCount={TOPICS_META.length}
          selectedTopicId={selectedTopicId}
          completedTopicIds={labState.completedTopicIds}
          solvedProblemIds={labState.solvedProblemIds}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectTopic={handleSelectTopic}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
          onCollapseDesktop={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-7 pb-28 sm:pb-32">
          <div className="max-w-[1040px] mx-auto space-y-6">
            {pdfError && (
              <div
                role="alert"
                className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-sm text-rose-800 dark:text-rose-200 flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{pdfError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPdfError(null)}
                  aria-label="Xatolik xabarini yopish"
                  className="text-rose-500 hover:text-rose-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Topic Title & Completion Action */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{currentSection.id}-bo‘lim</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {currentTopic.displayCode ?? `${currentTopic.id}-mavzu`}
                  </span>
                  {currentTopic.pageRange && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        Kitob: {currentTopic.pageRange[0]}
                        {currentTopic.pageRange[1] !== currentTopic.pageRange[0]
                          ? `–${currentTopic.pageRange[1]}`
                          : ''}
                        -bet
                      </span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span>First-Principles Matematika</span>
                  {currentLesson.isAiEnhanced && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                        Keshlangan AI dars
                      </span>
                    </>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                  {currentTopicHeading}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleEnhanceLessonWithAI}
                  disabled={isEnhancingLesson}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {isEnhancingLesson ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  )}
                  {isEnhancingLesson ? 'Yangilanmoqda...' : 'Darsni AI bilan boyitish'}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setLabState((prev) => toggleTopicCompletion(prev, selectedTopicId))
                  }
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                    isCurrentCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {isCurrentCompleted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      Mavzu yakunlandi
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5" aria-hidden="true" />
                      Yakunlangan deb belgilash
                    </>
                  )}
                </button>
              </div>
            </div>

            {lessonWakeupStatus && (
              <div
                role="status"
                aria-live="polite"
                className="px-3.5 py-2.5 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 text-xs sm:text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-2"
              >
                <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                <span>{lessonWakeupStatus}</span>
              </div>
            )}

            {lessonError && (
              <div
                role="alert"
                className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-sm text-rose-800 dark:text-rose-200 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{lessonError}</span>
              </div>
            )}

            {/* 5 Sequential First-Principles Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
              <div
                className="flex items-center gap-1 min-w-max"
                role="tablist"
                aria-label="Mavzuni o'rganish bosqichlari"
              >
                {TABS.map((tab) => {
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'text-indigo-700 dark:text-indigo-300'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded text-[11px] font-mono tabular-nums flex items-center justify-center ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {tab.step}
                      </span>
                      <span>{tab.label}</span>
                      {isSelected && (
                        <span className="absolute inset-x-2 bottom-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Tab Panel */}
            <div role="tabpanel" className="pt-2">
              {activeTab === 'muammo' && <MuammoView lesson={currentLesson} />}
              {activeTab === 'chegara' && <ChegaraView lesson={currentLesson} />}
              {activeTab === 'intuisiya' && (
                <IntuisiyaView lesson={currentLesson} topic={currentTopic} />
              )}
              {activeTab === 'formula' && <FormulaView lesson={currentLesson} />}
              {activeTab === 'amaliyot' && (
                <PracticeWorkspace
                  topic={currentTopic}
                  difficulty={difficulty}
                  onDifficultyChange={(d) => {
                    setDifficulty(d);
                    setActiveProblem(null);
                  }}
                  problems={activeProblems}
                  solvedIds={labState.solvedProblemIds[selectedTopicId] ?? []}
                  activeProblemId={activeProblem?.id ?? null}
                  onSelectActiveProblem={setActiveProblem}
                  onMarkSolved={handleMarkSolved}
                  onProblemsGenerated={handleProblemsGenerated}
                  onBookProblemsExtracted={handleBookProblemsExtracted}
                  onAskMentorAboutProblem={handleAskMentorAboutProblem}
                  pdfDoc={pdfDoc}
                  pdfNumPages={pdfNumPages}
                  pdfFileName={pdfFileName}
                  pdfOffset={labState.pdfOffset}
                  onRequestAttachPdf={handleRequestAttachPdf}
                />
              )}
            </div>

            {/* Sequential Step Footer Navigation (with safe clearance from floating Mentor button) */}
            <div className="pt-6 mt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 sm:pr-48">
              {currentTabIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(TABS[currentTabIndex - 1].id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Oldingi: {TABS[currentTabIndex - 1].label}</span>
                </button>
              ) : (
                <div />
              )}

              {currentTabIndex < TABS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(TABS[currentTabIndex + 1].id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
                >
                  <span>Keyingi: {TABS[currentTabIndex + 1].label}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              ) : (
                (() => {
                  const nextTopic = getNextTopicMeta(selectedTopicId);
                  if (!nextTopic) return null;
                  const nextLabel = nextTopic.isVariant
                    ? nextTopic.title
                    : `${nextTopic.id}. ${nextTopic.title}`;
                  return (
                    <button
                      type="button"
                      onClick={() => handleSelectTopic(nextTopic.id)}
                      className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <span>Keyingi mavzu: {nextLabel}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  );
                })()
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Floating Context-Aware AI Mentor Drawer */}
      <MentorDrawer
        isOpen={mentorOpen}
        onOpen={() => setMentorOpen(true)}
        onClose={() => setMentorOpen(false)}
        topic={currentTopic}
        activeTab={activeTab}
        activeProblem={activeTab === 'amaliyot' ? activeProblem : null}
      />
    </div>
  );
}
