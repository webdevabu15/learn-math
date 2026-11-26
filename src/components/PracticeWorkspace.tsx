import React, { useRef, useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  BookMarked,
  Upload,
  Eye,
  EyeOff,
  Loader2,
  MessageSquare,
  Lightbulb,
  X,
  FileText,
} from 'lucide-react';
import type {
  CustomSolutionResult,
  DifficultyLevel,
  MathProblem,
  TopicMeta,
} from '../types/math';
import type { LoadedPdfDocument } from '../utils/pdfBook';
import { MathText } from './MathText';
import { PdfPageExtractorPanel } from './PdfPageExtractorPanel';
import { areMathAnswersEquivalent } from '../utils/mathEquivalence';
import { isRateLimitError, postJsonWithWakeupRetry } from '../utils/apiClient';

interface PracticeWorkspaceProps {
  topic: TopicMeta;
  difficulty: DifficultyLevel;
  onDifficultyChange: (d: DifficultyLevel) => void;
  problems: MathProblem[];
  solvedIds: string[];
  activeProblemId: string | null;
  onSelectActiveProblem: (problem: MathProblem) => void;
  onMarkSolved: (problem: MathProblem, xpReward: number) => void;
  onProblemsGenerated: (difficulty: DifficultyLevel, newProblems: MathProblem[]) => void;
  onBookProblemsExtracted: (result: {
    orta: MathProblem[];
    murakkab: MathProblem[];
    bookPages: number[];
  }) => void;
  onAskMentorAboutProblem: (problem: MathProblem) => void;
  pdfDoc: LoadedPdfDocument | null;
  pdfNumPages: number;
  pdfFileName: string | null;
  pdfOffset: number;
  onRequestAttachPdf: () => void;
}

interface ProblemAttemptState {
  input: string;
  status: 'idle' | 'checking' | 'correct' | 'incorrect';
  feedback: string;
  socraticHint?: string;
  showSolution: boolean;
}

export const PracticeWorkspace: React.FC<PracticeWorkspaceProps> = ({
  topic,
  difficulty,
  onDifficultyChange,
  problems,
  solvedIds,
  activeProblemId,
  onSelectActiveProblem,
  onMarkSolved,
  onProblemsGenerated,
  onBookProblemsExtracted,
  onAskMentorAboutProblem,
  pdfDoc,
  pdfNumPages,
  pdfFileName,
  pdfOffset,
  onRequestAttachPdf,
}) => {
  const [attempts, setAttempts] = useState<Record<string, ProblemAttemptState>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [isGenQuotaError, setIsGenQuotaError] = useState(false);
  const [wakeupStatus, setWakeupStatus] = useState<string | null>(null);

  // Custom Textbook Problem Solver ("Kitobdan aniq misolni kiritish")
  const [showCustomSolver, setShowCustomSolver] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customImageData, setCustomImageData] = useState<{
    base64: string;
    mimeType: string;
    previewUrl: string;
    fileName: string;
  } | null>(null);
  const [isSolvingCustom, setIsSolvingCustom] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const [customResult, setCustomResult] = useState<CustomSolutionResult | null>(null);
  const [showCustomSteps, setShowCustomSteps] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getAttempt = (id: string): ProblemAttemptState =>
    attempts[id] ?? {
      input: '',
      status: solvedIds.includes(id) ? 'correct' : 'idle',
      feedback: solvedIds.includes(id) ? "To'g'ri yechilgan!" : '',
      showSolution: false,
    };

  const updateAttempt = (id: string, patch: Partial<ProblemAttemptState>) => {
    setAttempts((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] ?? {
          input: '',
          status: solvedIds.includes(id) ? 'correct' : 'idle',
          feedback: '',
          showSolution: false,
        }),
        ...patch,
      },
    }));
  };

  const handleCheckAnswer = async (problem: MathProblem) => {
    const attempt = getAttempt(problem.id);
    const trimmed = attempt.input.trim();
    if (!trimmed) {
      updateAttempt(problem.id, {
        status: 'incorrect',
        feedback: 'Avval javob maydoniga qiymat kiriting.',
        socraticHint: undefined,
      });
      return;
    }

    onSelectActiveProblem(problem);
    const xpReward = problem.difficulty === 'murakkab' ? 25 : 15;

    // 1. Instant deterministic equivalence check (handles 1/2 = 0.5 = 0,5, polynomials, etc.)
    const locallyEquivalent = areMathAnswersEquivalent(
      trimmed,
      problem.answer,
      problem.acceptedEquivalents ?? []
    );

    if (locallyEquivalent) {
      updateAttempt(problem.id, {
        status: 'correct',
        feedback: `Barakalla! Javobingiz matematik jihatdan to'g'ri (+${xpReward} XP).`,
        socraticHint: undefined,
      });
      onMarkSolved(problem, xpReward);
      return;
    }

    // 2. Ask Gemini for nuanced mathematical equivalence & personalized Socratic hint
    updateAttempt(problem.id, { status: 'checking', feedback: '' });
    try {
      const data = await postJsonWithWakeupRetry<{
        isCorrect?: boolean;
        feedback?: string;
        socraticHint?: string;
      }>(
        '/api/gemini/check-answer',
        {
          problemStatement: problem.statement,
          expectedAnswer: problem.answer,
          userAnswer: trimmed,
          topicTitle: `${topic.id}. ${topic.title}`,
        },
        {
          onStatusChange: (status) => setWakeupStatus(status),
        }
      );

      if (data.isCorrect) {
        updateAttempt(problem.id, {
          status: 'correct',
          feedback: data.feedback || `Barakalla! Javobingiz to'g'ri (+${xpReward} XP).`,
          socraticHint: undefined,
        });
        onMarkSolved(problem, xpReward);
      } else {
        updateAttempt(problem.id, {
          status: 'incorrect',
          feedback: data.feedback || "Javob hali aniq mos kelmadi. Quyidagi yo'naltiruvchi ishorani o'qing:",
          socraticHint: data.socraticHint || problem.socraticHint,
        });
      }
    } catch (err) {
      if (isRateLimitError(err)) {
        setIsGenQuotaError(true);
        setGenError(err instanceof Error ? err.message : String(err));
      }
      // Even if Gemini check endpoint fails, show deterministic verdict + authored Socratic hint
      updateAttempt(problem.id, {
        status: 'incorrect',
        feedback: "Javob mos kelmadi. Qaytadan hisoblab ko'ring:",
        socraticHint: problem.socraticHint,
      });
    } finally {
      setWakeupStatus(null);
    }
  };

  const handleGenerateNewProblems = async () => {
    setIsGenerating(true);
    setGenError(null);
    setIsGenQuotaError(false);
    try {
      const data = await postJsonWithWakeupRetry<{
        problems?: MathProblem[];
      }>(
        '/api/gemini/generate-problems',
        {
          topicId: topic.id,
          topicTitle: topic.title,
          difficulty,
        },
        {
          onStatusChange: (status) => setWakeupStatus(status),
        }
      );
      if (Array.isArray(data.problems) && data.problems.length > 0) {
        onProblemsGenerated(difficulty, data.problems);
      } else {
        throw new Error('Yangi misollar qaytmadi. Qayta urinib ko‘ring.');
      }
    } catch (err) {
      setIsGenQuotaError(isRateLimitError(err));
      setGenError(err instanceof Error ? err.message : 'Xatolik yuz berdi.');
    } finally {
      setWakeupStatus(null);
      setIsGenerating(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setCustomError('Faqat rasm fayllari (PNG, JPG, WebP) qo‘llab-quvvatlanadi.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const commaIdx = result.indexOf(',');
      if (commaIdx === -1) return;
      setCustomImageData({
        base64: result.slice(commaIdx + 1),
        mimeType: file.type,
        previewUrl: result,
        fileName: file.name,
      });
      setCustomError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSolveCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim() && !customImageData) {
      setCustomError('Misol matnini kiriting yoki kitobdan rasm yuklang.');
      return;
    }

    setIsSolvingCustom(true);
    setCustomError(null);
    setCustomResult(null);
    setShowCustomSteps(false);

    try {
      const data = await postJsonWithWakeupRetry<{
        result: CustomSolutionResult;
      }>(
        '/api/gemini/solve-custom',
        {
          text: customText.trim(),
          imageBase64: customImageData?.base64,
          imageMimeType: customImageData?.mimeType,
          topicTitle: `${topic.id}. ${topic.title}`,
        },
        {
          onStatusChange: (status) => setWakeupStatus(status),
        }
      );
      setCustomResult(data.result);
    } catch (err) {
      setCustomError(err instanceof Error ? err.message : 'Xatolik yuz berdi.');
    } finally {
      setWakeupStatus(null);
      setIsSolvingCustom(false);
    }
  };

  return (
    <div data-testid="practice-workspace" className="space-y-6 pb-28">
      {/* Practice Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        {/* Difficulty Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Daraja:
          </span>
          <div
            className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800"
            role="tablist"
            aria-label="Misollar qiyinlik darajasi"
          >
            <button
              type="button"
              role="tab"
              aria-selected={difficulty === 'orta'}
              onClick={() => onDifficultyChange('orta')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                difficulty === 'orta'
                  ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              O‘rta (+15 XP)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={difficulty === 'murakkab'}
              onClick={() => onDifficultyChange('murakkab')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                difficulty === 'murakkab'
                  ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Murakkab · Usmonov (+25 XP)
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowCustomSolver((v) => !v)}
            aria-expanded={showCustomSolver}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
              showCustomSolver
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" aria-hidden="true" />
            Kitobdan aniq misolni kiritish
          </button>

          <button
            type="button"
            onClick={handleGenerateNewProblems}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            {isGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            {isGenerating ? '5 ta misol tuzilmoqda...' : 'Yangi misollar generatsiya qilish'}
          </button>
        </div>
      </div>

      {wakeupStatus && (
        <div
          role="status"
          aria-live="polite"
          data-testid="server-wakeup-status"
          className="px-4 py-2.5 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 text-xs sm:text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-2.5"
        >
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
          <span>{wakeupStatus}</span>
        </div>
      )}

      {genError && (
        <div
          role="alert"
          data-testid={isGenQuotaError ? 'rate-limit-notice' : 'practice-gen-error'}
          className={`p-4 rounded-xl border text-sm flex items-start gap-2.5 ${
            isGenQuotaError
              ? 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200'
              : 'border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200'
          }`}
        >
          {isGenQuotaError ? (
            <Clock className="w-4 h-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          )}
          <span className="leading-relaxed">{genError}</span>
        </div>
      )}

      {/* Stage 5 PDF Page Extractor (when local PDF is loaded) */}
      {pdfDoc ? (
        <PdfPageExtractorPanel
          topic={topic}
          pdfDoc={pdfDoc}
          pdfNumPages={pdfNumPages}
          pdfFileName={pdfFileName ?? 'Usmonov.pdf'}
          pdfOffset={pdfOffset}
          onExtracted={onBookProblemsExtracted}
        />
      ) : (
        <div className="px-4 py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-slate-800 dark:text-slate-100">
                Kitob sahifalaridan to‘g‘ridan-to‘g‘ri misol chiqarish:
              </strong>{' '}
              Usmonov PDF kitobini ulang
              {topic.pageRange && (
                <>
                  {' '}
                  (bu mavzu:{' '}
                  <span className="font-mono tabular-nums font-medium">
                    {topic.pageRange[0]}
                    {topic.pageRange[1] !== topic.pageRange[0] ? `–${topic.pageRange[1]}` : ''}-bet
                  </span>
                  )
                </>
              )}
              . Fayl 100% brauzerda qayta ishlanadi.
            </span>
          </div>
          <button
            type="button"
            onClick={onRequestAttachPdf}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            Kitob PDF&apos;ini ulash
          </button>
        </div>
      )}

      {/* Custom Textbook Problem Panel */}
      {showCustomSolver && (
        <section
          aria-label="Kitobdan aniq misolni kiritish"
          className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Kitobdan aniq misolni kiritish
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                M. Usmonov to‘plamidagi misolni matn ko‘rinishida yozing yoki kitob sahifasidan rasm yuklang.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCustomSolver(false)}
              aria-label="Oynani yopish"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <form onSubmit={handleSolveCustom} className="space-y-4">
            <div>
              <label
                htmlFor="custom-problem-text"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Misol matni (masalan: (3 1/4 - 1 5/6) : 17/12)
              </label>
              <textarea
                id="custom-problem-text"
                rows={3}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Misol shartini bu yerga yozing..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                  id="custom-problem-image"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                  Rasm yuklash (kitob / daftar)
                </button>

                {customImageData && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <img
                      src={customImageData.previewUrl}
                      alt="Yuklangan misol rasmi"
                      className="w-9 h-9 rounded object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <span className="max-w-[160px] truncate">{customImageData.fileName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomImageData(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      aria-label="Rasmni olib tashlash"
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSolvingCustom}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white transition-colors cursor-pointer"
              >
                {isSolvingCustom && <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />}
                {isSolvingCustom ? 'Tahlil qilinmoqda...' : 'Misolni tahlil qilish'}
              </button>
            </div>
          </form>

          {customError && (
            <div
              role="alert"
              className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-sm text-rose-800 dark:text-rose-200 flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>{customError}</span>
            </div>
          )}

          {customResult && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Aniqlangan misol
                </p>
                <div className="text-base text-slate-900 dark:text-slate-100">
                  <MathText text={customResult.recognizedProblem} />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                  <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
                  Yo‘naltiruvchi ishora
                </p>
                <p className="text-sm text-slate-800 dark:text-slate-200">
                  <MathText text={customResult.socraticHint} />
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowCustomSteps((v) => !v)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {showCustomSteps ? (
                    <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  {showCustomSteps
                    ? "Bosqichma-bosqich yechimni yashirish"
                    : "To'liq bosqichma-bosqich yechimni ko'rish"}
                </button>

                {showCustomSteps && (
                  <div className="mt-3 space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <ol className="space-y-2.5 text-sm text-slate-700 dark:text-slate-200">
                      {customResult.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0">
                            {i + 1}.
                          </span>
                          <span>
                            <MathText text={step} />
                          </span>
                        </li>
                      ))}
                    </ol>
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      <span>Yakuniy javob:</span>
                      <MathText text={customResult.finalAnswer} />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      <MathText text={customResult.conceptNote} />
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Problems List */}
      <div className="space-y-5">
        {problems.map((problem, index) => {
          const attempt = getAttempt(problem.id);
          const isSolved = solvedIds.includes(problem.id) || attempt.status === 'correct';
          const isActive = activeProblemId === problem.id;

          return (
            <article
              key={problem.id}
              data-testid={`problem-card-${index + 1}`}
              onClick={() => onSelectActiveProblem(problem)}
              className={`p-6 rounded-xl border transition-colors bg-white dark:bg-slate-900 ${
                isActive
                  ? 'border-indigo-400 dark:border-indigo-600'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Clean unboxed metadata header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                    {index + 1}-misol
                  </span>
                  {problem.sourceLabel && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{problem.sourceLabel}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {isSolved && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      To‘g‘ri yechildi
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAskMentorAboutProblem(problem);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                    Mentordan so‘rash
                  </button>
                </div>
              </div>

              {/* KaTeX Problem Statement */}
              <div className="text-[15.5px] leading-relaxed text-slate-900 dark:text-slate-100 mb-5">
                <MathText text={problem.statement} />
              </div>

              {/* Answer Input + Check Button */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCheckAnswer(problem);
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
              >
                <label htmlFor={`answer-input-${problem.id}`} className="sr-only">
                  {index + 1}-misol javobi
                </label>
                <input
                  id={`answer-input-${problem.id}`}
                  type="text"
                  value={attempt.input}
                  onFocus={() => onSelectActiveProblem(problem)}
                  onChange={(e) =>
                    updateAttempt(problem.id, {
                      input: e.target.value,
                      status: attempt.status === 'correct' ? 'correct' : 'idle',
                    })
                  }
                  placeholder="Javobni kiriting (masalan: 5/6 yoki 0,5)"
                  className="flex-1 px-3.5 py-2.5 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                />

                <button
                  type="submit"
                  disabled={attempt.status === 'checking'}
                  className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  {attempt.status === 'checking' && (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  )}
                  {attempt.status === 'checking' ? 'Tekshirilmoqda...' : 'Tekshirish'}
                </button>
              </form>

              {/* Feedback Area: Green Correct OR Amber Socratic Hint */}
              {attempt.status === 'correct' && attempt.feedback && (
                <div
                  role="status"
                  className="mt-4 p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-sm text-emerald-800 dark:text-emerald-200 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>
                    <MathText text={attempt.feedback} />
                  </span>
                </div>
              )}

              {attempt.status === 'incorrect' && (
                <div
                  role="status"
                  className="mt-4 p-4 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2"
                >
                  <div className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-200">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                    <span className="font-medium">
                      <MathText text={attempt.feedback} />
                    </span>
                  </div>
                  {attempt.socraticHint && (
                    <div className="pl-6 text-sm text-slate-800 dark:text-slate-200">
                      <span className="font-semibold text-amber-800 dark:text-amber-300">
                        Yo‘naltiruvchi ishora:{' '}
                      </span>
                      <MathText text={attempt.socraticHint} />
                    </div>
                  )}
                </div>
              )}

              {/* Separate Step-by-Step Solution Disclosure */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <button
                  type="button"
                  aria-expanded={attempt.showSolution}
                  onClick={() =>
                    updateAttempt(problem.id, { showSolution: !attempt.showSolution })
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {attempt.showSolution ? (
                    <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  {attempt.showSolution
                    ? "Bosqichma-bosqich yechimni yashirish"
                    : "To'liq bosqichma-bosqich yechimni ko'rish"}
                </button>
              </div>

              {attempt.showSolution && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    {problem.steps.map((step, stepIdx) => (
                      <li key={stepIdx} className="flex items-start gap-2.5">
                        <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0 tabular-nums">
                          {stepIdx + 1}.
                        </span>
                        <span>
                          <MathText text={step} />
                        </span>
                      </li>
                    ))}
                  </ol>
                  <p className="pt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    Yakuniy javob: <MathText text={`$${problem.answer}$`} />
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
