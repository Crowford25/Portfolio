# Wong Chee Chun — Portfolio

A complete Next.js App Router + React + TypeScript portfolio. Custom CSS, bundled fonts, responsive layouts, interactive product studies, generated case-study pages, contact links, and social preview metadata. No Vite, ESLint, or lint task.

## Run locally

Requires Node.js 20.9+ (tested with Node.js 22).

```powershell
npm install
npm run dev
```

Open http://localhost:3000. If port 3000 is occupied, use `npm run dev -- --port 3005`.

## Edit your content

**Start with `content/portfolio.json`.** This one file controls your public name, introduction, contacts, availability, project collection, case studies, skills, services, experience, and process. Changes refresh automatically while the development server is running.

Read **EDIT-CONTENT.md** for examples and a simple guide. VS Code offers suggestions and descriptions for the content file using the included schema. You do not need to modify React components to add projects.

The main work section contains Aureum Stays and Final Year Project. Aureum Stays is a solo project; the Final Year Project is a team project with responsibility for the Client module. The career section uses the supplied education and employment history. Keep new claims and contributions factual.

## Landing-page showcase

The former Interface studies section is replaced by a looping, globe-inspired cover carousel of AURELIA BATH, NOIR Auto Detail, KŌRI and PEKOLAND. Drag, previous/next controls and the keyboard let visitors explore it. Automatic motion can be paused, stops during interaction, and respects reduced motion. Clicking a cover opens a dialog with a Desktop/Mobile preview.

Edit **`content/landing-projects.json`** to change names, copy, covers, technology lists, preview paths and optional public links. Each entry needs a unique `slug`. Add another entry with the same fields to extend the carousel; no component change is needed.

- `cover` / `coverAlt`: the promotional cover image and its description.
- `previewUrl`: a local source-adapted demo under `public/landing-previews/`.
- `liveUrl`: leave empty until the original project has a real published URL; supplying one adds a live-project link.
- `summary` / `highlights` / `stack`: accurate descriptions of the original project.
- `previewNote`: explain the scope of the demonstration.

The covers are original generated artwork, not screenshots. Assets are in `public/projects/landing-pages/`; exact prompts and the built-in generation mode are recorded in `assets/landing-cover-prompts.json`.

The four previews adapt the original landing-page content, assets and design into lightweight demonstrations. They are not complete deployments or exact captures of the original applications. Interactions are local demonstrations and do not submit orders, bookings or contact forms. PEKOLAND is an unofficial fan project.

Each `public/landing-previews/<slug>/index.html` uses relative local assets so it can be embedded on GitHub Pages. The dialog isolates the demo in a sandboxed iframe and preserves the portfolio page underneath. The original source projects are not modified. Edit the demo HTML if you want to update what visitors can explore, or supply a published `liveUrl`.

## GitHub Pages deployment

The site is exported as static files for GitHub Pages. Pushing to `main` triggers `.github/workflows/deploy-next.yml`, which creates and deploys the `out/` directory. In the repository's **Settings → Pages**, select **GitHub Actions** as the source.

The workflow supplies `NEXT_PUBLIC_BASE_PATH=/Portfolio` and `NEXT_PUBLIC_SITE_URL=https://crowford25.github.io/Portfolio/`. Next.js uses the same base path for routes, image URLs and public-file links. Local development keeps an empty base path. The site is served at `https://crowford25.github.io/Portfolio/`.

Keep screenshot paths in `content/portfolio.json` as `/projects/...`. Components apply the deployment prefix through `src/lib/site-path.ts`; do not manually add `/Portfolio` to each content entry. External URLs and on-page anchors are preserved. Next.js Link components apply the base path automatically.

The social preview is a committed 1200×630 PNG at `public/og-image.png`, with an editable source at `assets/og-image.svg`. Open Graph and Twitter metadata point directly to this file. There is no ImageResponse route or image-generation server required on GitHub Pages. If you change the social card design or profile text, update the PNG too. The deployed image URL is `https://crowford25.github.io/Portfolio/og-image.png`.

The home page and project routes are prerendered; interactive React components still run in the browser. `npm start` is not used for this static-export deployment. Only README.md is published among Markdown files; other local guides remain ignored.

## Structure

| Location | Purpose |
| --- | --- |
| `content/portfolio.json` | Main editable content |
| `content/landing-projects.json` | Landing-page carousel content and preview links |
| `public/projects/landing-pages/` | Generated landing-page covers |
| `public/landing-previews/` | Source-adapted interactive demo pages |
| `src/components/landing-showcase.tsx` | Looping cover carousel and preview dialog |
| `content/project-template.json` | A blank project to copy into the projects list |
| `content/portfolio.schema.json` | Editor hints for the content |
| `public/projects/` | Your screenshots |
| `src/app/page.tsx` | Home page composition |
| `src/app/work/[slug]/page.tsx` | Automatic project pages |
| `src/app/globals.css` | Layout, colors, responsive design |
| `src/app/previews.css` | Illustrative product UI |
| `src/app/readability.css` | Typography refinements |
| `src/components/product-preview.tsx` | Interactive and decorative product studies |

Email opens the visitor’s mail application. WhatsApp opens a draft conversation to your number; nothing is sent automatically. No form service, account, database, API key, or subscription is needed.

Fonts are bundled locally through Fontsource (Manrope and Instrument Serif). The site does not request fonts from Google at runtime. The Surface/System refinement adds interface-to-architecture transitions, a flagship product story, touch gestures with button alternatives, and a connected process. Reduced motion removes animation and scroll-driven automatic state changes. See REFINEMENT.md for the component audit.
