# Portfolio Simple

A clean, minimalist portfolio website built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: React 19.1.0
- **Build Tool**: Vite 5.4.1
- **Language**: TypeScript 5.5.3
- **Styling**: Tailwind CSS 3.4.11
- **UI Components**: Radix UI with shadcn/ui
- **Routing**: React Router DOM 6.26.2
- **Icons**: Lucide React
- **Notifications**: Sonner

## Features

- 🎨 Clean and minimalist design
- 📱 Fully responsive layout
- ♿ Accessible components (Radix UI primitives)
- 🎭 Smooth animations and transitions
- 🚀 Optimized bundle with Vite
- 🖼️ Optimized images with WebP support

## Development

```bash
# Install dependencies
npm install

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
│   ├── portfolio/
│   │   ├── Header.tsx           # Navigation header
│   │   ├── Footer.tsx           # Site footer
│   │   ├── HeroSection.tsx      # Hero section
│   │   ├── AboutSection.tsx     # About section
│   │   ├── ExperienceSection.tsx # Work experience
│   │   ├── SkillsSection.tsx    # Skills showcase
│   │   ├── ProjectsSection.tsx  # Projects gallery
│   │   ├── ContactSection.tsx   # Contact form
│   │   └── OptimizedImage.tsx   # Image optimization component
│   └── ui/                      # Reusable UI components (shadcn/ui)
├── pages/
│   ├── Index.tsx                # Main portfolio page
│   └── NotFound.tsx             # 404 page
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
├── App.tsx                      # App root component
└── main.tsx                     # App entry point
```

## Customization

- **Colors**: Edit `src/index.css` to customize the color scheme
- **Content**: Update component files in `src/components/portfolio/`
- **Styling**: Modify `tailwind.config.ts` for theme customization
- **Routes**: Add new routes in `src/App.tsx`

## Build Output

The production build generates optimized static files in the `dist/` directory, ready for deployment to any static hosting service.

## Performance Optimizations

- WebP image format with JPEG fallbacks
- Responsive images with multiple sizes
- Lazy loading for images
- Preloading of critical assets
- Optimized bundle splitting
