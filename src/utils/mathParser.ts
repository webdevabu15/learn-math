import katex from 'katex';

export interface MathSegment {
  type: 'text' | 'inline-math' | 'display-math';
  content: string;
}

/**
 * Normalizes common JSON/AI LaTeX glitches before tokenizing.
 */
export function normalizeLatexText(input: string): string {
  if (!input) return '';
  return input
    // Convert \[ ... \] to $$ ... $$
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, inner: string) => `$$${inner.trim()}$$`)
    // Convert \( ... \) to $ ... $
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, inner: string) => `$${inner.trim()}$`);
}

/**
 * Splits mixed prose + LaTeX string into text, inline-math, and display-math segments.
 * Handles escaped dollar signs (\$) safely.
 */
export function parseMathSegments(raw: string): MathSegment[] {
  const input = normalizeLatexText(raw);
  const segments: MathSegment[] = [];
  let i = 0;
  let textBuffer = '';

  const flushText = () => {
    if (textBuffer.length > 0) {
      segments.push({ type: 'text', content: textBuffer });
      textBuffer = '';
    }
  };

  while (i < input.length) {
    // Escaped dollar sign
    if (input[i] === '\\' && input[i + 1] === '$') {
      textBuffer += '$';
      i += 2;
      continue;
    }

    // Display math $$ ... $$
    if (input[i] === '$' && input[i + 1] === '$') {
      const end = input.indexOf('$$', i + 2);
      if (end !== -1) {
        flushText();
        const inner = input.slice(i + 2, end).trim();
        if (inner.length > 0) {
          segments.push({ type: 'display-math', content: inner });
        }
        i = end + 2;
        continue;
      }
    }

    // Inline math $ ... $
    if (input[i] === '$') {
      let end = i + 1;
      let found = -1;
      while (end < input.length) {
        if (input[end] === '\\' && input[end + 1] === '$') {
          end += 2;
          continue;
        }
        if (input[end] === '$') {
          found = end;
          break;
        }
        end++;
      }

      if (found !== -1) {
        const inner = input.slice(i + 1, found).trim();
        if (inner.length > 0) {
          flushText();
          segments.push({ type: 'inline-math', content: inner });
          i = found + 1;
          continue;
        }
      }
    }

    textBuffer += input[i];
    i++;
  }

  flushText();
  return segments;
}

/**
 * Renders a LaTeX expression to HTML using KaTeX cleanly without crashing.
 */
export function renderKatexToString(latex: string, displayMode = false): string {
  const cleaned = latex
    .trim()
    .replace(/^\$\$|\$\$$/g, '')
    .replace(/^\$|\$$/g, '')
    .trim();

  if (!cleaned) return '';

  try {
    return katex.renderToString(cleaned, {
      displayMode,
      throwOnError: false,
      strict: 'ignore',
      trust: false,
    });
  } catch {
    return cleaned;
  }
}
