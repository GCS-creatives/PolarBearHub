// CRUD for categories, backed by Netlify Blobs (see utils/store.js).
// Route shape (Netlify passes anything after /categories/ in event.path):
//   GET    /categories               -> all categories (admin) / active only (?scope=public)
//   POST   /categories               -> create (admin)
//   PUT    /categories/:id           -> update (admin)
//   DELETE /categories/:id           -> delete (admin, blocked if resources still assigned)
//   POST   /categories/reorder       -> bulk reorder (admin)  body: { orderedIds: [...] }

import { readContent, writeContent } from './utils/store.js';
import { requireAdmin, json } from './utils/auth.js';
import { validateCategory } from './utils/validate.js';

function segments(path) {
  return path.replace(/^.*\/categories\/?/, '').split('/').filter(Boolean);
}

export async function handler(event, context) {
  const [idOrAction] = segments(event.path);
  const isPublic = event.httpMethod === 'GET' && event.queryStringParameters?.scope === 'public';

  if (!isPublic) {
    const auth = requireAdmin(context);
    if (!auth.ok) return json(auth.status, { error: auth.error });
  }

  try {
    if (event.httpMethod === 'GET') {
      const content = await readContent();
      const categories = [...content.categories].sort((a, b) => a.order - b.order);
      return json(200, isPublic ? categories.filter((c) => c.active) : categories);
    }

    if (event.httpMethod === 'POST' && idOrAction === 'reorder') {
      const { orderedIds } = JSON.parse(event.body || '{}');
      const content = await readContent();
      const orderMap = new Map(orderedIds.map((id, i) => [id, i + 1]));
      const categories = content.categories.map((c) =>
        orderMap.has(c.id) ? { ...c, order: orderMap.get(c.id) } : c
      );
      await writeContent({ ...content, categories });
      return json(200, categories.sort((a, b) => a.order - b.order));
    }

    if (event.httpMethod === 'POST') {
      const { errors, clean } = validateCategory(JSON.parse(event.body || '{}'));
      if (errors.length) return json(400, { error: errors.join(' ') });

      const content = await readContent();
      const id = clean.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
      if (content.categories.some((c) => c.id === id)) {
        return json(409, { error: 'A category with a very similar name already exists.' });
      }
      const category = {
        id,
        ...clean,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const categories = [...content.categories, category];
      await writeContent({ ...content, categories });
      return json(201, category);
    }

    if (event.httpMethod === 'PUT' && idOrAction) {
      const { errors, clean } = validateCategory(JSON.parse(event.body || '{}'));
      if (errors.length) return json(400, { error: errors.join(' ') });

      const content = await readContent();
      let found = false;
      const categories = content.categories.map((c) => {
        if (c.id !== idOrAction) return c;
        found = true;
        return { ...c, ...clean, updatedAt: new Date().toISOString() };
      });
      if (!found) return json(404, { error: 'Category not found.' });
      await writeContent({ ...content, categories });
      return json(200, categories.find((c) => c.id === idOrAction));
    }

    if (event.httpMethod === 'DELETE' && idOrAction) {
      const content = await readContent();
      const stillAssigned = content.resources.some((r) => r.categoryId === idOrAction);
      if (stillAssigned) {
        return json(409, { error: 'Reassign or remove this category\u2019s resources before deleting it.' });
      }
      const categories = content.categories.filter((c) => c.id !== idOrAction);
      if (categories.length === content.categories.length) {
        return json(404, { error: 'Category not found.' });
      }
      await writeContent({ ...content, categories });
      return json(204, {});
    }

    return json(405, { error: 'Method not allowed.' });
  } catch (err) {
    console.error('categories function error:', err);
    return json(500, { error: 'Something went wrong saving to the Hub.' });
  }
}
