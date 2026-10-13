/**
 * Vanguard Studio Official Brand Vector Logo
 * Features gold techno chevron mark with electric cyan circuit traces
 */
export const VANGUARD_LOGO_PATH = '/vanguard-logo.svg';

// Fully self-contained SVG Data URI for 100% zero-latency offline rendering
export const VANGUARD_LOGO_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
  </defs>
  <g id="vanguard-shield-crest" stroke-linecap="round" stroke-linejoin="round">
    <path d="M250,75 L110,118 L126,224 L250,320 Z" fill="url(#goldGrad)" fill-opacity="0.08" stroke="url(#goldGrad)" stroke-width="3" />
    <path d="M250,75 L390,118 L374,224 L250,320 Z" fill="url(#cyanGrad)" fill-opacity="0.05" stroke="url(#cyanGrad)" stroke-width="3" />
    <line x1="250" y1="75" x2="250" y2="320" stroke="url(#goldGrad)" stroke-width="2.5" stroke-dasharray="8 6" opacity="0.6" />
    <circle cx="250" cy="75" r="4" fill="#FBBF24" />
    <circle cx="110" cy="118" r="3.5" fill="#F59E0B" />
    <circle cx="390" cy="118" r="3.5" fill="#38BDF8" />
    <circle cx="250" cy="320" r="4" fill="#38BDF8" />
  </g>
  <g id="vanguard-symbol" stroke-linecap="round" stroke-linejoin="round">
    <line x1="250" y1="135" x2="250" y2="185" stroke="url(#cyanGrad)" stroke-width="4.5" />
    <circle cx="250" cy="135" r="4.5" fill="none" stroke="url(#cyanGrad)" stroke-width="4" />
    <polyline points="155,120 250,252 345,120" fill="none" stroke="url(#goldGrad)" stroke-width="7" />
    <polyline points="185,145 250,232 315,145" fill="none" stroke="url(#goldGrad)" stroke-width="5" />
    <polyline points="148,130 195,200" fill="none" stroke="url(#cyanGrad)" stroke-width="4" />
    <polyline points="162,178 180,178 208,218" fill="none" stroke="url(#cyanGrad)" stroke-width="4" />
    <circle cx="166" cy="178" r="4" fill="none" stroke="url(#cyanGrad)" stroke-width="3.5" />
    <polyline points="182,215 210,255" fill="none" stroke="url(#cyanGrad)" stroke-width="4" />
    <circle cx="209" cy="230" r="3.5" fill="none" stroke="url(#cyanGrad)" stroke-width="3" />
    <polyline points="305,200 352,130" fill="none" stroke="url(#goldGrad)" stroke-width="4" />
    <polyline points="292,218 320,178 338,178" fill="none" stroke="url(#cyanGrad)" stroke-width="4" />
    <circle cx="334" cy="178" r="4" fill="none" stroke="url(#cyanGrad)" stroke-width="3.5" />
    <polyline points="290,255 318,215" fill="none" stroke="url(#cyanGrad)" stroke-width="4" />
    <circle cx="291" cy="230" r="3.5" fill="none" stroke="url(#cyanGrad)" stroke-width="3" />
    <polyline points="240,265 250,282 260,265" fill="none" stroke="url(#cyanGrad)" stroke-width="4.5" />
    <line x1="250" y1="282" x2="250" y2="300" stroke="url(#cyanGrad)" stroke-width="4.5" />
    <polyline points="267,260 267,280" fill="none" stroke="url(#cyanGrad)" stroke-width="4" />
    <polyline points="233,260 233,275" fill="none" stroke="url(#cyanGrad)" stroke-width="4" />
  </g>
  <text x="250" y="360" text-anchor="middle" fill="url(#goldGrad)" font-family="'Roboto', 'Montserrat', 'Inter', sans-serif" font-size="44" font-weight="700" letter-spacing="14">VANGUARD</text>
  <g id="studio-circuit" stroke-linecap="round">
    <circle cx="95" cy="388" r="4" fill="none" stroke="url(#cyanGrad)" stroke-width="3" />
    <line x1="99" y1="388" x2="160" y2="388" stroke="url(#cyanGrad)" stroke-width="3.5" />
    <text x="250" y="394" text-anchor="middle" fill="url(#cyanGrad)" font-family="'Roboto', 'Montserrat', 'Inter', sans-serif" font-size="20" font-weight="700" letter-spacing="12">STUDIO</text>
    <line x1="340" y1="388" x2="401" y2="388" stroke="url(#cyanGrad)" stroke-width="3.5" />
    <circle cx="405" cy="388" r="4" fill="none" stroke="url(#cyanGrad)" stroke-width="3" />
  </g>
  <text x="250" y="426" text-anchor="middle" fill="#D97706" font-family="'Roboto', 'Montserrat', 'Inter', sans-serif" font-size="11.5" font-weight="600" letter-spacing="8">DIGITAL SOFTWARE AGENCY</text>
</svg>
`)}`;
