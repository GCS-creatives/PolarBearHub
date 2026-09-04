import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryIcon from './CategoryIcon.jsx';
import { PawPrint } from './PolarBear.jsx';
import './FolderCard.css';

// How long the "opening" flourish plays before we actually navigate.
// Kept short so it reads as a flourish, not a loading wait; the global
// prefers-reduced-motion rule collapses this to ~0ms automatically.
const OPEN_ANIMATION_MS = 260;

export default function FolderCard({ category, resourceCount }) {
  const navigate = useNavigate();
  const [opening, setOpening] = useState(false);
  const timeoutRef = useRef(null);

  function handleActivate(e) {
    e.preventDefault();
    if (opening) return;
    setOpening(true);
    timeoutRef.current = setTimeout(() => {
      navigate(`/category/${category.id}`);
    }, OPEN_ANIMATION_MS);
  }

  return (
    <a
      href={`/category/${category.id}`}
      className={`lh-folder ${opening ? 'lh-folder--opening' : ''}`}
      aria-label={`${category.name} folder, ${resourceCount} resource${resourceCount === 1 ? '' : 's'}`}
      onClick={handleActivate}
    >
      <span className="lh-folder__tab">{category.name}</span>
      <span className="lh-folder__body">
        <CategoryIcon icon={category.icon} size={34} color="currentColor" />
        <PawPrint className="lh-folder__paw" size={16} />
      </span>
      {category.description && <span className="lh-folder__desc">{category.description}</span>}
      <span className="lh-folder__papers" aria-hidden="true">
        <span className="lh-folder__paper lh-folder__paper--1" />
        <span className="lh-folder__paper lh-folder__paper--2" />
      </span>
    </a>
  );
}
