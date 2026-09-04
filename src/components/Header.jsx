import { Link } from 'react-router-dom';
import { BearWaving, PawPrint } from './PolarBear.jsx';
import './Header.css';

export default function Header({ query, onQueryChange, isAdmin }) {
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

      <div className="lh-header__searchwrap">
        <label htmlFor="hub-search" className="visually-hidden">What are you looking for?</label>
        <PawPrint className="lh-header__pawicon" size={22} fill="#ffffff" />
        <input
          id="hub-search"
          type="search"
          className="lh-header__search"
          placeholder="What are you looking for?"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
    </header>
  );
}
