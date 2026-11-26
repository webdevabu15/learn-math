export type PedagogyTab =
  | 'muammo'
  | 'chegara'
  | 'intuisiya'
  | 'formula'
  | 'amaliyot';

export type DifficultyLevel = 'orta' | 'murakkab';

export type SimulatorCategory =
  | 'fractions'
  | 'algebra'
  | 'functions'
  | 'trigonometry'
  | 'calculus'
  | 'word-problem';

export type AlgebraSubMode = 'balance' | 'area' | 'interval';
export type FunctionSubMode = 'linear' | 'quadratic' | 'exponential' | 'logarithmic';
export type CalculusSubMode = 'derivative' | 'integral';
export type WordProblemSubMode = 'motion' | 'mixture' | 'work';

export interface FormulaCard {
  title: string;
  latex: string;
  explanation: string;
  example?: string;
}

export interface MathProblem {
  id: string;
  difficulty: DifficultyLevel;
  statement: string;
  answer: string;
  acceptedEquivalents?: string[];
  socraticHint: string;
  steps: string[];
  sourceLabel?: string;
  bookPage?: number;
}

export interface TopicLesson {
  topicId: number;
  muammo: {
    headline: string;
    contextLabel: string;
    story: string[];
    coreQuestion: string;
    historicalNote: string;
  };
  chegara: {
    headline: string;
    whatWorkedBefore: string;
    breakingPoint: string;
    deadEndExample: string;
    whyNewIdeaNeeded: string;
  };
  intuisiya: {
    headline: string;
    analogyTitle: string;
    analogyStory: string;
    guidedPrompts: string[];
    defaultSimulatorMode: 'single' | 'compare' | 'combine' | 'numberline';
    defaultPreset: {
      numA: number;
      denA: number;
      numB: number;
      denB: number;
    };
  };
  formula: {
    headline: string;
    bridgeFromIntuition: string;
    items: FormulaCard[];
    keyPitfall: {
      title: string;
      wrong: string;
      right: string;
      reason: string;
    };
  };
  problems: {
    orta: MathProblem[];
    murakkab: MathProblem[];
  };
  isAiEnhanced?: boolean;
  updatedAt?: string;
}

export interface SectionMeta {
  id: number;
  title: string;
  rangeLabel: string;
}

export interface TopicMeta {
  id: number;
  sectionId: number;
  title: string;
  shortDesc: string;
  pageRange?: [number, number];
  displayCode?: string;
  isVariant?: boolean;
  variantGroup?: '35-42' | '54-73';
}

export interface ExtractedBookPagePayload {
  bookPage: number;
  pdfPage: number;
  imageBase64: string;
}

export interface CustomSolutionResult {
  recognizedProblem: string;
  finalAnswer: string;
  socraticHint: string;
  steps: string[];
  conceptNote: string;
}

export interface MentorMessage {
  id: string;
  role: 'user' | 'mentor';
  content: string;
  timestamp: string;
}

export interface CheckAnswerResponse {
  isCorrect: boolean;
  feedback: string;
  socraticHint?: string;
  normalizedExpected?: string;
}

export interface PersistedLabState {
  completedTopicIds: number[];
  solvedProblemIds: Record<number, string[]>;
  xp: number;
  theme: 'light' | 'dark';
  pdfOffset: number;
  cachedLessons: Record<number, TopicLesson>;
  customProblems: Record<number, { orta: MathProblem[]; murakkab: MathProblem[] }>;
}
