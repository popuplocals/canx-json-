# Can X Global — website

Next.js 16 rebuild of [canxglobal.com](https://canxglobal.com) (Can X Global Solutions Inc., recruitment and immigration, Surrey BC).

- `app/` — routes. The home page and every service page are mirrored 1:1 from the live WordPress/Elementor site (`content/legacy/`), rendered inside the Next.js shell with a native header, footer, search and motion layer.
- `app/immigration-blogs/` and `content/posts/` — native blog (category pages, post layout, table of contents, FAQ).
- `components/shell/` — site header (mega menus, search, mobile sheet) and footer.
- `components/legacy/` — renders the mirrored Elementor pages and keeps their runtime working across client-side navigation.
- `public/wp-content/`, `public/wp-includes/` — vendored WordPress assets. Not linted.
- `redirects.json` — legacy URL redirects, loaded by `next.config.ts`.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Check and build

```bash
npm run lint
npm run build
npm start
```

The build prerenders every page (about 620 static routes).

## Deploy

Vercel project `canx-json` builds every push; pushes to `master` go to production. Preview hosts (`*.vercel.app`) send `X-Robots-Tag: noindex` so they never compete with canxglobal.com in search.

Known dependency: the mirrored pages' Elementor runtime still loads its widget chunk scripts (counter, toggle, text-editor, …) from `canxglobal.com/wp-content/plugins/elementor/assets/js/chunks/`. If the WordPress host is retired, copy that folder into `public/wp-content/plugins/elementor/assets/js/chunks/` and point `elementorFrontendConfig.urls.assets` in `content/legacy/_shared/` at the local path.
