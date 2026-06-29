# Portfolio Owner Guide

Everything you need to run, customize, and deploy this site **without developer help**.  
Read sections in order for basics, or jump to any section you need.

---

## Table of contents

1. [How this site works (mental model)](#1-how-this-site-works-mental-model)
2. [Local development](#2-local-development)
3. [Project folder map](#3-project-folder-map)
4. [Change content the easy way (Admin Studio)](#4-change-content-the-easy-way-admin-studio)
5. [Change content by editing code](#5-change-content-by-editing-code)
6. [Feature-by-feature reference](#6-feature-by-feature-reference)
7. [Environment variables](#7-environment-variables)
8. [Vercel deployment](#8-vercel-deployment)
9. [Vercel CLI — install & env vars](#9-vercel-cli--install--env-vars)
10. [Supabase setup](#10-supabase-setup)
11. [Email (Resend) & contact form](#11-email-resend--contact-form)
12. [Newsletter](#12-newsletter)
13. [Resume PDF](#13-resume-pdf)
14. [Blog & projects workflow](#14-blog--projects-workflow)
15. [Styling & UI](#15-styling--ui)
16. [SEO & metadata](#16-seo--metadata)
17. [Advanced: add a new section](#17-advanced-add-a-new-section)
18. [Advanced: caching & revalidation](#18-advanced-caching--revalidation)
19. [Troubleshooting](#19-troubleshooting)
20. [Command cheat sheet](#20-command-cheat-sheet)

---

## 1. How this site works (mental model)

```
┌─────────────────────────────────────────────────────────────────┐
│  PUBLIC SITE (visitors)                                         │
│  /  /blog  /projects  /resume  /unsubscribe                     │
└────────────────────────────┬────────────────────────────────────┘
                             │ reads content
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  lib/*/repository.ts  (cached reads, 5 min)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│  Supabase Storage       │   │  data/*.ts fallbacks    │
│  (when configured)      │   │  (when Supabase off)    │
└─────────────────────────┘   └─────────────────────────┘
              ▲
              │ writes
┌─────────────────────────┐
│  ADMIN STUDIO /admin    │
│  (login required)       │
└─────────────────────────┘
```

**Three layers to know:**

| Layer | What it is | You change it by… |
|-------|------------|-------------------|
| **UI** | Pages & components in `app/` and `components/` | Admin Studio (preferred) or editing React files |
| **Logic** | `lib/` — fetch, save, email, auth | Rarely; only for new features |
| **Data** | Supabase Storage JSON + `data/` fallbacks | Admin Studio or editing `data/*.ts` |

**Tech stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Supabase, Resend (email).

---

## 2. Local development

### First-time setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
copy .env.example .env.local        # Windows
# cp .env.example .env.local        # Mac/Linux

# 3. Fill in .env.local (see Section 7)

# 4. Start dev server
npm run dev
```

Open **http://localhost:3000**

### Useful commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Production build (run before deploy to catch errors) |
| `npm run start` | Run production build locally |
| `npm run lint` | Check code style/errors |
| `npm run email:test` | Send a test email (Resend or SMTP) |
| `npm run newsletter:setup` | Setup newsletter secret + test email |
| `npm run newsletter:notify` | Email subscribers about latest blog post |
| `npm run blog:seed` | Upload bundled blog posts to Supabase |
| `npm run profile:seed` | Upload default avatar to Supabase |

---

## 3. Project folder map

```
my-portfolio-website/
├── app/                    # Pages & API routes (Next.js App Router)
│   ├── page.tsx            # Homepage (all sections)
│   ├── layout.tsx          # Root layout (navbar, footer, theme)
│   ├── blog/               # Blog list + [slug] post pages
│   ├── projects/           # Projects list + detail pages
│   ├── resume/             # Resume page (PDF embed or HTML)
│   ├── admin/              # Admin Studio (protected)
│   ├── api/                # Backend API endpoints
│   ├── sitemap.ts          # /sitemap.xml
│   └── robots.ts           # /robots.txt
│
├── components/
│   ├── sections/           # Homepage sections (hero, about, skills…)
│   ├── admin/              # Admin editors
│   ├── layout/             # Navbar, footer, newsletter form
│   ├── blog/               # Blog cards, filters, prose
│   ├── resume/             # Resume preview & actions
│   └── ui/                 # Buttons, inputs, cards (shadcn-style)
│
├── lib/                    # Server logic (the "brain")
│   ├── content/            # About, skills, contact, FAQs…
│   ├── blog/               # Blog storage & repository
│   ├── projects/           # Projects storage & repository
│   ├── resume/             # Resume upload & URLs
│   ├── newsletter/         # Subscribe, welcome, notify emails
│   ├── contact/            # Contact form submit
│   ├── mailer.ts           # Resend + SMTP email sender
│   ├── supabase/           # Supabase clients & auth
│   └── env.ts              # Public env vars with defaults
│
├── data/                   # Fallback content (used if Supabase off)
│   ├── profile.ts          # About / hero content
│   ├── skills.ts
│   ├── projects.ts
│   ├── blog.ts
│   ├── certifications.ts
│   ├── resume.ts           # HTML resume fallback text
│   └── misc.ts             # Testimonials, FAQs
│
├── constants/
│   ├── site.ts             # Site name, SEO keywords, social URLs
│   └── navigation.ts       # Nav links, command menu items
│
├── public/                 # Static files (images, resume.html)
├── scripts/                # CLI helpers (email test, seed, notify)
├── supabase/migrations/    # Database & storage SQL (run once)
├── .env.local              # Your secrets (never commit!)
└── .env.example            # Template for all env vars
```

---

## 4. Change content the easy way (Admin Studio)

### Login

1. Go to **https://your-domain.com/admin**
2. Sign in with the email that matches `ADMIN_EMAIL` in env vars
3. User must exist in **Supabase Auth → Users**

### What each admin page edits

| Admin URL | What you can change | Shows on site at |
|-----------|---------------------|------------------|
| `/admin/about` | Name, title, summary, experience, education, stats, avatar | `/#about`, hero |
| `/admin/skills` | Skill cards (name, level, icon, category) | `/#skills` |
| `/admin/projects` | Create/edit/delete project case studies | `/#projects`, `/projects` |
| `/admin/certifications` | Certificates & credentials | `/#certifications` |
| `/admin/blog` | Create/edit/delete blog posts | `/#blog`, `/blog` |
| `/admin/testimonials` | Quotes & recommendations | `/#testimonials` |
| `/admin/faqs` | FAQ questions & answers | `/#faq` |
| `/admin/contact` | Email, phone, location, social links, availability text | `/#contact` |
| `/admin/resume` | Upload PDF (+ optional Word file) | `/resume`, download links |

**Not editable in admin:** GitHub stats section (pulls live from GitHub API).

### After saving in admin

Changes save to **Supabase Storage** and the site cache refreshes automatically.  
If production still shows old content, **redeploy** or wait up to 5 minutes (cache TTL).

---

## 5. Change content by editing code

Use this when Supabase is not set up, or you want to change defaults.

### Site-wide settings

**File:** `constants/site.ts`

```ts
export const siteConfig = {
  name: "Abhishek Raj",
  title: "…",
  description: "…",
  // keywords, social links, etc.
};
```

### Navigation links

**File:** `constants/navigation.ts` — homepage section anchors, command menu (Ctrl+K).

### Fallback content (no Supabase)

| File | Content |
|------|---------|
| `data/profile.ts` | About, experience, education |
| `data/skills.ts` | Skills list |
| `data/projects.ts` | Projects |
| `data/blog.ts` | Blog posts |
| `data/certifications.ts` | Certifications |
| `data/misc.ts` | Testimonials, FAQs |
| `data/resume.ts` | HTML resume text (when no PDF uploaded) |

### Public env-based contact info

These override some display values (navbar, footer):

```
NEXT_PUBLIC_SITE_NAME
NEXT_PUBLIC_CONTACT_EMAIL
NEXT_PUBLIC_CONTACT_PHONE
NEXT_PUBLIC_CONTACT_LOCATION
NEXT_PUBLIC_LINKEDIN_URL
NEXT_PUBLIC_GITHUB_URL
```

Defined in `.env.local`, read via `lib/env.ts`.

### Static resume (no upload)

Place HTML resume at `public/resume.html` — used when no PDF exists in Supabase.

---

## 6. Feature-by-feature reference

### Homepage sections

| Section | Component | Data source |
|---------|-----------|-------------|
| Hero | `components/sections/hero.tsx` | About content + avatar |
| About | `components/sections/about.tsx` | `content/about.json` |
| Skills | `components/sections/skills.tsx` | `content/skills.json` |
| Projects preview | `components/sections/projects.tsx` | Projects manifest |
| Certifications | `components/sections/certifications.tsx` | `content/certifications.json` |
| GitHub | `components/sections/github.tsx` | Live GitHub API |
| Blog preview | `components/sections/blog.tsx` | Blog manifest |
| Testimonials | `components/sections/testimonials.tsx` | `content/testimonials.json` |
| FAQ | `components/sections/faq.tsx` | `content/faqs.json` |
| Contact | `components/sections/contact.tsx` | `content/contact.json` + form API |

Homepage assembles them in `app/page.tsx`.

### Contact form

- **UI:** `components/sections/contact.tsx`
- **API:** `POST /api/contact`
- **Logic:** `lib/contact/submit.ts`
- **Needs:** Resend (or SMTP) to email you; optional Supabase to store messages in `contact_messages` table

### Newsletter (footer)

- **UI:** `components/layout/newsletter-form.tsx`
- **Subscribe API:** `POST /api/newsletter/subscribe`
- **Unsubscribe:** `/unsubscribe` page → `POST /api/newsletter/unsubscribe`
- **Needs:** Resend + subscriber storage (Supabase recommended)

### Blog

- **List:** `app/blog/page.tsx`
- **Post:** `app/blog/[slug]/page.tsx`
- **Storage bucket:** `blog` — `manifest.json` + `posts/{slug}.json`
- **Markdown:** rendered via `lib/blog.ts` (remark)

### Projects

- **List:** `app/projects/page.tsx`
- **Detail:** `app/projects/[slug]/page.tsx`
- **Storage bucket:** `projects` — `manifest.json` + `items/{slug}.json`

### Resume

- **Page:** `app/resume/page.tsx`
- **PDF storage:** `portfolio` bucket → `resume/resume.pdf`
- **Cache busting:** URL gets `?v=timestamp` from file `updated_at` so new uploads show immediately

### Auth (admin only)

- **Middleware:** `middleware.ts` → protects `/admin/*` and `/api/admin/*`
- **Rule:** logged-in user email must equal `ADMIN_EMAIL`

---

## 7. Environment variables

Copy `.env.example` → `.env.local` and fill in values.

### Public (safe in browser)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Live site URL (required in production) |
| `NEXT_PUBLIC_SITE_NAME` | Your display name |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown on site & email reply-to |
| `NEXT_PUBLIC_CONTACT_PHONE` | Phone on contact section |
| `NEXT_PUBLIC_CONTACT_LOCATION` | Location text |
| `NEXT_PUBLIC_LINKEDIN_URL` | LinkedIn link |
| `NEXT_PUBLIC_GITHUB_URL` | GitHub link |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key |

### Secret (server only — never expose)

| Variable | Purpose |
|----------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | Server writes to storage/DB |
| `ADMIN_EMAIL` | Only this email can access `/admin` |
| `RESEND_API_KEY` | Resend email API key |
| `RESEND_FROM` | Sender address, e.g. `Name <hello@yourdomain.com>` |
| `NEWSLETTER_NOTIFY_SECRET` | Protects blog notify API/script |
| `GITHUB_TOKEN` | Optional — higher GitHub API rate limits |
| `SMTP_*` | Optional fallback if not using Resend |
| `UPSTASH_REDIS_REST_URL` | Optional newsletter storage |
| `UPSTASH_REDIS_REST_TOKEN` | Optional newsletter storage |
| `BLOB_READ_WRITE_TOKEN` | Optional Vercel Blob storage |

### Minimum for full production

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_EMAIL
RESEND_API_KEY
RESEND_FROM
```

---

## 8. Vercel deployment

### Connect repo (one time)

1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import `my-portfolio-website` repo
4. Framework: **Next.js** (auto-detected)
5. Deploy

### After every code change

Push to GitHub → Vercel auto-deploys (if connected).

Or manually:

```bash
npx vercel --prod
```

### Add env vars via Vercel website

> **Important:** Use **project** settings, not the team sidebar overview.

1. Open [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project **`my-portfolio-website`** (the project card)
3. Go to **Settings** → **Environment Variables**
4. Click **Add Environment Variable**
5. Enter **Key** and **Value**
6. Select environments: **Production**, **Preview**, **Development** (as needed)
7. Click **Save**
8. **Redeploy** — Deployments → latest → **⋯** → **Redeploy**

> The team-level **Environment Variables** page (left sidebar) lists variables but may not show an Add button. Always use the **project** Settings page above.

### Pull env from Vercel to local

```bash
npx vercel env pull .env.local
```

### Push all local env to production (script)

If you have values in `.env.local`:

```bash
node scripts/push-vercel-env.mjs
```

Then redeploy.

---

## 9. Vercel CLI — install & env vars

### Install CLI

**Option A — use without installing (recommended):**

```bash
npx vercel
```

**Option B — install globally:**

```bash
npm install -g vercel
vercel --version
```

### Login & link project

```bash
cd C:\Users\rajab\Desktop\my-portfolio-website

# Login (opens browser)
npx vercel login

# Link to existing Vercel project (first time)
npx vercel link
```

Follow prompts — select your team and `my-portfolio-website` project.

### Add a single env var to Production

```bash
npx vercel env add RESEND_API_KEY production
```

CLI will ask:
1. **Mark as sensitive?** → `yes` (recommended for secrets)
2. **Value** → paste your API key

Repeat for each variable:

```bash
npx vercel env add RESEND_FROM production
npx vercel env add NEXT_PUBLIC_SITE_URL production
npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
# … etc.
```

### Add env var to multiple environments

Run once per environment:

```bash
npx vercel env add RESEND_API_KEY preview
npx vercel env add RESEND_API_KEY development
```

### List env vars

```bash
# All environments
npx vercel env ls

# Production only
npx vercel env ls production
```

### Remove an env var

```bash
npx vercel env rm RESEND_API_KEY production --yes
```

### Redeploy after env changes

Env vars only apply to **new** deployments:

```bash
npx vercel --prod
```

Or redeploy from the Vercel dashboard.

### Deploy commands summary

| Command | Purpose |
|---------|---------|
| `npx vercel` | Preview deployment |
| `npx vercel --prod` | Production deployment |
| `npx vercel env ls` | List all env vars |
| `npx vercel env add KEY production` | Add var to production |
| `npx vercel env pull .env.local` | Download env to local file |
| `npx vercel logs` | View deployment logs |

---

## 10. Supabase setup

### One-time setup

1. Create project at [supabase.com](https://supabase.com)
2. In **SQL Editor**, run migrations in order:
   - `supabase/migrations/001_portfolio_schema.sql` — tables (newsletter, contact)
   - `supabase/migrations/002_blog_storage_bucket.sql` — blog bucket
   - `supabase/migrations/003_projects_storage_bucket.sql` — projects bucket
   - `supabase/migrations/004_portfolio_storage_bucket.sql` — portfolio bucket
3. Copy keys from **Settings → API** into `.env.local`:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY`
4. **Authentication → Users → Add user** with email = `ADMIN_EMAIL`, set password
5. Seed optional content:

```bash
npm run blog:seed
npm run profile:seed
```

### Storage buckets

| Bucket | Stores |
|--------|--------|
| `portfolio` | about, skills, contact, FAQs, testimonials, certifications JSON; resume PDF |
| `blog` | blog posts, manifest, blog images, avatar |
| `projects` | project items, manifest, project images |

### Database tables

| Table | Purpose |
|-------|---------|
| `newsletter_subscribers` | Email subscribers |
| `contact_messages` | Contact form submissions (optional archive) |

---

## 11. Email (Resend) & contact form

### Setup Resend

1. Sign up at [resend.com](https://resend.com)
2. **Domains** → add `abhishekshrivastav.co.in` → add DNS records
3. **API Keys** → create key
4. Add to `.env.local` and Vercel:

```
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM=Abhishek Raj <hello@abhishekshrivastav.co.in>
```

### Test email

```bash
npm run email:test
```

### How contact form works

1. Visitor submits form on `/#contact`
2. `POST /api/contact` validates fields
3. If Supabase configured → saves to `contact_messages`
4. If Resend configured → emails you at `NEXT_PUBLIC_CONTACT_EMAIL` with `replyTo` = visitor's email

### Email priority

`lib/mailer.ts` uses **Resend first**, SMTP as fallback.

---

## 12. Newsletter

### What happens when someone subscribes

1. Footer form → `POST /api/newsletter/subscribe`
2. Email saved to Supabase (`newsletter_subscribers`)
3. Welcome email sent via Resend

### Notify subscribers about a new blog post

After publishing a post in admin:

```bash
npm run newsletter:notify
```

Or call API:

```bash
curl -X POST "https://your-domain.com/api/newsletter/notify" \
  -H "Authorization: Bearer YOUR_NEWSLETTER_NOTIFY_SECRET"
```

### Setup newsletter (first time)

```bash
npm run newsletter:setup
```

Creates `NEWSLETTER_NOTIFY_SECRET` in `.env.local` if missing and sends test email.

### Unsubscribe

Visitors go to `/unsubscribe?email=their@email.com` or use link in emails.

---

## 13. Resume PDF

### Upload via admin

1. `/admin/resume` → **Upload PDF**
2. File stored at `portfolio/resume/resume.pdf` (overwrites previous)
3. Public URL includes `?v=timestamp` to bust CDN cache

### If PDF shows old version in production

- Redeploy after code updates
- Hard refresh browser (`Ctrl+Shift+R`)
- Re-upload PDF from admin

### Fallback

Without PDF: site shows built-in HTML resume from `data/resume.ts` or `public/resume.html`.

---

## 14. Blog & projects workflow

### Create a blog post

1. `/admin/blog` → **New post**
2. Fill title, slug, category, markdown content, cover image
3. **Publish** → saved to Supabase `blog` bucket
4. Run `npm run newsletter:notify` to email subscribers

### Create a project

1. `/admin/projects` → **New project**
2. Fill case study fields, upload images
3. **Save** → appears on homepage and `/projects`

### Blog categories

Edit in `constants/blog.ts` → `BLOG_CATEGORIES`.

---

## 15. Styling & UI

| What | Where |
|------|-------|
| Global CSS, theme colors | `app/globals.css` |
| Tailwind config | `postcss.config.mjs` + CSS variables in `globals.css` |
| UI components (Button, Card…) | `components/ui/` |
| Section layout & animations | `components/sections/`, `components/animations/` |
| Dark/light mode | `next-themes` in root layout |

### Change brand colors

Edit CSS variables in `app/globals.css` (`--primary`, `--secondary`, etc.).

### Icons

Uses **Lucide React** — browse icons at [lucide.dev](https://lucide.dev).

---

## 16. SEO & metadata

| File | Purpose |
|------|---------|
| `constants/site.ts` | Default title, description, keywords |
| `lib/seo/metadata.ts` | `pageMetadata()` helper for pages |
| `lib/seo/json-ld.ts` | Structured data (JSON-LD) |
| `app/sitemap.ts` | Auto sitemap |
| `app/robots.ts` | Crawler rules (blocks `/admin`, `/api`) |
| `app/opengraph-image.tsx` | Social share image |

Per-page metadata: each `app/**/page.tsx` exports `metadata` or `generateMetadata`.

---

## 17. Advanced: add a new section

Example: add a "Services" section to the homepage.

1. **Type** — add interface in `lib/content/types.ts`
2. **Default data** — add to `data/` and `lib/content/defaults.ts`
3. **Storage path** — add to `lib/content/constants.ts` (`CONTENT_PATHS`, `CONTENT_CACHE_TAGS`)
4. **Repository** — add getter in `lib/content/repository.ts`
5. **Admin API** — ensure `app/api/admin/content/[section]/route.ts` includes your section
6. **Admin editor** — create `components/admin/services-content-editor.tsx`
7. **Admin page** — `app/admin/services/page.tsx`
8. **Public component** — `components/sections/services.tsx` + loader
9. **Homepage** — import section in `app/page.tsx`
10. **Navigation** — add anchor in `constants/navigation.ts`

---

## 18. Advanced: caching & revalidation

### Content cache

Most reads use `unstable_cache` with **5-minute** TTL and cache tags.

### After admin saves

API routes call:

```ts
revalidateTag("content-about", "max");
revalidatePath("/");
```

### Cache tags reference

| Tag | Content |
|-----|---------|
| `content-about` | About section |
| `content-skills` | Skills |
| `content-contact` | Contact info |
| `blog-posts` | Blog |
| `projects` | Projects |
| `resume-files` | Resume assets |
| `profile-avatar` | Profile photo |

### Force fresh data in dev

Restart `npm run dev` or save in admin (triggers revalidation).

---

## 19. Troubleshooting

| Problem | Fix |
|---------|-----|
| Admin login fails | Check `ADMIN_EMAIL` matches Supabase Auth user email |
| Admin saves but site unchanged | Wait 5 min or redeploy; check Supabase keys |
| Contact form 503 | Add `RESEND_API_KEY` + `RESEND_FROM`, redeploy |
| Newsletter 503 | Same as above + ensure Supabase subscriber table exists |
| Resume shows old PDF | Re-upload; hard refresh; check `?v=` in URL |
| Env vars not working on Vercel | Redeploy after adding vars; use project Settings not team overview |
| Build fails locally | Run `npm run build` and read error; often missing env var |
| Images not loading | Check `next.config.ts` `remotePatterns` for your image host |
| GitHub stats empty | Add `GITHUB_TOKEN` or wait (rate limited) |

### Check production logs

Vercel → Project → **Logs** (Runtime / Build)

### Test email locally

```bash
npm run email:test
```

---

## 20. Command cheat sheet

```bash
# Development
npm install
npm run dev
npm run build

# Email
npm run email:test
npm run newsletter:setup
npm run newsletter:notify

# Seed Supabase
npm run blog:seed
npm run profile:seed

# Vercel CLI
npx vercel login
npx vercel link
npx vercel env add RESEND_API_KEY production
npx vercel env ls production
npx vercel env pull .env.local
npx vercel --prod
```

---

## Quick decision guide

| I want to… | Do this |
|------------|---------|
| Change my bio / experience | `/admin/about` |
| Add a blog post | `/admin/blog` → New |
| Upload new resume | `/admin/resume` |
| Change site name in Google results | `constants/site.ts` + `NEXT_PUBLIC_SITE_NAME` |
| Fix contact form emails | Set Resend env vars, redeploy |
| Add env var to production | Vercel project Settings **or** `npx vercel env add` |
| Change navbar links | `constants/navigation.ts` |
| Change colors / theme | `app/globals.css` |
| Reset to default content | Remove JSON from Supabase storage; site falls back to `data/` |

---

*Last updated for: Next.js 16, Resend email, Supabase storage backend.*
