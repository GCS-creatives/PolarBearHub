// Input validation + sanitization for anything an admin submits. Keeps
// bad/malicious data out of the Blobs store, since that JSON is served
// straight back to public visitors.

const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

export function isSafeUrl(value) {
  if (value === '#') return true; // explicit placeholder, allowed
  try {
    const u = new URL(value);
    return ALLOWED_PROTOCOLS.includes(u.protocol);
  } catch {
    return false;
  }
}

// Strips tags/script content; titles & descriptions are plain text
// everywhere in the UI (rendered as text, never as HTML), but we still
// scrub on the way in as defense in depth.
export function sanitizeText(value, { maxLength = 500 } = {}) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .trim()
    .slice(0, maxLength);
}

export function validateResource(input) {
  const errors = [];
  const title = sanitizeText(input.title, { maxLength: 120 });
  const url = typeof input.url === 'string' ? input.url.trim() : '';
  const categoryId = sanitizeText(input.categoryId, { maxLength: 100 });

  if (!title) errors.push('Resource name is required.');
  if (!url) errors.push('Link / URL is required.');
  else if (!isSafeUrl(url)) errors.push('That URL does not look valid or uses a disallowed protocol.');
  if (!categoryId) errors.push('Category is required.');

  const clean = {
    title,
    url,
    categoryId,
    description: sanitizeText(input.description || '', { maxLength: 300 }),
    icon: sanitizeText(input.icon || '', { maxLength: 40 }),
    imageUrl: input.imageUrl && isSafeUrl(input.imageUrl) ? input.imageUrl.trim() : '',
    keywords: Array.isArray(input.keywords)
      ? input.keywords.map((k) => sanitizeText(k, { maxLength: 40 })).filter(Boolean).slice(0, 15)
      : [],
    featured: Boolean(input.featured),
    active: input.active === undefined ? true : Boolean(input.active),
    order: Number.isFinite(input.order) ? input.order : 999,
  };

  return { errors, clean };
}

export function validateCategory(input) {
  const errors = [];
  const name = sanitizeText(input.name, { maxLength: 60 });
  if (!name) errors.push('Category name is required.');

  const clean = {
    name,
    description: sanitizeText(input.description || '', { maxLength: 200 }),
    icon: sanitizeText(input.icon || 'folder', { maxLength: 40 }) || 'folder',
    active: input.active === undefined ? true : Boolean(input.active),
    order: Number.isFinite(input.order) ? input.order : 999,
  };

  return { errors, clean };
}
