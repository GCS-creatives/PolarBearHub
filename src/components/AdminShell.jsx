import { NavLink, Link } from 'react-router-dom';
import { logout } from '../lib/identity.js';

export default function AdminShell({ user, children }) {
  return (
    <div className="lh-admin-shell">
      <nav className="lh-admin-nav" aria-label="Admin">
        <NavLink to="/admin/resources" className={({ isActive }) => (isActive ? 'active' : '')}>Resources</NavLink>
        <NavLink to="/admin/categories" className={({ isActive }) => (isActive ? 'active' : '')}>Categories</NavLink>
        <Link to="/" target="_blank" rel="noopener noreferrer">Preview Public Hub</Link>
        <span className="lh-admin-nav__spacer" />
        <span style={{ fontSize: 13, color: '#6a7a95' }}>{user?.email}</span>
        <button onClick={logout}>Log out</button>
      </nav>
      {children}
    </div>
  );
}
