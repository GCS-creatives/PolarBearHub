import { useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell.jsx';
import DragReorderList from '../components/DragReorderList.jsx';
import {
  adminFetchCategories, adminFetchResources,
  adminCreateCategory, adminUpdateCategory, adminDeleteCategory, adminReorderCategories,
} from '../lib/api.js';
import { BearWaving } from '../components/PolarBear.jsx';
import CategoryIcon from '../components/CategoryIcon.jsx';

const ICON_OPTIONS = ['calendar', 'chat', 'people', 'document', 'laptop', 'books', 'heart', 'star', 'folder'];
const emptyForm = { name: '', description: '', icon: 'folder', active: true };

export default function AdminCategories({ user }) {
  const [categories, setCategories] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  async function loadAll() {
    setLoading(true);
    try {
      const [cats, res] = await Promise.all([adminFetchCategories(), adminFetchResources()]);
      setCategories([...cats].sort((a, b) => a.order - b.order));
      setResources(res);
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  function startEdit(cat) {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || 'folder', active: cat.active });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await adminUpdateCategory(editingId, form);
        setToast({ type: 'ok', text: 'Filed! Your category has been updated.' });
      } else {
        await adminCreateCategory(form);
        setToast({ type: 'ok', text: 'Filed! Your new folder has been created.' });
      }
      resetForm();
      loadAll();
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    }
  }

  function resourceCount(id) {
    return resources.filter((r) => r.categoryId === id).length;
  }

  async function handleDeleteConfirmed() {
    try {
      await adminDeleteCategory(pendingDelete.id);
      setToast({ type: 'ok', text: 'Folder removed.' });
      setPendingDelete(null);
      loadAll();
    } catch (err) {
      setToast({ type: 'error', text: err.message });
      setPendingDelete(null);
    }
  }

  async function move(cat, direction) {
    const idx = categories.findIndex((c) => c.id === cat.id);
    const swapWith = direction === 'up' ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= categories.length) return;
    const ids = categories.map((c) => c.id);
    [ids[idx], ids[swapWith]] = [ids[swapWith], ids[idx]];
    try {
      await adminReorderCategories(ids);
      loadAll();
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    }
  }

  async function handleDragReorder(orderedIds) {
    try {
      await adminReorderCategories(orderedIds);
      loadAll();
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    }
  }

  function renderCategoryRow(c) {
    const count = resourceCount(c.id);
    return (
      <div className="lh-admin-list-item">
        <CategoryIcon icon={c.icon} size={22} color="var(--lh-blue-700)" />
        <div className="lh-admin-list-item__main">
          <div className="lh-admin-list-item__title">
            {c.name} {!c.active && <span style={{ color: '#b3261e', fontWeight: 700 }}>(hidden)</span>}
          </div>
          <div className="lh-admin-list-item__meta">{count} resource{count === 1 ? '' : 's'}</div>
        </div>
        <button className="lh-admin-mini-btn" onClick={() => move(c, 'up')} aria-label={`Move ${c.name} up`}>↑</button>
        <button className="lh-admin-mini-btn" onClick={() => move(c, 'down')} aria-label={`Move ${c.name} down`}>↓</button>
        <button className="lh-admin-mini-btn" onClick={() => startEdit(c)}>Edit</button>
        <button
          className="lh-admin-mini-btn lh-admin-mini-btn--danger"
          disabled={count > 0}
          title={count > 0 ? 'Reassign its resources first' : ''}
          onClick={() => setPendingDelete(c)}
        >
          Delete
        </button>
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
        <h2>{editingId ? 'Edit Folder' : 'Add a Folder'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="lh-admin-row">
            <div className="lh-field">
              <label htmlFor="name">Category Name</label>
              <input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="lh-field">
              <label htmlFor="icon">Icon</label>
              <select id="icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div className="lh-field">
            <label htmlFor="description">Description</label>
            <textarea id="description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <label className="lh-field" style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active (visible to visitors)
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="lh-admin-primary-btn">{editingId ? 'Save Changes' : 'Add Folder'}</button>
            {editingId && <button type="button" className="lh-admin-secondary-btn" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="lh-admin-card">
        <h2>All Folders ({categories.length})</h2>
        {loading ? <p>Loading…</p> : (
          <>
            <p style={{ fontSize: 12.5, color: '#6a7a95', margin: '0 0 10px' }}>
              Drag the ⠿ handle to reorder, or use the ↑ / ↓ buttons.
            </p>
            <DragReorderList
              items={categories}
              getId={(c) => c.id}
              onReorder={handleDragReorder}
              renderItem={renderCategoryRow}
            />
          </>
        )}
      </div>

      {pendingDelete && (
        <div className="lh-admin-confirm" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="lh-admin-confirm__box">
            <BearWaving size={70} />
            <p id="confirm-title" style={{ fontWeight: 700 }}>Remove the "{pendingDelete.name}" folder?</p>
            <div className="lh-admin-confirm__actions">
              <button className="lh-admin-secondary-btn" onClick={() => setPendingDelete(null)}>Keep It</button>
              <button className="lh-admin-primary-btn" style={{ background: '#b3261e' }} onClick={handleDeleteConfirmed}>Remove Folder</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
