import React, { useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

const BENCHMARK_ANGLES = [0, 30, 45, 60, 90, 120, 150, 180, 225, 270, 315];

function formatRadiansLabel(deg: number): string {
  const known: Record<number, string> = {
    0: '0',
    30: 'π / 6',
    45: 'π / 4',
    60: 'π / 3',
    90: 'π / 2',
    120: '2π / 3',
    135: '3π / 4',
    150: '5π / 6',
    180: 'π',
    210: '7π / 6',
    225: '5π / 4',
    240: '4π / 3',
    270: '3π / 2',
    300: '5π / 3',
    315: '7π / 4',
    330: '11π / 6',
    360: '2π',
  };
  if (known[deg]) return known[deg];
  return `${((deg * Math.PI) / 180).toFixed(2)} rad`;
}

function getQuadrantInfo(deg: number): { name: string; sinSign: string; cosSign: string; tanSign: string } {
  const d = ((deg % 360) + 360) % 360;
  if (d === 0 || d === 90 || d === 180 || d === 270) {
    return {
      name: 'Koordinata o‘qida',
      sinSign: d === 90 ? '+' : d === 270 ? '−' : '0',
      cosSign: d === 0 ? '+' : d === 180 ? '−' : '0',
      tanSign: d === 90 || d === 270 ? 'aniqlanmagan' : '0',
    };
  }
  if (d < 90) return { name: 'I chorak', sinSign: '+', cosSign: '+', tanSign: '+' };
  if (d < 180) return { name: 'II chorak', sinSign: '+', cosSign: '−', tanSign: '−' };
  if (d < 270) return { name: 'III chorak', sinSign: '−', cosSign: '−', tanSign: '+' };
  return { name: 'IV chorak', sinSign: '−', cosSign: '+', tanSign: '−' };
}

export const TrigSimulator: React.FC = () => {
  const [angleDeg, setAngleDeg] = useState<number>(45);
  const [isDragging, setIsDragging] = useState(false);
  const circleSvgRef = useRef<SVGSVGElement | null>(null);

  const rad = (angleDeg * Math.PI) / 180;
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  const tanDefined = Math.abs(cosVal) > 1e-4;
  const tanVal = tanDefined ? sinVal / cosVal : null;
  const quad = getQuadrantInfo(angleDeg);

  // Unit circle geometry
  const cx = 140;
  const cy = 140;
  const R = 95;
  const px = cx + R * cosVal;
  const py = cy - R * sinVal;

  const updateAngleFromPointer = (clientX: number, clientY: number) => {
    const svg = circleSvgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 280 - cx;
    const y = cy - ((clientY - rect.top) / rect.height) * 280;
    let deg = Math.round((Math.atan2(y, x) * 180) / Math.PI);
    if (deg < 0) deg += 360;
    setAngleDeg(deg);
  };

  // Wave plot points (0 to 360 deg)
  const waveW = 300;
  const waveH = 120;
  const sinWavePath = Array.from({ length: 73 }, (_, i) => {
    const d = i * 5;
    const x = 16 + (d / 360) * (waveW - 32);
    const y = waveH / 2 - Math.sin((d * Math.PI) / 180) * 42;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  const cosWavePath = Array.from({ length: 73 }, (_, i) => {
    const d = i * 5;
    const x = 16 + (d / 360) * (waveW - 32);
    const y = waveH / 2 - Math.cos((d * Math.PI) / 180) * 42;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  const cursorX = 16 + (angleDeg / 360) * (waveW - 32);
  const cursorSinY = waveH / 2 - sinVal * 42;
  const cursorCosY = waveH / 2 - cosVal * 42;

  return (
    <div
      data-testid="trig-simulator"
      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
    >
      {/* Toolbar */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/80">
        <div className="flex flex-wrap items-center gap-1.5">
          {BENCHMARK_ANGLES.map((deg) => (
            <button
              key={deg}
              type="button"
              onClick={() => setAngleDeg(deg)}
              className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md transition-colors cursor-pointer ${
                angleDeg === deg
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300/70 dark:hover:bg-slate-700'
              }`}
            >
              {deg}°
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setAngleDeg(45)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          45°
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Interactive Unit Circle + Synchronized Wave */}
        <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
            {/* Draggable Unit Circle */}
            <svg
              ref={circleSvgRef}
              viewBox="0 0 280 280"
              className="w-[248px] h-[248px] select-none touch-none cursor-grab active:cursor-grabbing shrink-0"
              role="img"
              aria-label="Interaktiv birlik aylana: nuqtani sudrab burchakni o'zgartiring"
              onPointerDown={(e) => {
                setIsDragging(true);
                e.currentTarget.setPointerCapture(e.pointerId);
                updateAngleFromPointer(e.clientX, e.clientY);
              }}
              onPointerMove={(e) => {
                if (isDragging) updateAngleFromPointer(e.clientX, e.clientY);
              }}
              onPointerUp={() => setIsDragging(false)}
              onPointerCancel={() => setIsDragging(false)}
            >
              {/* Axes */}
              <line x1="20" y1={cy} x2="260" y2={cy} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="1.5" />
              <line x1={cx} y1="20" x2={cx} y2="260" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="1.5" />

              {/* Quadrant labels */}
              <text x="214" y="66" className="fill-slate-400 text-[11px] font-mono">I</text>
              <text x="58" y="66" className="fill-slate-400 text-[11px] font-mono">II</text>
              <text x="54" y="224" className="fill-slate-400 text-[11px] font-mono">III</text>
              <text x="210" y="224" className="fill-slate-400 text-[11px] font-mono">IV</text>

              {/* Main Unit Circle */}
              <circle
                cx={cx}
                cy={cy}
                r={R}
                fill="none"
                className="stroke-slate-400 dark:stroke-slate-500"
                strokeWidth="2"
              />

              {/* Angle arc */}
              {angleDeg > 0 && angleDeg < 360 && (
                <path
                  d={`M ${cx + 26} ${cy} A 26 26 0 ${angleDeg > 180 ? 1 : 0} 0 ${cx + 26 * cosVal} ${cy - 26 * sinVal}`}
                  fill="none"
                  className="stroke-amber-500"
                  strokeWidth="2.2"
                />
              )}

              {/* cos projection (horizontal) */}
              <line
                x1={cx}
                y1={cy}
                x2={px}
                y2={cy}
                className="stroke-emerald-600 dark:stroke-emerald-400"
                strokeWidth="3.5"
              />

              {/* sin projection (vertical) */}
              <line
                x1={px}
                y1={cy}
                x2={px}
                y2={py}
                className="stroke-indigo-600 dark:stroke-indigo-400"
                strokeWidth="3.5"
              />

              {/* Radius vector */}
              <line
                x1={cx}
                y1={cy}
                x2={px}
                y2={py}
                className="stroke-slate-800 dark:stroke-slate-200"
                strokeWidth="2.5"
              />

              {/* Draggable handle */}
              <circle
                cx={px}
                cy={py}
                r="8.5"
                className="fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900"
                strokeWidth="2.5"
              />
            </svg>

            {/* Live Wave Plot */}
            <div className="w-full max-w-[300px] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Jonli to‘lqin grafigi
                </span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  sin θ (ko‘k) · cos θ (yashil)
                </span>
              </div>

              <svg
                viewBox={`0 0 ${waveW} ${waveH}`}
                className="w-full h-auto rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                role="img"
                aria-label="Sinus va kosinus to'lqin grafigi"
              >
                <line x1="16" y1={waveH / 2} x2={waveW - 16} y2={waveH / 2} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="1.2" />
                <path d={cosWavePath} fill="none" className="stroke-emerald-500/75" strokeWidth="2" strokeDasharray="4 3" />
                <path d={sinWavePath} fill="none" className="stroke-indigo-600 dark:stroke-indigo-400" strokeWidth="2.4" />
                <line x1={cursorX} y1="10" x2={cursorX} y2={waveH - 10} className="stroke-amber-500" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx={cursorX} cy={cursorSinY} r="4.5" className="fill-indigo-600 dark:fill-indigo-400" />
                <circle cx={cursorX} cy={cursorCosY} r="4.5" className="fill-emerald-600 dark:fill-emerald-400" />
                <text x="16" y={waveH - 4} className="fill-slate-400 text-[9px] font-mono">0</text>
                <text x={waveW / 2} y={waveH - 4} textAnchor="middle" className="fill-slate-400 text-[9px] font-mono">π</text>
                <text x={waveW - 16} y={waveH - 4} textAnchor="end" className="fill-slate-400 text-[9px] font-mono">2π</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Control & Live Value Deck */}
        <div className="lg:col-span-5 p-6 space-y-5 bg-slate-50/40 dark:bg-slate-950/30">
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <label htmlFor="trig-angle-slider" className="font-medium text-slate-700 dark:text-slate-300">
                Burchak θ (aylanadagi nuqtani sudrang)
              </label>
              <span className="font-mono font-bold tabular-nums text-indigo-700 dark:text-indigo-300">
                {angleDeg}° · {formatRadiansLabel(angleDeg)}
              </span>
            </div>
            <input
              id="trig-angle-slider"
              type="range"
              min={0}
              max={360}
              value={angleDeg}
              onChange={(e) => setAngleDeg(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Live Numeric Readout Table */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">sin θ (Y)</p>
              <p className="mt-1 text-base font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                {sinVal.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">cos θ (X)</p>
              <p className="mt-1 text-base font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                {cosVal.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">tan θ</p>
              <p className="mt-1 text-base font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                {tanVal !== null && Math.abs(tanVal) < 50 ? tanVal.toFixed(2).replace('.', ',') : '∞'}
              </p>
            </div>
          </div>

          {/* Quadrant & Signs */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Joylashuv va ishoralar</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{quad.name}</span>
            </div>
            <p className="text-xs font-mono text-slate-600 dark:text-slate-300">
              sin: {quad.sinSign} · cos: {quad.cosSign} · tan: {quad.tanSign}
            </p>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 pt-1">
              Birlik aylanada nuqtaning balandligi (vertikal ko‘k kesma) sinusni, gorizontal uzoqligi (yashil kesma) esa kosinusni beradi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
