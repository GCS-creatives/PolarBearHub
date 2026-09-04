// A small library of recurring polar bear poses, drawn as inline SVG so no
// image hosting is required. Used sparingly per the brand brief.

const shared = {
  fill: 'none',
};

export function BearWaving({ className, size = 120 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Lowrance polar bear mascot waving">
      <circle cx="60" cy="66" r="40" fill="#ffffff" stroke="#12203a" strokeWidth="3" />
      <circle cx="34" cy="40" r="13" fill="#ffffff" stroke="#12203a" strokeWidth="3" />
      <circle cx="86" cy="40" r="13" fill="#ffffff" stroke="#12203a" strokeWidth="3" />
      <circle cx="34" cy="40" r="5" fill="#12203a" />
      <circle cx="86" cy="40" r="5" fill="#12203a" />
      <ellipse cx="60" cy="72" rx="16" ry="12" fill="#ffffff" stroke="#12203a" strokeWidth="3" />
      <circle cx="45" cy="60" r="4" fill="#12203a" />
      <circle cx="75" cy="60" r="4" fill="#12203a" />
      <path d="M56 74 q4 4 8 0" stroke="#12203a" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="60" cy="70" r="3" fill="#12203a" />
      <path d="M20 74 q-14 6 -10 24" stroke="#12203a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="10" cy="98" r="8" fill="#ffffff" stroke="#12203a" strokeWidth="3" />
      <path d="M22 90 Q60 108 98 90" stroke="#2e6fd9" strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function BearPeeking({ className, size = 110 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 110 90" role="img" aria-label="Polar bear peeking over a folder">
      <rect x="0" y="52" width="110" height="38" rx="8" fill="#e8f1fd" />
      <circle cx="55" cy="42" r="34" fill="#ffffff" stroke="#12203a" strokeWidth="3" />
      <circle cx="30" cy="20" r="11" fill="#ffffff" stroke="#12203a" strokeWidth="3" />
      <circle cx="80" cy="20" r="11" fill="#ffffff" stroke="#12203a" strokeWidth="3" />
      <circle cx="41" cy="40" r="3.5" fill="#12203a" />
      <circle cx="69" cy="40" r="3.5" fill="#12203a" />
      <ellipse cx="55" cy="50" rx="10" ry="7" fill="#ffffff" stroke="#12203a" strokeWidth="2.5" />
      <circle cx="55" cy="49" r="2.5" fill="#12203a" />
      <path d="M50 54 q5 4 10 0" stroke="#12203a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="14" y="58" width="34" height="24" rx="4" fill="#2e6fd9" stroke="#12203a" strokeWidth="2.5" />
      <rect x="14" y="58" width="34" height="7" rx="2" fill="#1b4f96" stroke="#12203a" strokeWidth="2.5" />
    </svg>
  );
}

export function BearSearching({ className, size = 130 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 130 110" role="img" aria-label="Polar bear looking through files, none found">
      <circle cx="55" cy="55" r="38" fill="#ffffff" stroke="#12203a" strokeWidth="3" />
      <circle cx="30" cy="30" r="12" fill="#ffffff" stroke="#12203a" strokeWidth="3" />
      <circle cx="80" cy="30" r="12" fill="#ffffff" stroke="#12203a" strokeWidth="3" />
      <path d="M35 55 q6 -6 12 0" stroke="#12203a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M65 55 q6 -6 12 0" stroke="#12203a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="55" cy="65" rx="11" ry="8" fill="#ffffff" stroke="#12203a" strokeWidth="2.5" />
      <circle cx="55" cy="64" r="2.5" fill="#12203a" />
      <path d="M49 70 q6 -3 12 0" stroke="#12203a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <g transform="translate(88 68) rotate(20)">
        <circle r="16" fill="none" stroke="#12203a" strokeWidth="4" />
        <line x1="11" y1="11" x2="24" y2="24" stroke="#12203a" strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function PawPrint({ className, size = 20, fill = 'var(--lh-paw)' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="26" r="9" fill={fill} />
      <circle cx="7" cy="14" r="5" fill={fill} />
      <circle cx="18" cy="7" r="5.5" fill={fill} />
      <circle cx="30" cy="10" r="5" fill={fill} />
      <circle cx="34" cy="20" r="4.5" fill={fill} />
    </svg>
  );
}
