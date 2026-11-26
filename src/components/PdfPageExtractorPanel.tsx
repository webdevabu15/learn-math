import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Check,
  Clock,
  Database,
  Loader2,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileWarning,
  Layers,
} from 'lucide-react';
import type { MathProblem, TopicMeta } from '../types/math';
import type { LoadedPdfDocument } from '../utils/pdfBook';
import { renderPdfPageToJpegBase64, renderPdfThumbnail } from '../utils/pdfBook';
import {
  MAX_PREVIEW_PAGES,
  MAX_SELECTED_PDF_PAGES,
  computePdfPageNumber,
  getClampedBookPageList,
  toggleSelectedBookPage,
} from '../utils/pdfPageMath';
import { isRateLimitError, postJsonWithWakeupRetry } from '../utils/apiClient';
import {
  isPdfPageCached,
  loadPdfPageCache,
  mergeExtractedPagesIntoCache,
  partitionSelectedPdfPages,
  savePdfPageCache,
  type PdfPageCacheMap,
} from '../utils/pdfPageCache';

interface PdfPageExtractorPanelProps {
  topic: TopicMeta;
  pdfDoc: LoadedPdfDocument;
  pdfNumPages: number;
  pdfFileName: string;
  pdfOffset: number;
  onExtracted: (result: {
    orta: MathProblem[];
    murakkab: MathProblem[];
    bookPages: number[];
  }) => void;
}

interface PageThumbnailCardProps {
  pdfDoc: LoadedPdfDocument;
  pdfNumPages: number;
  bookPage: number;
  pdfPage: number;
  isCached: boolean;
  selectionOrder: number; // 0 = not selected, 1..3 = selected order
  selectionFull: boolean;
  onToggle: (bookPage: number) => void;
}

const PageThumbnailCard: React.FC<PageThumbnailCardProps> = ({
  pdfDoc,
  pdfNumPages,
  bookPage,
  pdfPage,
  isCached,
  selectionOrder,
  selectionFull,
  onToggle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [renderState, setRenderState] = useState<'loading' | 'ready' | 'error'>('loading');

  const isOutOfRange = pdfPage < 1 || pdfPage > pdfNumPages;
  const isSelected = selectionOrder > 0;
  const isDisabled = isOutOfRange || (!isSelected && selectionFull);

  useEffect(() => {
    if (isOutOfRange) {
      setRenderState('error');
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    setRenderState('loading');
    const task = renderPdfThumbnail(pdfDoc, pdfPage, canvas, 220);

    task.promise
      .then(() => {
        setRenderState('ready');
      })
      .catch(() => {
        setRenderState('error');
      });

    return () => {
      task.cancel();
    };
  }, [pdfDoc, pdfPage, isOutOfRange]);

  return (
    <button
      type="button"
      onClick={() => !isDisabled && onToggle(bookPage)}
      disabled={isDisabled}
      aria-pressed={isSelected}
      aria-label={`Kitob ${bookPage}-beti (PDF ${pdfPage}-bet)`}
      className={`group relative flex flex-col rounded-xl border text-left overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
        isSelected
          ? 'border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-50/40 dark:bg-indigo-950/30 cursor-pointer'
          : isOutOfRange
            ? 'border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 opacity-60 cursor-not-allowed'
            : isDisabled
              ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 opacity-55 cursor-not-allowed'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer'
      }`}
    >
      {/* Top-left cached indicator */}
      {isCached && (
        <span
          data-testid={`pdf-page-cached-badge-${bookPage}`}
          title="Bu sahifa avval ajratilgan va keshda saqlangan — qayta tanlanganda API so'rovisiz bir zumda yuklanadi"
          className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-600/95 text-white text-[10px] font-semibold shadow-sm"
        >
          <Database className="w-2.5 h-2.5" aria-hidden="true" />
          Keshda
        </span>
      )}

      {/* Top-right selection badge */}
      <span
        className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold transition-colors ${
          isSelected
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-600 text-slate-400 group-hover:border-indigo-400'
        }`}
      >
        {isSelected ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : ''}
      </span>

      {/* Canvas Preview Viewport */}
      <div className="relative w-full aspect-[3/4] bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden">
        {isOutOfRange ? (
          <div className="px-3 text-center space-y-1.5">
            <FileWarning className="w-5 h-5 mx-auto text-slate-400" aria-hidden="true" />
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              PDF {pdfPage}-bet chegaradan tashqarida
            </p>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              className={`w-full h-full object-contain bg-white transition-opacity duration-200 ${
                renderState === 'ready' ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {renderState === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-500" aria-hidden="true" />
              </div>
            )}
            {renderState === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center gap-1">
                <AlertCircle className="w-4 h-4 text-rose-500" aria-hidden="true" />
                <span className="text-[11px] text-slate-500">Sahifa ochilmadi</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Page Metadata Footer */}
      <div className="px-2.5 py-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-1 text-[11px]">
        <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
          {bookPage}-bet
        </span>
        <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">
          PDF {pdfPage}
        </span>
      </div>
    </button>
  );
};

export const PdfPageExtractorPanel: React.FC<PdfPageExtractorPanelProps> = ({
  topic,
  pdfDoc,
  pdfNumPages,
  pdfFileName,
  pdfOffset,
  onExtracted,
}) => {
  const defaultRange: [number, number] = topic.pageRange ?? [15, 18];
  const [startPage, setStartPage] = useState<number>(defaultRange[0]);
  const [endPage, setEndPage] = useState<number>(defaultRange[1]);
  const [selectedBookPages, setSelectedBookPages] = useState<number[]>([]);
  const [pageCache, setPageCache] = useState<PdfPageCacheMap>(() => loadPdfPageCache());
  const [extractStage, setExtractStage] = useState<'idle' | 'rendering' | 'extracting'>('idle');
  const [wakeupStatus, setWakeupStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isQuotaError, setIsQuotaError] = useState(false);
  const [successNote, setSuccessNote] = useState<string | null>(null);

  // Sync manual start/end range & reset selection when switching topics
  useEffect(() => {
    const range: [number, number] = topic.pageRange ?? [15, 18];
    setStartPage(range[0]);
    setEndPage(range[1]);
    setSelectedBookPages([]);
    setError(null);
    setIsQuotaError(false);
    setSuccessNote(null);
  }, [topic.id, topic.pageRange]);

  const { pages: bookPages, truncated } = useMemo(
    () => getClampedBookPageList(startPage, endPage, MAX_PREVIEW_PAGES),
    [startPage, endPage]
  );

  // Drop selected pages that are no longer valid if user adjusts range or offset
  useEffect(() => {
    setSelectedBookPages((prev) =>
      prev.filter((bp) => {
        if (!bookPages.includes(bp)) return false;
        const pdfP = computePdfPageNumber(bp, pdfOffset);
        return pdfP >= 1 && pdfP <= pdfNumPages;
      })
    );
  }, [bookPages, pdfOffset, pdfNumPages]);

  const handleTogglePage = (bookPage: number) => {
    setError(null);
    setIsQuotaError(false);
    setSuccessNote(null);
    setSelectedBookPages((prev) =>
      toggleSelectedBookPage(prev, bookPage, MAX_SELECTED_PDF_PAGES)
    );
  };

  const handleResetRange = () => {
    setStartPage(defaultRange[0]);
    setEndPage(defaultRange[1]);
    setSelectedBookPages([]);
    setError(null);
    setIsQuotaError(false);
  };

  const allSelectedAreCached =
    selectedBookPages.length > 0 &&
    selectedBookPages.every((bp) => isPdfPageCached(pageCache, topic.id, bp));

  const handleExtractSelected = async () => {
    if (selectedBookPages.length === 0) {
      setError("Avval kamida 1 ta (ko'pi bilan 3 ta) kitob sahifasini tanlang.");
      setIsQuotaError(false);
      return;
    }

    setError(null);
    setIsQuotaError(false);
    setSuccessNote(null);

    const { cachedPages, missingPages, cachedOrta, cachedMurakkab } = partitionSelectedPdfPages(
      pageCache,
      topic.id,
      selectedBookPages
    );

    // Instant load from localStorage cache if all selected pages were already extracted
    if (missingPages.length === 0) {
      onExtracted({
        orta: cachedOrta,
        murakkab: cachedMurakkab,
        bookPages: selectedBookPages,
      });
      const pageLabels = selectedBookPages.map((p) => `${p}-bet`).join(', ');
      setSuccessNote(
        `Kitobning ${pageLabels} sahifalari keshdan bir zumda yuklandi (API so‘rovisiz): ${cachedOrta.length} ta O‘rta va ${cachedMurakkab.length} ta Murakkab misol.`
      );
      return;
    }

    setExtractStage('rendering');

    try {
      // 1. Render ONLY the uncached selected pages (max width 1100px, image/jpeg quality 0.75)
      const renderedPages: Array<{ bookPage: number; pdfPage: number; imageBase64: string }> = [];
      for (const bookPage of missingPages) {
        const pdfPage = computePdfPageNumber(bookPage, pdfOffset);
        const imageBase64 = await renderPdfPageToJpegBase64(pdfDoc, pdfPage, 0.75, 1100);
        renderedPages.push({ bookPage, pdfPage, imageBase64 });
      }

      // 2. Send ONLY uncached JPEG page images to our server Gemini route
      setExtractStage('extracting');
      const data = await postJsonWithWakeupRetry<{
        orta?: MathProblem[];
        murakkab?: MathProblem[];
      }>(
        '/api/gemini/extract-pdf-pages',
        {
          topicId: topic.id,
          topicTitle: topic.isVariant ? topic.title : `${topic.id}. ${topic.title}`,
          pages: renderedPages,
        },
        {
          onStatusChange: (status) => setWakeupStatus(status),
        }
      );

      const fetchedOrta: MathProblem[] = Array.isArray(data.orta) ? data.orta : [];
      const fetchedMurakkab: MathProblem[] = Array.isArray(data.murakkab) ? data.murakkab : [];

      // Persist newly extracted pages to localStorage keyed by topicId + bookPageNumber
      const updatedCache = mergeExtractedPagesIntoCache(
        pageCache,
        topic.id,
        missingPages,
        fetchedOrta,
        fetchedMurakkab
      );
      setPageCache(updatedCache);
      savePdfPageCache(updatedCache);

      const combinedOrta = [...cachedOrta, ...fetchedOrta];
      const combinedMurakkab = [...cachedMurakkab, ...fetchedMurakkab];

      onExtracted({
        orta: combinedOrta,
        murakkab: combinedMurakkab,
        bookPages: selectedBookPages,
      });

      const pageLabels = selectedBookPages.map((p) => `${p}-bet`).join(', ');
      const cacheSuffix =
        cachedPages.length > 0
          ? ` (${cachedPages.map((p) => `${p}-bet`).join(', ')} keshdan olindi)`
          : '';
      setSuccessNote(
        `Kitobning ${pageLabels} sahifalaridan ${combinedOrta.length} ta O‘rta va ${combinedMurakkab.length} ta Murakkab misol tayyorlandi${cacheSuffix}.`
      );
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setIsQuotaError(isRateLimitError(err));
      setError(errMsg || "Misol chiqarishda kutilmagan xatolik yuz berdi.");
    } finally {
      setWakeupStatus(null);
      setExtractStage('idle');
    }
  };

  const isBusy = extractStage !== 'idle';
  const isCustomRange = startPage !== defaultRange[0] || endPage !== defaultRange[1];

  return (
    <section
      aria-label="Kitob sahifalaridan Medium/Hard misollar olish"
      className="rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-5"
    >
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Usmonov PDF · 100% brauzerda qayta ishlanadi</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Kitob sahifalaridan Medium/Hard misollar olish
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">{pdfFileName}</span> (
            <span className="font-mono tabular-nums">{pdfNumPages}</span> bet · Offset:{' '}
            <span className="font-mono tabular-nums">
              {pdfOffset > 0 ? `+${pdfOffset}` : pdfOffset}
            </span>
            ). 1–3 ta sahifani tanlang — faqat tanlangan sahifalar yuqori sifatli JPEG ko‘rinishida tahlil qilinadi.
          </p>
        </div>

        {/* Manual Start/End Book Page Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5">
            <label
              htmlFor="pdf-book-start"
              className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap"
            >
              Kitob beti:
            </label>
            <input
              id="pdf-book-start"
              type="number"
              min={1}
              max={3000}
              value={startPage}
              onChange={(e) => {
                const next = Number.parseInt(e.target.value, 10);
                if (Number.isFinite(next) && next >= 1) {
                  setStartPage(next);
                  if (next > endPage) setEndPage(next);
                }
              }}
              aria-label="Boshlanish kitob beti"
              className="w-14 px-1.5 py-0.5 text-xs font-mono tabular-nums rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-xs text-slate-400">–</span>
            <input
              id="pdf-book-end"
              type="number"
              min={startPage}
              max={3000}
              value={endPage}
              onChange={(e) => {
                const next = Number.parseInt(e.target.value, 10);
                if (Number.isFinite(next) && next >= 1) {
                  setEndPage(next);
                }
              }}
              aria-label="Tugash kitob beti"
              className="w-14 px-1.5 py-0.5 text-xs font-mono tabular-nums rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {isCustomRange && (
            <button
              type="button"
              onClick={handleResetRange}
              title="Mavzuning asl sahifa oralig'iga qaytish"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Asl oraliq ({defaultRange[0]}–{defaultRange[1]})
            </button>
          )}
        </div>
      </div>

      {truncated && (
        <p className="text-xs text-amber-700 dark:text-amber-300">
          Bir vaqtda ko‘pi bilan {MAX_PREVIEW_PAGES} ta sahifa oldindan ko‘rsatiladi. Aniqroq oraliq kiriting.
        </p>
      )}

      {/* Local Canvas Thumbnail Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {bookPages.map((bookPage) => {
          const pdfPage = computePdfPageNumber(bookPage, pdfOffset);
          const selIdx = selectedBookPages.indexOf(bookPage);
          return (
            <PageThumbnailCard
              key={`${bookPage}-${pdfPage}`}
              pdfDoc={pdfDoc}
              pdfNumPages={pdfNumPages}
              bookPage={bookPage}
              pdfPage={pdfPage}
              isCached={isPdfPageCached(pageCache, topic.id, bookPage)}
              selectionOrder={selIdx === -1 ? 0 : selIdx + 1}
              selectionFull={selectedBookPages.length >= MAX_SELECTED_PDF_PAGES}
              onToggle={handleTogglePage}
            />
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
            Tanlangan: {selectedBookPages.length} / {MAX_SELECTED_PDF_PAGES} sahifa
          </span>
          {selectedBookPages.length > 0 && (
            <span className="text-slate-500 dark:text-slate-400">
              ({selectedBookPages.map((p) => `${p}-bet`).join(', ')})
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleExtractSelected}
          disabled={selectedBookPages.length === 0 || isBusy}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-55 text-white transition-colors whitespace-nowrap cursor-pointer"
        >
          {isBusy ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : allSelectedAreCached ? (
            <Database className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          )}
          {extractStage === 'rendering'
            ? 'Sahifalar yuqori sifatda tayyorlanmoqda...'
            : extractStage === 'extracting'
              ? wakeupStatus || 'Kitobdan misollar ajratilmoqda...'
              : allSelectedAreCached
                ? 'Tanlangan sahifadan misollarni chiqarish (keshdan)'
                : 'Tanlangan sahifadan misollarni chiqarish'}
        </button>
      </div>

      {wakeupStatus && (
        <div
          role="status"
          aria-live="polite"
          className="px-3.5 py-2.5 rounded-lg border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2"
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
          <span>{wakeupStatus}</span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          data-testid={isQuotaError ? 'rate-limit-notice' : 'pdf-extract-error'}
          className={`p-3.5 rounded-lg border text-sm flex items-start gap-2.5 ${
            isQuotaError
              ? 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200'
              : 'border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200'
          }`}
        >
          {isQuotaError ? (
            <Clock className="w-4 h-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          )}
          <span className="min-w-0 break-words leading-relaxed">{error}</span>
        </div>
      )}

      {successNote && (
        <div
          role="status"
          className="p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 text-sm text-emerald-800 dark:text-emerald-200 flex items-start gap-2"
        >
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>{successNote}</span>
        </div>
      )}
    </section>
  );
};
