/**
 * Pure page-mapping utilities for Usmonov textbook PDF integration.
 * Kept separate from pdfjs-dist so unit tests can import without browser DOM globals.
 */

export const MAX_PREVIEW_PAGES = 20;
export const MAX_SELECTED_PDF_PAGES = 3;

export function computePdfPageNumber(bookPage: number, offset: number): number {
  return Math.trunc(bookPage) + Math.trunc(offset);
}

export function getClampedBookPageList(
  startBookPage: number,
  endBookPage: number,
  maxPages: number = MAX_PREVIEW_PAGES
): { pages: number[]; truncated: boolean } {
  const safeStart = Math.max(1, Math.trunc(Number.isFinite(startBookPage) ? startBookPage : 1));
  const rawEnd = Math.max(
    safeStart,
    Math.trunc(Number.isFinite(endBookPage) ? endBookPage : safeStart)
  );
  const totalRequested = rawEnd - safeStart + 1;
  const count = Math.min(totalRequested, Math.max(1, maxPages));
  const pages: number[] = [];
  for (let i = 0; i < count; i++) {
    pages.push(safeStart + i);
  }
  return {
    pages,
    truncated: totalRequested > count,
  };
}

export function toggleSelectedBookPage(
  current: number[],
  bookPage: number,
  maxSelected: number = MAX_SELECTED_PDF_PAGES
): number[] {
  if (current.includes(bookPage)) {
    return current.filter((p) => p !== bookPage);
  }
  if (current.length >= maxSelected) {
    return current;
  }
  return [...current, bookPage].sort((a, b) => a - b);
}
