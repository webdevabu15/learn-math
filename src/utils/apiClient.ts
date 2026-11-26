export const SERVER_STARTING_STATUS = 'Server ishga tushmoqda, kutilmoqda...';
export const DEFAULT_WAKEUP_MAX_RETRIES = 5;
export const DEFAULT_WAKEUP_RETRY_DELAY_MS = 2500;
export const RATE_LIMIT_UZBEK_NOTICE =
  "So'rovlar kvotasi vaqtincha tugadi (HTTP 429 · RESOURCE_EXHAUSTED). Iltimos, 60 soniya kutib qayta urinib ko'ring. Agar kunlik bepul limit to'liq tugagan bo'lsa, keshlangan sahifalar yoki avval generatsiya qilingan misollar bilan mashq qilishda davom etishingiz mumkin.";

export class ApiHttpError extends Error {
  readonly status: number;
  readonly isRateLimited: boolean;

  constructor(message: string, status: number, isRateLimited = false) {
    super(message);
    this.name = 'ApiHttpError';
    this.status = status;
    this.isRateLimited = isRateLimited;
  }
}

export function isRateLimitError(err: unknown): boolean {
  if (err instanceof ApiHttpError) {
    return err.isRateLimited || err.status === 429;
  }
  const msg = err instanceof Error ? err.message : String(err ?? '');
  return msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED');
}

export interface PostJsonWithWakeupOptions {
  maxRetries?: number;
  retryDelayMs?: number;
  onStatusChange?: (
    statusMessage: string | null,
    attempt: number,
    maxRetries: number
  ) => void;
  fetchFn?: typeof fetch;
  sleepFn?: (ms: number) => Promise<void>;
}

const defaultSleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Detects HTML wake-up/interstitial pages (such as AI Studio's "Starting Server...")
 * before calling JSON.parse so the frontend can retry cleanly.
 */
export function isHtmlStartingResponse(
  contentType: string | null,
  rawText: string
): boolean {
  const normalizedType = (contentType ?? '').toLowerCase();
  if (normalizedType.includes('text/html')) {
    return true;
  }

  const trimmed = rawText.trimStart().toLowerCase();
  return trimmed.startsWith('<!doctype html') || trimmed.startsWith('<html');
}

function formatNonJsonSnippet(rawText: string): string {
  return rawText
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 220);
}

/**
 * Sends a JSON POST request to an internal API route and automatically retries
 * when the sandbox server is still waking up and responds with an HTML boot page.
 * Formats HTTP 429 RESOURCE_EXHAUSTED responses with a clear Uzbek quota notice.
 */
export async function postJsonWithWakeupRetry<T>(
  url: string,
  payload: unknown,
  options: PostJsonWithWakeupOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? DEFAULT_WAKEUP_MAX_RETRIES;
  const retryDelayMs = options.retryDelayMs ?? DEFAULT_WAKEUP_RETRY_DELAY_MS;
  const fetchFn = options.fetchFn ?? fetch;
  const sleepFn = options.sleepFn ?? defaultSleep;
  const notify = options.onStatusChange;

  try {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const res = await fetchFn(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type');
      const rawText = await res.text();

      if (isHtmlStartingResponse(contentType, rawText)) {
        if (attempt < maxRetries) {
          notify?.(SERVER_STARTING_STATUS, attempt + 1, maxRetries);
          await sleepFn(retryDelayMs);
          continue;
        }
        throw new ApiHttpError(
          `Server hali ishga tushib ulgurmadi (HTTP ${res.status}). Birozdan so'ng qayta urinib ko'ring.`,
          res.status,
          false
        );
      }

      notify?.(null, 0, maxRetries);

      let parsed: Record<string, unknown> = {};
      if (rawText.trim().length > 0) {
        try {
          parsed = JSON.parse(rawText) as Record<string, unknown>;
        } catch {
          const snippet = formatNonJsonSnippet(rawText);
          if (res.status === 429) {
            throw new ApiHttpError(RATE_LIMIT_UZBEK_NOTICE, 429, true);
          }
          if (!res.ok) {
            throw new ApiHttpError(
              `HTTP ${res.status} (${res.statusText || 'Server xatosi'}): ${
                snippet || 'Javob JSON formatida qaytmadi.'
              }`,
              res.status,
              false
            );
          }
          throw new ApiHttpError(
            `Server javobini o'qib bo'lmadi (HTTP ${res.status}): ${
              snippet || 'Kutilmagan javob formati.'
            }`,
            res.status,
            false
          );
        }
      }

      if (!res.ok) {
        const detail =
          (typeof parsed.error === 'string' && parsed.error) ||
          (typeof parsed.details === 'string' && parsed.details) ||
          res.statusText ||
          "Noma'lum xatolik";

        if (
          res.status === 429 ||
          detail.includes('RESOURCE_EXHAUSTED') ||
          detail.includes('HTTP 429')
        ) {
          const notice = detail.includes('60 soniya')
            ? detail
            : RATE_LIMIT_UZBEK_NOTICE;
          throw new ApiHttpError(notice, 429, true);
        }

        const prefix = detail.includes(`HTTP ${res.status}`)
          ? ''
          : `HTTP ${res.status}: `;
        throw new ApiHttpError(`${prefix}${detail}`, res.status, false);
      }

      return parsed as T;
    }

    throw new ApiHttpError(
      "Server ishga tushishi kutilganidan uzoq davom etdi. Qayta urinib ko'ring.",
      503,
      false
    );
  } finally {
    notify?.(null, 0, maxRetries);
  }
}
