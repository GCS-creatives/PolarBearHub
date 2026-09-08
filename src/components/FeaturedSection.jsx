import { useId, useState } from 'react';
import ResourceCard from './ResourceCard.jsx';
import './FeaturedSection.css';

export default function FeaturedSection({ resources, categories }) {
  const [collapsed, setCollapsed] = useState(false);
  const panelId = useId();
  const featured = resources.filter((r) => r.featured && r.active);
  if (featured.length === 0) return null;

  const nameFor = (id) => categories.find((c) => c.id === id)?.name;

  return (
    <section className="lh-featured" aria-labelledby="quick-grab-heading">
      <button
        type="button"
        className="lh-featured__toggle"
        aria-expanded={!collapsed}
        aria-controls={panelId}
        onClick={() => setCollapsed((c) => !c)}
      >
        <h2 id="quick-grab-heading" className="lh-display lh-featured__heading">Quick Grab</h2>
        <span className={`lh-featured__chevron ${collapsed ? 'lh-featured__chevron--collapsed' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>
      <div id={panelId} className="lh-featured__row" hidden={collapsed}>
        {featured.map((r) => (
          <ResourceCard key={r.id} resource={r} categoryName={nameFor(r.categoryId)} />
        ))}
      </div>
    </section>
  );
}
