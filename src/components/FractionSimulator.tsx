import React, { useEffect, useState } from 'react';
import { RotateCcw, PieChart, Columns3, ArrowLeftRight } from 'lucide-react';
import type { TopicLesson } from '../types/math';

interface FractionSimulatorProps {
  lesson: TopicLesson;
}

type SimMode = 'single' | 'compare' | 'combine' | 'numberline';
type VisualShape = 'bar' | 'circle';

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Generates an SVG sector path for a circle slice (pure visual, zero formulas).
 */
function describeCircleSlice(
  cx: number,
  cy: number,
  r: number,
  index: number,
  total: number
): string {
  if (total === 1) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
  }
  const startAngle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const endAngle = ((index + 1) / total) * Math.PI * 2 - Math.PI / 2;
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

/**
 * Interactive visual intuition lab (STRICTLY NO FORMULAS OR ALGEBRAIC NOTATION).
 * Supports Fraction Bar, Circle Slicer, Comparison, Visual Combining, and Signed Number Line.
 */
export const FractionSimulator: React.FC<FractionSimulatorProps> = ({ lesson }) => {
  const preset = lesson.intuisiya.defaultPreset;
  const [mode, setMode] = useState<SimMode>(lesson.intuisiya.defaultSimulatorMode);
  const [shape, setShape] = useState<VisualShape>('bar');

  // Fraction A state
  const [denA, setDenA] = useState<number>(Math.max(2, Math.min(12, preset.denA || 4)));
  const [numA, setNumA] = useState<number>(
    preset.denA > 1 ? Math.max(0, Math.min(preset.denA, preset.numA)) : 3
  );

  // Fraction B state (for compare / combine)
  const [denB, setDenB] = useState<number>(Math.max(2, Math.min(12, preset.denB || 3)));
  const [numB, setNumB] = useState<number>(
    preset.denB > 1 ? Math.max(0, Math.min(preset.denB, preset.numB)) : 1
  );

  // Signed number line state (for Topic 7 / numberline mode)
  const [startStep, setStartStep] = useState<number>(preset.denA === 1 ? preset.numA : -3);
  const [moveStep, setMoveStep] = useState<number>(preset.denB === 1 ? preset.numB : 5);

  useEffect(() => {
    setMode(lesson.intuisiya.defaultSimulatorMode);
    if (lesson.intuisiya.defaultPreset.denA > 1) {
      setDenA(Math.max(2, Math.min(12, lesson.intuisiya.defaultPreset.denA)));
      setNumA(Math.max(0, Math.min(lesson.intuisiya.defaultPreset.denA, lesson.intuisiya.defaultPreset.numA)));
      setDenB(Math.max(2, Math.min(12, lesson.intuisiya.defaultPreset.denB || 3)));
      setNumB(
        Math.max(0, Math.min(lesson.intuisiya.defaultPreset.denB || 3, lesson.intuisiya.defaultPreset.numB || 1))
      );
    } else {
      setStartStep(lesson.intuisiya.defaultPreset.numA);
      setMoveStep(lesson.intuisiya.defaultPreset.numB);
    }
  }, [lesson.topicId, lesson.intuisiya]);

  const valA = numA / denA;
  const valB = numB / denB;
  const combinedVal = valA + valB;
  const commonGrid = lcm(denA, denB);
  const scaledA = numA * (commonGrid / denA);
  const scaledB = numB * (commonGrid / denB);
  const combinedPieces = scaledA + scaledB;

  const handleReset = () => {
    setMode(lesson.intuisiya.defaultSimulatorMode);
    setShape('bar');
    if (preset.denA > 1) {
      setDenA(Math.max(2, Math.min(12, preset.denA)));
      setNumA(Math.max(0, Math.min(preset.denA, preset.numA)));
      setDenB(Math.max(2, Math.min(12, preset.denB || 3)));
      setNumB(Math.max(0, Math.min(preset.denB || 3, preset.numB || 1)));
    } else {
      setStartStep(preset.numA);
      setMoveStep(preset.numB);
    }
  };

  // Plain-language Uzbek intuition description (NO formulas!)
  const getIntuitionSentence = (): string => {
    if (mode === 'numberline') {
      const target = startStep + moveStep;
      const dirWord =
        moveStep > 0
          ? `o'ng tomonga ${moveStep} qadam yurdingiz`
          : moveStep < 0
            ? `chap tomonga ${Math.abs(moveStep)} qadam qaytdingiz`
            : "joyingizda turdingiz";
      const posWord =
        target > 0
          ? `noldan ${target} birlik yuqorida (o'ngda)`
          : target < 0
            ? `noldan ${Math.abs(target)} birlik pastda (chapda)`
            : 'aynan nol nuqtasida';
      return `Boshlang'ich nuqtadan (${startStep}) ${dirWord} va natijada ${posWord} to'xtadingiz.`;
    }

    if (mode === 'single') {
      if (numA === 0) {
        return `Bitta butun ${denA} ta teng bo'lakka kesilgan, lekin hozircha birorta ham bo'lak tanlanmagan.`;
      }
      if (numA === denA) {
        return `Barcha ${denA} ta teng bo'lak olindi — bu yana bitta to'liq butun narsani beradi!`;
      }
      if (numA * 2 === denA) {
        return `${denA} ta teng bo'lakdan ${numA} tasi olindi — ko'rib turganingizdek, bu aynan yarim butunga teng.`;
      }
      const relation =
        valA < 0.5 ? 'yarimdan kichikroq qism' : 'yarimdan kattaroq qism';
      return `Bitta butunni ${denA} ta teng bo'lakka kesib, ulardan ${numA} tasini oldingiz — bu ${relation}.`;
    }

    if (mode === 'compare') {
      const diff = valA - valB;
      if (Math.abs(diff) < 1e-9) {
        return `Ajoyib kashfiyot! Birinchi ulush (${denA} bo'lakdan ${numA} tasi) va ikkinchi ulush (${denB} bo'lakdan ${numB} tasi) har xil kesilgan bo'lsa ham, sonlar o'qida AYNAN BITTA NUQTAGA tushdi — ular teng!`;
      }
      if (diff > 0) {
        return `Birinchi ulush (${denA} bo'lakdan ${numA} tasi) ikkinchi ulushdan (${denB} bo'lakdan ${numB} tasi) kattaroq — sonlar o'qida u o'ngroqda joylashgan.`;
      }
      return `Ikkinchi ulush (${denB} bo'lakdan ${numB} tasi) birinchi ulushdan (${denA} bo'lakdan ${numA} tasi) kattaroq — sonlar o'qida u o'ngroqda turibdi.`;
    }

    // combine mode
    const overOne =
      combinedVal > 1
        ? "Jami ulush bitta butundan oshib ketdi va ikkinchi butunning bir qismini ham egalladi!"
        : combinedVal === 1
          ? "Ikkala ulush birlashib, mukammal bitta to'liq butunni hosil qildi!"
          : "Ikkala ulush birlashganda ham bitta butun ichida qoldi.";
    return `Birinchi va ikkinchi ulushlarni bir xil ${commonGrid} ta mayda bo'lakli panjaraga tushirsak, jami ${combinedPieces} ta mayda bo'lak yig'iladi. ${overOne}`;
  };

  const renderInteractiveShape = (
    count: number,
    total: number,
    onChangeCount: (next: number) => void,
    colorClass: { fill: string; empty: string; stroke: string; label: string },
    title: string
  ) => {
    const handleSliceClick = (sliceIdx: number) => {
      // Clicking the last filled slice unselects it; clicking any other sets count to sliceIdx + 1
      if (sliceIdx + 1 === count) {
        onChangeCount(sliceIdx);
      } else {
        onChangeCount(sliceIdx + 1);
      }
    };

    return (
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-200">{title}</span>
          <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
            {total} teng bo‘lakdan {count} tasi
          </span>
        </div>

        {shape === 'bar' ? (
          <div
            className="w-full h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex bg-slate-100 dark:bg-slate-800/60"
            role="group"
            aria-label={`${title}: bo'laklarni bosib tanlang`}
          >
            {Array.from({ length: total }).map((_, idx) => {
              const filled = idx < count;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSliceClick(idx)}
                  aria-label={`${title} ${idx + 1}-bo'lak (${filled ? 'tanlangan' : 'bo‘sh'})`}
                  className={`flex-1 h-full border-r last:border-r-0 border-white/80 dark:border-slate-900/90 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 ${
                    filled
                      ? colorClass.fill
                      : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80'
                  }`}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <svg
              viewBox="0 0 180 180"
              className="w-40 h-40 select-none"
              role="img"
              aria-label={`${title} doira ko'rinishi`}
            >
              {Array.from({ length: total }).map((_, idx) => {
                const filled = idx < count;
                return (
                  <path
                    key={idx}
                    d={describeCircleSlice(90, 90, 78, idx, total)}
                    onClick={() => handleSliceClick(idx)}
                    className={`cursor-pointer transition-colors ${
                      filled ? colorClass.fill : colorClass.empty
                    } ${colorClass.stroke}`}
                    strokeWidth="2"
                  />
                );
              })}
              <circle
                cx="90"
                cy="90"
                r="78"
                fill="none"
                className="stroke-slate-300 dark:stroke-slate-600 pointer-events-none"
                strokeWidth="2"
              />
            </svg>
          </div>
        )}
      </div>
    );
  };

  // Number Line max value (1 for single/compare, 2 for combine)
  const lineMax = mode === 'combine' ? 2 : 1;

  return (
    <div
      data-testid="virtual-intuition-simulator"
      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
    >
      {/* Simulator Toolbar */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/80">
        <div
          className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800"
          role="tablist"
          aria-label="Simulyator rejimlari"
        >
          {(
            [
              { id: 'single', label: "Bo'laklash" },
              { id: 'compare', label: 'Taqqoslash' },
              { id: 'combine', label: 'Birlashtirish' },
              { id: 'numberline', label: "Sonlar o'qi" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={mode === tab.id}
              onClick={() => setMode(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === tab.id
                  ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {mode !== 'numberline' && (
            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setShape('bar')}
                aria-label="To'rtburchak lenta ko'rinishi"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  shape === 'bar'
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Columns3 className="w-3.5 h-3.5" aria-hidden="true" />
                Lenta
              </button>
              <button
                type="button"
                onClick={() => setShape('circle')}
                aria-label="Doira ko'rinishi"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  shape === 'circle'
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <PieChart className="w-3.5 h-3.5" aria-hidden="true" />
                Doira
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            aria-label="Simulyatorni boshlang'ich holatga qaytarish"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Qaytarish
          </button>
        </div>
      </div>

      {/* Two-Zone Sandbox Layout: Interactive Stage (Left) + Control Deck (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Interactive Visual Stage */}
        <div className="lg:col-span-7 p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
          {mode === 'numberline' ? (
            <div className="space-y-6 py-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Yo‘nalishli sonlar o‘qi (chapga — manfiy, o‘ngga — musbat)
                </span>
                <span className="font-mono tabular-nums">
                  Natija nuqtasi: {startStep + moveStep > 0 ? `+${startStep + moveStep}` : startStep + moveStep}
                </span>
              </div>

              {/* Signed Number Line SVG (-10 to +10) */}
              <div className="w-full overflow-x-auto">
                <svg
                  viewBox="0 0 600 150"
                  className="w-full min-w-[420px] h-auto"
                  role="img"
                  aria-label="Musbat va manfiy sonlar o'qi simulyatori"
                >
                  {/* Base axis */}
                  <line
                    x1="30"
                    y1="95"
                    x2="570"
                    y2="95"
                    className="stroke-slate-400 dark:stroke-slate-500"
                    strokeWidth="2.5"
                  />
                  {/* Ticks from -10 to +10 */}
                  {Array.from({ length: 21 }).map((_, idx) => {
                    const n = idx - 10;
                    const x = 30 + (idx / 20) * 540;
                    const isZero = n === 0;
                    return (
                      <g key={n}>
                        <line
                          x1={x}
                          y1={isZero ? 82 : 89}
                          x2={x}
                          y2={isZero ? 108 : 101}
                          className={
                            isZero
                              ? 'stroke-slate-900 dark:stroke-slate-100'
                              : 'stroke-slate-400 dark:stroke-slate-600'
                          }
                          strokeWidth={isZero ? 2.5 : 1.5}
                        />
                        {(n % 2 === 0 || n === 0) && (
                          <text
                            x={x}
                            y="126"
                            textAnchor="middle"
                            className={`text-[11px] font-mono ${
                              isZero
                                ? 'fill-slate-900 dark:fill-slate-100 font-bold'
                                : 'fill-slate-500 dark:fill-slate-400'
                            }`}
                          >
                            {n > 0 ? `+${n}` : n}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Arc from startStep to target */}
                  {(() => {
                    const clampedStart = Math.max(-10, Math.min(10, startStep));
                    const clampedEnd = Math.max(-10, Math.min(10, startStep + moveStep));
                    const xStart = 30 + ((clampedStart + 10) / 20) * 540;
                    const xEnd = 30 + ((clampedEnd + 10) / 20) * 540;
                    const midX = (xStart + xEnd) / 2;
                    const arcHeight = Math.min(62, Math.max(24, Math.abs(xEnd - xStart) * 0.25));
                    return (
                      <g>
                        {moveStep !== 0 && (
                          <path
                            d={`M ${xStart} 86 Q ${midX} ${86 - arcHeight} ${xEnd} 86`}
                            fill="none"
                            className={
                              moveStep > 0
                                ? 'stroke-emerald-500 dark:stroke-emerald-400'
                                : 'stroke-amber-500 dark:stroke-amber-400'
                            }
                            strokeWidth="2.5"
                            strokeDasharray="5 4"
                          />
                        )}
                        {/* Start marker */}
                        <circle
                          cx={xStart}
                          cy="95"
                          r="7"
                          className="fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900"
                          strokeWidth="2"
                        />
                        <text
                          x={xStart}
                          y="72"
                          textAnchor="middle"
                          className="text-[11px] font-semibold fill-indigo-700 dark:fill-indigo-300"
                        >
                          Boshlanish ({clampedStart})
                        </text>
                        {/* Result marker */}
                        <circle
                          cx={xEnd}
                          cy="95"
                          r="8.5"
                          className="fill-emerald-600 dark:fill-emerald-400 stroke-white dark:stroke-slate-900"
                          strokeWidth="2.5"
                        />
                        <text
                          x={xEnd}
                          y="32"
                          textAnchor="middle"
                          className="text-[12px] font-bold fill-emerald-700 dark:fill-emerald-300"
                        >
                          Manzil: {clampedEnd > 0 ? `+${clampedEnd}` : clampedEnd}
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>
            </div>
          ) : (
            <>
              {/* Visual A (and B if compare/combine) */}
              <div
                className={
                  mode === 'single'
                    ? 'space-y-4'
                    : shape === 'circle'
                      ? 'grid grid-cols-1 sm:grid-cols-2 gap-6'
                      : 'space-y-5'
                }
              >
                {renderInteractiveShape(
                  numA,
                  denA,
                  setNumA,
                  {
                    fill: 'bg-indigo-600 dark:bg-indigo-500 fill-indigo-600 dark:fill-indigo-500',
                    empty: 'fill-slate-100 dark:fill-slate-800 hover:fill-slate-200 dark:hover:fill-slate-700',
                    stroke: 'stroke-white dark:stroke-slate-900',
                    label: 'Birinchi ulush',
                  },
                  mode === 'single' ? "Butunni bo'laklash (bo'lak ustiga bosing)" : 'Birinchi ulush'
                )}

                {(mode === 'compare' || mode === 'combine') &&
                  renderInteractiveShape(
                    numB,
                    denB,
                    setNumB,
                    {
                      fill: 'bg-emerald-600 dark:bg-emerald-500 fill-emerald-600 dark:fill-emerald-500',
                      empty: 'fill-slate-100 dark:fill-slate-800 hover:fill-slate-200 dark:hover:fill-slate-700',
                      stroke: 'stroke-white dark:stroke-slate-900',
                      label: 'Ikkinchi ulush',
                    },
                    'Ikkinchi ulush'
                  )}
              </div>

              {/* Combined Common Grid Bar (only in combine mode) */}
              {mode === 'combine' && (
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      Umumiy mayda panjarada birlashgan natija
                    </span>
                    <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      1 butun = {commonGrid} mayda katak · Jami {combinedPieces} katak
                    </span>
                  </div>
                  <div className="w-full h-11 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex bg-slate-100 dark:bg-slate-800/60">
                    {Array.from({ length: commonGrid * 2 }).map((_, idx) => {
                      const isA = idx < scaledA;
                      const isB = idx >= scaledA && idx < scaledA + scaledB;
                      const isWholeBoundary = idx === commonGrid - 1;
                      return (
                        <div
                          key={idx}
                          className={`flex-1 h-full border-r last:border-r-0 transition-colors ${
                            isWholeBoundary
                              ? 'border-r-2 border-slate-900 dark:border-slate-100'
                              : 'border-white/50 dark:border-slate-900/70'
                          } ${
                            isA
                              ? 'bg-indigo-600 dark:bg-indigo-500'
                              : isB
                                ? 'bg-emerald-600 dark:bg-emerald-500'
                                : 'bg-transparent'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 px-0.5">
                    <span>0</span>
                    <span>1 butun</span>
                    <span>2 butun</span>
                  </div>
                </div>
              )}

              {/* Synchronized Number Line (0 to 1 or 0 to 2) */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                    Sonlar o‘qidagi aniq o‘rni
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {lineMax === 1 ? '0 dan 1 butungacha' : '0 dan 2 butungacha'}
                  </span>
                </div>

                <svg
                  viewBox="0 0 560 96"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Kasrlarning sonlar o'qidagi joylashuvi"
                >
                  {/* Main line */}
                  <line
                    x1="28"
                    y1="52"
                    x2="532"
                    y2="52"
                    className="stroke-slate-300 dark:stroke-slate-600"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Subdivision ticks for denA */}
                  {Array.from({ length: denA * lineMax + 1 }).map((_, idx) => {
                    const ratio = idx / (denA * lineMax);
                    const x = 28 + ratio * 504;
                    const isWhole = idx % denA === 0;
                    return (
                      <g key={idx}>
                        <line
                          x1={x}
                          y1={isWhole ? 40 : 46}
                          x2={x}
                          y2={isWhole ? 64 : 58}
                          className={
                            isWhole
                              ? 'stroke-slate-800 dark:stroke-slate-200'
                              : 'stroke-slate-400 dark:stroke-slate-600'
                          }
                          strokeWidth={isWhole ? 2.5 : 1.25}
                        />
                        {isWhole && (
                          <text
                            x={x}
                            y="82"
                            textAnchor="middle"
                            className="text-[12px] font-mono font-semibold fill-slate-700 dark:fill-slate-300"
                          >
                            {idx / denA}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Active filled segment for A */}
                  <line
                    x1="28"
                    y1="52"
                    x2={28 + Math.min(1, valA / lineMax) * 504}
                    y2="52"
                    className="stroke-indigo-600 dark:stroke-indigo-400"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  {/* Active segment for combined B in combine mode */}
                  {mode === 'combine' && (
                    <line
                      x1={28 + Math.min(1, valA / lineMax) * 504}
                      y1="52"
                      x2={28 + Math.min(1, combinedVal / lineMax) * 504}
                      y2="52"
                      className="stroke-emerald-600 dark:stroke-emerald-400"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Point Marker A */}
                  <g>
                    <circle
                      cx={28 + Math.min(1, valA / lineMax) * 504}
                      cy="52"
                      r="7"
                      className="fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900"
                      strokeWidth="2.5"
                    />
                    <text
                      x={28 + Math.min(1, valA / lineMax) * 504}
                      y="28"
                      textAnchor="middle"
                      className="text-[11px] font-semibold fill-indigo-700 dark:fill-indigo-300"
                    >
                      {mode === 'single' ? 'Tanlangan nuqta' : '1-ulush'}
                    </text>
                  </g>

                  {/* Point Marker B (compare mode) */}
                  {mode === 'compare' && (
                    <g>
                      <circle
                        cx={28 + Math.min(1, valB / lineMax) * 504}
                        cy="52"
                        r="7"
                        className="fill-emerald-600 dark:fill-emerald-400 stroke-white dark:stroke-slate-900"
                        strokeWidth="2.5"
                      />
                      <text
                        x={28 + Math.min(1, valB / lineMax) * 504}
                        y="86"
                        textAnchor="middle"
                        className="text-[11px] font-semibold fill-emerald-700 dark:fill-emerald-300"
                      >
                        2-ulush
                      </text>
                    </g>
                  )}

                  {/* Combined Total Marker */}
                  {mode === 'combine' && (
                    <g>
                      <circle
                        cx={28 + Math.min(1, combinedVal / lineMax) * 504}
                        cy="52"
                        r="8"
                        className="fill-emerald-600 dark:fill-emerald-400 stroke-white dark:stroke-slate-900"
                        strokeWidth="2.5"
                      />
                      <text
                        x={28 + Math.min(1, combinedVal / lineMax) * 504}
                        y="28"
                        textAnchor="middle"
                        className="text-[11px] font-bold fill-emerald-700 dark:fill-emerald-300"
                      >
                        Jami
                      </text>
                    </g>
                  )}
                </svg>
              </div>
            </>
          )}
        </div>

        {/* Control & Concept Deck (Right) */}
        <div className="lg:col-span-5 p-6 space-y-5 bg-slate-50/40 dark:bg-slate-950/30">
          {mode === 'numberline' ? (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <label htmlFor="sim-start-step" className="font-medium text-slate-700 dark:text-slate-200">
                    Boshlang‘ich nuqta
                  </label>
                  <span className="font-mono font-semibold tabular-nums text-indigo-700 dark:text-indigo-300">
                    {startStep > 0 ? `+${startStep}` : startStep}
                  </span>
                </div>
                <input
                  id="sim-start-step"
                  type="range"
                  min={-6}
                  max={6}
                  value={startStep}
                  onChange={(e) => setStartStep(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                  <span>-6</span>
                  <span>0</span>
                  <span>+6</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <label htmlFor="sim-move-step" className="font-medium text-slate-700 dark:text-slate-200">
                    Siljish qadami (chapga / o‘ngga)
                  </label>
                  <span className="font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                    {moveStep > 0 ? `+${moveStep}` : moveStep}
                  </span>
                </div>
                <input
                  id="sim-move-step"
                  type="range"
                  min={-6}
                  max={6}
                  value={moveStep}
                  onChange={(e) => setMoveStep(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                  <span>-6 (chapga)</span>
                  <span>0</span>
                  <span>+6 (o‘ngga)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Controls for Fraction A */}
              <div className="space-y-3.5">
                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  {mode === 'single' ? 'Butunni kesish sozlamalari' : 'Birinchi ulush sozlamalari'}
                </p>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <label htmlFor="sim-den-a" className="text-slate-700 dark:text-slate-300">
                      Nechta teng bo‘lakka bo‘lingan
                    </label>
                    <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                      {denA} ta
                    </span>
                  </div>
                  <input
                    id="sim-den-a"
                    type="range"
                    min={2}
                    max={12}
                    value={denA}
                    onChange={(e) => {
                      const nextDen = Number(e.target.value);
                      setDenA(nextDen);
                      if (numA > nextDen) setNumA(nextDen);
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <label htmlFor="sim-num-a" className="text-slate-700 dark:text-slate-300">
                      Olingan bo‘laklar soni
                    </label>
                    <span className="font-mono font-semibold tabular-nums text-indigo-700 dark:text-indigo-300">
                      {numA} ta
                    </span>
                  </div>
                  <input
                    id="sim-num-a"
                    type="range"
                    min={0}
                    max={denA}
                    value={numA}
                    onChange={(e) => setNumA(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Controls for Fraction B */}
              {(mode === 'compare' || mode === 'combine') && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3.5">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Ikkinchi ulush sozlamalari
                  </p>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <label htmlFor="sim-den-b" className="text-slate-700 dark:text-slate-300">
                        Nechta teng bo‘lakka bo‘lingan
                      </label>
                      <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                        {denB} ta
                      </span>
                    </div>
                    <input
                      id="sim-den-b"
                      type="range"
                      min={2}
                      max={12}
                      value={denB}
                      onChange={(e) => {
                        const nextDen = Number(e.target.value);
                        setDenB(nextDen);
                        if (numB > nextDen) setNumB(nextDen);
                      }}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <label htmlFor="sim-num-b" className="text-slate-700 dark:text-slate-300">
                        Olingan bo‘laklar soni
                      </label>
                      <span className="font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                        {numB} ta
                      </span>
                    </div>
                    <input
                      id="sim-num-b"
                      type="range"
                      min={0}
                      max={denB}
                      value={numB}
                      onChange={(e) => setNumB(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Live Dynamic Intuition Readout (NO formulas!) */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Jonli kuzatuv (hali formulalarsiz)
            </p>
            <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              {getIntuitionSentence()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
