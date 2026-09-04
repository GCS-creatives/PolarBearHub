// Cohesive illustrated icon set for categories (line style, matches ink
// outline used across the site). Falls back to a generic folder glyph for
// any admin-created category that doesn't map to a known icon key.

const ICONS = {
  calendar: (
    <>
      <rect x="4" y="6" width="24" height="21" rx="3" />
      <line x1="4" y1="12" x2="28" y2="12" />
      <line x1="10" y1="3" x2="10" y2="8" />
      <line x1="22" y1="3" x2="22" y2="8" />
    </>
  ),
  chat: (
    <>
      <path d="M5 8h22a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H14l-6 5v-5H5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" />
    </>
  ),
  people: (
    <>
      <circle cx="12" cy="11" r="4.5" />
      <circle cx="22" cy="11" r="4.5" />
      <path d="M4 27c0-4.5 3.6-7.5 8-7.5s8 3 8 7.5" />
      <path d="M17 27c0-4.5 3.6-7.5 8-7.5s7 3 7 7.5" />
    </>
  ),
  document: (
    <>
      <path d="M8 3h11l7 7v19a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M19 3v7h7" />
      <line x1="10" y1="18" x2="22" y2="18" />
      <line x1="10" y1="23" x2="22" y2="23" />
    </>
  ),
  laptop: (
    <>
      <rect x="5" y="6" width="22" height="14" rx="2" />
      <path d="M2 26h28l-3-4H5z" />
    </>
  ),
  books: (
    <>
      <path d="M6 5h7v24H6z" />
      <path d="M15 5h7v24h-7z" />
      <path d="M24 6l6 1-3 23-6-1z" />
    </>
  ),
  heart: (
    <>
      <path d="M16 27S4 19 4 11a7 7 0 0 1 12-4.5A7 7 0 0 1 28 11c0 8-12 16-12 16z" />
    </>
  ),
  star: (
    <>
      <path d="M16 3l4 9 10 1-7.5 6.5L24 29l-8-5-8 5 1.5-9.5L2 13l10-1z" />
    </>
  ),
  folder: (
    <>
      <path d="M4 8h9l3 3h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" />
    </>
  ),
};

export default function CategoryIcon({ icon, size = 28, strokeWidth = 2.4, color = 'currentColor' }) {
  const glyph = ICONS[icon] || ICONS.folder;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {glyph}
    </svg>
  );
}
