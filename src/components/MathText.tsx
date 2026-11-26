import React, { useMemo } from 'react';
import { parseMathSegments, renderKatexToString } from '../utils/mathParser';

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * Renders Uzbek prose mixed with inline ($...$) and display ($$...$$) LaTeX via KaTeX.
 * Never outputs raw LaTeX delimiters to the user.
 */
export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  const segments = useMemo(() => parseMathSegments(text), [text]);

  return (
    <span className={className}>
      {segments.map((seg, idx) => {
        if (seg.type === 'text') {
          return <React.Fragment key={idx}>{seg.content}</React.Fragment>;
        }
        const html = renderKatexToString(seg.content, seg.type === 'display-math');
        if (seg.type === 'display-math') {
          return (
            <span
              key={idx}
              className="block my-2 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
        return (
          <span
            key={idx}
            className="inline-block align-baseline mx-0.5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
};

interface MathBlockProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * Renders a pure LaTeX expression directly through KaTeX.
 */
export const MathBlock: React.FC<MathBlockProps> = ({
  latex,
  displayMode = true,
  className = '',
}) => {
  const html = useMemo(() => renderKatexToString(latex, displayMode), [latex, displayMode]);

  return (
    <div
      className={`overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
