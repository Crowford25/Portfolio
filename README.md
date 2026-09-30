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

## Verify and build

```powershell
npm run typecheck
npm run build
npm start
```

Build again after changing content for a production deployment. The home page and project routes are prerendered. Most content is rendered on the server. Small client components handle navigation, product stories, capability disclosures, process highlighting, the optional experiment, and email copying.

Before deploying, set `NEXT_PUBLIC_SITE_URL` to your real public URL in your hosting environment (or copy `.env.example` to `.env.local`). This makes the generated social preview image URL point to the correct domain.

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
