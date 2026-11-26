import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import type { WordProblemSubMode } from '../../types/math';
import { sanitizeInlineSvg } from '../../utils/svgSanitizer';
import { postJsonWithWakeupRetry } from '../../utils/apiClient';

interface WordProblemDiagramSimulatorProps {
  defaultMode?: WordProblemSubMode;
  topicTitle: string;
}

export const WordProblemDiagramSimulator: React.FC<WordProblemDiagramSimulatorProps> = ({
  defaultMode = 'motion',
  topicTitle,
}) => {
  const [mode, setMode] = useState<WordProblemSubMode>(defaultMode);

  // Motion state: two cars moving toward each other
  const [v1, setV1] = useState(60);
  const [v2, setV2] = useState(40);
  const [timeT, setTimeT] = useState(2);
  const totalDist = 300;

  // Mixture state: two vessels combined
  const [mass1, setMass1] = useState(4);
  const [conc1, setConc1] = useState(20);
  const [mass2, setMass2] = useState(6);
  const [conc2, setConc2] = useState(50);

  // Work state: two taps filling a pool
  const [hours1, setHours1] = useState(3);
  const [hours2, setHours2] = useState(6);

  // Gemini Custom Inline SVG Fallback
  const [diagramPrompt, setDiagramPrompt] = useState('');
  const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);
  const [diagramCaption, setDiagramCaption] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [wakeupStatus, setWakeupStatus] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const handleGenerateDiagram = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = diagramPrompt.trim() || `${topicTitle} bo'yicha vizual sxema`;
    setIsGenerating(true);
    setGenError(null);
    try {
      const data = await postJsonWithWakeupRetry<{
        svg?: string;
        caption?: string;
      }>(
        '/api/gemini/generate-diagram',
        { prompt, topicTitle },
        {
          onStatusChange: (status) => setWakeupStatus(status),
        }
      );
      const cleanSvg = sanitizeInlineSvg(data.svg || '');
      if (!cleanSvg) {
        throw new Error('Toza SVG diagramma olinmadi. Qayta urinib ko‘ring.');
      }
      setGeneratedSvg(cleanSvg);
      setDiagramCaption(data.caption || '');
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Xatolik yuz berdi.');
    } finally {
      setWakeupStatus(null);
      setIsGenerating(false);
    }
  };

  // Motion calculations
  const meetTime = totalDist / (v1 + v2);
  const pos1 = Math.min(totalDist, v1 * timeT);
  const pos2 = Math.max(0, totalDist - v2 * timeT);
  const distBetween = Math.max(0, pos2 - pos1);

  // Mixture calculations
  const totalMass = mass1 + mass2;
  const pureSubstance = (mass1 * conc1 + mass2 * conc2) / 100;
  const finalConc = (pureSubstance / totalMass) * 100;

  // Work calculations
  const rate1 = 1 / hours1;
  const rate2 = 1 / hours2;
  const combinedHours = 1 / (rate1 + rate2);

  return (
    <div
      data-testid="word-problem-simulator"
      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
    >
      {/* Toolbar */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/80">
        <div
          className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800"
          role="tablist"
          aria-label="Matnli masala modellari"
        >
          {(
            [
              { id: 'motion', label: 'Harakat (S = v · t)' },
              { id: 'mixture', label: 'Aralashma (%)' },
              { id: 'work', label: 'Birgalikda ish' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={mode === tab.id && !generatedSvg}
              onClick={() => {
                setMode(tab.id);
                setGeneratedSvg(null);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                mode === tab.id && !generatedSvg
                  ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {generatedSvg && (
          <button
            type="button"
            onClick={() => setGeneratedSvg(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Standart simulyatorga qaytish
          </button>
        )}
      </div>

      {/* Main Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Visual SVG Stage */}
        <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col justify-center">
          {generatedSvg ? (
            <div className="space-y-3">
              <div
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-center [&>svg]:w-full [&>svg]:max-h-[300px] [&>svg]:h-auto"
                dangerouslySetInnerHTML={{ __html: generatedSvg }}
              />
              {diagramCaption && (
                <p className="text-xs text-slate-600 dark:text-slate-400">{diagramCaption}</p>
              )}
            </div>
          ) : mode === 'motion' ? (
            <svg viewBox="0 0 520 190" className="w-full h-auto" role="img" aria-label="Harakat masalasi vizual sxemasi">
              {/* Road */}
              <line x1="36" y1="112" x2="484" y2="112" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="8" strokeLinecap="round" />
              <line x1="36" y1="112" x2="484" y2="112" className="stroke-white dark:stroke-slate-900" strokeWidth="1.5" strokeDasharray="8 8" />

              {/* Distance traveled bars */}
              <line
                x1="36"
                y1="142"
                x2={36 + (pos1 / totalDist) * 448}
                y2="142"
                className="stroke-indigo-600 dark:stroke-indigo-400"
                strokeWidth="4"
              />
              <line
                x1={36 + (pos2 / totalDist) * 448}
                y1="142"
                x2="484"
                y2="142"
                className="stroke-emerald-600 dark:stroke-emerald-400"
                strokeWidth="4"
              />

              {/* Car 1 */}
              <g transform={`translate(${36 + (pos1 / totalDist) * 448 - 18}, 76)`}>
                <rect width="36" height="22" rx="6" className="fill-indigo-600 dark:fill-indigo-500" />
                <text x="18" y="15" textAnchor="middle" className="fill-white text-[10px] font-mono font-bold">
                  A→
                </text>
              </g>

              {/* Car 2 */}
              <g transform={`translate(${36 + (pos2 / totalDist) * 448 - 18}, 76)`}>
                <rect width="36" height="22" rx="6" className="fill-emerald-600 dark:fill-emerald-500" />
                <text x="18" y="15" textAnchor="middle" className="fill-white text-[10px] font-mono font-bold">
                  ←B
                </text>
              </g>

              <text x="36" y="42" className="fill-indigo-700 dark:fill-indigo-300 text-[11px] font-mono font-semibold">
                A shahar (v₁ = {v1} km/s)
              </text>
              <text x="484" y="42" textAnchor="end" className="fill-emerald-700 dark:fill-emerald-400 text-[11px] font-mono font-semibold">
                B shahar (v₂ = {v2} km/s)
              </text>
              <text x="260" y="172" textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[12px] font-mono font-semibold">
                Jami masofa: {totalDist} km · Qolgan masofa: {distBetween.toFixed(0)} km
              </text>
            </svg>
          ) : mode === 'mixture' ? (
            <svg viewBox="0 0 520 210" className="w-full h-auto" role="img" aria-label="Aralashma konsentratsiyasi modeli">
              {[
                { x: 40, label: '1-idish', mass: mass1, conc: conc1, color: 'fill-indigo-500/80' },
                { x: 195, label: '2-idish', mass: mass2, conc: conc2, color: 'fill-sky-500/80' },
                { x: 375, label: 'Yangi aralashma', mass: totalMass, conc: finalConc, color: 'fill-emerald-500/80' },
              ].map((tank, idx) => {
                const fillH = Math.min(100, (tank.mass / 16) * 100);
                const pureH = (fillH * tank.conc) / 100;
                return (
                  <g key={idx}>
                    <rect x={tank.x} y="55" width="96" height="106" rx="8" fill="none" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="2.5" />
                    <rect x={tank.x + 2} y={159 - fillH} width="92" height={fillH} rx="5" className="fill-slate-200 dark:fill-slate-800" />
                    <rect x={tank.x + 2} y={159 - pureH} width="92" height={pureH} rx="5" className={tank.color} />
                    <text x={tank.x + 48} y="42" textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[12px] font-semibold">
                      {tank.label}
                    </text>
                    <text x={tank.x + 48} y="182" textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[11px] font-mono font-semibold">
                      {tank.mass} kg · {tank.conc.toFixed(1)}%
                    </text>
                  </g>
                );
              })}
              <text x="165" y="114" textAnchor="middle" className="fill-slate-500 text-[22px] font-bold">+</text>
              <text x="334" y="114" textAnchor="middle" className="fill-slate-500 text-[22px] font-bold">=</text>
            </svg>
          ) : (
            <svg viewBox="0 0 520 195" className="w-full h-auto" role="img" aria-label="Birgalikda ishlash modeli">
              {/* Tap 1 bar */}
              <text x="30" y="34" className="fill-indigo-700 dark:fill-indigo-300 text-[12px] font-semibold">
                1-kran: 1 soatda hovuzning 1/{hours1} qismini to‘ldiradi
              </text>
              <rect x="30" y="44" width="460" height="22" rx="6" className="fill-slate-100 dark:fill-slate-800" />
              <rect x="30" y="44" width={460 * rate1} height="22" rx="6" className="fill-indigo-600 dark:fill-indigo-500" />

              {/* Tap 2 bar */}
              <text x="30" y="96" className="fill-emerald-700 dark:fill-emerald-400 text-[12px] font-semibold">
                2-kran: 1 soatda hovuzning 1/{hours2} qismini to‘ldiradi
              </text>
              <rect x="30" y="106" width="460" height="22" rx="6" className="fill-slate-100 dark:fill-slate-800" />
              <rect x="30" y="106" width={460 * rate2} height="22" rx="6" className="fill-emerald-600 dark:fill-emerald-500" />

              {/* Combined 1 hour */}
              <text x="30" y="156" className="fill-slate-800 dark:fill-slate-100 text-[12px] font-bold">
                Ikkalasi birga: to‘liq hovuz {combinedHours.toFixed(2).replace('.', ',')} soatda to‘ladi!
              </text>
              <rect x="30" y="164" width="460" height="20" rx="6" className="fill-slate-100 dark:fill-slate-800" />
              <rect x="30" y="164" width={Math.min(460, 460 * rate1)} height="20" rx="4" className="fill-indigo-600 dark:fill-indigo-500" />
              <rect x={30 + Math.min(460, 460 * rate1)} y="164" width={Math.min(460 - 460 * rate1, 460 * rate2)} height="20" rx="4" className="fill-emerald-600 dark:fill-emerald-500" />
            </svg>
          )}
        </div>

        {/* Right Controls + Gemini Inline SVG Generator */}
        <div className="lg:col-span-5 p-6 space-y-5 bg-slate-50/40 dark:bg-slate-950/30">
          {mode === 'motion' && !generatedSvg && (
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="wp-v1">1-mashina tezligi</label>
                  <span className="font-mono font-semibold">{v1} km/soat</span>
                </div>
                <input id="wp-v1" type="range" min={20} max={100} step={10} value={v1} onChange={(e) => setV1(Number(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="wp-v2">2-mashina tezligi</label>
                  <span className="font-mono font-semibold">{v2} km/soat</span>
                </div>
                <input id="wp-v2" type="range" min={20} max={100} step={10} value={v2} onChange={(e) => setV2(Number(e.target.value))} className="w-full accent-emerald-600 cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="wp-t">O‘tgan vaqt (t)</label>
                  <span className="font-mono font-semibold">{timeT.toFixed(1).replace('.', ',')} soat</span>
                </div>
                <input id="wp-t" type="range" min={0} max={4} step={0.25} value={timeT} onChange={(e) => setTimeT(Number(e.target.value))} className="w-full accent-amber-500 cursor-pointer" />
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Ular har soatda {v1 + v2} km ga yaqinlashadi va aynan {meetTime.toFixed(2).replace('.', ',')} soatda uchrashadi.
              </p>
            </div>
          )}

          {mode === 'mixture' && !generatedSvg && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="wp-m1" className="text-xs block mb-1">1-idish: {mass1} kg</label>
                  <input id="wp-m1" type="range" min={1} max={8} value={mass1} onChange={(e) => setMass1(Number(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
                </div>
                <div>
                  <label htmlFor="wp-c1" className="text-xs block mb-1">Foiz: {conc1}%</label>
                  <input id="wp-c1" type="range" min={10} max={80} step={5} value={conc1} onChange={(e) => setConc1(Number(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
                </div>
                <div>
                  <label htmlFor="wp-m2" className="text-xs block mb-1">2-idish: {mass2} kg</label>
                  <input id="wp-m2" type="range" min={1} max={8} value={mass2} onChange={(e) => setMass2(Number(e.target.value))} className="w-full accent-sky-600 cursor-pointer" />
                </div>
                <div>
                  <label htmlFor="wp-c2" className="text-xs block mb-1">Foiz: {conc2}%</label>
                  <input id="wp-c2" type="range" min={10} max={80} step={5} value={conc2} onChange={(e) => setConc2(Number(e.target.value))} className="w-full accent-sky-600 cursor-pointer" />
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Sof modda jami {pureSubstance.toFixed(2).replace('.', ',')} kg, umumiy massa {totalMass} kg → yakuniy konsentratsiya {finalConc.toFixed(1).replace('.', ',')}%.
              </p>
            </div>
          )}

          {mode === 'work' && !generatedSvg && (
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="wp-h1">1-kran yolg‘iz to‘ldirish vaqti</label>
                  <span className="font-mono font-semibold">{hours1} soat</span>
                </div>
                <input id="wp-h1" type="range" min={2} max={12} value={hours1} onChange={(e) => setHours1(Number(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="wp-h2">2-kran yolg‘iz to‘ldirish vaqti</label>
                  <span className="font-mono font-semibold">{hours2} soat</span>
                </div>
                <input id="wp-h2" type="range" min={2} max={12} value={hours2} onChange={(e) => setHours2(Number(e.target.value))} className="w-full accent-emerald-600 cursor-pointer" />
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Vaqtlar qo‘shilmaydi — 1 soatlik unumdorliklar qo‘shiladi!
              </p>
            </div>
          )}

          {/* Gemini Inline SVG Diagram Fallback Generator */}
          <form
            onSubmit={handleGenerateDiagram}
            className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5"
          >
            <label
              htmlFor="gemini-svg-prompt"
              className="block text-xs font-semibold text-indigo-700 dark:text-indigo-300"
            >
              Gemini bilan maxsus SVG diagramma (ixtiyoriy masala)
            </label>
            <input
              id="gemini-svg-prompt"
              type="text"
              value={diagramPrompt}
              onChange={(e) => setDiagramPrompt(e.target.value)}
              placeholder="Masalan: Oqim bo'ylab va oqimga qarshi qayiq sxemasi..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white transition-colors cursor-pointer"
            >
              {isGenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              {isGenerating
                ? wakeupStatus || 'SVG sxema chizilmoqda...'
                : 'AI bilan diagramma yaratish'}
            </button>

            {wakeupStatus && (
              <div
                role="status"
                aria-live="polite"
                className="p-2.5 rounded-lg border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
                <span>{wakeupStatus}</span>
              </div>
            )}

            {genError && (
              <div
                role="alert"
                className="p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2"
              >
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{genError}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
