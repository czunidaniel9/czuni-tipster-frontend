# Football Tipster — Frontend

Next.js 14 dashboard for the Football Tipster backend. Dark-mode-by-default,
production-ready, deploys to Vercel in three clicks.

## Five pages

| Page | Path | What it shows |
|---|---|---|
| **Today's Tips** | `/tips` | The headline. Up to 2 cards with confidence ring, market, recommendation, LLM explanation, supporting arguments, risk factors. |
| **Fixtures** | `/fixtures` | Every fixture on a chosen date, grouped by competition. |
| **Teams** | `/teams` and `/teams/[id]` | Searchable team directory + per-team feature snapshots (form, goals, splits, clean sheets). |
| **History** | `/history` | Tips published on any past date. Shows pending status everywhere until Phase 5 lands. |
| **Calibration** | `/calibration` | Predicted-vs-actual chart. Skeleton ready, fills in once Phase 5 settles tip outcomes. |

## Tech stack

- **Next.js 14** with the App Router
- **TypeScript** in strict mode, with `noUncheckedIndexedAccess`
- **Tailwind CSS** 3.4
- **shadcn/ui** (new-york style, zinc base) — components are pre-included in
  `src/components/ui/`, so there's no `npx shadcn init` step
- **TanStack Query** for client-side data fetching, caching, refetching
- **Zod** for runtime validation of API responses (mirrors backend Pydantic)
- **Recharts** for the calibration chart
- **lucide-react** for icons
- **date-fns** for date formatting

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. Configure the API URL
cp .env.local.example .env.local
# .env.local should contain:
#   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# 3. Make sure the backend is running (separate project)
#    See football-tipster/README.md — typically `docker compose up`

# 4. Start the dev server
npm run dev
```

Open <http://localhost:3000>. You'll be redirected to `/tips`.

> **Empty state on first load?** Means the backend has no tips yet. Run
> the full pipeline once via the backend's Makefile: `make pipeline`.
> Then refresh.

## Project layout

```
src/
├── app/                    # App Router pages
│   ├── layout.tsx          # Side nav + providers + dark theme
│   ├── page.tsx            # Redirects to /tips
│   ├── providers.tsx       # TanStack Query client
│   ├── globals.css         # Tailwind layers + shadcn CSS variables
│   ├── tips/page.tsx       # Today's tips (headline)
│   ├── fixtures/page.tsx   # Fixtures browser
│   ├── teams/
│   │   ├── page.tsx        # Team search
│   │   └── [id]/page.tsx   # Team detail with features
│   ├── history/page.tsx    # Past tips
│   └── calibration/page.tsx
│
├── components/
│   ├── nav.tsx             # SideNav (desktop) + TopBar (mobile)
│   ├── tip-card.tsx        # Full tip display
│   ├── fixture-row.tsx     # One row in a fixture list
│   ├── confidence-ring.tsx # SVG circular indicator
│   ├── empty-state.tsx     # Reusable empty/error UI
│   └── ui/                 # shadcn primitives (button, card, badge, etc)
│
└── lib/
    ├── api.ts              # Typed fetch wrappers
    ├── types.ts            # Zod schemas + inferred TypeScript types
    ├── format.ts           # Date / percentage / label helpers
    └── utils.ts            # cn() class-merge helper
```

## Available scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check without emitting |

## Deploying to Vercel

1. Push this folder to a GitHub repo
2. Sign in to <https://vercel.com> → "Add New Project" → pick the repo
3. Vercel auto-detects Next.js. The default settings are correct.
4. Add an environment variable:
   - `NEXT_PUBLIC_API_BASE_URL` = your backend's public URL (Railway/Fly)
5. Click **Deploy**. Done.

> **Important:** the backend must allow CORS from your Vercel domain. The
> backend's `app/main.py` already includes `localhost:3000` — add your
> production Vercel URL there (e.g. `https://your-app.vercel.app`) and
> redeploy the backend.

## Adding more shadcn components later

The pre-included primitives (Button, Card, Badge, Input, Skeleton,
Separator) cover everything used here. If you want more:

```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

The `components.json` config is already wired up.
