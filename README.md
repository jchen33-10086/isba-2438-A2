# ISBA 2438 — Assignment 2 Portfolio

Personal portfolio website for Jiaxing Chen (MSBA, Santa Clara University), built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Run

```bash
npm install
npm run dev        # development, http://localhost:3000
npm run build      # production build
npm start          # serve production build
```

## Pages

| Route | Description |
| --- | --- |
| `/` | Homepage |
| `/about-me` | Bio and skills |
| `/projects`, `/projects/[slug]` | Portfolio projects (server JSON, dynamic routes) |
| `/blogs`, `/blogs/[slug]` | Blog posts (server JSON, dynamic routes) |
| `/resources` | Learning-resource library (server JSON) |
| `/interview` | Personal interview-question shortlist (saved in browser localStorage only) |
| `/contact-me`, `/contact-me-server-form` | Contact forms (server action / API), saved to server JSON |
| `/admin` | Hub for managing blogs, contacts, projects, and resources |

## Admin (full CRUD)

`/admin/blogs`, `/admin/contacts`, `/admin/projects`, `/admin/resources` — create, read, update, and delete through the UI and the matching API routes.

## API

`/api/blogs` (+ `/[slug]`), `/api/contact` (+ `/[id]`), `/api/projects` (+ `/[slug]`), `/api/resources` (+ `/[id]`) — GET, POST, PUT, DELETE. Creates return **201**. Every response is logged as `[api] METHOD /path -> status`.

## Data

- Server entities are stored in `data/*.json` (`blogs.json`, `messages.json`, `projects.json`, `resources.json`).
- The interview shortlist is stored per-browser in localStorage and never leaves the device.
- Validation runs server-side for all API writes: required text fields cannot be blank after trimming, emails must contain one `@` with text before it and a dotted domain without spaces, resource URLs must be valid http(s) links.

## Demo

1. `npm run build && npm start`
2. Open `/admin/resources` to add a learning resource (title, URL, topic, notes).
3. Open `/resources` to see it listed; click through to the source link.
4. Open `/admin/contacts` to review contact submissions (edit/delete).
5. Open `/interview` to add questions, mark them asked, and refresh the page to see persistence.
