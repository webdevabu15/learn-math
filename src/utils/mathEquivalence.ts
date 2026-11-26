/**
 * Pure deterministic mathematical equivalence engine for Usmonov Math Lab.
 * Handles:
 * - Uzbek comma decimals (0,5 === 0.5)
 * - Fractions & mixed numbers (1/2 === 0.5, 1 1/2 === 3/2 === 1.5, -2 1/4 === -2.25)
 * - Repeating decimals (0,(3) === 1/3, 0,1(6) === 1/6)
 * - Percentages (50% === 0.5)
 * - Simple LaTeX answers (\frac{1}{2}, -\frac{3}{4})
 * - Algebraic expressions with variables (2x + 4 === 4 + 2x, (a-b)(a+b) === a^2 - b^2)
 */

export function normalizeMathInput(raw: string): string {
  let s = raw.trim();
  if (!s) return '';

  // Strip leading "javob:" prefix first
  s = s.replace(/^(javob\s*:\s*)/i, '').trim();

  // Strip surrounding LaTeX delimiters
  s = s.replace(/^\$\$|\$\$$/g, '').replace(/^\$|\$$/g, '').trim();

  // Normalize unicode operators and dashes
  s = s
    .replace(/[−–—]/g, '-')
    .replace(/[×·⋅]/g, '*')
    .replace(/[÷:]/g, '/')
    .replace(/\^/g, '^')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3');

  // Convert basic LaTeX fractions \frac{a}{b} -> ((a)/(b))
  let prev = '';
  while (prev !== s) {
    prev = s;
    s = s.replace(/\\(?:d|t)?frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '(($1)/($2))');
  }

  // Remove remaining harmless LaTeX wrappers
  s = s
    .replace(/\\left|\\right/g, '')
    .replace(/\\cdot/g, '*')
    .replace(/\\times/g, '*')
    .replace(/\\div/g, '/')
    .replace(/\\,/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return s;
}

/**
 * Converts repeating decimal notation like "0,(3)" or "-1,2(34)" into exact rational expression.
 */
function expandRepeatingDecimal(expr: string): string {
  return expr.replace(
    /(-?\d+)[.,](\d*)\((\d+)\)/g,
    (_, intPart: string, nonRep: string, rep: string) => {
      const sign = intPart.startsWith('-') ? -1 : 1;
      const absInt = Math.abs(parseInt(intPart, 10));
      const nonRepLen = nonRep.length;
      const repLen = rep.length;

      const fullNum = parseInt(`${nonRep}${rep}`, 10);
      const nonRepNum = nonRepLen > 0 ? parseInt(nonRep, 10) : 0;
      const numerator = fullNum - nonRepNum;
      const denominator = Number('9'.repeat(repLen) + '0'.repeat(nonRepLen));

      const totalNum = absInt * denominator + numerator;
      return `(${sign < 0 ? '-' : ''}${totalNum}/${denominator})`;
    }
  );
}

/**
 * Converts mixed numbers like "2 1/3" or "-1 3/4" to "(2 + 1/3)" or "-(1 + 3/4)".
 */
function expandMixedNumbers(expr: string): string {
  return expr.replace(
    /(^|[\s(+\-*/])(-?\d+)\s+(\d+)\s*\/\s*(\d+)(?=$|[\s)+\-*/])/g,
    (_, prefix: string, whole: string, num: string, den: string) => {
      const isNeg = whole.startsWith('-');
      const absWhole = Math.abs(parseInt(whole, 10));
      const body = `(${absWhole}+(${num}/${den}))`;
      return `${prefix}${isNeg ? `(-${body})` : body}`;
    }
  );
}

/**
 * Safely tokenizes and parses a pure arithmetic or algebraic expression into an evaluator function.
 * Never uses eval or Function constructor.
 */
type Token =
  | { type: 'num'; value: number }
  | { type: 'var'; name: string }
  | { type: 'op'; value: '+' | '-' | '*' | '/' | '^' }
  | { type: 'lparen' }
  | { type: 'rparen' };

function tokenize(raw: string): Token[] | null {
  let s = expandRepeatingDecimal(raw);
  s = expandMixedNumbers(s);

  // Convert Uzbek comma decimals (e.g., 0,5 -> 0.5)
  s = s.replace(/(\d),(\d)/g, '$1.$2');
  // Convert percentage (e.g., 50% -> (50/100))
  s = s.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

  const tokens: Token[] = [];
  let i = 0;

  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (/\d/.test(ch) || (ch === '.' && /\d/.test(s[i + 1] || ''))) {
      let numStr = '';
      let hasDot = false;
      while (i < s.length && (/\d/.test(s[i]) || (s[i] === '.' && !hasDot))) {
        if (s[i] === '.') hasDot = true;
        numStr += s[i++];
      }
      const val = Number(numStr);
      if (Number.isNaN(val)) return null;
      tokens.push({ type: 'num', value: val });
      continue;
    }

    if (/[a-zA-Z]/.test(ch)) {
      tokens.push({ type: 'var', name: ch.toLowerCase() });
      i++;
      continue;
    }

    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '^') {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }

    if (ch === '(' || ch === '[' || ch === '{') {
      tokens.push({ type: 'lparen' });
      i++;
      continue;
    }

    if (ch === ')' || ch === ']' || ch === '}') {
      tokens.push({ type: 'rparen' });
      i++;
      continue;
    }

    // Unsupported symbol
    return null;
  }

  // Insert implicit multiplication: 2x -> 2*x, 2(x+1) -> 2*(x+1), (a)(b) -> (a)*(b), xy -> x*y, x(y) -> x*(y)
  const expanded: Token[] = [];
  for (let idx = 0; idx < tokens.length; idx++) {
    const cur = tokens[idx];
    expanded.push(cur);
    const next = tokens[idx + 1];
    if (!next) continue;

    const curCanMultiplyLeft =
      cur.type === 'num' || cur.type === 'var' || cur.type === 'rparen';
    const nextCanMultiplyRight =
      next.type === 'var' || next.type === 'lparen' || (cur.type === 'rparen' && next.type === 'num');

    if (curCanMultiplyLeft && nextCanMultiplyRight) {
      expanded.push({ type: 'op', value: '*' });
    }
  }

  return expanded;
}

class ExpressionParser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(): Token | undefined {
    return this.tokens[this.pos++];
  }

  parse(vars: Record<string, number>): number | null {
    this.pos = 0;
    const result = this.parseAddSub(vars);
    if (result === null || this.pos !== this.tokens.length) return null;
    return result;
  }

  private parseAddSub(vars: Record<string, number>): number | null {
    let left = this.parseMulDiv(vars);
    if (left === null) return null;

    while (true) {
      const tok = this.peek();
      if (tok?.type === 'op' && (tok.value === '+' || tok.value === '-')) {
        this.consume();
        const right = this.parseMulDiv(vars);
        if (right === null) return null;
        left = tok.value === '+' ? left + right : left - right;
      } else {
        break;
      }
    }
    return left;
  }

  private parseMulDiv(vars: Record<string, number>): number | null {
    let left = this.parseUnary(vars);
    if (left === null) return null;

    while (true) {
      const tok = this.peek();
      if (tok?.type === 'op' && (tok.value === '*' || tok.value === '/')) {
        this.consume();
        const right = this.parseUnary(vars);
        if (right === null) return null;
        if (tok.value === '/') {
          if (Math.abs(right) < 1e-12) return null;
          left = left / right;
        } else {
          left = left * right;
        }
      } else {
        break;
      }
    }
    return left;
  }

  private parseUnary(vars: Record<string, number>): number | null {
    const tok = this.peek();
    if (tok?.type === 'op' && tok.value === '-') {
      this.consume();
      const val = this.parseUnary(vars);
      return val === null ? null : -val;
    }
    if (tok?.type === 'op' && tok.value === '+') {
      this.consume();
      return this.parseUnary(vars);
    }
    return this.parsePower(vars);
  }

  private parsePower(vars: Record<string, number>): number | null {
    const base = this.parsePrimary(vars);
    if (base === null) return null;

    const tok = this.peek();
    if (tok?.type === 'op' && tok.value === '^') {
      this.consume();
      const exp = this.parseUnary(vars);
      if (exp === null) return null;
      const val = Math.pow(base, exp);
      return Number.isFinite(val) ? val : null;
    }
    return base;
  }

  private parsePrimary(vars: Record<string, number>): number | null {
    const tok = this.peek();
    if (!tok) return null;

    if (tok.type === 'num') {
      this.consume();
      return tok.value;
    }

    if (tok.type === 'var') {
      this.consume();
      return vars[tok.name] ?? null;
    }

    if (tok.type === 'lparen') {
      this.consume();
      const val = this.parseAddSub(vars);
      if (val === null) return null;
      const closing = this.peek();
      if (closing?.type !== 'rparen') return null;
      this.consume();
      return val;
    }

    return null;
  }
}

function extractVariables(tokens: Token[]): Set<string> {
  const vars = new Set<string>();
  for (const t of tokens) {
    if (t.type === 'var') vars.add(t.name);
  }
  return vars;
}

/**
 * Strips leading equation assignment like "x = 5" -> "5" when comparing equation solutions.
 */
function stripEquationPrefix(expr: string): string {
  const match = expr.match(/^[a-zA-Z]\s*=\s*(.+)$/);
  return match ? match[1].trim() : expr;
}

/**
 * Determines whether userInput is mathematically equivalent to expectedAnswer
 * (or any of acceptedEquivalents).
 */
export function areMathAnswersEquivalent(
  userInput: string,
  expectedAnswer: string,
  acceptedEquivalents: string[] = []
): boolean {
  const normUser = normalizeMathInput(userInput);
  if (!normUser) return false;

  const candidates = [expectedAnswer, ...acceptedEquivalents]
    .map((c) => normalizeMathInput(c))
    .filter(Boolean);

  for (const candidate of candidates) {
    // 1. Direct canonical string match (case-insensitive, whitespace-stripped)
    const compactUser = normUser.replace(/\s+/g, '').toLowerCase();
    const compactCand = candidate.replace(/\s+/g, '').toLowerCase();
    if (compactUser === compactCand) return true;

    // 2. Compare stripped equation values (e.g. "x = 3" vs "3")
    const strippedUser = stripEquationPrefix(normUser);
    const strippedCand = stripEquationPrefix(candidate);

    const tokensA = tokenize(strippedUser);
    const tokensB = tokenize(strippedCand);
    if (!tokensA || !tokensB) continue;

    const varsA = extractVariables(tokensA);
    const varsB = extractVariables(tokensB);

    // Check if variable sets match (or one is a subset because of zero-coefficient cancellation like x - x = 0)
    const allVars = Array.from(new Set([...varsA, ...varsB]));

    const parserA = new ExpressionParser(tokensA);
    const parserB = new ExpressionParser(tokensB);

    if (allVars.length === 0) {
      const valA = parserA.parse({});
      const valB = parserB.parse({});
      if (valA !== null && valB !== null && Math.abs(valA - valB) < 1e-7) {
        return true;
      }
      continue;
    }

    // Multi-point deterministic algebraic identity test across non-trivial prime-ish points
    const sampleSets = [
      [1.7, 2.3, -1.4, 3.1, 0.8],
      [-2.1, 1.3, 2.9, -0.7, 4.2],
      [3.4, -1.8, 0.6, 2.2, -3.5],
      [0.45, 3.75, -2.6, 1.15, 2.85],
      [-1.25, -2.4, 3.3, -1.9, 0.55],
    ];

    let validSamples = 0;
    let allMatch = true;

    for (const sample of sampleSets) {
      const env: Record<string, number> = {};
      allVars.forEach((v, idx) => {
        env[v] = sample[idx % sample.length];
      });
      const valA = parserA.parse(env);
      const valB = parserB.parse(env);
      if (valA === null || valB === null) continue;
      validSamples++;
      const tol = 1e-5 * Math.max(1, Math.abs(valA), Math.abs(valB));
      if (Math.abs(valA - valB) > tol) {
        allMatch = false;
        break;
      }
    }

    if (validSamples >= 3 && allMatch) {
      return true;
    }
  }

  return false;
}
