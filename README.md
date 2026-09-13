# Portfolio

Source of [entazis.dev](https://entazis.dev): a clean, minimalist portfolio website built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **UI Components**: Radix UI primitives with shadcn/ui
- **Routing**: React Router DOM 6
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Metrics**: web-vitals, pushed to a Prometheus/Grafana stack (see [docs/README.md](docs/README.md))

## Features

- 🎨 Clean and minimalist design
- 📱 Fully responsive layout
- ♿ Accessible components (Radix UI primitives)
- 🎭 Smooth animations and transitions
- 🚀 Optimized bundle with Vite
- 🖼️ Optimized images with WebP support
- 📊 Privacy-friendly usage and Web Vitals metrics

## Development

```bash
# Install dependencies
npm install

# Optional: local environment overrides
cp .env.example .env

# Start development server (http://localhost:8080)
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── portfolio/               # Page sections (Header, Hero, About, Experience, ...)
│   └── ui/                      # Reusable UI components (shadcn/ui)
├── pages/
│   ├── Index.tsx                # Main portfolio page
│   └── NotFound.tsx             # 404 page
├── hooks/                       # Custom React hooks (metrics, visibility, ...)
├── services/                    # Metrics service
├── lib/                         # Utility functions
├── App.tsx                      # App root component
└── main.tsx                     # App entry point
docs/                            # Metrics setup and test reports
public/                          # Static assets
```

## Customization

- **Colors**: Edit `src/index.css` to customize the color scheme
- **Content**: Update component files in `src/components/portfolio/`
- **Styling**: Modify `tailwind.config.ts` for theme customization
- **Routes**: Add new routes in `src/App.tsx`

## Deployment

`npm run build` writes a static site to `dist/`. Any static host or web server can serve it; in production nginx serves `dist/` directly from this repository.

## Performance Optimizations

- WebP image format with JPEG fallbacks
- Responsive images with multiple sizes
- Lazy loading for images
- Preloading of critical assets
- Optimized bundle splitting

## History

This repository used to be a monorepo holding several portfolio prototypes (a Next.js version and a dark-theme Vite version). Those were retired in September 2026 and only this app remains.
