import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BearWaving, PawPrint } from './PolarBear.jsx';
import './Header.css';

const ART_BREAKPOINT = '(min-width: 900px)';

// The illustrated banner is a fixed-aspect-ratio image with baked-in
// branding text (school name, tagline, badges) - fine here since that
// content is genuinely static, unlike category/resource names elsewhere
// in the app. Its native width is ~2172px; below ~900px displayed width
// the baked-in text scales down past comfortable reading size, so tablets
// and phones get the original coded header instead, where every element
// is real text that reflows and stays legible at any width. We render one
// or the other (never both) so there's only ever a single real <input>
// and <h1> in the DOM/accessibility tree.
function useIsWideEnoughForArt() {
  const [isWide, setIsWide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(ART_BREAKPOINT).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(ART_BREAKPOINT);
    const onChange = (e) => setIsWide(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return isWide;
}

function SearchField({ query, onQueryChange, variant }) {
  return (
    <div className={`lh-header__searchwrap lh-header__searchwrap--${variant}`}>
      <label htmlFor="hub-search" className="visually-hidden">What are you looking for?</label>
      <PawPrint className="lh-header__pawicon" size={22} fill={variant === 'art' ? 'var(--lh-blue-500)' : '#ffffff'} />
      <input
        id="hub-search"
        type="search"
        className="lh-header__search"
        placeholder="What are you looking for?"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
    </div>
  );
}

export default function Header({ query, onQueryChange, isAdmin }) {
  const useArt = useIsWideEnoughForArt();

  if (useArt) {
    return (
      <header className="lh-header lh-header--art">
        <div className="lh-header__artframe">
          <picture>
            <source srcSet="/images/header-banner.webp" type="image/webp" />
            <img src="/images/header-banner.png" alt="" className="lh-header__artimg" />
          </picture>
          <h1 className="visually-hidden">Lowrance Middle School Hub</h1>
          <p className="visually-hidden">All the info. Right where you need it.</p>
          <Link to="/admin" className="lh-header__admin lh-header__admin--art" aria-label="Admin login">
            {isAdmin ? 'Admin dashboard' : 'Admin'}
          </Link>
          <SearchField query={query} onQueryChange={onQueryChange} variant="art" />
        </div>
      </header>
    );
  }

  return (
    <header className="lh-header">
      <div className="lh-header__inner">
        <BearWaving className="lh-header__bear" size={96} />
        <div className="lh-header__titles">
          <h1 className="lh-display lh-header__title">
            Lowrance <span className="lh-header__title-sub">Middle School Hub</span>
          </h1>
          <p className="lh-header__tagline">Everything you need, right where you expect to find it.</p>
        </div>
        <Link to="/admin" className="lh-header__admin" aria-label="Admin login">
          {isAdmin ? 'Admin dashboard' : 'Admin'}
        </Link>
      </div>

      <SearchField query={query} onQueryChange={onQueryChange} variant="coded" />
    </header>
  );
}
