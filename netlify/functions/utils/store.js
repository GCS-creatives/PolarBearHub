// Netlify Blobs data-access helper. Everything the app persists lives in
// one JSON blob inside the "lowrance-hub-content" store, keyed as
// "content".
//
// Consistency note: we deliberately use the default *eventual* consistency
// here, not "strong". Strong consistency requires an "uncached edge URL"
// in the request context, which isn't reliably present for functions using
// the classic handler(event, context) signature ("Lambda compatibility
// mode") in production - it throws BlobsConsistencyError there even though
// it works fine locally under `netlify dev`. We don't actually need it:
// every write below returns the freshly-written object directly, so
// nothing in this app depends on immediately re-reading a value it just
// wrote. The only place this matters is the admin dashboard's list refresh
// after a save, which *could* lag up to ~60s behind under heavy edge-cache
// propagation delay in rare cases.

import { getStore, connectLambda } from '@netlify/blobs';

const STORE_NAME = 'lowrance-hub-content';
const CONTENT_KEY = 'content';

import { seedCategories, seedResources } from '../../../src/data/seed.js';

function store() {
  // NOTE: these functions use the classic handler(event, context) signature
  // ("Lambda compatibility mode"), which Netlify does NOT auto-configure
  // for Blobs. Each function handler must call connectLambda(event) first
  // (see categories.js / resources.js) - after that, getStore() here picks
  // up the resulting context automatically. No environment variables or
  // dashboard configuration needed.
  return getStore({ name: STORE_NAME });
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
