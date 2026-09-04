import './ResourceCard.css';

export default function ResourceCard({ resource, categoryName }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="lh-rescard"
      aria-label={`${resource.title}${categoryName ? `, in ${categoryName}` : ''} (opens in a new tab)`}
    >
      {resource.featured && <span className="lh-rescard__badge">Quick Grab</span>}
      <span className="lh-rescard__pin" aria-hidden="true" />
      <span className="lh-rescard__title">{resource.title}</span>
      {resource.description && <span className="lh-rescard__desc">{resource.description}</span>}
      {categoryName && <span className="lh-rescard__cat">{categoryName}</span>}
      <span className="lh-rescard__ext" aria-hidden="true">↗</span>
    </a>
  );
}
