import { useEffect, useMemo, useState } from 'react';
import AdminShell from '../components/AdminShell.jsx';
import DragReorderList from '../components/DragReorderList.jsx';
import {
  adminFetchCategories, adminFetchResources,
  adminCreateResource, adminUpdateResource, adminDeleteResource, adminReorderResources,
} from '../lib/api.js';
import { BearWaving } from '../components/PolarBear.jsx';

const emptyForm = {
  title: '', url: '', categoryId: '', description: '', icon: '', imageUrl: '',
  keywords: '', featured: false, active: true,
};

export default function AdminResources({ user }) {
  const [categories, setCategories] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');

  async function loadAll() {
    setLoading(true);
    try {
      const [cats, res] = await Promise.all([adminFetchCategories(), adminFetchResources()]);
      setCategories(cats);
      setResources(res);
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  const grouped = useMemo(() => {
    if (filterCategory) {
      return resources.filter((r) => r.categoryId === filterCategory).sort((a, b) => a.order - b.order);
    }
    // No filter: order values are per-category, so group by category first
    // to avoid interleaving unrelated items that happen to share an order.
    return [...resources].sort((a, b) =>
      a.categoryId === b.categoryId ? a.order - b.order : a.categoryId.localeCompare(b.categoryId)
    );
  }, [resources, filterCategory]);

  function startEdit(resource) {
    setEditingId(resource.id);
    setForm({
      title: resource.title, url: resource.url, categoryId: resource.categoryId,
      description: resource.description || '', icon: resource.icon || '', imageUrl: resource.imageUrl || '',
      keywords: (resource.keywords || []).join(', '), featured: resource.featured, active: resource.active,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await adminUpdateResource(editingId, payload);
        setToast({ type: 'ok', text: 'Filed! Your resource has been updated.' });
      } else {
        await adminCreateResource(payload);
        setToast({ type: 'ok', text: 'Filed! Your new resource has been added.' });
      }
      resetForm();
      loadAll();
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    }
  }

  async function handleDeleteConfirmed() {
    try {
      await adminDeleteResource(pendingDelete.id);
      setToast({ type: 'ok', text: 'Removed from the Hub.' });
      setPendingDelete(null);
      loadAll();
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    }
  }

  async function move(resource, direction) {
    const siblings = resources
      .filter((r) => r.categoryId === resource.categoryId)
      .sort((a, b) => a.order - b.order);
    const idx = siblings.findIndex((r) => r.id === resource.id);
    const swapWith = direction === 'up' ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= siblings.length) return;
    const ids = siblings.map((r) => r.id);
    [ids[idx], ids[swapWith]] = [ids[swapWith], ids[idx]];
    try {
      await adminReorderResources(resource.categoryId, ids);
      loadAll();
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    }
  }

  async function handleDragReorder(orderedIds) {
    try {
      await adminReorderResources(filterCategory, orderedIds);
      loadAll();
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    }
  }

  function renderResourceRow(r) {
    return (
      <div className="lh-admin-list-item">
        <div className="lh-admin-list-item__main">
          <div className="lh-admin-list-item__title">
            {r.title} {!r.active && <span style={{ color: '#b3261e', fontWeight: 700 }}>(hidden)</span>} {r.featured && <span style={{ color: '#c8971f' }}>★</span>}
          </div>
          <div className="lh-admin-list-item__meta">{categories.find((c) => c.id === r.categoryId)?.name || 'Uncategorized'}</div>
        </div>
        <button className="lh-admin-mini-btn" onClick={() => move(r, 'up')} aria-label={`Move ${r.title} up`}>↑</button>
        <button className="lh-admin-mini-btn" onClick={() => move(r, 'down')} aria-label={`Move ${r.title} down`}>↓</button>
        <button className="lh-admin-mini-btn" onClick={() => startEdit(r)}>Edit</button>
        <button className="lh-admin-mini-btn lh-admin-mini-btn--danger" onClick={() => setPendingDelete(r)}>Delete</button>
      </div>
    );
  }

  return (
    <AdminShell user={user}>
      {toast && (
        <div className={`lh-admin-toast ${toast.type === 'error' ? 'lh-admin-toast--error' : ''}`}>
          {toast.type === 'ok' && <BearWaving size={26} />}
          {toast.text}
          <button onClick={() => setToast(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontWeight: 700 }} aria-label="Dismiss">×</button>
        </div>
      )}

      <div className="lh-admin-card">
        <h2>{editingId ? 'Edit Resource' : 'Add a Link'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="lh-admin-row">
            <div className="lh-field">
              <label htmlFor="title">Resource Name</label>
              <input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="lh-field">
              <label htmlFor="url">Link / URL</label>
              <input id="url" required type="text" placeholder="https://…" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
            </div>
            <div className="lh-field">
              <label htmlFor="categoryId">Category</label>
              <select id="categoryId" required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">Choose…</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <details className="lh-admin-details">
            <summary>More options (description, image, keywords, featured…)</summary>
            <div className="lh-field">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="lh-admin-row">
              <div className="lh-field">
                <label htmlFor="icon">Icon key</label>
                <input id="icon" placeholder="calendar, chat, document…" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
              </div>
              <div className="lh-field">
                <label htmlFor="imageUrl">Image URL</label>
                <input id="imageUrl" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              </div>
              <div className="lh-field">
                <label htmlFor="keywords">Keywords (comma separated)</label>
                <input id="keywords" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} />
              </div>
            </div>
            <div className="lh-admin-row">
              <label className="lh-field" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured (Quick Grab)
              </label>
              <label className="lh-field" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active (visible to visitors)
              </label>
            </div>
          </details>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="lh-admin-primary-btn">{editingId ? 'Save Changes' : 'Add Link'}</button>
            {editingId && <button type="button" className="lh-admin-secondary-btn" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="lh-admin-card">
        <h2>All Resources ({resources.length})</h2>
        <div className="lh-field" style={{ maxWidth: 260 }}>
          <label htmlFor="filter">Filter by category</label>
          <select id="filter" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {loading ? <p>Loading…</p> : grouped.length === 0 ? <p>No resources yet.</p> : filterCategory ? (
          <>
            <p style={{ fontSize: 12.5, color: '#6a7a95', margin: '0 0 10px' }}>
              Drag the ⠿ handle to reorder, or use the ↑ / ↓ buttons.
            </p>
            <DragReorderList
              items={grouped}
              getId={(r) => r.id}
              onReorder={handleDragReorder}
              renderItem={renderResourceRow}
            />
          </>
        ) : (
          <>
            <p style={{ fontSize: 12.5, color: '#6a7a95', margin: '0 0 10px' }}>
              Pick a single category above to drag-and-drop reorder. The ↑ / ↓ buttons work here too.
            </p>
            <div>
              {grouped.map((r) => <div key={r.id}>{renderResourceRow(r)}</div>)}
            </div>
          </>
        )}
      </div>

      {pendingDelete && (
        <div className="lh-admin-confirm" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="lh-admin-confirm__box">
            <BearWaving size={70} />
            <p id="confirm-title" style={{ fontWeight: 700 }}>Remove "{pendingDelete.title}" from the Hub?</p>
            <div className="lh-admin-confirm__actions">
              <button className="lh-admin-secondary-btn" onClick={() => setPendingDelete(null)}>Keep It</button>
              <button className="lh-admin-primary-btn" style={{ background: '#b3261e' }} onClick={handleDeleteConfirmed}>Remove Link</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
