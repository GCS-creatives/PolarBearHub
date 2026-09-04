// Server-side authorization. This is the ONLY place that decides whether a
// request may write data. It never trusts anything from the browser except
// the verified Netlify Identity JWT that Netlify itself attaches to
// `context.clientContext.user` for authenticated requests.

export function requireAdmin(context) {
  const user = context?.clientContext?.user;
  if (!user) {
    return { ok: false, status: 401, error: 'You must be signed in.' };
  }
  const roles = user.app_metadata?.roles || [];
  if (!roles.includes('admin')) {
    return { ok: false, status: 403, error: 'Your account does not have admin access.' };
  }
  return { ok: true, user };
}

export function json(status, body) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}
