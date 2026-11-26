import React, { useEffect, useState } from 'react';
import { RotateCcw, Scale, Grid2x2, ArrowLeftRight } from 'lucide-react';
import type { AlgebraSubMode } from '../../types/math';

interface AlgebraSimulatorProps {
  defaultMode?: AlgebraSubMode;
  topicId: number;
}

export const AlgebraSimulator: React.FC<AlgebraSimulatorProps> = ({
  defaultMode = 'balance',
  topicId,
}) => {
  const [mode, setMode] = useState<AlgebraSubMode>(defaultMode);

  // 1. Balance Scale state: hidden true x = 4; equation starts as 2x + 3 = x + 7
  const TRUE_X = 4;
  const [leftX, setLeftX] = useState(2);
  const [leftOnes, setLeftOnes] = useState(3);
  const [rightX, setRightX] = useState(1);
  const [rightOnes, setRightOnes] = useState(7);

  // 2. Area-Model Box state: (a + b)^2 vs a^2 - b^2
  const [areaVariant, setAreaVariant] = useState<'sum-square' | 'diff-squares'>(
    topicId === 18 ? 'diff-squares' : 'sum-square'
  );
  const [sideA, setSideA] = useState(6);
  const [sideB, setSideB] = useState(2);

  // 3. Number Line Interval & |x - a| state
  const [intervalKind, setIntervalKind] = useState<'abs-inside' | 'abs-outside' | 'ray'>(
    topicId === 31 || topicId === 32 || topicId === 46 ? 'abs-inside' : 'ray'
  );
  const [centerA, setCenterA] = useState(2);
  const [radiusR, setRadiusR] = useState(3);
  const [inclusive, setInclusive] = useState(false);
  const [rayDir, setRayDir] = useState<'gt' | 'lt'>('gt');

  useEffect(() => {
    setMode(defaultMode);
    if (topicId === 18) setAreaVariant('diff-squares');
    else if (topicId === 16 || topicId === 17) setAreaVariant('sum-square');
    if (topicId === 31 || topicId === 32 || topicId === 46) setIntervalKind('abs-inside');
  }, [defaultMode, topicId]);

  const leftWeight = leftX * TRUE_X + leftOnes;
  const rightWeight = rightX * TRUE_X + rightOnes;
  const diffWeight = rightWeight - leftWeight;
  const tiltDeg = Math.max(-14, Math.min(14, diffWeight * 2.5));
  const isBalanced = leftWeight === rightWeight;
  const isSolvedX = isBalanced && leftX === 1 && leftOnes === 0 && rightX === 0;

  const resetCurrent = () => {
    if (mode === 'balance') {
      setLeftX(2);
      setLeftOnes(3);
      setRightX(1);
      setRightOnes(7);
    } else if (mode === 'area') {
      setSideA(6);
      setSideB(2);
    } else {
      setCenterA(2);
      setRadiusR(3);
      setInclusive(false);
      setRayDir('gt');
    }
  };

  const applyBothSides = (dx: number, dOnes: number) => {
    setLeftX((v) => Math.max(0, v + dx));
    setRightX((v) => Math.max(0, v + dx));
    setLeftOnes((v) => Math.max(0, v + dOnes));
    setRightOnes((v) => Math.max(0, v + dOnes));
  };

  // Safe b < a for difference of squares
  const effectiveB = areaVariant === 'diff-squares' ? Math.min(sideB, sideA - 1) : sideB;

  const mapNumberLineX = (val: number) => 40 + ((val + 8) / 16) * 480;

  return (
    <div
      data-testid="algebra-simulator"
      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
    >
      {/* Toolbar */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/80">
        <div
          className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800"
          role="tablist"
          aria-label="Algebra simulyatori rejimlari"
        >
          {(
            [
              { id: 'balance', label: 'Tarozi muvozanati', icon: Scale },
              { id: 'area', label: 'Yuza modeli', icon: Grid2x2 },
              { id: 'interval', label: "Sonlar o'qi va modul", icon: ArrowLeftRight },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={mode === tab.id}
                onClick={() => setMode(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  mode === tab.id
                    ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={resetCurrent}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Qaytarish
        </button>
      </div>

      {/* Main Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Interactive Stage */}
        <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col justify-center">
          {mode === 'balance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Ikki pallali tenglama tarozisi
                </span>
                <span
                  className={`font-semibold ${
                    isSolvedX
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : isBalanced
                        ? 'text-indigo-700 dark:text-indigo-300'
                        : 'text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {isSolvedX
                    ? 'Noma’lum qop topildi: 1 qop = 4 tosh!'
                    : isBalanced
                      ? 'Muvozanatda (teng)'
                      : leftWeight > rightWeight
                        ? 'Chap palla og‘irroq'
                        : 'O‘ng palla og‘irroq'}
                </span>
              </div>

              <svg
                viewBox="0 0 540 245"
                className="w-full h-auto"
                role="img"
                aria-label="Tenglama tarozi muvozanati modeli"
              >
                {/* Base stand */}
                <polygon
                  points="240,232 300,232 270,152"
                  className="fill-slate-300 dark:fill-slate-700"
                />
                <rect
                  x="215"
                  y="228"
                  width="110"
                  height="10"
                  rx="4"
                  className="fill-slate-400 dark:fill-slate-600"
                />

                {/* Rotating Beam & Pans */}
                <g
                  transform={`rotate(${tiltDeg} 270 152)`}
                  style={{ transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <line
                    x1="95"
                    y1="152"
                    x2="445"
                    y2="152"
                    className={
                      isBalanced
                        ? 'stroke-indigo-600 dark:stroke-indigo-400'
                        : 'stroke-amber-500 dark:stroke-amber-400'
                    }
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="270"
                    cy="152"
                    r="8"
                    className="fill-slate-800 dark:fill-slate-200"
                  />

                  {/* Left Pan */}
                  <line x1="115" y1="152" x2="115" y2="122" className="stroke-slate-400" strokeWidth="2.5" />
                  <rect
                    x="45"
                    y="118"
                    width="140"
                    height="10"
                    rx="5"
                    className="fill-slate-700 dark:fill-slate-300"
                  />
                  {/* Left X bags */}
                  {Array.from({ length: leftX }).map((_, idx) => (
                    <g key={`lx-${idx}`} transform={`translate(${54 + idx * 36}, 76)`}>
                      <rect
                        width="30"
                        height="38"
                        rx="6"
                        className="fill-indigo-600 dark:fill-indigo-500"
                      />
                      <text
                        x="15"
                        y="24"
                        textAnchor="middle"
                        className="fill-white text-[13px] font-bold font-mono"
                      >
                        ?
                      </text>
                    </g>
                  ))}
                  {/* Left 1-unit weights */}
                  {Array.from({ length: leftOnes }).map((_, idx) => {
                    const row = Math.floor(idx / 4);
                    const col = idx % 4;
                    return (
                      <rect
                        key={`lo-${idx}`}
                        x={54 + leftX * 36 + col * 18}
                        y={98 - row * 18}
                        width="14"
                        height="14"
                        rx="3"
                        className="fill-emerald-600 dark:fill-emerald-500"
                      />
                    );
                  })}

                  {/* Right Pan */}
                  <line x1="425" y1="152" x2="425" y2="122" className="stroke-slate-400" strokeWidth="2.5" />
                  <rect
                    x="355"
                    y="118"
                    width="140"
                    height="10"
                    rx="5"
                    className="fill-slate-700 dark:fill-slate-300"
                  />
                  {/* Right X bags */}
                  {Array.from({ length: rightX }).map((_, idx) => (
                    <g key={`rx-${idx}`} transform={`translate(${364 + idx * 36}, 76)`}>
                      <rect
                        width="30"
                        height="38"
                        rx="6"
                        className="fill-indigo-600 dark:fill-indigo-500"
                      />
                      <text
                        x="15"
                        y="24"
                        textAnchor="middle"
                        className="fill-white text-[13px] font-bold font-mono"
                      >
                        ?
                      </text>
                    </g>
                  ))}
                  {/* Right 1-unit weights */}
                  {Array.from({ length: rightOnes }).map((_, idx) => {
                    const row = Math.floor(idx / 4);
                    const col = idx % 4;
                    return (
                      <rect
                        key={`ro-${idx}`}
                        x={364 + rightX * 36 + col * 18}
                        y={98 - row * 18}
                        width="14"
                        height="14"
                        rx="3"
                        className="fill-emerald-600 dark:fill-emerald-500"
                      />
                    );
                  })}
                </g>

                {/* Labels below pans */}
                <text
                  x="115"
                  y="206"
                  textAnchor="middle"
                  className="fill-slate-700 dark:fill-slate-300 text-[12px] font-semibold"
                >
                  Chap: {leftX} qop va {leftOnes} tosh
                </text>
                <text
                  x="425"
                  y="206"
                  textAnchor="middle"
                  className="fill-slate-700 dark:fill-slate-300 text-[12px] font-semibold"
                >
                  O‘ng: {rightX} qop va {rightOnes} tosh
                </text>
              </svg>
            </div>
          )}

          {mode === 'area' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setAreaVariant('sum-square')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                      areaVariant === 'sum-square'
                        ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Yig‘indi kvadrati (a + b)²
                  </button>
                  <button
                    type="button"
                    onClick={() => setAreaVariant('diff-squares')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                      areaVariant === 'diff-squares'
                        ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Kvadratlar ayirmasi a² − b²
                  </button>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  {areaVariant === 'sum-square'
                    ? `Umumiy yuza: ${(sideA + sideB) ** 2}`
                    : `Qolgan yuza: ${sideA ** 2 - effectiveB ** 2}`}
                </span>
              </div>

              {areaVariant === 'sum-square' ? (
                <svg
                  viewBox="0 0 360 280"
                  className="w-full max-w-[360px] mx-auto h-auto"
                  role="img"
                  aria-label="Yig'indining kvadrati geometrik yuza modeli"
                >
                  {(() => {
                    const total = sideA + sideB;
                    const boxSize = 210;
                    const pxA = (sideA / total) * boxSize;
                    const pxB = (sideB / total) * boxSize;
                    const ox = 75;
                    const oy = 38;
                    return (
                      <g>
                        {/* Top-left: a x a */}
                        <rect
                          x={ox}
                          y={oy}
                          width={pxA}
                          height={pxA}
                          className="fill-indigo-600/85 dark:fill-indigo-500/85 stroke-white dark:stroke-slate-900"
                          strokeWidth="2"
                        />
                        <text
                          x={ox + pxA / 2}
                          y={oy + pxA / 2 + 4}
                          textAnchor="middle"
                          className="fill-white text-[13px] font-bold font-mono"
                        >
                          {sideA}×{sideA} = {sideA * sideA}
                        </text>

                        {/* Top-right: b x a */}
                        <rect
                          x={ox + pxA}
                          y={oy}
                          width={pxB}
                          height={pxA}
                          className="fill-sky-500/85 dark:fill-sky-500/80 stroke-white dark:stroke-slate-900"
                          strokeWidth="2"
                        />
                        {pxB > 26 && (
                          <text
                            x={ox + pxA + pxB / 2}
                            y={oy + pxA / 2 + 4}
                            textAnchor="middle"
                            className="fill-white text-[12px] font-bold font-mono"
                          >
                            {sideA * sideB}
                          </text>
                        )}

                        {/* Bottom-left: a x b */}
                        <rect
                          x={ox}
                          y={oy + pxA}
                          width={pxA}
                          height={pxB}
                          className="fill-sky-500/85 dark:fill-sky-500/80 stroke-white dark:stroke-slate-900"
                          strokeWidth="2"
                        />
                        {pxB > 22 && (
                          <text
                            x={ox + pxA / 2}
                            y={oy + pxA + pxB / 2 + 4}
                            textAnchor="middle"
                            className="fill-white text-[12px] font-bold font-mono"
                          >
                            {sideA * sideB}
                          </text>
                        )}

                        {/* Bottom-right: b x b */}
                        <rect
                          x={ox + pxA}
                          y={oy + pxA}
                          width={pxB}
                          height={pxB}
                          className="fill-emerald-600/90 dark:fill-emerald-500/90 stroke-white dark:stroke-slate-900"
                          strokeWidth="2"
                        />
                        {pxB > 24 && (
                          <text
                            x={ox + pxA + pxB / 2}
                            y={oy + pxA + pxB / 2 + 4}
                            textAnchor="middle"
                            className="fill-white text-[12px] font-bold font-mono"
                          >
                            {sideB * sideB}
                          </text>
                        )}

                        {/* Side dimension labels */}
                        <text x={ox + pxA / 2} y={oy - 10} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-[12px] font-mono font-semibold">
                          a = {sideA}
                        </text>
                        <text x={ox + pxA + pxB / 2} y={oy - 10} textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-400 text-[12px] font-mono font-semibold">
                          b = {sideB}
                        </text>
                        <text x={ox - 12} y={oy + pxA / 2 + 4} textAnchor="end" className="fill-slate-700 dark:fill-slate-300 text-[12px] font-mono font-semibold">
                          a = {sideA}
                        </text>
                        <text x={ox - 12} y={oy + pxA + pxB / 2 + 4} textAnchor="end" className="fill-emerald-700 dark:fill-emerald-400 text-[12px] font-mono font-semibold">
                          b = {sideB}
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              ) : (
                <svg
                  viewBox="0 0 460 250"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Kvadratlar ayirmasi kesib qayta yig'ish modeli"
                >
                  {(() => {
                    const scale = 165 / sideA;
                    const pxA = sideA * scale;
                    const pxB = effectiveB * scale;
                    const pxDiff = (sideA - effectiveB) * scale;
                    return (
                      <g>
                        {/* Left: Original a x a with b x b cut out */}
                        <rect x="24" y="42" width={pxA} height={pxDiff} className="fill-indigo-600/85 stroke-white dark:stroke-slate-900" strokeWidth="2" />
                        <rect x="24" y={42 + pxDiff} width={pxDiff} height={pxB} className="fill-sky-500/85 stroke-white dark:stroke-slate-900" strokeWidth="2" />
                        <rect
                          x={24 + pxDiff}
                          y={42 + pxDiff}
                          width={pxB}
                          height={pxB}
                          className="fill-rose-500/20 stroke-rose-500"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                        />
                        <text x={24 + pxDiff + pxB / 2} y={42 + pxDiff + pxB / 2 + 4} textAnchor="middle" className="fill-rose-600 dark:fill-rose-400 text-[11px] font-mono font-semibold">
                          −{effectiveB}²
                        </text>
                        <text x={24 + pxA / 2} y="28" textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[11px] font-semibold">
                          Katta kvadratdan kichigini kesish
                        </text>

                        {/* Arrow */}
                        <text x="214" y="130" textAnchor="middle" className="fill-slate-400 text-[20px]">
                          →
                        </text>

                        {/* Right: Rearranged (a + b) x (a - b) rectangle */}
                        {(() => {
                          const rScale = Math.min(scale, 195 / (sideA + effectiveB));
                          const wA = sideA * rScale;
                          const wB = effectiveB * rScale;
                          const hDiff = (sideA - effectiveB) * rScale;
                          const rx = 240;
                          const ry = 76;
                          return (
                            <g>
                              <rect x={rx} y={ry} width={wA} height={hDiff} className="fill-indigo-600/85 stroke-white dark:stroke-slate-900" strokeWidth="2" />
                              <rect x={rx + wA} y={ry} width={wB} height={hDiff} className="fill-sky-500/85 stroke-white dark:stroke-slate-900" strokeWidth="2" />
                              <text x={rx + (wA + wB) / 2} y={ry - 12} textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[12px] font-mono font-semibold">
                                Eni: {sideA} + {effectiveB} = {sideA + effectiveB}
                              </text>
                              <text x={rx + (wA + wB) / 2} y={ry + hDiff + 22} textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-400 text-[12px] font-mono font-semibold">
                                Bo‘yi: {sideA} − {effectiveB} = {sideA - effectiveB}
                              </text>
                            </g>
                          );
                        })()}
                      </g>
                    );
                  })()}
                </svg>
              )}
            </div>
          )}

          {mode === 'interval' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                  {(
                    [
                      { id: 'ray', label: 'Oddiy tengsizlik' },
                      { id: 'abs-inside', label: '|x − a| < r' },
                      { id: 'abs-outside', label: '|x − a| > r' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setIntervalKind(item.id)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                        intervalKind === item.id
                          ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-300 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                  {intervalKind === 'ray'
                    ? `x ${rayDir === 'gt' ? (inclusive ? '≥' : '>') : inclusive ? '≤' : '<'} ${centerA}`
                    : intervalKind === 'abs-inside'
                      ? `${centerA - radiusR} ${inclusive ? '≤' : '<'} x ${inclusive ? '≤' : '<'} ${centerA + radiusR}`
                      : `x ${inclusive ? '≤' : '<'} ${centerA - radiusR} yoki x ${inclusive ? '≥' : '>'} ${centerA + radiusR}`}
                </span>
              </div>

              <svg
                viewBox="0 0 560 155"
                className="w-full h-auto"
                role="img"
                aria-label="Sonlar o'qida tengsizlik va modul oraliqlarini shtrixlash"
              >
                {/* Shaded Regions */}
                {intervalKind === 'ray' && (
                  <rect
                    x={rayDir === 'gt' ? mapNumberLineX(centerA) : 20}
                    y="66"
                    width={
                      rayDir === 'gt'
                        ? 540 - mapNumberLineX(centerA)
                        : mapNumberLineX(centerA) - 20
                    }
                    height="24"
                    rx="4"
                    className="fill-indigo-500/25 dark:fill-indigo-400/30"
                  />
                )}

                {intervalKind === 'abs-inside' && (
                  <rect
                    x={mapNumberLineX(Math.max(-8, centerA - radiusR))}
                    y="66"
                    width={Math.max(
                      0,
                      mapNumberLineX(Math.min(8, centerA + radiusR)) -
                        mapNumberLineX(Math.max(-8, centerA - radiusR))
                    )}
                    height="24"
                    rx="4"
                    className="fill-emerald-500/25 dark:fill-emerald-400/30"
                  />
                )}

                {intervalKind === 'abs-outside' && (
                  <>
                    <rect
                      x="20"
                      y="66"
                      width={Math.max(0, mapNumberLineX(Math.max(-8, centerA - radiusR)) - 20)}
                      height="24"
                      rx="4"
                      className="fill-amber-500/25 dark:fill-amber-400/30"
                    />
                    <rect
                      x={mapNumberLineX(Math.min(8, centerA + radiusR))}
                      y="66"
                      width={Math.max(0, 540 - mapNumberLineX(Math.min(8, centerA + radiusR)))}
                      height="24"
                      rx="4"
                      className="fill-amber-500/25 dark:fill-amber-400/30"
                    />
                  </>
                )}

                {/* Main Axis */}
                <line
                  x1="20"
                  y1="90"
                  x2="540"
                  y2="90"
                  className="stroke-slate-400 dark:stroke-slate-500"
                  strokeWidth="2.5"
                />

                {/* Ticks -8 to +8 */}
                {Array.from({ length: 17 }).map((_, idx) => {
                  const v = idx - 8;
                  const x = mapNumberLineX(v);
                  const isZero = v === 0;
                  return (
                    <g key={v}>
                      <line
                        x1={x}
                        y1={isZero ? 80 : 85}
                        x2={x}
                        y2={isZero ? 100 : 95}
                        className={
                          isZero
                            ? 'stroke-slate-900 dark:stroke-slate-100'
                            : 'stroke-slate-400 dark:stroke-slate-600'
                        }
                        strokeWidth={isZero ? 2.2 : 1.3}
                      />
                      {v % 2 === 0 && (
                        <text
                          x={x}
                          y="118"
                          textAnchor="middle"
                          className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono"
                        >
                          {v}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Center marker for |x - a| */}
                {intervalKind !== 'ray' && (
                  <g>
                    <line
                      x1={mapNumberLineX(centerA)}
                      y1="42"
                      x2={mapNumberLineX(centerA)}
                      y2="90"
                      className="stroke-indigo-500"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={mapNumberLineX(centerA)}
                      y="34"
                      textAnchor="middle"
                      className="fill-indigo-600 dark:fill-indigo-400 text-[11px] font-semibold font-mono"
                    >
                      Markaz a = {centerA}
                    </text>
                  </g>
                )}

                {/* Boundary dots (open vs filled) */}
                {(intervalKind === 'ray'
                  ? [centerA]
                  : [centerA - radiusR, centerA + radiusR]
                )
                  .filter((p) => p >= -8 && p <= 8)
                  .map((pt, i) => (
                    <g key={i}>
                      <circle
                        cx={mapNumberLineX(pt)}
                        cy="90"
                        r="6.5"
                        className={
                          inclusive
                            ? 'fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900'
                            : 'fill-white dark:fill-slate-900 stroke-indigo-600 dark:stroke-indigo-400'
                        }
                        strokeWidth="2.5"
                      />
                      <text
                        x={mapNumberLineX(pt)}
                        y="140"
                        textAnchor="middle"
                        className="fill-indigo-700 dark:fill-indigo-300 text-[11px] font-mono font-bold"
                      >
                        {pt}
                      </text>
                    </g>
                  ))}
              </svg>
            </div>
          )}
        </div>

        {/* Control Deck */}
        <div className="lg:col-span-5 p-6 space-y-5 bg-slate-50/40 dark:bg-slate-950/30">
          {mode === 'balance' && (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                Ikkala pallaga bir xil amal bajaring (muvozanatni saqlang!)
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => applyBothSides(-1, 0)}
                  disabled={leftX === 0 || rightX === 0}
                  className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  Ikkaladan −1 qop
                </button>
                <button
                  type="button"
                  onClick={() => applyBothSides(1, 0)}
                  disabled={leftX >= 3 || rightX >= 3}
                  className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  Ikkalaga +1 qop
                </button>
                <button
                  type="button"
                  onClick={() => applyBothSides(0, -1)}
                  disabled={leftOnes === 0 || rightOnes === 0}
                  className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  Ikkaladan −1 tosh
                </button>
                <button
                  type="button"
                  onClick={() => applyBothSides(0, 1)}
                  disabled={leftOnes >= 9 || rightOnes >= 9}
                  className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  Ikkalaga +1 tosh
                </button>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Jonli kuzatuv
                </p>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {isSolvedX
                    ? 'Ajoyib! Chap pallada yolg‘iz 1 ta sirli qop, o‘ng pallada esa aniq 4 ta tosh qoldi. Tarozi gorizontal — demak har bir qopning og‘irligi 4 ga teng!'
                    : 'Maqsad: ikkala palladan bir xil sondagi qop va toshlarni olib tashlab, chap pallada faqat 1 ta sirli qopni qoldiring.'}
                </p>
              </div>
            </div>
          )}

          {mode === 'area' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <label htmlFor="area-a" className="text-slate-700 dark:text-slate-300">
                    Katta tomon (a)
                  </label>
                  <span className="font-mono font-semibold tabular-nums text-indigo-700 dark:text-indigo-300">
                    {sideA}
                  </span>
                </div>
                <input
                  id="area-a"
                  type="range"
                  min={3}
                  max={9}
                  value={sideA}
                  onChange={(e) => setSideA(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <label htmlFor="area-b" className="text-slate-700 dark:text-slate-300">
                    Qo‘shimcha / kesiladigan tomon (b)
                  </label>
                  <span className="font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                    {effectiveB}
                  </span>
                </div>
                <input
                  id="area-b"
                  type="range"
                  min={1}
                  max={areaVariant === 'diff-squares' ? Math.max(1, sideA - 1) : 5}
                  value={effectiveB}
                  onChange={(e) => setSideB(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Geometrik intuisiya
                </p>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {areaVariant === 'sum-square'
                    ? `Katta kvadrat 4 qismdan tashkil topgan: ${sideA * sideA} + ikkita ${sideA * sideB} li tasma + ${sideB * sideB} = ${(sideA + sideB) ** 2}. Shuning uchun o‘rtadagi ikkita tasma hech qachon unutilmaydi!`
                    : `Yuzasi ${sideA * sideA} bo‘lgan kvadratdan ${effectiveB * effectiveB} ni qirqib olib qayta joylasak, tomonlari ${sideA + effectiveB} va ${sideA - effectiveB} bo‘lgan tekis to‘rtburchak (yuzi ${(sideA + effectiveB) * (sideA - effectiveB)}) hosil bo‘ladi.`}
                </p>
              </div>
            </div>
          )}

          {mode === 'interval' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <label htmlFor="int-center" className="text-slate-700 dark:text-slate-300">
                    {intervalKind === 'ray' ? 'Chegara nuqtasi (a)' : 'Markaz nuqtasi (a)'}
                  </label>
                  <span className="font-mono font-semibold tabular-nums text-indigo-700 dark:text-indigo-300">
                    {centerA}
                  </span>
                </div>
                <input
                  id="int-center"
                  type="range"
                  min={-4}
                  max={4}
                  value={centerA}
                  onChange={(e) => setCenterA(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {intervalKind !== 'ray' ? (
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <label htmlFor="int-radius" className="text-slate-700 dark:text-slate-300">
                      Masofa chegarasi (r)
                    </label>
                    <span className="font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                      {radiusR}
                    </span>
                  </div>
                  <input
                    id="int-radius"
                    type="range"
                    min={1}
                    max={4}
                    value={radiusR}
                    onChange={(e) => setRadiusR(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRayDir('gt')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${
                      rayDir === 'gt'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    O‘ngga (katta)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRayDir('lt')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${
                      rayDir === 'lt'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Chapga (kichik)
                  </button>
                </div>
              )}

              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inclusive}
                  onChange={(e) => setInclusive(e.target.checked)}
                  className="rounded accent-indigo-600"
                />
                Chegara nuqtasini kiritish (bo‘yalgan doira: ≤ yoki ≥)
              </label>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Masofa intuisiyasi
                </p>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {intervalKind === 'abs-inside'
                    ? `|x − ${centerA}| masofasi ${radiusR} dan kichik — ya’ni ${centerA} markazidan ikki tomonga ${radiusR} qadam ichidagi barcha nuqtalar (${centerA - radiusR} dan ${centerA + radiusR} gacha).`
                    : intervalKind === 'abs-outside'
                      ? `|x − ${centerA}| masofasi ${radiusR} dan katta — markazdan ${radiusR} qadamdan uzoqroqda yotgan ikki tashqi nur shtrixlanadi.`
                      : `${centerA} nuqtasidan ${rayDir === 'gt' ? 'o‘ng' : 'chap'} tomonda joylashgan barcha sonlar tengsizlikni qanoatlantiradi.`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
