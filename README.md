# Polar Bear Hub

A GCS Creatives project by Grace Campbell-Sheran.

A visual, file-folder-themed hub of school links, built with React + Vite,
Netlify Functions, Netlify Blobs (data store), and Netlify Identity
(invite-only admin login).

## Project structure

```
src/
  components/   Reusable UI (Header, FolderCard, ResourceCard, mascot SVGs…)
  pages/        Home, CategoryPage, AdminLogin, AdminResources, AdminCategories
  lib/          api.js (data-access layer) + identity.js (Netlify Identity wrapper)
  data/seed.js  Placeholder sample content, used to seed the first Blobs write
netlify/functions/
  categories.js   CRUD for folders
  resources.js    CRUD for links
  utils/          auth.js (admin check), store.js (Blobs), validate.js
```

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Polar Bear Hub - initial scaffold"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 2. Connect the repo to Netlify

1. Netlify dashboard → **Add new site → Import an existing project**.
2. Pick your GitHub repo.
3. Build command: `npm run build`. Publish directory: `dist`.
   (Both are already set in `netlify.toml`, so Netlify should detect them automatically.)
4. Deploy.

## 3. Enable Netlify Identity (admin login)

1. Site settings → **Identity → Enable Identity**.
2. **Registration → set to "Invite only."** This is required — do not leave it open.
3. Under **Identity → Settings and usage → External providers**, none are required (email/password is fine), but you can add Google/Microsoft if your staff prefer it.
4. Invite yourself: Identity tab → **Invite users** → enter your email.
5. Accept the invite email, set a password.
6. **Grant the admin role:** Identity → click your user → Edit → add `admin` under
   **Roles**. Every write endpoint checks for this exact role (see
   `netlify/functions/utils/auth.js`), so a user without it can log in but
   cannot add, edit, or delete anything.

No passwords are stored by this app — Identity (built on GoTrue) handles all of that.

## 4. Netlify Blobs (the database)

Netlify Blobs works automatically for sites deployed on Netlify — there's
nothing to provision in the dashboard, **but** it does require one thing in
code: these functions use the classic `handler(event, context)` signature
("Lambda compatibility mode"), and Netlify does **not** auto-configure the
Blobs environment for that mode. Each function calls `connectLambda(event)`
(from `@netlify/blobs`) as its first line before touching the store — this
is already done in `categories.js` and `resources.js`. Skipping that call
is the most common cause of a `MissingBlobsEnvironmentError`, and it's a
code fix, not an environment variable or dashboard setting.

**Consistency:** the store uses Netlify Blobs' default *eventual*
consistency, not "strong." Strong consistency needs an "uncached edge URL"
in the request context that isn't reliably available to Lambda-compatible
functions in production (it throws `BlobsConsistencyError` there, even
though it works under `netlify dev` locally) — a known gap between Blobs'
strong-consistency mode and this function style. It isn't needed here
anyway: every write returns the freshly-written object directly, and the
admin dashboard merges that response straight into its own list instead of
re-fetching, so edits show up instantly regardless.

The app creates a store called `lowrance-hub-content` on first read and
seeds it with the sample categories/resources from `src/data/seed.js`.
From then on, every admin edit writes straight back to that same store.
(This store name is a technical identifier, not user-facing branding —
it's left as-is through the Polar Bear Hub rename so any content you've
already saved in production doesn't get orphaned under a new store name.)

If you ever want to reset content back to the seed data, delete the
`content` key from the `lowrance-hub-content` store in the Netlify dashboard
(Site → Blobs), or via the [Netlify Blobs CLI](https://docs.netlify.com/blobs/overview/).

## 5. Environment variables

None are required for local Netlify dev or deploys — `@netlify/blobs` and
the Identity JWT verification both work off of the site context Netlify
provides automatically. If you later add anything secret (e.g. a
third-party API key), set it under **Site settings → Environment
variables** and read it with `process.env.YOUR_KEY` inside a function —
never in frontend code.

## Local development

```bash
npm install
npm install -g netlify-cli   # once, if you don't have it
netlify dev
```

`netlify dev` runs Vite and the Netlify Functions together with a working
Blobs/Identity context, so the admin dashboard behaves like it will in
production. (Plain `vite dev` will run the UI, but writes will fail since
there's no functions/Blobs runtime behind it.)

## Design system

Colors, type, radii, and shadows are defined as CSS custom properties in
`src/index.css` (`--lh-blue-900`, `--lh-sticky`, `--lh-font-display`, etc.)
so the palette can be adjusted from one place.

## What's next

This scaffold covers the full data model, security rules (server-side admin
checks + input validation/sanitization on every write), and the folder/card
visual system from the brief. Natural next refinement passes:

- Swap the up/down reorder buttons for true drag-and-drop (keyboard controls already work independently)
- Add the animated "folder opens" transition on the home page
- Polish the mascot illustrations further / replace with commissioned art
- Wire up image thumbnails on resource cards when `imageUrl` is set

© 2026 Grace Campbell-Sheran • A GCS Creatives Project
