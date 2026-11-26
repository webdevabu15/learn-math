/**
 * Strict sanitizer for AI-generated inline SVG diagrams (used on both server and client).
 * Removes executable elements, event handler attributes, and unsafe URI schemes
 * while preserving clean vector graphics (<svg>, <g>, <path>, <rect>, <circle>, <line>, <text>, etc.).
 */

const BLOCKED_TAGS = [
  'script',
  'foreignobject',
  'iframe',
  'object',
  'embed',
  'style',
  'link',
  'meta',
  'audio',
  'video',
  'canvas',
  'animate',
  'animatetransform',
  'animatemotion',
  'set',
];

export function sanitizeInlineSvg(raw: string): string | null {
  if (!raw || typeof raw !== 'string') return null;

  // Extract the first <svg ...> ... </svg> block if wrapped in markdown fences or prose
  const match = raw.match(/<svg[\s\S]*?<\/svg>/i);
  if (!match) return null;

  let svg = match[0].trim();

  // Remove XML processing instructions and HTML comments
  svg = svg.replace(/<\?[\s\S]*?\?>/g, '').replace(/<!--[\s\S]*?-->/g, '');

  // Strip dangerous paired and self-closing elements
  for (const tag of BLOCKED_TAGS) {
    const paired = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
    const selfClosing = new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi');
    svg = svg.replace(paired, '').replace(selfClosing, '');
  }

  // Remove all inline event handlers (onclick, onload, onerror, etc.)
  svg = svg.replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // Remove dangerous javascript: / vbscript: / data:text/html URIs in href or xlink:href or src
  svg = svg.replace(
    /\s+(?:xlink:)?(?:href|src)\s*=\s*(?:"\s*(?:javascript|vbscript|data)\s*:[^"]*"|'\s*(?:javascript|vbscript|data)\s*:[^']*')/gi,
    ''
  );

  // Strip url(javascript:...) or expression(...) in inline style attributes
  svg = svg.replace(
    /\s+style\s*=\s*(?:"[^"]*(?:javascript:|expression\(|@import)[^"]*"|'[^']*(?:javascript:|expression\(|@import)[^']*')/gi,
    ''
  );

  // Verify opening <svg> and closing </svg> still exist cleanly
  if (!/^<svg\b/i.test(svg) || !/<\/svg>$/i.test(svg)) {
    return null;
  }

  return svg;
}
