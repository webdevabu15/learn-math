import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type { CalculusSubMode } from '../../types/math';

interface CalculusSimulatorProps {
  defaultMode?: CalculusSubMode;
}

type CurveChoice = 'parabola' | 'cubic' | 'sine';

const W = 520;
const H = 310;
const X_MIN = -1;
const X_MAX = 5;
const Y_MIN = -1;
const Y_MAX = 5;

const toX = (x: number) => ((x - X_MIN) / (X_MAX - X_MIN)) * W;
const toY = (y: number) => H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * H;

function evalCurve(kind: CurveChoice, x: number): number {
  if (kind === 'parabola') return 0.35 * (x - 1) * (x - 1) + 0.6;
  if (kind === 'cubic') return 0.18 * (x - 2) * (x - 2) * (x - 2) - 0.55 * (x - 2) + 2.2;
  return 1.6 * Math.sin(x * 0.95) + 2.3;
}

function evalDeriv(kind: CurveChoice, x: number): number {
  if (kind === 'parabola') return 0.7 * (x - 1);
  if (kind === 'cubic') return 0.54 * (x - 2) * (x - 2) - 0.55;
  return 1.6 * 0.95 * Math.cos(x * 0.95);
}

function exactIntegral(kind: CurveChoice, a: number, b: number): number {
  const anti = (x: number) => {
    if (kind === 'parabola') return (0.35 / 3) * Math.pow(x - 1, 3) + 0.6 * x;
    if (kind === 'cubic')
      return (0.18 / 4) * Math.pow(x - 2, 4) - (0.55 / 2) * Math.pow(x - 2, 2) + 2.2 * x;
    return (-1.6 / 0.95) * Math.cos(x * 0.95) + 2.3 * x;
  };
  return anti(b) - anti(a);
}

export const CalculusSimulator: React.FC<CalculusSimulatorProps> = ({
  defaultMode = 'derivative',
}) => {
  const [mode, setMode] = useState<CalculusSubMode>(defaultMode);
  const [curve, setCurve] = useState<CurveChoice>('parabola');

  // Derivative state
  const [pointX, setPointX] = useState<number>(2.5);

  // Integral Riemann state
  const [rectCount, setRectCount] = useState<number>(6);
  const [riemannRule, setRiemannRule] = useState<'left' | 'mid' | 'right'>('mid');
  const intA = 0.5;
  const intB = 4.0;

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const curvePath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 180; i++) {
      const x = X_MIN + (i / 180) * (X_MAX - X_MIN);
      const y = evalCurve(curve, x);
      pts.push(`${i === 0 ? 'M' : 'L'} ${toX(x).toFixed(1)} ${toY(y).toFixed(1)}`);
    }
    return pts.join(' ');
  }, [curve]);

  // Derivative values
  const pyVal = evalCurve(curve, pointX);
  const slope = evalDeriv(curve, pointX);
  const tanX1 = pointX - 1.5;
  const tanY1 = pyVal + slope * (tanX1 - pointX);
  const tanX2 = pointX + 1.5;
  const tanY2 = pyVal + slope * (tanX2 - pointX);

  // Riemann rectangles
  const { rectangles, riemannArea, exactArea } = useMemo(() => {
    const dx = (intB - intA) / rectCount;
    const rects: Array<{ x: number; w: number; h: number }> = [];
    let sum = 0;
    for (let i = 0; i < rectCount; i++) {
      const left = intA + i * dx;
      const sampleX =
        riemannRule === 'left' ? left : riemannRule === 'right' ? left + dx : left + dx / 2;
      const h = evalCurve(curve, sampleX);
      sum += h * dx;
      rects.push({ x: left, w: dx, h });
    }
    return {
      rectangles: rects,
      riemannArea: sum,
      exactArea: exactIntegral(curve, intA, intB),
    };
  }, [curve, rectCount, riemannRule]);

  return (
    <div
      data-testid="calculus-simulator"
      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
    >
      {/* Toolbar */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/80">
        <div
          className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800"
          role="tablist"
          aria-label="Matematik analiz rejimlari"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'derivative'}
            onClick={() => setMode('derivative')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              mode === 'derivative'
                ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Hosila (Urinma qiyaligi)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'integral'}
            onClick={() => setMode('integral')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              mode === 'integral'
                ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Integral (Riman yuzasi)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800">
            {(
              [
                { id: 'parabola', label: 'Parabola' },
                { id: 'cubic', label: 'Kubik' },
                { id: 'sine', label: 'To‘lqin' },
              ] as const
            ).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCurve(c.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                  curve === c.id
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setPointX(2.5);
              setRectCount(6);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* SVG Stage */}
        <div className="lg:col-span-7 p-5 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800"
            role="img"
            aria-label={
              mode === 'derivative'
                ? 'Egri chiziq va harakatlanuvchi urinma chizig‘i'
                : 'Egri chiziq ostidagi Riman to‘rtburchaklari'
            }
          >
            {/* Grid */}
            {[0, 1, 2, 3, 4].map((x) => (
              <line
                key={`cx-${x}`}
                x1={toX(x)}
                y1={0}
                x2={toX(x)}
                y2={H}
                className={x === 0 ? 'stroke-slate-500' : 'stroke-slate-200 dark:stroke-slate-800'}
                strokeWidth={x === 0 ? 1.8 : 1}
              />
            ))}
            {[0, 1, 2, 3, 4].map((y) => (
              <line
                key={`cy-${y}`}
                x1={0}
                y1={toY(y)}
                x2={W}
                y2={toY(y)}
                className={y === 0 ? 'stroke-slate-500' : 'stroke-slate-200 dark:stroke-slate-800'}
                strokeWidth={y === 0 ? 1.8 : 1}
              />
            ))}

            {/* Riemann Rectangles (Integral mode) */}
            {mode === 'integral' &&
              rectangles.map((r, idx) => {
                const topY = toY(Math.max(0, r.h));
                const baseY = toY(0);
                const rectH = Math.abs(baseY - topY);
                return (
                  <rect
                    key={idx}
                    x={toX(r.x)}
                    y={Math.min(topY, baseY)}
                    width={Math.max(1, toX(r.x + r.w) - toX(r.x))}
                    height={rectH}
                    className="fill-emerald-500/30 dark:fill-emerald-400/25 stroke-emerald-600/80 dark:stroke-emerald-400/80"
                    strokeWidth="1.2"
                  />
                );
              })}

            {/* Function Curve */}
            <path
              d={curvePath}
              fill="none"
              className="stroke-indigo-600 dark:stroke-indigo-400"
              strokeWidth="3"
            />

            {/* Tangent Line + Slope Triangle (Derivative mode) */}
            {mode === 'derivative' && (
              <g>
                {/* Rise/Run triangle */}
                <line
                  x1={toX(pointX)}
                  y1={toY(pyVal)}
                  x2={toX(pointX + 1)}
                  y2={toY(pyVal)}
                  className="stroke-emerald-600 dark:stroke-emerald-400"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <line
                  x1={toX(pointX + 1)}
                  y1={toY(pyVal)}
                  x2={toX(pointX + 1)}
                  y2={toY(pyVal + slope)}
                  className="stroke-amber-600 dark:stroke-amber-400"
                  strokeWidth="2"
                />
                {/* Tangent line */}
                <line
                  x1={toX(tanX1)}
                  y1={toY(tanY1)}
                  x2={toX(tanX2)}
                  y2={toY(tanY2)}
                  className="stroke-rose-600 dark:stroke-rose-400"
                  strokeWidth="2.5"
                />
                {/* Movable Point */}
                <circle
                  cx={toX(pointX)}
                  cy={toY(pyVal)}
                  r="7"
                  className="fill-rose-600 dark:fill-rose-400 stroke-white dark:stroke-slate-950"
                  strokeWidth="2.5"
                />
              </g>
            )}
          </svg>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 p-6 space-y-5 bg-slate-50/40 dark:bg-slate-950/30">
          {mode === 'derivative' ? (
            <>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <label htmlFor="calc-x" className="font-medium text-slate-700 dark:text-slate-300">
                    Nuqta koordinatasi (x)
                  </label>
                  <span className="font-mono font-bold tabular-nums text-indigo-700 dark:text-indigo-300">
                    x = {pointX.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <input
                  id="calc-x"
                  type="range"
                  min={0}
                  max={4}
                  step={0.1}
                  value={pointX}
                  onChange={(e) => setPointX(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-500">Balandlik f(x)</p>
                  <p className="mt-1 text-lg font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                    {pyVal.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                    Urinma qiyaligi f′(x)
                  </p>
                  <p className="mt-1 text-lg font-mono font-bold tabular-nums text-rose-700 dark:text-rose-300">
                    {slope.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                {Math.abs(slope) < 0.08
                  ? 'Urinma deyarli gorizontal (qiyalik ≈ 0)! Bu yerda funksiya ekstremum (maksimum yoki minimum) nuqtasidan o‘tmoqda.'
                  : slope > 0
                    ? 'Qiyalik musbat — egri chiziq bu nuqtada yuqoriga o‘smoqda. Qiyalik qancha katta bo‘lsa, o‘sish shuncha tik.'
                    : 'Qiyalik manfiy — egri chiziq bu nuqtada pastga kamaymoqda.'}
              </p>
            </>
          ) : (
            <>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <label htmlFor="calc-n" className="font-medium text-slate-700 dark:text-slate-300">
                    To‘rtburchaklar soni (N)
                  </label>
                  <span className="font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                    {rectCount} ta
                  </span>
                </div>
                <input
                  id="calc-n"
                  type="range"
                  min={2}
                  max={48}
                  value={rectCount}
                  onChange={(e) => setRectCount(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-1.5">
                {(
                  [
                    { id: 'left', label: 'Chap' },
                    { id: 'mid', label: 'O‘rta' },
                    { id: 'right', label: 'O‘ng' },
                  ] as const
                ).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRiemannRule(r.id)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${
                      riemannRule === r.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Riman yig‘indisi
                  </p>
                  <p className="mt-1 text-lg font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                    {riemannArea.toFixed(3).replace('.', ',')}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    Aniq yuza (Integral)
                  </p>
                  <p className="mt-1 text-lg font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                    {exactArea.toFixed(3).replace('.', ',')}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                To‘rtburchaklar sonini ({rectCount} ta) oshirganingiz sari bo‘shliqlar yo‘qolib, ularning yig‘indisi egri chiziq ostidagi aniq yuzaga yaqinlashadi!
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
