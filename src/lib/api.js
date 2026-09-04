// Typed(-ish) data access layer. The UI only ever imports from here — it
// never calls fetch() against /.netlify/functions directly, and never
// touches Netlify Blobs. This is what makes it safe to change the storage
// or function implementation later without touching any component.

import { seedCategories, seedResources } from '../data/seed.js';
import { getIdentity } from './identity.js';

const FUNCTIONS_BASE = '/.netlify/functions';
const USE_LOCAL_FALLBACK = import.meta.env.DEV && import.meta.env.VITE_USE_SEED === 'true';

async function authedFetch(path, options = {}) {
  const user = getIdentity().currentUser();
  const token = user ? (await user.jwt()) : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${FUNCTIONS_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ---------- Public reads ----------

export async function fetchPublicContent() {
  if (USE_LOCAL_FALLBACK) {
    return { categories: seedCategories, resources: seedResources };
  }
  return authedFetch('/categories?scope=public', { method: 'GET' })
    .then(async (categories) => {
      const resources = await authedFetch('/resources?scope=public', { method: 'GET' });
      return { categories, resources };
    });
}

// ---------- Admin: categories ----------

export async function adminFetchCategories() {
  return authedFetch('/categories', { method: 'GET' });
}

export async function adminCreateCategory(category) {
  return authedFetch('/categories', { method: 'POST', body: JSON.stringify(category) });
}

export async function adminUpdateCategory(id, updates) {
  return authedFetch(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
}

export async function adminDeleteCategory(id) {
  return authedFetch(`/categories/${id}`, { method: 'DELETE' });
}

export async function adminReorderCategories(orderedIds) {
  return authedFetch('/categories/reorder', { method: 'POST', body: JSON.stringify({ orderedIds }) });
}

// ---------- Admin: resources ----------

export async function adminFetchResources() {
  return authedFetch('/resources', { method: 'GET' });
}

export async function adminCreateResource(resource) {
  return authedFetch('/resources', { method: 'POST', body: JSON.stringify(resource) });
}

export async function adminUpdateResource(id, updates) {
  return authedFetch(`/resources/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
}

export async function adminDeleteResource(id) {
  return authedFetch(`/resources/${id}`, { method: 'DELETE' });
}

export async function adminReorderResources(categoryId, orderedIds) {
  return authedFetch('/resources/reorder', { method: 'POST', body: JSON.stringify({ categoryId, orderedIds }) });
}
