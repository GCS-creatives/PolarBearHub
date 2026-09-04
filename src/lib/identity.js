// Thin wrapper around the Netlify Identity widget (loaded via <script> in
// index.html). Registration is configured as Invite Only in the Netlify
// dashboard — see README.md. This file only manages the client-side
// widget/session; the actual admin-role check always happens again on the
// server in every Netlify Function (see netlify/functions/utils/auth.js).

let widget = null;

export function getIdentity() {
  if (!widget) {
    widget = window.netlifyIdentity;
    if (!widget) {
      throw new Error('Netlify Identity widget did not load. Check index.html script tag and network access.');
    }
  }
  return widget;
}

export function initIdentity({ onLogin, onLogout } = {}) {
  const id = getIdentity();
  id.init({});
  if (onLogin) id.on('login', onLogin);
  if (onLogout) id.on('logout', onLogout);
  return id;
}

export function openLogin() {
  getIdentity().open('login');
}

export function logout() {
  getIdentity().logout();
}

export function getCurrentUser() {
  return getIdentity().currentUser();
}

export function isAdmin(user) {
  const roles = user?.app_metadata?.roles || [];
  return roles.includes('admin');
}
