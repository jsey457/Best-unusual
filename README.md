# Kalshi Flow — Deploy to Vercel

No API key needed. The proxy just adds CORS headers so your browser can
talk to Kalshi's public API.

---

## Deploy (~5 minutes)

### 1. Put on GitHub
- Go to github.com → **+** → **New repository** → name it `kalshi-flow` → **Private** is fine → Create
- Click **uploading an existing file**
- Upload ALL files keeping this structure:
  ```
  kalshi-flow/
  ├── vercel.json
  ├── api/
  │   └── proxy.js
  └── public/
      └── index.html
  ```
- Commit changes

### 2. Deploy on Vercel
- Go to vercel.com → **Add New → Project** → Import your `kalshi-flow` repo
- Leave all settings as default
- Click **Deploy** (~30 seconds)

### 3. Done
Your site is live at `https://kalshi-flow.vercel.app` (or similar).
Bookmark it. No API key needed — the proxy is fully public.

---

## How it works
```
Browser → /api/proxy?path=/markets/trades
              ↓
        Vercel Edge Function
        (adds CORS header)
              ↓
        api.elections.kalshi.com  (public, no auth)
```
