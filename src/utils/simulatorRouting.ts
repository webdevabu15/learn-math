import type {
  AlgebraSubMode,
  CalculusSubMode,
  FunctionSubMode,
  SimulatorCategory,
  WordProblemSubMode,
} from '../types/math';

export interface SimulatorRoute {
  category: SimulatorCategory;
  algebraMode?: AlgebraSubMode;
  functionMode?: FunctionSubMode;
  calculusMode?: CalculusSubMode;
  wordMode?: WordProblemSubMode;
  categoryLabelUz: string;
}

const FUNCTION_TOPICS = new Set([23, 39, 50, 51, 58, 61, 64, 67]);

const ALGEBRA_INEQUALITY_TOPICS = new Set([
  // 8–22
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  // 28–38
  28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
  // 40, 43–46
  40, 43, 44, 45, 46,
  // Additional algebra/equation/inequality topics
  24, 42, 52, 53, 54, 55, 59, 60, 62, 63, 65, 66, 68,
]);

const AREA_MODEL_TOPICS = new Set([13, 15, 16, 17, 18, 19, 20]);
const INTERVAL_TOPICS = new Set([28, 29, 30, 31, 32, 38, 43, 44, 46, 60, 66]);
const WORD_PROBLEM_TOPICS = new Set([25, 26, 27, 41, 47, 48, 49, 56, 57]);

/**
 * Pure deterministic router mapping any Topic ID (3–107 or Variant IDs)
 * to its Stage 3 (Virtual Intuisiya) interactive simulator and default submode.
 */
export function resolveSimulatorForTopic(topicId: number): SimulatorRoute {
  // Calculus (Topics 95–107)
  if (topicId >= 95 && topicId <= 107) {
    const calculusMode: CalculusSubMode = topicId >= 104 ? 'integral' : 'derivative';
    return {
      category: 'calculus',
      calculusMode,
      categoryLabelUz:
        calculusMode === 'integral'
          ? 'Matematik analiz · Riman yig‘indisi va yuza'
          : 'Matematik analiz · Urinma va hosila qiyaligi',
    };
  }

  // Trigonometry (Topics 69–94)
  if (topicId >= 69 && topicId <= 94) {
    return {
      category: 'trigonometry',
      categoryLabelUz: 'Trigonometriya · Interaktiv birlik aylana va to‘lqin grafigi',
    };
  }

  // Functions & Graphs (Topics 23, 39, 50–51, 58, 61, 64, 67)
  if (FUNCTION_TOPICS.has(topicId)) {
    let functionMode: FunctionSubMode = 'linear';
    if (topicId === 39) functionMode = 'quadratic';
    else if (topicId === 58 || topicId === 67) functionMode = 'exponential';
    else if (topicId === 61 || topicId === 64) functionMode = 'logarithmic';
    return {
      category: 'functions',
      functionMode,
      categoryLabelUz: 'Funksiyalar va grafiklar · Interaktiv koordinata tekisligi',
    };
  }

  // Word Problems (Motion, Mixtures, Work, Progressions) -> Built-in SVG + Gemini Diagram fallback
  if (WORD_PROBLEM_TOPICS.has(topicId) || topicId >= 1000) {
    let wordMode: WordProblemSubMode = 'motion';
    if (topicId === 26 || topicId === 56) wordMode = 'mixture';
    else if (topicId === 27 || topicId === 57) wordMode = 'work';
    return {
      category: 'word-problem',
      wordMode,
      categoryLabelUz: 'Matnli masalalar · Vizual sxema va AI SVG diagramma',
    };
  }

  // Algebra & Inequalities (Topics 8–22, 28–38, 40, 43–46, etc.)
  if (ALGEBRA_INEQUALITY_TOPICS.has(topicId)) {
    let algebraMode: AlgebraSubMode = 'balance';
    if (AREA_MODEL_TOPICS.has(topicId)) algebraMode = 'area';
    else if (INTERVAL_TOPICS.has(topicId)) algebraMode = 'interval';
    return {
      category: 'algebra',
      algebraMode,
      categoryLabelUz:
        algebraMode === 'area'
          ? 'Algebra · Geometrik yuza modeli'
          : algebraMode === 'interval'
            ? 'Tengsizliklar va modul · Sonlar o‘qi oraliqlari'
            : 'Algebra · Tenglamalar tarozi muvozanati',
    };
  }

  // Default: Fractions & Number Line (Topics 3–7)
  return {
    category: 'fractions',
    categoryLabelUz: 'Kasrlar va sonlar o‘qi · Bo‘laklash simulyatori',
  };
}
