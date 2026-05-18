# Mountain Pine Beetle Outbreaks

A multi-page static website covering the causes, effects, evidence, and solutions for mountain pine beetle outbreaks in western North American forests.

## Development

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Setup

```bash
npm install
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Serve source files locally on http://localhost:3000 |
| `npm run lint` | Run HTML and CSS linters |
| `npm run lint:html` | Lint all HTML files with htmlhint |
| `npm run lint:css` | Lint styles.css with stylelint |
| `npm run build` | Build minified output to `dist/` |
| `npm run serve` | Serve the `dist/` build on http://localhost:3000 |
| `npm run ci` | Run lint then build (used in CI) |

### Build Output

`npm run build` produces a `dist/` directory with:
- Minified HTML (internal links rewritten to clean URL paths)
- Minified CSS
- Optimized images (`pine-beetle-damage.png` resized to max 1400px)

The `dist/` directory is gitignored.

## Deployment

The site deploys automatically to Vercel when commits are pushed to `main`. The CI/CD pipeline (`.github/workflows/ci.yml`) runs lint → build on every push and PR, and deploys to Vercel only on `main` after a successful build.

### Vercel Setup (one-time)

1. Run `npx vercel login` and authenticate
2. Run `npx vercel link` in the project root — this creates `.vercel/project.json`
3. Add these secrets to GitHub → Settings → Secrets and variables → Actions:
   - `VERCEL_TOKEN` — generate at https://vercel.com/account/tokens
   - `VERCEL_ORG_ID` — the `orgId` value from `.vercel/project.json`
   - `VERCEL_PROJECT_ID` — the `projectId` value from `.vercel/project.json`

### Clean URLs

Pages are accessible without `.html` extensions:

| Path | Page |
|---|---|
| `/` | Home |
| `/problem` | Problem |
| `/causes` | Causes |
| `/effects` | Effects |
| `/evidence` | Data and Evidence |
| `/solutions` | Solutions |
| `/conclusion` | Conclusion and Sources |
