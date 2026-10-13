import React, { useMemo } from 'react';
import { cleanAndNormalizeRichText } from '../../utils/richTextRenderer.ts';
import { useApp } from '../../context/AppContext.tsx';

export interface RichContentRendererProps {
  content: string;
  className?: string;
  as?: 'div' | 'article' | 'section';
}

/**
 * Universal RichContentRenderer:
 * Renders any rich text (HTML, Markdown, or mixed formatted content)
 * with robust typography, two-sided text justification (`text-justify`),
 * dynamic multi-currency price token interpolation, dark mode support,
 * and zero raw tags leaking to the screen.
 */
export const RichContentRenderer: React.FC<RichContentRendererProps> = ({
  content,
  className = '',
  as: Component = 'div',
}) => {
  const { formatPrice } = useApp();

  const normalizedHtml = useMemo(() => {
    let raw = cleanAndNormalizeRichText(content || '');
    if (raw && typeof raw === 'string') {
      raw = raw.replace(/\{\{PRICE_([0-9]+)\}\}/g, (_, num) => {
        const n = Number(num);
        return !isNaN(n) ? formatPrice(n) : _;
      });
    }
    return raw;
  }, [content, formatPrice]);

  if (!normalizedHtml) {
    return null;
  }

  return (
    <Component
      className={`prose dark:prose-invert max-w-none text-justify text-justify-content rich-text-content leading-relaxed text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 ${className}`}
      dangerouslySetInnerHTML={{ __html: normalizedHtml }}
    />
  );
};
