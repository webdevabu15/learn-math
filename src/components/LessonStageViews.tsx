import React, { useEffect, useState } from 'react';
import {
  Compass,
  ShieldAlert,
  Sparkles,
  BookOpenCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wand2,
  SlidersHorizontal,
} from 'lucide-react';
import type { TopicLesson, TopicMeta } from '../types/math';
import { MathBlock, MathText } from './MathText';
import { FractionSimulator } from './FractionSimulator';
import { AlgebraSimulator } from './simulators/AlgebraSimulator';
import { GraphSimulator } from './simulators/GraphSimulator';
import { TrigSimulator } from './simulators/TrigSimulator';
import { CalculusSimulator } from './simulators/CalculusSimulator';
import { WordProblemDiagramSimulator } from './simulators/WordProblemDiagramSimulator';
import { resolveSimulatorForTopic } from '../utils/simulatorRouting';

interface StageProps {
  lesson: TopicLesson;
}

interface IntuisiyaStageProps extends StageProps {
  topic?: TopicMeta;
}

export const MuammoView: React.FC<StageProps> = ({ lesson }) => {
  const { muammo } = lesson;

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
          {muammo.contextLabel}
        </p>
        <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
          <MathText text={muammo.headline} />
        </h2>
      </div>

      {/* Narrative paragraphs */}
      <div className="space-y-4 max-w-[72ch] text-[15.5px] leading-[1.7] text-slate-700 dark:text-slate-300">
        {muammo.story.map((paragraph, idx) => (
          <p key={idx}>
            <MathText text={paragraph} />
          </p>
        ))}
      </div>

      {/* Core First-Principles Question */}
      <div className="p-6 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-2">
        <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
          <Compass className="w-4 h-4" aria-hidden="true" />
          Asosiy savol
        </p>
        <p className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
          <MathText text={muammo.coreQuestion} />
        </p>
      </div>

      {/* Historical Context */}
      <div className="pt-5 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
          Tarixiy izoh
        </p>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-[72ch]">
          <MathText text={muammo.historicalNote} />
        </p>
      </div>
    </div>
  );
};

export const ChegaraView: React.FC<StageProps> = ({ lesson }) => {
  const { chegara } = lesson;

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
          Oldingi bilim chegarasi · Nega eski vosita yetarli emas?
        </p>
        <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
          <MathText text={chegara.headline} />
        </h2>
      </div>

      {/* 2-Column Comparison: What Worked vs Breaking Point */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        <section className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            Oldin nima ishlagan edi?
          </p>
          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
            <MathText text={chegara.whatWorkedBefore} />
          </p>
        </section>

        <section className="p-6 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-2.5">
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" aria-hidden="true" />
            Qayerda ishlamay qoldi?
          </p>
          <p className="text-[15px] leading-relaxed text-slate-800 dark:text-slate-200">
            <MathText text={chegara.breakingPoint} />
          </p>
        </section>
      </div>

      {/* Concrete Dead End */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Boshi berk ko‘cha misoli
        </p>
        <p className="text-[15px] leading-relaxed text-slate-800 dark:text-slate-200">
          <MathText text={chegara.deadEndExample} />
        </p>
      </div>

      {/* Bridge to Intuition */}
      <div className="pt-5 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1.5">
          Yangi g‘oyaga ehtiyoj
        </p>
        <p className="text-[15.5px] leading-relaxed text-slate-800 dark:text-slate-200 max-w-[72ch]">
          <MathText text={chegara.whyNewIdeaNeeded} />
        </p>
      </div>
    </div>
  );
};

export const IntuisiyaView: React.FC<IntuisiyaStageProps> = ({ lesson, topic }) => {
  const { intuisiya } = lesson;
  const route = resolveSimulatorForTopic(lesson.topicId);
  const [showDiagramFallback, setShowDiagramFallback] = useState(false);

  useEffect(() => {
    setShowDiagramFallback(false);
  }, [lesson.topicId]);

  const topicTitle = topic?.title ?? `${lesson.topicId}-mavzu`;

  const renderSimulator = () => {
    if (showDiagramFallback || route.category === 'word-problem') {
      return (
        <WordProblemDiagramSimulator
          defaultMode={route.wordMode ?? 'motion'}
          topicTitle={topicTitle}
        />
      );
    }

    switch (route.category) {
      case 'algebra':
        return (
          <AlgebraSimulator
            defaultMode={route.algebraMode ?? 'balance'}
            topicId={lesson.topicId}
          />
        );
      case 'functions':
        return <GraphSimulator defaultMode={route.functionMode ?? 'linear'} />;
      case 'trigonometry':
        return <TrigSimulator />;
      case 'calculus':
        return <CalculusSimulator defaultMode={route.calculusMode ?? 'derivative'} />;
      case 'fractions':
      default:
        return <FractionSimulator lesson={lesson} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            {showDiagramFallback
              ? 'Matnli masalalar · Vizual sxema va AI SVG diagramma'
              : route.categoryLabelUz}
          </p>
          <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            <MathText text={intuisiya.headline} />
          </h2>
        </div>

        {route.category !== 'word-problem' && (
          <button
            type="button"
            onClick={() => setShowDiagramFallback((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {showDiagramFallback ? (
              <>
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                Asosiy simulyatorga qaytish
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                AI SVG diagramma chizish
              </>
            )}
          </button>
        )}
      </div>

      {/* Category-Specific Interactive Simulator */}
      {renderSimulator()}

      {/* Real-life Analogy + Guided Exploration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        <section className="lg:col-span-6 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Hayotiy o‘xshatish · {intuisiya.analogyTitle}
          </p>
          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
            <MathText text={intuisiya.analogyStory} />
          </p>
        </section>

        <section className="lg:col-span-6 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Simulyatorda sinab ko‘ring
          </p>
          <ul className="space-y-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {intuisiya.guidedPrompts.map((prompt, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0 tabular-nums">
                  {idx + 1}.
                </span>
                <span>
                  <MathText text={prompt} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export const FormulaView: React.FC<StageProps> = ({ lesson }) => {
  const { formula } = lesson;

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
          <BookOpenCheck className="w-4 h-4" aria-hidden="true" />
          Intuisiyadan keyingi bosqich · Aniq matematik til
        </p>
        <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
          <MathText text={formula.headline} />
        </h2>
        <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300 max-w-[72ch]">
          <MathText text={formula.bridgeFromIntuition} />
        </p>
      </div>

      {/* Formula Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        {formula.items.map((item, idx) => (
          <article
            key={idx}
            className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {idx + 1}. {item.title}
              </h3>

              <div className="py-3 px-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                <MathBlock latex={item.latex} />
              </div>

              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <MathText text={item.explanation} />
              </p>
            </div>

            {item.example && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300 mr-1.5">
                  Namuna:
                </span>
                <MathText text={item.example} />
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Common Pitfall Comparison */}
      <section className="p-6 rounded-xl border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-4">
        <p className="text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>
            <MathText text={formula.keyPitfall.title} />
          </span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-rose-200/70 dark:border-rose-900/50 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400">
              <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
              Noto‘g‘ri
            </span>
            <div className="text-sm text-slate-900 dark:text-slate-100">
              <MathText text={formula.keyPitfall.wrong} />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200/70 dark:border-emerald-900/50 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              To‘g‘ri
            </span>
            <div className="text-sm text-slate-900 dark:text-slate-100">
              <MathText text={formula.keyPitfall.right} />
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <MathText text={formula.keyPitfall.reason} />
        </p>
      </section>
    </div>
  );
};
