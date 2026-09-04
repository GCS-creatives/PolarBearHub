// CRUD for resource links, backed by Netlify Blobs (see utils/store.js).
// Route shape:
//   GET    /resources               -> all (admin) / active only (?scope=public)
//   POST   /resources               -> create (admin)
//   PUT    /resources/:id           -> update (admin)
//   DELETE /resources/:id           -> delete (admin)
//   POST   /resources/reorder       -> bulk reorder within a category (admin)
//                                       body: { categoryId, orderedIds: [...] }

import { connectLambda } from '@netlify/blobs';
import { readContent, writeContent } from './utils/store.js';
import { requireAdmin, json } from './utils/auth.js';
import { validateResource } from './utils/validate.js';

function segments(path) {
  return path.replace(/^.*\/resources\/?/, '').split('/').filter(Boolean);
}

export async function handler(event, context) {
  // Required for Netlify Blobs in classic Lambda-compatible functions -
  // without this, getStore() throws MissingBlobsEnvironmentError.
  connectLambda(event);

  const [idOrAction] = segments(event.path);
  const isPublic = event.httpMethod === 'GET' && event.queryStringParameters?.scope === 'public';

  if (!isPublic) {
    const auth = requireAdmin(context);
    if (!auth.ok) return json(auth.status, { error: auth.error });
  }

  try {
    if (event.httpMethod === 'GET') {
      const content = await readContent();
      const resources = [...content.resources].sort((a, b) => a.order - b.order);
      return json(200, isPublic ? resources.filter((r) => r.active) : resources);
    }

    if (event.httpMethod === 'POST' && idOrAction === 'reorder') {
      const { categoryId, orderedIds } = JSON.parse(event.body || '{}');
      const content = await readContent();
      const orderMap = new Map(orderedIds.map((id, i) => [id, i + 1]));
      const resources = content.resources.map((r) =>
        r.categoryId === categoryId && orderMap.has(r.id) ? { ...r, order: orderMap.get(r.id) } : r
      );
      await writeContent({ ...content, resources });
      return json(200, resources.filter((r) => r.categoryId === categoryId).sort((a, b) => a.order - b.order));
    }

    if (event.httpMethod === 'POST') {
      const { errors, clean } = validateResource(JSON.parse(event.body || '{}'));
      if (errors.length) return json(400, { error: errors.join(' ') });

      const content = await readContent();
      const categoryExists = content.categories.some((c) => c.id === clean.categoryId);
      if (!categoryExists) return json(400, { error: 'Choose a valid category.' });

      const resource = {
        id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        ...clean,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const resources = [...content.resources, resource];
      await writeContent({ ...content, resources });
      return json(201, resource);
    }

    if (event.httpMethod === 'PUT' && idOrAction) {
      const { errors, clean } = validateResource(JSON.parse(event.body || '{}'));
      if (errors.length) return json(400, { error: errors.join(' ') });

      const content = await readContent();
      let found = false;
      const resources = content.resources.map((r) => {
        if (r.id !== idOrAction) return r;
        found = true;
        return { ...r, ...clean, updatedAt: new Date().toISOString() };
      });
      if (!found) return json(404, { error: 'Resource not found.' });
      await writeContent({ ...content, resources });
      return json(200, resources.find((r) => r.id === idOrAction));
    }

    if (event.httpMethod === 'DELETE' && idOrAction) {
      const content = await readContent();
      const resources = content.resources.filter((r) => r.id !== idOrAction);
      if (resources.length === content.resources.length) {
        return json(404, { error: 'Resource not found.' });
      }
      await writeContent({ ...content, resources });
      return json(204, {});
    }

    return json(405, { error: 'Method not allowed.' });
  } catch (err) {
    console.error('resources function error:', err);
    return json(500, { error: 'Something went wrong saving to the Hub.' });
  }
}
