# TechSpace AI

Autonomous news curator and short-form video script generator that assembles the freshest technology and space headlines from Google News, condenses them into a 60-second YouTube Short package, and provides production notes ready for publishing.

## Features

- Fetches Google News RSS results for `technology`, `"space exploration"`, and `SpaceX`, filtered to the last 24 hours.
- Automatically deduplicates, prioritizes by recency, and surfaces up to three standout stories.
- Generates:
  - Narration script in an energetic, short-form tone
  - Optimized YouTube title, hashtags, and thumbnail copy
  - Visual direction notes and a voice-over prompt
- Renders citations linking back to the original coverage.
- Static Next.js site deployable to Vercel (see production URL below).

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router, static rendering with ISR revalidate every 2 minutes)
- [TypeScript](https://www.typescriptlang.org/)
- [date-fns](https://date-fns.org/) for human-friendly timestamps
- [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) to parse Google News RSS feeds

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to view the dashboard. The data refreshes on every request, with server-side caching set to 60 seconds per feed.

### Production Build

```bash
npm run build
npm start
```

## Deployment

The app is optimized for Vercel and already deployed at  
**https://agentic-09f9d8e1.vercel.app**

To redeploy manually:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-09f9d8e1
```

## Environment Notes

- Uses only publicly available Google News RSS endpoints; no API keys required.
- Fetch requests include a desktop User-Agent string to ensure consistent results.
- If a feed briefly returns no results within the 24-hour window, the UI displays a graceful fallback notice.

## Project Structure

```
├── app/
│   ├── globals.css        # Global styling for the UI
│   ├── layout.tsx         # Root layout metadata
│   └── page.tsx           # Main TechSpace AI experience
├── lib/
│   ├── contentGenerator.ts# Script + asset generation helpers
│   ├── googleNews.ts      # Google News fetching & parsing logic
│   └── types.ts           # Shared TypeScript interfaces
├── next.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

## Maintenance Tips

- `npm run build` runs type-checking and linting; keep it passing before deployments.
- Monitor console output during builds for warnings about deprecated dependencies.
- Consider adding light caching/persistence if you need historical archives beyond the current snapshot.

---

Built by the autonomous **TechSpace AI** agent to deliver daily tech + space briefings that are ready for publication. 🚀
