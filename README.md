# OneTimeDrop

**Send files from your phone to any computer in 30 seconds — using a QR code or 8-digit session code. No app, no account, no email.**

## Quick Start (Local Dev)

```bash
# Install dependencies
npm install

# Start dev server (Next.js + Socket.IO unified)
npm run dev
# → http://localhost:3000
```

## How Sessions Work

1. **Computer opens** `onetimedrop.io` → server creates a session with:
   - Random 8-digit pairing code (valid 10 min)
   - Two secret session tokens (desktop + mobile)
   - Session ID stored in-memory only

2. **Phone scans** QR or enters code at `/join` → paired via Socket.IO
   - Rate-limited to 10 join attempts/min per IP
   
3. **Files upload** from phone → server `/tmp/onetimedrop/<sessionId>/` → desktop notified via WebSocket

4. **Session expires** after 10 minutes → cleanup worker deletes all files + session data

## Security Design

| Feature | Implementation |
|---|---|
| Code guessing protection | Rate limit: 10 attempts/min/IP |
| File URL protection | Session token required in header or query string |
| Default expiry | 10 minutes (configurable via SESSION_TTL) |
| File cleanup | Background worker runs every 60s |
| No user tracking | No accounts, no cookies, no analytics |
| Max file size | 50MB per file |
| Max files/session | 20 files |

## Where to Change Brand Colors

All colors are in **`tailwind.config.ts`** and **`app/globals.css`**:

| Token | Current value | Usage |
|---|---|---|
| `primary` | `#FFB86B` | Backgrounds, badges, QR border |
| `accent` | `#FF8A3D` | CTAs, buttons, links |
| `bg` | `#FFF7EF` | Page background |
| `border` | `#F0E6D9` | Card/input borders |

Dark mode colors are in `globals.css` under `.dark { ... }`.

## File Limits & Cleanup

- **Max file size:** 50MB per file
- **Max files per session:** 20
- **Session TTL:** 10 minutes
- **Cleanup interval:** Every 60 seconds
- **Storage location:** `/tmp/onetimedrop/<sessionId>/` (configurable via `UPLOAD_DIR` env var)
- Files are permanently deleted when session expires or when "Clear session" is clicked

## Environment Variables

```bash
# Optional — defaults shown
PORT=3000
HOSTNAME=localhost
UPLOAD_DIR=/tmp/onetimedrop
NEXT_PUBLIC_BASE_URL=https://onetimedrop.io
```

## Running in Production

```bash
# Build Next.js
npm run build

# Start (unified Next.js + Socket.IO server)
npm run start
# → NODE_ENV=production tsx server.ts
```

For production deployment, use a process manager like PM2:
```bash
npx pm2 start npm --name onetimedrop -- run start
```

Or containerize with Docker (Dockerfile not included but straightforward).

## Project Structure

```
/app              → Next.js App Router pages + API routes
  /api/upload     → File upload handler
  /api/download   → File download (protected)
  /api/download-all → ZIP download
  /blog           → Blog list + post pages
  /how-it-works   → How-it-works + FAQ page
  /join           → Mobile join page
  /privacy        → Privacy policy
  /terms          → Terms of service
  /contact        → Contact form
/components       → React components
  DesktopSession  → QR + code display, file manager
  MobileSession   → Join form + file uploader
  FileList        → File list with download buttons
  QRCode          → QR canvas renderer
  ui/             → Navbar, Footer, Toast, ThemeProvider
/content/blog     → 25 markdown blog posts + title ideas
/hooks            → useSocket, useConfetti
/lib
  sessionManager  → In-memory session store + token logic
  cleanup         → Periodic cleanup worker
  blog            → Markdown blog post reader
/server.ts        → Unified Next.js + Socket.IO server
```

## Self-Review Checklist

- [x] **Pairing** — 8-digit code + QR code, phone and desktop connect via Socket.IO
- [x] **QR** — Generated client-side with `qrcode` library, no external API
- [x] **Code** — Random 8-digit code, rate-limited join, short-lived (10 min)
- [x] **Upload** — Multi-file, per-file progress, size/type validation, 50MB limit
- [x] **Live sync** — FileAdded socket event updates desktop file list instantly
- [x] **Download** — Per-file download (token-protected), Download All as ZIP
- [x] **Expiry cleanup** — Cleanup worker runs every 60s, deletes expired sessions + files
- [x] **Mobile UX** — Thumb-friendly, upload zone with drag-drop, progress bars, status badges
- [x] **SEO** — Unique title/description/canonical per page, OG tags, Twitter tags, JSON-LD
- [x] **Sitemap/Robots** — `/sitemap.xml` includes all pages + blog posts; `/robots.txt` correct
- [x] **Blog** — 25 full posts (900–1400 words each), plus 30 extra title ideas in `_titles.generated.md`
- [x] **Dark mode** — Orange theme preserved, respects system preference
- [x] **Accessibility** — ARIA labels, focus rings, keyboard navigation, live regions for toasts
