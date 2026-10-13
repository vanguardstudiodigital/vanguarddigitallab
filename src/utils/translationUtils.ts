/**
 * Translation utility with Gemini AI HTML protector & List CSS Alignment guarantee
 */

export function postProcessHtml(html: string, targetLang: string): string {
  if (!html || typeof html !== 'string') return '';

  let processed = html;

  // 1. Inject "style="text-align: left; list-style-position: inside;"" into <ul ...> and <ol ...> tags
  processed = processed.replace(/<(ul|ol)([^>]*)>/gi, (match, tag, attrs) => {
    let newAttrs = attrs;

    if (/style=["']([^"']*)["']/i.test(newAttrs)) {
      newAttrs = newAttrs.replace(/style=["']([^"']*)["']/i, (_sMatch: string, styleVal: string) => {
        let s = styleVal;
        if (!/text-align/i.test(s)) s += '; text-align: left;';
        if (!/list-style-position/i.test(s)) s += '; list-style-position: inside;';
        return `style="${s.replace(/^;\s*/, '')}"`;
      });
    } else {
      newAttrs += ' style="text-align: left; list-style-position: inside;"';
    }

    return `<${tag}${newAttrs}>`;
  });

  // 2. Fix corrupted Russian word starts inside <li> or <p> tags (e.g., "сли " at start -> "Если ")
  if (targetLang === 'ru') {
    processed = processed
      .replace(/<(li|p)([^>]*)>\s*сли\b/gi, '<$1$2>Если')
      .replace(/<(li|p)([^>]*)>\s*тобы\b/gi, '<$1$2>Чтобы')
      .replace(/<(li|p)([^>]*)>\s*то\b/gi, '<$1$2>Что');
  }

  // 3. Ensure <li> items inside lists don't have broken outer tags
  processed = processed.replace(/<li([^>]*)>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/li>/gi, '<li$1>$2</li>');

  return processed;
}

/**
 * Automatically translates content TR -> EN or RU using Gemini AI API with HTML protector
 */
export async function translateContent(
  text: string,
  targetLang: 'en' | 'ru'
): Promise<string> {
  if (!text || typeof text !== 'string' || !text.trim()) return '';

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.translatedText) {
        return postProcessHtml(data.translatedText, targetLang);
      }
    }
  } catch (err) {
    console.warn('Translate API request failed, applying fallback:', err);
  }

  // Fallback if API fails or server offline
  return postProcessHtml(text, targetLang);
}
