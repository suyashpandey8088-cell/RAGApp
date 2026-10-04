# NEXUS — Research Intelligence

A premium, scroll-driven research workspace built with React, TypeScript, and Vite.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Backend integration

NEXUS never fabricates research answers or citations. Configure `VITE_API_URL` to point to the existing RAG service, or leave it blank when the frontend and API share an origin.

Expected endpoints:

- `POST /api/query` — accepts `{ "query": string }`; returns `{ "answer": string, "sources": Source[], "findings"?: string[] }`
- `GET /api/documents` — returns the authenticated user's document array
- `POST /api/documents` — accepts multipart files and returns created documents as an array or `{ "documents": [] }`

A source has the shape `{ id?, documentId?, title, page?, passage?, score? }`. If the research service is unavailable or returns no evidence, the UI reports insufficient evidence instead of generating a placeholder answer.

For Vercel, set `VITE_API_URL` in project environment variables to the public backend origin. Never place provider secrets in `VITE_*` variables.
