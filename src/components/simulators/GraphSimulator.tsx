import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type { FunctionSubMode } from '../../types/math';

interface GraphSimulatorProps {
  defaultMode?: FunctionSubMode;
}

const WIDTH = 520;
const HEIGHT = 340;
const X_MIN = -8;
const X_MAX = 8;
const Y_MIN = -6;
const Y_MAX = 6;

function toSvgX(x: number): number {
  return ((x - X_MIN) / (X_MAX - X_MIN)) * WIDTH;
}

function toSvgY(y: number): number {
  return HEIGHT - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * HEIGHT;
}

function fmt(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return Object.is(rounded, -0) ? '0' : String(rounded).replace('.', ',');
}

export const GraphSimulator: React.FC<GraphSimulatorProps> = ({
  defaultMode = 'linear',
}) => {
  const [mode, setMode] = useState<FunctionSubMode>(defaultMode);

  // Linear y = kx + b
  const [k, setK] = useState(1.5);
  const [linB, setLinB] = useState(-2);

  // Quadratic y = ax^2 + bx + c
  const [quadA, setQuadA] = useState(0.5);
  const [quadB, setQuadB] = useState(-1);
  const [quadC, setQuadC] = useState(-1.5);

  // Exponential & Logarithmic base a
  const [baseA, setBaseA] = useState(2);
  const [shiftV, setShiftV] = useState(0);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const handleReset = () => {
    setK(1.5);
    setLinB(-2);
    setQuadA(0.5);
    setQuadB(-1);
    setQuadC(-1.5);
    setBaseA(2);
    setShiftV(0);
  };

  // Evaluate curve path and key roots
  const { pathD, roots, specialPoints, summaryText } = useMemo(() => {
    const pts: string[] = [];
    const foundRoots: number[] = [];
    const specials: Array<{ x: number; y: number; label: string; color: string }> = [];
    let summary = '';

    const evalFn = (x: number): number | null => {
      if (mode === 'linear') return k * x + linB;
      if (mode === 'quadratic') return quadA * x * x + quadB * x + quadC;
      if (mode === 'exponential') return Math.pow(baseA, x) + shiftV;
      // logarithmic
      if (x <= 0.02) return null;
      return Math.log(x) / Math.log(baseA) + shiftV;
    };

    const steps = 220;
    let penDown = false;
    for (let i = 0; i <= steps; i++) {
      const x = X_MIN + (i / steps) * (X_MAX - X_MIN);
      const y = evalFn(x);
      if (y === null || !Number.isFinite(y) || y < Y_MIN - 4 || y > Y_MAX + 4) {
        penDown = false;
        continue;
      }
      const sx = toSvgX(x);
      const sy = toSvgY(y);
      pts.push(`${penDown ? 'L' : 'M'} ${sx.toFixed(1)} ${sy.toFixed(1)}`);
      penDown = true;
    }

    if (mode === 'linear') {
      if (Math.abs(k) > 1e-6) {
        foundRoots.push(-linB / k);
      }
      specials.push({ x: 0, y: linB, label: `(0; ${fmt(linB)})`, color: 'fill-emerald-600' });
      summary =
        Math.abs(k) < 1e-6
          ? `Qiyalik k = 0 — chiziq gorizontal va OX o‘qiga parallel (y = ${fmt(linB)}).`
          : `Chiziq ${k > 0 ? 'yuqoriga ko‘tarilmoqda (o‘suvchi)' : 'pastga tushmoqda (kamayuvchi)'}. OY o‘qini ${fmt(linB)} da, OX o‘qini esa x = ${fmt(-linB / k)} ildizda kesadi.`;
    } else if (mode === 'quadratic') {
      if (Math.abs(quadA) < 0.05) {
        if (Math.abs(quadB) > 1e-6) foundRoots.push(-quadC / quadB);
        summary = 'a = 0 bo‘lganda parabola to‘g‘ri chiziqqa aylanib qoladi!';
      } else {
        const vx = -quadB / (2 * quadA);
        const vy = quadA * vx * vx + quadB * vx + quadC;
        specials.push({
          x: vx,
          y: vy,
          label: `Tepa (${fmt(vx)}; ${fmt(vy)})`,
          color: 'fill-amber-500',
        });
        const disc = quadB * quadB - 4 * quadA * quadC;
        if (disc > 1e-6) {
          const r1 = (-quadB - Math.sqrt(disc)) / (2 * quadA);
          const r2 = (-quadB + Math.sqrt(disc)) / (2 * quadA);
          foundRoots.push(r1, r2);
          summary = `Parabola shoxlari ${quadA > 0 ? 'yuqoriga' : 'pastga'} qaragan. Diskriminant D = ${fmt(disc)} > 0 — grafik OX o‘qini 2 ta ildizda (${fmt(r1)} va ${fmt(r2)}) kesib o‘tadi.`;
        } else if (Math.abs(disc) <= 1e-6) {
          foundRoots.push(vx);
          summary = `Diskriminant D = 0 — parabola OX o‘qiga aynan tepa nuqtasida (x = ${fmt(vx)}) urinadi.`;
        } else {
          summary = `Diskriminant D = ${fmt(disc)} < 0 — parabola OX o‘qini kesmaydi, haqiqiy ildiz mavjud emas.`;
        }
      }
    } else if (mode === 'exponential') {
      specials.push({ x: 0, y: 1 + shiftV, label: `(0; ${fmt(1 + shiftV)})`, color: 'fill-emerald-600' });
      if (shiftV < 0) {
        const root = Math.log(-shiftV) / Math.log(baseA);
        if (Number.isFinite(root)) foundRoots.push(root);
      }
      summary = `Asos a = ${fmt(baseA)} ${baseA > 1 ? '> 1 bo‘lgani uchun grafik tez o‘sadi' : '< 1 bo‘lgani uchun grafik keskin kamayadi'}. Gorizontal asimptota: y = ${fmt(shiftV)}.`;
    } else {
      specials.push({ x: 1, y: shiftV, label: `(1; ${fmt(shiftV)})`, color: 'fill-emerald-600' });
      const root = Math.pow(baseA, -shiftV);
      if (Number.isFinite(root) && root > 0 && root <= X_MAX) foundRoots.push(root);
      summary = `Logarifmik egri chiziq faqat x > 0 sohada aniqlangan (OY o‘qi — vertikal asimptota). Asos a = ${fmt(baseA)} ${baseA > 1 ? '> 1 (o‘suvchi)' : '< 1 (kamayuvchi)'}.`;
    }

    return { pathD: pts.join(' '), roots: foundRoots, specialPoints: specials, summaryText: summary };
  }, [mode, k, linB, quadA, quadB, quadC, baseA, shiftV]);

  return (
    <div
      data-testid="graph-simulator"
      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
    >
      {/* Toolbar */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/80">
        <div
          className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800"
          role="tablist"
          aria-label="Funksiya turlari"
        >
          {(
            [
              { id: 'linear', label: 'Chiziqli (kx + b)' },
              { id: 'quadratic', label: 'Parabola (ax² + bx + c)' },
              { id: 'exponential', label: 'Ko‘rsatkichli (aˣ)' },
              { id: 'logarithmic', label: 'Logarifmik (logₐ x)' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={mode === tab.id}
              onClick={() => setMode(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                mode === tab.id
                  ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Qaytarish
        </button>
      </div>

      {/* Two-zone sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Coordinate Plane SVG */}
        <div className="lg:col-span-7 p-5 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full h-auto rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800"
            role="img"
            aria-label="Interaktiv koordinata tekisligi va funksiya grafigi"
          >
            {/* Gridlines */}
            {Array.from({ length: X_MAX - X_MIN + 1 }).map((_, idx) => {
              const xVal = X_MIN + idx;
              const sx = toSvgX(xVal);
              return (
                <line
                  key={`gx-${xVal}`}
                  x1={sx}
                  y1={0}
                  x2={sx}
                  y2={HEIGHT}
                  className={
                    xVal === 0
                      ? 'stroke-slate-600 dark:stroke-slate-400'
                      : 'stroke-slate-200 dark:stroke-slate-800/90'
                  }
                  strokeWidth={xVal === 0 ? 1.8 : 1}
                />
              );
            })}
            {Array.from({ length: Y_MAX - Y_MIN + 1 }).map((_, idx) => {
              const yVal = Y_MIN + idx;
              const sy = toSvgY(yVal);
              return (
                <line
                  key={`gy-${yVal}`}
                  x1={0}
                  y1={sy}
                  x2={WIDTH}
                  y2={sy}
                  className={
                    yVal === 0
                      ? 'stroke-slate-600 dark:stroke-slate-400'
                      : 'stroke-slate-200 dark:stroke-slate-800/90'
                  }
                  strokeWidth={yVal === 0 ? 1.8 : 1}
                />
              );
            })}

            {/* Axis numbers */}
            {[-6, -4, -2, 2, 4, 6].map((n) => (
              <text
                key={`lx-${n}`}
                x={toSvgX(n)}
                y={toSvgY(0) + 15}
                textAnchor="middle"
                className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono"
              >
                {n}
              </text>
            ))}
            {[-4, -2, 2, 4].map((n) => (
              <text
                key={`ly-${n}`}
                x={toSvgX(0) - 10}
                y={toSvgY(n) + 3}
                textAnchor="end"
                className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono"
              >
                {n}
              </text>
            ))}
            <text x={WIDTH - 14} y={toSvgY(0) - 8} className="fill-slate-500 text-[11px] font-mono font-bold">
              x
            </text>
            <text x={toSvgX(0) + 10} y="16" className="fill-slate-500 text-[11px] font-mono font-bold">
              y
            </text>

            {/* Asymptote for exponential / logarithmic */}
            {mode === 'exponential' && (
              <line
                x1={0}
                y1={toSvgY(shiftV)}
                x2={WIDTH}
                y2={toSvgY(shiftV)}
                className="stroke-amber-500/80"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
            )}
            {mode === 'logarithmic' && (
              <line
                x1={toSvgX(0)}
                y1={0}
                x2={toSvgX(0)}
                y2={HEIGHT}
                className="stroke-amber-500/80"
                strokeWidth="2"
                strokeDasharray="5 4"
              />
            )}

            {/* Main Function Curve */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                className="stroke-indigo-600 dark:stroke-indigo-400"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Roots on X-axis */}
            {roots
              .filter((r) => r >= X_MIN && r <= X_MAX)
              .map((r, idx) => (
                <g key={`root-${idx}`}>
                  <circle
                    cx={toSvgX(r)}
                    cy={toSvgY(0)}
                    r="6"
                    className="fill-rose-600 dark:fill-rose-400 stroke-white dark:stroke-slate-950"
                    strokeWidth="2"
                  />
                  <text
                    x={toSvgX(r)}
                    y={toSvgY(0) - 10}
                    textAnchor="middle"
                    className="fill-rose-700 dark:fill-rose-300 text-[10.5px] font-mono font-bold"
                  >
                    x = {fmt(r)}
                  </text>
                </g>
              ))}

            {/* Special Points (Vertex / Intercept) */}
            {specialPoints
              .filter((p) => p.x >= X_MIN && p.x <= X_MAX && p.y >= Y_MIN && p.y <= Y_MAX)
              .map((pt, idx) => (
                <g key={`sp-${idx}`}>
                  <circle
                    cx={toSvgX(pt.x)}
                    cy={toSvgY(pt.y)}
                    r="5.5"
                    className={`${pt.color} stroke-white dark:stroke-slate-950`}
                    strokeWidth="2"
                  />
                  <text
                    x={toSvgX(pt.x) + 8}
                    y={toSvgY(pt.y) + 14}
                    className="fill-slate-700 dark:fill-slate-200 text-[10.5px] font-mono font-semibold"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
          </svg>
        </div>

        {/* Sliders & Live Readout */}
        <div className="lg:col-span-5 p-6 space-y-5 bg-slate-50/40 dark:bg-slate-950/30">
          {mode === 'linear' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <label htmlFor="graph-k" className="text-slate-700 dark:text-slate-300">
                    Qiyalik koeffitsiyenti (k)
                  </label>
                  <span className="font-mono font-semibold tabular-nums text-indigo-700 dark:text-indigo-300">
                    {fmt(k)}
                  </span>
                </div>
                <input
                  id="graph-k"
                  type="range"
                  min={-4}
                  max={4}
                  step={0.5}
                  value={k}
                  onChange={(e) => setK(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <label htmlFor="graph-lin-b" className="text-slate-700 dark:text-slate-300">
                    Vertikal siljish (b)
                  </label>
                  <span className="font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                    {fmt(linB)}
                  </span>
                </div>
                <input
                  id="graph-lin-b"
                  type="range"
                  min={-5}
                  max={5}
                  step={0.5}
                  value={linB}
                  onChange={(e) => setLinB(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {mode === 'quadratic' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <label htmlFor="graph-qa" className="text-slate-700 dark:text-slate-300">
                    Kenglik va yo‘nalish (a)
                  </label>
                  <span className="font-mono font-semibold tabular-nums text-indigo-700 dark:text-indigo-300">
                    {fmt(quadA)}
                  </span>
                </div>
                <input
                  id="graph-qa"
                  type="range"
                  min={-2}
                  max={2}
                  step={0.25}
                  value={quadA}
                  onChange={(e) => setQuadA(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <label htmlFor="graph-qb" className="text-slate-700 dark:text-slate-300">
                    Tepa nuqta siljishi (b)
                  </label>
                  <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                    {fmt(quadB)}
                  </span>
                </div>
                <input
                  id="graph-qb"
                  type="range"
                  min={-4}
                  max={4}
                  step={0.5}
                  value={quadB}
                  onChange={(e) => setQuadB(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <label htmlFor="graph-qc" className="text-slate-700 dark:text-slate-300">
                    OY kesish nuqtasi (c)
                  </label>
                  <span className="font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                    {fmt(quadC)}
                  </span>
                </div>
                <input
                  id="graph-qc"
                  type="range"
                  min={-5}
                  max={5}
                  step={0.5}
                  value={quadC}
                  onChange={(e) => setQuadC(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {(mode === 'exponential' || mode === 'logarithmic') && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <label htmlFor="graph-base" className="text-slate-700 dark:text-slate-300">
                    Asos (a &gt; 0, a ≠ 1)
                  </label>
                  <span className="font-mono font-semibold tabular-nums text-indigo-700 dark:text-indigo-300">
                    {fmt(baseA)}
                  </span>
                </div>
                <input
                  id="graph-base"
                  type="range"
                  min={0.25}
                  max={4}
                  step={0.25}
                  value={baseA}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    // Avoid a === 1
                    setBaseA(Math.abs(next - 1) < 0.01 ? (next >= baseA ? 1.25 : 0.75) : next);
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <label htmlFor="graph-shift" className="text-slate-700 dark:text-slate-300">
                    Vertikal siljish
                  </label>
                  <span className="font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                    {fmt(shiftV)}
                  </span>
                </div>
                <input
                  id="graph-shift"
                  type="range"
                  min={-3}
                  max={3}
                  step={0.5}
                  value={shiftV}
                  onChange={(e) => setShiftV(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Grafik tahlili va ildizlar
            </p>
            <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              {summaryText}
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>Qizil nuqta: OX ildizi</span>
              <span aria-hidden="true">·</span>
              <span>Yashil/sariq nuqta: asosiy tayanch nuqta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
