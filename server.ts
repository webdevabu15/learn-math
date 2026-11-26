import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { sanitizeInlineSvg } from './src/utils/svgSanitizer.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODEL_NAME = 'gemini-2.5-flash';

function isTransientUnavailableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes('503') || msg.includes('UNAVAILABLE');
}

async function generateWithTransientRetry(
  ai: GoogleGenAI,
  request: Omit<Parameters<GoogleGenAI['models']['generateContent']>[0], 'model'>
) {
  try {
    return await ai.models.generateContent({ model: MODEL_NAME, ...request });
  } catch (firstErr) {
    if (!isTransientUnavailableError(firstErr)) throw firstErr;
    await new Promise((r) => setTimeout(r, 900));
    return await ai.models.generateContent({ model: MODEL_NAME, ...request });
  }
}

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function extractReadableApiError(err: unknown): { status?: number; detail: string } {
  const raw = err instanceof Error ? err.message : String(err);
  let status: number | undefined;
  let detail = raw;

  // Try extracting structured JSON error payload embedded in @google/genai Error.message
  const jsonStart = raw.indexOf('{');
  if (jsonStart !== -1) {
    try {
      const parsed = JSON.parse(raw.slice(jsonStart)) as {
        error?: { code?: number; status?: string; message?: string };
      };
      if (parsed?.error) {
        if (typeof parsed.error.code === 'number') {
          status = parsed.error.code;
        }
        const statusTag = parsed.error.status ? `${parsed.error.status}: ` : '';
        if (typeof parsed.error.message === 'string' && parsed.error.message.trim()) {
          detail = `${statusTag}${parsed.error.message.trim()}`;
        }
      }
    } catch {
      // Keep raw message if embedded JSON is partial
    }
  }

  // Strip any accidental key-like tokens before sending to client
  const sanitized = detail
    .replace(/AIza[0-9A-Za-z\-_]{20,}/g, '[REDACTED_KEY]')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 280);

  return { status, detail: sanitized || "Noma'lum server xatoligi" };
}

function getErrorMessage(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  console.error('[Usmonov Math Lab Gemini Error]:', raw);
  const { status: parsedStatus, detail } = extractReadableApiError(err);

  if (
    parsedStatus === 403 ||
    raw.includes('API_KEY_INVALID') ||
    raw.includes('PERMISSION_DENIED') ||
    raw.includes('403')
  ) {
    return {
      status: 403,
      message: `Gemini API kaliti tasdiqlanmadi (403). Sozlamalar > Secrets bo'limini tekshiring. (${detail})`,
    };
  }
  if (parsedStatus === 429 || raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429')) {
    return {
      status: 429,
      message:
        "So'rovlar kvotasi vaqtincha tugadi (HTTP 429 · RESOURCE_EXHAUSTED). Iltimos, 60 soniya kutib qayta urinib ko'ring. Agar kunlik bepul limit to'liq tugagan bo'lsa, keshlangan sahifalar yoki avval generatsiya qilingan misollar bilan mashq qilishda davom etishingiz mumkin.",
    };
  }
  if (parsedStatus === 404 || raw.includes('NOT_FOUND') || raw.includes('404')) {
    return {
      status: 404,
      message: `Tanlangan AI modeli topilmadi (404): ${detail}`,
    };
  }
  if (parsedStatus === 400 || raw.includes('INVALID_ARGUMENT')) {
    return {
      status: 400,
      message: `So'rov ma'lumotlari qabul qilinmadi (400): ${detail}`,
    };
  }
  if (parsedStatus === 503 || raw.includes('UNAVAILABLE')) {
    return {
      status: 503,
      message: `Gemini xizmati vaqtincha band (503): ${detail}`,
    };
  }
  if (parsedStatus === 504 || raw.includes('DEADLINE_EXCEEDED') || raw.includes('timeout')) {
    return {
      status: 504,
      message: `AI javob kutish vaqti tugadi (504). Kamroq sahifa tanlab qayta urinib ko'ring. (${detail})`,
    };
  }

  const httpStatus =
    typeof parsedStatus === 'number' && parsedStatus >= 400 && parsedStatus < 600
      ? parsedStatus
      : 500;
  return {
    status: httpStatus,
    message: `Gemini API xatoligi (${httpStatus}): ${detail}`,
  };
}

function safeParseJson<T>(rawText: string | undefined, fallback: T): T {
  const cleaned = (rawText ?? '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  if (!cleaned) return fallback;
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as T;
    }
    throw new Error(`AI javobi noto'g'ri JSON formatda qaytdi: ${cleaned.slice(0, 120)}`);
  }
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // 1. Generate 5 structured Usmonov-rigor problems for a topic & difficulty
  app.post('/api/gemini/generate-problems', async (req, res) => {
    const ai = getAiClient();
    if (!ai) {
      res.status(503).json({
        error: "Gemini API kaliti sozlanmagan. Sozlamalar > Secrets bo'limidan GEMINI_API_KEY ni tekshiring.",
      });
      return;
    }

    const { topicId, topicTitle, difficulty } = req.body as {
      topicId?: number;
      topicTitle?: string;
      difficulty?: 'orta' | 'murakkab';
    };

    if (!topicTitle || !difficulty) {
      res.status(400).json({ error: 'Mavzu nomi va qiyinlik darajasi kerak.' });
      return;
    }

    const diffLabel =
      difficulty === 'murakkab'
        ? "Murakkab (M. Usmonov to'plamidagi ko'p bosqichli, diqqat talab qiladigan, olimpiada va DTM darajasidagi misollar)"
        : "O'rta (M. Usmonov to'plamidagi asosiy mustahkamlovchi, 2-3 bosqichli aniq hisoblash va shakl almashtirish misollari)";

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Mavzu: "${topicId}. ${topicTitle}". Qiyinlik darajasi: ${diffLabel}.
Ushbu mavzu bo'yicha aynan 5 ta yangi, original va matematik jihatdan 100% to'g'ri misol tuzing.`,
        config: {
          systemInstruction: `Sen O'zbekistonning eng kuchli matematika ustozi va M. Usmonov darsliklari bo'yicha mutaxassissan.
Qoidalar:
1. Barcha matn 100% tabiiy o'zbek tilida (lotin alifbosida) bo'lsin.
2. Barcha matematik ifodalarni faqat $...$ (satr ichida) yoki $$...$$ (alohida satr) ko'rinishida toza LaTeX da yoz.
3. Har bir misolning javobini o'zing avval qat'iy hisoblab tekshir — xato javob bo'lishi mumkin emas!
4. "answer" maydoniga eng sodda ko'rinishdagi aniq javobni yoz (masalan: "3/4", "-2", "a^2 - 9", "2x + 5").
5. "acceptedEquivalents" ga muqobil to'g'ri ko'rinishlarni yoz (masalan: ["0.75", "0,75"]).
6. "socraticHint" da tayyor javobni aytmasdan, o'quvchini to'g'ri yo'lga soladigan yo'naltiruvchi savol/ishora yoz.
7. "steps" da 3-5 qadamdan iborat aniq bosqichma-bosqich yechimni LaTeX bilan yoz.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                statement: { type: Type.STRING },
                answer: { type: Type.STRING },
                acceptedEquivalents: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                socraticHint: { type: Type.STRING },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['statement', 'answer', 'acceptedEquivalents', 'socraticHint', 'steps'],
            },
          },
        },
      });

      const raw = (response.text ?? '[]').trim();
      const parsed = JSON.parse(raw) as Array<{
        statement: string;
        answer: string;
        acceptedEquivalents?: string[];
        socraticHint: string;
        steps: string[];
      }>;

      const timestamp = Date.now();
      const problems = parsed.slice(0, 5).map((item, idx) => ({
        id: `ai-${topicId}-${difficulty}-${timestamp}-${idx}`,
        difficulty,
        statement: item.statement,
        answer: item.answer,
        acceptedEquivalents: item.acceptedEquivalents ?? [],
        socraticHint: item.socraticHint,
        steps: item.steps,
        sourceLabel: 'Usmonov uslubi · Yangi generatsiya',
      }));

      res.json({ problems });
    } catch (err) {
      const { status, message } = getErrorMessage(err);
      res.status(status).json({ error: message });
    }
  });

  // 2. Check mathematical equivalence & generate personalized Socratic hint
  app.post('/api/gemini/check-answer', async (req, res) => {
    const ai = getAiClient();
    if (!ai) {
      res.status(503).json({
        error: "Gemini API kaliti sozlanmagan. Sozlamalar > Secrets bo'limini tekshiring.",
      });
      return;
    }

    const { problemStatement, expectedAnswer, userAnswer, topicTitle } = req.body as {
      problemStatement?: string;
      expectedAnswer?: string;
      userAnswer?: string;
      topicTitle?: string;
    };

    if (!problemStatement || !expectedAnswer || !userAnswer) {
      res.status(400).json({ error: 'Tekshirish uchun misol va javob kiritilishi shart.' });
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Mavzu: ${topicTitle ?? 'Matematika'}
Misol: ${problemStatement}
To'g'ri javob: ${expectedAnswer}
O'quvchining javobi: ${userAnswer}

O'quvchining javobi matematik jihatdan to'g'ri javobga ekvivalentmi (masalan: 1/2 = 0.5 = 0,5 = 2/4, yoki 2x+4 = 4+2x)?`,
        config: {
          systemInstruction: `Sen o'zbek tilidagi matematika mentorisan.
1. Javoblarning matematik tengligini aniq tekshir (o'zbekcha vergulli o'nli kasr 0,5 ni 0.5 va 1/2 bilan teng deb hisobla; qisqartirilmagan kasrlar, ekvivalent algebraik ifodalar, "x = ..." ko'rinishidagi javoblar ham teng hisoblanadi).
2. Agar to'g'ri bo'lsa: isCorrect = true, feedback da qisqa va samimiy tabrik hamda nega to'g'ri ekanini bir jumlada yoz.
3. Agar noto'g'ri bo'lsa: isCorrect = false, socraticHint da HECH QACHON yakuniy to'g'ri javobni oshkor qilma! O'quvchining aynan qayerda adashgan bo'lishi mumkinligini tahlil qilib, Sokrat uslubida yo'naltiruvchi ishora ber.
4. Barcha matn 100% tabiiy o'zbek tilida (lotin yozuvida) va matematik belgilar faqat $...$ ichida bo'lsin.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isCorrect: { type: Type.BOOLEAN },
              feedback: { type: Type.STRING },
              socraticHint: { type: Type.STRING },
            },
            required: ['isCorrect', 'feedback', 'socraticHint'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim()) as {
        isCorrect: boolean;
        feedback: string;
        socraticHint?: string;
      };

      res.json(parsed);
    } catch (err) {
      const { status, message } = getErrorMessage(err);
      res.status(status).json({ error: message });
    }
  });

  // 3. Solve a custom textbook problem (text or image upload)
  app.post('/api/gemini/solve-custom', async (req, res) => {
    const ai = getAiClient();
    if (!ai) {
      res.status(503).json({
        error: "Gemini API kaliti sozlanmagan. Sozlamalar > Secrets bo'limini tekshiring.",
      });
      return;
    }

    const { text, imageBase64, imageMimeType, topicTitle } = req.body as {
      text?: string;
      imageBase64?: string;
      imageMimeType?: string;
      topicTitle?: string;
    };

    if (!text?.trim() && !imageBase64) {
      res.status(400).json({ error: 'Misol matnini yozing yoki rasm yuklang.' });
      return;
    }

    try {
      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

      if (imageBase64) {
        parts.push({
          inlineData: {
            mimeType: imageMimeType || 'image/jpeg',
            data: imageBase64,
          },
        });
      }

      parts.push({
        text: `Mavzu konteksti: ${topicTitle ?? 'Matematika'}.
${text?.trim() ? `O'quvchi kiritgan misol: ${text.trim()}` : "Rasmda ko'rsatilgan matematika misolini aniq o'qi va yech."}
Misolni toza LaTeX ko'rinishida yoz, Sokratcha ishora (javobni ochmasdan), bosqichma-bosqich to'liq yechim va yakuniy javobni ber.`,
      });

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: { parts },
        config: {
          systemInstruction: `Sen M. Usmonov matematika to'plamini mukammal biladigan ustozsan.
1. Barcha tushuntirishlar 100% tabiiy o'zbek tilida (lotin alifbosida) bo'lsin.
2. Matematik ifodalar faqat $...$ yoki $$...$$ ichida toza LaTeX da yozilsin.
3. "recognizedProblem" maydoniga misol shartini aniq va chiroyli yoz.
4. "socraticHint" da javobni aytmasdan birinchi qadamga yo'naltir.
5. "steps" da har bir qadamni tushunarli izoh va formula bilan ketma-ket yoz.
6. "finalAnswer" da eng sodda yakuniy javobni yoz (masalan "$\\frac{5}{6}$" yoki "$x = 4$").
7. "conceptNote" da ushbu misol qaysi asosiy matematik qoidaga tayanishini 1-2 jumlada tushuntir.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recognizedProblem: { type: Type.STRING },
              finalAnswer: { type: Type.STRING },
              socraticHint: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              conceptNote: { type: Type.STRING },
            },
            required: ['recognizedProblem', 'finalAnswer', 'socraticHint', 'steps', 'conceptNote'],
          },
        },
      });

      const result = JSON.parse((response.text ?? '{}').trim());
      res.json({ result });
    } catch (err) {
      const { status, message } = getErrorMessage(err);
      res.status(status).json({ error: message });
    }
  });

  // 4. Generate/enrich First-Principles lesson for a topic (cached on client in localStorage)
  app.post('/api/gemini/generate-lesson', async (req, res) => {
    const ai = getAiClient();
    if (!ai) {
      res.status(503).json({
        error: "Gemini API kaliti sozlanmagan. Sozlamalar > Secrets bo'limini tekshiring.",
      });
      return;
    }

    const { topicId, topicTitle } = req.body as { topicId?: number; topicTitle?: string };
    if (!topicId || !topicTitle) {
      res.status(400).json({ error: 'Mavzu ma’lumotlari to‘liq emas.' });
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Mavzu: "${topicId}. ${topicTitle}".
First-Principles (Birinchi tamoyillar) metodikasi bo'yicha chuqur, qiziqarli va tushunarli o'zbekcha dars materiallarini yarat.`,
        config: {
          systemInstruction: `Sen First-Principles metodikasi bo'yicha matematika muallifisan.
100% tabiiy o'zbek tilida (lotin yozuvi) yoz.
- "muammo": hayotiy yoki tarixiy muammo (formulalarsiz, inson nega bu tushunchani o'ylab topishga majbur bo'lgan?).
- "chegara": oldingi matematika qayerda ishlamay qolgani.
- "intuisiya": formulalarsiz hayotiy o'xshatish va o'quvchi sinab ko'rishi uchun 3 ta savol.
- "formula": endi formal belgilar va asosiy xossalar (barcha formulalar toza LaTeX da, masalan \\frac{a}{b} - dollar belgisiz "latex" maydonida, matnli maydonlarda esa $...$ ichida).`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              muammo: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  contextLabel: { type: Type.STRING },
                  story: { type: Type.ARRAY, items: { type: Type.STRING } },
                  coreQuestion: { type: Type.STRING },
                  historicalNote: { type: Type.STRING },
                },
                required: ['headline', 'contextLabel', 'story', 'coreQuestion', 'historicalNote'],
              },
              chegara: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  whatWorkedBefore: { type: Type.STRING },
                  breakingPoint: { type: Type.STRING },
                  deadEndExample: { type: Type.STRING },
                  whyNewIdeaNeeded: { type: Type.STRING },
                },
                required: ['headline', 'whatWorkedBefore', 'breakingPoint', 'deadEndExample', 'whyNewIdeaNeeded'],
              },
              intuisiya: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  analogyTitle: { type: Type.STRING },
                  analogyStory: { type: Type.STRING },
                  guidedPrompts: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['headline', 'analogyTitle', 'analogyStory', 'guidedPrompts'],
              },
              formula: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  bridgeFromIntuition: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        latex: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        example: { type: Type.STRING },
                      },
                      required: ['title', 'latex', 'explanation'],
                    },
                  },
                  keyPitfall: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      wrong: { type: Type.STRING },
                      right: { type: Type.STRING },
                      reason: { type: Type.STRING },
                    },
                    required: ['title', 'wrong', 'right', 'reason'],
                  },
                },
                required: ['headline', 'bridgeFromIntuition', 'items', 'keyPitfall'],
              },
            },
            required: ['muammo', 'chegara', 'intuisiya', 'formula'],
          },
        },
      });

      const lessonPatch = JSON.parse((response.text ?? '{}').trim());
      res.json({ lessonPatch });
    } catch (err) {
      const { status, message } = getErrorMessage(err);
      res.status(status).json({ error: message });
    }
  });

  // 5. Floating "Mentordan so'rash" context-aware AI mentor chat
  app.post('/api/gemini/mentor', async (req, res) => {
    const ai = getAiClient();
    if (!ai) {
      res.status(503).json({
        error: "Gemini API kaliti sozlanmagan. Sozlamalar > Secrets bo'limini tekshiring.",
      });
      return;
    }

    const { messages, topicTitle, activeTab, activeProblem } = req.body as {
      messages?: Array<{ role: 'user' | 'mentor'; content: string }>;
      topicTitle?: string;
      activeTab?: string;
      activeProblem?: string | null;
    };

    if (!messages || messages.length === 0) {
      res.status(400).json({ error: 'Savol yozing.' });
      return;
    }

    const historyText = messages
      .slice(-8)
      .map((m) => `${m.role === 'user' ? "O'quvchi" : 'Mentor'}: ${m.content}`)
      .join('\n\n');

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Joriy kontekst:
- Mavzu: ${topicTitle ?? 'Matematika'}
- Hozirgi bosqich: ${activeTab ?? 'Muammo'}
${activeProblem ? `- Faol misol: ${activeProblem}` : '- Hozir nazariya/intuisiya bosqichida'}

Suhbat tarixi:
${historyText}

Mentor sifatida keyingi javobni yoz.`,
        config: {
          systemInstruction: `Sen "Usmonov Math Lab" ning First-Principles matematika mentorisan.
Qoidalar:
1. 100% tabiiy, ravon va samimiy o'zbek tilida (lotin yozuvi) javob ber.
2. Javoblar ixcham, aniq va tushunarli bo'lsin (ortiqcha cho'zma, 3-6 qator atrofida, kerak bo'lsa bosqichli).
3. Agar o'quvchi "Virtual Intuisiya" bosqichida bo'lsa, iloji boricha quruq formuladan ko'ra ko'z oldiga keltirish va hayotiy o'xshatish orqali tushuntir.
4. Agar o'quvchi faol misol haqida so'rasa va to'g'ridan-to'g'ri yechimni talab qilmasa, avval Sokrat usulida yo'naltiruvchi ishora ber; agar to'liq tushuntirish so'rasa, chiroyli bosqichma-bosqich tushuntir.
5. Barcha matematik ifodalarni toza LaTeX da $...$ yoki $$...$$ bilan yoz.`,
        },
      });

      res.json({ reply: response.text ?? "Kechirasiz, javob tayyorlab bo'lmadi. Qayta urinib ko'ring." });
    } catch (err) {
      const { status, message } = getErrorMessage(err);
      res.status(status).json({ error: message });
    }
  });

  // 6. Generate clean sanitized inline SVG diagram for word problems (motion, mixtures, work)
  app.post('/api/gemini/generate-diagram', async (req, res) => {
    const ai = getAiClient();
    if (!ai) {
      res.status(503).json({
        error: "Gemini API kaliti sozlanmagan. Sozlamalar > Secrets bo'limini tekshiring.",
      });
      return;
    }

    const { prompt, topicTitle } = req.body as {
      prompt?: string;
      topicTitle?: string;
    };

    const cleanPrompt = typeof prompt === 'string' ? prompt.trim() : '';
    if (!cleanPrompt || cleanPrompt.length > 500) {
      res.status(400).json({
        error: "Masala tavsifi 1 dan 500 belgigacha bo'lishi kerak.",
      });
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Mavzu: ${typeof topicTitle === 'string' ? topicTitle.slice(0, 120) : 'Matnli masala'}
Masala sharti: ${cleanPrompt}

Ushbu masala uchun toza, minimalistik, aniq o'zbekcha (lotin alifbosi) yozuvli o'quv SVG sxemasi yarat.`,
        config: {
          systemInstruction: `Sen o'zbek tilidagi matematika vizual diagramma muhandisisan.
Qoidalar:
1. "svg" maydonida faqat yagona toza <svg viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg">...</svg> qaytargin.
2. Faqat xavfsiz vektor elementlardan foydalan: <g>, <rect>, <circle>, <ellipse>, <line>, <polyline>, <polygon>, <path>, <text>, <tspan>, <defs>, <marker>.
3. HECH QACHON <script>, <style>, <foreignObject>, tashqi havola yoki on* atributlarini ishlatma.
4. Ranglar ham yorug', ham qorong'i fonlarda aniq o'qilsin: asosiy chiziqlar #4f46e5 (indigo), yordamchi chiziqlar #0ea5e9 va #10b981, matnlar #475569 yoki #64748b, fon shaffof (fill="none").
5. Barcha yozuvlar qisqa, tushunarli o'zbek tilida (lotin yozuvi) bo'lsin, matnlar ustma-ust tushmasin.
6. "caption" maydoniga 1 jumlali o'zbekcha izoh yoz.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              svg: { type: Type.STRING },
              caption: { type: Type.STRING },
            },
            required: ['svg', 'caption'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim()) as {
        svg?: string;
        caption?: string;
      };
      const safeSvg = sanitizeInlineSvg(parsed.svg ?? '');
      if (!safeSvg) {
        res.status(422).json({
          error: "Xavfsiz SVG diagramma yaratib bo'lmadi. Masala matnini qisqaroq yozib qayta urinib ko'ring.",
        });
        return;
      }

      res.json({
        svg: safeSvg,
        caption: typeof parsed.caption === 'string' ? parsed.caption.slice(0, 240) : '',
      });
    } catch (err) {
      const { status, message } = getErrorMessage(err);
      res.status(status).json({ error: message });
    }
  });

  // 7. Extract exact Medium (O'rta) & Hard (Murakkab) textbook problems from 1-3 selected JPEG page renders
  app.post('/api/gemini/extract-pdf-pages', async (req, res) => {
    const ai = getAiClient();
    if (!ai) {
      res.status(503).json({
        error: "Gemini API kaliti sozlanmagan. Sozlamalar > Secrets bo'limini tekshiring.",
      });
      return;
    }

    const { topicId, topicTitle, pages } = req.body as {
      topicId?: number;
      topicTitle?: string;
      pages?: Array<{
        bookPage?: number;
        pdfPage?: number;
        imageBase64?: string;
      }>;
    };

    if (!Array.isArray(pages) || pages.length === 0 || pages.length > 3) {
      res.status(400).json({
        error: "Kamida 1 ta va ko'pi bilan 3 ta kitob sahifasini tanlang.",
      });
      return;
    }

    const BASE64_RE = /^[A-Za-z0-9+/=]+$/;
    const MAX_PAGE_BASE64_CHARS = 4_500_000;
    const validatedPages: Array<{ bookPage: number; pdfPage: number; imageBase64: string }> = [];

    for (const item of pages) {
      const bookPage = Number(item?.bookPage);
      const pdfPage = Number(item?.pdfPage);
      const rawBase64 = typeof item?.imageBase64 === 'string' ? item.imageBase64.replace(/\s+/g, '') : '';

      if (
        !Number.isInteger(bookPage) ||
        bookPage < 1 ||
        bookPage > 5000 ||
        !Number.isInteger(pdfPage) ||
        pdfPage < 1 ||
        pdfPage > 5000
      ) {
        res.status(400).json({ error: "Sahifa raqamlari noto'g'ri ko'rsatilgan." });
        return;
      }

      if (!rawBase64 || rawBase64.length > MAX_PAGE_BASE64_CHARS || !BASE64_RE.test(rawBase64)) {
        res.status(400).json({
          error: "Yuborilgan sahifa rasmi yaroqsiz yoki hajmi juda katta.",
        });
        return;
      }

      validatedPages.push({ bookPage, pdfPage, imageBase64: rawBase64 });
    }

    const safeTopicTitle =
      typeof topicTitle === 'string' && topicTitle.trim()
        ? topicTitle.trim().slice(0, 200)
        : 'Matematika';
    const safeTopicId = Number.isInteger(Number(topicId)) ? Number(topicId) : 0;

    try {
      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

      for (const page of validatedPages) {
        parts.push({
          text: `Quyidagi rasm — M. Usmonov kitobining ${page.bookPage}-beti (PDF ${page.pdfPage}-sahifasi):`,
        });
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: page.imageBase64,
          },
        });
      }

      parts.push({
        text: `Mavzu: "${safeTopicTitle}".
Yuqoridagi kitob sahifa rasmlaridan AYNAN kitobda bosilgan eng yaxshi va aniq misollarni o'qib chiqing va ikki guruhga ajrating:
1) "orta" (O'rta darajadagi asosiy misollar — ko'pi bilan 5 ta)
2) "murakkab" (Murakkab, ko'p bosqichli yoki yulduzchali Usmonov misollari — ko'pi bilan 5 ta)

Har bir misolni aynan sahifadagi raqami va matematik sharti bilan oling, har birini o'zingiz qat'iy hisoblab tekshiring, to'g'ri yakuniy javob, ekvivalent ko'rinishlar, javobni ochmaydigan Sokratcha ishora va bosqichma-bosqich yechimini tuzing.`,
      });

      const problemItemSchema = {
        type: Type.OBJECT,
        properties: {
          problemNumber: { type: Type.STRING },
          bookPage: { type: Type.INTEGER },
          statement: { type: Type.STRING },
          answer: { type: Type.STRING },
          acceptedEquivalents: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          socraticHint: { type: Type.STRING },
          steps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          'problemNumber',
          'bookPage',
          'statement',
          'answer',
          'acceptedEquivalents',
          'socraticHint',
          'steps',
        ],
      };

      const response = await generateWithTransientRetry(ai, {
        contents: { parts },
        config: {
          systemInstruction: `Sen M. Usmonov matematika kitobi sahifalarini yuqori aniqlikda o'quvchi va tahlil qiluvchi ustozsan.
Qoidalar:
1. Barcha matn 100% tabiiy o'zbek tilida (lotin alifbosida) bo'lsin. Agar sahifa kirill yozuvida bo'lsa, matnni chiroyli o'zbek lotin alifbosiga o'gir.
2. Barcha matematik ifodalarni faqat $...$ (satr ichida) yoki $$...$$ (alohida satr) ko'rinishida toza LaTeX da yoz.
3. Sahifada haqiqatan bor misollarni aniq ko'chir — kasrlar, darajalar, ildizlar, qavslar va ishoralarni 100% aniq o'qi!
4. "problemNumber" maydoniga kitobdagi misol raqamini yoz (masalan: "№ 14", "3.21" yoki "12-misol").
5. "bookPage" maydoniga misol olingan kitob bet raqamini butun son ko'rinishida yoz.
6. "answer" maydoniga o'zing qat'iy hisoblab tekshirgan eng sodda yakuniy javobni yoz (masalan: "3/4", "-5", "2x - 1").
7. "acceptedEquivalents" ga muqobil to'g'ri yozuvlarni yoz (masalan: ["0.75", "0,75"]).
8. "socraticHint" da tayyor javobni oshkor qilmasdan, birinchi muhim qadamga yo'naltiruvchi savol/ishora yoz.
9. "steps" da 3-6 bosqichli aniq yechimni LaTeX bilan yoz.
10. Agar sahifada umuman matematika misoli ko'rinmasa, bo'sh massivlar qaytargin.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              orta: {
                type: Type.ARRAY,
                items: problemItemSchema,
              },
              murakkab: {
                type: Type.ARRAY,
                items: problemItemSchema,
              },
            },
            required: ['orta', 'murakkab'],
          },
        },
      });

      const parsed = safeParseJson<{
        orta?: Array<{
          problemNumber?: string;
          bookPage?: number;
          statement?: string;
          answer?: string;
          acceptedEquivalents?: string[];
          socraticHint?: string;
          steps?: string[];
        }>;
        murakkab?: Array<{
          problemNumber?: string;
          bookPage?: number;
          statement?: string;
          answer?: string;
          acceptedEquivalents?: string[];
          socraticHint?: string;
          steps?: string[];
        }>;
      }>(response.text, {});

      const timestamp = Date.now();
      const defaultBookPage = validatedPages[0].bookPage;

      const mapExtracted = (
        list: typeof parsed.orta,
        diff: 'orta' | 'murakkab'
      ) =>
        (Array.isArray(list) ? list : [])
          .filter(
            (item) =>
              typeof item?.statement === 'string' &&
              item.statement.trim().length > 0 &&
              typeof item?.answer === 'string' &&
              item.answer.trim().length > 0
          )
          .slice(0, 6)
          .map((item, idx) => {
            const pageNum =
              Number.isInteger(Number(item.bookPage)) && Number(item.bookPage) > 0
                ? Number(item.bookPage)
                : defaultBookPage;
            const numLabel =
              typeof item.problemNumber === 'string' && item.problemNumber.trim()
                ? item.problemNumber.trim().slice(0, 32)
                : '';
            return {
              id: `pdf-${safeTopicId}-${diff}-${pageNum}-${timestamp}-${idx}`,
              difficulty: diff,
              statement: item.statement!.trim(),
              answer: item.answer!.trim(),
              acceptedEquivalents: Array.isArray(item.acceptedEquivalents)
                ? item.acceptedEquivalents.filter((v): v is string => typeof v === 'string')
                : [],
              socraticHint:
                typeof item.socraticHint === 'string' && item.socraticHint.trim()
                  ? item.socraticHint.trim()
                  : "Avval ifodadagi asosiy amallar tartibini aniqlab oling.",
              steps: Array.isArray(item.steps)
                ? item.steps.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
                : [],
              sourceLabel: `Usmonov kitobi · ${pageNum}-bet${numLabel ? ` (${numLabel})` : ''}`,
              bookPage: pageNum,
            };
          });

      const orta = mapExtracted(parsed.orta, 'orta');
      const murakkab = mapExtracted(parsed.murakkab, 'murakkab');

      if (orta.length === 0 && murakkab.length === 0) {
        res.status(422).json({
          error:
            "Tanlangan sahifa(lar)dan aniq matematika misollarini ajratib bo'lmadi. Offset qiymatini yoki sahifa raqamini tekshiring.",
        });
        return;
      }

      res.json({
        orta,
        murakkab,
        extractedCount: orta.length + murakkab.length,
        bookPages: validatedPages.map((p) => p.bookPage),
      });
    } catch (err) {
      const { status, message } = getErrorMessage(err);
      res.status(status).json({ error: message });
    }
  });

  // JSON error handler for body-parser errors (e.g. 413 Payload Too Large or malformed JSON)
  app.use(
    (
      err: { status?: number; statusCode?: number; type?: string; message?: string },
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (!err || !req.path.startsWith('/api/')) {
        next(err);
        return;
      }
      const status = err.status ?? err.statusCode ?? 500;
      if (err.type === 'entity.too.large' || status === 413) {
        res.status(413).json({
          error:
            "HTTP 413 (Payload Too Large): Yuborilgan sahifa rasmlari hajmi 15 MB chegarasidan oshdi. Kamroq sahifa tanlab qayta urinib ko'ring.",
        });
        return;
      }
      res.status(status).json({
        error: `HTTP ${status}: ${err.message || "So'rovni qayta ishlashda xatolik yuz berdi."}`,
      });
    }
  );

  // Vite dev middleware or static production serving
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = Number(process.env.PORT || 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Usmonov Math Lab server listening on http://localhost:${port}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
