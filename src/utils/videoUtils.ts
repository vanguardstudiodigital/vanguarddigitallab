/**
 * Helper to safely parse and convert various video URLs (YouTube, Vimeo, MP4, WebM, Local Data URLs)
 * into embeddable URLs for iframes and video tags.
 */
export function getEmbedVideoUrl(rawUrl: string): { type: 'iframe' | 'video'; embedUrl: string } {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { type: 'iframe', embedUrl: '' };
  }

  const url = rawUrl.trim();

  // 1. Local uploaded videos (DataURL or Blob URL)
  if (url.startsWith('data:video/') || url.startsWith('blob:')) {
    return {
      type: 'video',
      embedUrl: url,
    };
  }

  // 2. YouTube watch, shorts, embed, or youtu.be
  // e.g. https://www.youtube.com/watch?v=ScMzIvxBSi4 or https://youtu.be/ScMzIvxBSi4 or /shorts/xyz
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'iframe',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
    };
  }

  // 3. Vimeo URLs
  // e.g. https://vimeo.com/123456789
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'iframe',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0&portrait=0`,
    };
  }

  // 4. Direct video files (.mp4, .webm, .ogg, .mov, etc.)
  if (/\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(url)) {
    return {
      type: 'video',
      embedUrl: url,
    };
  }

  // 5. Fallback (already an embed or external URL)
  return {
    type: 'iframe',
    embedUrl: url,
  };
}
