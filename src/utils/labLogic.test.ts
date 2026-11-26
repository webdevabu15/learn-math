import test from 'node:test';
import assert from 'node:assert/strict';
import { areMathAnswersEquivalent, normalizeMathInput } from './mathEquivalence';
import { parseMathSegments, renderKatexToString } from './mathParser';
import {
  DEFAULT_LAB_STATE,
  DEFAULT_PDF_OFFSET,
  STORAGE_KEY,
  cacheExtractedBookProblems,
  cacheGeneratedProblems,
  clampPdfOffset,
  getTotalSolvedCount,
  loadLabState,
  recordSolvedProblem,
  saveLabState,
  toggleTopicCompletion,
  type StorageLike,
} from './storage';
import {
  CURRICULUM_SECTIONS,
  TOPICS_META,
  filterTopicsByQuery,
  getNextTopicMeta,
  getSeedLesson,
  getTopicMeta,
} from '../data/curriculum';
import { resolveSimulatorForTopic } from './simulatorRouting';
import { sanitizeInlineSvg } from './svgSanitizer';
import {
  computePdfPageNumber,
  getClampedBookPageList,
  toggleSelectedBookPage,
} from './pdfPageMath';
import {
  DEFAULT_WAKEUP_MAX_RETRIES,
  DEFAULT_WAKEUP_RETRY_DELAY_MS,
  RATE_LIMIT_UZBEK_NOTICE,
  SERVER_STARTING_STATUS,
  isHtmlStartingResponse,
  isRateLimitError,
  postJsonWithWakeupRetry,
} from './apiClient';
import {
  PDF_PAGE_CACHE_STORAGE_KEY,
  isPdfPageCached,
  loadPdfPageCache,
  makePdfPageCacheKey,
  mergeExtractedPagesIntoCache,
  partitionSelectedPdfPages,
  savePdfPageCache,
} from './pdfPageCache';

function createMemoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => {
      map.set(k, v);
    },
  };
}

test('mathEquivalence handles Uzbek decimals, fractions, mixed numbers, and repeating decimals', () => {
  assert.equal(areMathAnswersEquivalent('0.5', '1/2'), true);
  assert.equal(areMathAnswersEquivalent('0,5', '1/2'), true);
  assert.equal(areMathAnswersEquivalent('2/4', '1/2'), true);
  assert.equal(areMathAnswersEquivalent('50%', '1/2'), true);
  assert.equal(areMathAnswersEquivalent('\\frac{1}{2}', '0,5'), true);
  assert.equal(areMathAnswersEquivalent('1 1/2', '3/2'), true);
  assert.equal(areMathAnswersEquivalent('1,5', '3/2'), true);
  assert.equal(areMathAnswersEquivalent('0,(3)', '1/3'), true);
  assert.equal(areMathAnswersEquivalent('0,1(6)', '1/6'), true);
  assert.equal(areMathAnswersEquivalent('0.6', '1/2'), false);
});

test('mathEquivalence handles algebraic identities and equation roots', () => {
  assert.equal(areMathAnswersEquivalent('4 + 2x', '2x + 4'), true);
  assert.equal(areMathAnswersEquivalent('(x-3)(x+3)', 'x^2 - 9'), true);
  assert.equal(areMathAnswersEquivalent('x = 5', '5'), true);
  assert.equal(areMathAnswersEquivalent('3(x+2)(x-2)', '3(x - 2)(x + 2)'), true);
  assert.equal(areMathAnswersEquivalent('2x + 5', '2x + 4'), false);
  assert.equal(normalizeMathInput('  Javob:  $\\frac{5}{6}$ '), '((5)/(6))');
});

test('mathParser splits inline and display math and renders KaTeX without raw delimiters', () => {
  const segments = parseMathSegments('Hisoblang: $$\\frac{2}{3} + \\frac{1}{6}$$ va $x = 5$');
  assert.equal(segments.length, 4);
  assert.equal(segments[1].type, 'display-math');
  assert.equal(segments[3].type, 'inline-math');

  const html = renderKatexToString('\\frac{2}{3}', false);
  assert.equal(html.includes('katex-html'), true);
  assert.equal(html.includes('frac-line'), true);
});

test('storage persists XP, solved problem counts, auto-completion, pdfOffset, and extracted book problems', () => {
  const mem = createMemoryStorage();
  let state = loadLabState(mem);
  assert.deepEqual(state, DEFAULT_LAB_STATE);
  assert.equal(state.pdfOffset, DEFAULT_PDF_OFFSET);
  assert.equal(state.pdfOffset, -2);

  state = recordSolvedProblem(state, 3, 't3-m-1', 15);
  state = recordSolvedProblem(state, 3, 't3-m-1', 15);
  assert.equal(state.xp, 15);
  assert.equal(getTotalSolvedCount(state), 1);

  state = recordSolvedProblem(state, 3, 't3-m-2', 15);
  state = recordSolvedProblem(state, 3, 't3-m-3', 15);
  assert.equal(state.xp, 45);
  assert.equal(state.completedTopicIds.includes(3), true);

  state = toggleTopicCompletion(state, 4);
  assert.equal(state.completedTopicIds.includes(4), true);

  state = cacheGeneratedProblems(state, 3, 'orta', []);
  state = cacheExtractedBookProblems(
    state,
    3,
    [
      {
        id: 'pdf-3-orta-1',
        difficulty: 'orta',
        statement: 'Hisoblang: $\\frac{1}{2} + \\frac{1}{3}$',
        answer: '5/6',
        socraticHint: 'Umumiy maxraj toping.',
        steps: ['Umumiy maxraj 6.'],
        sourceLabel: 'Usmonov kitobi · 15-bet (№ 1)',
      },
    ],
    [
      {
        id: 'pdf-3-hard-1',
        difficulty: 'murakkab',
        statement: 'Hisoblang: $\\frac{5}{6} - \\frac{1}{4}$',
        answer: '7/12',
        socraticHint: 'EKUK(6, 4) ni toping.',
        steps: ['Umumiy maxraj 12.'],
        sourceLabel: 'Usmonov kitobi · 16-bet (№ 12)',
      },
    ]
  );
  state = { ...state, pdfOffset: clampPdfOffset(-4) };
  saveLabState(state, mem);

  const reloaded = loadLabState(mem);
  assert.equal(reloaded.xp, 45);
  assert.equal(reloaded.pdfOffset, -4);
  assert.equal(reloaded.customProblems[3].orta[0].id, 'pdf-3-orta-1');
  assert.equal(reloaded.customProblems[3].murakkab[0].id, 'pdf-3-hard-1');
  assert.equal(reloaded.completedTopicIds.includes(3), true);
  assert.equal(reloaded.completedTopicIds.includes(4), true);
  assert.ok(mem.getItem(STORAGE_KEY));
});

test('full curriculum contains Sections 1–8 (Topics 3–107 + Variant 35–42 & Variant 54–73) with valid seed lessons', () => {
  assert.equal(CURRICULUM_SECTIONS.length, 8);
  assert.equal(TOPICS_META.length, 133);
  assert.equal(TOPICS_META[0].id, 3);
  assert.equal(TOPICS_META[TOPICS_META.length - 1].id, 107);

  const uniqueIds = new Set(TOPICS_META.map((t) => t.id));
  assert.equal(uniqueIds.size, 133);

  const v35_42 = TOPICS_META.filter((t) => t.variantGroup === '35-42');
  const v54_73 = TOPICS_META.filter((t) => t.variantGroup === '54-73');
  assert.equal(v35_42.length, 8);
  assert.equal(v54_73.length, 20);

  for (const topic of TOPICS_META) {
    const lesson = getSeedLesson(topic.id);
    assert.equal(lesson.topicId, topic.id);
    assert.ok(lesson.muammo.headline.length > 0);
    assert.ok(lesson.chegara.headline.length > 0);
    assert.ok(lesson.formula.items.length > 0);
    assert.ok(lesson.problems.orta.length > 0);
    assert.ok(lesson.problems.murakkab.length > 0);
  }

  assert.equal(getNextTopicMeta(49)?.displayCode, 'V35');
  assert.equal(getNextTopicMeta(1042)?.id, 50);
  assert.equal(getNextTopicMeta(107), null);

  const filteredVariant = filterTopicsByQuery('V35');
  assert.ok(filteredVariant.some((t) => t.id === 1035));
  const filteredCalculus = filterTopicsByQuery('integral');
  assert.ok(filteredCalculus.some((t) => t.id === 105));
});

test('resolveSimulatorForTopic maps all curriculum ranges to the right Stage 3 simulator', () => {
  assert.equal(resolveSimulatorForTopic(3).category, 'fractions');
  assert.equal(resolveSimulatorForTopic(7).category, 'fractions');

  assert.equal(resolveSimulatorForTopic(9).category, 'algebra');
  assert.equal(resolveSimulatorForTopic(9).algebraMode, 'balance');
  assert.equal(resolveSimulatorForTopic(16).category, 'algebra');
  assert.equal(resolveSimulatorForTopic(16).algebraMode, 'area');
  assert.equal(resolveSimulatorForTopic(18).algebraMode, 'area');
  assert.equal(resolveSimulatorForTopic(32).category, 'algebra');
  assert.equal(resolveSimulatorForTopic(32).algebraMode, 'interval');
  assert.equal(resolveSimulatorForTopic(45).category, 'algebra');

  assert.equal(resolveSimulatorForTopic(23).category, 'functions');
  assert.equal(resolveSimulatorForTopic(23).functionMode, 'linear');
  assert.equal(resolveSimulatorForTopic(39).category, 'functions');
  assert.equal(resolveSimulatorForTopic(39).functionMode, 'quadratic');
  assert.equal(resolveSimulatorForTopic(58).functionMode, 'exponential');
  assert.equal(resolveSimulatorForTopic(61).functionMode, 'logarithmic');

  assert.equal(resolveSimulatorForTopic(69).category, 'trigonometry');
  assert.equal(resolveSimulatorForTopic(94).category, 'trigonometry');

  assert.equal(resolveSimulatorForTopic(96).category, 'calculus');
  assert.equal(resolveSimulatorForTopic(96).calculusMode, 'derivative');
  assert.equal(resolveSimulatorForTopic(105).category, 'calculus');
  assert.equal(resolveSimulatorForTopic(105).calculusMode, 'integral');

  assert.equal(resolveSimulatorForTopic(25).category, 'word-problem');
  assert.equal(resolveSimulatorForTopic(25).wordMode, 'motion');
  assert.equal(resolveSimulatorForTopic(26).wordMode, 'mixture');
  assert.equal(resolveSimulatorForTopic(27).wordMode, 'work');
});

test('sanitizeInlineSvg preserves clean educational SVG and strips XSS payloads', () => {
  const safe = sanitizeInlineSvg(
    '<svg viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="80" height="40" fill="#4f46e5"/><text x="20" y="35">Masofa</text></svg>'
  );
  assert.ok(safe && safe.includes('<rect') && safe.includes('Masofa'));

  const malicious = sanitizeInlineSvg(
    '<svg onload="alert(1)" viewBox="0 0 100 100"><script>alert(2)</script><foreignObject><div>bad</div></foreignObject><a href="javascript:alert(3)"><circle cx="50" cy="50" r="20" onclick="evil()"/></a></svg>'
  );
  assert.ok(malicious);
  assert.equal(malicious.includes('<script'), false);
  assert.equal(malicious.includes('foreignObject'), false);
  assert.equal(malicious.includes('onload'), false);
  assert.equal(malicious.includes('onclick'), false);
  assert.equal(malicious.includes('javascript:'), false);

  assert.equal(sanitizeInlineSvg('<div>not an svg</div>'), null);
});

test('curriculum topics include exact and progressive pageRange metadata and PDF page offset math works', () => {
  assert.deepEqual(getTopicMeta(3).pageRange, [15, 22]);
  assert.deepEqual(getTopicMeta(4).pageRange, [23, 25]);
  assert.deepEqual(getTopicMeta(5).pageRange, [26, 27]);
  assert.deepEqual(getTopicMeta(6).pageRange, [28, 28]);
  assert.deepEqual(getTopicMeta(7).pageRange, [29, 30]);
  assert.deepEqual(getTopicMeta(8).pageRange, [33, 33]);
  assert.deepEqual(getTopicMeta(9).pageRange, [34, 36]);
  assert.deepEqual(getTopicMeta(10).pageRange, [37, 39]);

  for (const topic of TOPICS_META) {
    assert.ok(topic.pageRange, `Topic ${topic.id} missing pageRange`);
    assert.ok(topic.pageRange[0] >= 1 && topic.pageRange[1] >= topic.pageRange[0]);
  }

  // Printed book page 15 with default offset -2 -> PDF page 13
  assert.equal(computePdfPageNumber(15, -2), 13);
  assert.equal(computePdfPageNumber(22, -2), 20);

  const range = getClampedBookPageList(15, 22);
  assert.deepEqual(range.pages, [15, 16, 17, 18, 19, 20, 21, 22]);
  assert.equal(range.truncated, false);

  const huge = getClampedBookPageList(1, 100, 10);
  assert.equal(huge.pages.length, 10);
  assert.equal(huge.truncated, true);

  // Max 3 selected pages enforced
  let sel: number[] = [];
  sel = toggleSelectedBookPage(sel, 15);
  sel = toggleSelectedBookPage(sel, 17);
  sel = toggleSelectedBookPage(sel, 16);
  assert.deepEqual(sel, [15, 16, 17]);
  sel = toggleSelectedBookPage(sel, 18); // ignored since max 3 reached
  assert.deepEqual(sel, [15, 16, 17]);
  sel = toggleSelectedBookPage(sel, 16); // deselect
  assert.deepEqual(sel, [15, 17]);
});

test('apiClient detects HTML wake-up responses and retries up to 5 times with 2.5s delay', async () => {
  assert.equal(DEFAULT_WAKEUP_MAX_RETRIES, 5);
  assert.equal(DEFAULT_WAKEUP_RETRY_DELAY_MS, 2500);
  assert.equal(SERVER_STARTING_STATUS, 'Server ishga tushmoqda, kutilmoqda...');

  assert.equal(isHtmlStartingResponse('text/html; charset=utf-8', 'Starting Server...'), true);
  assert.equal(isHtmlStartingResponse('application/octet-stream', '  <!DOCTYPE html><html>Starting Server...</html>'), true);
  assert.equal(isHtmlStartingResponse(null, '<!doctype html><body>Booting</body>'), true);
  assert.equal(isHtmlStartingResponse('application/json', '{"ok":true}'), false);

  // Case 1: 2 HTML wake-up responses followed by JSON success
  let calls = 0;
  const delays: number[] = [];
  const statuses: Array<string | null> = [];

  const result = await postJsonWithWakeupRetry<{ ok: boolean; value: number }>(
    '/api/gemini/test',
    { ping: 1 },
    {
      fetchFn: (async () => {
        calls++;
        if (calls <= 2) {
          return new Response('<!doctype html><html><title>Starting Server...</title></html>', {
            status: 503,
            headers: { 'content-type': 'text/html; charset=utf-8' },
          });
        }
        return new Response(JSON.stringify({ ok: true, value: 42 }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      }) as typeof fetch,
      sleepFn: async (ms) => {
        delays.push(ms);
      },
      onStatusChange: (msg) => {
        statuses.push(msg);
      },
    }
  );

  assert.deepEqual(result, { ok: true, value: 42 });
  assert.equal(calls, 3);
  assert.deepEqual(delays, [2500, 2500]);
  assert.equal(statuses[0], SERVER_STARTING_STATUS);
  assert.equal(statuses[1], SERVER_STARTING_STATUS);
  assert.equal(statuses[statuses.length - 1], null);

  // Case 2: Exhausts all 5 retries (6 total attempts) when server stays on HTML page
  let failCalls = 0;
  const failDelays: number[] = [];
  await assert.rejects(
    () =>
      postJsonWithWakeupRetry('/api/gemini/test', {}, {
        fetchFn: (async () => {
          failCalls++;
          return new Response('<!doctype html><html>Starting Server...</html>', {
            status: 503,
            headers: { 'content-type': 'text/html' },
          });
        }) as typeof fetch,
        sleepFn: async (ms) => {
          failDelays.push(ms);
        },
      }),
    /Server hali ishga tushib ulgurmadi/
  );
  assert.equal(failCalls, 6);
  assert.equal(failDelays.length, 5);

  // Case 3: Immediately surfaces real JSON HTTP errors without wake-up retries
  let jsonErrCalls = 0;
  await assert.rejects(
    () =>
      postJsonWithWakeupRetry('/api/gemini/test', {}, {
        fetchFn: (async () => {
          jsonErrCalls++;
          return new Response(JSON.stringify({ error: 'Model band' }), {
            status: 503,
            headers: { 'content-type': 'application/json' },
          });
        }) as typeof fetch,
        sleepFn: async () => {
          throw new Error('Should not sleep on JSON error');
        },
      }),
    /HTTP 503: Model band/
  );
  assert.equal(jsonErrCalls, 1);

  // Case 4: HTTP 429 RESOURCE_EXHAUSTED surfaces clear Uzbek 60s + cached problems notice
  let rateLimitCalls = 0;
  let caughtErr: unknown = null;
  try {
    await postJsonWithWakeupRetry('/api/gemini/extract-pdf-pages', {}, {
      fetchFn: (async () => {
        rateLimitCalls++;
        return new Response(
          JSON.stringify({ error: 'RESOURCE_EXHAUSTED: quota exceeded' }),
          {
            status: 429,
            headers: { 'content-type': 'application/json' },
          }
        );
      }) as typeof fetch,
      sleepFn: async () => {
        throw new Error('Should not auto-retry 429 immediately');
      },
    });
  } catch (err) {
    caughtErr = err;
  }
  assert.equal(rateLimitCalls, 1);
  assert.equal(isRateLimitError(caughtErr), true);
  assert.equal((caughtErr as Error).message, RATE_LIMIT_UZBEK_NOTICE);
  assert.equal((caughtErr as Error).message.includes('60 soniya'), true);
});

test('pdfPageCache caches extracted problems by topicId + bookPageNumber and avoids redundant API calls', () => {
  const mem = createMemoryStorage();
  assert.equal(makePdfPageCacheKey(3, 15), '3:15');

  let cache = loadPdfPageCache(mem);
  assert.deepEqual(cache, {});

  cache = mergeExtractedPagesIntoCache(
    cache,
    3,
    [15, 16],
    [
      {
        id: 'p15-m1',
        difficulty: 'orta',
        statement: 'Hisoblang: $\\frac{1}{2} + \\frac{1}{4}$',
        answer: '3/4',
        socraticHint: 'Umumiy maxraj toping.',
        steps: ['2/4 + 1/4 = 3/4'],
        sourceLabel: 'Usmonov kitobi · 15-bet (№ 1)',
        bookPage: 15,
      },
    ],
    [
      {
        id: 'p16-h1',
        difficulty: 'murakkab',
        statement: 'Hisoblang: $\\frac{5}{6} - \\frac{1}{4}$',
        answer: '7/12',
        socraticHint: 'EKUK(6, 4) ni toping.',
        steps: ['10/12 - 3/12 = 7/12'],
        sourceLabel: 'Usmonov kitobi · 16-bet (№ 9)',
        bookPage: 16,
      },
    ],
    '2026-11-25T15:00:00.000Z'
  );

  savePdfPageCache(cache, mem);
  assert.ok(mem.getItem(PDF_PAGE_CACHE_STORAGE_KEY));

  const reloaded = loadPdfPageCache(mem);
  assert.equal(isPdfPageCached(reloaded, 3, 15), true);
  assert.equal(isPdfPageCached(reloaded, 3, 16), true);
  assert.equal(isPdfPageCached(reloaded, 3, 17), false);
  assert.equal(isPdfPageCached(reloaded, 4, 15), false); // isolated by topicId

  // Full cache hit -> missingPages is empty, zero API call needed
  const fullHit = partitionSelectedPdfPages(reloaded, 3, [15, 16]);
  assert.deepEqual(fullHit.cachedPages, [15, 16]);
  assert.deepEqual(fullHit.missingPages, []);
  assert.equal(fullHit.cachedOrta.length, 1);
  assert.equal(fullHit.cachedMurakkab.length, 1);

  // Partial cache hit -> only uncached page 17 is requested from API
  const partialHit = partitionSelectedPdfPages(reloaded, 3, [15, 17]);
  assert.deepEqual(partialHit.cachedPages, [15]);
  assert.deepEqual(partialHit.missingPages, [17]);
  assert.equal(partialHit.cachedOrta[0].id, 'p15-m1');
});


