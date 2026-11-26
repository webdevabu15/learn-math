import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

// Configure PDF.js worker using the exact matching pdfjs-dist version from unpkg
// so it runs cleanly in Vite without worker bundling errors.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export type LoadedPdfDocument = PDFDocumentProxy;

const MAX_PDF_FILE_BYTES = 250 * 1024 * 1024; // 250 MB client-side safety bound

export interface LoadedPdfInfo {
  doc: PDFDocumentProxy;
  numPages: number;
  fileName: string;
  dispose: () => Promise<void>;
}

/**
 * Loads a local PDF File 100% in-browser into memory (never uploaded to any server).
 */
export async function loadPdfFromFile(file: File): Promise<LoadedPdfInfo> {
  const isPdfMime = file.type === 'application/pdf';
  const isPdfExt = file.name.toLowerCase().endsWith('.pdf');
  if (!isPdfMime && !isPdfExt) {
    throw new Error("Faqat PDF (.pdf) fayllarini ulash mumkin.");
  }
  if (file.size === 0) {
    throw new Error("Tanlangan PDF fayl bo'sh.");
  }
  if (file.size > MAX_PDF_FILE_BYTES) {
    throw new Error("PDF fayl hajmi juda katta (maksimum 250 MB).");
  }

  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({ data });
  const doc = await loadingTask.promise;

  return {
    doc,
    numPages: doc.numPages,
    fileName: file.name,
    dispose: async () => {
      try {
        await doc.cleanup();
      } catch {
        // Ignore cleanup errors
      }
      try {
        await loadingTask.destroy();
      } catch {
        // Ignore destroy errors
      }
    },
  };
}

/**
 * Renders a single PDF page thumbnail onto a target <canvas> locally in the browser.
 * Returns a cancellation handle so switching topics or offsets never leaves stale renders.
 */
export function renderPdfThumbnail(
  doc: PDFDocumentProxy,
  pdfPageNumber: number,
  canvas: HTMLCanvasElement,
  targetCssWidth: number = 220
): { cancel: () => void; promise: Promise<void> } {
  let cancelled = false;
  let activeRenderTask: { cancel: () => void; promise: Promise<void> } | null = null;

  const promise = (async () => {
    if (pdfPageNumber < 1 || pdfPageNumber > doc.numPages) {
      throw new Error(`PDF faylda ${pdfPageNumber}-bet mavjud emas.`);
    }

    const page = await doc.getPage(pdfPageNumber);
    if (cancelled) return;

    const baseViewport = page.getViewport({ scale: 1 });
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    const scale = (targetCssWidth / baseViewport.width) * dpr;
    const viewport = page.getViewport({ scale });

    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (cancelled) return;

    const renderTask = page.render({
      canvas,
      viewport,
      background: '#ffffff',
    });
    activeRenderTask = renderTask;

    try {
      await renderTask.promise;
    } catch (err) {
      // Ignore intentional RenderingCancelledException when switching pages/topics
      if (cancelled) return;
      const errName = err instanceof Error ? err.name : '';
      if (errName === 'RenderingCancelledException') return;
      throw err;
    }
  })();

  return {
    cancel: () => {
      cancelled = true;
      try {
        activeRenderTask?.cancel();
      } catch {
        // Safe to ignore already-finished task
      }
    },
    promise,
  };
}

/**
 * Renders ONE selected PDF page onto an offscreen canvas capped at max width 1100px
 * and exports a compressed JPEG base64 string (quality: 0.75) without the data URI prefix
 * so each page stays compact (~100–180 KB) for fast mobile uploads.
 */
export async function renderPdfPageToJpegBase64(
  doc: PDFDocumentProxy,
  pdfPageNumber: number,
  quality: number = 0.75,
  maxWidth: number = 1100
): Promise<string> {
  if (pdfPageNumber < 1 || pdfPageNumber > doc.numPages) {
    throw new Error(`PDF faylda ${pdfPageNumber}-bet topilmadi.`);
  }

  const page = await doc.getPage(pdfPageNumber);
  const baseViewport = page.getViewport({ scale: 1 });

  // Strictly cap rendered width at maxWidth (default 1100px) for sharp math text & compact upload size
  const scale = Math.min(2.0, maxWidth / Math.max(1, baseViewport.width));
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.min(maxWidth, Math.floor(viewport.width)));
  canvas.height = Math.max(1, Math.floor(viewport.height));

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error("Brauzerda sahifani rasmga o'tkazib bo'lmadi.");
  }

  // Paint crisp white paper background before rendering PDF page
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvas,
    viewport,
    background: '#ffffff',
  }).promise;

  // Export at 0.75 JPEG quality; if a heavily textured scan exceeds ~180 KB (~245k base64 chars),
  // gently step down quality so mobile uploads stay fast and compact.
  let dataUrl = canvas.toDataURL('image/jpeg', quality);
  if (dataUrl.length > 245_000 && quality > 0.6) {
    dataUrl = canvas.toDataURL('image/jpeg', 0.62);
  }
  // Release backing canvas bitmap immediately
  canvas.width = 0;
  canvas.height = 0;

  const commaIdx = dataUrl.indexOf(',');
  if (commaIdx === -1) {
    throw new Error("Sahifa rasmini kodlashda xatolik yuz berdi.");
  }
  return dataUrl.slice(commaIdx + 1);
}
