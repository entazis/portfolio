# Portfolio Monorepo

This repository contains multiple versions of my portfolio website, managed as a monorepo.

## Structure

- `apps/nextjs-portfolio/` - Next.js version with internationalization
- `apps/vite-portfolio/` - React + Vite version with modern UI components
- `packages/shared-types/` - Shared TypeScript types
- `packages/shared-data/` - Shared data and content

## Development

```bash
# Install dependencies for all workspaces
npm install

# Run Next.js version
npm run dev:nextjs

# Run Vite version
npm run dev:vite

# Build all applications
npm run build:all

# Clean all node_modules and build artifacts
npm run clean
```

## Deployment

Each application can be deployed independently:

- Next.js version: Optimized for Vercel deployment
- Vite version: Can be deployed to any static hosting service

## Version Switching

Each portfolio version is self-contained but shares common data and types through the shared packages.
