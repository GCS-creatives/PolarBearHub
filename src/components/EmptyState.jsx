import { Link } from 'react-router-dom';
import { BearSearching } from './PolarBear.jsx';
import './EmptyState.css';

export default function EmptyState() {
  return (
    <div className="lh-empty">
      <BearSearching size={110} />
      <p className="lh-display lh-empty__text">Hmm... that file isn't in this drawer yet.</p>
      <Link to="/" className="lh-empty__btn">View All Folders</Link>
    </div>
  );
}
