import { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import FolderGrid from '../components/FolderGrid.jsx';
import FeaturedSection from '../components/FeaturedSection.jsx';
import ResourceCard from '../components/ResourceCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Home({ categories, resources, loading, error }) {
  const [query, setQuery] = useState('');

  const activeCategories = useMemo(
    () => categories.filter((c) => c.active).sort((a, b) => a.order - b.order),
    [categories]
  );
  const activeResources = useMemo(() => resources.filter((r) => r.active), [resources]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return activeResources.filter((r) => {
      const category = categories.find((c) => c.id === r.categoryId);
      const haystack = [r.title, r.description, category?.name, ...(r.keywords || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, activeResources, categories]);

  return (
    <>
      <Header query={query} onQueryChange={setQuery} />

      {loading && <p style={{ textAlign: 'center', padding: 40 }}>Opening the file drawer…</p>}
      {error && <p style={{ textAlign: 'center', padding: 40, color: '#b3261e' }}>{error}</p>}

      {!loading && !error && searchResults && (
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 40px' }}>
          <h2 className="lh-display" style={{ color: 'var(--lh-blue-900)', marginBottom: 14 }}>
            {searchResults.length} result{searchResults.length === 1 ? '' : 's'} for "{query}"
          </h2>
          {searchResults.length === 0 ? (
            <EmptyState />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {searchResults.map((r) => (
                <ResourceCard key={r.id} resource={r} categoryName={categories.find((c) => c.id === r.categoryId)?.name} />
              ))}
            </div>
          )}
        </section>
      )}

      {!loading && !error && !searchResults && (
        <>
          <FeaturedSection resources={activeResources} categories={activeCategories} />
          <FolderGrid categories={activeCategories} resources={activeResources} />
        </>
      )}
    </>
  );
}
