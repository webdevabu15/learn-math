import type { MathProblem } from '../types/math';
import type { StorageLike } from './storage';

export const PDF_PAGE_CACHE_STORAGE_KEY = 'usmonov_math_lab_pdf_page_cache_v1';

export interface CachedPdfPageEntry {
  topicId: number;
  bookPage: number;
  orta: MathProblem[];
  murakkab: MathProblem[];
  cachedAt: string;
}

export type PdfPageCacheMap = Record<string, CachedPdfPageEntry>;

export function makePdfPageCacheKey(topicId: number, bookPage: number): string {
  return `${topicId}:${bookPage}`;
}

export function loadPdfPageCache(storage?: StorageLike | null): PdfPageCacheMap {
  const store = storage ?? (typeof window !== 'undefined' ? window.localStorage : null);
  if (!store) return {};

  try {
    const raw = store.getItem(PDF_PAGE_CACHE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') return {};

    const clean: PdfPageCacheMap = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!value || typeof value !== 'object') continue;
      const entry = value as Partial<CachedPdfPageEntry>;
      if (
        typeof entry.topicId === 'number' &&
        typeof entry.bookPage === 'number' &&
        Array.isArray(entry.orta) &&
        Array.isArray(entry.murakkab)
      ) {
        clean[key] = {
          topicId: entry.topicId,
          bookPage: entry.bookPage,
          orta: entry.orta,
          murakkab: entry.murakkab,
          cachedAt: typeof entry.cachedAt === 'string' ? entry.cachedAt : '',
        };
      }
    }
    return clean;
  } catch {
    return {};
  }
}

export function savePdfPageCache(
  cache: PdfPageCacheMap,
  storage?: StorageLike | null
): void {
  const store = storage ?? (typeof window !== 'undefined' ? window.localStorage : null);
  if (!store) return;

  try {
    store.setItem(PDF_PAGE_CACHE_STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore browser localStorage quota errors gracefully
  }
}

export function isPdfPageCached(
  cache: PdfPageCacheMap,
  topicId: number,
  bookPage: number
): boolean {
  const entry = cache[makePdfPageCacheKey(topicId, bookPage)];
  return Boolean(entry && (entry.orta.length > 0 || entry.murakkab.length > 0));
}

export function partitionSelectedPdfPages(
  cache: PdfPageCacheMap,
  topicId: number,
  selectedBookPages: number[]
): {
  cachedPages: number[];
  missingPages: number[];
  cachedOrta: MathProblem[];
  cachedMurakkab: MathProblem[];
} {
  const cachedPages: number[] = [];
  const missingPages: number[] = [];
  const cachedOrta: MathProblem[] = [];
  const cachedMurakkab: MathProblem[] = [];

  for (const bookPage of selectedBookPages) {
    const entry = cache[makePdfPageCacheKey(topicId, bookPage)];
    if (entry && (entry.orta.length > 0 || entry.murakkab.length > 0)) {
      cachedPages.push(bookPage);
      cachedOrta.push(...entry.orta);
      cachedMurakkab.push(...entry.murakkab);
    } else {
      missingPages.push(bookPage);
    }
  }

  return { cachedPages, missingPages, cachedOrta, cachedMurakkab };
}

function inferProblemBookPage(problem: MathProblem, allowedPages: number[]): number {
  if (
    typeof problem.bookPage === 'number' &&
    Number.isInteger(problem.bookPage) &&
    allowedPages.includes(problem.bookPage)
  ) {
    return problem.bookPage;
  }

  if (typeof problem.sourceLabel === 'string') {
    const match = problem.sourceLabel.match(/(\d+)\s*-?\s*bet/i);
    if (match) {
      const parsed = Number.parseInt(match[1], 10);
      if (allowedPages.includes(parsed)) {
        return parsed;
      }
    }
  }

  return allowedPages[0];
}

export function mergeExtractedPagesIntoCache(
  cache: PdfPageCacheMap,
  topicId: number,
  requestedBookPages: number[],
  extractedOrta: MathProblem[],
  extractedMurakkab: MathProblem[],
  nowIso: string = new Date().toISOString()
): PdfPageCacheMap {
  if (requestedBookPages.length === 0) return cache;

  const grouped = new Map<number, { orta: MathProblem[]; murakkab: MathProblem[] }>();
  for (const bp of requestedBookPages) {
    grouped.set(bp, { orta: [], murakkab: [] });
  }

  for (const prob of extractedOrta) {
    const targetPage = inferProblemBookPage(prob, requestedBookPages);
    grouped.get(targetPage)?.orta.push({ ...prob, bookPage: targetPage });
  }

  for (const prob of extractedMurakkab) {
    const targetPage = inferProblemBookPage(prob, requestedBookPages);
    grouped.get(targetPage)?.murakkab.push({ ...prob, bookPage: targetPage });
  }

  const nextCache: PdfPageCacheMap = { ...cache };
  for (const [bookPage, bucket] of grouped.entries()) {
    if (bucket.orta.length > 0 || bucket.murakkab.length > 0) {
      nextCache[makePdfPageCacheKey(topicId, bookPage)] = {
        topicId,
        bookPage,
        orta: bucket.orta,
        murakkab: bucket.murakkab,
        cachedAt: nowIso,
      };
    }
  }

  return nextCache;
}
