import FolderCard from './FolderCard.jsx';
import './FolderGrid.css';

export default function FolderGrid({ categories, resources }) {
  return (
    <div className="lh-foldergrid" role="list">
      {categories.map((category) => (
        <div role="listitem" key={category.id}>
          <FolderCard
            category={category}
            resourceCount={resources.filter((r) => r.categoryId === category.id).length}
          />
        </div>
      ))}
    </div>
  );
}
