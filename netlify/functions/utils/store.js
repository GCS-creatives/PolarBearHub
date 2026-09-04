// Netlify Blobs data-access helper. Everything the app persists lives in
// one JSON blob inside the "lowrance-hub-content" store, keyed as
// "content". Reads use strong consistency so an admin sees their own
// writes immediately after saving.

import { getStore } from '@netlify/blobs';

const STORE_NAME = 'lowrance-hub-content';
const CONTENT_KEY = 'content';

import { seedCategories, seedResources } from '../../../src/data/seed.js';

function store() {
  // getStore() picks up NETLIFY_SITE_ID / NETLIFY_API_TOKEN automatically
  // when running inside a deployed Netlify Function or `netlify dev`.
  return getStore({ name: STORE_NAME, consistency: 'strong' });
}

export async function readContent() {
  const s = store();
  const existing = await s.get(CONTENT_KEY, { type: 'json' });
  if (existing) return existing;

  // First run: seed the blob so the site has something to show.
  const seeded = {
    categories: seedCategories,
    resources: seedResources,
    updatedAt: new Date().toISOString(),
  };
  await s.setJSON(CONTENT_KEY, seeded);
  return seeded;
}

export async function writeContent(content) {
  const s = store();
  const next = { ...content, updatedAt: new Date().toISOString() };
  await s.setJSON(CONTENT_KEY, next);
  return next;
}
