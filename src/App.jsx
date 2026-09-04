import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminResources from './pages/AdminResources.jsx';
import AdminCategories from './pages/AdminCategories.jsx';
import Footer from './components/Footer.jsx';
import { fetchPublicContent } from './lib/api.js';
import { getIdentity, isAdmin } from './lib/identity.js';

function RequireAdmin({ user, children }) {
  if (!user || !isAdmin(user)) return <Navigate to="/admin" replace />;
  return children;
}

export default function App() {
  const [content, setContent] = useState({ categories: [], resources: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPublicContent()
      .then(setContent)
      .catch((err) => setError(err.message || 'Could not load the Hub right now.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Pick up an already-signed-in Identity session on first load
    // (e.g. after a page refresh on an /admin route).
    try {
      const current = getIdentity().currentUser();
      if (current) setUser(current);
    } catch {
      // widget script hasn't loaded yet — AdminLogin will init() it
    }
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <main id="main">
        <Routes>
          <Route path="/" element={<Home categories={content.categories} resources={content.resources} loading={loading} error={error} />} />
          <Route path="/category/:slug" element={<CategoryPage categories={content.categories} resources={content.resources} loading={loading} />} />
          <Route path="/admin" element={<AdminLogin user={user} setUser={setUser} />} />
          <Route path="/admin/resources" element={<RequireAdmin user={user}><AdminResources user={user} /></RequireAdmin>} />
          <Route path="/admin/categories" element={<RequireAdmin user={user}><AdminCategories user={user} /></RequireAdmin>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
