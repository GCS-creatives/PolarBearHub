import { useParams, Link, Navigate } from 'react-router-dom';
import CategoryIcon from '../components/CategoryIcon.jsx';
import ResourceCard from '../components/ResourceCard.jsx';
import { BearPeeking } from '../components/PolarBear.jsx';
import './CategoryPage.css';

export default function CategoryPage({ categories, resources, loading }) {
  const { slug } = useParams();

  if (loading) return <p style={{ textAlign: 'center', padding: 60 }}>Opening the folder…</p>;

  const category = categories.find((c) => c.id === slug && c.active);
  if (!category) return <Navigate to="/" replace />;

  const categoryResources = resources
    .filter((r) => r.categoryId === category.id && r.active)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="lh-catpage">
      <div className="lh-catpage__banner">
        <Link to="/" className="lh-catpage__back">← Back to All Folders</Link>
        <div className="lh-catpage__heading">
          <CategoryIcon icon={category.icon} size={40} color="white" />
          <div>
            <h1 className="lh-display">{category.name}</h1>
            {category.description && <p className="lh-catpage__desc">{category.description}</p>}
          </div>
          <BearPeeking size={90} className="lh-catpage__bear" />
        </div>
      </div>

      <div className="lh-catpage__cards">
        {categoryResources.length === 0 ? (
          <p style={{ color: '#4a5c7a' }}>No resources have been filed here yet.</p>
        ) : (
          categoryResources.map((r) => <ResourceCard key={r.id} resource={r} />)
        )}
      </div>
    </div>
  );
}
