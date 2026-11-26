import type { DifficultyLevel, MathProblem, PersistedLabState, TopicLesson } from '../types/math';

export const STORAGE_KEY = 'usmonov_math_lab_state_v1';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const DEFAULT_PDF_OFFSET = -2;

export const DEFAULT_LAB_STATE: PersistedLabState = {
  completedTopicIds: [],
  solvedProblemIds: {},
  xp: 0,
  theme: 'light',
  pdfOffset: DEFAULT_PDF_OFFSET,
  cachedLessons: {},
  customProblems: {},
};

export function clampPdfOffset(offset: number): number {
  if (!Number.isFinite(offset)) return DEFAULT_PDF_OFFSET;
  return Math.max(-100, Math.min(100, Math.trunc(offset)));
}

export function loadLabState(storage?: StorageLike | null): PersistedLabState {
  const store = storage ?? (typeof window !== 'undefined' ? window.localStorage : null);
  if (!store) return { ...DEFAULT_LAB_STATE };

  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_LAB_STATE };
    const parsed = JSON.parse(raw) as Partial<PersistedLabState>;
    return {
      completedTopicIds: Array.isArray(parsed.completedTopicIds) ? parsed.completedTopicIds : [],
      solvedProblemIds:
        parsed.solvedProblemIds && typeof parsed.solvedProblemIds === 'object'
          ? parsed.solvedProblemIds
          : {},
      xp: typeof parsed.xp === 'number' && Number.isFinite(parsed.xp) ? parsed.xp : 0,
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      pdfOffset:
        typeof parsed.pdfOffset === 'number' && Number.isFinite(parsed.pdfOffset)
          ? clampPdfOffset(parsed.pdfOffset)
          : DEFAULT_PDF_OFFSET,
      cachedLessons:
        parsed.cachedLessons && typeof parsed.cachedLessons === 'object'
          ? parsed.cachedLessons
          : {},
      customProblems:
        parsed.customProblems && typeof parsed.customProblems === 'object'
          ? parsed.customProblems
          : {},
    };
  } catch {
    return { ...DEFAULT_LAB_STATE };
  }
}

export function saveLabState(
  state: PersistedLabState,
  storage?: StorageLike | null
): void {
  const store = storage ?? (typeof window !== 'undefined' ? window.localStorage : null);
  if (!store) return;

  try {
    store.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function recordSolvedProblem(
  state: PersistedLabState,
  topicId: number,
  problemId: string,
  xpReward: number
): PersistedLabState {
  const existing = state.solvedProblemIds[topicId] ?? [];
  if (existing.includes(problemId)) {
    return state;
  }

  const nextSolved = [...existing, problemId];
  const shouldAutoComplete = nextSolved.length >= 3 && !state.completedTopicIds.includes(topicId);

  return {
    ...state,
    xp: state.xp + xpReward,
    solvedProblemIds: {
      ...state.solvedProblemIds,
      [topicId]: nextSolved,
    },
    completedTopicIds: shouldAutoComplete
      ? [...state.completedTopicIds, topicId]
      : state.completedTopicIds,
  };
}

export function toggleTopicCompletion(
  state: PersistedLabState,
  topicId: number
): PersistedLabState {
  const isCompleted = state.completedTopicIds.includes(topicId);
  return {
    ...state,
    completedTopicIds: isCompleted
      ? state.completedTopicIds.filter((id) => id !== topicId)
      : [...state.completedTopicIds, topicId],
  };
}

export function cacheGeneratedProblems(
  state: PersistedLabState,
  topicId: number,
  difficulty: DifficultyLevel,
  problems: MathProblem[]
): PersistedLabState {
  const existing = state.customProblems[topicId] ?? { orta: [], murakkab: [] };
  return {
    ...state,
    customProblems: {
      ...state.customProblems,
      [topicId]: {
        ...existing,
        [difficulty]: problems,
      },
    },
  };
}

export function cacheExtractedBookProblems(
  state: PersistedLabState,
  topicId: number,
  ortaProblems: MathProblem[],
  murakkabProblems: MathProblem[]
): PersistedLabState {
  const existing = state.customProblems[topicId] ?? { orta: [], murakkab: [] };
  return {
    ...state,
    customProblems: {
      ...state.customProblems,
      [topicId]: {
        orta: ortaProblems.length > 0 ? ortaProblems : existing.orta,
        murakkab: murakkabProblems.length > 0 ? murakkabProblems : existing.murakkab,
      },
    },
  };
}

export function cacheTopicLesson(
  state: PersistedLabState,
  lesson: TopicLesson
): PersistedLabState {
  return {
    ...state,
    cachedLessons: {
      ...state.cachedLessons,
      [lesson.topicId]: lesson,
    },
  };
}

export function getTotalSolvedCount(state: PersistedLabState): number {
  return Object.values(state.solvedProblemIds).reduce((sum, list) => sum + list.length, 0);
}
