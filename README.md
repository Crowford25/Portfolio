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

The included projects are **clearly labeled examples**, with illustrative interfaces and sample data. None uses the projects from your earlier portfolio. Replace each example with real work and change `isExample` to `false` when the content is accurate. There are no invented clients, employment dates, testimonials, or outcome metrics. The combined career section uses your supplied education and employment history. Its `career` entries include responsibilities and tools, independently of the sample project collection.

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
