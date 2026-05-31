export const Tick = (p) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" {...p}>
    <path d="M2 6.5L4.8 9L10 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Arrow = ({ rot = 0, size = 14, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none"
       style={{ transform: `rotate(${rot}deg)` }} aria-hidden="true" {...rest}>
    <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Caret = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const GoogleLogo = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path fill="#4285F4" d="M15.68 8.18c0-.55-.05-1.08-.14-1.59H8v3.01h4.31c-.19 1-.74 1.85-1.6 2.42v2h2.58c1.51-1.4 2.39-3.46 2.39-5.84z" />
    <path fill="#34A853" d="M8 16c2.16 0 3.97-.72 5.29-1.95l-2.58-2c-.72.48-1.62.77-2.71.77-2.08 0-3.85-1.41-4.48-3.3H.85v2.07A8 8 0 0 0 8 16z" />
    <path fill="#FBBC04" d="M3.52 9.52A4.8 4.8 0 0 1 3.27 8c0-.53.09-1.04.25-1.52V4.41H.85A8 8 0 0 0 0 8c0 1.29.31 2.5.85 3.59l2.67-2.07z" />
    <path fill="#EA4335" d="M8 3.18c1.17 0 2.22.4 3.05 1.2l2.29-2.29C11.97.78 10.16 0 8 0A8 8 0 0 0 .85 4.41l2.67 2.07C4.15 4.6 5.92 3.18 8 3.18z" />
  </svg>
);

export const Sparkle = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M7 1.5v3M7 9.5v3M1.5 7h3M9.5 7h3M3 3l2 2M11 11L9 9M11 3L9 5M3 11l2-2"
      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
