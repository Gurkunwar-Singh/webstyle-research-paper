# Web Pattern Analyzer

> Automated UX design pattern extraction from live websites using a headless browser pipeline.
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful tool to analyze any website's design patterns including colors, typography, accessibility, and layout.
---

## What it does

Web Pattern Analyzer crawls any live URL with a headless Puppeteer browser and extracts structured design intelligence — no manual inspection, no external ML services.

**Extracted dimensions:**

| Dimension | Description |
|---|---|
| Color palette | K-means clustering on RGB values from computed DOM styles |
| Semantic theme | Background, text, and border colors per page zone (nav, header, buttons…) |
| Visual hierarchy | Top 20 elements ranked by size × position × contrast weight |
| Brand colors | Logo/hero dominant color signals |
| CSS framework | Bootstrap, Tailwind, Bulma, Foundation fingerprinting |
| Typography scale | Font sizes, modular scale ratio, primary family and weight |
| Accessibility | WCAG 2.1 contrast pairs, average contrast ratio |
| Layout patterns | Grid columns, flexbox direction, spacing tokens |

---

## Tech stack

- **Runtime** — Node.js 18+
- **Language** — TypeScript
- **Server** — Express.js (stateless REST API)
- **Browser automation** — Puppeteer (headless Chromium)
- **Logging** — Winston
- **Config** — dotenv

---

## Project structure

```
src/
├── server.ts               # Express app entry point
├── type.ts                 # Shared TypeScript types
├── routes/
│   └── route.ts            # /health and /extract-theme endpoints
├── puppeteer/
│   └── BrowserPool.ts      # Round-robin browser instance pool
└── utils/
    ├── helpers.ts           # validateUrl, autoScroll, withTimeout, delay
    └── logger.ts            # Winston logger (file + console)
```

---

## Getting started

### Prerequisites

- Node.js v18 or higher
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Install Puppeteer's Chrome

```bash
npx puppeteer browsers install chrome
```

### 3. Configure environment

Create a `.env` file in the project root:

```env
PORT=3000
BROWSER_INSTANCES=2
BROWSER_INSTANCE_DEBUG_PORT=9222
ENVIRONMENT=development
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP server port |
| `BROWSER_INSTANCES` | `2` | Number of browser instances in the pool |
| `BROWSER_INSTANCE_DEBUG_PORT` | `9222` | Starting port for Chrome DevTools (dev only) |
| `ENVIRONMENT` | `production` | Set to `development` to expose debug ports in responses |

### 4. Run

```bash
# Development (auto-reload on save)
npm run dev

# Production build
npm run build
npm start
```

You should see:

```
info: Theme Extraction API Server listening on port 3000
```

---

## API reference

### `GET /health`

Returns server status.

**Response**

```json
{
  "status": "healthy",
  "timestamp": "2026-04-29T09:00:00.000Z",
  "uptime": 42.3
}
```

---

### `POST /extract-theme`

Extracts UX design patterns from a live URL.

**Request**

```json
{
  "url": "https://example.com"
}
```

**Response**

```json
{
  "style": {
    "colorPalette": ["rgb(255, 255, 255)", "rgb(0, 0, 0)", "..."],
    "semanticTheme": {
      "navigation": { "background-color": "...", "color": "...", "font-family": "..." },
      "headings": { "color": "...", "font-size": "30px", "font-weight": "700" }
    },
    "visualHierarchy": [
      { "selector": "div.bg-white", "weight": 0.994, "styles": { ... } }
    ],
    "cssFramework": { "framework": "tailwind" },
    "typography": {
      "scale": 1.125,
      "baseFontSize": 16,
      "fontSizes": [16, 18, 20, 30, 48],
      "primaryFontFamily": "ui-sans-serif, system-ui, sans-serif",
      "primaryFontWeight": "400"
    },
    "accessibility": {
      "accessibleColorPairs": [ { "background": "...", "foreground": "...", "contrast": 21 } ],
      "averageContrast": 21
    },
    "layoutPatterns": {
      "grid": { "grid-template-columns": "234px 234px 234px", "gap": "24px" },
      "flexbox": { "flex-direction": "row", "justify-content": "center" }
    },
    "metadata": {
      "title": "Page Title",
      "url": "https://example.com",
      "extractedAt": "2026-04-29T09:30:00.000Z"
    }
  },
  "content": "# Page Title\n\nExtracted markdown content..."
}
```

**Error responses**

| Status | Reason |
|---|---|
| `400` | Missing or invalid URL |
| `408` | Page load or browser acquisition timed out |
| `500` | Extraction failed (see `message` field) |

---

## Testing

### PowerShell (Windows)

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/extract-theme" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"url": "https://example.com"}'
```

### curl (Linux / macOS / WSL)

```bash
curl -X POST http://localhost:3000/extract-theme \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### curl (Windows CMD)

```cmd
curl -X POST http://localhost:3000/extract-theme -H "Content-Type: application/json" -d "{\"url\": \"https://example.com\"}"
```

---

## Running on WSL (Windows Subsystem for Linux)

Puppeteer requires several system libraries on Linux. Install them with:

```bash
sudo apt-get update && sudo apt-get install -y \
  libgbm1 libasound2 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libdrm2 libxkbcommon0 libxcomposite1 \
  libxdamage1 libxfixes3 libxrandr2 libpango-1.0-0 \
  libcairo2 libnss3 libnspr4 libxss1 libxtst6 \
  fonts-liberation xdg-utils
```

Also ensure `BrowserPool.ts` uses `headless: true` and `--no-sandbox`:

```typescript
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', ...launchArgs],
});
```

---

## How the color extraction works

Colors are extracted as RGB vectors from every DOM element's computed `backgroundColor`, `color`, and `borderColor`. K-means clustering then groups similar values:

1. **Initialize** — select K random centroids (K = 5–8, based on sample count)
2. **Assign** — each color sample maps to the nearest centroid (Euclidean RGB distance)
3. **Update** — recalculate each centroid as the mean of its cluster
4. **Repeat** — until centroid shift < 5 units

The resulting centroids are the dominant color palette.

---

## Architecture

```
Client
  │
  ▼
Express server (stateless REST)
  │
  ├── /health ──────────────────────── instant response
  │
  └── /extract-theme
        │
        ├── validate URL
        ├── acquire browser from pool (round-robin)
        ├── open new page
        ├── goto URL (30s timeout)
        ├── autoScroll (trigger lazy content)
        ├── page.evaluate() ──────────── runs in browser context
        │     ├── extractColorPalette()
        │     ├── extractSemanticTheme()
        │     ├── extractVisualHierarchy()
        │     ├── extractBrandColors()
        │     ├── detectCSSFramework()
        │     ├── extractTypographyScale()
        │     ├── extractAccessibleTheme()
        │     └── extractLayoutPatterns()
        ├── close page (browser stays in pool)
        └── return JSON response
```

---

## Future scope

- Large-scale batch analysis across thousands of URLs
- Dark mode and adaptive theme detection
- ML-based design quality scoring
- Longitudinal trend tracking over time
- Docker container for one-command deployment

---

## Team

Built as a CO-OP Industry Project (Module 2) at Chitkara University.

| Name | Roll No. |
|---|---|
| Gurkunwar Singh | 2210991595 |
| Anshik Singh | 2210991302 |
| Piyush | 2210992038 |

Supervised by **Dr. Lalit Sharma**, Department of CSE, Chitkara University, Punjab.