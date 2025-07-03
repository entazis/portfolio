# Portfolio Monorepo

This repository contains multiple versions of my portfolio website, managed as a monorepo.

## Structure

- `apps/nextjs-portfolio/` - Next.js version with internationalization
- `apps/vite-portfolio/` - React + Vite version with optimized dependencies

## Development

```bash
# Install dependencies for all workspaces
npm install

# Development
npm run dev:nextjs          # Start Next.js dev server
npm run dev:vite           # Start Vite dev server

# Production builds
npm run build:all          # Build both applications
npm run build:nextjs       # Build Next.js only
npm run build:vite         # Build Vite only

# Production preview
npm run start:nextjs       # Start Next.js production server
npm run preview:vite       # Preview Vite production build

# Utilities
npm run size              # Show build artifact sizes
npm run lint              # Lint all workspaces
npm run lint:fix          # Fix linting issues
npm run clean             # Clean all dependencies and builds
npm run clean:builds      # Clean build artifacts only
```

## Performance Metrics

- **Next.js Portfolio**: 102kB first load JS, highly optimized
- **Vite Portfolio**: 209kB JS (gzipped: 65kB), 2.6M build size
- **Dependencies**: Optimized from 73 to 34 packages (-53%)
- **Build Times**: NextJS <1s, Vite ~1s

## Deployment

Each application can be deployed independently:

- Next.js version: Optimized for Vercel deployment
- Vite version: Can be deployed to any static hosting service

## Version Switching

Each portfolio version is self-contained but shares common data and types through the shared packages.
