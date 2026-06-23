# Data Analyst Portfolio

A premium, production-ready Data Analyst portfolio built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and shadcn/ui.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** components
- **Framer Motion** animations
- **Recharts** for interactive dashboards
- **React Hook Form** for contact form
- **next-themes** for dark/light mode
- **Lucide Icons**

## Features

- Dark mode by default with light mode toggle
- Glassmorphism UI with animated gradients
- Fully responsive design
- SEO optimized (metadata, Open Graph, sitemap, robots.txt)
- Interactive Power BI-style dashboard showcase
- Project detail pages with SQL queries, insights, and screenshots
- Markdown-powered blog with category filtering
- Command menu (Ctrl/Cmd + K)
- Custom cursor, scroll progress, back-to-top
- Framer Motion animations throughout

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customization

Replace placeholder data in the `/data` folder:

- `profile.ts` — Personal info, experience, education
- `skills.ts` — Skills and proficiency levels
- `projects.ts` — Portfolio projects
- `certifications.ts` — Certifications
- `blog.ts` — Blog articles
- `dashboard.ts` — Dashboard chart data

Update site config in `/constants/site.ts`.

Add your resume PDF to `/public/resume.pdf`.

## Deploy on Vercel

```bash
npm run build
```

Deploy to [Vercel](https://vercel.com) — zero configuration required.

## Project Structure

```
/app              — Pages and routes
/components       — UI and section components
  /ui             — shadcn/ui primitives
  /layout         — Navbar, footer, background
  /sections       — Page sections
  /animations     — Framer Motion wrappers
/data             — Placeholder content (easy to replace)
/constants        — Site config and navigation
/hooks            — Custom React hooks
/lib              — Utilities
/types            — TypeScript types
/public           — Static assets
```

## License

MIT
