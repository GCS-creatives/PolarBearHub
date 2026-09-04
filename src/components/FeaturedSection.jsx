import ResourceCard from './ResourceCard.jsx';
import './FeaturedSection.css';

export default function FeaturedSection({ resources, categories }) {
  const featured = resources.filter((r) => r.featured && r.active);
  if (featured.length === 0) return null;

  const nameFor = (id) => categories.find((c) => c.id === id)?.name;

  return (
    <section className="lh-featured" aria-labelledby="quick-grab-heading">
      <h2 id="quick-grab-heading" className="lh-display lh-featured__heading">Quick Grab</h2>
      <div className="lh-featured__row">
        {featured.map((r) => (
          <ResourceCard key={r.id} resource={r} categoryName={nameFor(r.categoryId)} />
        ))}
      </div>
    </section>
  );
}
