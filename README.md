# Business OS SaaS Frontend

React/Vite frontend for a Supabase-powered multi-business SaaS dashboard.

## Setup

1. Install Node.js LTS.
2. Run:

```bash
npm install
copy .env.example .env
npm run dev
```

On Mac/Linux use:

```bash
cp .env.example .env
```

3. Put your real `VITE_SUPABASE_ANON_KEY` inside `.env`.

## Netlify

Build command:

```bash
npm run build
```

Publish directory:

```bash
dist
```

Add these environment variables in Netlify:

```env
VITE_SUPABASE_URL=https://uhrtawnxfnwdikwhwkho.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key
```
